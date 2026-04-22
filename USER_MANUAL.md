# Smart Campus System — User Manual
### Group 219 | IT3030 PAF 2026

---

## WHAT IS THIS SYSTEM?

Smart Campus helps university staff manage **campus resources** (rooms, labs, equipment).
You can **book resources**, **report problems**, and **track maintenance** — all in one place.

---

## WHO USES THIS SYSTEM?

```
┌─────────────────────────────────────────────────────────┐
│                   THREE USER TYPES                       │
│                                                          │
│  USER             ADMIN              TECHNICIAN          │
│  ────             ─────              ──────────          │
│  • Book rooms     • Approve/Reject   • See assigned      │
│  • Report issues    bookings           tickets           │
│  • View own         • Assign techs   • Resolve issues    │
│    bookings         • Close tickets  • Add comments      │
│  • Add comments   • Manage all       • Update status     │
│                     resources                            │
└─────────────────────────────────────────────────────────┘
```

---

## HOW TO ACCESS THE SYSTEM

```
Open your browser and go to:

  Local Dev:   http://localhost:5173
  Docker:      http://localhost:3000

┌──────────────────────────────────────────────────────────┐
│                    SCREEN LAYOUT                          │
│                                                          │
│  ┌──────────┬────────────────────────────────────────┐  │
│  │          │  [Top Header - Page Title + User Info]  │  │
│  │          ├────────────────────────────────────────┤  │
│  │ SIDEBAR  │                                        │  │
│  │          │                                        │  │
│  │ Dashboard│         MAIN CONTENT AREA              │  │
│  │ Resources│                                        │  │
│  │ Bookings │                                        │  │
│  │ Tickets  │                                        │  │
│  │ Settings │                                        │  │
│  │          │                                        │  │
│  └──────────┴────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

---

---

# MODULE A — RESOURCE MANAGEMENT
### "Manage Campus Facilities"

---

## WHAT ARE RESOURCES?

Resources are campus facilities: **Classrooms, Labs, Meeting Rooms, Equipment, Sports facilities.**

---

## A1 — VIEW ALL RESOURCES (Resource Catalogue)

**Who:** Everyone  
**Where:** Sidebar → Resources

```
┌──────────────────────────────────────────────────────────┐
│   Resources Catalogue                   [+ Add Resource]  │
│                                                          │
│  ┌──────────┐  ┌────────────────────────────────────┐   │
│  │ FILTERS  │  │ Name     │Type   │Capacity│ Status  │   │
│  │          │  │──────────┼───────┼────────┼─────────│   │
│  │ Type:    │  │ Lab A-201│ LAB   │  40    │AVAILABLE│   │
│  │ [All ▼]  │  │ Hall B   │ HALL  │ 200    │AVAILABLE│   │
│  │          │  │ Room C   │ CLASS │  30    │MAINTENANCE   │
│  │ Status:  │  │ Proj-001 │ EQUIP │  --    │AVAILABLE│   │
│  │ [All ▼]  │  │                                    │   │
│  │          │  │  ◀ 1  2  3 ▶      1–10 of 24      │   │
│  │ Search:  │  └────────────────────────────────────┘   │
│  │ [______] │                                            │
│  └──────────┘                                            │
└──────────────────────────────────────────────────────────┘
```

**You can filter by:**
- Resource type (Classroom, Lab, Equipment, etc.)
- Status (Available, In Maintenance, Unavailable)
- Search by name

---

## A2 — VIEW RESOURCE DETAILS

**Who:** Everyone  
**How:** Click any resource row

```
┌──────────────────────────────────────────────────────────┐
│  ← Back       Lab A-201                    [Edit] [Del]  │
│                                                          │
│  ┌─────────────────────┐  ┌───────────────────────────┐ │
│  │ Basic Info          │  │ Location & Access         │ │
│  │                     │  │                           │ │
│  │ Type:   LAB         │  │ Building: Main Block      │ │
│  │ Status: AVAILABLE   │  │ Floor:    2nd             │ │
│  │ Capacity: 40        │  │ Room No:  A-201           │ │
│  │ Tags: [IT][Science] │  │                           │ │
│  └─────────────────────┘  └───────────────────────────┘ │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Smart Availability                               │   │
│  │ Today: HIGH DEMAND  8AM-5PM                      │   │
│  │ Next free slot: 5PM onwards                      │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Status Schedules                                 │   │
│  │ Apr 15 Mon 8AM-10AM  → MAINTENANCE (AC repair)   │   │
│  │ Apr 22 Mon all day   → UNAVAILABLE (exam prep)   │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

---

## A3 — ADD NEW RESOURCE

**Who:** Admin only  
**Where:** Resources → [+ Add Resource] button

```
┌──────────────────────────────────────────────────────────┐
│  Add New Resource                                        │
│                                                          │
│  Name:      [Computer Lab A-201_____________]            │
│  Type:      [LAB ▼]                                      │
│  Capacity:  [40]                                         │
│  Status:    ( ) Available  ( ) Unavailable               │
│                                                          │
│  Building:  [Main Block___]  Floor: [2nd]                │
│  Room No:   [A-201________]                              │
│                                                          │
│  Tags:      [IT] [Science] [+ Add Tag]                   │
│                                                          │
│  Description: [______________________________________]   │
│                                                          │
│              [Cancel]          [Save Resource]           │
└──────────────────────────────────────────────────────────┘
```

**Required fields:** Name, Type, Status  
**Optional:** Capacity, Location, Tags, Description

---

## A4 — EDIT RESOURCE

**Who:** Admin only  
**How:** Resource Details page → [Edit] button  
Same form as Add, but fields are pre-filled.

---

## A5 — STATUS SCHEDULING

**Who:** Admin only  
**Where:** Resource Details → [Manage Schedules]  
Use this to **block a resource** for maintenance or exams in advance.

```
┌──────────────────────────────────────────────────────────┐
│  Status Schedules — Lab A-201                            │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ + Add New Schedule                               │   │
│  │                                                  │   │
│  │  Date:    [2026-04-22]                           │   │
│  │  From:    [08:00]        To: [17:00]             │   │
│  │  Status:  [MAINTENANCE ▼]                        │   │
│  │  Reason:  [AC system repair________________]     │   │
│  │                     [Save Schedule]              │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  Existing Schedules:                                     │
│  Apr 22  8AM–5PM   MAINTENANCE   AC repair     [Del]     │
│  Apr 29  All day   UNAVAILABLE   Exams         [Del]     │
└──────────────────────────────────────────────────────────┘
```

**Resource Status Types:**
```
  AVAILABLE     → Resource can be booked normally
  IN_MAINTENANCE → Being repaired, cannot be booked
  RESERVED      → Already taken for a period
  UNAVAILABLE   → Closed / not in use
```

---

---

# MODULE B — BOOKING MANAGEMENT
### "Reserve Campus Resources"

---

## HOW BOOKINGS WORK

```
  You (USER)          Admin           System
     │                  │               │
     │── Request ───────────────────────►│ Creates PENDING booking
     │                  │               │
     │                  │◄── Review ────│ Admin sees pending booking
     │                  │               │
     │◄── Approved ─────│               │ Status → APPROVED
     │  OR              │               │
     │◄── Rejected ─────│ (with reason) │ Status → REJECTED
     │                  │               │
     │── Cancel ─────────────────────── │ Status → CANCELLED
        (only if approved)
```

**Booking Status Colors:**
```
  PENDING   → Yellow  (waiting for admin review)
  APPROVED  → Green   (confirmed, you can use it)
  REJECTED  → Red     (not approved, see reason)
  CANCELLED → Grey    (you cancelled it)
```

---

## B1 — VIEW ALL BOOKINGS

**Who:** Users see their own | Admins see all  
**Where:** Sidebar → Bookings

```
┌──────────────────────────────────────────────────────────┐
│  Booking Management                    [+ New Booking]   │
│                                                          │
│  ┌──────────┐  ┌────────────────────────────────────┐   │
│  │ FILTERS  │  │ Ref    │Resource│ Date │Time │Status│   │
│  │          │  │────────┼────────┼──────┼─────┼──────│   │
│  │ Status:  │  │BK-001  │Lab A   │04/10 │9–11 │PEND  │   │
│  │ [All ▼]  │  │BK-002  │Hall B  │04/10 │14–16│APPVD │   │
│  │          │  │BK-003  │Room C  │04/11 │10–12│REJCT │   │
│  │ Date     │  │BK-004  │Lab A   │04/12 │8–9  │CANCL │   │
│  │ From:[__]│  │                                    │   │
│  │ To:  [__]│  │  ◀ 1  2  3 ▶      1–10 of 24      │   │
│  │          │  └────────────────────────────────────┘   │
│  │ Resource:│                                            │
│  │ [All ▼]  │                                            │
│  └──────────┘                                            │
└──────────────────────────────────────────────────────────┘
```

---

## B2 — CREATE A NEW BOOKING

**Who:** Any logged-in user  
**Where:** Bookings → [+ New Booking]

```
┌──────────────────────────────────────────────────────────┐
│  New Booking Request                                     │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Step 1: Choose Resource                           │  │
│  │                                                    │  │
│  │  Type:     [LAB ▼]   Resource: [Lab A-201 ▼]       │  │
│  │  Selected: Lab A-201 (Capacity: 40, Main Block)    │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Step 2: Pick Date & Time                          │  │
│  │                                                    │  │
│  │  Date:  [2026-04-10]                               │  │
│  │  Start: [09:00]      End: [11:00]                  │  │
│  │                                                    │  │
│  │  ⚠ CONFLICT DETECTED (if time is taken):          │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │ Lab A-201 is booked 10:00–11:30 by Dr. Silva │  │  │
│  │  │ Tip: Try after 11:30, or use Lab B-102       │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Step 3: Details                                   │  │
│  │                                                    │  │
│  │  Purpose:    [Lab session for CS3001___________]   │  │
│  │  Attendees:  [35]                                  │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│            [Cancel]           [Submit Booking]           │
└──────────────────────────────────────────────────────────┘
```

**Important rules:**
- Date must be TODAY or FUTURE (not past)
- End time must be AFTER start time
- If the resource is already booked, you'll see a smart conflict message with suggestions

---

## B3 — VIEW BOOKING DETAILS

**Who:** Owner (user) or Admin  
**How:** Click any booking row

```
┌──────────────────────────────────────────────────────────┐
│  ← Back      Booking: BK-20260410-001                   │
│                                                          │
│  ┌─────────────────────┐  ┌──────────────────────────┐  │
│  │ Booking Info        │  │ Resource Info            │  │
│  │                     │  │                          │  │
│  │ Ref: BK-20260410-001│  │ Lab A-201                │  │
│  │ Status: [PENDING]   │  │ Capacity: 40             │  │
│  │ Date: 2026-04-10    │  │ Building: Main Block     │  │
│  │ Time: 09:00–11:00   │  │ Floor: 2nd               │  │
│  │ Purpose: Lab session│  │                          │  │
│  │ Attendees: 35       │  │                          │  │
│  └─────────────────────┘  └──────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Day Timeline (visual)                            │   │
│  │  8  9  10  11  12  1PM  2   3   4   5            │   │
│  │  ░░ ██████ ░░░░░░  ████ ░░░░░░░░░░░░            │   │
│  │     ^yours        ^other booking                 │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  [Edit Booking]     [Cancel Booking]  (if you own it)   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ ADMIN PANEL (visible to admin only)              │   │
│  │                                                  │   │
│  │ Remark: [_________________________________]       │   │
│  │                                                  │   │
│  │         [✓ Approve]       [✗ Reject]             │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

---

## B4 — EDIT A BOOKING

**Who:** Owner of the booking  
**When:** Only if status is **PENDING**  
**How:** Booking Details → [Edit Booking]  
Same form as Create, with current values pre-filled.

---

## B5 — APPROVE OR REJECT (Admin only)

**Where:** Booking Details → Admin Panel (bottom section)

```
  To APPROVE:
    1. Optionally type a remark
    2. Click [✓ Approve]
    → Status changes to APPROVED
    → User gets notified

  To REJECT:
    1. Type a reason in Remark field (required)
    2. Click [✗ Reject]
    → Status changes to REJECTED
    → User gets notified with the reason
```

---

## B6 — CANCEL A BOOKING

**Who:** The booking owner  
**When:** Only if status is **APPROVED**  
**How:** Booking Details → [Cancel Booking]

---

## SMART CONFLICT DETECTION (Innovation)

When you pick a time that's already taken, instead of just saying "conflict", the system tells you:

```
  ⚠ Booking Conflict Detected

  Lab A-201 is booked 10:00–11:30 by Dr. Silva
  for 30 students (Lab session).

  Suggestions:
    • Book after 11:30 (next free: 11:30 onwards)
    • Try Lab B-102  (capacity 45, free 10:00–12:00)
    • Try Lab C-301  (capacity 35, free 10:00–12:00)
```

---

---

# MODULE C — MAINTENANCE & INCIDENT TICKETING
### "Report and Track Problems"

---

## HOW TICKETS WORK

```
  USER                ADMIN              TECHNICIAN
   │                    │                    │
   │── Report ──────────►│                   │
   │   (OPEN)            │                   │
   │                     │── Assign ─────────►│
   │                     │   (IN_PROGRESS)    │
   │                     │                   │── Resolve ──►
   │                     │◄── Resolved ───────│  (RESOLVED)
   │                     │                    │
   │                     │── Close ───────────►
   │                         (CLOSED)
   │
   │  OR: Admin can REJECT (OPEN → REJECTED)
```

**Ticket Status Colors:**
```
  OPEN        → Blue    (just reported, not yet assigned)
  IN_PROGRESS → Orange  (technician is working on it)
  RESOLVED    → Green   (technician fixed it)
  CLOSED      → Grey    (admin confirmed and closed)
  REJECTED    → Red     (invalid or duplicate report)
```

**Ticket Priority Colors:**
```
  LOW    → Green   (not urgent)
  MEDIUM → Yellow  (needs attention soon)
  HIGH   → Orange  (important)
  URGENT → Red     (fix immediately)
```

---

## C1 — VIEW ALL TICKETS

**Who:** Users see their own | Admins & Technicians see all  
**Where:** Sidebar → Incident Tickets

```
┌──────────────────────────────────────────────────────────┐
│  Incident Tickets                      [+ Report Issue]  │
│                                                          │
│  ┌──────────┐  ┌────────────────────────────────────┐   │
│  │ FILTERS  │  │Ref   │ Title          │Prior│Status │   │
│  │          │  │──────┼────────────────┼─────┼───────│   │
│  │ Status:  │  │TK-001│Projector broken│HIGH │OPEN   │   │
│  │ [All ▼]  │  │TK-002│AC not working  │MED  │IN_PROG│   │
│  │          │  │TK-003│Lights flickering│LOW  │RESOLVD│   │
│  │ Priority:│  │TK-004│Water leak      │URGNT│OPEN   │   │
│  │ [All ▼]  │  │                                    │   │
│  │          │  │ ⚠ Recurring: Projector Lab A (5x)  │   │
│  │ Category:│  │                                    │   │
│  │ [All ▼]  │  │  ◀ 1  2  3 ▶     1–10 of 18       │   │
│  │          │  └────────────────────────────────────┘   │
│  │ Search:  │                                            │
│  │ [______] │                                            │
│  └──────────┘                                            │
└──────────────────────────────────────────────────────────┘
```

**You can filter by:** Status, Priority, Category, Search keyword

---

## C2 — REPORT A NEW ISSUE

**Who:** Any logged-in user  
**Where:** Tickets → [+ Report Issue]

```
┌──────────────────────────────────────────────────────────┐
│  Report an Issue                                         │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Issue Info                                         │  │
│  │                                                    │  │
│  │ Title:    [Projector not working in Lab A_______]  │  │
│  │ Category: [IT_EQUIPMENT ▼]  Priority: [HIGH ▼]     │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Location                                           │  │
│  │                                                    │  │
│  │ Resource (optional): [Lab A-201 ▼]                 │  │
│  │ Location:  [2nd Floor, Main Building____________]   │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Description & Contact                              │  │
│  │                                                    │  │
│  │ Description:                                       │  │
│  │ [Projector shows no signal via HDMI. Tried________]│  │
│  │ [multiple cables, still no display.______________] │  │
│  │                                                    │  │
│  │ Phone: [077-1234567]  Preferred: [EMAIL ▼]         │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Photos (max 3 images)                              │  │
│  │                                                    │  │
│  │  ┌──────┐  ┌──────┐  ┌──────────────┐             │  │
│  │  │IMG 1 │  │IMG 2 │  │ + Add Photo  │             │  │
│  │  │  [x] │  │  [x] │  │              │             │  │
│  │  └──────┘  └──────┘  └──────────────┘             │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│            [Cancel]            [Submit Ticket]           │
└──────────────────────────────────────────────────────────┘
```

**Categories available:**
```
  ELECTRICAL   → Power, wiring, sockets
  PLUMBING     → Water, pipes, taps
  IT_EQUIPMENT → Computers, projectors, network
  FURNITURE    → Chairs, desks, boards
  HVAC         → Air conditioning, fans, heating
  CLEANING     → Hygiene, waste, spills
  OTHER        → Anything else
```

---

## C3 — VIEW TICKET DETAILS

**How:** Click any ticket row

```
┌──────────────────────────────────────────────────────────┐
│  ← Back    Ticket: TK-20260410-001                      │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ ⚠ RECURRING ISSUE DETECTED                       │   │
│  │ Lab A-201 Projector has 5 IT_EQUIPMENT tickets    │   │
│  │ in the last 30 days.                             │   │
│  │ Recommendation: Consider replacement or major    │   │
│  │ repair. Suggest taking out of service.           │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────┐  ┌──────────────────────────────┐ │
│  │ Ticket Info      │  │ Workflow Timeline             │ │
│  │                  │  │                              │ │
│  │ TK-20260410-001  │  │  ● OPEN       Apr 10, 9:00   │ │
│  │ Projector broken │  │  ● IN_PROGRESS Apr 10, 11:00 │ │
│  │ Category: IT_EQUIP  │  ○ RESOLVED   (pending)      │ │
│  │ Priority: HIGH   │  │  ○ CLOSED     (pending)      │ │
│  │ Status: IN_PROGRES  │                              │ │
│  │ Reporter: Silva  │  │ Assigned: Mr. Perera         │ │
│  │ Location: Lab A  │  │ Assigned: Apr 10, 11:00      │ │
│  └──────────────────┘  └──────────────────────────────┘ │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Photos                                           │   │
│  │  ┌──────┐  ┌──────┐  ┌──────┐                   │   │
│  │  │ IMG1 │  │ IMG2 │  │ IMG3 │                   │   │
│  │  └──────┘  └──────┘  └──────┘                   │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Comments (3)                                     │   │
│  │                                                  │   │
│  │  Silva (Apr 10, 9:05): "Tried restarting too"   │   │
│  │  Perera (Apr 10, 11:15): "Checking HDMI port"   │   │
│  │  Silva (Apr 10, 12:00): "Thanks!"               │   │
│  │                                                  │   │
│  │  [Write a comment..._______________] [Post]      │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ ADMIN PANEL                                      │   │
│  │                                                  │   │
│  │  Assign To: [Mr. Perera ▼]    [Assign]           │   │
│  │                                                  │   │
│  │  [✓ Close Ticket]          [✗ Reject]            │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

---

## C4 — WHAT EACH PERSON CAN DO IN TICKETS

```
  USER
  ────
  ✓ Create a ticket
  ✓ Edit ticket (only if OPEN)
  ✓ Add comments
  ✓ Edit/Delete own comments
  ✓ Upload photos (max 3)

  ADMIN
  ─────
  ✓ See all tickets
  ✓ Assign technician → IN_PROGRESS
  ✓ Reject ticket with reason → REJECTED
  ✓ Close resolved ticket → CLOSED
  ✓ Delete any comment

  TECHNICIAN
  ──────────
  ✓ See tickets assigned to them
  ✓ Resolve ticket (add resolution notes) → RESOLVED
  ✓ Add comments
```

---

## C5 — ASSIGN A TECHNICIAN (Admin only)

```
  In Ticket Details → Admin Panel:
    1. Select technician from dropdown
    2. Click [Assign]
    → Status changes from OPEN to IN_PROGRESS
    → Technician is notified
```

---

## C6 — RESOLVE A TICKET (Technician)

```
  In Ticket Details:
    1. Add resolution notes
       "Replaced HDMI cable, projector now working."
    2. Click [Resolve]
    → Status changes from IN_PROGRESS to RESOLVED
```

---

## C7 — CLOSE A TICKET (Admin)

```
  In Ticket Details → Admin Panel:
    1. Review the resolution
    2. Click [✓ Close Ticket]
    → Status changes from RESOLVED to CLOSED
```

---

## PATTERN DETECTION (Innovation)

The system automatically warns you if the same resource keeps having issues:

```
  If a resource has 3 or more tickets
  with the same category in 30 days:

  ┌──────────────────────────────────────────┐
  │ ⚠ Recurring Issue Detected              │
  │                                          │
  │ Resource:  Lab A-201 Projector           │
  │ Category:  IT_EQUIPMENT                  │
  │ Tickets (last 30 days): 5               │
  │ First seen:  2026-03-15                  │
  │ Latest:      2026-04-10                  │
  │                                          │
  │ Recommendation: Consider replacement     │
  │ or major repair. Take out of service.   │
  └──────────────────────────────────────────┘
```

---

---

# MODULE D — SMART AVAILABILITY ANALYTICS
### "See Resource Usage Insights"

> **Status: Partial** — Basic badges and tips are shown on resource details pages.

---

## WHAT IT SHOWS

On each Resource Details page you will see:

```
  ┌────────────────────────────────────┐
  │ Smart Availability                 │
  │                                    │
  │  TODAY:  [HIGH DEMAND]             │
  │  Utilisation: 85%                  │
  │  Next free slot: 5PM onwards       │
  │                                    │
  │  Tips:                             │
  │  • Peak hours: 9AM–3PM             │
  │  • Quietest day: Friday            │
  │  • Avg booking: 1.5 hours          │
  └────────────────────────────────────┘
```

**Availability Status:**
```
  HIGH_DEMAND    → Resource is almost always booked
  BALANCED       → Normal usage
  UNDERUTILIZED  → Rarely used, may be freed up
```

---

---

# MODULE E — ADVANCED SCHEDULING
### "Future Feature — Coming Soon"

> **Status: Placeholder** — This module is not yet implemented.

Planned features:
- Calendar view of all bookings
- Batch booking (book same room every Monday)
- Conflict resolution assistant
- Smart schedule suggestions

---

---

# NOTIFICATIONS

When something changes with your booking or ticket, you get a notification.

```
  Notification Types:
  ─────────────────────────────────────────────
  BOOKING_APPROVED    → Your booking was approved
  BOOKING_REJECTED    → Your booking was rejected (see reason)
  TICKET_ASSIGNED     → Your ticket has been assigned
  TICKET_RESOLVED     → Your ticket has been resolved
  TICKET_CLOSED       → Your ticket is now closed
```

Find notifications in the **Top Header** (bell icon).

---

---

# QUICK REFERENCE — ALL PAGES

```
  PAGE                 URL                    WHO CAN SEE
  ───────────────────  ─────────────────────  ───────────────
  Resource Catalogue   /resources             Everyone
  Resource Details     /resources/:id         Everyone
  Add Resource         /resources/new         Admin only
  Edit Resource        /resources/:id/edit    Admin only
  Manage Schedules     /resources/:id/schedules Admin only

  Booking List         /bookings              User=own, Admin=all
  Create Booking       /bookings/new          Any user
  Booking Details      /bookings/:id          Owner or Admin
  Edit Booking         /bookings/:id/edit     Owner (PENDING only)

  Ticket List          /tickets               User=own, Admin/Tech=all
  Report Issue         /tickets/new           Any user
  Ticket Details       /tickets/:id           Owner or Admin or Technician
  Edit Ticket          /tickets/:id/edit      Owner (OPEN only)
```

---

---

# RULES SUMMARY

```
  BOOKING RULES
  ─────────────────────────────────────────────
  ✓ Date must be today or future
  ✓ End time must be after start time
  ✗ Cannot book if resource already has APPROVED booking at same time
  ✗ Cannot edit if booking is not PENDING
  ✗ Cannot cancel unless booking is APPROVED

  TICKET RULES
  ─────────────────────────────────────────────
  ✓ Anyone can create a ticket
  ✓ Can edit ticket only while OPEN
  ✓ Can upload max 3 photos
  ✓ Can add comments at any stage
  ✓ Can only edit/delete YOUR OWN comments
  ✗ Admin can reject OPEN tickets only
  ✗ Can only resolve IN_PROGRESS tickets
  ✗ Can only close RESOLVED tickets

  RESOURCE RULES
  ─────────────────────────────────────────────
  ✓ Only Admin can add/edit/delete resources
  ✓ Only Admin can manage status schedules
  ✓ Everyone can view resources and check availability
```

---

---

# COMMON TASKS — STEP BY STEP

### "I want to book a lab for tomorrow"
```
  1. Sidebar → Bookings → [+ New Booking]
  2. Select resource type: LAB
  3. Select the lab you want
  4. Pick tomorrow's date
  5. Set start and end time
  6. Check for conflict warnings
  7. Enter purpose and number of attendees
  8. Click [Submit Booking]
  9. Wait for Admin approval (status = PENDING)
```

### "I want to report a broken projector"
```
  1. Sidebar → Incident Tickets → [+ Report Issue]
  2. Title: "Projector not working in Lab A"
  3. Category: IT_EQUIPMENT
  4. Priority: HIGH
  5. Select the resource (Lab A-201) — optional
  6. Enter the location description
  7. Describe what happened in detail
  8. Upload photos if you have them (max 3)
  9. Click [Submit Ticket]
```

### "I want to approve a booking (Admin)"
```
  1. Sidebar → Bookings
  2. Find the PENDING booking
  3. Click to open details
  4. Scroll to Admin Panel at the bottom
  5. Optionally add a remark
  6. Click [✓ Approve]
```

### "I want to assign a technician (Admin)"
```
  1. Sidebar → Incident Tickets
  2. Find the OPEN ticket
  3. Click to open details
  4. Scroll to Admin Panel at the bottom
  5. Select technician from dropdown
  6. Click [Assign]
  7. Status changes to IN_PROGRESS
```

### "I fixed the issue (Technician)"
```
  1. Find the IN_PROGRESS ticket assigned to you
  2. Open ticket details
  3. Add resolution notes: what you did to fix it
  4. Click [Resolve]
  5. Status changes to RESOLVED
  6. Admin will close it after review
```

---

*Smart Campus System — Group 219 | IT3030 PAF 2026*
