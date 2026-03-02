# Health Atlas - Quick Start Guide

## 🚀 How to Run the Application

### Step 1: Start Backend Server
1. Open **PowerShell** (new window)
2. Navigate to project folder:
   ```powershell
   cd "c:\Users\skpotnur\OneDrive - Hexagon\Desktop\HEALTHATLAS\Health Atlas"
   ```
3. Run backend startup script:
   ```powershell
   .\START-BACKEND.ps1
   ```
4. Wait for "Started HealthAtlasApplication" message
5. **Keep this window open!** Backend runs on http://localhost:8080

### Step 2: Start Frontend Server  
1. Open **another PowerShell** window (new window)
2. Navigate to project folder:
   ```powershell
   cd "c:\Users\skpotnur\OneDrive - Hexagon\Desktop\HEALTHATLAS\Health Atlas"
   ```
3. Run frontend startup script:
   ```powershell
   .\START-FRONTEND.ps1
   ```
4. Wait for "ready in XXX ms" message
5. **Keep this window open!** Frontend runs on http://localhost:3000

### Step 3: Open Application
- Open browser to **http://localhost:3000**
- Register and start using the app!

---

## 🛠️ Manual Start (Alternative)

### Backend:
```powershell
cd backend
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;C:\Users\skpotnur\Maven\bin;$env:PATH"
mvn spring-boot:run
```

### Frontend (in separate window):
```powershell
cd frontend
npm run dev
```

---

## ❌ To Stop Servers

Press `Ctrl+C` in each PowerShell window, or close the windows.

---

## 🔧 Troubleshooting

### "Port 8080 already in use"
Kill the Java process:
```powershell
Stop-Process -Name java -Force
```

### "Port 3000 already in use"
Kill the Node process:
```powershell
Stop-Process -Name node -Force
```

### CORS Error "No static resource"
This is now fixed! The backend has CORS configuration to allow requests from http://localhost:3000

---

## ✅ What Was Fixed

The **"No static resource api/auth/register/patient"** error was a CORS issue.

**Solution**: Added CORS configuration to backend:
- Created `CorsConfig.java` to allow requests from http://localhost:3000
- Updated `SecurityConfig.java` to use CORS configuration
- Now frontend can successfully call backend APIs

The backend will now accept requests from your React frontend running on port 3000!

---

## 🎯 Next Steps

1. Start both servers using the scripts above
2. Go to http://localhost:3000
3. Click "Register here"
4. Create a patient account
5. Login and explore!

Enjoy your **Health Atlas** application! 🏥
