# T-022 — Admin Dashboard

Track: **Frontend** · Depends on: T-015 · Status: ⬜ Not started

---

## Goal

Build the admin dashboard with animated counters, charts, data tables, and CSV export.

## Acceptance Criteria

- [ ] `/dashboard/admin` route, guarded for `admin` role
- [ ] Summary cards: total appointments, cancellation rate — numbers animate with `Counter` component (`spring.bouncy`)
- [ ] "Busiest Doctors" table: top 5 by appointment count
- [ ] "Busiest Hours" bar chart: appointment volume by hour of day
- [ ] "Recent Appointments" table: latest 20 with status badge, doctor, patient, date
- [ ] "Download CSV" button: calls `GET /reports/appointments.csv` and triggers browser download
- [ ] All numbers match backend fixtures in tests
- [ ] Skeleton loaders on first load
- [ ] Connected to real API when T-013 is done

## Notes
-
