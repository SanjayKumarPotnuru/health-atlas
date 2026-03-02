# ============================================================
# USER-LEVEL SETUP (No Administrator Required)
# ============================================================
# Run this in REGULAR PowerShell (not admin)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Health Atlas - User Setup (No Admin)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Set Java Environment Variables (User Level)
Write-Host "Step 1: Configuring Java for your user account..." -ForegroundColor Yellow
$javaPath = "C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot"

if (Test-Path $javaPath) {
    Write-Host "✓ Java found at: $javaPath" -ForegroundColor Green
    
    # Set JAVA_HOME (User level - no admin needed)
    [System.Environment]::SetEnvironmentVariable('JAVA_HOME', $javaPath, 'User')
    Write-Host "✓ JAVA_HOME set for your user" -ForegroundColor Green
    
    # Add to PATH (User level)
    $currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'User')
    if ($currentPath -notlike "*$javaPath\bin*") {
        [System.Environment]::SetEnvironmentVariable('Path', "$currentPath;$javaPath\bin", 'User')
        Write-Host "✓ Java added to your PATH" -ForegroundColor Green
    } else {
        Write-Host "✓ Java already in your PATH" -ForegroundColor Green
    }
} else {
    Write-Host "✗ Java not found at expected location" -ForegroundColor Red
    Write-Host "Please install Java first" -ForegroundColor Yellow
}

Write-Host ""

# Step 2: Install Maven (User Level)
Write-Host "Step 2: Installing Maven for your user..." -ForegroundColor Yellow
$mavenPath = "$env:USERPROFILE\Maven"

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
        
        # Extract Maven to user folder (no admin needed)
        Write-Host "Extracting Maven..." -ForegroundColor Yellow
        Expand-Archive -Path $downloadPath -DestinationPath "$env:USERPROFILE\" -Force
        
        # Rename folder
        if (Test-Path "$env:USERPROFILE\apache-maven-$mavenVersion") {
            Rename-Item "$env:USERPROFILE\apache-maven-$mavenVersion" -NewName "Maven" -Force
        }
        
        Write-Host "✓ Maven extracted to: $mavenPath" -ForegroundColor Green
        
        # Add to PATH (User level)
        $mavenBin = "$mavenPath\bin"
        $currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'User')
        if ($currentPath -notlike "*$mavenBin*") {
            [System.Environment]::SetEnvironmentVariable('Path', "$currentPath;$mavenBin", 'User')
            Write-Host "✓ Maven added to your PATH" -ForegroundColor Green
        }
        
        # Clean up
        Remove-Item $downloadPath -Force
        
    } catch {
        Write-Host "✗ Error installing Maven: $_" -ForegroundColor Red
        Write-Host "You can manually download from: https://maven.apache.org/download.cgi" -ForegroundColor Yellow
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
Write-Host "Maven installed at: $mavenPath" -ForegroundColor White
Write-Host "Configuration: User-level only (no admin required)" -ForegroundColor White
Write-Host ""
