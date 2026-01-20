# PowerShell Script - Git Setup के लिए
# इस script को run करें: .\setup-git.ps1

Write-Host "🔧 Git Setup Script" -ForegroundColor Green
Write-Host ""

# Check if Git is installed
Write-Host "📋 Checking Git installation..." -ForegroundColor Cyan
try {
    $gitVersion = git --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Git is installed: $gitVersion" -ForegroundColor Green
    } else {
        throw "Git not found"
    }
} catch {
    Write-Host "❌ Git is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Git first:" -ForegroundColor Yellow
    Write-Host "1. Visit: https://git-scm.com/download/win" -ForegroundColor Cyan
    Write-Host "2. Download and install Git for Windows" -ForegroundColor Cyan
    Write-Host "3. Restart PowerShell and run this script again" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Or use GitHub Desktop: https://desktop.github.com" -ForegroundColor Cyan
    exit 1
}

Write-Host ""

# Check if already a git repository
if (Test-Path ".git") {
    Write-Host "⚠️  Git repository already initialized!" -ForegroundColor Yellow
    Write-Host "Do you want to continue? (Y/N): " -ForegroundColor Yellow -NoNewline
    $response = Read-Host
    if ($response -ne "Y" -and $response -ne "y") {
        Write-Host "Cancelled." -ForegroundColor Red
        exit 0
    }
} else {
    # Initialize Git
    Write-Host "📦 Initializing Git repository..." -ForegroundColor Cyan
    git init
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Git repository initialized" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to initialize Git repository" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# Check Git user config
Write-Host "👤 Checking Git user configuration..." -ForegroundColor Cyan
$userName = git config --global user.name
$userEmail = git config --global user.email

if ([string]::IsNullOrEmpty($userName) -or [string]::IsNullOrEmpty($userEmail)) {
    Write-Host "⚠️  Git user not configured!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please configure Git user:" -ForegroundColor Yellow
    Write-Host "git config --global user.name `"Your Name`"" -ForegroundColor Cyan
    Write-Host "git config --global user.email `"your.email@example.com`"" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Or configure now? (Y/N): " -ForegroundColor Yellow -NoNewline
    $configure = Read-Host
    if ($configure -eq "Y" -or $configure -eq "y") {
        Write-Host "Enter your name: " -ForegroundColor Yellow -NoNewline
        $name = Read-Host
        Write-Host "Enter your email: " -ForegroundColor Yellow -NoNewline
        $email = Read-Host
        git config --global user.name $name
        git config --global user.email $email
        Write-Host "✅ Git user configured" -ForegroundColor Green
    }
} else {
    Write-Host "✅ Git user configured:" -ForegroundColor Green
    Write-Host "   Name: $userName" -ForegroundColor Gray
    Write-Host "   Email: $userEmail" -ForegroundColor Gray
}

Write-Host ""

# Add all files
Write-Host "📁 Adding files to Git..." -ForegroundColor Cyan
git add .
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Files added to Git" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to add files" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Check if there are changes to commit
$status = git status --porcelain
if ([string]::IsNullOrEmpty($status)) {
    Write-Host "ℹ️  No changes to commit (everything already committed)" -ForegroundColor Yellow
} else {
    # Create initial commit
    Write-Host "💾 Creating initial commit..." -ForegroundColor Cyan
    git commit -m "Initial commit - Gift Choice E-commerce Website"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Initial commit created" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to create commit" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "✅ Git setup complete!" -ForegroundColor Green
Write-Host ""

# Check if remote is already configured
$remote = git remote get-url origin 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "📤 Next Steps:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Create a GitHub repository:" -ForegroundColor Yellow
    Write-Host "   Visit: https://github.com/new" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "2. Add remote and push:" -ForegroundColor Yellow
    Write-Host "   git remote add origin https://github.com/yourusername/gift-choice.git" -ForegroundColor Cyan
    Write-Host "   git branch -M main" -ForegroundColor Cyan
    Write-Host "   git push -u origin main" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "✅ Remote already configured: $remote" -ForegroundColor Green
    Write-Host ""
    Write-Host "To push to GitHub, run:" -ForegroundColor Yellow
    Write-Host "   git push -u origin main" -ForegroundColor Cyan
    Write-Host ""
}

Write-Host "🎉 Ready for Vercel deployment!" -ForegroundColor Green
Write-Host ""

