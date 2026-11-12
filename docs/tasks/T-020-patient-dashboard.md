# T-020 — Patient Dashboard

Track: **Frontend** · Depends on: T-019 · Status: ⬜ Not started

---

## Goal

Build the patient-facing dashboard: upcoming appointments, history, and quick rebook.

## Acceptance Criteria

- [ ] `/dashboard/patient` route, guarded for `patient` role
- [ ] "Upcoming" section: next 5 appointments with status badge, doctor info, date/time
- [ ] "History" section: past appointments with status badge; paginated or load-more
- [ ] "Quick rebook" button on past appointments: pre-fills the booking flow with same doctor
- [ ] Cancel button: opens confirmation modal; blocked within 2h with a helpful message
- [ ] Reschedule button: navigates to booking flow in reschedule mode
- [ ] Data auto-refreshes every 30s (TanStack Query refetch interval)
- [ ] Skeleton loaders shown on first load
- [ ] Connected to real API when T-010 is done

## Notes
-
