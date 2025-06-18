# GitHub Deployment Script for CultureFix
# This script deploys directly from GitHub to your Contabo server

$ServerIP = "109.199.104.47"
$Username = "root"
$Password = "mobiluck"
$GitHubRepo = "https://github.com/yash251293/100N-FINAL.git"

Write-Host "🚀 Starting GitHub deployment to $ServerIP..." -ForegroundColor Green

# Create deployment commands
$DeploymentScript = @"
#!/bin/bash
set -e

echo "📦 Starting CultureFix deployment from GitHub..."

# Update system
echo "🔄 Updating system packages..."
apt update && apt upgrade -y

# Install Node.js LTS
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
apt install -y nodejs nginx postgresql postgresql-contrib git unzip

# Install PM2 globally
echo "📦 Installing PM2..."
npm install -g pm2

# Create project directory
echo "📁 Setting up project directory..."
mkdir -p /var/www/culturefix
cd /var/www/culturefix

# Remove any existing files
rm -rf * .* 2>/dev/null || true

# Clone from GitHub
echo "⬇️ Cloning from GitHub..."
git clone $GitHubRepo .

# Setup PostgreSQL
echo "🗄️ Setting up PostgreSQL..."
systemctl start postgresql
systemctl enable postgresql

# Create database and user
sudo -u postgres psql << 'DBEOF'
DROP DATABASE IF EXISTS culturefix;
DROP USER IF EXISTS culturefix_user;
CREATE USER culturefix_user WITH PASSWORD 'MySecurePassword123!';
CREATE DATABASE culturefix OWNER culturefix_user;
GRANT ALL PRIVILEGES ON DATABASE culturefix TO culturefix_user;
\q
DBEOF

# Setup backend
echo "⚙️ Setting up backend..."
cd backend
npm install --production

# Create environment file
cat > .env << 'ENVEOF'
NODE_ENV=production
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=culturefix
DB_USER=culturefix_user
DB_PASSWORD=MySecurePassword123!
JWT_SECRET=CultureFix2024SecretKey!
ENVEOF

cd ..

# Setup Final UI
echo "🎨 Setting up Final UI..."
cd "Final UI"
npm install
npm run build
cd ..

# Setup Login Signup Landing
echo "🔐 Setting up Login Signup Landing..."
cd "Login Signup Landing"
npm install
npm run build
cd ..

# Create PM2 ecosystem file
echo "🔧 Creating PM2 configuration..."
cat > ecosystem.config.js << 'ECOEOF'
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

# Setup Nginx
echo "🌐 Setting up Nginx..."
cat > /etc/nginx/sites-available/culturefix << 'NGINXEOF'
server {
    listen 80;
    server_name 109.199.104.47;
    
    # Main application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # Auth/Landing pages
    location /auth {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # API endpoints
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
NGINXEOF

# Enable the site
ln -sf /etc/nginx/sites-available/culturefix /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
nginx -t
systemctl reload nginx

# Set proper permissions
echo "🔐 Setting permissions..."
chown -R www-data:www-data /var/www/culturefix
chmod -R 755 /var/www/culturefix

# Stop any existing PM2 processes
pm2 delete all 2>/dev/null || true

# Start applications with PM2
echo "🚀 Starting applications..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "Your CultureFix application is now running at:"
echo "🌐 Frontend: http://109.199.104.47"
echo "🔌 API: http://109.199.104.47/api"
echo "🔐 Auth: http://109.199.104.47/auth"
echo ""
echo "Management commands:"
echo "📊 Check status: pm2 status"
echo "📋 View logs: pm2 logs"
echo "🔄 Restart: pm2 restart all"
"@

# Save the script to a temporary file
$TempScript = [System.IO.Path]::GetTempFileName() + ".sh"
$DeploymentScript | Out-File -FilePath $TempScript -Encoding UTF8

Write-Host "📋 Deployment script created: $TempScript" -ForegroundColor Yellow

# Execute the deployment
Write-Host "🔗 Connecting to server and executing deployment..." -ForegroundColor Green

try {
    # Use SSH to execute the script
    $sshCommand = "scp `"$TempScript`" root@$ServerIP`:/tmp/deploy.sh && ssh root@$ServerIP `"chmod +x /tmp/deploy.sh && /tmp/deploy.sh`""
    
    Write-Host "💫 Executing deployment on server..." -ForegroundColor Cyan
    Write-Host "⏳ This will take several minutes..." -ForegroundColor Yellow
    
    # Note: This will require password input
    Invoke-Expression $sshCommand
}
finally {
    # Clean up
    Remove-Item $TempScript -ErrorAction SilentlyContinue
}

Write-Host "✅ Deployment process initiated!" -ForegroundColor Green 