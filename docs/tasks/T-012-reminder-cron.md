# T-012 — Reminder Cron Endpoint

Track: **Backend** · Depends on: T-011 · Status: ⬜ Not started

---

## Goal

Build the idempotent reminder endpoint called by Vercel Cron to send 24h and 1h email reminders.

## Acceptance Criteria

- [ ] `POST /api/internal/send-reminders` accepts only requests with `Authorization: Bearer <CRON_SECRET>`; returns `401` otherwise
- [ ] Finds all appointments where `start_at` is within 25h and `reminder_24h_sent_at IS NULL` → sends 24h reminder email → sets `reminder_24h_sent_at = now()` in a transaction
- [ ] Same logic for 1h reminder using `reminder_1h_sent_at`
- [ ] Calling the endpoint twice sends each reminder exactly once (idempotent)
- [ ] `vercel.json` in `backend/` defines cron: `{"crons":[{"path":"/api/internal/send-reminders","schedule":"0 * * * *"}]}`
- [ ] Tests: normal run sends correct emails; second run sends none; unauthorized call returns 401

## Notes
-
