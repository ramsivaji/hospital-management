# T-005 — Auth: User, JWT, Roles

Track: **Backend** · Depends on: T-004 · Status: ⬜ Not started

---

## Goal

Implement the custom User model, four roles, JWT authentication with httpOnly refresh cookie, and permission classes.

## Acceptance Criteria

- [ ] Custom `User` model with `email` as username, `role` field (`patient`, `doctor`, `receptionist`, `admin`)
- [ ] `PatientProfile` and `DoctorProfile` one-to-one models created and migrated
- [ ] `POST auth/register` creates a user + profile; validates email uniqueness
- [ ] `POST auth/login` returns JWT access token in response body + refresh token in `httpOnly` cookie
- [ ] `POST auth/refresh` rotates tokens
- [ ] `POST auth/logout` clears the cookie
- [ ] `GET auth/me` returns current user and role
- [ ] Permission classes: `IsPatient`, `IsDoctor`, `IsReceptionist`, `IsAdmin`
- [ ] Role access matrix tested (each role can/cannot hit relevant endpoints)
- [ ] Rate limiting applied to `auth/login` and `auth/register`

## Notes
- Use `djangorestframework-simplejwt` with custom cookie middleware for refresh.
