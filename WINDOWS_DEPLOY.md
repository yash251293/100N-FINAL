# Windows Deployment Guide for CultureFix

Since you're on Windows, here's the **easiest way** to deploy to your Contabo server: **109.199.104.47**

## 🚀 Method 1: Quick SSH Deployment (Recommended)

### Step 1: Connect to Your Server
```bash
ssh root@109.199.104.47
```
- You'll be prompted for the root password (check your Contabo email)
- Type "yes" when asked about the fingerprint

### Step 2: Once Connected, Run These Commands on Your Server:

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js LTS
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
apt install -y nodejs nginx postgresql postgresql-contrib git

# Install PM2
npm install -g pm2

# Create project directory
mkdir -p /var/www/culturefix
cd /var/www/culturefix
```

### Step 3: Upload Your Code
Open a **new PowerShell/Command Prompt** window (keep SSH open) and run:

```powershell
# Create a zip file (run this in your project directory)
Compress-Archive -Path "backend","Final UI","Login Signup Landing" -DestinationPath "culturefix.zip" -Force

# Upload to server (replace with your Contabo root password when prompted)
scp culturefix.zip root@109.199.104.47:/tmp/
```

### Step 4: Back in Your SSH Session, Extract and Setup:

```bash
# Extract the project
cd /var/www/culturefix
unzip /tmp/culturefix.zip
rm /tmp/culturefix.zip

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
DB_PASSWORD=MySecurePassword123!
JWT_SECRET=MyJWTSecret123!
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
```

### Step 5: Setup Database

```bash
# Start PostgreSQL
systemctl start postgresql
systemctl enable postgresql

# Create database and user
sudo -u postgres psql << 'EOF'
CREATE USER culturefix_user WITH PASSWORD 'MySecurePassword123!';
CREATE DATABASE culturefix OWNER culturefix_user;
GRANT ALL PRIVILEGES ON DATABASE culturefix TO culturefix_user;
\q
EOF
```

### Step 6: Create PM2 Configuration

```bash
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
```

### Step 7: Setup Nginx

```bash
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

# Enable the site
ln -sf /etc/nginx/sites-available/culturefix /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and start nginx
nginx -t
systemctl reload nginx
```

### Step 8: Start Your Applications

```bash
# Set permissions
chown -R www-data:www-data /var/www/culturefix
chmod -R 755 /var/www/culturefix

# Start applications with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 🎉 **That's It!**

Your CultureFix application should now be running at:
- **http://109.199.104.47** - Main application
- **http://109.199.104.47/api** - API endpoints
- **http://109.199.104.47/auth** - Auth/Landing pages

## 📋 **Quick Commands for Management:**

```bash
# Check status
pm2 status

# View logs
pm2 logs

# Restart all
pm2 restart all

# Stop all
pm2 stop all
```

## 🔧 **If Something Goes Wrong:**

1. **Check if services are running:**
   ```bash
   pm2 status
   systemctl status nginx
   systemctl status postgresql
   ```

2. **Check logs:**
   ```bash
   pm2 logs
   tail -f /var/log/nginx/error.log
   ```

3. **Restart everything:**
   ```bash
   pm2 restart all
   systemctl restart nginx
   ```

---

## 🚀 **Alternative: Use Git (Even Easier)**

If your code is on GitHub, you can skip the file upload:

```bash
# On your server
cd /var/www/culturefix
git clone https://github.com/yourusername/yourrepo.git .
# Then continue from Step 4 above
```

**Your server IP: 109.199.104.47**
**Remember to check your Contabo email for the root password!** 