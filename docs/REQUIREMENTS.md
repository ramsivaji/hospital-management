# Requirements — Clinic Booking System

> Last updated: 2026-11-12  
> Format: `FR-N` = Functional Requirement · `NFR-N` = Non-Functional Requirement

---

## Functional Requirements

### FR-1 — Authentication & Roles

Users register and log in. The system supports four roles:

| Role | Description |
|---|---|
| `patient` | Books appointments, views own history |
| `doctor` | Manages availability, views own schedule |
| `receptionist` | Books appointments on behalf of patients |
| `admin` | Full access: manage doctors, specialties, view reports |

---

### FR-2 — Role-Based Access Control

Every API endpoint and every frontend route enforces role-based access. Unauthorized access returns `403 Forbidden`.

---

### FR-3 — Doctor Availability Configuration

Doctors can configure:
- Weekly recurring hours (by weekday)
- Appointment slot length (in minutes)
- Break durations between slots
- Time-off periods (leave, holidays, ad-hoc blocks)

---

### FR-4 — Doctor Discovery & Search

Patients can:
- Search doctors by **name** and **specialty**
- View available appointment slots for a chosen date
- Browse paginated, filtered doctor listings

---

### FR-5 — Dynamic Slot Computation

Available slots are computed on request as:

```
available slots = weekly availability − time off − active appointments
```

- Computed in the **clinic's configured time zone** (`CLINIC_TIMEZONE`)
- Respects slot duration, buffer/break minutes, and the booking window
- Never stored — always fresh

---

### FR-6 — Concurrency-Safe Booking (No Double-Booking)

Booking can never create two overlapping active appointments for one doctor, **even under concurrent requests**.

- Enforced by a **Postgres exclusion constraint** on doctor + time range (active statuses only)
- Application layer uses `select_for_update` to serialize writes
- Conflict response: **HTTP 409** with a clear error message

---

### FR-7 — Appointment Lifecycle & Audit Log

Every appointment has a status. Valid statuses:

```
pending → confirmed → completed
                    → no-show
       → cancelled
```

- Every status transition is recorded in `AppointmentStatusLog` (append-only)
- Logs capture: `from_status`, `to_status`, `changed_by`, `timestamp`

---

### FR-8 — Cancellation & Reschedule Window

Patients and doctors cannot cancel or reschedule within a **configurable time window** before the appointment.

- Default window: **2 hours**
- Configurable per clinic
- Requests inside the window return a clear error

---

### FR-9 — Email Notifications

| Trigger | Recipients | Timing |
|---|---|---|
| Booking confirmed | Patient | Immediately |
| Reminder | Patient | 24 hours before |
| Reminder | Patient | 1 hour before |
| Cancellation | Patient + Doctor | Immediately |
| Reschedule | Patient + Doctor | Immediately |

Reminders are sent by a **Vercel Cron job** calling `POST /api/internal/send-reminders`. They are **idempotent** — running the cron twice never sends a duplicate.

---

### FR-10 — Receptionist Booking

Receptionists can book appointments **on behalf of patients**, selecting the patient from a search before proceeding through the normal booking flow.

---

### FR-11 — Patient Dashboard

| Section | Content |
|---|---|
| Upcoming appointments | Date, time, doctor, specialty, status badge |
| Appointment history | Past appointments with status |
| Quick rebook | One-click to rebook a past appointment |

Actions available: **cancel**, **reschedule** (within window).

---

### FR-12 — Doctor Dashboard

| Section | Content |
|---|---|
| Today's schedule | List of appointments in chronological order |
| Week calendar | Visual week view with appointment blocks |
| Patient list | Linked to individual appointment records |
| Notes | Per-appointment freetext notes |

Actions available: **mark as completed**, **mark as no-show**.

---

### FR-13 — Admin Dashboard & Reports

| Section | Content |
|---|---|
| Summary totals | Total appointments, cancellation rate |
| Busiest doctors | Sorted by appointment volume |
| Busiest hours | Time-of-day heatmap |
| CSV export | Full appointment report as `reports/appointments.csv` |

---

## Non-Functional Requirements

### NFR-1 — Serverless-Safe Backend

The backend must be **stateless** and deployable as a single Vercel Serverless Function:
- ❌ No Celery workers
- ❌ No WebSockets
- ❌ No local file storage
- ✅ Background tasks via Vercel Cron

---

### NFR-2 — Idempotent Reminders

The reminder cron endpoint must be safe to call multiple times. Idempotency is enforced via timestamp columns (`reminder_24h_sent_at`, `reminder_1h_sent_at`) updated atomically in a database transaction.

---

### NFR-3 — Test Coverage

| Area | Required Coverage |
|---|---|
| Availability logic | ≥ 80% |
| Booking logic | ≥ 80% |
| Concurrency test | Required (N simultaneous requests → exactly 1 success) |

Test cases for slot generation must include:
- Normal day
- Day with time off
- Fully booked day
- DST change day
- Booking window edge case

---

### NFR-4 — Security

| Requirement | Detail |
|---|---|
| Passwords | Hashed (Django default: PBKDF2) |
| Auth tokens | JWT access in memory; refresh in `httpOnly`, `Secure`, `SameSite=Strict` cookie |
| CORS | `CORS_ALLOWED_ORIGINS` restricted to known frontend domains |
| CSRF | `CSRF_TRUSTED_ORIGINS` configured |
| Rate limiting | Applied to `auth/` and `appointments/` endpoints |
| PII in logs | No patient data in any log output |
| Secrets | All credentials via environment variables; no secrets in source code |

---

### NFR-5 — UI Quality & Accessibility

| Requirement | Detail |
|---|---|
| Visual style | Apple-like: clean, minimal, premium |
| Color modes | Light and dark mode |
| Accessibility | WCAG AA compliant |
| Animation | Spring-based motion at **60 fps** |
| Reduced motion | Full `prefers-reduced-motion` support — animations disabled gracefully |
| Animated properties | Only `transform` and `opacity` (GPU-composited, no layout thrash) |

---

### NFR-6 — API Consistency

- Uniform error response: `{ "code": "...", "message": "...", "details": {} }`
- `409` reserved for slot/booking conflicts
- OpenAPI documentation auto-served at `/api/docs` (via drf-spectacular)
- `openapi.yaml` committed and kept in sync with CI enforcement

---

### NFR-7 — Developer Experience

- **One-command local setup:** `make dev` starts both backend and frontend
- **Documented Vercel deployment:** step-by-step in `README.md`
- **CI pipeline:** lint → test → contract drift check on every push

---

## Go-Live Checklist

- [ ] All 25 tasks (T-001 to T-025) marked **Done** in `docs/PROGRESS.md`
- [ ] Neon production migrations applied; `btree_gist` extension enabled
- [ ] All environment variables set in both Vercel projects
- [ ] Vercel Cron visible; manual call with `CRON_SECRET` sends a test reminder
- [ ] Concurrency test passes against the production database
- [ ] CORS and cookies verified across both production domains
- [ ] No secrets in git history; `.env.example` is current and complete
- [ ] Accessibility, reduced-motion, and mobile layout checks complete
- [ ] `README.md` has: live demo link, architecture diagram, animation GIFs
