# CultureFix Deployment Fix Script
# This script fixes the current deployment issues

$serverHost = "109.199.104.47"
$username = "root"
$password = "mobiluck"

# Create secure string for password
$securePassword = ConvertTo-SecureString $password -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential ($username, $securePassword)

Write-Host "Fixing deployment issues..." -ForegroundColor Green

# Function to run SSH command
function Invoke-SSHCommand {
    param([string]$Command)
    
    Write-Host "Executing: $Command" -ForegroundColor Yellow
    
    # Use plink if available, otherwise use regular ssh
    try {
        $result = echo y | plink -batch -pw $password $username@$serverHost $Command 2>&1
        Write-Host $result
    } catch {
        Write-Host "Plink failed, trying regular SSH..." -ForegroundColor Yellow
        # For regular SSH, we'll create a temporary expect-like script
        $sshScript = @"
spawn ssh $username@$serverHost
expect "password:"
send "$password\r"
expect "$ "
send "$Command\r"
expect "$ "
send "exit\r"
"@
        
        # Write to temp file and execute if expect is available
        $tempFile = [System.IO.Path]::GetTempFileName()
        $sshScript | Out-File -FilePath $tempFile -Encoding ASCII
        
        try {
            expect -f $tempFile
        } catch {
            Write-Host "Please run this command manually on the server:" -ForegroundColor Red
            Write-Host "ssh $username@$serverHost" -ForegroundColor Cyan
            Write-Host "Password: $password" -ForegroundColor Cyan
            Write-Host "Command: $Command" -ForegroundColor Cyan
            Read-Host "Press Enter after running the command manually"
        } finally {
            Remove-Item $tempFile -ErrorAction SilentlyContinue
        }
    }
}

# Stop all PM2 processes
Invoke-SSHCommand "cd /var/www/culturefix && pm2 stop all && pm2 delete all"

# Install Next.js globally
Invoke-SSHCommand "npm install -g next@latest"

# Fix frontend dependencies with legacy peer deps
Invoke-SSHCommand "cd /var/www/culturefix/'Final UI' && npm install --legacy-peer-deps"

# Build frontend
Invoke-SSHCommand "cd /var/www/culturefix/'Final UI' && npm run build"

# Fix auth frontend dependencies
Invoke-SSHCommand "cd /var/www/culturefix/'Login Signup Landing' && npm install --legacy-peer-deps"

# Build auth frontend  
Invoke-SSHCommand "cd /var/www/culturefix/'Login Signup Landing' && npm run build"

# Update backend dependencies
Invoke-SSHCommand "cd /var/www/culturefix/backend && npm install"

# Start backend first
Invoke-SSHCommand "cd /var/www/culturefix && pm2 start ecosystem.config.js --only culturefix-backend"

# Wait a moment
Start-Sleep 5

# Start frontend apps
Invoke-SSHCommand "cd /var/www/culturefix && pm2 start ecosystem.config.js --only culturefix-frontend-main"
Invoke-SSHCommand "cd /var/www/culturefix && pm2 start ecosystem.config.js --only culturefix-frontend-auth"

# Save PM2 config
Invoke-SSHCommand "pm2 save"

# Check status
Invoke-SSHCommand "pm2 status"

Write-Host "Deployment fix completed!" -ForegroundColor Green
Write-Host "Check the status above. If any services are still failing, we'll need to debug further." -ForegroundColor Yellow 