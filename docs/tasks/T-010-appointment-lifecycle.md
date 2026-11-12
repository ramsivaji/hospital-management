# T-010 — Appointment Lifecycle

Track: **Backend** · Depends on: T-009 · Status: ⬜ Not started

---

## Goal

Implement status transitions (cancel, reschedule, complete, no-show) with business rules and a full audit log.

## Acceptance Criteria

- [ ] `POST /api/v1/appointments/{id}/cancel` — patient, doctor, receptionist, or admin
- [ ] `POST /api/v1/appointments/{id}/reschedule` — patient, doctor, or receptionist (new `start_at` in body)
- [ ] `POST /api/v1/appointments/{id}/complete` — doctor or admin only
- [ ] `POST /api/v1/appointments/{id}/no-show` — doctor or admin only
- [ ] Cancel and reschedule blocked within 2 hours of `start_at` (configurable via `CANCEL_WINDOW_HOURS` env var)
- [ ] Every status transition appended to `AppointmentStatusLog`
- [ ] Soft-delete on cancel: `deleted_at` set, row not removed
- [ ] Tests: each transition, window enforcement, invalid transitions (e.g. cancelling a completed appointment)

## Notes
-
