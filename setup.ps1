# ============================================================
# SETUP SCRIPT - Run this in Administrator PowerShell
# ============================================================
# Right-click PowerShell → "Run as Administrator", then run this script

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Health Atlas - Setup Script" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Set Java Environment Variables
Write-Host "Step 1: Configuring Java..." -ForegroundColor Yellow
$javaPath = "C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot"

if (Test-Path $javaPath) {
    Write-Host "✓ Java found at: $javaPath" -ForegroundColor Green
    
    # Set JAVA_HOME
    [System.Environment]::SetEnvironmentVariable('JAVA_HOME', $javaPath, 'Machine')
    Write-Host "✓ JAVA_HOME set" -ForegroundColor Green
    
    # Add to PATH
    $currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'Machine')
    if ($currentPath -notlike "*$javaPath\bin*") {
        [System.Environment]::SetEnvironmentVariable('Path', "$currentPath;$javaPath\bin", 'Machine')
        Write-Host "✓ Java added to PATH" -ForegroundColor Green
    } else {
        Write-Host "✓ Java already in PATH" -ForegroundColor Green
    }
} else {
    Write-Host "✗ Java not found. Installing..." -ForegroundColor Red
    winget install --id Microsoft.OpenJDK.17 --exact --silent --accept-source-agreements --accept-package-agreements
}

Write-Host ""

# Step 2: Install Maven
Write-Host "Step 2: Installing Maven..." -ForegroundColor Yellow
$mavenPath = "C:\Program Files\Apache\Maven"

if (Test-Path "$mavenPath\bin\mvn.cmd") {
    Write-Host "✓ Maven already installed" -ForegroundColor Green
} else {
    Write-Host "Downloading Maven..." -ForegroundColor Yellow
    
    # Download Maven
    $mavenVersion = "3.9.6"
    $mavenUrl = "https://dlcdn.apache.org/maven/maven-3/$mavenVersion/binaries/apache-maven-$mavenVersion-bin.zip"
    $downloadPath = "$env:TEMP\maven.zip"
    
    try {
        Invoke-WebRequest -Uri $mavenUrl -OutFile $downloadPath
        Write-Host "✓ Maven downloaded" -ForegroundColor Green
        
        # Extract Maven
        Write-Host "Extracting Maven..." -ForegroundColor Yellow
        Expand-Archive -Path $downloadPath -DestinationPath "C:\Program Files\Apache\" -Force
        
        # Rename folder
        if (Test-Path "C:\Program Files\Apache\apache-maven-$mavenVersion") {
            Rename-Item "C:\Program Files\Apache\apache-maven-$mavenVersion" -NewName "Maven" -Force
        }
        
        Write-Host "✓ Maven extracted" -ForegroundColor Green
        
        # Add to PATH
        $mavenBin = "C:\Program Files\Apache\Maven\bin"
        $currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'Machine')
        if ($currentPath -notlike "*$mavenBin*") {
            [System.Environment]::SetEnvironmentVariable('Path', "$currentPath;$mavenBin", 'Machine')
            Write-Host "✓ Maven added to PATH" -ForegroundColor Green
        }
        
        # Clean up
        Remove-Item $downloadPath -Force
        
    } catch {
        Write-Host "✗ Error installing Maven: $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANT: Close this PowerShell window and open a NEW one" -ForegroundColor Yellow
Write-Host "Then verify installation with:" -ForegroundColor White
Write-Host "  java -version" -ForegroundColor Cyan
Write-Host "  mvn -version" -ForegroundColor Cyan
Write-Host ""
