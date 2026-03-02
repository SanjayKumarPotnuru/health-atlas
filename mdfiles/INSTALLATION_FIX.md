# Installation Problem Fixed! 

## What Happened
✅ Java 17 IS installed on your system  
❌ But it's NOT in your system PATH  
❌ Maven is NOT installed  

## Solution - Easy 2-Step Fix

### Step 1: Run Setup Script as Administrator

1. **Open PowerShell as Administrator:**
   - Press `Windows + X`
   - Click **"Terminal (Admin)"** or **"Windows PowerShell (Admin)"**

2. **Navigate to project folder:**
   ```powershell
   cd "C:\Users\skpotnur\OneDrive - Hexagon\Desktop\HEALTHATLAS\Health Atlas"
   ```

3. **Run the setup script:**
   ```powershell
   .\setup.ps1
   ```

   If you get an execution policy error, run this first:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

### Step 2: Verify Installation

1. **Close PowerShell completely** (important!)

2. **Open a NEW PowerShell window** (regular, not admin)

3. **Test commands:**
   ```powershell
   java -version
   mvn -version
   ```

You should see:
```
openjdk version "17.0.18" 2024-01-16 LTS
...

Apache Maven 3.9.6
...
```

---

## Manual Installation (If Script Doesn't Work)

### Manual Java Setup

1. Open PowerShell as Administrator
2. Run these commands one by one:

```powershell
# Set JAVA_HOME
[System.Environment]::SetEnvironmentVariable('JAVA_HOME', 'C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot', 'Machine')

# Add Java to PATH
$path = [System.Environment]::GetEnvironmentVariable('Path', 'Machine')
[System.Environment]::SetEnvironmentVariable('Path', "$path;C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot\bin", 'Machine')
```

### Manual Maven Installation

1. Download Maven from: https://maven.apache.org/download.cgi
   - Get **Binary zip archive** (apache-maven-3.9.6-bin.zip)

2. Extract to: `C:\Program Files\Apache\Maven`

3. Add to PATH (in Admin PowerShell):
```powershell
$path = [System.Environment]::GetEnvironmentVariable('Path', 'Machine')
[System.Environment]::SetEnvironmentVariable('Path', "$path;C:\Program Files\Apache\Maven\bin", 'Machine')
```

4. Close and reopen PowerShell

---

## After Successful Installation

Once `java -version` and `mvn -version` work, run the project:

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The H2 database will auto-create and the application will start on http://localhost:8080

---

## Still Having Issues?

Try this simpler alternative:

### Option: Use Current Session Only (Quick Test)

Instead of system-wide installation, set PATH for current session:

```powershell
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

# Test
java -version
```

Then manually download and extract Maven, and add it similarly.

This will work for the current PowerShell session only.
