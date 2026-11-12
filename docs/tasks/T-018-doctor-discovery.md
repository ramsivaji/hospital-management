# T-018 — Doctor Discovery

Track: **Frontend** · Depends on: T-015 · Status: ⬜ Not started

---

## Goal

Build the doctor search and listing page with filter chips and a shared-element transition to the doctor profile page.

## Acceptance Criteria

- [ ] `/doctors` page: search bar + specialty filter chips
- [ ] Doctor cards with avatar, name, specialty, and "Book" CTA
- [ ] Infinite scroll or paginated list (matches API pagination)
- [ ] `/doctors/{id}` profile page: bio, slot_minutes, availability preview
- [ ] Shared-element transition: doctor card → profile page (card expands into the header)
- [ ] Filter chips animate in/out with `spring.snappy`
- [ ] Empty state: illustration + "No doctors found" message
- [ ] Works on MSW mocks (T-015); switched to real API once T-006 is done

## Notes
-
