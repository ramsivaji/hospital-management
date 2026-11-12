# T-001 — Repo Setup

Track: **Shared** · Depends on: none · Status: ⬜ Not started

---

## Goal

Create the monorepo skeleton so every agent and developer can start from a clean, working baseline.

## Acceptance Criteria

- [ ] Folder structure matches `docs/ARCHITECTURE.md` section 4
- [ ] `AGENTS.md` exists at the repo root
- [ ] `Makefile` has working stubs for `dev`, `test`, `lint`, `migrate`, `contract`
- [ ] `.env.example` lists every variable from `docs/ARCHITECTURE.md` section 9
- [ ] `.github/workflows/ci.yml` skeleton exists (lint → test → contract check)
- [ ] `make test` runs without error (even if no tests exist yet)
- [ ] Initial commit on `main`

## Notes
-
