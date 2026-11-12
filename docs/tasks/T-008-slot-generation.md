# T-008 — Slot Generation Service

Track: **Backend** · Depends on: T-007 · Status: ⬜ Not started

---

## Goal

Build the service that computes available booking slots for a doctor on a given date.

## Acceptance Criteria

- [ ] `SlotService.get_slots(doctor_id, date)` returns a list of available `{start, end}` UTC datetimes
- [ ] Logic: weekly availability window → minus time-off blocks → minus active appointments → split by `slot_minutes` with `buffer_minutes` gap
- [ ] Respects `CLINIC_TIMEZONE` for the date boundary
- [ ] Respects the booking window (no slots in the past or within 2 h of now)
- [ ] `GET /api/v1/doctors/{id}/slots?date=YYYY-MM-DD` endpoint, open to authenticated users
- [ ] Unit tests:
  - [ ] Normal working day
  - [ ] Day fully covered by time off → empty list
  - [ ] Day fully booked → empty list
  - [ ] DST change day (clocks spring forward / fall back)
  - [ ] Booking window edge case (slot in the past filtered out)

## Notes
- Service lives in `backend/apps/scheduling/services.py`.
