# Smart Campus — Missing Parts Report
### Group 219 | IT3030 PAF 2026 | Generated: 2026-04-21

---

## Team Members (from Git Branches)

```
Branch: Theekshana-dev   → Module A — Resource Management
Branch: Chamodhi-dev     → Module B — Booking Management
Branch: Sulakshi-Dev     → Module C — Maintenance Tickets
Branch: Tharindu-Dev     → Module D — Smart Availability Analytics
Branch: (no branch)      → Module E — Advanced Scheduling (5th member)
```

---

## Overall Completion Summary

```
┌─────────────────────────────────────────────────────────────┐
│                 PROJECT COMPLETION OVERVIEW                  │
├──────────────────────────────────────┬────────┬─────────────┤
│ Feature                              │  Done  │ Owner       │
├──────────────────────────────────────┼────────┼─────────────┤
│ Module A — Resource Management       │  95%  ✓│ Theekshana  │
│ Module B — Booking Management        │ 100%  ✓│ Chamodi     │
│ Module C — Maintenance Tickets       │ 100%  ✓│ Sulakshi    │
│ Module D — Smart Availability        │  40%  ⚠│ Tharindu   │
│ Module E — Advanced Scheduling       │   0%  ✗│ 5th member  │
├──────────────────────────────────────┼────────┼─────────────┤
│ Auth / Login (frontend)              │   0%  ✗│ Tharindu   │
│ Dashboard (real page)                │   5%  ✗│ Unclear     │
│ Notifications (frontend)             │   0%  ✗│ Tharindu   │
│ User Management (frontend)           │   0%  ✗│ Tharindu   │
├──────────────────────────────────────┼────────┼─────────────┤
│ OVERALL PROJECT                      │  ~60%  │             │
└──────────────────────────────────────┴────────┴─────────────┘
```

---

---

## 1. MODULE D — Smart Availability Analytics
**Owner: Tharindu** | Branch: `origin/Tharindu-Dev` | Status: **40% — Incomplete**

### What EXISTS (already merged to main)
```
Backend:
  ✓ SmartAvailabilityService.java   — core availability logic
  ✓ SmartAvailabilitySnapshot.java  — DTO for availability data
  ✓ SmartAvailabilityStatus enum    — HIGH_DEMAND, BALANCED, UNDERUTILIZED

Frontend:
  ✓ SmartAvailabilityBadge.jsx      — badge shown on Resource Details page
  ✓ SmartTipsCard.jsx               — tips card on Resource Details page
  ✓ LiveInsightsPanel.jsx           — partial insights panel
```

### What is MISSING
```
Backend:
  ✗ No /api/analytics endpoint exposed to frontend
  ✗ No usage metrics API (peak times, utilization %)
  ✗ No booking pattern analysis endpoint
  ✗ No occupancy report endpoint

Frontend:
  ✗ No frontend/src/features/analytics/ folder
  ✗ No Analytics Dashboard page
  ✗ No charts or graphs (utilization trends, peak hours)
  ✗ No resource occupancy heatmap
  ✗ No usage report view
  ✗ No sidebar link to analytics page (current link is non-functional)
```

### Files to Create
```
frontend/src/features/analytics/
├── api/
│   └── analyticsApi.js
├── pages/
│   └── AnalyticsDashboardPage.jsx
└── components/
    ├── UtilizationChart.jsx
    ├── PeakHoursGraph.jsx
    ├── OccupancyHeatmap.jsx
    └── ResourceUsageSummary.jsx

backend:
  └── controller/AnalyticsController.java
      GET /api/analytics/resource-usage
      GET /api/analytics/booking-patterns
      GET /api/analytics/peak-times
```

### Route to Add
```javascript
// in router.jsx
{ path: 'analytics', element: <AnalyticsDashboardPage /> }

// in Sidebar.jsx
<NavItem to="/analytics" icon="insights" label="Analytics" />
```

---

---

## 2. MODULE E — Advanced Scheduling
**Owner: 5th member** | Branch: **NONE FOUND** | Status: **0% — Not Started**

> **CRITICAL RISK:** This module has zero code. No branch exists for it.
> This is an entire module missing from the submission.

### What EXISTS
```
  ✓ Placeholder route: /scheduling → PlaceholderPage("Status scheduling")
  ✓ Sidebar nav item linking to that placeholder
  
  That is all. Nothing else exists.
```

### What is MISSING (Everything)
```
Backend:
  ✗ No SchedulingController.java
  ✗ No SchedulingService.java
  ✗ No Scheduling entity or database table
  ✗ No Flyway migration for scheduling
  ✗ No API endpoints

Frontend:
  ✗ No frontend/src/features/scheduling/ folder
  ✗ No SchedulingPage.jsx
  ✗ No calendar view
  ✗ No bulk scheduling form
  ✗ No conflict resolution UI
  ✗ No recurring pattern creation
```

### Minimum to Build
```
Backend:
  db/migration/V12__create_schedules.sql
  entity/AdvancedSchedule.java
  controller/SchedulingController.java
      POST /api/scheduling
      GET  /api/scheduling
      PUT  /api/scheduling/{id}
      DELETE /api/scheduling/{id}
  service/SchedulingService.java
  service/impl/SchedulingServiceImpl.java

Frontend:
  frontend/src/features/scheduling/
  ├── api/schedulingApi.js
  ├── pages/SchedulingPage.jsx
  └── components/SchedulingCalendar.jsx
```

---

---

## 3. AUTHENTICATION — Frontend Missing
**Backend Owner: Tharindu** | Backend: ✓ Done | Frontend: **0% — Missing**

> **CRITICAL:** Without this, user roles (USER / ADMIN / TECHNICIAN) don't work.
> Anyone can open the app without logging in.

### What EXISTS (backend only)
```
Backend:
  ✓ AuthController.java
      POST /api/auth/google  — Google token exchange
      GET  /api/auth/me      — Get current user
  ✓ AuthService + AuthServiceImpl
  ✓ User entity with UserRole enum (USER, ADMIN, TECHNICIAN)
  ✓ GoogleAuthRequest DTO
```

### What is MISSING (frontend)
```
Frontend:
  ✗ No LoginPage.jsx
  ✗ No Google OAuth button / @react-oauth/google library
  ✗ No AuthContext (no user state across the app)
  ✗ No ProtectedRoute component
  ✗ No route guards (all routes open to anyone)
  ✗ No user profile page
  ✗ No token storage (localStorage / sessionStorage)
  ✗ No role-based UI (admin sees admin panels, user does not)
```

### Files to Create
```
frontend/src/
├── context/
│   └── AuthContext.jsx          ← stores user, token, login/logout functions
├── components/auth/
│   ├── ProtectedRoute.jsx       ← wraps routes, redirects to login if not auth'd
│   └── GoogleLoginButton.jsx    ← Google OAuth button
└── pages/
    └── LoginPage.jsx            ← full login screen

npm install @react-oauth/google   ← Google OAuth library needed
```

### Impact if Not Fixed
```
  ✗ Admin panels visible to everyone
  ✗ Any user can approve/reject bookings
  ✗ Any user can close/assign tickets
  ✗ userEmail / userName fields must be typed manually (insecure)
  ✗ No way to distinguish USER vs ADMIN vs TECHNICIAN in UI
```

---

---

## 4. DASHBOARD — Real Page Missing
**Owner: Unclear (shared responsibility)** | Status: **5% — Placeholder only**

### What EXISTS
```
  ✓ Route: / → PlaceholderPage("Dashboard")
  ✓ DashboardLayout.jsx wrapper (sidebar + header)
```

### What is MISSING
```
  ✗ No DashboardPage.jsx (real component)
  ✗ No KPI summary cards:
       Total Resources by status
       Total Bookings by status (Pending / Approved / Rejected)
       Total Tickets by status (Open / In Progress / Resolved)
  ✗ No recent activity feed
  ✗ No quick action buttons (New Booking, Report Issue)
  ✗ No system health / availability overview
  ✗ No admin shortcuts
```

### File to Create
```
frontend/src/pages/DashboardPage.jsx

Content:
  ┌──────────────────────────────────────────────┐
  │  Welcome back, [User Name]                    │
  │                                              │
  │  ┌────────┐  ┌────────┐  ┌────────┐          │
  │  │Resources│  │Bookings│  │Tickets │          │
  │  │   24   │  │  12    │  │   8    │          │
  │  │ 18 Avail│  │ 5 Pend │  │ 3 Open │          │
  │  └────────┘  └────────┘  └────────┘          │
  │                                              │
  │  Recent Activity                             │
  │  • BK-001 booking approved (2 mins ago)      │
  │  • TK-003 ticket assigned (5 mins ago)       │
  └──────────────────────────────────────────────┘
```

---

---

## 5. NOTIFICATIONS — Frontend Missing
**Backend Owner: Tharindu** | Backend: ✓ Done | Frontend: **0% — Missing**

### What EXISTS (backend only)
```
Backend:
  ✓ NotificationController.java
      GET   /api/notifications          — list user notifications
      PATCH /api/notifications/{id}/read — mark one as read
      PATCH /api/notifications/read-all  — mark all as read
  ✓ NotificationService + NotificationServiceImpl
  ✓ Notification entity with NotificationType enum
  ✓ NotificationResponse DTO
```

### What is MISSING (frontend)
```
Frontend:
  ✗ Bell icon in TopHeader.jsx is NOT clickable — just a visual decoration
  ✗ No notification dropdown panel
  ✗ No unread count badge on bell icon
  ✗ No /notifications page or route
  ✗ No NotificationList component
  ✗ No mark-as-read UI interaction
  ✗ No polling or real-time updates
```

### Files to Create
```
frontend/src/features/notifications/
├── api/notificationsApi.js
├── components/
│   ├── NotificationBell.jsx      ← bell icon with unread count badge
│   ├── NotificationDropdown.jsx  ← dropdown list on bell click
│   └── NotificationItem.jsx      ← single notification row
└── pages/
    └── NotificationsPage.jsx     ← full notifications list page

TopHeader.jsx → replace static bell icon with <NotificationBell />
```

---

---

## 6. USER MANAGEMENT — Frontend Missing
**Backend Owner: Tharindu** | Backend: ✓ Done | Frontend: **0% — Missing**

### What EXISTS (backend only)
```
Backend:
  ✓ UserController.java
      GET   /api/users           — list all users
      PATCH /api/users/{id}/role — update user role
  ✓ UserService + UserServiceImpl
  ✓ UpdateUserRoleRequest DTO
  ✓ AuthUserResponse DTO
```

### What is MISSING (frontend)
```
Frontend:
  ✗ No user management page
  ✗ No way to view all registered users
  ✗ No role change UI (assign ADMIN or TECHNICIAN via interface)
  ✗ No /users or /admin/users route
  ✗ No sidebar link
```

### Files to Create
```
frontend/src/features/users/
├── api/usersApi.js
├── pages/UserManagementPage.jsx
└── components/
    ├── UserTable.jsx
    ├── UserTableRow.jsx
    └── UserRoleSelector.jsx

router.jsx  → add route: /admin/users
Sidebar.jsx → add nav item for Admin only
```

---

---

## 7. MODULE A — Minor Cleanup
**Owner: Theekshana** | Status: **95% — Small items only**

### What is MISSING / Needs Cleanup
```
  ✗ Two old unused placeholder files still exist in repo:
       frontend/src/features/resources/pages/ResourceDetailPlaceholderPage.jsx
       frontend/src/features/resources/pages/ResourceSchedulesPlaceholderPage.jsx

  ✗ These files are NOT used in any route (real pages replaced them)
     Should be deleted to keep repo clean.
```

---

---

## Priority Order to Complete

```
  ┌─────┬──────────────────────────────────────┬──────────────┬────────┐
  │ #   │ Task                                 │ Owner        │ Impact │
  ├─────┼──────────────────────────────────────┼──────────────┼────────┤
  │  1  │ Auth / Login page (frontend)         │ Tharindu     │ HIGH   │
  │     │ → roles don't work without this      │              │        │
  ├─────┼──────────────────────────────────────┼──────────────┼────────┤
  │  2  │ Module E — Advanced Scheduling       │ 5th member   │ HIGH   │
  │     │ → 0% done, entire module missing     │              │        │
  ├─────┼──────────────────────────────────────┼──────────────┼────────┤
  │  3  │ Module D — Analytics UI              │ Tharindu     │ HIGH   │
  │     │ → backend done, just needs frontend  │              │        │
  ├─────┼──────────────────────────────────────┼──────────────┼────────┤
  │  4  │ Dashboard real page                  │ Shared       │ MEDIUM │
  │     │ → currently just a placeholder       │              │        │
  ├─────┼──────────────────────────────────────┼──────────────┼────────┤
  │  5  │ Notifications frontend               │ Tharindu     │ MEDIUM │
  │     │ → backend done, bell icon is broken  │              │        │
  ├─────┼──────────────────────────────────────┼──────────────┼────────┤
  │  6  │ User Management page                 │ Tharindu     │ LOW    │
  │     │ → admin needs UI to assign roles     │              │        │
  ├─────┼──────────────────────────────────────┼──────────────┼────────┤
  │  7  │ Clean up placeholder files           │ Theekshana   │ LOW    │
  │     │ → 2 unused files to delete           │              │        │
  └─────┴──────────────────────────────────────┴──────────────┴────────┘
```

---

## What Each Person Needs to Do

### Tharindu
```
  1. Build Login page with Google OAuth (frontend)
  2. Create AuthContext + ProtectedRoute
  3. Build Analytics Dashboard page (Module D frontend)
  4. Expose /api/analytics endpoints (Module D backend)
  5. Wire up Notification bell in TopHeader
  6. Build User Management page (admin)
```

### 5th Member (Module E)
```
  1. Create Flyway migration for scheduling table
  2. Build SchedulingService + SchedulingController
  3. Build SchedulingPage + components in frontend
  4. Replace the placeholder at /scheduling route
```

### Shared / Anyone
```
  1. Build real DashboardPage.jsx
  2. Connect it to real API data (resources, bookings, tickets counts)
```

### Theekshana
```
  1. Delete the two unused placeholder files:
     - ResourceDetailPlaceholderPage.jsx
     - ResourceSchedulesPlaceholderPage.jsx
```

---

*Report generated: 2026-04-21 | Smart Campus Group 219*
