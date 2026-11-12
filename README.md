# Clinic Booking System

A full-stack clinic appointment booking platform built with **React + Vite + TypeScript** (frontend) and **Django + Django REST Framework** (backend), backed by **Neon Postgres** and deployed to **Vercel**.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TypeScript, TanStack Query, Framer Motion, Lenis |
| Backend | Django 4.2, Django REST Framework, drf-spectacular |
| Database | Neon Postgres (serverless, SSL) |
| Auth | JWT (access in memory, refresh in httpOnly cookie) |
| Email | Resend |
| Hosting | Vercel (frontend + backend as a Function) |
| CI | GitHub Actions |

---

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 20+
- `make` (Git Bash / WSL on Windows)

### Setup

```bash
# 1. Clone
git clone <repo-url>
cd clinic-booking

# 2. Backend
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements-dev.txt
cp ../.env.example ../.env
# Edit .env with your values
make migrate

# 3. Frontend
cd ../frontend
npm install

# 4. Run both together
make dev
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

| Variable | Description |
|---|---|
| `DJANGO_SECRET_KEY` | Django secret key (generate with `python -c "import secrets; print(secrets.token_urlsafe(50))"`) |
| `DATABASE_URL` | Neon Postgres connection string (SSL required) |
| `ALLOWED_HOSTS` | Comma-separated allowed hosts |
| `CORS_ALLOWED_ORIGINS` | Comma-separated CORS origins |
| `CSRF_TRUSTED_ORIGINS` | Comma-separated CSRF trusted origins |
| `JWT_SIGNING_KEY` | JWT signing key |
| `RESEND_API_KEY` | Resend API key for email delivery |
| `EMAIL_FROM` | Sender email address |
| `CRON_SECRET` | Secret to protect the internal cron endpoint |
| `CLINIC_TIMEZONE` | Timezone for slot display (e.g. `Asia/Kolkata`) |
| `CANCEL_WINDOW_HOURS` | Hours before appointment that cancellation is allowed |
| `VITE_API_URL` | Backend base URL for the frontend |

---

## Make Commands

| Command | Description |
|---|---|
| `make dev` | Run backend and frontend dev servers together |
| `make test` | Backend pytest + frontend Vitest |
| `make lint` | Ruff · ESLint |
| `make migrate` | Apply Django migrations |
| `make contract` | Regenerate `openapi.yaml` and frontend TypeScript types |

---

## Project Structure

```
clinic-booking/
├── backend/          # Django + DRF API
├── frontend/         # React + Vite SPA
├── openapi.yaml      # API contract (never hand-edit)
├── Makefile
└── docs/             # Architecture, requirements, tasks
```

## API Docs

When running locally, visit [http://localhost:8000/api/docs/](http://localhost:8000/api/docs/) for the Swagger UI.

## Vercel deployment

Deploy the two projects separately:

1. Import the repository into Vercel and set the frontend project root directory to
   `frontend`. The included [`frontend/vercel.json`](frontend/vercel.json) builds
   the Vite app and preserves client-side routes.
2. Set `VITE_API_URL` in the frontend Vercel project to the deployed backend URL,
   including `https://` and without a trailing slash.
3. Set `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, and `CSRF_TRUSTED_ORIGINS` in the
   backend Vercel project. Include the frontend's production URL in the two
   origin variables.
4. Set `DATABASE_URL`, `DJANGO_SECRET_KEY`, and `JWT_SIGNING_KEY` in the backend
   project before deploying.

If `VITE_API_URL` is missing in a production build, the frontend falls back to its
own origin rather than calling `localhost`; the backend URL should still be
configured for a split frontend/backend deployment.
