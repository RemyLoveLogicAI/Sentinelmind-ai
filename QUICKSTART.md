# Quick Start Guide - AI Hypnosis Platform

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- Git installed
- (Optional) Cloudflare account for deployment

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/RemyLoveLogicAI/Sentinelmind-ai.git
cd Sentinelmind-ai

# Install dependencies
npm install
```

### 2. Build & Run Locally

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

The application will be available at `http://localhost:3000`

### 3. Explore the Platform

Open your browser and visit:
- **Homepage:** `http://localhost:3000`
- **API Docs:** `http://localhost:3000/api/docs`
- **Health Check:** `http://localhost:3000/api/health`

## 📖 Key Features to Try

### 1. Generate a Hypnotic Script

```bash
curl -X POST http://localhost:3000/api/hypnosis/generate-script \
  -H "Content-Type: application/json" \
  -d '{
    "type": "induction",
    "goal": "Deep relaxation",
    "intensity": "medium"
  }'
```

### 2. Analyze Text for Hypnotic Patterns

```bash
curl -X POST http://localhost:3000/api/hypnosis/defensive/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "input": "You will feel very relaxed now...",
    "mode": "auto"
  }'
```

### 3. Activate Emergency Protocol

```bash
curl -X POST http://localhost:3000/api/hypnosis/emergency-protocol \
  -H "Content-Type: application/json"
```

## 🏗️ Project Structure

```
Sentinelmind-ai/
├── src/
│   ├── index.tsx              # Main application entry
│   ├── lib/
│   │   ├── config.ts          # Production configuration
│   │   ├── middleware.ts      # Security & rate limiting
│   │   ├── hypnosis-engine.ts # Script generation
│   │   ├── defense-protocol.ts # Threat detection
│   │   ├── ai-agent-manager.ts # Practice agents
│   │   └── monitoring.ts      # Analytics
│   └── renderer.tsx           # Server-side rendering
├── public/
│   ├── static/
│   │   ├── app.js            # Frontend application
│   │   ├── styles.css        # Styling
│   │   └── api-docs.html     # API documentation
│   ├── manifest.json         # PWA manifest
│   └── sw.js                 # Service worker
├── migrations/
│   └── init.sql              # Database schema
├── scripts/
│   ├── deploy-production.sh  # Deployment script
│   └── verify-production.sh  # Verification script
├── package.json              # Dependencies
├── wrangler.jsonc           # Cloudflare config
└── vite.config.ts           # Build config
```

## 🧪 Development Workflow

### Development Mode

```bash
# Start dev server with hot reload
npm run dev
```

### Testing

```bash
# Run verification
./scripts/verify-production.sh

# Test health endpoint
curl http://localhost:3000/api/health

# Security audit
npm audit
```

### Building

```bash
# Production build
npm run build

# Check bundle size
ls -lh dist/
```

## 🔐 Environment Variables

Create a `.env` file (optional):

```env
# AI API Keys (optional - will use mock if not provided)
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
GOOGLE_AI_API_KEY=your_key_here

# Analytics (optional)
SENTRY_DSN=your_dsn_here
ANALYTICS_ID=your_analytics_id
```

## 📚 Documentation

- **API Documentation:** Visit `/api/docs` when running
- **Production Guide:** See [PRODUCTION.md](PRODUCTION.md)
- **Deployment Guide:** See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Full README:** See [README.md](README.md)

## 🚀 Deploy to Production

### Option 1: Automated Deployment

```bash
# Verify production readiness
./scripts/verify-production.sh

# Deploy to Cloudflare Pages
./scripts/deploy-production.sh
```

### Option 2: Manual Deployment

```bash
# 1. Build
npm run build

# 2. Create D1 database
npx wrangler d1 create hypnosis-db

# 3. Update wrangler.jsonc with database ID

# 4. Deploy
npx wrangler pages deploy dist --project-name ai-hypnosis
```

## 🛠️ Common Tasks

### Update Dependencies

```bash
npm update
npm audit fix
```

### Database Operations

```bash
# Apply migrations (local)
npm run db:migrate:local

# Apply migrations (production)
npm run db:migrate:prod

# Reset local database
npm run db:reset
```

### View Logs

```bash
# Local development
npm run logs

# Production
npx wrangler pages deployment tail --project-name ai-hypnosis
```

## 🐛 Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Database Issues

```bash
# Check database exists
npx wrangler d1 list

# Verify database ID in wrangler.jsonc
cat wrangler.jsonc | grep database_id
```

### Port Already in Use

```bash
# Kill process on port 3000
npm run clean-port

# Or manually
lsof -ti:3000 | xargs kill -9
```

## 🎯 Next Steps

1. **Explore Features:** Try the offensive, defensive, and practice modes
2. **Read Documentation:** Check out the comprehensive API docs
3. **Customize:** Modify `src/lib/config.ts` for your needs
4. **Deploy:** Use the deployment scripts to go live
5. **Monitor:** Set up analytics and monitoring
6. **Contribute:** Submit issues or pull requests on GitHub

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/RemyLoveLogicAI/Sentinelmind-ai/issues)
- **Documentation:** See `docs/` folder
- **API Docs:** Visit `/api/docs`

---

**Happy Coding! 🧠✨**

Built with 🧠 by LoveLogicAI
