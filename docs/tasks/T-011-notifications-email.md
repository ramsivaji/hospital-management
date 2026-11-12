# T-011 — Notifications: Resend + Email Templates

Track: **Backend** · Depends on: T-010 · Status: ⬜ Not started

---

## Goal

Integrate Resend for transactional email and build all notification templates.

## Acceptance Criteria

- [ ] `RESEND_API_KEY` and `EMAIL_FROM` read from env
- [ ] `NotificationService.send(user, type, appointment)` sends email via Resend REST API
- [ ] Email templates (HTML + plain text) for:
  - [ ] Booking confirmation (to patient)
  - [ ] Cancellation (to patient + doctor)
  - [ ] Reschedule (to patient + doctor)
- [ ] `Notification` row created after each send with `sent_at` and `status`
- [ ] In development (`DEBUG=True`), emails printed to console instead of sent
- [ ] Tests use a mock Resend client; assert correct template and recipients

## Notes
- Use Python `httpx` or `requests` to call the Resend API directly (no SDK required).
