# T-006 — Specialty, DoctorProfile & Search

Track: **Backend** · Depends on: T-005 · Status: ⬜ Not started

---

## Goal

Implement the `Specialty` model, extend `DoctorProfile`, and build the doctor search/filter endpoint.

## Acceptance Criteria

- [ ] `Specialty` model with `name` and `slug`; indexed by slug
- [ ] `DoctorProfile` has `specialty` FK, `bio`, `slot_minutes`, `buffer_minutes`
- [ ] `GET /api/v1/doctors` supports:
  - Search by `name` (case-insensitive, partial)
  - Filter by `specialty` (slug)
  - Cursor or page-based pagination
- [ ] `GET /api/v1/doctors/{id}` returns full profile
- [ ] Admin CRUD for specialties (`GET/POST /admin/specialties`, `GET/PUT/DELETE /admin/specialties/{id}`)
- [ ] Search endpoint tested with pagination, name search, and specialty filter

## Notes
-
