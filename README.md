# it3030-paf-2026-smart-campus-group219

## Backend (Spring Boot - MS SQL Server)

### Prerequisites
- Java 17
- Maven
- SQL Server running locally
- Database name: `SmartCampusDB`
- Environment variables: `DB_USERNAME`, `DB_PASSWORD`

### Configure environment variables
Set these before starting the backend:
- `DB_USERNAME` = your SQL Server username
- `DB_PASSWORD` = your SQL Server password

PowerShell example:
```powershell
$env:DB_USERNAME="sa"
$env:DB_PASSWORD="your_password"
```

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

### Resource module API endpoints

Resources:
- `POST /api/resources`
- `GET /api/resources`
- `GET /api/resources/{resourceId}`
- `PUT /api/resources/{resourceId}`
- `DELETE /api/resources/{resourceId}`
- `GET /api/resources/test-db`
- List supports query params: `type`, `minCapacity`, `building`, `status`, `tag`, `search`, `page`, `size`, `sortBy`, `sortDir`
- Pagination validation: `page >= 0`, `size` must be between `1` and `100` (invalid values return `400 Bad Request`)
- Sorting validation: `sortDir` must be `asc` or `desc`; `sortBy` must be one of `resourceId`, `resourceCode`, `resourceName`, `resourceType`, `building`, `floor`, `capacity`, `status`, `createdAt`, `updatedAt`

Resource tags:
- `POST /api/resource-tags`
- `GET /api/resource-tags`
- `GET /api/resource-tags/{tagId}`
- `PUT /api/resource-tags/{tagId}`
- `DELETE /api/resource-tags/{tagId}`

Resource-tag mapping:
- `POST /api/resources/{resourceId}/tags/{tagId}`
- `DELETE /api/resources/{resourceId}/tags/{tagId}`

Resource status schedules:
- `POST /api/resources/{resourceId}/status-schedules`
- `GET /api/resources/{resourceId}/status-schedules`
- `GET /api/resources/{resourceId}/status-schedules/{scheduleId}`
- `PUT /api/resources/{resourceId}/status-schedules/{scheduleId}`
- `DELETE /api/resources/{resourceId}/status-schedules/{scheduleId}`

### API smoke test guide
- Quick PowerShell checklist: `backend/docs/resource-api-smoke-test.md`
- Includes negative tests for `400 Bad Request` validation checks.
