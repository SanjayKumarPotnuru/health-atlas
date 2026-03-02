# Installing Java 17 on Windows

## Recommended: Install via Chocolatey (Easiest)

### Step 1: Install Chocolatey (if not already installed)
Open PowerShell as **Administrator** and run:
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

### Step 2: Install OpenJDK 17
```powershell
choco install openjdk17 -y
```

### Step 3: Verify Installation
```powershell
# Close and reopen PowerShell, then:
java -version
```

Expected output:
```
openjdk version "17.0.x" ...
```

---

## Alternative 1: Microsoft OpenJDK

### Step 1: Download
Visit: https://learn.microsoft.com/en-us/java/openjdk/download
- Download **Microsoft Build of OpenJDK 17** (Windows x64 MSI)

### Step 2: Install
- Run the downloaded `.msi` file
- Follow installation wizard
- It will automatically set environment variables

### Step 3: Verify
```powershell
java -version
```

---

## Alternative 2: Oracle JDK (Manual Installation)

### Step 1: Download
Visit: https://www.oracle.com/java/technologies/downloads/#java17
- Download **Java 17 Windows x64 Installer**

### Step 2: Install
- Run the installer
- Note the installation path (e.g., `C:\Program Files\Java\jdk-17`)

### Step 3: Set Environment Variables Manually

1. **Open Environment Variables:**
   - Press `Win + X` → System → Advanced system settings
   - Click "Environment Variables"

2. **Set JAVA_HOME:**
   - Click "New" under System variables
   - Variable name: `JAVA_HOME`
   - Variable value: `C:\Program Files\Java\jdk-17` (your installation path)

3. **Update PATH:**
   - Find "Path" in System variables
   - Click "Edit"
   - Click "New"
   - Add: `%JAVA_HOME%\bin`
   - Click OK on all dialogs

### Step 4: Verify
```powershell
# Close and reopen PowerShell
java -version
javac -version
```

---

## Quick Installation Script (PowerShell - Run as Administrator)

```powershell
# Install via winget (Windows Package Manager)
winget install Microsoft.OpenJDK.17
```

---

## Troubleshooting

### Issue: "java is not recognized"
**Solution 1:** Restart your terminal after installation
```powershell
# Close PowerShell and open a new window
```

**Solution 2:** Check if JAVA_HOME is set
```powershell
echo $env:JAVA_HOME
echo $env:PATH
```

**Solution 3:** Manually add to current session
```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
```

### Issue: Wrong Java version
**Solution:** Uninstall old version first
```powershell
# Via Control Panel → Programs → Uninstall
# Or via Chocolatey
choco uninstall openjdk
```

### Issue: Multiple Java versions installed
**Solution:** Use JAVA_HOME to point to Java 17
```powershell
# Verify which Java is being used
Get-Command java | Select-Object -ExpandProperty Source

# Set JAVA_HOME to Java 17 path
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Java\jdk-17", "Machine")
```

---

## Recommended Installation Method (Fastest)

I recommend using **winget** as it's built into Windows 10/11:

```powershell
# Run as Administrator
winget install Microsoft.OpenJDK.17

# Close and reopen PowerShell
java -version
```

This automatically:
- Downloads Java 17
- Installs it
- Sets environment variables
- No manual configuration needed

---

## After Installation

Once Java is installed and `java -version` works, you can proceed with the project:

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

---

## Need Maven Too?

If Maven is also not installed:

```powershell
# Via Chocolatey
choco install maven -y

# Or via winget
winget install Apache.Maven
```

Verify:
```powershell
mvn -version
```
