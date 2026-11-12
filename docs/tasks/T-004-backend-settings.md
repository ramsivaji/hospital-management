# T-004 — Backend Settings & DB Config

Track: **Backend** · Depends on: T-002 · Status: ⬜ Not started

---

## Goal

Configure Django for three environments (base / dev / prod) with Neon Postgres, WhiteNoise, CORS, CSRF, global error handling, and drf-spectacular.

## Acceptance Criteria

- [ ] `config/settings/base.py`, `dev.py`, `prod.py` split created
- [ ] `DATABASE_URL` parsed with `dj-database-url`; SSL required in prod
- [ ] WhiteNoise configured for static files
- [ ] `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS` read from env
- [ ] Global error handler returns `{ code, message, details }` for all 4xx/5xx
- [ ] drf-spectacular installed; `/api/docs` loads the Swagger UI
- [ ] `make migrate` runs Django migrations against Neon
- [ ] `GET /healthz` returns `{ "status": "ok" }`

## Notes
-
