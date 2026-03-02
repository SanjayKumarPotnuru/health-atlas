# Health Atlas Backend

## Project Structure
```
backend/
├── src/main/java/com/healthatlas/
│   ├── config/           # Configuration classes
│   ├── controller/       # REST Controllers
│   ├── service/          # Business Logic
│   ├── repository/       # Data Access Layer
│   ├── model/            # Entity classes
│   ├── dto/              # Data Transfer Objects
│   ├── security/         # Security & JWT
│   ├── exception/        # Custom Exceptions
│   └── util/             # Utility classes
├── src/main/resources/
│   ├── db/migration/     # Flyway migrations
│   └── application.yml
└── pom.xml
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

The application will start on `http://localhost:8080`

### Access H2 Database Console
- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:file:./data/healthatlas`
- Username: `sa`
- Password: (leave empty)
