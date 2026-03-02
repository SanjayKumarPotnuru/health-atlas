# API Testing Guide

## 1. Register a Patient
```http
POST http://localhost:8080/api/auth/patient/register
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-05-15",
  "gender": "MALE",
  "phone": "+1234567890",
  "address": "123 Main St, City, State",
  "emergencyContact": "Jane Doe",
  "emergencyPhone": "+1234567891"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "email": "john.doe@example.com",
  "role": "PATIENT",
  "userId": 1,
  "profileId": 1
}
```

## 2. Register a Doctor
```http
POST http://localhost:8080/api/auth/doctor/register
Content-Type: application/json

{
  "email": "dr.smith@hospital.com",
  "password": "doctor123",
  "firstName": "Sarah",
  "lastName": "Smith",
  "specialization": "Cardiology",
  "licenseNumber": "DOC123456",
  "phone": "+1234567892",
  "hospitalAffiliation": "City General Hospital",
  "yearsOfExperience": 10
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "email": "dr.smith@hospital.com",
  "role": "DOCTOR",
  "userId": 2,
  "profileId": 1
}
```

## 3. Login
```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

## 4. Get All Organs
```http
GET http://localhost:8080/api/organs
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "brain",
    "displayName": "Brain",
    "category": "Nervous System",
    "description": "Central nervous system control center"
  },
  {
    "id": 2,
    "name": "heart",
    "displayName": "Heart",
    "category": "Cardiovascular System",
    "description": "Pumps blood throughout the body"
  }
]
```

## 5. Doctor Requests Consent
```http
POST http://localhost:8080/api/doctor/1/consent/request
Authorization: Bearer {doctor_token}
Content-Type: application/json

{
  "patientId": 1,
  "consentType": "SEVEN_DAYS"
}
```

## 6. Patient Views Consent Requests
```http
GET http://localhost:8080/api/patient/1/consents
Authorization: Bearer {patient_token}
```

## 7. Patient Approves Consent
```http
PUT http://localhost:8080/api/patient/1/consent/1/approve
Authorization: Bearer {patient_token}
```

## 8. Doctor Adds Medical Record
```http
POST http://localhost:8080/api/doctor/1/medical-record
Authorization: Bearer {doctor_token}
Content-Type: application/json

{
  "patientId": 1,
  "organId": 2,
  "diagnosis": "Mild hypertension detected",
  "prescriptions": "Lisinopril 10mg daily",
  "clinicalNotes": "Patient advised to reduce salt intake and exercise regularly",
  "treatmentStatus": "UNDER_TREATMENT",
  "recordDate": "2026-02-02"
}
```

## 9. Patient Views Organ Records
```http
GET http://localhost:8080/api/patient/1/organ/2/records
Authorization: Bearer {patient_token}
```

## 10. Doctor Views Patient Records (with consent)
```http
GET http://localhost:8080/api/doctor/1/patient/1/organ/2/records
Authorization: Bearer {doctor_token}
```

## 11. Patient Revokes Consent
```http
PUT http://localhost:8080/api/patient/1/consent/1/revoke
Authorization: Bearer {patient_token}
```

## Testing Notes

1. **Always include Authorization header** after login:
   ```
   Authorization: Bearer {token}
   ```

2. **Consent Types:**
   - `ONE_TIME` - 1 hour access
   - `SEVEN_DAYS` - 7 days access
   - `THIRTY_DAYS` - 30 days access
   - `ALWAYS` - Permanent (until revoked)

3. **Treatment Status:**
   - `NORMAL`
   - `UNDER_TREATMENT`

4. **Gender:**
   - `MALE`
   - `FEMALE`
   - `OTHER`

5. **Error Handling:**
   - 400 - Validation errors
   - 401 - Unauthorized (invalid token)
   - 403 - Forbidden (no consent)
   - 404 - Resource not found
   - 409 - Duplicate resource

## Postman Collection
Import the following collections for easier testing:
- Authentication endpoints
- Consent management
- Medical records
