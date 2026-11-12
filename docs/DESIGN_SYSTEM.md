# Design System — Clinic Booking

> This file defines all visual and motion tokens. Components must use these values only — no hardcoded colours, sizes, or durations.

---

## Colour Palette

### Brand

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--color-brand-primary` | `#007AFF` | `#0A84FF` | Buttons, links, active states |
| `--color-brand-secondary` | `#5856D6` | `#5E5CE6` | Accents, badges |
| `--color-brand-success` | `#34C759` | `#30D158` | Confirmed, completed |
| `--color-brand-warning` | `#FF9500` | `#FF9F0A` | Pending, reminder |
| `--color-brand-danger` | `#FF3B30` | `#FF453A` | Cancel, error, no-show |

### Neutrals

| Token | Light | Dark |
|---|---|---|
| `--color-bg-primary` | `#FFFFFF` | `#000000` |
| `--color-bg-secondary` | `#F2F2F7` | `#1C1C1E` |
| `--color-bg-tertiary` | `#FFFFFF` | `#2C2C2E` |
| `--color-text-primary` | `#000000` | `#FFFFFF` |
| `--color-text-secondary` | `#3C3C43` at 60% | `#EBEBF5` at 60% |
| `--color-text-tertiary` | `#3C3C43` at 30% | `#EBEBF5` at 30% |
| `--color-separator` | `#3C3C43` at 12% | `#54545899` |

---

## Typography

| Token | Value | Usage |
|---|---|---|
| `--font-sans` | `'Inter', system-ui, sans-serif` | All UI text |
| `--font-mono` | `'JetBrains Mono', monospace` | Code, timestamps |
| `--text-xs` | `11px / 1.4` | Labels, captions |
| `--text-sm` | `13px / 1.5` | Secondary body, helper text |
| `--text-base` | `15px / 1.6` | Primary body |
| `--text-md` | `17px / 1.5` | Subheadings |
| `--text-lg` | `22px / 1.3` | Section headings |
| `--text-xl` | `28px / 1.2` | Page titles |
| `--text-2xl` | `34px / 1.1` | Hero headings |
| `--text-3xl` | `48px / 1.0` | Display / landing |
| `--font-regular` | `400` | Body text |
| `--font-medium` | `500` | Labels, nav items |
| `--font-semibold` | `600` | Buttons, headings |
| `--font-bold` | `700` | Display headings |

---

## Spacing Scale

| Token | Value |
|---|---|
| `--space-1` | `4px` |
| `--space-2` | `8px` |
| `--space-3` | `12px` |
| `--space-4` | `16px` |
| `--space-5` | `20px` |
| `--space-6` | `24px` |
| `--space-8` | `32px` |
| `--space-10` | `40px` |
| `--space-12` | `48px` |
| `--space-16` | `64px` |
| `--space-20` | `80px` |
| `--space-24` | `96px` |

---

## Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | `6px` | Chips, badges |
| `--radius-md` | `10px` | Inputs, small cards |
| `--radius-lg` | `14px` | Cards, modals |
| `--radius-xl` | `20px` | Bottom sheets, large cards |
| `--radius-full` | `9999px` | Pill buttons, avatars |

---

## Shadows

| Token | Value | Usage |
|---|---|---|
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,0.08)` | Subtle card lift |
| `--shadow-md` | `0 4px 16px rgba(0,0,0,0.10)` | Floating cards |
| `--shadow-lg` | `0 8px 32px rgba(0,0,0,0.14)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 60px rgba(0,0,0,0.18)` | Full-screen overlays |

---

## Motion Tokens (Spring Presets)

> Animate **only** `transform` and `opacity`. Never animate layout properties (width, height, padding, margin).

| Preset | Stiffness | Damping | Mass | Use case |
|---|---|---|---|---|
| `spring.snappy` | `400` | `30` | `1` | Button press, toggles |
| `spring.smooth` | `200` | `25` | `1` | Card entrances, page transitions |
| `spring.gentle` | `100` | `20` | `1` | Staggered list reveals |
| `spring.bouncy` | `500` | `20` | `1` | Success states, celebrations |

### Stagger Delays

| Token | Value | Use case |
|---|---|---|
| `--stagger-sm` | `0.04s` | List items (many) |
| `--stagger-md` | `0.07s` | Cards (few) |
| `--stagger-lg` | `0.12s` | Section reveals |

### Durations (fallback for non-spring)

| Token | Value |
|---|---|
| `--duration-fast` | `150ms` |
| `--duration-base` | `250ms` |
| `--duration-slow` | `400ms` |

> **Reduced motion:** Wrap all animations in a `useReducedMotion()` check. When `true`, set duration to `0ms` and skip spring physics.

---

## Status Badge Colours

| Status | Background | Text |
|---|---|---|
| `pending` | `--color-brand-warning` at 15% | `--color-brand-warning` |
| `confirmed` | `--color-brand-primary` at 15% | `--color-brand-primary` |
| `completed` | `--color-brand-success` at 15% | `--color-brand-success` |
| `cancelled` | `--color-brand-danger` at 15% | `--color-brand-danger` |
| `no-show` | neutral at 10% | `--color-text-secondary` |

---

## Component Library (UI Kit)

| Component | Description |
|---|---|
| `Button` | Primary · Secondary · Ghost · Danger variants; loading spinner state |
| `Card` | Elevated container with optional hover lift animation |
| `Modal` | Spring-animated overlay with backdrop blur |
| `Skeleton` | Shimmer placeholder matching the shape of real content |
| `Counter` | Animated number that springs to new value (admin dashboard) |
| `Badge` | Status pill using status badge colours above |
| `Input` | Floating label, error state, focus ring |
| `Select` | Styled dropdown with keyboard navigation |
| `Avatar` | Circular, with fallback initials |
| `Spinner` | Circular loading indicator |
| `Toast` | Slide-in notification (success / error / info) |
| `Tabs` | Animated underline indicator |
| `Calendar` | Week and day grid for doctor dashboard |
| `SlotPicker` | Date + time slot selector for booking flow |
