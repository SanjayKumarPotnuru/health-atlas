# Health Atlas - Complete Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Application Flow](#application-flow)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Security Implementation](#security-implementation)
8. [Frontend Components](#frontend-components)
9. [Backend Services](#backend-services)
10. [Development Setup](#development-setup)
11. [Future Enhancements](#future-enhancements)

---

## 🎯 Project Overview

**Health Atlas** is an Interactive Medical History System with consent-driven access control and 3D anatomy visualization.

### Key Features
- **Patient-Centric Design**: Patients own and control their medical data
- **Consent-Driven Access**: Doctors need patient approval to view/add records
- **3D Anatomy Viewer**: Interactive Three.js visualization of organ systems
- **Immutable Records**: Medical records cannot be edited, only appended
- **JWT Authentication**: Secure stateless authentication
- **Role-Based Access**: Separate portals for patients and doctors

### Project Type
Academic project demonstrating full-stack development, security best practices, and healthcare data management.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React Frontend (Port 3000)                          │  │
│  │  - Login/Register Pages                              │  │
│  │  - Patient Dashboard                                 │  │
│  │  - Doctor Dashboard                                  │  │
│  │  - 3D Anatomy Viewer (Three.js)                      │  │
│  │  - State Management (Zustand)                        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Spring Security + CORS Configuration                │  │
│  │  - JWT Token Validation                              │  │
│  │  - CORS Filter (Allow localhost:3000)                │  │
│  │  - Role-Based Authorization                          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  REST Controllers (Port 8080)                        │  │
│  │  - AuthController                                    │  │
│  │  - ConsentController                                 │  │
│  │  - MedicalRecordController                           │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Service Layer                                       │  │
│  │  - AuthService (Registration, Login, JWT)           │  │
│  │  - ConsentService (Request, Approve, Revoke)        │  │
│  │  - MedicalRecordService (Create, Retrieve)          │  │
│  │  - OrganService (Get organ systems)                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    DATA ACCESS LAYER                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Spring Data JPA Repositories                        │  │
│  │  - UserRepository                                    │  │
│  │  - PatientRepository                                 │  │
│  │  - DoctorRepository                                  │  │
│  │  - ConsentRepository                                 │  │
│  │  - MedicalRecordRepository                           │  │
│  │  - OrganRepository                                   │  │
│  │  + 3 more repositories                               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  H2 Database (File-based)                            │  │
│  │  Location: backend/data/healthatlas.mv.db            │  │
│  │  - 9 Tables                                          │  │
│  │  - Flyway Migrations (Version Control)               │  │
│  │  - H2 Console: localhost:8080/h2-console             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Java** | 17 | Programming Language |
| **Spring Boot** | 3.2.1 | Application Framework |
| **Spring Security** | 6.2.1 | Authentication & Authorization |
| **Spring Data JPA** | 3.2.1 | ORM & Database Access |
| **Hibernate** | 6.4.1 | JPA Implementation |
| **H2 Database** | 2.2.224 | Embedded Database |
| **Flyway** | 9.22.3 | Database Migration Tool |
| **JWT (jjwt)** | 0.12.3 | JSON Web Token Library |
| **Lombok** | Latest | Reduce Boilerplate Code |
| **Maven** | 3.9.12 | Build Tool |
| **Tomcat** | 10.1.17 | Embedded Web Server |

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2.0 | UI Framework |
| **Vite** | 5.0.11 | Build Tool & Dev Server |
| **React Router DOM** | 6.21.1 | Client-side Routing |
| **Three.js** | 0.160.0 | 3D Graphics Library |
| **@react-three/fiber** | 8.15.13 | React Renderer for Three.js |
| **@react-three/drei** | 9.92.7 | Three.js Helpers |
| **Axios** | 1.6.5 | HTTP Client |
| **Zustand** | 4.4.7 | State Management |
| **Node.js** | Latest | JavaScript Runtime |

### Development Tools

| Tool | Purpose |
|------|---------|
| **VS Code** | Code Editor |
| **PowerShell** | Terminal/Scripting |
| **Git** | Version Control |
| **Maven** | Dependency Management |
| **npm** | Package Manager |

---

## 🔄 Application Flow

### 1. **User Registration Flow**

```
┌─────────────┐
│   Browser   │
│ localhost:  │
│    3000     │
└──────┬──────┘
       │
       │ 1. User fills registration form
       │    (Patient or Doctor)
       ▼
┌─────────────────────┐
│  Register.jsx       │
│  - Collect form data│
│  - Split name into  │
│    firstName/       │
│    lastName         │
│  - Map phoneNumber  │
│    to phone         │
└──────┬──────────────┘
       │
       │ 2. POST /api/auth/patient/register
       │    or /api/auth/doctor/register
       │    Body: { firstName, lastName, email, password, ... }
       ▼
┌─────────────────────┐
│  AuthController     │
│  - Validate input   │
│  - Call AuthService │
└──────┬──────────────┘
       │
       │ 3. Process registration
       ▼
┌─────────────────────┐
│   AuthService       │
│  - Check if email   │
│    already exists   │
│  - Hash password    │
│    (BCrypt)         │
│  - Create User      │
│  - Create Patient/  │
│    Doctor profile   │
│  - Generate JWT     │
└──────┬──────────────┘
       │
       │ 4. Save to database
       ▼
┌─────────────────────┐
│   Repositories      │
│  - UserRepository   │
│  - PatientRepository│
│    or               │
│    DoctorRepository │
└──────┬──────────────┘
       │
       │ 5. Return AuthResponse
       │    { userId, email, name, role, token }
       ▼
┌─────────────────────┐
│   Frontend          │
│  - Receive token    │
│  - Store in Zustand │
│  - Store in         │
│    localStorage     │
│  - Navigate to      │
│    /login           │
└─────────────────────┘
```

### 2. **Login Flow**

```
User enters credentials
       ↓
POST /api/auth/login { email, password }
       ↓
AuthService validates credentials
       ↓
BCrypt.matches(password, hashedPassword)
       ↓
Generate JWT token (24-hour expiry)
       ↓
Return { userId, email, name, role, token }
       ↓
Frontend stores token in:
  - Zustand store (in-memory)
  - localStorage (persistence)
       ↓
Redirect to dashboard:
  - /patient (if PATIENT)
  - /doctor (if DOCTOR)
```

### 3. **Consent Request Flow**

```
┌──────────────┐
│ Doctor       │
│ Dashboard    │
└──────┬───────┘
       │
       │ 1. Enter patient email + consent type
       │    (ONE_TIME, SEVEN_DAYS, THIRTY_DAYS, ALWAYS)
       ▼
POST /api/doctor/{doctorId}/consent/request
  Body: { patientEmail, consentType }
       │
       │ 2. ConsentService processes
       ▼
- Find patient by email
- Create Consent record
  - Status: PENDING
  - Calculate expiresAt based on type
       │
       │ 3. Save to database
       ▼
┌──────────────┐
│ Patient      │
│ Dashboard    │
│ (Auto-polls) │
└──────┬───────┘
       │
       │ 4. Patient sees pending consent
       ▼
POST /api/patient/{patientId}/consent/{consentId}/approve
       │
       │ 5. Update consent status
       ▼
Consent.status = APPROVED
       │
       │ 6. Doctor can now access records
       ▼
┌──────────────┐
│ Doctor sees  │
│ active       │
│ consent      │
└──────────────┘
```

### 4. **Medical Record Creation Flow**

```
Doctor selects patient (with approved consent)
       ↓
Doctor fills form:
  - Organ System (dropdown of 14 organs)
  - Diagnosis
  - Treatment
  - Notes
       ↓
POST /api/doctor/{doctorId}/medical-record
  Body: { patientId, organId, diagnosis, treatment, notes }
       ↓
MedicalRecordService validates:
  - Doctor has APPROVED consent for patient
  - Consent not expired
       ↓
Create MedicalRecord:
  - Patient: link to patient
  - Doctor: link to doctor
  - Organ: link to organ system
  - Diagnosis, Treatment, Notes
  - RecordedAt: current timestamp
  - Immutable: cannot be updated
       ↓
Save to database
       ↓
Patient can view in:
  - Dashboard (recent records)
  - 3D Anatomy Viewer (by organ)
```

### 5. **3D Anatomy Viewer Flow**

```
Patient clicks "Open 3D Anatomy Viewer"
       ↓
Navigate to /anatomy/{patientId}
       ↓
AnatomyViewer.jsx loads:
  1. GET /api/organs → 14 organ systems
  2. GET /api/patient/{patientId}/records → all medical records
       ↓
Render 3D scene:
  - Human body outline (wireframe)
  - 14 colored spheres (organs)
  - Organ labels (text)
       ↓
User clicks organ (e.g., Heart)
       ↓
Filter records by organId
       ↓
Display records in right panel:
  - Date
  - Diagnosis
  - Treatment
  - Notes
  - Doctor name
       ↓
User can:
  - Rotate model (drag)
  - Zoom (scroll)
  - Click different organs
  - Read medical history
```

---

## 🗄️ Database Schema

### Tables Overview

```
users (Authentication)
  ├── patients (Patient Profiles)
  └── doctors (Doctor Profiles)

consents (Access Control)
  ├── patient_id → patients
  └── doctor_id → doctors

organs (14 Predefined Systems)

medical_records (Patient Records)
  ├── patient_id → patients
  ├── doctor_id → doctors
  └── organ_id → organs
      ├── lab_reports
      ├── patient_uploads
      └── patient_notes
```

### Detailed Schema

#### 1. **users**
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL, -- PATIENT, DOCTOR
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 2. **patients**
```sql
CREATE TABLE patients (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    blood_group VARCHAR(10),
    emergency_contact VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### 3. **doctors**
```sql
CREATE TABLE doctors (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    phone VARCHAR(20),
    years_of_experience INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### 4. **consents**
```sql
CREATE TABLE consents (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    consent_type VARCHAR(20) NOT NULL, -- ONE_TIME, SEVEN_DAYS, THIRTY_DAYS, ALWAYS
    status VARCHAR(20) NOT NULL, -- PENDING, APPROVED, REVOKED, EXPIRED
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    revoked_at TIMESTAMP,
    expires_at TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);
```

#### 5. **organs** (Pre-populated with 14 systems)
```sql
CREATE TABLE organs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

-- Pre-inserted data:
-- Brain, Heart, Lungs, Liver, Stomach, Kidneys, Intestines,
-- Pancreas, Bladder, Spleen, Thyroid, Adrenal Glands,
-- Reproductive Organs, Skin
```

#### 6. **medical_records**
```sql
CREATE TABLE medical_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    organ_id BIGINT NOT NULL,
    diagnosis TEXT NOT NULL,
    treatment TEXT,
    notes TEXT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id),
    FOREIGN KEY (organ_id) REFERENCES organs(id)
);
```

#### 7-9. **Supporting Tables** (Placeholders for future features)
- **lab_reports**: Lab test results linked to medical records
- **patient_uploads**: File attachments (X-rays, scans, documents)
- **patient_notes**: Personal health journal entries

---

## 🔌 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Request Body | Response | Description |
|--------|----------|--------------|----------|-------------|
| POST | `/api/auth/patient/register` | `{ firstName, lastName, email, password, dateOfBirth, gender, phone, address, emergencyContact }` | `{ userId, email, name, role, token }` | Register new patient |
| POST | `/api/auth/doctor/register` | `{ firstName, lastName, email, password, specialization, licenseNumber, phone, yearsOfExperience }` | `{ userId, email, name, role, token }` | Register new doctor |
| POST | `/api/auth/login` | `{ email, password }` | `{ userId, email, name, role, token }` | Login user |

### Consent Management Endpoints

| Method | Endpoint | Request Body | Response | Description |
|--------|----------|--------------|----------|-------------|
| POST | `/api/doctor/{doctorId}/consent/request` | `{ patientEmail, consentType }` | `{ id, patientName, consentType, status, requestedAt }` | Doctor requests access |
| POST | `/api/patient/{patientId}/consent/{consentId}/approve` | - | `{ message }` | Patient approves consent |
| POST | `/api/patient/{patientId}/consent/{consentId}/revoke` | - | `{ message }` | Patient revokes consent |
| GET | `/api/patient/{patientId}/consents` | - | `[ { id, doctorName, consentType, status, ... } ]` | Get patient's consents |
| GET | `/api/doctor/{doctorId}/consents` | - | `[ { id, patientName, consentType, status, ... } ]` | Get doctor's consents |

### Medical Records Endpoints

| Method | Endpoint | Request Body | Response | Description |
|--------|----------|--------------|----------|-------------|
| POST | `/api/doctor/{doctorId}/medical-record` | `{ patientId, organId, diagnosis, treatment, notes }` | `{ id, organName, diagnosis, recordedAt }` | Add medical record |
| GET | `/api/patient/{patientId}/records` | - | `[ { id, organName, diagnosis, treatment, doctorName, recordedAt } ]` | Get all patient records |
| GET | `/api/patient/{patientId}/records/organ/{organId}` | - | `[ { id, diagnosis, treatment, doctorName, recordedAt } ]` | Get records by organ |
| GET | `/api/organs` | - | `[ { id, name, description } ]` | Get all organ systems |

### Security

- **Public Endpoints**: `/api/auth/**`, `/api/organs`
- **Patient Endpoints**: `/api/patient/**` (requires `ROLE_PATIENT`)
- **Doctor Endpoints**: `/api/doctor/**` (requires `ROLE_DOCTOR`)
- **Authentication**: JWT token in `Authorization: Bearer <token>` header

---

## 🔐 Security Implementation

### 1. **Password Security**
```java
// BCrypt hashing (10 rounds)
String hashedPassword = passwordEncoder.encode(plainPassword);

// Validation
boolean matches = passwordEncoder.matches(plainPassword, hashedPassword);
```

### 2. **JWT Token Structure**
```
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "sub": "user@example.com",      // Email
  "userId": 1,                     // User ID
  "role": "PATIENT",               // Role
  "iat": 1707000000,               // Issued at
  "exp": 1707086400                // Expires (24 hours)
}

Signature:
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret_key
)
```

### 3. **Security Filter Chain**
```java
1. DisableEncodeUrlFilter
2. WebAsyncManagerIntegrationFilter
3. SecurityContextHolderFilter
4. HeaderWriterFilter
5. CorsFilter ← CORS configuration
6. LogoutFilter
7. JwtRequestFilter ← JWT validation
8. RequestCacheAwareFilter
9. SecurityContextHolderAwareRequestFilter
10. AnonymousAuthenticationFilter
11. SessionManagementFilter
12. ExceptionTranslationFilter
13. AuthorizationFilter ← Role-based access
```

### 4. **CORS Configuration**
```java
Allowed Origins: http://localhost:3000, http://localhost:3001
Allowed Methods: GET, POST, PUT, DELETE, OPTIONS
Allowed Headers: *
Allow Credentials: true
Max Age: 3600 seconds
```

### 5. **Consent Validation**
```java
// Before creating medical record
1. Check if consent exists between doctor and patient
2. Verify consent.status == APPROVED
3. Check if consent has expired (expiresAt < now)
4. If valid → allow record creation
   Else → throw UnauthorizedException
```

---

## 🎨 Frontend Components

### Component Tree

```
App.jsx (Router)
├── Login.jsx
├── Register.jsx
├── PrivateRoute.jsx (Auth Guard)
    ├── PatientDashboard.jsx
    │   ├── Consent List
    │   ├── Recent Records
    │   └── Link to AnatomyViewer
    ├── DoctorDashboard.jsx
    │   ├── Request Consent Form
    │   ├── Active Consents List
    │   └── Add Medical Record Form
    └── AnatomyViewer.jsx
        ├── HumanBody.jsx (3D Scene)
        │   ├── BodyOutline (Wireframe)
        │   └── Organ Components (14 spheres)
        └── Info Panel
            ├── Organ Legend
            └── Medical Records Timeline
```

### State Management (Zustand)

```javascript
authStore:
  - user: { userId, email, name, role }
  - token: "eyJhbGc..."
  - isAuthenticated: true/false
  - login(userData, token)
  - logout()
  - updateUser(userData)

Persisted in localStorage:
  - Key: "auth-storage"
  - Auto-restore on page reload
```

### API Client (Axios)

```javascript
// Base URL: /api (proxied to http://localhost:8080)
// Request Interceptor: Add JWT token to headers
// Response Interceptor: Handle 401 (auto-logout)

Example:
api.post('/auth/patient/register', data)
   .then(response => ...)
   .catch(error => ...)
```

---

## ⚙️ Backend Services

### Service Layer Architecture

```
AuthService
├── registerPatient(request) → Create User + Patient + JWT
├── registerDoctor(request) → Create User + Doctor + JWT
└── login(request) → Validate + Generate JWT

ConsentService
├── requestConsent(doctorId, patientEmail, type) → Create PENDING consent
├── approveConsent(patientId, consentId) → Update to APPROVED
├── revokeConsent(patientId, consentId) → Update to REVOKED
├── getPatientConsents(patientId) → List with doctor names
└── getDoctorConsents(doctorId) → List with patient names

MedicalRecordService
├── createRecord(doctorId, data) → Validate consent + Create record
├── getPatientRecords(patientId) → All records with organ/doctor names
└── getRecordsByOrgan(patientId, organId) → Filtered records

OrganService
└── getAllOrgans() → 14 predefined organ systems
```

### Business Logic Examples

#### Consent Expiry Calculation
```java
switch (consentType) {
    case ONE_TIME:
        // No expiry, auto-revoke after first use
        break;
    case SEVEN_DAYS:
        expiresAt = now + 7 days;
        break;
    case THIRTY_DAYS:
        expiresAt = now + 30 days;
        break;
    case ALWAYS:
        // Never expires
        expiresAt = null;
        break;
}
```

#### Record Creation Validation
```java
1. Find active consent between doctor and patient
2. If consent.status != APPROVED → throw exception
3. If consent.expiresAt != null && expiresAt < now → throw exception
4. If consent.type == ONE_TIME → revoke after creating record
5. Create medical_record with immutable timestamp
```

---

## 💻 Development Setup

### Prerequisites Installation

1. **Java 17**
   - Location: `C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot`
   - Set `JAVA_HOME` environment variable

2. **Maven 3.9.12**
   - Location: `C:\Users\skpotnur\Maven`
   - Add to PATH: `C:\Users\skpotnur\Maven\bin`

3. **Node.js** (Latest LTS)
   - Install from nodejs.org
   - Includes npm package manager

### Project Setup

#### Backend Setup
```powershell
# Navigate to backend
cd backend

# Set environment variables (session-based)
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;C:\Users\skpotnur\Maven\bin;$env:PATH"

# Build project
mvn clean install

# Run application
mvn spring-boot:run

# Backend runs on: http://localhost:8080
# H2 Console: http://localhost:8080/h2-console
```

#### Frontend Setup
```powershell
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Frontend runs on: http://localhost:3000
```

### Quick Start Scripts

**START-BACKEND.ps1**
```powershell
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;C:\Users\skpotnur\Maven\bin;$env:PATH"
cd backend
mvn spring-boot:run
```

**START-FRONTEND.ps1**
```powershell
cd frontend
npm run dev
```

### Database Access

**H2 Console**
- URL: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:file:./data/healthatlas`
- Username: `SA`
- Password: (blank)

**Database File Location**
- Path: `backend/data/healthatlas.mv.db`
- Size: ~50 KB (initially)

### Flyway Migrations

Located in: `backend/src/main/resources/db/migration/`

- **V1__Create_user_tables.sql**: Users, patients, doctors
- **V2__Create_consent_management_tables.sql**: Consents
- **V3__Create_medical_records_tables.sql**: Organs, medical_records, lab_reports
- **V4__Create_uploads_and_notes_tables.sql**: Uploads, notes

Migrations run automatically on application startup.

---

## 🚀 Future Enhancements

### Planned Features

#### 1. **File Upload System**
```
Feature: Upload medical documents (X-rays, scans, PDFs)
Status: Entity created, implementation pending

Tables:
- patient_uploads (ready)

Tasks:
- [ ] Implement file upload controller
- [ ] Add S3/local storage integration
- [ ] Create file viewer in frontend
- [ ] Add file type validation
- [ ] Implement virus scanning
```

#### 2. **Patient Notes System**
```
Feature: Personal health journal
Status: Entity created, implementation pending

Tables:
- patient_notes (ready)

Tasks:
- [ ] Create notes API endpoints
- [ ] Add rich text editor in frontend
- [ ] Implement search functionality
- [ ] Add tags/categories
- [ ] Enable export to PDF
```

#### 3. **Enhanced 3D Visualization**
```
Feature: More detailed anatomy models
Status: Basic implementation complete

Improvements:
- [ ] Load realistic 3D organ models (.gltf/.glb)
- [ ] Add anatomical labels
- [ ] Implement zoom to organ
- [ ] Add cross-section views
- [ ] Interactive pain/symptom mapping
- [ ] Animation for medical procedures
```

#### 4. **Email Notifications**
```
Feature: Notify users of important events
Status: Not implemented

Use Cases:
- [ ] Consent request notification
- [ ] Consent approval confirmation
- [ ] New medical record added
- [ ] Appointment reminders
- [ ] Lab results available

Technology:
- Spring Boot Mail
- Email templates (Thymeleaf)
- Background job processing
```

#### 5. **Advanced Search & Filters**
```
Feature: Find records quickly
Status: Basic retrieval implemented

Enhancements:
- [ ] Date range filtering
- [ ] Search by diagnosis keywords
- [ ] Filter by doctor
- [ ] Filter by organ system
- [ ] Sort by date/relevance
- [ ] Export filtered results
```

#### 6. **Appointment Scheduling**
```
Feature: Book doctor appointments
Status: Not implemented

New Tables:
- appointments (datetime, status, notes)
- availability (doctor schedule)

Features:
- [ ] Calendar view
- [ ] Recurring appointments
- [ ] Reminder notifications
- [ ] Video call integration
```

#### 7. **Multi-language Support**
```
Feature: Internationalization
Status: Not implemented

Languages:
- [ ] English (default)
- [ ] Spanish
- [ ] French
- [ ] Others

Implementation:
- i18next for React
- Spring MessageSource for backend
```

#### 8. **Mobile Application**
```
Feature: Native mobile apps
Status: Planning phase

Technologies:
- React Native (cross-platform)
- Or Flutter

Features:
- Same backend API
- Mobile-optimized UI
- Push notifications
- Offline mode
```

#### 9. **Analytics Dashboard**
```
Feature: Health insights
Status: Not implemented

Analytics:
- [ ] Patient health trends
- [ ] Most common diagnoses
- [ ] Doctor performance metrics
- [ ] System usage statistics
- [ ] Charts and graphs
```

#### 10. **Integration with Health Devices**
```
Feature: Import data from wearables
Status: Future consideration

Devices:
- Fitness trackers
- Blood pressure monitors
- Glucose meters
- Smart scales

APIs:
- Fitbit API
- Apple HealthKit
- Google Fit
```

### Code Improvements

#### Refactoring Opportunities

1. **Exception Handling**
   ```java
   // Add global exception handler
   @ControllerAdvice
   public class GlobalExceptionHandler {
       @ExceptionHandler(ConsentExpiredException.class)
       public ResponseEntity<ErrorResponse> handleConsentExpired(...)
   }
   ```

2. **Input Validation**
   ```java
   // Add custom validators
   @ValidDateOfBirth
   @ValidLicenseNumber
   @ValidPhoneNumber
   ```

3. **Logging**
   ```java
   // Add comprehensive logging
   @Slf4j
   public class ConsentService {
       log.info("Consent requested: doctorId={}, patientEmail={}", ...);
       log.warn("Consent expired: consentId={}", ...);
   }
   ```

4. **Unit Tests**
   ```java
   // Add test coverage
   @SpringBootTest
   class AuthServiceTest {
       @Test
       void shouldRegisterPatientSuccessfully() { ... }
       @Test
       void shouldThrowExceptionForDuplicateEmail() { ... }
   }
   ```

5. **API Documentation**
   ```java
   // Add Swagger/OpenAPI
   @OpenAPIDefinition(info = @Info(title = "Health Atlas API"))
   @Tag(name = "Authentication")
   public class AuthController { ... }
   ```

### Deployment Options

#### 1. **Local Production Build**
```bash
# Backend
mvn clean package
java -jar target/medical-history-system-1.0.0.jar

# Frontend
npm run build
serve -s dist
```

#### 2. **Docker Deployment**
```dockerfile
# Create Dockerfile for backend
# Create docker-compose.yml
# Add PostgreSQL container
# Add Nginx reverse proxy
```

#### 3. **Cloud Deployment**
```
Options:
- AWS: EC2 + RDS + S3
- Azure: App Service + Azure SQL
- Heroku: Easy deployment
- Vercel: Frontend hosting
- Railway: Full-stack hosting
```

---

## 📚 Learning Resources

### Technologies Used

1. **Spring Boot**
   - Official Docs: https://spring.io/projects/spring-boot
   - Tutorial: Spring Boot in Action

2. **React + Three.js**
   - React Docs: https://react.dev
   - React Three Fiber: https://docs.pmnd.rs/react-three-fiber

3. **JWT Authentication**
   - JWT.io: https://jwt.io
   - JJWT Library: https://github.com/jwtk/jjwt

4. **H2 Database**
   - H2 Docs: https://h2database.com

5. **Flyway**
   - Flyway Docs: https://flywaydb.org

### Development Best Practices

1. **Security**
   - Always hash passwords (never store plain text)
   - Use HTTPS in production
   - Implement rate limiting
   - Validate all user input
   - Use prepared statements (prevent SQL injection)

2. **Database**
   - Use migrations (Flyway) for version control
   - Add indexes on frequently queried columns
   - Backup database regularly
   - Use connection pooling

3. **API Design**
   - Follow REST conventions
   - Use proper HTTP status codes
   - Version your APIs (/api/v1/...)
   - Document with OpenAPI/Swagger

4. **Frontend**
   - Component composition over inheritance
   - Use state management for global state
   - Implement error boundaries
   - Optimize bundle size
   - Lazy load routes

---

## 📞 Troubleshooting Guide

### Common Issues & Solutions

#### 1. Port Already in Use
```powershell
# Kill process on port 8080
Stop-Process -Name java -Force

# Kill process on port 3000
Stop-Process -Name node -Force
```

#### 2. Maven Not Found
```powershell
# Set environment variables
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;C:\Users\skpotnur\Maven\bin;$env:PATH"
```

#### 3. CORS Errors
```java
// Verify CorsConfig.java allows your frontend origin
configuration.setAllowedOrigins(Arrays.asList(
    "http://localhost:3000",
    "http://localhost:3001"
));
```

#### 4. Database Migration Fails
```powershell
# Delete database and restart
cd backend
Remove-Item -Recurse -Force data
mvn spring-boot:run
```

#### 5. Frontend Can't Connect to Backend
```javascript
// Check Vite proxy configuration (vite.config.js)
proxy: {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true
  }
}
```

---

## 📝 Project Summary

### What We Built

**Health Atlas** is a comprehensive medical history management system featuring:

✅ **Full-Stack Architecture**
- Spring Boot REST API backend
- React + Three.js frontend
- H2 embedded database

✅ **Security Features**
- JWT authentication (24-hour tokens)
- BCrypt password hashing
- Role-based access control (PATIENT/DOCTOR)
- CORS protection
- Stateless session management

✅ **Core Functionality**
- User registration (Patient/Doctor)
- Consent-driven access control (4 types)
- Medical record management (immutable)
- 3D anatomy visualization (14 organs)
- Real-time consent approval

✅ **Data Management**
- 9 database tables
- 4 Flyway migrations
- 9 JPA repositories
- Automatic schema versioning

✅ **API Design**
- 13 REST endpoints
- Proper HTTP methods (GET, POST)
- JSON request/response
- Error handling

✅ **UI/UX**
- Responsive design
- Patient dashboard
- Doctor dashboard
- Interactive 3D viewer
- Form validation

### Technologies Mastered

- **Backend**: Spring Boot, JPA, Hibernate, Flyway, JWT
- **Frontend**: React, Three.js, Axios, Zustand, Vite
- **Database**: H2, SQL, Migrations
- **Security**: Spring Security, BCrypt, CORS
- **Tools**: Maven, npm, PowerShell, Git

### Project Statistics

- **Total Files Created**: 60+
- **Lines of Code**: ~8,000
- **Backend Classes**: 44
- **Frontend Components**: 10
- **API Endpoints**: 13
- **Database Tables**: 9
- **3D Organs**: 14

---

## 🎓 Academic Value

This project demonstrates:

1. **Software Engineering Principles**
   - MVC architecture
   - Separation of concerns
   - DRY (Don't Repeat Yourself)
   - SOLID principles

2. **Database Design**
   - Normalization
   - Foreign keys & relationships
   - Indexing strategies
   - Migration management

3. **Security Best Practices**
   - Authentication vs Authorization
   - Token-based auth
   - Password security
   - CORS & XSS prevention

4. **Full-Stack Development**
   - API design
   - State management
   - Component architecture
   - HTTP client configuration

5. **Healthcare Domain Knowledge**
   - HIPAA-like consent management
   - Patient privacy
   - Audit trail (immutable records)
   - Access control

---

## 📄 File Structure Reference

```
Health Atlas/
├── backend/
│   ├── src/main/java/com/healthatlas/
│   │   ├── controller/         # REST endpoints (3 files)
│   │   ├── service/            # Business logic (4 files)
│   │   ├── repository/         # Data access (9 files)
│   │   ├── model/              # JPA entities (9 files)
│   │   ├── dto/                # Data transfer objects (9 files)
│   │   ├── security/           # JWT & auth (3 files)
│   │   └── config/             # Configuration (3 files)
│   ├── src/main/resources/
│   │   ├── db/migration/       # Flyway SQL (4 files)
│   │   └── application.yml     # App config
│   ├── data/                   # H2 database files
│   ├── pom.xml                 # Maven dependencies
│   └── target/                 # Compiled classes
├── frontend/
│   ├── src/
│   │   ├── pages/              # Route pages (6 files)
│   │   ├── components/         # Reusable UI (2 files)
│   │   ├── api/                # Axios client (1 file)
│   │   ├── store/              # State management (1 file)
│   │   ├── App.jsx             # Main component
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── public/                 # Static assets
│   ├── node_modules/           # Dependencies
│   ├── package.json            # npm config
│   └── vite.config.js          # Build config
├── START-BACKEND.ps1           # Backend startup script
├── START-FRONTEND.ps1          # Frontend startup script
├── QUICK-START.md              # Quick start guide
├── COMPLETE_PROJECT_GUIDE.md   # Full documentation
└── PROJECT_DOCUMENTATION.md    # This file
```

---

**Created**: February 2, 2026
**Version**: 1.0.0
**Status**: Academic Project - Fully Functional
**Author**: Health Atlas Development Team

---

**End of Documentation**
