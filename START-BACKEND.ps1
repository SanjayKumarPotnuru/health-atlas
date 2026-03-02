# Health Atlas - Backend Startup Script
# Run this to start the backend server

Write-Host "================================" -ForegroundColor Cyan
Write-Host " Health Atlas - Backend Server" -ForegroundColor Cyan  
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Set Java and Maven environment
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;C:\Users\skpotnur\Maven\bin;$env:PATH"

# Navigate to backend directory
Set-Location -Path "c:\Users\skpotnur\OneDrive - Hexagon\Desktop\HEALTHATLAS\Health Atlas\backend"

Write-Host "Starting Spring Boot application..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Backend will run on: http://localhost:8080" -ForegroundColor Green
Write-Host "H2 Console: http://localhost:8080/h2-console" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Red
Write-Host ""

# Start Maven
mvn spring-boot:run
