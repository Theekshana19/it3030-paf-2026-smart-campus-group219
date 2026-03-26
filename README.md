# it3030-paf-2026-smart-campus-group219

## Backend (Spring Boot - MS SQL Server)

### Prerequisites
- Java 17
- Maven
- SQL Server running locally
- Database name: `SmartCampusDB`
- User: `sa` (see `backend/src/main/resources/application.properties` for the configured password)

### Run the backend
From the repository root:
```bash
cd backend
mvn spring-boot:run
```

### Test the DB connection endpoint
Open:
```text
GET http://localhost:8080/api/resources/test-db
```

Expected response (example):
```json
{ "connected": true, "databaseName": "SmartCampusDB" }
```

### Notes
- `spring.jpa.hibernate.ddl-auto=none` is set because tables are expected to be created by your migration/DDL SQL (as required by the assignment).
