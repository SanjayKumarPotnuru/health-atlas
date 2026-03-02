# Health Atlas - Frontend Startup Script
# Run this to start the frontend dev server

Write-Host "=================================" -ForegroundColor Cyan
Write-Host " Health Atlas - Frontend Server" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to frontend directory
Set-Location -Path "c:\Users\skpotnur\OneDrive - Hexagon\Desktop\HEALTHATLAS\Health Atlas\frontend"

Write-Host "Starting Vite development server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Frontend will run on: http://localhost:3001" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Red
Write-Host ""

# Start npm dev server
npm run dev
