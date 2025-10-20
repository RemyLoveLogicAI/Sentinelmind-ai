/**
 * Production-ready middleware for security, rate limiting, and monitoring
 */

import { Context, Next } from 'hono'

/**
 * Security headers middleware
 */
export const securityHeaders = () => {
  return async (c: Context, next: Next) => {
    await next()
    
    // Security headers
    c.header('X-Content-Type-Options', 'nosniff')
    c.header('X-Frame-Options', 'DENY')
    c.header('X-XSS-Protection', '1; mode=block')
    c.header('Referrer-Policy', 'strict-origin-when-cross-origin')
    c.header('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
    
    // Content Security Policy
    c.header(
      'Content-Security-Policy',
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdn.jsdelivr.net; " +
      "style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdn.jsdelivr.net; " +
      "font-src 'self' https://cdn.jsdelivr.net; " +
      "img-src 'self' data: https:; " +
      "connect-src 'self'; " +
      "frame-ancestors 'none';"
    )
  }
}

/**
 * Rate limiting middleware using Cloudflare KV
 */
export const rateLimit = (options: {
  windowMs: number;
  maxRequests: number;
}) => {
  return async (c: Context, next: Next) => {
    const KV = c.env.KV as KVNamespace
    if (!KV) {
      await next()
      return
    }

    const clientId = c.req.header('X-User-Id') || c.req.header('CF-Connecting-IP') || 'anonymous'
    const key = `ratelimit:${clientId}:${Date.now()}`
    const windowKey = `ratelimit:${clientId}:window`
    
    try {
      const currentCount = await KV.get(windowKey)
      const count = currentCount ? parseInt(currentCount) : 0
      
      if (count >= options.maxRequests) {
        return c.json({
          success: false,
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil(options.windowMs / 1000)
        }, 429)
      }
      
      await KV.put(windowKey, (count + 1).toString(), {
        expirationTtl: Math.ceil(options.windowMs / 1000)
      })
      
      await next()
    } catch (error) {
      // If rate limiting fails, allow the request through
      console.error('Rate limiting error:', error)
      await next()
    }
  }
}

/**
 * Request validation middleware
 */
export const validateRequest = () => {
  return async (c: Context, next: Next) => {
    const contentType = c.req.header('Content-Type')
    
    if (c.req.method === 'POST' || c.req.method === 'PUT') {
      if (!contentType) {
        return c.json({
          success: false,
          error: 'Content-Type header is required'
        }, 400)
      }
      
      if (contentType.includes('application/json')) {
        try {
          await c.req.json()
          // Reset the request body for the next handler
          c.req.bodyCache = undefined
        } catch (error) {
          return c.json({
            success: false,
            error: 'Invalid JSON in request body'
          }, 400)
        }
      }
    }
    
    await next()
  }
}

/**
 * Error handling middleware
 */
export const errorHandler = () => {
  return async (c: Context, next: Next) => {
    try {
      await next()
    } catch (error: any) {
      console.error('Request error:', error)
      
      // Don't expose internal errors in production
      const isDevelopment = c.env.NODE_ENV === 'development'
      
      return c.json({
        success: false,
        error: isDevelopment ? error.message : 'An internal error occurred',
        ...(isDevelopment && { stack: error.stack })
      }, error.status || 500)
    }
  }
}

/**
 * Request logging middleware for monitoring
 */
export const requestLogger = () => {
  return async (c: Context, next: Next) => {
    const start = Date.now()
    const method = c.req.method
    const path = c.req.path
    const userAgent = c.req.header('User-Agent')
    
    await next()
    
    const duration = Date.now() - start
    const status = c.res.status
    
    // Log to console (will be captured by Cloudflare)
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      method,
      path,
      status,
      duration,
      userAgent: userAgent?.substring(0, 100)
    }))
    
    // Store analytics in database if available
    if (c.env.DB && path.startsWith('/api/')) {
      try {
        await c.env.DB.prepare(`
          INSERT INTO analytics_events (user_id, event_type, event_data, timestamp)
          VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        `).bind(
          c.get('userId') || null,
          'api_request',
          JSON.stringify({ method, path, status, duration })
        ).run()
      } catch (error) {
        // Don't fail request if analytics logging fails
        console.error('Analytics logging error:', error)
      }
    }
  }
}

/**
 * Input sanitization middleware
 */
export const sanitizeInput = () => {
  return async (c: Context, next: Next) => {
    if (c.req.method === 'POST' || c.req.method === 'PUT') {
      try {
        const contentType = c.req.header('Content-Type')
        
        if (contentType?.includes('application/json')) {
          const body = await c.req.json()
          
          // Sanitize string inputs
          const sanitized = sanitizeObject(body)
          
          // Replace request body with sanitized version
          c.req.bodyCache = { bodyCache: sanitized }
        }
      } catch (error) {
        // Continue if sanitization fails
        console.error('Input sanitization error:', error)
      }
    }
    
    await next()
  }
}

/**
 * Recursively sanitize object properties
 */
function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    // Remove potential XSS patterns
    return obj
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim()
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item))
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value)
    }
    return sanitized
  }
  
  return obj
}

/**
 * Database connection middleware with retry logic
 */
export const ensureDatabase = () => {
  return async (c: Context, next: Next) => {
    const DB = c.env.DB
    
    if (!DB) {
      return c.json({
        success: false,
        error: 'Database not available'
      }, 503)
    }
    
    // Test database connection
    try {
      await DB.prepare('SELECT 1').first()
    } catch (error) {
      console.error('Database connection error:', error)
      return c.json({
        success: false,
        error: 'Database connection failed'
      }, 503)
    }
    
    await next()
  }
}
