# Simple Deployment Fix Guide
# Run these commands on the server step by step

Write-Host "=== CultureFix Deployment Fix ===" -ForegroundColor Green
Write-Host "Connect to server with: ssh root@109.199.104.47" -ForegroundColor Cyan
Write-Host "Password: mobiluck" -ForegroundColor Cyan
Write-Host ""

$commands = @(
    "cd /var/www/culturefix",
    "pm2 stop all && pm2 delete all",
    "npm install -g next@latest",
    "cd 'Final UI' && npm install --legacy-peer-deps",
    "npm run build",
    "cd ../",
    "cd 'Login Signup Landing' && npm install --legacy-peer-deps", 
    "npm run build",
    "cd ../backend && npm install",
    "cd /var/www/culturefix",
    "pm2 start ecosystem.config.js --only culturefix-backend",
    "sleep 5",
    "pm2 start ecosystem.config.js --only culturefix-frontend-main",
    "pm2 start ecosystem.config.js --only culturefix-frontend-auth",
    "pm2 save",
    "pm2 status"
)

Write-Host "Copy and paste these commands one by one:" -ForegroundColor Yellow
Write-Host "=============================================" -ForegroundColor White

for ($i = 0; $i -lt $commands.Count; $i++) {
    Write-Host "Step $($i + 1): $($commands[$i])" -ForegroundColor Green
}

Write-Host "=============================================" -ForegroundColor White
Write-Host "After running all commands, check if all services are 'online'" -ForegroundColor Yellow 