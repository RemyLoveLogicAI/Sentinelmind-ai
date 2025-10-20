# Production Deployment Guide - AI Hypnosis Platform

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Build for production
npm run build

# 3. Deploy to Cloudflare
./scripts/deploy-production.sh
```

## 📋 Pre-Deployment Checklist

### Required

- [ ] Node.js 18+ installed
- [ ] Cloudflare account with Wrangler CLI authenticated
- [ ] Review and update `wrangler.jsonc` configuration
- [ ] Review environment variables in `.env.example`

### Recommended

- [ ] Run security audit: `npm audit`
- [ ] Test locally: `npm run build && npm run preview`
- [ ] Review CORS settings in `src/lib/config.ts`
- [ ] Set up monitoring (Sentry, etc.)
- [ ] Configure custom domain (optional)

## 🔐 Environment Setup

### 1. Authenticate with Cloudflare

```bash
npx wrangler login
```

### 2. Create D1 Database

```bash
npx wrangler d1 create hypnosis-db
```

Copy the database ID to `wrangler.jsonc`.

### 3. Create KV Namespace

```bash
npx wrangler kv:namespace create ai_hypnosis_kv
```

Copy the namespace ID to `wrangler.jsonc`.

### 4. Set Environment Secrets

```bash
# AI API Keys (optional - will use mock if not set)
npx wrangler pages secret put OPENAI_API_KEY --project-name ai-hypnosis
npx wrangler pages secret put ANTHROPIC_API_KEY --project-name ai-hypnosis
npx wrangler pages secret put GOOGLE_AI_API_KEY --project-name ai-hypnosis

# Monitoring (optional)
npx wrangler pages secret put SENTRY_DSN --project-name ai-hypnosis
```

## 🏗️ Build Process

### Development Build

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

This creates an optimized bundle in the `dist/` directory.

### Bundle Analysis

```bash
# Check bundle size
du -sh dist

# View files
ls -lh dist
```

## 📦 Deployment

### Automated Deployment

```bash
chmod +x scripts/deploy-production.sh
./scripts/deploy-production.sh
```

The script will:
- ✅ Run pre-deployment checks
- ✅ Security audit
- ✅ Build production bundle
- ✅ Create/verify D1 database
- ✅ Create/verify KV namespace
- ✅ Apply database migrations
- ✅ Deploy to Cloudflare Pages
- ✅ Run health checks
- ✅ Test critical endpoints

### Manual Deployment

```bash
# Build
npm run build

# Deploy
npx wrangler pages deploy dist --project-name ai-hypnosis
```

## 🔍 Post-Deployment Verification

### Health Checks

```bash
# System health
curl https://your-app.pages.dev/api/health

# Readiness
curl https://your-app.pages.dev/api/ready

# Liveness
curl https://your-app.pages.dev/api/live
```

### Test Critical Endpoints

```bash
# Info endpoint
curl https://your-app.pages.dev/api/info

# API Documentation
open https://your-app.pages.dev/api/docs
```

### Performance Testing

```bash
# Response time
curl -w "@curl-format.txt" -o /dev/null -s https://your-app.pages.dev/api/health

# Load testing (with Apache Bench)
ab -n 100 -c 10 https://your-app.pages.dev/api/health
```

## 📊 Monitoring

### Cloudflare Analytics

- Navigate to: Cloudflare Dashboard → Pages → ai-hypnosis → Analytics
- Monitor: Requests, Bandwidth, Errors

### Application Logs

```bash
# View real-time logs
npx wrangler pages deployment tail --project-name ai-hypnosis
```

### Custom Monitoring

The application logs all API requests to the `analytics_events` table:

```sql
SELECT * FROM analytics_events 
ORDER BY timestamp DESC 
LIMIT 100;
```

## 🛡️ Security

### Security Headers

All responses include:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Content-Security-Policy` (comprehensive)
- `Referrer-Policy: strict-origin-when-cross-origin`

### Rate Limiting

- API endpoints: 30 requests/minute per user
- General endpoints: 100 requests/minute per user

### Input Validation

All POST/PUT requests are:
- Validated for Content-Type
- JSON schema validated
- Sanitized for XSS patterns

## 🔄 Database Migrations

### Apply Migrations

```bash
# Production
npx wrangler d1 execute hypnosis-db --file=migrations/init.sql

# Local development
npm run db:migrate:local
```

### Backup Database

```bash
# Export database
npx wrangler d1 export hypnosis-db --output=backup.sql
```

## 🌐 Custom Domain Setup

### 1. Add Custom Domain

```bash
npx wrangler pages domain add ai-hypnosis yourdomain.com
```

### 2. Configure DNS

Add CNAME record:
```
CNAME  @  ai-hypnosis.pages.dev
```

### 3. Update CORS Settings

Edit `src/lib/config.ts`:

```typescript
ALLOWED_ORIGINS: ['https://yourdomain.com']
```

## 📈 Scaling Considerations

### Current Setup
- Cloudflare Pages (global CDN)
- D1 Database (SQLite at edge)
- KV Storage (distributed cache)

### For High Traffic (1000+ users)
- Consider Durable Objects for real-time features
- Implement queue system (Cloudflare Queues)
- Add caching layer (Cloudflare Cache API)
- Multi-region database replication

## 🐛 Troubleshooting

### Deployment Fails

```bash
# Check Wrangler auth
npx wrangler whoami

# Re-authenticate
npx wrangler login

# Check configuration
npx wrangler pages project list
```

### Database Connection Issues

```bash
# Verify database exists
npx wrangler d1 list

# Check database ID in wrangler.jsonc
cat wrangler.jsonc | grep database_id
```

### Build Failures

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Runtime Errors

```bash
# View logs
npx wrangler pages deployment tail --project-name ai-hypnosis

# Check health endpoint
curl https://your-app.pages.dev/api/health
```

## 📚 Additional Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Hono Framework](https://hono.dev/)

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/RemyLoveLogicAI/Sentinelmind-ai/issues)
- **Documentation**: See `README.md` and `DEPLOYMENT.md`
- **API Docs**: Visit `/api/docs` on your deployment

## 📝 Version History

- **v1.0.0** - Initial production release
  - Core hypnosis features
  - Offensive/defensive modes
  - Practice AI agents
  - Emergency protocols
  - Production hardening
  - Security middleware
  - PWA support

---

**Built with 🧠 by LoveLogicAI**
