#!/bin/bash
# ═══════════════════════════════════════════════════════════
# Server Initial Setup Script
# ═══════════════════════════════════════════════════════════
# Run once on the production server (missbizzy-server):
#   ssh missbizzy-server 'bash -s' < scripts/server-setup.sh
#
# Prerequisites:
#   - Docker & Docker Compose installed
#   - User has docker permissions (in docker group)

set -euo pipefail

APP_DIR=~/breakthebox.ch
DOMAIN="web.breakthebox.ch"
EMAIL="admin@breakthebox.ch"  # For Let's Encrypt notifications

echo "=== Break the Box — Server Setup ==="

# 1. Create app directory
mkdir -p "$APP_DIR/nginx/conf.d"
cd "$APP_DIR"

echo "✓ App directory created: $APP_DIR"

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

# 3. Create .env.production if it doesn't exist
if [ ! -f .env.production ]; then
    cat > .env.production <<'ENVEOF'
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
PUBLIC_APP_URL=https://breakthebox.ch
UPLOAD_DIR=/app/uploads
ENVEOF
    echo "✓ Created .env.production — EDIT THIS FILE before continuing!"
    echo "  nano $APP_DIR/.env.production"
    exit 0
fi

echo "✓ .env.production exists"

# 4. Obtain SSL certificate (first time)
if [ ! -d "/etc/letsencrypt/live/$DOMAIN" ]; then
    echo "Obtaining SSL certificate..."

    # Start nginx temporarily for ACME challenge
    # Create a minimal nginx config for cert provisioning
    cat > nginx/conf.d/default.conf <<NGINXEOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 200 'Setting up SSL...';
        add_header Content-Type text/plain;
    }
}
NGINXEOF

    # Minimal nginx.conf
    cat > nginx/nginx.conf <<'MAINNGINX'
worker_processes auto;
events { worker_connections 1024; }
http {
    include /etc/nginx/conf.d/*.conf;
}
MAINNGINX

    docker compose -f docker-compose.prod.yml up -d nginx

    # Request certificate
    docker compose -f docker-compose.prod.yml run --rm certbot \
        certbot certonly --webroot \
        --webroot-path=/var/www/certbot \
        --email "$EMAIL" \
        --agree-tos \
        --no-eff-email \
        -d "$DOMAIN" \
        -d "www.breakthebox.ch"

    docker compose -f docker-compose.prod.yml down

    echo "✓ SSL certificate obtained"
fi

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Next steps:"
echo "  1. Copy nginx configs from your repo to $APP_DIR/nginx/"
echo "  2. Copy docker-compose.prod.yml to $APP_DIR/"
echo "  3. Run: cd $APP_DIR && docker compose -f docker-compose.prod.yml up -d"
echo ""
