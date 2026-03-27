# Resource API Smoke Test (PowerShell)

Use this checklist after starting the backend (`http://localhost:8080`).

## 1) DB connectivity

```powershell
Invoke-RestMethod -Method GET -Uri "http://localhost:8080/api/resources/test-db"
```

Expected: response contains `connected = true`.

## 2) Create a tag

```powershell
$tag = Invoke-RestMethod -Method POST -Uri "http://localhost:8080/api/resource-tags" -ContentType "application/json" -Body '{
  "name": "Projector"
}'
$tag
```

Save `tag.tagId` for later steps.

## 3) Create a resource

```powershell
$resource = Invoke-RestMethod -Method POST -Uri "http://localhost:8080/api/resources" -ContentType "application/json" -Body '{
  "resourceCode": "LAB-B2-01",
  "resourceName": "Engineering Lab B2-01",
  "resourceType": "LAB",
  "building": "B2",
  "floor": "2",
  "capacity": 40,
  "status": "AVAILABLE",
  "description": "Lab for practical sessions"
}'
$resource
```

Save `resource.resourceId` for later steps.

## 4) Attach tag to resource

```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost:8080/api/resources/$($resource.resourceId)/tags/$($tag.tagId)"
```

Expected: success response for tag mapping.

## 5) Add a schedule

```powershell
$schedule = Invoke-RestMethod -Method POST -Uri "http://localhost:8080/api/resources/$($resource.resourceId)/status-schedules" -ContentType "application/json" -Body '{
  "scheduledDate": "2026-03-30",
  "scheduledStatus": "MAINTENANCE",
  "reason": "Routine maintenance"
}'
$schedule
```

Save `schedule.scheduleId`.

## 6) Read resources list and single resource

```powershell
Invoke-RestMethod -Method GET -Uri "http://localhost:8080/api/resources"
Invoke-RestMethod -Method GET -Uri "http://localhost:8080/api/resources/$($resource.resourceId)"
```

Optional filters:

```powershell
Invoke-RestMethod -Method GET -Uri "http://localhost:8080/api/resources?resourceType=LAB&building=B2&minCapacity=20&status=AVAILABLE&tag=Projector&search=Lab"
```

Pagination + sorting example:

```powershell
Invoke-RestMethod -Method GET -Uri "http://localhost:8080/api/resources?page=0&size=5&sortBy=resourceCode&sortDir=asc"
```

Validation note:
- `page` must be `0` or higher
- `size` must be between `1` and `100`
- `sortDir` must be `asc` or `desc`
- `sortBy` must be one of: `resourceId`, `resourceCode`, `resourceName`, `resourceType`, `building`, `floor`, `capacity`, `status`, `createdAt`, `updatedAt`

Negative checks (expected `400 Bad Request`):

```powershell
Invoke-RestMethod -Method GET -Uri "http://localhost:8080/api/resources?page=-1"
Invoke-RestMethod -Method GET -Uri "http://localhost:8080/api/resources?size=0"
Invoke-RestMethod -Method GET -Uri "http://localhost:8080/api/resources?size=101"
Invoke-RestMethod -Method GET -Uri "http://localhost:8080/api/resources?sortDir=down"
Invoke-RestMethod -Method GET -Uri "http://localhost:8080/api/resources?sortBy=invalidField"
```

## 7) Update tag and schedule

```powershell
Invoke-RestMethod -Method PUT -Uri "http://localhost:8080/api/resource-tags/$($tag.tagId)" -ContentType "application/json" -Body '{
  "name": "Projector-HD"
}'

Invoke-RestMethod -Method PUT -Uri "http://localhost:8080/api/resources/$($resource.resourceId)/status-schedules/$($schedule.scheduleId)" -ContentType "application/json" -Body '{
  "scheduledDate": "2026-03-31",
  "scheduledStatus": "UNAVAILABLE",
  "reason": "Extended maintenance"
}'
```

## 8) Cleanup (delete in dependency-safe order)

```powershell
Invoke-RestMethod -Method DELETE -Uri "http://localhost:8080/api/resources/$($resource.resourceId)/status-schedules/$($schedule.scheduleId)"
Invoke-RestMethod -Method DELETE -Uri "http://localhost:8080/api/resources/$($resource.resourceId)/tags/$($tag.tagId)"
Invoke-RestMethod -Method DELETE -Uri "http://localhost:8080/api/resource-tags/$($tag.tagId)"
Invoke-RestMethod -Method DELETE -Uri "http://localhost:8080/api/resources/$($resource.resourceId)"
```

If tag delete fails due to FK constraint, confirm mapping delete step completed successfully before deleting the tag.
