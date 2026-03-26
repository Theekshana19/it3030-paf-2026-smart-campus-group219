# it3030-paf-2026-smart-campus-group219

## Backend (Spring Boot - MS SQL Server)

### Prerequisites
- Java 17
- Maven
- SQL Server running locally
- Database name: `SmartCampusDB`
- Environment variables: `DB_USERNAME`, `DB_PASSWORD`

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
{ "connected": true, "module": "Member 1 Resources" }
```

### Notes
- `spring.jpa.hibernate.ddl-auto=none` is set because tables are expected to be created by your migration/DDL SQL (as required by the assignment).

## Member 1 Day 1 Foundation
- Member 1 backend foundation initialized.
- SQL Server connection configured for `SmartCampusDB`.
- Layered architecture package scaffold created under `lk.sliit.smartcampus`.
- Enum skeletons added for resource module status/type modeling.
- DB connectivity test endpoint added at `GET /api/resources/test-db`.
