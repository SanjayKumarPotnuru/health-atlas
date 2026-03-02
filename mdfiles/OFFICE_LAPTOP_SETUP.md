# Office Laptop Setup Guide (No Admin Required)

## ✅ Java is Already Working!

Your office laptop already has Java installed. I've configured it for you.

## 📝 For Office/Corporate Laptops

Since this is an office laptop, you likely have IT restrictions. Here's the **safest approach**:

### Quick Setup (Every Time You Work)

**Option 1: Run the dev setup script**
```powershell
.\dev-setup.ps1
```

**Option 2: Manual (copy-paste these 2 lines)**
```powershell
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
```

This configures Java **for your current PowerShell session only** - no changes to system, no admin needed, IT-friendly.

---

## 🔧 Install Maven (One-Time, No Admin)

### Step 1: Download Maven (Portable)
1. Go to: https://maven.apache.org/download.cgi
2. Download: **Binary zip archive** (apache-maven-3.9.6-bin.zip)
3. Save to Downloads

### Step 2: Extract Maven
1. Extract the zip file
2. Move the extracted folder to: `C:\Users\skpotnur\Maven`
   (Rename `apache-maven-3.9.6` to just `Maven`)

### Step 3: Add Maven to Session
Add this line after setting up Java:
```powershell
$env:PATH = "C:\Users\skpotnur\Maven\bin;$env:PATH"
```

Or just run `.\dev-setup.ps1` which does it automatically.

---

## 🚀 Running the Project

Every time you want to work on the project:

```powershell
# 1. Open PowerShell
# 2. Navigate to project
cd "C:\Users\skpotnur\OneDrive - Hexagon\Desktop\HEALTHATLAS\Health Atlas"

# 3. Run dev setup
.\dev-setup.ps1

# 4. Start the application
cd backend
mvn clean install
mvn spring-boot:run
```

---

## 💡 Why This Approach?

✅ **No admin rights needed**  
✅ **No permanent system changes**  
✅ **IT policy friendly**  
✅ **Works on corporate/office laptops**  
✅ **Session-based (safe)**  

---

## 📌 Pro Tip: PowerShell Profile (Optional)

To automatically configure Java/Maven every time you open PowerShell:

1. Edit your PowerShell profile:
   ```powershell
   notepad $PROFILE
   ```

2. Add these lines:
   ```powershell
   $env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot"
   $env:PATH = "$env:JAVA_HOME\bin;C:\Users\skpotnur\Maven\bin;$env:PATH"
   ```

3. Save and close

Now Java and Maven work automatically in every new PowerShell session!

---

## ✅ Current Status

- ✅ Java 17: Working (configured for current session)
- ⏳ Maven: Need to download and extract (5 minutes)

Once Maven is ready, you can run the project immediately!
