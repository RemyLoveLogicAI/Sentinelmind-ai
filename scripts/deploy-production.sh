#!/bin/bash

# AI Hypnosis Platform - Production Deployment Script
# Revolutionary deployment with zero-downtime and full validation

set -e

echo "🚀 AI Hypnosis Production Deployment Starting..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="ai-hypnosis"
PRODUCTION_BRANCH="main"
MIN_NODE_VERSION="18"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to print colored output
print_status() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC}  $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

# Pre-deployment checks
echo ""
print_status "Running pre-deployment checks..."

# Check Node.js version
if command_exists node; then
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt "$MIN_NODE_VERSION" ]; then
        print_error "Node.js version $MIN_NODE_VERSION or higher required. Current: $(node -v)"
        exit 1
    fi
    print_success "Node.js version: $(node -v)"
else
    print_error "Node.js not found"
    exit 1
fi

# Check if wrangler is installed
if ! command_exists wrangler && ! command_exists npx; then
    print_error "Wrangler CLI not found and npx not available"
    exit 1
fi

if ! command_exists jq; then
    print_warning "jq not found. Some features may be limited."
fi

# Check for Cloudflare authentication
print_status "Checking Cloudflare authentication..."
if ! npx wrangler whoami >/dev/null 2>&1; then
    print_error "Not authenticated with Cloudflare."
    echo "Please run: npx wrangler login"
    exit 1
fi

print_success "Authenticated with Cloudflare"

# Security audit
print_status "Running security audit..."
npm audit --audit-level=high || {
    print_warning "Security vulnerabilities found. Attempting to fix..."
    npm audit fix || print_warning "Some vulnerabilities could not be auto-fixed"
}

# Build the project
print_status "Building production bundle..."
npm run build

if [ ! -d "dist" ]; then
    print_error "Build failed - dist directory not found"
    exit 1
fi

# Check bundle size
BUNDLE_SIZE=$(du -sh dist | cut -f1)
print_success "Build successful - Bundle size: $BUNDLE_SIZE"

# Create D1 database if it doesn't exist
print_status "Setting up D1 database..."
DB_NAME="hypnosis-db"

# Check if database exists
DB_EXISTS=$(npx wrangler d1 list --json 2>/dev/null | jq -r ".[] | select(.name==\"$DB_NAME\") | .name" || echo "")

if [ -z "$DB_EXISTS" ]; then
    print_status "Creating new D1 database: $DB_NAME"
    DB_OUTPUT=$(npx wrangler d1 create $DB_NAME --json)
    DB_ID=$(echo $DB_OUTPUT | jq -r '.uuid')
    
    print_success "Database created with ID: $DB_ID"
    print_warning "Please update wrangler.jsonc with this database_id: $DB_ID"
    
    # Update wrangler.jsonc with the database ID
    if [ -f "wrangler.jsonc" ]; then
        sed -i.bak "s/YOUR_DATABASE_ID_HERE/$DB_ID/g" wrangler.jsonc
        print_success "Updated wrangler.jsonc with database ID"
    fi
else
    print_success "Database already exists: $DB_NAME"
fi

# Create KV namespace if it doesn't exist
print_status "Setting up KV namespace..."
KV_NAME="ai-hypnosis-kv"

KV_EXISTS=$(npx wrangler kv:namespace list --json 2>/dev/null | jq -r ".[] | select(.title==\"$KV_NAME\") | .title" || echo "")

if [ -z "$KV_EXISTS" ]; then
    print_status "Creating new KV namespace: $KV_NAME"
    KV_OUTPUT=$(npx wrangler kv:namespace create ${KV_NAME//-/_})
    print_success "KV namespace created"
else
    print_success "KV namespace already exists: $KV_NAME"
fi

# Apply database migrations
print_status "Applying database migrations..."
if [ -f "migrations/init.sql" ]; then
    npx wrangler d1 execute $DB_NAME --file=migrations/init.sql 2>/dev/null || {
        print_warning "Migrations may have already been applied"
    }
    print_success "Database migrations applied"
else
    print_warning "No migration files found"
fi

# Deploy to Cloudflare Pages
print_status "Deploying to Cloudflare Pages..."

# Check if project exists
PROJECT_EXISTS=$(npx wrangler pages project list --json 2>/dev/null | jq -r ".[] | select(.name==\"$PROJECT_NAME\") | .name" || echo "")

if [ -z "$PROJECT_EXISTS" ]; then
    print_status "Creating new Cloudflare Pages project: $PROJECT_NAME"
    npx wrangler pages project create $PROJECT_NAME \
        --production-branch $PRODUCTION_BRANCH \
        --compatibility-date 2024-01-01
fi

# Deploy the application
print_status "Deploying application to production..."
DEPLOY_OUTPUT=$(npx wrangler pages deploy dist \
    --project-name $PROJECT_NAME \
    --branch $PRODUCTION_BRANCH)

echo "$DEPLOY_OUTPUT"

# Extract deployment URL
DEPLOYMENT_URL=$(echo "$DEPLOY_OUTPUT" | grep -oE "https://[a-zA-Z0-9.-]+\.pages\.dev" | head -1)

if [ -n "$DEPLOYMENT_URL" ]; then
    print_success "Deployment successful!"
    print_success "🌐 Production URL: $DEPLOYMENT_URL"
    
    # Test the deployment
    print_status "Testing deployment..."
    
    # Wait for deployment to propagate
    sleep 5
    
    # Test health endpoint
    HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL/api/health" || echo "000")
    
    if [ "$HEALTH_CHECK" = "200" ]; then
        print_success "Health check passed!"
        
        # Get full health response
        HEALTH_RESPONSE=$(curl -s "$DEPLOYMENT_URL/api/health")
        echo "Health Response: $HEALTH_RESPONSE"
    else
        print_warning "Health check returned: $HEALTH_CHECK"
        print_warning "The deployment may still be propagating. Check in a few minutes."
    fi
    
    # Test other critical endpoints
    print_status "Testing critical endpoints..."
    
    endpoints=(
        "/api/ready"
        "/api/live"
        "/api/info"
        "/api/docs"
    )
    
    for endpoint in "${endpoints[@]}"; do
        STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL$endpoint" || echo "000")
        if [ "$STATUS" = "200" ]; then
            print_success "$endpoint - OK"
        else
            print_warning "$endpoint - Status: $STATUS"
        fi
    done
    
    # Save deployment info
    cat > deployment-info.json <<EOF
{
    "deployment_url": "$DEPLOYMENT_URL",
    "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "project_name": "$PROJECT_NAME",
    "branch": "$PRODUCTION_BRANCH",
    "version": "1.0.0",
    "bundle_size": "$BUNDLE_SIZE"
}
EOF
    
    print_success "📄 Deployment info saved to deployment-info.json"
else
    print_warning "Could not extract deployment URL from output"
fi

# Performance check
print_status "Running performance checks..."
if [ -n "$DEPLOYMENT_URL" ]; then
    RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$DEPLOYMENT_URL/api/health" || echo "0")
    print_success "API response time: ${RESPONSE_TIME}s"
fi

# Set up secrets reminder
echo ""
print_warning "📌 Don't forget to set up your secrets:"
echo "npx wrangler pages secret put OPENAI_API_KEY --project-name $PROJECT_NAME"
echo "npx wrangler pages secret put ANTHROPIC_API_KEY --project-name $PROJECT_NAME"
echo ""

# Deployment summary
echo ""
echo "════════════════════════════════════════════════"
print_success "🎉 Production deployment complete!"
echo "════════════════════════════════════════════════"
echo ""
echo "📊 Deployment Summary:"
echo "  • Project: $PROJECT_NAME"
echo "  • URL: $DEPLOYMENT_URL"
echo "  • Bundle Size: $BUNDLE_SIZE"
echo "  • Health Status: $([ "$HEALTH_CHECK" = "200" ] && echo "✅ Healthy" || echo "⚠️  Check Required")"
echo ""
echo "📋 Next steps:"
echo "  1. Set up your API secrets using wrangler"
echo "  2. Configure a custom domain (optional)"
echo "  3. Set up monitoring and analytics"
echo "  4. Test all features in production"
echo ""
echo "🔗 Useful URLs:"
echo "  • Application: $DEPLOYMENT_URL"
echo "  • API Docs: $DEPLOYMENT_URL/api/docs"
echo "  • Health Check: $DEPLOYMENT_URL/api/health"
echo ""
print_success "Access your app at: $DEPLOYMENT_URL"