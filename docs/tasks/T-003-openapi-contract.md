# T-003 — Draft openapi.yaml

Track: **Shared** · Depends on: T-001 · Status: ⬜ Not started

---

## Goal

Write the full OpenAPI 3.1 contract covering every endpoint in `docs/ARCHITECTURE.md` section 6. This is the single interface between backend and frontend.

## Acceptance Criteria

- [ ] All endpoints, request bodies, and response schemas defined
- [ ] `openapi-typescript` generates TypeScript types without errors
- [ ] Spec validates with `npx @redocly/cli lint openapi.yaml`
- [ ] Committed to repo root as `openapi.yaml`
- [ ] `make contract` regenerates frontend types successfully

## Notes
- Schema-first: define request/response shapes before any implementation.
- Use `$ref` components for reusable schemas (Appointment, Doctor, Slot, Error, etc.).
