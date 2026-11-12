# T-019 — Booking Flow

Track: **Frontend** · Depends on: T-018 · Status: ⬜ Not started

---

## Goal

Build the multi-step booking flow with directional slide transitions and friendly 409 conflict handling.

## Acceptance Criteria

- [ ] Step 1: Select date (calendar picker)
- [ ] Step 2: Select time slot (SlotPicker component, polling every 30s via TanStack Query)
- [ ] Step 3: Confirm details (doctor, date, time, patient info)
- [ ] Step 4: Success screen with booking confirmation summary
- [ ] Directional slide transition between steps (forward/backward)
- [ ] 409 conflict: show friendly toast "That slot was just taken" and refresh available slots
- [ ] Loading skeleton shown while slots load
- [ ] "Back" button navigates to previous step without losing state
- [ ] Works on MSW mocks (T-015); switched to real API once T-009 is done

## Notes
-
