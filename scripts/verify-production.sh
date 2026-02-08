#!/bin/bash

# Production Verification Script
# Verify that the application is production-ready

echo "🔍 AI Hypnosis Production Verification"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASS_COUNT=0
FAIL_COUNT=0

check_pass() {
    echo -e "${GREEN}✅ PASS:${NC} $1"
    PASS_COUNT=$((PASS_COUNT + 1))
}

check_fail() {
    echo -e "${RED}❌ FAIL:${NC} $1"
    FAIL_COUNT=$((FAIL_COUNT + 1))
}

check_warn() {
    echo -e "${YELLOW}⚠️  WARN:${NC} $1"
}

# 1. Check dependencies
echo "1. Checking dependencies..."
if [ -d "node_modules" ]; then
    check_pass "Dependencies installed"
else
    check_fail "Dependencies not installed (run: npm install)"
fi

# 2. Check build output
echo ""
echo "2. Checking build output..."
if [ -d "dist" ] && [ -f "dist/_worker.js" ]; then
    BUNDLE_SIZE=$(du -h dist/_worker.js | cut -f1)
    check_pass "Production bundle exists ($BUNDLE_SIZE)"
else
    check_fail "Production bundle not found (run: npm run build)"
fi

# 3. Check configuration files
echo ""
echo "3. Checking configuration files..."

if [ -f "package.json" ]; then
    check_pass "package.json exists"
else
    check_fail "package.json missing"
fi

if [ -f "wrangler.jsonc" ]; then
    check_pass "wrangler.jsonc exists"
    
    # Check if database ID is configured
    if grep -q "YOUR_DATABASE_ID_HERE" wrangler.jsonc; then
        check_warn "Database ID not configured in wrangler.jsonc"
    else
        check_pass "Database ID configured"
    fi
else
    check_fail "wrangler.jsonc missing"
fi

if [ -f "tsconfig.json" ]; then
    check_pass "tsconfig.json exists"
else
    check_fail "tsconfig.json missing"
fi

# 4. Check source files
echo ""
echo "4. Checking source files..."

required_files=(
    "src/index.tsx"
    "src/lib/middleware.ts"
    "src/lib/config.ts"
    "src/lib/hypnosis-engine.ts"
    "src/lib/defense-protocol.ts"
    "src/lib/ai-agent-manager.ts"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        check_pass "$file exists"
    else
        check_fail "$file missing"
    fi
done

# 5. Check database migrations
echo ""
echo "5. Checking database migrations..."
if [ -f "migrations/init.sql" ]; then
    check_pass "Database migration file exists"
else
    check_fail "Database migration file missing"
fi

# 6. Check static files
echo ""
echo "6. Checking static files..."

static_files=(
    "public/manifest.json"
    "public/sw.js"
    "public/static/api-docs.html"
)

for file in "${static_files[@]}"; do
    if [ -f "$file" ]; then
        check_pass "$file exists"
    else
        check_warn "$file missing (optional)"
    fi
done

# 7. Check scripts
echo ""
echo "7. Checking deployment scripts..."
if [ -f "scripts/deploy-production.sh" ] && [ -x "scripts/deploy-production.sh" ]; then
    check_pass "Deployment script exists and is executable"
else
    check_fail "Deployment script missing or not executable"
fi

# 8. Check documentation
echo ""
echo "8. Checking documentation..."

docs=(
    "README.md"
    "DEPLOYMENT.md"
    "PRODUCTION.md"
)

for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
        check_pass "$doc exists"
    else
        check_warn "$doc missing (recommended)"
    fi
done

# 9. Security checks
echo ""
echo "9. Running security checks..."

# Check for .env file (should not be committed)
if [ -f ".env" ]; then
    check_warn ".env file found (ensure it's in .gitignore)"
fi

# Check if .env is in .gitignore
if [ -f ".gitignore" ]; then
    if grep -q "^\.env$" .gitignore; then
        check_pass ".env is in .gitignore"
    else
        check_warn ".env may not be in .gitignore"
    fi
fi

# Check for sensitive files
if [ -f ".env.local" ]; then
    check_warn ".env.local file found"
fi

# 10. Code quality checks
echo ""
echo "10. Running code quality checks..."

# Check for TypeScript errors
if command -v tsc &> /dev/null; then
    if npx tsc --noEmit 2>&1 | grep -q "error"; then
        check_warn "TypeScript errors found"
    else
        check_pass "No TypeScript errors"
    fi
else
    check_warn "TypeScript not available for checking"
fi

# 11. NPM audit
echo ""
echo "11. Running security audit..."
AUDIT_RESULT=$(npm audit --audit-level=high 2>&1 || true)
if echo "$AUDIT_RESULT" | grep -q "found 0 vulnerabilities"; then
    check_pass "No high/critical vulnerabilities"
else
    check_warn "Security vulnerabilities found (run: npm audit)"
fi

# Summary
echo ""
echo "======================================"
echo "📊 Verification Summary"
echo "======================================"
echo -e "${GREEN}Passed: $PASS_COUNT${NC}"
echo -e "${RED}Failed: $FAIL_COUNT${NC}"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
    echo -e "${GREEN}✅ Production verification successful!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Run: ./scripts/deploy-production.sh"
    echo "2. Configure API secrets after deployment"
    echo "3. Set up monitoring and analytics"
    echo ""
    exit 0
else
    echo -e "${RED}❌ Production verification failed!${NC}"
    echo ""
    echo "Please fix the failed checks before deploying."
    echo ""
    exit 1
fi
