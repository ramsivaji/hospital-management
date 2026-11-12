# T-013 — Dashboard & CSV Reports

Track: **Backend** · Depends on: T-010 · Status: ⬜ Not started

---

## Goal

Implement the three dashboard summary endpoints and the CSV export.

## Acceptance Criteria

- [ ] `GET /api/v1/dashboard/patient` returns: upcoming appointments (next 5), past appointments (last 10)
- [ ] `GET /api/v1/dashboard/doctor` returns: today's appointments, this week's appointments, appointment count by status
- [ ] `GET /api/v1/dashboard/admin` returns: total appointments, cancellation rate, top 5 busiest doctors, top 5 busiest hours
- [ ] `GET /api/v1/reports/appointments.csv` streams a CSV with all appointment data; admin only
- [ ] All aggregations use DB queries (no Python-level loops on large datasets)
- [ ] Tests: stats match fixture data; CSV row count matches DB count
- [ ] `make contract` regenerated after adding these endpoints

## Notes
-
