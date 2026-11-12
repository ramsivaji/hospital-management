# T-009 — Appointment Model & Booking Service

Track: **Backend** · Depends on: T-008 · Status: ⬜ Not started

---

## Goal

Implement the `Appointment` model with a Postgres exclusion constraint and the booking service with concurrency-safe writes.

## Acceptance Criteria

- [ ] `Appointment` model with all fields from the data model
- [ ] `btree_gist` Postgres extension enabled in migration
- [ ] Exclusion constraint: no two active appointments can overlap for the same doctor
- [ ] `BookingService.book(doctor_id, patient_id, start_at, end_at)`:
  - Uses `select_for_update` inside a transaction
  - Returns `Appointment` on success
  - Raises `SlotConflictError` on overlap → serializer returns HTTP 409
- [ ] `POST /api/v1/appointments` endpoint
- [ ] `GET /api/v1/appointments` scoped by role (patients see own, doctors see own, admins see all)
- [ ] `GET /api/v1/appointments/{id}` with role-based ownership check
- [ ] Concurrency test: N parallel booking requests for the same slot → exactly one succeeds, rest get 409
- [ ] Rate limiting on `POST appointments`

## Notes
- Error format for 409: `{ "code": "slot_conflict", "message": "...", "details": {} }`
