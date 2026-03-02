# ============================================================
# OFFICE LAPTOP SETUP - No Admin Required, No Installation
# ============================================================
# Run this script each time you open PowerShell to work on the project

Write-Host "Setting up Java and Maven for this session..." -ForegroundColor Cyan

# Configure Java (already installed on your laptop)
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

Write-Host "Java configured" -ForegroundColor Green

# Check if Maven is in user folder
$mavenPath = "$env:USERPROFILE\Maven"
if (Test-Path "$mavenPath\bin\mvn.cmd") {
    $env:PATH = "$mavenPath\bin;$env:PATH"
    Write-Host "Maven configured" -ForegroundColor Green
} else {
    Write-Host "Maven not found" -ForegroundColor Yellow
    Write-Host "Download Maven from: https://maven.apache.org/download.cgi" -ForegroundColor White
    Write-Host "Extract to: $env:USERPROFILE\Maven" -ForegroundColor White
}

# Verify
Write-Host ""
Write-Host "Verification:" -ForegroundColor Cyan
java -version 2>&1 | Select-Object -First 1
if (Test-Path "$mavenPath\bin\mvn.cmd") {
    & "$mavenPath\bin\mvn.cmd" -version 2>&1 | Select-Object -First 1
}

Write-Host ""
Write-Host "You can now run the project:" -ForegroundColor Green
Write-Host "  cd backend" -ForegroundColor White
Write-Host "  mvn clean install" -ForegroundColor White
Write-Host "  mvn spring-boot:run" -ForegroundColor White
Write-Host ""
