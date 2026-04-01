#!/bin/bash
# ═══════════════════════════════════════════════════════════
# Server Initial Setup Script (Traefik)
# ═══════════════════════════════════════════════════════════
# Run once on the production server (missbizzy-server):
#   ssh missbizzy-server 'bash -s' < scripts/server-setup.sh
#
# Prerequisites:
#   - Docker & Docker Compose installed
#   - Traefik running on n8n_internal network

set -euo pipefail

APP_DIR=~/breakthebox.ch

echo "=== Break the Box — Server Setup ==="

# 1. Create app directory
mkdir -p "$APP_DIR"
cd "$APP_DIR"
echo "✓ App directory: $APP_DIR"

# 2. Log in to GitHub Container Registry
echo ""
echo "Log in to GitHub Container Registry:"
echo "  You need a GitHub Personal Access Token (PAT) with 'read:packages' scope."
echo "  Generate one at: https://github.com/settings/tokens"
echo ""
read -rp "GitHub username: " GH_USER
read -rsp "GitHub PAT: " GH_TOKEN
echo ""
echo "$GH_TOKEN" | docker login ghcr.io -u "$GH_USER" --password-stdin
echo "✓ Logged in to ghcr.io"

# 3. Create .env if it doesn't exist
if [ ! -f .env ]; then
    cat > .env <<'ENVEOF'
# ─── Database ───
DB_NAME=breakthebox
DB_USER=breakthebox
DB_PASSWORD=CHANGE_ME_TO_RANDOM_PASSWORD

# ─── Auth0 OAuth ───
AUTH0_DOMAIN=breakthebox.eu.auth0.com
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=

# ─── AI ───
ANTHROPIC_API_KEY=

# ─── App ───
PUBLIC_APP_URL=https://web.breakthebox.ch
UPLOAD_DIR=/app/uploads
ENVEOF
    echo "✓ Created .env — EDIT THIS FILE before continuing!"
    echo "  nano $APP_DIR/.env"
    exit 0
fi

echo "✓ .env exists"

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Next steps:"
echo "  1. Edit .env with production credentials"
echo "  2. Push to main branch — GitHub Actions will deploy automatically"
echo "  3. Or manually: docker compose -f docker-compose.prod.yml up -d"
echo ""
