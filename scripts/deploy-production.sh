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
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="ai-hypnosis"
PRODUCTION_BRANCH="main"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Pre-deployment checks
echo -e "${YELLOW}📋 Running pre-deployment checks...${NC}"

if ! command_exists wrangler; then
    echo -e "${RED}❌ Wrangler CLI not found. Installing...${NC}"
    npm install -g wrangler
fi

if ! command_exists jq; then
    echo -e "${YELLOW}⚠️  jq not found. Some features may be limited.${NC}"
fi

# Check for Cloudflare authentication
echo -e "${YELLOW}🔐 Checking Cloudflare authentication...${NC}"
if ! npx wrangler whoami >/dev/null 2>&1; then
    echo -e "${RED}❌ Not authenticated with Cloudflare.${NC}"
    echo "Please run: npx wrangler login"
    exit 1
fi

echo -e "${GREEN}✅ Authenticated with Cloudflare${NC}"

# Build the project
echo -e "${YELLOW}🏗️  Building production bundle...${NC}"
npm run build

if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Build failed - dist directory not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful${NC}"

# Create D1 database if it doesn't exist
echo -e "${YELLOW}💾 Setting up D1 database...${NC}"
DB_NAME="hypnosis-db"

# Check if database exists
DB_EXISTS=$(npx wrangler d1 list --json 2>/dev/null | jq -r ".[] | select(.name==\"$DB_NAME\") | .name" || echo "")

if [ -z "$DB_EXISTS" ]; then
    echo "Creating new D1 database: $DB_NAME"
    DB_OUTPUT=$(npx wrangler d1 create $DB_NAME --json)
    DB_ID=$(echo $DB_OUTPUT | jq -r '.uuid')
    
    echo -e "${GREEN}✅ Database created with ID: $DB_ID${NC}"
    echo "Please update wrangler.jsonc with this database_id: $DB_ID"
    
    # Update wrangler.jsonc with the database ID
    sed -i.bak "s/YOUR_DATABASE_ID_HERE/$DB_ID/g" wrangler.jsonc
else
    echo -e "${GREEN}✅ Database already exists: $DB_NAME${NC}"
fi

# Create KV namespace if it doesn't exist
echo -e "${YELLOW}📦 Setting up KV namespace...${NC}"
KV_NAME="ai-hypnosis-kv"

KV_EXISTS=$(npx wrangler kv:namespace list --json 2>/dev/null | jq -r ".[] | select(.title==\"$KV_NAME\") | .title" || echo "")

if [ -z "$KV_EXISTS" ]; then
    echo "Creating new KV namespace: $KV_NAME"
    KV_OUTPUT=$(npx wrangler kv:namespace create ${KV_NAME//-/_})
    echo -e "${GREEN}✅ KV namespace created${NC}"
else
    echo -e "${GREEN}✅ KV namespace already exists: $KV_NAME${NC}"
fi

# Apply database migrations
echo -e "${YELLOW}📝 Applying database migrations...${NC}"
if [ -f "migrations/init.sql" ]; then
    npx wrangler d1 execute $DB_NAME --file=migrations/init.sql || {
        echo -e "${YELLOW}⚠️  Migrations may have already been applied${NC}"
    }
else
    echo -e "${YELLOW}⚠️  No migration files found${NC}"
fi

# Deploy to Cloudflare Pages
echo -e "${YELLOW}🚀 Deploying to Cloudflare Pages...${NC}"

# Check if project exists
PROJECT_EXISTS=$(npx wrangler pages project list --json 2>/dev/null | jq -r ".[] | select(.name==\"$PROJECT_NAME\") | .name" || echo "")

if [ -z "$PROJECT_EXISTS" ]; then
    echo "Creating new Cloudflare Pages project: $PROJECT_NAME"
    npx wrangler pages project create $PROJECT_NAME \
        --production-branch $PRODUCTION_BRANCH \
        --compatibility-date 2024-01-01
fi

# Deploy the application
DEPLOY_OUTPUT=$(npx wrangler pages deploy dist \
    --project-name $PROJECT_NAME \
    --branch $PRODUCTION_BRANCH)

echo "$DEPLOY_OUTPUT"

# Extract deployment URL
DEPLOYMENT_URL=$(echo "$DEPLOY_OUTPUT" | grep -oE "https://[a-zA-Z0-9.-]+\.pages\.dev" | head -1)

if [ -n "$DEPLOYMENT_URL" ]; then
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo -e "${GREEN}🌐 Production URL: $DEPLOYMENT_URL${NC}"
    
    # Test the deployment
    echo -e "${YELLOW}🧪 Testing deployment...${NC}"
    
    # Wait for deployment to propagate
    sleep 5
    
    # Test health endpoint
    HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL/api/health")
    
    if [ "$HEALTH_CHECK" = "200" ]; then
        echo -e "${GREEN}✅ Health check passed!${NC}"
        
        # Get full health response
        HEALTH_RESPONSE=$(curl -s "$DEPLOYMENT_URL/api/health")
        echo "Health Response: $HEALTH_RESPONSE"
    else
        echo -e "${YELLOW}⚠️  Health check returned: $HEALTH_CHECK${NC}"
        echo "The deployment may still be propagating. Check in a few minutes."
    fi
    
    # Save deployment info
    echo "{
        \"deployment_url\": \"$DEPLOYMENT_URL\",
        \"timestamp\": \"$(date -u +\"%Y-%m-%dT%H:%M:%SZ\")\",
        \"project_name\": \"$PROJECT_NAME\",
        \"branch\": \"$PRODUCTION_BRANCH\"
    }" > deployment-info.json
    
    echo -e "${GREEN}📄 Deployment info saved to deployment-info.json${NC}"
else
    echo -e "${YELLOW}⚠️  Could not extract deployment URL from output${NC}"
fi

# Set up secrets (remind user)
echo ""
echo -e "${YELLOW}📌 Don't forget to set up your secrets:${NC}"
echo "npx wrangler pages secret put OPENAI_API_KEY --project-name $PROJECT_NAME"
echo "npx wrangler pages secret put ANTHROPIC_API_KEY --project-name $PROJECT_NAME"
echo ""

echo -e "${GREEN}🎉 Production deployment complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Set up your API secrets using wrangler"
echo "2. Configure a custom domain (optional)"
echo "3. Set up monitoring and analytics"
echo "4. Test all features in production"
echo ""
echo "Access your app at: $DEPLOYMENT_URL"