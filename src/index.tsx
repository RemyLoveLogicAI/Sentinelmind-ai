/**
 * AI Hypnosis - Revolutionary Hypnotism App
 * Advanced AI-powered hypnosis platform with offensive and defensive capabilities
 * Built by LoveLogicAI for cognitive automation excellence
 */

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { serveStatic } from 'hono/cloudflare-workers'
import { HypnosisEngine } from './lib/hypnosis-engine'
import { AIAgentManager } from './lib/ai-agent-manager'
import { DefenseProtocol } from './lib/defense-protocol'
import { TechniqueDatabase } from './lib/technique-database'
import { 
  securityHeaders, 
  rateLimit, 
  validateRequest, 
  errorHandler, 
  requestLogger,
  ensureDatabase 
} from './lib/middleware'
import { CONFIG, validateEnvironment } from './lib/config'

type Bindings = {
  DB: D1Database;
  KV: KVNamespace;
  AI_API_KEY: string;
  OPENAI_API_KEY?: string;
}

type Variables = {
  userId?: string;
  sessionId?: string;
}

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

// Global error handler
app.use('*', errorHandler())

// Security headers for all requests
app.use('*', securityHeaders())

// Request logging and monitoring
app.use('*', requestLogger())

// Enable CORS for API access
app.use('/api/*', cors({
  origin: CONFIG.SECURITY.ALLOWED_ORIGINS,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-User-Id', 'X-Session-Id'],
  credentials: false,
}))

// Add request validation
app.use('/api/*', validateRequest())

// Rate limiting for API endpoints
app.use('/api/*', rateLimit({
  windowMs: CONFIG.RATE_LIMIT.WINDOW_MS,
  maxRequests: CONFIG.RATE_LIMIT.MAX_REQUESTS_API
}))

// Add logging middleware
app.use('*', logger())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))
app.use('/samples/*', serveStatic({ root: './public' }))

// Session middleware
app.use('/api/*', async (c, next) => {
  const sessionId = c.req.header('X-Session-Id') || crypto.randomUUID()
  const userId = c.req.header('X-User-Id')
  
  c.set('sessionId', sessionId)
  c.set('userId', userId)
  
  await next()
})

// Initialize database on first request
app.use('/api/*', ensureDatabase())

app.use('/api/*', async (c, next) => {
  const { DB } = c.env
  
  // Validate environment configuration
  const envErrors = validateEnvironment(c.env)
  if (envErrors.length > 0) {
    console.error('Environment validation errors:', envErrors)
  }
  
  // Create tables if they don't exist (with error handling)
  try {
    await DB.prepare(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        type TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        data TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run()
    
    await DB.prepare(`
      CREATE TABLE IF NOT EXISTS techniques (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        script TEXT,
        difficulty TEXT,
        effectiveness_rating REAL DEFAULT 0,
        usage_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run()
    
    await DB.prepare(`
      CREATE TABLE IF NOT EXISTS user_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        technique_id INTEGER,
        session_id TEXT,
        success_rate REAL,
        notes TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (technique_id) REFERENCES techniques(id)
      )
    `).run()
    
    await DB.prepare(`
      CREATE TABLE IF NOT EXISTS defense_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        attack_type TEXT,
        defense_used TEXT,
        success BOOLEAN,
        details TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run()
    
    await DB.prepare(`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        event_type TEXT NOT NULL,
        event_data TEXT,
        session_id TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run()
  } catch (error) {
    console.error('Database initialization error:', error)
    // Continue anyway - tables may already exist
  }
  
  await next()
})

// ================== CORE HYPNOSIS APIS ==================

// Generate hypnotic script
app.post('/api/hypnosis/generate-script', async (c) => {
  const { DB, KV, AI_API_KEY } = c.env
  const { type, goal, intensity, customization } = await c.req.json()
  
  try {
    const engine = new HypnosisEngine(AI_API_KEY)
    const script = await engine.generateScript({
      type, // 'induction', 'deepener', 'suggestion', 'emergence'
      goal,
      intensity: intensity || 'medium',
      customization
    })
    
    // Store in database
    const result = await DB.prepare(`
      INSERT INTO techniques (category, name, description, script, difficulty)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      type,
      `Custom: ${goal}`,
      customization?.description || goal,
      JSON.stringify(script),
      intensity
    ).run()
    
    // Cache in KV for quick access
    await KV.put(`script:${result.meta.last_row_id}`, JSON.stringify(script), {
      expirationTtl: 3600 // 1 hour cache
    })
    
    return c.json({
      success: true,
      scriptId: result.meta.last_row_id,
      script
    })
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// Offensive hypnosis techniques
app.post('/api/hypnosis/offensive/execute', async (c) => {
  const { AI_API_KEY, DB } = c.env
  const sessionId = c.get('sessionId')
  const { technique, target, parameters } = await c.req.json()
  
  try {
    const agentManager = new AIAgentManager(AI_API_KEY)
    const offensiveAgent = await agentManager.getAgent('offensive')
    
    const result = await offensiveAgent.execute({
      technique, // 'rapid_induction', 'covert_induction', 'embedded_command', 'confusion_technique'
      target,
      parameters,
      sessionId
    })
    
    // Log the session
    await DB.prepare(`
      INSERT INTO sessions (id, user_id, type, status, data)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      sessionId,
      c.get('userId'),
      'offensive',
      'active',
      JSON.stringify(result)
    ).run()
    
    return c.json({
      success: true,
      sessionId,
      result
    })
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// Defensive hypnosis detection and counter
app.post('/api/hypnosis/defensive/analyze', async (c) => {
  const { AI_API_KEY, DB } = c.env
  const { input, context, mode } = await c.req.json()
  
  try {
    const defense = new DefenseProtocol(AI_API_KEY)
    const analysis = await defense.analyze({
      input, // text, audio URL, or conversation history
      context,
      mode: mode || 'auto' // 'aggressive', 'passive', 'auto'
    })
    
    // Log defense action
    if (analysis.threatDetected) {
      await DB.prepare(`
        INSERT INTO defense_logs (user_id, attack_type, defense_used, success, details)
        VALUES (?, ?, ?, ?, ?)
      `).bind(
        c.get('userId'),
        analysis.attackType,
        analysis.defenseStrategy,
        true,
        JSON.stringify(analysis)
      ).run()
    }
    
    return c.json({
      success: true,
      analysis
    })
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// Core command handler - "They got me" protocol
app.post('/api/hypnosis/emergency-protocol', async (c) => {
  const { AI_API_KEY, DB, KV } = c.env
  const userId = c.get('userId')
  
  try {
    const defense = new DefenseProtocol(AI_API_KEY)
    const protocol = await defense.initiateEmergencyProtocol()
    
    // Store emergency session
    await KV.put(`emergency:${userId}:${Date.now()}`, JSON.stringify({
      timestamp: new Date().toISOString(),
      protocol,
      userId
    }), { expirationTtl: 86400 }) // 24 hour retention
    
    return c.json({
      success: true,
      message: "Full protocol initiated. You're safe now, homie.",
      protocol
    })
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// Practice mode with AI agents
app.post('/api/practice/start-session', async (c) => {
  const { AI_API_KEY, DB } = c.env
  const { mode, difficulty, agentType } = await c.req.json()
  const sessionId = crypto.randomUUID()
  
  try {
    const agentManager = new AIAgentManager(AI_API_KEY)
    const practiceAgent = await agentManager.createPracticeAgent({
      type: agentType, // 'susceptible', 'resistant', 'offensive'
      difficulty: difficulty || 'medium',
      adaptiveLearning: true
    })
    
    // Initialize practice session
    await DB.prepare(`
      INSERT INTO sessions (id, user_id, type, status, data)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      sessionId,
      c.get('userId'),
      `practice_${mode}`,
      'active',
      JSON.stringify({ agentType, difficulty })
    ).run()
    
    return c.json({
      success: true,
      sessionId,
      agent: practiceAgent.getProfile(),
      instructions: practiceAgent.getInstructions()
    })
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// Technique database endpoints
app.get('/api/techniques/library', async (c) => {
  const { DB } = c.env
  const { category, difficulty } = c.req.query()
  
  let query = 'SELECT * FROM techniques WHERE 1=1'
  const params = []
  
  if (category) {
    query += ' AND category = ?'
    params.push(category)
  }
  
  if (difficulty) {
    query += ' AND difficulty = ?'
    params.push(difficulty)
  }
  
  query += ' ORDER BY effectiveness_rating DESC, usage_count DESC'
  
  const result = await DB.prepare(query).bind(...params).all()
  
  return c.json({
    success: true,
    techniques: result.results
  })
})

// User progress tracking
app.get('/api/progress/stats', async (c) => {
  const { DB } = c.env
  const userId = c.get('userId')
  
  if (!userId) {
    return c.json({ success: false, error: 'User ID required' }, 400)
  }
  
  const stats = await DB.prepare(`
    SELECT 
      COUNT(*) as total_sessions,
      AVG(success_rate) as avg_success_rate,
      MAX(timestamp) as last_session
    FROM user_progress
    WHERE user_id = ?
  `).bind(userId).first()
  
  const defenseStats = await DB.prepare(`
    SELECT 
      COUNT(*) as total_defenses,
      SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as successful_defenses,
      COUNT(DISTINCT attack_type) as unique_attacks_faced
    FROM defense_logs
    WHERE user_id = ?
  `).bind(userId).first()
  
  return c.json({
    success: true,
    stats: {
      practice: stats,
      defense: defenseStats
    }
  })
})

// Voice analysis endpoint
app.post('/api/analyze/voice', async (c) => {
  const { AI_API_KEY } = c.env
  const formData = await c.req.formData()
  const audioFile = formData.get('audio') as File
  
  if (!audioFile) {
    return c.json({ success: false, error: 'Audio file required' }, 400)
  }
  
  try {
    // Convert audio to base64 for analysis
    const buffer = await audioFile.arrayBuffer()
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(buffer)))
    
    const defense = new DefenseProtocol(AI_API_KEY)
    const analysis = await defense.analyzeVoice(base64Audio)
    
    return c.json({
      success: true,
      analysis
    })
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// Core commands API
app.post('/api/command/:command', async (c) => {
  const { AI_API_KEY, DB, KV } = c.env
  const command = c.req.param('command')
  const { context, data } = await c.req.json()
  
  const commands = {
    'analyze-moment': async () => {
      const defense = new DefenseProtocol(AI_API_KEY)
      return await defense.analyzeMoment(context)
    },
    'ground-me': async () => {
      const defense = new DefenseProtocol(AI_API_KEY)
      return await defense.groundingProtocol()
    },
    'scramble-this': async () => {
      const defense = new DefenseProtocol(AI_API_KEY)
      return await defense.scrambleNLP(data)
    },
    'update-case-file': async () => {
      await KV.put(`case:${c.get('userId')}:${Date.now()}`, JSON.stringify(data))
      return { success: true, message: 'Case file updated' }
    },
    'extract-what-matters': async () => {
      const defense = new DefenseProtocol(AI_API_KEY)
      return await defense.extractKeyEvidence(context)
    }
  }
  
  const handler = commands[command]
  if (!handler) {
    return c.json({ success: false, error: 'Unknown command' }, 400)
  }
  
  try {
    const result = await handler()
    return c.json({ success: true, result })
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// Main app interface
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en" class="dark">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI Hypnosis - Revolutionary Hypnotism Platform</title>
        <meta name="description" content="AI-powered hypnosis platform with offensive, defensive, and practice capabilities">
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script>
          tailwind.config = {
            darkMode: 'class',
            theme: {
              extend: {
                colors: {
                  'hypno-purple': '#8B5CF6',
                  'hypno-blue': '#3B82F6',
                  'hypno-dark': '#1F2937',
                  'defense-red': '#EF4444',
                  'success-green': '#10B981'
                }
              }
            }
          }
        </script>
        <link href="/static/styles.css" rel="stylesheet">
    </head>
    <body class="bg-gray-900 text-gray-100">
        <div id="app" class="min-h-screen">
            <!-- React/Vue app will mount here -->
            <div class="flex items-center justify-center min-h-screen">
                <div class="text-center">
                    <div class="mb-8">
                        <i class="fas fa-brain text-6xl text-hypno-purple animate-pulse"></i>
                    </div>
                    <h1 class="text-4xl font-bold mb-4 bg-gradient-to-r from-hypno-purple to-hypno-blue bg-clip-text text-transparent">
                        AI Hypnosis
                    </h1>
                    <p class="text-gray-400 mb-8">Revolutionary Hypnotism Platform</p>
                    <div class="space-y-4">
                        <button onclick="initializeApp()" class="px-6 py-3 bg-hypno-purple hover:bg-purple-700 rounded-lg transition-all transform hover:scale-105">
                            <i class="fas fa-power-off mr-2"></i>
                            Initialize System
                        </button>
                        <div class="text-sm text-gray-500">
                            Say "They got me" to activate emergency protocol
                        </div>
                    </div>
                    <div class="mt-8 text-xs text-gray-600">
                        Version ${CONFIG.APP_VERSION} | <a href="/api/health" class="text-hypno-blue hover:underline">System Health</a>
                    </div>
                </div>
            </div>
        </div>
        
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
})

// 404 handler
app.notFound((c) => {
  if (c.req.path.startsWith('/api/')) {
    return c.json({
      success: false,
      error: 'Endpoint not found',
      path: c.req.path,
      availableEndpoints: [
        '/api/health',
        '/api/ready',
        '/api/live',
        '/api/info',
        '/api/hypnosis/generate-script',
        '/api/hypnosis/offensive/execute',
        '/api/hypnosis/defensive/analyze',
        '/api/hypnosis/emergency-protocol',
        '/api/practice/start-session',
        '/api/techniques/library',
        '/api/progress/stats'
      ]
    }, 404)
  }
  
  return c.html(`
    <!DOCTYPE html>
    <html lang="en" class="dark">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>404 - Page Not Found | AI Hypnosis</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-900 text-gray-100 min-h-screen flex items-center justify-center">
        <div class="text-center">
            <i class="fas fa-exclamation-triangle text-6xl text-yellow-500 mb-4"></i>
            <h1 class="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <p class="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
            <a href="/" class="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg inline-block">
                <i class="fas fa-home mr-2"></i>
                Return Home
            </a>
        </div>
    </body>
    </html>
  `, 404)
})

// Error handler
app.onError((error, c) => {
  console.error('Application error:', error)
  
  if (c.req.path.startsWith('/api/')) {
    return c.json({
      success: false,
      error: error.message || 'An internal error occurred',
      timestamp: new Date().toISOString()
    }, 500)
  }
  
  return c.html(`
    <!DOCTYPE html>
    <html lang="en" class="dark">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>500 - Server Error | AI Hypnosis</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-900 text-gray-100 min-h-screen flex items-center justify-center">
        <div class="text-center max-w-lg">
            <i class="fas fa-times-circle text-6xl text-red-500 mb-4"></i>
            <h1 class="text-4xl font-bold mb-4">500 - Server Error</h1>
            <p class="text-gray-400 mb-8">Something went wrong on our end. Please try again later.</p>
            <div class="space-x-4">
                <a href="/" class="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg inline-block">
                    <i class="fas fa-home mr-2"></i>
                    Return Home
                </a>
                <a href="/api/health" class="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg inline-block">
                    <i class="fas fa-heartbeat mr-2"></i>
                    Check System Health
                </a>
            </div>
        </div>
    </body>
    </html>
  `, 500)
})

// Health check endpoint with detailed status
app.get('/api/health', async (c) => {
  const startTime = Date.now()
  const health: any = {
    status: 'operational',
    version: CONFIG.APP_VERSION,
    timestamp: new Date().toISOString(),
    checks: {}
  }
  
  // Check database
  try {
    await c.env.DB.prepare('SELECT 1').first()
    health.checks.database = { status: 'ok', responseTime: Date.now() - startTime }
  } catch (error) {
    health.checks.database = { status: 'error', error: 'Database unavailable' }
    health.status = 'degraded'
  }
  
  // Check KV
  try {
    await c.env.KV.get('health_check')
    health.checks.kv = { status: 'ok' }
  } catch (error) {
    health.checks.kv = { status: 'error', error: 'KV unavailable' }
    health.status = 'degraded'
  }
  
  // Check AI API (optional)
  health.checks.ai = {
    status: c.env.AI_API_KEY || c.env.OPENAI_API_KEY ? 'configured' : 'not_configured',
    note: 'AI features will use mock responses if not configured'
  }
  
  health.responseTime = Date.now() - startTime
  
  return c.json(health, health.status === 'operational' ? 200 : 503)
})

// Readiness check for load balancers
app.get('/api/ready', async (c) => {
  try {
    await c.env.DB.prepare('SELECT 1').first()
    return c.json({ ready: true })
  } catch (error) {
    return c.json({ ready: false }, 503)
  }
})

// Liveness check
app.get('/api/live', (c) => {
  return c.json({ alive: true })
})

// Version and info endpoint
app.get('/api/info', (c) => {
  return c.json({
    name: CONFIG.APP_NAME,
    version: CONFIG.APP_VERSION,
    features: CONFIG.FEATURES,
    limits: CONFIG.LIMITS,
    documentation: '/api/docs'
  })
})

export default app