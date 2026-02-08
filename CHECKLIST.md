# Production Deployment Checklist

## Pre-Deployment

### Environment Setup
- [ ] Cloudflare account created
- [ ] Wrangler CLI installed and authenticated (`npx wrangler login`)
- [ ] Node.js 18+ installed
- [ ] Repository cloned locally

### Configuration
- [ ] Review `wrangler.jsonc` settings
- [ ] Review `src/lib/config.ts` for rate limits and features
- [ ] Check `.gitignore` includes sensitive files
- [ ] Review CORS settings in `CONFIG.SECURITY.ALLOWED_ORIGINS`

### Code Quality
- [ ] All tests pass (if applicable)
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] Security audit clean (`npm audit`)
- [ ] Code reviewed and approved

## Deployment

### Build & Verify
- [ ] Run `npm install` to ensure dependencies are up to date
- [ ] Run `npm run build` to create production bundle
- [ ] Run `./scripts/verify-production.sh` to verify production readiness
- [ ] Check bundle size is acceptable (< 100KB)

### Database Setup
- [ ] D1 database created (`npx wrangler d1 create hypnosis-db`)
- [ ] Database ID added to `wrangler.jsonc`
- [ ] Migrations applied (`npx wrangler d1 execute hypnosis-db --file=migrations/init.sql`)
- [ ] Database tables verified

### KV Setup
- [ ] KV namespace created (`npx wrangler kv:namespace create ai_hypnosis_kv`)
- [ ] KV namespace ID added to `wrangler.jsonc`

### Deploy
- [ ] Run `./scripts/deploy-production.sh`
- [ ] Verify deployment URL is accessible
- [ ] Check health endpoint: `https://your-app.pages.dev/api/health`

## Post-Deployment

### Secrets Configuration
- [ ] Set OPENAI_API_KEY (optional): `npx wrangler pages secret put OPENAI_API_KEY --project-name ai-hypnosis`
- [ ] Set ANTHROPIC_API_KEY (optional): `npx wrangler pages secret put ANTHROPIC_API_KEY --project-name ai-hypnosis`
- [ ] Set GOOGLE_AI_API_KEY (optional): `npx wrangler pages secret put GOOGLE_AI_API_KEY --project-name ai-hypnosis`
- [ ] Set SENTRY_DSN (optional): `npx wrangler pages secret put SENTRY_DSN --project-name ai-hypnosis`

### Verification
- [ ] Health check returns 200: `/api/health`
- [ ] Readiness check works: `/api/ready`
- [ ] Info endpoint accessible: `/api/info`
- [ ] API docs load: `/api/docs`
- [ ] Homepage loads correctly: `/`
- [ ] 404 page works: `/nonexistent`

### Functional Testing
- [ ] Generate hypnotic script works
- [ ] Defensive analysis works
- [ ] Emergency protocol works
- [ ] Practice mode works
- [ ] Technique library accessible
- [ ] Progress tracking works

### Performance Testing
- [ ] Response time < 500ms for API calls
- [ ] Health check < 100ms
- [ ] No errors in browser console
- [ ] PWA installs correctly
- [ ] Service worker activates

### Monitoring Setup
- [ ] Cloudflare Analytics enabled
- [ ] Error tracking configured (if using Sentry)
- [ ] Log monitoring set up
- [ ] Alerts configured for critical issues

### Security Verification
- [ ] Security headers present (check DevTools)
- [ ] CSP policy working
- [ ] Rate limiting functional (test with multiple requests)
- [ ] CORS configured correctly
- [ ] No sensitive data in responses
- [ ] HTTPS enforced

### Documentation
- [ ] Update README.md with production URL
- [ ] Document any custom configuration
- [ ] Update DEPLOYMENT.md if needed
- [ ] Create runbook for common issues

## Optional Enhancements

### Custom Domain
- [ ] Domain purchased and configured
- [ ] DNS CNAME record added
- [ ] Custom domain added to Cloudflare Pages
- [ ] SSL certificate active
- [ ] Update CORS origins with custom domain

### Analytics
- [ ] Google Analytics or alternative integrated
- [ ] Conversion tracking set up
- [ ] User flow analytics configured

### Advanced Monitoring
- [ ] Uptime monitoring (UptimeRobot, Better Uptime)
- [ ] Performance monitoring (Lighthouse CI)
- [ ] User session recording (Hotjar, LogRocket)
- [ ] Error tracking (Sentry)

### Backup & Recovery
- [ ] Database backup schedule created
- [ ] Disaster recovery plan documented
- [ ] Backup restoration tested

### Marketing & Launch
- [ ] Social media announcement prepared
- [ ] Blog post written (if applicable)
- [ ] Demo video created
- [ ] User documentation complete

## Sign-off

- [ ] Technical lead approval
- [ ] Security review complete
- [ ] Performance benchmarks met
- [ ] Legal/compliance review (if required)

---

**Deployment Date:** _______________

**Deployed By:** _______________

**Production URL:** _______________

**Notes:**
_______________________________________________
_______________________________________________
_______________________________________________

