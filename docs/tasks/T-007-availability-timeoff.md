# T-007 — WeeklyAvailability & TimeOff

Track: **Backend** · Depends on: T-006 · Status: ⬜ Not started

---

## Goal

Allow doctors to configure their recurring weekly hours and time-off blocks.

## Acceptance Criteria

- [ ] `WeeklyAvailability` model: `doctor`, `weekday` (0–6), `start_time`, `end_time`; unique per (doctor, weekday, start_time)
- [ ] `TimeOff` model: `doctor`, `start_at`, `end_at`, `reason`
- [ ] `GET/POST /api/v1/doctors/{id}/availability` — doctor or admin only
- [ ] `GET/POST /api/v1/doctors/{id}/time-off` — doctor or admin only
- [ ] Validation: `start_time` < `end_time`; no overlapping `TimeOff` blocks for same doctor
- [ ] Tests: create, list, overlap validation, permission enforcement

## Notes
-
