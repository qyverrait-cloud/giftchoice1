# PowerShell Script - GitHub पर Push करने के लिए
# इस script को run करें: .\push-to-github.ps1

Write-Host "🚀 GitHub Push Script" -ForegroundColor Green
Write-Host ""

# Check if Git is available
Write-Host "📋 Checking Git..." -ForegroundColor Cyan
try {
    $gitVersion = git --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Git is available: $gitVersion" -ForegroundColor Green
    } else {
        throw "Git not found"
    }
} catch {
    Write-Host "❌ Git is not installed!" -ForegroundColor Red
    Write-Host "Please install Git first. Run: .\setup-git.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Check if repository is initialized
if (-not (Test-Path ".git")) {
    Write-Host "❌ Git repository not initialized!" -ForegroundColor Red
    Write-Host "Please run: .\setup-git.ps1 first" -ForegroundColor Yellow
    exit 1
}

# Check current branch
$currentBranch = git branch --show-current
Write-Host "📍 Current branch: $currentBranch" -ForegroundColor Cyan

# Check if remote exists
$remoteUrl = git remote get-url origin 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Remote already configured: $remoteUrl" -ForegroundColor Green
    Write-Host ""
    Write-Host "Do you want to push to existing remote? (Y/N): " -ForegroundColor Yellow -NoNewline
    $pushExisting = Read-Host
    if ($pushExisting -eq "Y" -or $pushExisting -eq "y") {
        Write-Host ""
        Write-Host "📤 Pushing to GitHub..." -ForegroundColor Cyan
        git branch -M main 2>$null
        git push -u origin main
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
            Write-Host ""
            Write-Host "🎉 Your code is now on GitHub!" -ForegroundColor Green
            Write-Host "Next step: Deploy to Vercel" -ForegroundColor Cyan
            exit 0
        } else {
            Write-Host ""
            Write-Host "❌ Push failed. Please check your credentials and try again." -ForegroundColor Red
            exit 1
        }
    }
} else {
    Write-Host "ℹ️  No remote repository configured" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📝 GitHub Repository Setup" -ForegroundColor Cyan
Write-Host ""
Write-Host "Please follow these steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Go to: https://github.com/new" -ForegroundColor Cyan
Write-Host "2. Repository name: gift-choice (or any name)" -ForegroundColor Cyan
Write-Host "3. Choose Public or Private" -ForegroundColor Cyan
Write-Host "4. DO NOT initialize with README (we already have files)" -ForegroundColor Cyan
Write-Host "5. Click 'Create repository'" -ForegroundColor Cyan
Write-Host "6. Copy the repository URL (example: https://github.com/yourusername/gift-choice.git)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Enter your GitHub repository URL: " -ForegroundColor Yellow -NoNewline
$repoUrl = Read-Host

if ([string]::IsNullOrEmpty($repoUrl)) {
    Write-Host "❌ Repository URL is required!" -ForegroundColor Red
    exit 1
}

# Validate URL format
if ($repoUrl -notmatch "^https://github\.com/.*\.git$" -and $repoUrl -notmatch "^git@github\.com:.*\.git$") {
    Write-Host "⚠️  Warning: URL format might be incorrect. Continuing anyway..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔗 Adding remote repository..." -ForegroundColor Cyan
git remote add origin $repoUrl 2>&1 | Out-Null

# If remote already exists, update it
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Remote 'origin' already exists. Updating..." -ForegroundColor Yellow
    git remote set-url origin $repoUrl
}

Write-Host "✅ Remote added: $repoUrl" -ForegroundColor Green

Write-Host ""
Write-Host "📤 Pushing to GitHub..." -ForegroundColor Cyan
Write-Host ""

# Set branch to main
git branch -M main 2>$null

# Push to GitHub
Write-Host "Pushing code to GitHub..." -ForegroundColor Cyan
Write-Host "(You may be prompted for GitHub credentials)" -ForegroundColor Yellow
Write-Host ""

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Your code is now on GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Repository URL: $repoUrl" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🚀 Next Steps:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://vercel.com" -ForegroundColor Cyan
    Write-Host "2. Sign up / Login" -ForegroundColor Cyan
    Write-Host "3. Add New → Project" -ForegroundColor Cyan
    Write-Host "4. Import your GitHub repository" -ForegroundColor Cyan
    Write-Host "5. Deploy!" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Push failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "1. Authentication required - GitHub will prompt for login" -ForegroundColor Cyan
    Write-Host "2. Use Personal Access Token if 2FA is enabled" -ForegroundColor Cyan
    Write-Host "3. Check repository URL is correct" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Try again or push manually:" -ForegroundColor Yellow
    Write-Host "   git push -u origin main" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}

