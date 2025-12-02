# Complete System Reset Script
# Run with: powershell -ExecutionPolicy Bypass -File reset-system.ps1

Write-Host "🔄 Complete System Reset" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Step 1: Delete all projects from database
Write-Host "Step 1: Cleaning database..." -ForegroundColor Yellow
node delete-all-projects.js
Write-Host ""

# Step 2: Delete dist folder
Write-Host "Step 2: Deleting old build files..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Host "✅ Deleted dist folder" -ForegroundColor Green
} else {
    Write-Host "✅ No dist folder to delete" -ForegroundColor Green
}
Write-Host ""

# Step 3: Rebuild frontend
Write-Host "Step 3: Building fresh frontend..." -ForegroundColor Yellow
npm run build
Write-Host ""

# Step 4: Verify database
Write-Host "Step 4: Verifying database..." -ForegroundColor Yellow
node check-database.js
Write-Host ""

Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ Reset Complete!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Start server: node server.js" -ForegroundColor White
Write-Host "2. Open NEW incognito window (Ctrl+Shift+N)" -ForegroundColor White
Write-Host "3. Go to http://localhost:3001" -ForegroundColor White
Write-Host "4. Login as admin" -ForegroundColor White
Write-Host "5. Check User Topics - should show 0 projects" -ForegroundColor White
Write-Host ""
