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
- Includes expected status code checklist for all resource-module endpoints.

## Frontend (Vite + React)

The SPA lives in `frontend/`. In development, Vite proxies `/api` to `http://localhost:8080`, so start the backend first (or API calls will fail).

From the repository root:

```bash
cd frontend
npm install
npm run dev
```

Then open the URL Vite prints (typically `http://localhost:5173`). The **Add New Resource** screen is at `/resources/new`.


Step 1 — Start only the database (in any terminal):


docker-compose up sqlserver db-init
Wait until you see Database ready!

Step 2 — Run backend (new terminal, inside backend folder):


cd backend
mvnw.cmd spring-boot:run
Wait until you see Started SmartCampusApplication

Step 3 — Run frontend (new terminal, inside frontend folder):


cd frontend
npm run dev
Open http://localhost:5173

Now every time you save a .java file the backend restarts automatically, and every .jsx/.css save reflects instantly in the browser — no Docker rebuild needed.