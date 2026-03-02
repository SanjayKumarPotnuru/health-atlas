# H2 Database Configuration - Academic Project

## ✅ What Changed

The project now uses **H2 Database** instead of PostgreSQL for simplified academic use.

## 🎯 Benefits

✅ **No Database Installation Required** - H2 is embedded in the application  
✅ **Zero Configuration** - Works out of the box  
✅ **File-Based Storage** - Data persists between runs  
✅ **Built-in Console** - View/query database via web UI  
✅ **Perfect for Academic Projects** - Focus on code, not infrastructure  

---

## 📊 H2 Database Details

### Storage Mode
- **File-based**: Data stored in `./data/healthatlas.mv.db`
- **Persistent**: Data survives application restarts
- **Auto-create**: Database file created on first run

### Connection Details
```
JDBC URL: jdbc:h2:file:./data/healthatlas
Username: sa
Password: (empty)
Driver: org.h2.Driver
```

---

## 🌐 H2 Console Access

### How to Access
1. Start the application:
   ```bash
   mvn spring-boot:run
   ```

2. Open browser to:
   ```
   http://localhost:8080/h2-console
   ```

3. Login with:
   - **JDBC URL**: `jdbc:h2:file:./data/healthatlas`
   - **Username**: `sa`
   - **Password**: (leave empty)

### What You Can Do
- View all tables
- Run SQL queries
- Check data integrity
- Debug issues
- Verify migrations

---

## 🔧 Configuration Files

### application.yml
```yaml
spring:
  datasource:
    url: jdbc:h2:file:./data/healthatlas;AUTO_SERVER=TRUE
    username: sa
    password:
    driver-class-name: org.h2.Driver
  
  h2:
    console:
      enabled: true
      path: /h2-console
  
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.H2Dialect
```

### pom.xml
```xml
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
```

---

## 🗂️ Database File Location

```
Health Atlas/
├── backend/
│   └── data/
│       ├── healthatlas.mv.db      ← Database file
│       └── healthatlas.trace.db   ← Debug/trace file
```

**Note**: The `data/` folder is auto-created on first run and ignored by Git.

---

## 🧪 Development Workflows

### Reset Database (Fresh Start)
```bash
# Delete database file
rm -rf data/

# Restart application (creates new database)
mvn spring-boot:run
```

### Switch to In-Memory Mode (Testing)
Edit `application.yml`:
```yaml
datasource:
  url: jdbc:h2:mem:healthatlas  # In-memory only
```

---

## 📝 Flyway Migrations

### Migration Files
All Flyway SQL scripts in `src/main/resources/db/migration/` work with H2:
- ✅ `V1__Create_users_and_roles_tables.sql`
- ✅ `V2__Create_consent_management_tables.sql`
- ✅ `V3__Create_organ_and_medical_records_tables.sql`
- ✅ `V4__Create_patient_uploads_and_notes_tables.sql`

### Compatibility
H2 SQL syntax is highly compatible with PostgreSQL. The existing migration scripts work without modification.

---

## 🎓 Academic Use Benefits

### Interview Talking Points

**"Why H2 for this project?"**
- "For academic purposes, I used H2 to focus on clean architecture and business logic rather than infrastructure setup"
- "H2 allows easy demonstration without requiring database installation"
- "The design is database-agnostic - switching to PostgreSQL/MySQL requires only configuration changes"
- "All SQL migrations are written in standard SQL, making production migration straightforward"

### Demo Advantages
- ✅ Quick setup (no database installation)
- ✅ Portable (entire project runs anywhere with Java)
- ✅ Easy to reset/restart
- ✅ Built-in console for live demo
- ✅ No credentials/security concerns for demo

---

## 🔄 Production Migration (Future)

If you need to switch to PostgreSQL later:

### Step 1: Update pom.xml
```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
</dependency>
```

### Step 2: Update application.yml
```yaml
datasource:
  url: jdbc:postgresql://localhost:5432/healthatlas
  username: postgres
  password: your_password
  driver-class-name: org.postgresql.Driver

jpa:
  properties:
    hibernate:
      dialect: org.hibernate.dialect.PostgreSQLDialect
```

### Step 3: Remove H2 Console
```yaml
h2:
  console:
    enabled: false
```

**That's it!** Your code remains unchanged.

---

## 🚀 Quick Start Summary

```bash
# 1. Install Java 17 and Maven
winget install Microsoft.OpenJDK.17
winget install Apache.Maven

# 2. Close and reopen terminal

# 3. Run application
cd backend
mvn clean install
mvn spring-boot:run

# 4. Access application
# API: http://localhost:8080
# H2 Console: http://localhost:8080/h2-console
```

No database setup, no configuration, no problems! 🎉
