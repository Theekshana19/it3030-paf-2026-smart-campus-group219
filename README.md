# it3030-paf-2026-smart-campus-group219
##$env:DB_USERNAME="sa"; $env:DB_PASSWORD="tstc123"; .\mvnw.cmd spring-boot:run
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
- `GET /api/resource-tags` — each item may include nullable `usageCount` (number of resource mappings for that tag).
- `GET /api/resource-tags/{tagId}`
- `PUT /api/resource-tags/{tagId}`
- `DELETE /api/resource-tags/{tagId}`
- `GET /api/resource-tags/overview` — dashboard aggregates: `mostUsedTags` (top tags with `usageCount`), `untaggedResourceCount`, `totalActiveTags`.
- `POST /api/resource-tags/bulk-assign` — body `{ "resourceIds": [...], "tagIds": [...] }`; returns **200** with `mappingsCreated`, `duplicatesSkipped`, and optional `failed` entries (partial success). Duplicate `(resource, tag)` pairs are skipped, not errors.

Untagged resources (for tag management / cleanup):
- `GET /api/resources/untagged` — paged list of resources with no tag mappings. Query params align with the main resource list where applicable: `search`, `page`, `size`, `sortBy`, `sortDir` (same validation caps as `GET /api/resources`).

Resource-tag mapping:
- `POST /api/resources/{resourceId}/tags/{tagId}`
- `DELETE /api/resources/{resourceId}/tags/{tagId}`

**Operational “now” vs stored status:** `GET /api/resources` and `GET /api/resources/{id}` return `status` from the database. `smartAvailabilityStatus` reflects **current** availability: a maintenance schedule only counts as out-of-service while **server local time** is inside that row’s window `[startTime, endTime)` on the schedule’s date (half-open interval, same as overlap checks). After `endTime`, availability returns to `AVAILABLE_NOW` unless the resource’s stored `status` is `OUT_OF_SERVICE`.

Resource status schedules:
- `POST /api/resources/{resourceId}/status-schedules`
- `GET /api/resources/{resourceId}/status-schedules`
- `GET /api/resources/{resourceId}/status-schedules/{scheduleId}`
- `PUT /api/resources/{resourceId}/status-schedules/{scheduleId}`
- `DELETE /api/resources/{resourceId}/status-schedules/{scheduleId}`

Global status schedule batch (Status Scheduling overview — bulk / emergency quick actions) lives on the same controller as `GET /api/status-schedules/overview` (`StatusSchedulingOverviewController`). These return **200 OK** with a structured body for per-resource outcomes (partial success). Whole-request validation errors still return **400 Bad Request** via the global exception handler. Unknown paths under `/api` return **404** (not 500).

The overview list (default filters) hides schedule rows that are **before today** or whose **end time has passed today**; `targetStatus` uses the same half-open window rule as resource `smartAvailabilityStatus` when date filters are applied and rows remain visible.

- `POST /api/status-schedules/precheck` — classify overlaps / missing resources for a proposed window (no DB writes).
- `POST /api/status-schedules/bulk` — create one schedule per resource for a shared window; response includes `created` and `skipped`.
- `POST /api/status-schedules/emergency-override` — urgent schedules (`effectiveMode`: `IMMEDIATE` or `SCHEDULED`); same outcome shape as bulk.

`notifyAffectedUsers` on bulk/emergency requests is accepted for forward compatibility but is currently a **no-op** until the notifications module exists. For emergencies, `highPriority: true` prefixes `reason_note` with `[EMERGENCY] ` when not already present (audit/search convention).

### API smoke test guide
- Quick PowerShell checklist: `backend/docs/resource-api-smoke-test.md`
- Includes negative tests for `400 Bad Request` validation checks.
- Includes expected status code checklist for all resource-module endpoints.

### Tag management UI (manual regression)
- Open `/tag-management` (legacy `/tags` redirects there). Overview cards and tag grid load; create tag → appears in grid; bulk assign → mappings visible on resource details; delete tag removes it (mappings cascade server-side); untagged count matches `GET /api/resources/untagged` total.
- Regression: **Add Resource** / **Edit Resource** tag pickers still work; **Resources Catalogue** tag filter still works (`tagsApi` re-exports tag service calls).

## Frontend (Vite + React)

The SPA lives in `frontend/`. In development, Vite proxies `/api` to `http://localhost:8080`, so start the backend first (or API calls will fail).

From the repository root:

```bash
cd frontend
npm install
npm run dev
```

Then open the URL Vite prints (typically `http://localhost:5173`). The **Add New Resource** screen is at `/resources/new`.
