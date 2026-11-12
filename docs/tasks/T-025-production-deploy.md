# T-025 — Production Deploy

Track: **Shared** · Depends on: T-024 · Status: ⬜ Not started

---

## Goal

Deploy both projects to Vercel production, run migrations on Neon production, verify the cron job, and smoke test the live system.

## Acceptance Criteria

- [ ] Django migrations applied to Neon production branch; `btree_gist` extension enabled
- [ ] All environment variables set in both Vercel production projects (not preview)
- [ ] `VITE_API_URL` on the frontend points to the production backend URL
- [ ] `CORS_ALLOWED_ORIGINS` on the backend includes the production frontend URL
- [ ] Vercel Cron visible in the backend project dashboard
- [ ] Manual `POST /api/internal/send-reminders` with `CRON_SECRET` sends a test reminder email
- [ ] Smoke test: register → login → book → cancel flow works on production URLs
- [ ] Live demo link added to `README.md`
- [ ] All 25 tasks marked Done in `docs/PROGRESS.md`

## Notes
-
