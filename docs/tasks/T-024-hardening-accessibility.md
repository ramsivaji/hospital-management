# T-024 — Hardening, Accessibility & Performance

Track: **Shared** · Depends on: T-023 · Status: ⬜ Not started

---

## Goal

Secure, polish, and performance-tune the application before production launch.

## Acceptance Criteria

- [ ] Rate limiting verified on `auth/` and `appointments/` endpoints (return 429)
- [ ] Security headers set: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`
- [ ] `HTTPS` enforced; cookies are `Secure`
- [ ] No secrets or PII visible in browser network tab or server logs
- [ ] Accessibility audit: all pages pass axe-core with zero critical violations
- [ ] Keyboard navigation works for all interactive elements
- [ ] `prefers-reduced-motion` verified in both OS settings and browser
- [ ] Lighthouse score ≥ 90 on Performance, Accessibility, Best Practices
- [ ] Mobile layout checked on 375px (iPhone SE) and 390px (iPhone 14)
- [ ] `README.md` written with: live link, architecture diagram, GIF recordings of key flows
- [ ] All items in the go-live checklist in `docs/REQUIREMENTS.md` ticked

## Notes
-
