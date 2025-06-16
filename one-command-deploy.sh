#!/bin/bash

# CultureFix GitHub Deployment - Single Command
# Copy and paste this entire block into your SSH session

apt update && apt upgrade -y && \
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - && \
apt install -y nodejs nginx postgresql postgresql-contrib git unzip && \
npm install -g pm2 && \
mkdir -p /var/www/culturefix && \
cd /var/www/culturefix && \
rm -rf * .* 2>/dev/null || true && \
git clone https://github.com/yash251293/100N-FINAL.git . && \
systemctl start postgresql && \
systemctl enable postgresql && \
sudo -u postgres psql -c "DROP DATABASE IF EXISTS culturefix;" && \
sudo -u postgres psql -c "DROP USER IF EXISTS culturefix_user;" && \
sudo -u postgres psql -c "CREATE USER culturefix_user WITH PASSWORD 'MySecurePassword123!';" && \
sudo -u postgres psql -c "CREATE DATABASE culturefix OWNER culturefix_user;" && \
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE culturefix TO culturefix_user;" && \
cd backend && \
npm install --production && \
cat > .env << 'EOF'
NODE_ENV=production
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=culturefix
DB_USER=culturefix_user
DB_PASSWORD=MySecurePassword123!
JWT_SECRET=CultureFix2024SecretKey!
EOF
cd .. && \
cd "Final UI" && \
npm install && \
npm run build && \
cd .. && \
cd "Login Signup Landing" && \
npm install && \
npm run build && \
cd .. && \
cat > ecosystem.config.js << 'EOF'
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
EOF
cat > /etc/nginx/sites-available/culturefix << 'EOF'
server {
    listen 80;
    server_name 109.199.104.47;
    
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
}
EOF
ln -sf /etc/nginx/sites-available/culturefix /etc/nginx/sites-enabled/ && \
rm -f /etc/nginx/sites-enabled/default && \
nginx -t && \
systemctl reload nginx && \
chown -R www-data:www-data /var/www/culturefix && \
chmod -R 755 /var/www/culturefix && \
pm2 delete all 2>/dev/null || true && \
pm2 start ecosystem.config.js && \
pm2 save && \
pm2 startup && \
echo "" && \
echo "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!" && \
echo "" && \
echo "Your CultureFix application is now running at:" && \
echo "🌐 Frontend: http://109.199.104.47" && \
echo "🔌 API: http://109.199.104.47/api" && \
echo "🔐 Auth: http://109.199.104.47/auth" && \
echo "" && \
echo "Management commands:" && \
echo "📊 Check status: pm2 status" && \
echo "📋 View logs: pm2 logs" && \
echo "🔄 Restart: pm2 restart all" 