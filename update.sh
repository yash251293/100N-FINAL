#!/bin/bash

# CultureFix Update Script
# This script updates your deployed application with new code changes

set -e

# Configuration
SERVER_USER="${1:-root}"
SERVER_HOST="${2}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Helper functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Validate inputs
if [ -z "$SERVER_HOST" ]; then
    log_error "Usage: ./update.sh [username] <server_ip_or_domain>"
    log_error "Example: ./update.sh root 192.168.1.100"
    exit 1
fi

log_info "Starting update deployment to $SERVER_USER@$SERVER_HOST"

# Create deployment archive
log_info "Creating deployment archive..."
tar -czf culturefix-update.tar.gz \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='.next' \
    --exclude='*.log' \
    --exclude='backend/uploads' \
    backend/ "Final UI/" "Login Signup Landing/"

# Upload to server
log_info "Uploading updated code to server..."
scp culturefix-update.tar.gz $SERVER_USER@$SERVER_HOST:/tmp/

# Execute update on server
log_info "Updating application on server..."
ssh $SERVER_USER@$SERVER_HOST << 'EOF'
    set -e
    
    cd /var/www/culturefix
    
    # Stop applications
    pm2 stop all
    
    # Backup current deployment (keep only last backup)
    rm -rf backup.old
    if [ -d "backup" ]; then
        mv backup backup.old
    fi
    mkdir backup
    cp -r backend "Final UI" "Login Signup Landing" backup/ 2>/dev/null || true
    
    # Extract new code
    tar -xzf /tmp/culturefix-update.tar.gz
    rm /tmp/culturefix-update.tar.gz
    
    # Reinstall dependencies if package.json changed
    cd backend
    if ! diff -q package.json backup/backend/package.json >/dev/null 2>&1; then
        echo "Backend package.json changed, reinstalling dependencies..."
        npm install --production
    fi
    cd ..
    
    cd "Final UI"
    if ! diff -q package.json backup/"Final UI"/package.json >/dev/null 2>&1; then
        echo "Final UI package.json changed, reinstalling dependencies..."
        npm install
    fi
    npm run build
    cd ..
    
    cd "Login Signup Landing"
    if ! diff -q package.json backup/"Login Signup Landing"/package.json >/dev/null 2>&1; then
        echo "Login Signup Landing package.json changed, reinstalling dependencies..."
        npm install
    fi
    npm run build
    cd ..
    
    # Set proper permissions
    chown -R www-data:www-data /var/www/culturefix
    chmod -R 755 /var/www/culturefix
    
    # Restart applications
    pm2 restart all
    
    echo "Update completed successfully!"
EOF

# Cleanup
rm -f culturefix-update.tar.gz

log_info "🎉 Update completed successfully!"
log_info "Check application status: ssh $SERVER_USER@$SERVER_HOST 'pm2 status'" 