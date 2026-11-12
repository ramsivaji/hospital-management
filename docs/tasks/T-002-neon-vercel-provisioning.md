# T-002 — Neon DB + Vercel Provisioning

Track: **Shared** · Depends on: T-001 · Status: ⬜ Not started

---

## Goal

Provision the database and both Vercel projects so a live hello-world is reachable at real URLs.

## Acceptance Criteria

- [ ] Neon Postgres database created; pooled `DATABASE_URL` stored in `.env` (not committed)
- [ ] Vercel Project 1 (frontend) created and linked to `frontend/`
- [ ] Vercel Project 2 (backend) created and linked to `backend/`
- [ ] Both projects deploy successfully (hello-world responses)
- [ ] Frontend calls `GET /healthz` on the backend and receives `200 OK`
- [ ] All env vars set in both Vercel project dashboards

## Notes
-
