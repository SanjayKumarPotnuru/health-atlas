# Quick Start Guide

## Prerequisites Check
Before you begin, ensure you have:
- ✅ Java 17 or higher (`java -version`)
- ✅ Maven 3.8+ (`mvn -version`)

**No database installation needed!** H2 is embedded.

## Step 1: Build & Run (2 minutes)

```bash
# Navigate to backend folder
cd backend

# Build the project (this will also run Flyway migrations)
mvn clean install

# Start the application
mvn spring-boot:run
```

**Expected output:**
```
...
Flyway migration complete
Started HealthAtlasApplication in X.XXX seconds
H2 console available at /h2-console
```

Application is now running on `http://localhost:8080`

### Access Database Console
Visit `http://localhost:8080/h2-console` to view database directly:
- JDBC URL: `jdbc:h2:file:./data/healthatlas`
- Username: `sa`
- Password: (empty)

## Step 2: Test the API (5 minutes)

### Test 1: Register a Patient
```bash
curl -X POST http://localhost:8080/api/auth/patient/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@test.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-01",
    "gender": "MALE"
  }'
```

**Save the token from the response!**

### Test 2: Register a Doctor
```bash
curl -X POST http://localhost:8080/api/auth/doctor/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@test.com",
    "password": "doctor123",
    "firstName": "Sarah",
    "lastName": "Smith",
    "specialization": "Cardiology",
    "licenseNumber": "DOC12345"
  }'
```

**Save the token from the response!**

### Test 3: Get Organs
```bash
curl -X GET http://localhost:8080/api/organs \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Step 5: Full Workflow Test

See [API_TESTING.md](API_TESTING.md) for complete workflow:
1. Patient registration ✅
2. Doctor registration ✅
3. Doctor requests consent
4. Patient approves consent
5. Doctor adds medical record
6. Patient views medical history
7. Patient revokes consent

## Troubleshooting

### Problem: Port 8080 already in use
**Solution:**
- Change port in `application.yml`:
  ```yaml
  server:
    port: 8081
  ```

### Problem: Flyway migration fails
**Solution:**
- Delete database file:
  ```bash
  rm -r data/
  ```
- Run application again (will recreate database)

### Problem: JWT token expired
**Solution:**
- Login again to get a new token
- Tokens expire after 24 hours

## Development Tips

### Hot Reload
Spring Boot DevTools is included. Changes will auto-reload.

### View Database
```
Visit: http://localhost:8080/h2-console

JDBC URL: jdbc:h2:file:./data/healthatlas
Username: sa
Password: (empty)

-- Then run SQL queries:
SELECT * FROM users;
SELECT * FROM consents;
SELECT * FROM medical_records;
```

### API Documentation
- Use Postman or Thunder Client in VS Code
- Import endpoints from API_TESTING.md
- All endpoints require JWT token (except auth endpoints)

## What's Next?

### Option 1: Continue Backend Development
- Implement file upload for lab reports
- Add patient notes feature
- Implement search and filtering
- Add pagination

### Option 2: Start Frontend Development
- Create React app
- Integrate Three.js for 3D anatomy
- Build patient dashboard
- Build doctor dashboard

### Option 3: Testing & Documentation
- Write unit tests
- Write integration tests
- Create Postman collection
- Document API with Swagger/OpenAPI

## Need Help?

Check these files:
- [README.md](README.md) - Project overview
- [API_TESTING.md](API_TESTING.md) - Complete API reference
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Implementation details
- [backend/README.md](backend/README.md) - Backend specific docs

## Success Checklist

- [ ] Java and Maven installed
- [ ] Application starts without errors
- [ ] Can access H2 console at /h2-console
- [ ] Can register a patient
- [ ] Can register a doctor
- [ ] Can login with both accounts
- [ ] Can request and approve consent
- [ ] Can add medical records
- [ ] Can view medical records

If all checked, you're ready to demo! 🎉
