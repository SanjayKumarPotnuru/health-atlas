# Health Atlas AI Chatbot - Startup Script
# Run this to start the chatbot server

Write-Host "================================" -ForegroundColor Cyan
Write-Host " Health Atlas AI Chatbot" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to chatbot directory
$chatbotDir = Join-Path $PSScriptRoot "medical-chatbot"
Set-Location -Path $chatbotDir

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "Warning: .env file not found!" -ForegroundColor Yellow
    Write-Host "Creating .env from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host ""
    Write-Host "IMPORTANT: Edit .env and add your GITHUB_TOKEN" -ForegroundColor Red
    Write-Host "   Get token from: https://github.com/settings/tokens" -ForegroundColor Yellow
    Write-Host ""
    Pause
}

# Check Python environment
$pythonExe = "C:/Users/skpotnur/OneDrive - Hexagon/Desktop/HEALTHATLAS/Health Atlas/.venv/Scripts/python.exe"

if (-not (Test-Path $pythonExe)) {
    Write-Host "Error: Python environment not found!" -ForegroundColor Red
    Write-Host "Please run: python -m venv venv" -ForegroundColor Yellow
    exit 1
}

Write-Host "Starting Health Atlas AI Chatbot..." -ForegroundColor Green
Write-Host ""
Write-Host "Chatbot will run on: http://localhost:8087" -ForegroundColor Cyan
Write-Host "Make sure backend is running on: http://localhost:8080" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the chatbot
& $pythonExe chatbot.py
