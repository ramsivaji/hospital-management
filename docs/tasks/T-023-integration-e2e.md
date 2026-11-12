# T-023 — Integration & End-to-End Tests

Track: **Shared** · Depends on: T-009 to T-022 · Status: ⬜ Not started

---

## Goal

Remove MSW mocks and replace with the real API. Write Playwright E2E tests for the core user journeys.

## Acceptance Criteria

- [ ] MSW disabled in production build; feature flag or env var controls it
- [ ] Playwright configured and running against a Vercel preview deployment
- [ ] E2E test: patient registers → books an appointment → sees it in dashboard
- [ ] E2E test: patient cancels the appointment → status changes to `cancelled`
- [ ] E2E test: doctor logs in → marks appointment as completed → patient dashboard reflects change
- [ ] E2E test: 409 conflict shown when two browsers try to book the same slot simultaneously
- [ ] All tests green on a Vercel preview URL
- [ ] CI pipeline runs Playwright tests after deploy

## Notes
-
