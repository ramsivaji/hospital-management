# T-015 — App Shell, Router, Providers & MSW Mocks

Track: **Frontend** · Depends on: T-003, T-014 · Status: ⬜ Not started

---

## Goal

Wire up the application skeleton: routing, auth context, API client, smooth scroll, page transitions, and MSW mocks for every backend endpoint.

## Acceptance Criteria

- [ ] React Router v6 configured with all routes from the feature list
- [ ] `AuthContext` provides current user, login, logout, and token refresh logic
- [ ] API client (`src/lib/api.ts`) generated from `openapi.yaml`; attaches JWT; handles 401 → refresh → retry
- [ ] TanStack Query configured as the global data layer
- [ ] Lenis smooth scroll initialised at the app root
- [ ] Page transition animation (directional slide) between routes using Motion
- [ ] MSW worker configured; handlers mock every endpoint defined in `openapi.yaml` with realistic fixture data
- [ ] Navigation between at least 3 pages animates correctly in the browser

## Notes
-
