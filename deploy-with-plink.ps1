# CultureFix Automated Deployment with Plink
# Make sure plink.exe is in the same folder or in your PATH

$server = "109.199.104.47"
$user = "root"
$pass = "mobiluck"
$plink = "plink.exe"  # Adjust path if needed

# All commands to run on the server
$commands = @(
    "cd /var/www/culturefix",
    "pm2 stop all",
    "pm2 delete all",
    "npm install -g next@latest",
    "cd 'Final UI' && npm install --legacy-peer-deps && npm run build",
    "cd ../'Login Signup Landing' && npm install --legacy-peer-deps && npm run build",
    "cd ../backend && npm install",
    "cd /var/www/culturefix",
    "pm2 start ecosystem.config.js --only culturefix-backend",
    "sleep 5",
    "pm2 start ecosystem.config.js --only culturefix-frontend-main",
    "pm2 start ecosystem.config.js --only culturefix-frontend-auth",
    "pm2 save",
    "pm2 status"
)

Write-Host "Starting automated deployment using Plink..." -ForegroundColor Green

foreach ($cmd in $commands) {
    Write-Host "Running: $cmd" -ForegroundColor Yellow
    & $plink -ssh $user@$server -pw $pass "$cmd"
}

Write-Host "Deployment complete! Check above for any errors." -ForegroundColor Green 