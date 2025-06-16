#!/bin/bash

# CultureFix Deployment Script
# This script deploys your full-stack application to a server via SSH

set -e  # Exit on any error

# Configuration
SERVER_USER="${1:-root}"
SERVER_HOST="${2}"
PROJECT_NAME="culturefix"
DEPLOY_PATH="/var/www/$PROJECT_NAME"
BACKEND_PORT=3001
FRONTEND_PORT=3000

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

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
    log_error "Usage: ./deploy.sh [username] <server_ip_or_domain>"
    log_error "Example: ./deploy.sh root 192.168.1.100"
    exit 1
fi

log_info "Starting deployment to $SERVER_USER@$SERVER_HOST"

# Create deployment archive
log_info "Creating deployment archive..."
tar -czf culturefix-deploy.tar.gz \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='.next' \
    --exclude='*.log' \
    --exclude='backend/uploads' \
    backend/ "Final UI/" "Login Signup Landing/"

# Upload to server
log_info "Uploading project to server..."
scp culturefix-deploy.tar.gz $SERVER_USER@$SERVER_HOST:/tmp/

# Execute deployment on server
log_info "Executing deployment on server..."
ssh $SERVER_USER@$SERVER_HOST << 'EOF'
    set -e
    
    # Install required software
    apt update
    apt install -y nodejs npm nginx postgresql postgresql-contrib certbot python3-certbot-nginx
    
    # Install PM2 globally
    npm install -g pm2
    
    # Create project directory
    mkdir -p /var/www/culturefix
    cd /var/www/culturefix
    
    # Extract project
    tar -xzf /tmp/culturefix-deploy.tar.gz
    rm /tmp/culturefix-deploy.tar.gz
    
    # Setup backend
    cd backend
    npm install --production
    
    # Create .env file for backend
    cat > .env << 'ENVEOF'
NODE_ENV=production
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=culturefix
DB_USER=culturefix_user
DB_PASSWORD=your_secure_password_here
JWT_SECRET=your_jwt_secret_here
ENVEOF
    
    cd ..
    
    # Setup Final UI
    cd "Final UI"
    npm install
    npm run build
    cd ..
    
    # Setup Login Signup Landing
    cd "Login Signup Landing"
    npm install
    npm run build
    cd ..
    
    # Set proper permissions
    chown -R www-data:www-data /var/www/culturefix
    chmod -R 755 /var/www/culturefix
    
    echo "Deployment files extracted and configured successfully!"
EOF

# Create PM2 ecosystem file
log_info "Creating PM2 configuration..."
ssh $SERVER_USER@$SERVER_HOST << 'EOF'
    cat > /var/www/culturefix/ecosystem.config.js << 'ECOEOF'
module.exports = {
  apps: [
    {
      name: 'culturefix-backend',
      script: './backend/index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    },
    {
      name: 'culturefix-frontend-main',
      script: 'npm',
      args: 'start',
      cwd: './Final UI',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'culturefix-frontend-auth',
      script: 'npm',
      args: 'start',
      cwd: './Login Signup Landing',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      }
    }
  ]
};
ECOEOF
EOF

# Create Nginx configuration
log_info "Setting up Nginx reverse proxy..."
ssh $SERVER_USER@$SERVER_HOST << 'EOF'
    cat > /etc/nginx/sites-available/culturefix << 'NGINXEOF'
server {
    listen 80;
    server_name your_domain.com www.your_domain.com;
    
    # Main application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Auth/Landing pages
    location /auth {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # API endpoints
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Static files
    location /_next/static {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
NGINXEOF
    
    # Enable the site
    ln -sf /etc/nginx/sites-available/culturefix /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    
    # Test nginx configuration
    nginx -t
    systemctl reload nginx
EOF

# Setup database
log_info "Setting up PostgreSQL database..."
ssh $SERVER_USER@$SERVER_HOST << 'EOF'
    # Start PostgreSQL
    systemctl start postgresql
    systemctl enable postgresql
    
    # Create database and user
    sudo -u postgres psql << 'SQLEOF'
CREATE USER culturefix_user WITH PASSWORD 'your_secure_password_here';
CREATE DATABASE culturefix OWNER culturefix_user;
GRANT ALL PRIVILEGES ON DATABASE culturefix TO culturefix_user;
\q
SQLEOF
    
    echo "Database setup completed!"
EOF

# Start applications with PM2
log_info "Starting applications with PM2..."
ssh $SERVER_USER@$SERVER_HOST << 'EOF'
    cd /var/www/culturefix
    pm2 start ecosystem.config.js
    pm2 save
    pm2 startup
EOF

# Cleanup
log_info "Cleaning up..."
rm -f culturefix-deploy.tar.gz

log_info "🎉 Deployment completed successfully!"
log_info ""
log_info "Next steps:"
log_info "1. Update your domain in /etc/nginx/sites-available/culturefix"
log_info "2. Configure your database credentials in /var/www/culturefix/backend/.env"
log_info "3. Set up SSL with: sudo certbot --nginx -d your_domain.com"
log_info "4. Check application status: ssh $SERVER_USER@$SERVER_HOST 'pm2 status'"
log_info ""
log_info "Your application should be running at:"
log_info "- Frontend: http://$SERVER_HOST"
log_info "- API: http://$SERVER_HOST/api" 