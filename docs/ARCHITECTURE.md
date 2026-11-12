# Architecture — Clinic Booking System

> Last updated: 2026-11-12  
> Stack: React + Vite (frontend) · Django + DRF (backend) · Neon Postgres · Vercel · Resend

---

## 1. The Golden Rule: The Repo Is the Memory

Chat history disappears when tokens run out or you switch tools. **Nothing important may live only in a chat.** Every decision, task, and status lives in files inside the repository. Any agent, in any tool, starts a session by reading the same few files and can continue immediately.

Three principles make this work:

| Principle | Detail |
|---|---|
| **One source of truth** | `AGENTS.md` (rules) + `docs/PROGRESS.md` (status) + `docs/tasks/` (work items) |
| **Contract first** | Backend and frontend never talk directly — both obey `openapi.yaml`, enabling parallel development |
| **Small, committed steps** | One task = one branch = small commits. Commit before you stop, always. An uncommitted change is a lost change. |

---

## 2. System Architecture

```
Browser (Patient / Doctor / Admin)
        │ HTTPS
        ▼
┌───────────────────────────┐         ┌──────────────────────────────┐
│ Vercel Project 1          │  REST   │ Vercel Project 2             │
│ React + Vite + TypeScript │ ──────► │ Django + DRF (one Function)  │
│ Motion, Lenis, TanStack Q │  JSON   │ accounts · clinic ·          │
└───────────────────────────┘         │ scheduling · appointments ·  │
        ▲                             │ notifications · reports      │
        │ generated TS types          └───────┬──────────────────────┘
   openapi.yaml  ◄── make contract ───────────┘
   (THE CONTRACT)                     │ SQL          │ HTTPS
                                      ▼              ▼
                              Neon Postgres       Resend (email)
                              (pooled URL)

Vercel Cron ── POST /api/internal/send-reminders (CRON_SECRET) ──► Django
```

---

## 3. Design Decisions

> Record all future changes in `docs/DECISIONS.md`.

| Decision | Choice | Rationale |
|---|---|---|
| Backend hosting | Django as a stateless Vercel Function | Single platform with the frontend; no workers possible, so no Celery |
| Background work | Vercel Cron calling a protected endpoint | Replaces Celery Beat; reminders are idempotent via timestamp columns |
| Double-booking prevention | Postgres exclusion constraint + `select_for_update` | Database guarantees correctness even if app code has a bug |
| Slot storage | Computed on request, never stored | Availability minus bookings; no stale rows |
| Time zones | Store UTC, convert at the edge using `CLINIC_TIMEZONE` | Avoids daylight-saving and travel bugs |
| Auth | JWT access token in memory, refresh token in httpOnly cookie | Safer than localStorage |
| Live updates | Polling via TanStack Query refetch | No WebSockets on serverless |

---

## 4. Monorepo Structure

```
clinic-booking/
├── AGENTS.md                   # Rules every agent must follow (read first)
├── README.md                   # Humans: setup, deploy, screenshots
├── Makefile                    # make dev · make test · make lint · make contract · make migrate
├── openapi.yaml                # API contract — committed, regenerated from Django (never hand-edit)
├── docs/
│   ├── ARCHITECTURE.md         # This file: diagrams and decisions
│   ├── REQUIREMENTS.md         # Numbered requirements (FR-1, NFR-1 …)
│   ├── PROGRESS.md             # Live status board (update every session)
│   ├── DECISIONS.md            # Why we chose X (short entries)
│   ├── DESIGN_SYSTEM.md        # Colors, type scale, spacing, motion tokens
│   └── tasks/                  # One file per task: T-001-repo-setup.md …
├── backend/
│   ├── manage.py
│   ├── vercel.json
│   ├── config/                 # settings (base / dev / prod), urls, wsgi
│   └── apps/
│       ├── accounts/           # User, roles, JWT, profiles
│       ├── clinic/             # Specialty, DoctorProfile, search
│       ├── scheduling/         # WeeklyAvailability, TimeOff, slot service
│       ├── appointments/       # Appointment, booking service, lifecycle, audit log
│       ├── notifications/      # Email templates, reminder service, cron view
│       └── reports/            # Dashboard stats, CSV export
│           # Each app: models.py · services.py · selectors.py · serializers.py
│           #           views.py · urls.py · tests/
├── frontend/
│   ├── vercel.json
│   └── src/
│       ├── app/                # Router, providers, layouts
│       ├── api/generated/      # Types generated from openapi.yaml (never hand-edit)
│       ├── lib/                # API client, motion tokens, utils
│       ├── components/ui/      # Button, Card, Modal, Skeleton, Counter …
│       └── features/           # landing · auth · doctors · booking
│                               # dashboard-patient · dashboard-doctor · dashboard-admin
└── .github/workflows/
    └── ci.yml                  # Lint + test + contract drift check
```

> **Layering rule (backend):** `views` call `services` (writes) and `selectors` (reads).  
> Views **never** contain business logic. This keeps code predictable for any agent that opens a file cold.

---

## 5. Data Model

### Entity Relationships

```
User ──────────────┬──── PatientProfile (1-to-1)
                   └──── DoctorProfile  (1-to-1)
                              │
                    ┌─────────┴──────────┐
                    │                    │
              WeeklyAvailability      TimeOff
              (recurring hours)       (leave / holidays)

Appointment ────── doctor (FK → DoctorProfile)
            ────── patient (FK → PatientProfile)
            │
            ├── AppointmentStatusLog  (append-only audit trail)
            └── Notification          (delivery record)
```

### Models

| Model | Key Fields | Notes |
|---|---|---|
| `User` | `email` (unique), `role`, `name`, `is_active` | Custom user model from day one |
| `PatientProfile` | `user`, `dob`, `phone` | One-to-one with User |
| `DoctorProfile` | `user`, `specialty`, `bio`, `slot_minutes`, `buffer_minutes` | One-to-one with User |
| `Specialty` | `name`, `slug` | Indexed by slug |
| `WeeklyAvailability` | `doctor`, `weekday`, `start_time`, `end_time` | Unique per (doctor, weekday, start) |
| `TimeOff` | `doctor`, `start_at`, `end_at`, `reason` | Leave and holidays |
| `Appointment` | `doctor`, `patient`, `start_at`, `end_at`, `status`, `reminder_24h_sent_at`, `reminder_1h_sent_at`, `deleted_at` | **Exclusion constraint** on doctor + time range for active statuses (requires `btree_gist` extension) |
| `AppointmentStatusLog` | `appointment`, `from_status`, `to_status`, `changed_by`, `at` | Append-only audit trail |
| `Notification` | `user`, `type`, `appointment`, `sent_at`, `status` | Delivery record |

**Database indexes:**
- `Appointment(doctor, start_at)`
- `Appointment(patient, start_at)`
- `Appointment(status, start_at)` — for the reminder cron query
- `DoctorProfile(specialty)`

---

## 6. API Surface

All endpoints are prefixed with `/api/v1`.

| Area | Endpoints |
|---|---|
| **Auth** | `POST auth/register` · `POST auth/login` · `POST auth/refresh` · `POST auth/logout` · `GET auth/me` |
| **Doctors** | `GET doctors` (search, filters, pagination) · `GET doctors/{id}` · `GET doctors/{id}/slots?date=` |
| **Availability** | `GET/POST doctors/{id}/availability` · `GET/POST doctors/{id}/time-off` *(doctor or admin)* |
| **Appointments** | `POST appointments` · `GET appointments` *(scoped by role)* · `GET appointments/{id}` · `POST appointments/{id}/cancel` · `/reschedule` · `/complete` · `/no-show` |
| **Dashboards** | `GET dashboard/patient` · `GET dashboard/doctor` · `GET dashboard/admin` · `GET reports/appointments.csv` |
| **Admin** | CRUD specialties · manage doctors · book on behalf of a patient |
| **Internal** | `POST internal/send-reminders` *(cron only, `CRON_SECRET` header)* · `GET healthz` |

**Consistent error format** (all endpoints):
```json
{ "code": "...", "message": "...", "details": {} }
```
- `409` is reserved for slot conflicts.
- OpenAPI docs served at `/api/docs`.

---

## 7. Parallel Development: Contract First

Because backend and frontend only meet at `openapi.yaml`, two agents (or you and one agent) can work simultaneously without exchanging messages.

```
Track A (backend)   ──► serializers/views ──► make contract ──► openapi.yaml ◄── pulls ── Track B (frontend)
                                                                      │
                                                            generate types + MSW mocks
```

| Track | Who | Work |
|---|---|---|
| **A — Backend** | Backend agent | Builds Django to satisfy the contract, regenerates with `make contract` (drf-spectacular) |
| **B — Frontend** | Frontend agent | Generates TypeScript types + API client from the contract (openapi-typescript), develops against MSW mocks |

**Contract change process:**
1. Open a small PR touching only `openapi.yaml` + one line in `DECISIONS.md`.
2. Both sides rebase.
3. CI regenerates the contract and fails if it differs from the committed file — drift is impossible.

**Suggested parallel split:**
- One agent → T-004 to T-013 (backend)
- One agent → T-014 to T-022 (frontend)
- Sync only at T-003 (contract) and T-023 (integration)

---

## 8. Handoff System

Files that make switching tools painless:

| File | Purpose | Update when |
|---|---|---|
| `AGENTS.md` | Rules, commands, conventions | Rules change |
| `docs/PROGRESS.md` | Status board + **Next Action** line | End of every session |
| `docs/tasks/T-xxx.md` | Scope, acceptance criteria, status, notes | While working |
| `docs/DECISIONS.md` | Short log of choices and reasons | When deciding |
| `openapi.yaml` | The only thing frontend and backend share | Any API change |

---

## 9. Environment Variables

| Variable | Used by | Purpose |
|---|---|---|
| `DJANGO_SECRET_KEY` | backend | Django secret key |
| `DATABASE_URL` | backend | Neon pooled connection string (SSL required) |
| `ALLOWED_HOSTS` | backend | Frontend and preview domains |
| `CORS_ALLOWED_ORIGINS` | backend | Frontend and preview domains |
| `CSRF_TRUSTED_ORIGINS` | backend | Frontend and preview domains |
| `JWT_SIGNING_KEY` | backend | Token signing |
| `RESEND_API_KEY` | backend | Email delivery |
| `EMAIL_FROM` | backend | Sender address |
| `CRON_SECRET` | backend | Protects the reminders endpoint |
| `CLINIC_TIMEZONE` | backend | e.g. `Asia/Kolkata` |
| `VITE_API_URL` | frontend | Backend base URL |

---

## 10. Make Commands

| Command | Does |
|---|---|
| `make dev` | Run backend and frontend dev servers together |
| `make test` | Backend pytest + frontend Vitest |
| `make lint` | Ruff · mypy · ESLint · tsc |
| `make migrate` | Apply Django migrations |
| `make contract` | Regenerate `openapi.yaml` and frontend TypeScript types |
