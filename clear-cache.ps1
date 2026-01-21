# Clear Next.js cache and rebuild
Write-Host "Clearing Next.js cache..." -ForegroundColor Yellow

# Remove .next folder
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "✅ Removed .next folder" -ForegroundColor Green
}

# Remove node_modules/.cache if exists
if (Test-Path "node_modules\.cache") {
    Remove-Item -Recurse -Force "node_modules\.cache"
    Write-Host "✅ Removed node_modules cache" -ForegroundColor Green
}

Write-Host "`nCache cleared! Now restart dev server: npm run dev" -ForegroundColor Cyan

