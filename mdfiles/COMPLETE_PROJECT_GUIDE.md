# 🎉 Health Atlas - Complete Interactive Medical History System

## ✅ Project Complete!

Your **Interactive Medical History System** with **3D Anatomy Visualization** is now fully operational!

---

## 🚀 What's Running

### Backend (Spring Boot)
- **URL**: http://localhost:8080
- **H2 Console**: http://localhost:8080/h2-console
- **Status**: ✅ Running
- **Database**: H2 file-based (./backend/data/healthatlas)
- **Authentication**: JWT with 24-hour tokens

### Frontend (React + Three.js)
- **URL**: http://localhost:3000
- **Status**: ✅ Running
- **Framework**: React 18 + Vite
- **3D Engine**: Three.js (React Three Fiber)

---

## 🧪 Quick Test Workflow

### 1️⃣ Register Patient
1. Go to http://localhost:3000
2. Click "Register here"
3. Select **Patient**
4. Fill in details (email: patient@test.com, password: test123)
5. Click Register

### 2️⃣ Register Doctor (New Incognito Window)
1. Open new incognito/private browser window
2. Go to http://localhost:3000/register
3. Select **Doctor**
4. Fill in details (email: doctor@test.com, password: test123, specialization: Cardiology, license: DOC12345)
5. Click Register

### 3️⃣ Doctor Requests Consent
1. In doctor window, login with doctor@test.com
2. In "Request Patient Consent" section:
   - Enter patient email: patient@test.com
   - Select consent type (e.g., 7 Days)
   - Click "Request Consent"

### 4️⃣ Patient Approves Consent
1. In patient window, login with patient@test.com
2. See consent request in "Consent Requests" section
3. Click "Approve"

### 5️⃣ Doctor Adds Medical Record
1. In doctor window, see approved consent
2. Click "Add Record" button
3. Fill in medical record:
   - Organ System: Heart
   - Diagnosis: "Mild hypertension"
   - Treatment: "Beta blockers, lifestyle changes"
   - Notes: "Follow up in 3 months"
4. Click "Save Record"

### 6️⃣ Patient Views in 3D
1. In patient window, click "Open 3D Anatomy Viewer"
2. See interactive 3D human body model
3. Click on **Heart** (red sphere in center)
4. See medical record appear on right panel
5. Rotate model (drag), zoom (scroll wheel)

---

## 🎯 Key Features Implemented

### Patient Portal
- ✅ View medical records with 3D anatomy visualization
- ✅ Manage consent requests (approve/deny/revoke)
- ✅ Browse medical history by organ system
- ✅ Interactive 3D body with 14 organ systems

### Doctor Portal
- ✅ Request patient consent (4 types: one-time, 7 days, 30 days, always)
- ✅ Add medical records for approved patients
- ✅ View patient records with 3D anatomy
- ✅ Consent expiry tracking

### Security
- ✅ JWT authentication (24-hour tokens)
- ✅ Role-based access (PATIENT/DOCTOR)
- ✅ Consent-driven access control
- ✅ Stateless security

### Database
- ✅ H2 embedded database (zero config)
- ✅ Flyway migrations (4 versions)
- ✅ Immutable medical records
- ✅ 14 predefined organ systems

---

## 📂 Project Structure

```
Health Atlas/
├── backend/                    # Spring Boot API
│   ├── src/main/java/
│   │   └── com/healthatlas/
│   │       ├── controller/     # REST endpoints (3 files)
│   │       ├── service/        # Business logic (4 files)
│   │       ├── repository/     # Data access (9 files)
│   │       ├── model/          # JPA entities (9 files)
│   │       └── security/       # JWT & auth (3 files)
│   ├── src/main/resources/
│   │   └── db/migration/       # Flyway SQL (4 files)
│   └── pom.xml                 # Maven dependencies
│
└── frontend/                   # React + Three.js
    ├── src/
    │   ├── pages/              # Login, Register, Dashboards, AnatomyViewer
    │   ├── components/         # HumanBody 3D, PrivateRoute
    │   ├── api/                # Axios client with JWT
    │   └── store/              # Zustand state management
    └── package.json            # npm dependencies
```

---

## 🔧 Technical Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Three.js, React Router, Zustand |
| **Backend** | Spring Boot 3.2, JWT, H2 Database, Flyway |
| **Security** | JWT HS256, BCrypt password hashing |
| **Build** | Vite (frontend), Maven (backend) |
| **3D Rendering** | React Three Fiber, @react-three/drei |

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register/patient` - Register patient
- `POST /api/auth/register/doctor` - Register doctor
- `POST /api/auth/login` - Login (returns JWT)

### Consents
- `POST /api/doctor/{doctorId}/consent/request` - Request consent
- `POST /api/patient/{patientId}/consent/{consentId}/approve` - Approve
- `POST /api/patient/{patientId}/consent/{consentId}/revoke` - Revoke
- `GET /api/patient/{patientId}/consents` - Get patient consents
- `GET /api/doctor/{doctorId}/consents` - Get doctor consents

### Medical Records
- `POST /api/doctor/{doctorId}/medical-record` - Add record
- `GET /api/patient/{patientId}/records` - Get all records
- `GET /api/patient/{patientId}/records/organ/{organId}` - Get by organ
- `GET /api/organs` - Get all organ systems (14)

---

## 🎨 3D Organ Systems

The 3D viewer displays all 14 organ systems with color-coded visualization:

- 🧠 **Brain** (Pink) - Top of head
- ❤️ **Heart** (Red) - Center chest
- 🫁 **Lungs** (Sky Blue) - Chest cavity
- 🫀 **Liver** (Brown) - Right upper abdomen
- 🍽️ **Stomach** (Orange) - Left upper abdomen
- 🫘 **Kidneys** (Brown) - Lower back
- 🌀 **Intestines** (Plum) - Lower abdomen
- 🥞 **Pancreas** (Sandy) - Behind stomach
- 💧 **Bladder** (Purple) - Lower pelvis
- 🩸 **Spleen** (Burgundy) - Left upper abdomen
- 🦴 **Thyroid** (Tomato) - Neck region
- ⚡ **Adrenal Glands** (Gold) - Above kidneys
- 🔴 **Reproductive Organs** (Orchid) - Pelvic region
- 🌐 **Skin** (Wheat) - Outer wireframe

---

## 📊 Database Schema

### Users & Profiles
- `users` - Base authentication (email, password, role)
- `patients` - Patient demographics (DOB, gender, blood group)
- `doctors` - Doctor credentials (specialization, license)

### Access Control
- `consents` - Consent requests with types & expiry
  - Types: ONE_TIME, SEVEN_DAYS, THIRTY_DAYS, ALWAYS
  - Status: PENDING, APPROVED, REVOKED, EXPIRED

### Medical Data
- `organs` - 14 predefined organ systems
- `medical_records` - Immutable diagnosis records
- `lab_reports` - Lab test results
- `patient_uploads` - File attachments (placeholder)
- `patient_notes` - Personal notes (placeholder)

---

## 🛡️ Security Features

1. **JWT Authentication**: Tokens expire in 24 hours
2. **Password Encryption**: BCrypt hashing
3. **Role-Based Access**: PATIENT vs DOCTOR permissions
4. **Consent Validation**: Records require active consent
5. **Automatic Expiry**: Time-based consent expiration
6. **Stateless Sessions**: No server-side session storage

---

## 📝 Development Notes

### Session-Based Environment (Office Laptop)
Since you're on an office laptop with IT restrictions, run this before each session:

```powershell
cd backend
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;C:\Users\skpotnur\Maven\bin;$env:PATH"
mvn spring-boot:run
```

Or use the provided `dev-setup.ps1` script.

### Database Location
- **Path**: `backend/data/healthatlas.mv.db`
- **Console**: http://localhost:8080/h2-console
- **JDBC URL**: `jdbc:h2:file:./data/healthatlas`
- **Username**: `SA`
- **Password**: (blank)

### Stopping Servers
- Press `Ctrl+C` in each terminal
- Or close the terminal windows

---

## 🎓 Academic Project Features

This project demonstrates:
- ✅ **Full-stack development** (Spring Boot + React)
- ✅ **RESTful API design** with JWT security
- ✅ **Database modeling** with JPA/Hibernate
- ✅ **3D visualization** with Three.js
- ✅ **Consent-driven architecture** for healthcare
- ✅ **Responsive UI/UX** design
- ✅ **State management** with Zustand
- ✅ **Database migrations** with Flyway
- ✅ **Industry-standard security** patterns

---

## 🚀 Next Steps (Optional)

1. **Deploy to Cloud** (AWS, Azure, Heroku)
2. **Add File Uploads** (X-rays, scans, documents)
3. **Implement Patient Notes** (personal health journal)
4. **Enhanced 3D Models** (more detailed anatomy)
5. **Email Notifications** (consent requests)
6. **Export Reports** (PDF generation)
7. **Search & Filters** (date range, organ type)
8. **Admin Panel** (user management)

---

## 📞 Troubleshooting

### Backend won't start?
```bash
# Check if port 8080 is in use
Get-NetTCPConnection -LocalPort 8080

# Kill the process
Get-NetTCPConnection -LocalPort 8080 | Stop-Process

# Restart backend
cd backend
mvn spring-boot:run
```

### Frontend errors?
```bash
# Clear node_modules and reinstall
cd frontend
Remove-Item -Recurse node_modules
npm install
npm run dev
```

### 3D model not showing?
- Check browser console for errors
- Ensure backend is running (organs API)
- Try different browser (Chrome recommended)

---

## 📄 License

Academic project for educational purposes.

---

## 🎉 Congratulations!

You now have a fully functional **Interactive Medical History System** with:
- 🏥 Consent-driven access control
- 🧍 3D anatomy visualization
- 🔐 Secure JWT authentication
- 📊 Comprehensive medical records
- 👨‍⚕️ Doctor and patient portals

**Enjoy exploring your 3D medical history system!** 🚀
