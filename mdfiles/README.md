# Health Atlas - Interactive Medical History System

## Overview
Patient-centric medical history management system with organ-based visualization and consent-driven access control.

## Key Features
✅ **Authentication & Authorization**
- JWT-based authentication
- Role-based access (Patient, Doctor)
- Separate registration for patients and doctors

✅ **Consent Management**
- Doctor request → Patient approval workflow
- 4 consent types: One-time, 7 days, 30 days, Always
- Automatic expiry handling
- Patient can revoke consent anytime

✅ **Organ-Based Medical Records**
- 14 predefined organs
- Timeline per organ
- Immutable records (append-only)
- Treatment status tracking

✅ **Access Control**
- Doctors can ONLY access patient data with active consent
- On consent expiry, immediate access revocation
- Transparent doctor switching

## Technology Stack
- **Backend**: Spring Boot 3.2.1, Java 17
- **Database**: H2 Database (file-based, no installation needed)
- **Security**: Spring Security, JWT
- **Build Tool**: Maven

## Database Schema
```
users → patients/doctors
consents (patient-doctor relationship)
organs (predefined)
medical_records (immutable)
```

## API Endpoints

### Authentication
```
POST /api/auth/patient/register - Register patient
POST /api/auth/doctor/register  - Register doctor
POST /api/auth/login             - Login (both roles)
```

### Consent Management
```
POST   /api/doctor/{doctorId}/consent/request         - Doctor requests consent
GET    /api/doctor/{doctorId}/consents                - Doctor views consents
GET    /api/patient/{patientId}/consents              - Patient views consents
PUT    /api/patient/{patientId}/consent/{id}/approve  - Patient approves
PUT    /api/patient/{patientId}/consent/{id}/revoke   - Patient revokes
```

### Medical Records
```
GET    /api/organs                                            - Get all organs
POST   /api/doctor/{doctorId}/medical-record                  - Add record
GET    /api/patient/{patientId}/organ/{organId}/records       - Patient views organ records
GET    /api/patient/{patientId}/records                       - Patient views all records
GET    /api/doctor/{doctorId}/patient/{patientId}/organ/{organId}/records - Doctor views (with consent)
```

## Setup Instructions

### Prerequisites
- Java 17+
- Maven 3.8+

**No database installation needed!** Uses H2 in-memory database.

### Run Application
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Application runs on `http://localhost:8080`

### Access H2 Console
View database directly at: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:file:./data/healthatlas`
- Username: `sa`
- Password: (empty)

### Test the API
Use Postman or any REST client to test endpoints.

## Project Structure
```
backend/
├── src/main/java/com/healthatlas/
│   ├── config/           # Security configuration
│   ├── controller/       # REST controllers
│   ├── service/          # Business logic
│   ├── repository/       # Data access
│   ├── model/            # JPA entities
│   ├── dto/              # Request/Response DTOs
│   ├── security/         # JWT utilities
│   ├── exception/        # Exception handling
│   └── HealthAtlasApplication.java
├── src/main/resources/
│   ├── db/migration/     # Flyway SQL scripts
│   └── application.yml
└── pom.xml
```

## Key Design Decisions

### 1. Immutable Medical Records
- Records are append-only
- No editing or deletion
- Preserves medical history integrity
- Builds trust and auditability

### 2. Consent-Driven Access
- Global consent (applies to all organs)
- Immediate revocation
- Automatic expiry handling
- Doctor must re-request after expiry

### 3. Organ-Based Timeline
- Each organ has independent timeline
- Reduces cognitive load
- Clear separation of concerns
- Better UX than mixed global timeline

### 4. Interview-Ready Architecture
- Clean layered architecture
- Normalized database schema
- RESTful API design
- Production-grade security

## Future Enhancements
- File upload for lab reports
- Patient uploads and notes
- Email notifications for consent requests
- 3D anatomy UI (React + Three.js)
- Real-time updates with WebSocket
- Analytics and insights

## Security Notes
- JWT tokens expire in 24 hours
- Passwords are BCrypt encrypted
- CORS enabled for frontend integration
- Role-based endpoint protection

## Academic Context
This is an academic project demonstrating:
- Full-stack development skills (backend focus)
- Clean layered architecture
- Database design and JPA
- RESTful API design
- Security best practices (JWT, role-based access)
- Patient data privacy and consent management
- Healthcare domain understanding

**H2 Database**: Used for simplicity and portability - no external database setup required!

## License
Academic Project - Not for commercial use
