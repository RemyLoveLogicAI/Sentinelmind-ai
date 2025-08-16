/**
 * PM2 Configuration for AI Hypnosis App
 * Development server configuration
 */

module.exports = {
  apps: [
    {
      name: 'ai-hypnosis',
      script: 'npx',
      args: 'wrangler pages dev dist --d1=hypnosis-db --local --ip 0.0.0.0 --port 3000',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      watch: false, // Wrangler handles hot reload
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_restarts: 3,
      min_uptime: '10s',
      error_file: './logs/error.log',
      out_file: './logs/output.log',
      log_file: './logs/combined.log',
      time: true
    }
  ]
}