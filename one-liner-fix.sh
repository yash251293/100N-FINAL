#!/bin/bash

# CultureFix Deployment Fix - All in One
echo "=== Starting CultureFix Deployment Fix ==="

# Navigate to project directory
cd /var/www/culturefix

# Stop and clean PM2 processes
echo "Stopping PM2 processes..."
pm2 stop all
pm2 delete all

# Install Next.js globally
echo "Installing Next.js globally..."
npm install -g next@latest

# Fix Final UI dependencies and build
echo "Fixing Final UI..."
cd "Final UI"
npm install --legacy-peer-deps
npm run build
cd ../

# Fix Login Signup Landing dependencies and build
echo "Fixing Login Signup Landing..."
cd "Login Signup Landing"
npm install --legacy-peer-deps
npm run build
cd ../

# Update backend dependencies
echo "Updating backend..."
cd backend
npm install
cd ../

# Start services with PM2
echo "Starting services..."
pm2 start ecosystem.config.js --only culturefix-backend
sleep 5
pm2 start ecosystem.config.js --only culturefix-frontend-main
pm2 start ecosystem.config.js --only culturefix-frontend-auth

# Save PM2 configuration
pm2 save

# Show status
echo "=== Final Status ==="
pm2 status

echo "=== Fix completed! ===" 