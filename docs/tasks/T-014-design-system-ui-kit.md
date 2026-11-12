# T-014 — Design System & UI Kit

Track: **Frontend** · Depends on: T-003 · Status: ⬜ Not started

---

## Goal

Implement the design tokens, global styles, and every base UI component from `docs/DESIGN_SYSTEM.md`.

## Acceptance Criteria

- [ ] CSS custom properties (or Tailwind config) define all tokens from `DESIGN_SYSTEM.md`
- [ ] Light and dark mode implemented (using `prefers-color-scheme` + manual toggle stored in localStorage)
- [ ] Components built: `Button`, `Card`, `Modal`, `Skeleton`, `Counter`, `Badge`, `Input`, `Select`, `Avatar`, `Spinner`, `Toast`, `Tabs`, `Calendar`, `SlotPicker`
- [ ] Showcase page (`/showcase`) renders every component in both light and dark mode
- [ ] All spring presets (`spring.snappy`, `spring.smooth`, `spring.gentle`, `spring.bouncy`) defined in `src/lib/motion.ts`
- [ ] `useReducedMotion()` hook applied to every animated component; animations disabled when true
- [ ] No hardcoded colour values anywhere in components

## Notes
- Use Motion (Framer Motion) for animations and Lenis for smooth scroll.
