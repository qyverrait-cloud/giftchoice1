# PowerShell Script - Deployment ZIP बनाने के लिए
# Run: .\create-deploy-zip.ps1

$ErrorActionPreference = "Stop"

Write-Host "Creating deployment ZIP file..." -ForegroundColor Green

# Get current directory
$rootDir = Get-Location
$deployDir = Join-Path $rootDir "deploy-files"
$zipFile = Join-Path $rootDir "website-files.zip"

# Clean up old files
if (Test-Path $deployDir) {
    Remove-Item -Recurse -Force $deployDir
    Write-Host "Old deploy-files folder removed" -ForegroundColor Yellow
}

if (Test-Path $zipFile) {
    Remove-Item -Force $zipFile
    Write-Host "Old ZIP file removed" -ForegroundColor Yellow
}

# Create new folder
New-Item -ItemType Directory -Path $deployDir | Out-Null
Write-Host "Copying essential files..." -ForegroundColor Cyan

# Copy essential folders
$folders = @("app", "components", "hooks", "lib", "public", "styles")
foreach ($folder in $folders) {
    $sourcePath = Join-Path $rootDir $folder
    if (Test-Path $sourcePath) {
        $destPath = Join-Path $deployDir $folder
        Copy-Item -Recurse $sourcePath $destPath
        Write-Host "  $folder/ folder copied" -ForegroundColor Green
    }
}

# Copy essential files
$files = @(
    "package.json",
    "package-lock.json",
    "next.config.mjs",
    "tsconfig.json",
    "postcss.config.mjs",
    "tailwind.config.ts",
    "components.json"
)

foreach ($file in $files) {
    $sourcePath = Join-Path $rootDir $file
    if (Test-Path $sourcePath) {
        $destPath = Join-Path $deployDir $file
        Copy-Item $sourcePath $destPath
        Write-Host "  $file copied" -ForegroundColor Green
    }
}

# Create ZIP
Write-Host "Creating ZIP file..." -ForegroundColor Cyan
$zipPath = Join-Path $deployDir "*"
Compress-Archive -Path $zipPath -DestinationPath $zipFile -Force

# Get file size
$zipSize = (Get-Item $zipFile).Length / 1MB
Write-Host "ZIP file created: website-files.zip ($([math]::Round($zipSize, 2)) MB)" -ForegroundColor Green

# Clean up
Remove-Item -Recurse -Force $deployDir
Write-Host "Cleanup done!" -ForegroundColor Yellow

Write-Host ""
Write-Host "Ready to upload!" -ForegroundColor Green
Write-Host "Upload website-files.zip to Hostinger File Manager" -ForegroundColor Cyan
Write-Host ""
