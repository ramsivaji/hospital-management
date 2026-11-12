# T-017 — Auth Screens & Route Guards

Track: **Frontend** · Depends on: T-015 · Status: ⬜ Not started

---

## Goal

Build the register and login screens with animated forms and enforce role-based route protection.

## Acceptance Criteria

- [ ] `/register` page: name, email, password, role selector; form fields animate in with stagger
- [ ] `/login` page: email and password; spring transition on submit
- [ ] On success, redirect to the correct dashboard for the user's role
- [ ] Form validation with inline error messages (no alert dialogs)
- [ ] Loading state on the submit button (spinner, disabled)
- [ ] `RequireAuth` wrapper component: redirects to `/login` if not authenticated
- [ ] `RequireRole` wrapper: redirects to `/` if authenticated user lacks the required role
- [ ] Tests: each role routed to correct dashboard; unauthenticated redirected to login
- [ ] Connected to real API when T-005 is done; works on MSW mocks until then

## Notes
-
