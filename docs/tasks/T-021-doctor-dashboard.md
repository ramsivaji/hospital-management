# T-021 — Doctor Dashboard

Track: **Frontend** · Depends on: T-019 · Status: ⬜ Not started

---

## Goal

Build the doctor-facing dashboard: day schedule, week calendar, patient list, notes, and status actions.

## Acceptance Criteria

- [ ] `/dashboard/doctor` route, guarded for `doctor` role
- [ ] "Today" tab: chronological list of today's appointments with patient info
- [ ] "Week" tab: 7-column calendar grid with appointment blocks
- [ ] Appointment card: patient name, time, status badge; expandable for notes
- [ ] Notes: freetext textarea per appointment; auto-saved on blur
- [ ] Actions: "Mark as Completed" and "Mark as No-Show" buttons with confirmation
- [ ] Status change reflects after TanStack Query refetch (no optimistic update required)
- [ ] Empty state for days with no appointments
- [ ] Connected to real API when T-010 is done

## Notes
-
