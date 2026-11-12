# Decisions Log

> Short entries only. Format: **date · decision · reason**.  
> Add a new entry every time a non-obvious choice is made.

---

## 2026-11-12 · Initial Architecture

| Decision | Choice | Reason |
|---|---|---|
| Backend hosting | Django as a stateless Vercel Serverless Function | Single platform with the frontend; Vercel free tier; no persistent workers needed |
| Background jobs | Vercel Cron → protected `POST /api/internal/send-reminders` | Replaces Celery Beat; no always-on worker needed; reminders are idempotent |
| Database | Neon Postgres (pooled URL) | Serverless-friendly connection pooling; Postgres features (exclusion constraints, `btree_gist`) |
| Double-booking guard | Postgres exclusion constraint + `select_for_update` | DB-level guarantee even if application code has a race condition |
| Slot storage | Computed on request, never persisted | Avoids stale slot rows; always reflects latest availability and bookings |
| Time zone handling | Store UTC everywhere; convert at the edge using `CLINIC_TIMEZONE` | Eliminates DST and travel-related booking bugs |
| Auth tokens | JWT access token in memory + refresh token in `httpOnly` cookie | Mitigates XSS (no token in localStorage); `httpOnly` cookie not accessible to JS |
| Live data updates | TanStack Query polling (refetch interval) | WebSockets are not supported in stateless Vercel Functions |
| API contract | `openapi.yaml` committed to repo; CI fails on drift | Single source of truth; enables parallel backend/frontend development |
| Email delivery | Resend | Simple REST API; generous free tier; reliable deliverability |
| Frontend bundler | Vite | Fast HMR; first-class TypeScript support |
| Animation library | Motion (Framer Motion) + Lenis (smooth scroll) | Spring-based physics; GPU-composited; respects `prefers-reduced-motion` |

---

<!-- Add future decisions below this line -->

## 2026-11-12 · Frontend Rollup runtime

| Decision | Choice | Reason |
|---|---|---|
| Rollup runtime | WebAssembly Rollup package | Windows Application Control blocks the native Rollup binary in this environment, while the WASM package preserves Vite compatibility. |
