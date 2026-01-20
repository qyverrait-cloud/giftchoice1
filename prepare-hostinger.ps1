# PowerShell Script - Hostinger ke liye Files Prepare karne ke liye
# Is script ko run karein: .\prepare-hostinger.ps1

Write-Host "Preparing files for Hostinger deployment..." -ForegroundColor Green
Write-Host ""

# Check if build exists
if (-not (Test-Path ".next")) {
    Write-Host "Build not found! Building project first..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Running npm run build..." -ForegroundColor Cyan
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Build failed! Please fix errors and try again." -ForegroundColor Red
        exit 1
    }
    Write-Host "Build completed!" -ForegroundColor Green
    Write-Host ""
}

# Check if standalone folder exists
if (-not (Test-Path ".next\standalone")) {
    Write-Host "Standalone folder not found!" -ForegroundColor Red
    Write-Host "Make sure next.config.mjs has: output: 'standalone'" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Rebuilding with standalone mode..." -ForegroundColor Cyan
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Build failed!" -ForegroundColor Red
        exit 1
    }
}

Write-Host "Standalone build found!" -ForegroundColor Green
Write-Host ""

# Create deployment folder
$deployFolder = "hostinger-deploy"
if (Test-Path $deployFolder) {
    Write-Host "Cleaning old deployment folder..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $deployFolder
}

New-Item -ItemType Directory -Path $deployFolder -Force | Out-Null
Write-Host "Created deployment folder: $deployFolder" -ForegroundColor Green
Write-Host ""

# Copy standalone folder
Write-Host "Copying standalone files..." -ForegroundColor Cyan
$standaloneDest = Join-Path $deployFolder ".next\standalone"
New-Item -ItemType Directory -Path (Split-Path $standaloneDest -Parent) -Force | Out-Null
Copy-Item -Recurse ".next\standalone" $standaloneDest
Write-Host "  .next\standalone\ copied" -ForegroundColor Green

# Copy static folder
if (Test-Path ".next\static") {
    Write-Host "Copying static files..." -ForegroundColor Cyan
    $staticDest = Join-Path $deployFolder ".next\static"
    New-Item -ItemType Directory -Path (Split-Path $staticDest -Parent) -Force | Out-Null
    Copy-Item -Recurse ".next\static" $staticDest
    Write-Host "  .next\static\ copied" -ForegroundColor Green
}

# Copy public folder
if (Test-Path "public") {
    Write-Host "Copying public files..." -ForegroundColor Cyan
    $publicDest = Join-Path $deployFolder "public"
    Copy-Item -Recurse "public" $publicDest
    Write-Host "  public\ copied" -ForegroundColor Green
}

# Copy package files
Write-Host "Copying package files..." -ForegroundColor Cyan
Copy-Item "package.json" (Join-Path $deployFolder "package.json")
if (Test-Path "package-lock.json") {
    Copy-Item "package-lock.json" (Join-Path $deployFolder "package-lock.json")
}
Write-Host "  package.json copied" -ForegroundColor Green

# Create .htaccess file
Write-Host "Creating .htaccess file..." -ForegroundColor Cyan
$htaccessContent = "RewriteEngine On`r`nRewriteRule ^(.*)$ http://localhost:3000/`$1 [P,L]"
$htaccessPath = Join-Path $deployFolder ".htaccess"
Set-Content -Path $htaccessPath -Value $htaccessContent
Write-Host "  .htaccess created" -ForegroundColor Green

# Create README for deployment
Write-Host "Creating deployment instructions..." -ForegroundColor Cyan
$readmeContent = @"
Hostinger Deployment Files

Files in this folder:

- .next/standalone/ - Next.js standalone build (main files)
- .next/static/ - Static assets
- public/ - Public assets (images, etc.)
- package.json - Dependencies list
- package-lock.json - Lock file
- .htaccess - Apache rewrite rules

Upload Instructions:

1. Upload ALL contents of this folder to public_html on Hostinger
2. Upload node_modules/ folder (from project root) OR run npm install --production on server
3. Create Node.js app in Hostinger panel:
   - App Root: /public_html
   - Start Command: node .next/standalone/server.js
   - Port: 3000
4. Start the app

Detailed Guide:

See HOSTINGER_DEPLOY.md for complete instructions.

Important:

- Make sure Node.js app is running
- Enable Auto Start in Hostinger panel
- Install SSL certificate
- Test website after deployment
"@
$readmePath = Join-Path $deployFolder "README.txt"
Set-Content -Path $readmePath -Value $readmeContent
Write-Host "  README.txt created" -ForegroundColor Green

# Calculate size
$totalSize = (Get-ChildItem -Path $deployFolder -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host ""
Write-Host "Files prepared successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Deployment package size: $([math]::Round($totalSize, 2)) MB" -ForegroundColor Cyan
Write-Host ""
Write-Host "Location: $deployFolder\" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Upload contents of '$deployFolder' folder to Hostinger public_html" -ForegroundColor Cyan
Write-Host "2. Upload 'node_modules' folder OR run 'npm install --production' on server" -ForegroundColor Cyan
Write-Host "3. Create Node.js app in Hostinger panel" -ForegroundColor Cyan
Write-Host "4. Start the app" -ForegroundColor Cyan
Write-Host ""
Write-Host "See HOSTINGER_DEPLOY.md for detailed instructions" -ForegroundColor Yellow
Write-Host ""
