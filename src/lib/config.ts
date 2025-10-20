/**
 * Production configuration and constants
 */

export const CONFIG = {
  // Application
  APP_NAME: 'AI Hypnosis',
  APP_VERSION: '1.0.0',
  
  // Rate Limiting
  RATE_LIMIT: {
    WINDOW_MS: 60 * 1000, // 1 minute
    MAX_REQUESTS: 100, // 100 requests per minute per user
    MAX_REQUESTS_API: 30, // 30 API requests per minute per user
  },
  
  // Caching
  CACHE: {
    SCRIPT_TTL: 3600, // 1 hour
    TECHNIQUE_TTL: 86400, // 24 hours
    PROGRESS_TTL: 300, // 5 minutes
  },
  
  // Timeouts
  TIMEOUT: {
    API_REQUEST: 30000, // 30 seconds
    DATABASE_QUERY: 10000, // 10 seconds
  },
  
  // Limits
  LIMITS: {
    MAX_SCRIPT_LENGTH: 50000, // characters
    MAX_SESSION_DURATION: 7200, // 2 hours in seconds
    MAX_TECHNIQUES_PER_SESSION: 20,
    MAX_EMERGENCY_ACTIVATIONS_PER_DAY: 10,
  },
  
  // Feature Flags
  FEATURES: {
    VOICE_COMMANDS: true,
    EMERGENCY_PROTOCOL: true,
    OFFENSIVE_MODE: true,
    DEFENSIVE_MODE: true,
    PRACTICE_MODE: true,
    ANALYTICS: true,
  },
  
  // Security
  SECURITY: {
    REQUIRE_USER_ID: false, // Allow anonymous usage
    ENABLE_CORS: true,
    ALLOWED_ORIGINS: ['*'], // Configure in production
    MAX_REQUEST_SIZE: 1024 * 1024, // 1MB
  },
} as const

/**
 * Environment-specific configuration
 */
export function getEnvironmentConfig(env: string) {
  const configs = {
    development: {
      DEBUG: true,
      LOG_LEVEL: 'debug',
      ENABLE_MOCK_AI: true,
    },
    production: {
      DEBUG: false,
      LOG_LEVEL: 'error',
      ENABLE_MOCK_AI: false,
    },
    test: {
      DEBUG: true,
      LOG_LEVEL: 'warn',
      ENABLE_MOCK_AI: true,
    },
  }
  
  return configs[env as keyof typeof configs] || configs.production
}

/**
 * Validate environment variables
 */
export function validateEnvironment(env: any): string[] {
  const errors: string[] = []
  
  if (!env.DB) {
    errors.push('DB binding is not configured')
  }
  
  if (!env.KV) {
    errors.push('KV binding is not configured')
  }
  
  // API keys are optional for basic functionality
  if (!env.AI_API_KEY && !env.OPENAI_API_KEY) {
    console.warn('Warning: No AI API keys configured. AI features will use mock responses.')
  }
  
  return errors
}
