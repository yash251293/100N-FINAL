# CultureFix Deployment Guide

This guide will help you deploy your CultureFix application to a server via SSH.

## Prerequisites

- A Ubuntu/Debian server with root access
- SSH access to your server
- A domain name (optional, can use IP address)

## Option 1: Automated Deployment (Recommended)

### Quick Start
```bash
# Make the deployment script executable
chmod +x deploy.sh

# Run the deployment script
./deploy.sh root YOUR_SERVER_IP
# or with custom username
./deploy.sh your_username YOUR_SERVER_IP
```

### After Automated Deployment
1. SSH into your server and update the database password:
   ```bash
   ssh root@YOUR_SERVER_IP
   cd /var/www/culturefix/backend
   nano .env  # Update DB_PASSWORD and JWT_SECRET
   ```

2. Update your domain in nginx config:
   ```bash
   nano /etc/nginx/sites-available/culturefix
   # Replace "your_domain.com" with your actual domain
   systemctl reload nginx
   ```

3. Set up SSL (if you have a domain):
   ```bash
   sudo certbot --nginx -d your_domain.com
   ```

## Option 2: Manual Deployment

### Step 1: Prepare Your Server

SSH into your server and run these commands:

```bash
# Update system packages
apt update && apt upgrade -y

# Install Node.js (using NodeSource repository for latest LTS)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
apt install -y nodejs

# Install other required packages
apt install -y nginx postgresql postgresql-contrib git

# Install PM2 globally
npm install -g pm2

# Install certbot for SSL (optional)
apt install -y certbot python3-certbot-nginx
```

### Step 2: Setup PostgreSQL Database

```bash
# Start and enable PostgreSQL
systemctl start postgresql
systemctl enable postgresql

# Create database and user
sudo -u postgres psql
```

In PostgreSQL prompt, run:
```sql
CREATE USER culturefix_user WITH PASSWORD 'your_secure_password';
CREATE DATABASE culturefix OWNER culturefix_user;
GRANT ALL PRIVILEGES ON DATABASE culturefix TO culturefix_user;
\q
```

### Step 3: Upload Your Project

From your local machine, create and upload the project:

```bash
# Create deployment archive (run this in your project directory)
tar -czf culturefix-deploy.tar.gz \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='.next' \
    --exclude='*.log' \
    --exclude='backend/uploads' \
    backend/ "Final UI/" "Login Signup Landing/"

# Upload to server
scp culturefix-deploy.tar.gz root@YOUR_SERVER_IP:/tmp/
```

### Step 4: Extract and Setup Project on Server

SSH into your server and run:

```bash
# Create project directory
mkdir -p /var/www/culturefix
cd /var/www/culturefix

# Extract project
tar -xzf /tmp/culturefix-deploy.tar.gz
rm /tmp/culturefix-deploy.tar.gz

# Setup backend
cd backend
npm install --production

# Create environment file
cat > .env << 'EOF'
NODE_ENV=production
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=culturefix
DB_USER=culturefix_user
DB_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_key_here
EOF

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
```

### Step 5: Create PM2 Configuration

```bash
cat > /var/www/culturefix/ecosystem.config.js << 'EOF'
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
```

### Step 6: Configure Nginx

```bash
cat > /etc/nginx/sites-available/culturefix << 'EOF'
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;
    
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
    
    # Static files optimization
    location /_next/static {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/culturefix /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and reload nginx
nginx -t
systemctl reload nginx
```

### Step 7: Start Applications

```bash
cd /var/www/culturefix

# Start all applications with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions from the command output
```

### Step 8: Setup SSL (Optional)

If you have a domain name:

```bash
# Install SSL certificate
certbot --nginx -d your-domain.com

# Auto-renewal (already configured by certbot)
systemctl enable certbot.timer
```

## Management Commands

### Check Application Status
```bash
pm2 status
pm2 logs
pm2 monit
```

### Restart Applications
```bash
pm2 restart all
# or restart specific app
pm2 restart culturefix-backend
```

### Update Code
```bash
# On your local machine, create new archive
tar -czf culturefix-deploy.tar.gz \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='.next' \
    --exclude='*.log' \
    --exclude='backend/uploads' \
    backend/ "Final UI/" "Login Signup Landing/"

# Upload to server
scp culturefix-deploy.tar.gz root@YOUR_SERVER_IP:/tmp/

# On server, extract and restart
cd /var/www/culturefix
pm2 stop all
tar -xzf /tmp/culturefix-deploy.tar.gz
cd "Final UI" && npm run build && cd ..
cd "Login Signup Landing" && npm run build && cd ..
pm2 restart all
```

### View Logs
```bash
# All logs
pm2 logs

# Specific application logs
pm2 logs culturefix-backend
pm2 logs culturefix-frontend-main

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   sudo lsof -i :3000
   sudo lsof -i :3001
   sudo lsof -i :3002
   ```

2. **Database connection errors**
   - Check PostgreSQL status: `systemctl status postgresql`
   - Verify database credentials in `/var/www/culturefix/backend/.env`

3. **Nginx configuration errors**
   ```bash
   nginx -t
   systemctl status nginx
   ```

4. **Application not starting**
   ```bash
   pm2 logs
   cd /var/www/culturefix/backend && npm start
   ```

### Firewall Configuration (if needed)
```bash
# Allow HTTP and HTTPS
ufw allow 80
ufw allow 443
ufw allow ssh
ufw enable
```

## Security Recommendations

1. **Change default passwords** in `.env` file
2. **Setup SSL** with Let's Encrypt
3. **Configure firewall** (UFW)
4. **Regular updates**:
   ```bash
   apt update && apt upgrade -y
   npm update -g pm2
   ```
5. **Backup database** regularly:
   ```bash
   pg_dump -h localhost -U culturefix_user culturefix > backup.sql
   ```

## Support

Your application should now be running at:
- **Frontend**: http://YOUR_SERVER_IP (or https://your-domain.com)
- **API**: http://YOUR_SERVER_IP/api
- **Auth Pages**: http://YOUR_SERVER_IP/auth

For issues, check the logs with `pm2 logs` and `tail -f /var/log/nginx/error.log`. 