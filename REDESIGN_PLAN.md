# Imourig — Full Redesign Plan

**Goal:** Redesign the entire platform top-to-bottom with a distinctive visual identity
rooted in **Moroccan zellij** (mosaic tilework) and **Amazigh heritage**, using
square-ui (Tailwind v4 + shadcn/ui) component patterns as the technical foundation.

> **Status:** PROPOSAL — awaiting approval before any code changes. The current
> "Atlas-era" design is live and working; nothing here ships until you sign off.

---

## 0. Cultural ground rules (respect-first)

Research turned up that some Amazigh iconography is **politically/identity-charged**,
not just decorative. To honor the heritage rather than appropriate it:

- ✅ **Use** decorative craft motifs that are openly part of Moroccan design culture:
  zellij star tessellations, zigzags (rivers/rain), triangles & diamonds (protection),
  carpet/henna geometry.
- ⚠️ **Avoid as branding** the **Yaz symbol (ⵣ)** and Tifinagh-flag iconography — these
  are emblems of Amazigh identity/activism (and tied to the existing "Imurig" music/
  activist group we found). We may use Tifinagh *typography* tastefully as an accent
  (e.g. a small ⵉⵎⵓⵔⵉⴳ rendering) but never the flag/Yaz as a logo.

---

## 1. Visual identity / design system

### Palette (authentic zellij colors, in OKLCH like square-ui)
Drawn from the historic zellij palette: cobalt/Majorelle blue, emerald, saffron,
terracotta, plus warm plaster neutrals.

| Token | Color | Use |
|---|---|---|
| `--primary` | **Majorelle / cobalt blue** | primary actions, brand |
| `--accent` | **Saffron / amber** | highlights, CTAs (keeps continuity w/ current amber) |
| `--secondary` | **Emerald green** | secondary accents, "verified" |
| `--terracotta` | **Terracotta / clay** | warm sections, desert |
| `--background` | warm off-white "plaster" | page bg (not stark white) |
| `--foreground` | deep charcoal-brown | text |
| full dark-mode variant | | square-ui ships dark tokens; we'll define ours |

### Typography
- **Display/headings:** a characterful serif or high-contrast sans with North-African
  warmth (candidates: *Reem Kufi* for Arabic-influenced display, paired with a clean
  Latin sans). Keep current Raleway as fallback if we want minimal disruption.
- **Body:** keep Open Sans / switch to Inter (square-ui default) — TBD.
- Optional **Tifinagh accent** glyphs for flourish.

### Signature motif system (the "zellij" layer)
- **SVG zellij pattern library** — a small set of seamless geometric tile patterns
  (8-point star tessellation, khatim, lattice) as:
  - subtle section dividers / borders
  - hero background texture (very low opacity)
  - card hover states / "tile flip"
  - the loading skeleton shimmer
- **Marketplace metaphor:** experiences shown as *tiles* assembling into a mosaic —
  ties the name story (Imourig / authentic Morocco) to the literal zellij grid.

### Components (port/adapt from square-ui)
square-ui is Tailwind v4 + shadcn/ui (same major Tailwind as us). We'll run
`npx shadcn init` to add the scaffold (we already have the underlying Radix deps),
then bring over and re-skin:
- `button`, `badge`, `input`, `card`, `carousel`, `sheet`, `dropdown-menu`,
  `skeleton`, `slider`, `tooltip`, `separator`, `sidebar` (for portal/admin)
- the **rentals** template's `listings-panel` + `map-view` patterns → our
  experiences listing + MapLibre map (square-ui even ships nice MapLibre popup CSS)
- a **dashboard** template → upgrade the operator portal & admin

---

## 2. Page-by-page redesign scope

**Public / marketing**
1. **Homepage** — new hero (zellij-textured), mosaic experience grid, "how it works",
   featured operators, stats, testimonials, newsletter. *(proof-of-concept page)*
2. **Experiences listing** — filterable mosaic grid + optional map split-view
   (rentals pattern), zellij filter chips.
3. **Experience detail** — gallery, booking widget, operator card, reviews — re-skinned.
4. **Destinations** index + detail.
5. **Map** page.
6. **Blog** index + post.
7. **About / Contact / Tips / Suggest / World-Cup-2030 / Discover** marketing pages.
8. **Legal** (terms / privacy / affiliate) — typographic cleanup only.

**Auth** — login / signup / forgot / reset — zellij split-screen layout.

**Operator portal** — dashboard, create/edit experience, settings, submit-blog/property,
add-area — sidebar shell from a square-ui dashboard template.

**Admin** — all moderation screens — same dashboard shell, data-table polish.

**Global** — Navbar, Footer, AnnouncementBanner, CookieConsent, WhatsAppButton,
404 / error / global-error, loading skeletons.

---

## 3. Execution order (safe, incremental, all reviewable)

> Each phase ends with a green `npm run build` + `tsc`. We commit per phase so any
> phase can be rolled back without losing the rest. Vercel auto-deploys each push so
> you see progress live.

- **Phase 0 — Foundation (no visible change yet):**
  shadcn init, define the zellij OKLCH theme in `globals.css`, build the SVG zellij
  pattern components + Tifinagh logo lockup, set up fonts. Regenerate OG image + favicon
  in the new identity.
- **Phase 1 — Global chrome:** Navbar, Footer, banner, buttons/badges → new system.
- **Phase 2 — Homepage** (the showcase). ← natural place for you to react.
- **Phase 3 — Experiences listing + detail + map.**
- **Phase 4 — Destinations + blog + remaining marketing pages.**
- **Phase 5 — Auth pages.**
- **Phase 6 — Operator portal (dashboard shell).**
- **Phase 7 — Admin (dashboard shell).**
- **Phase 8 — 404/error/loading + polish + a11y + responsive pass + final build.**

---

## 4. Risks & how we manage them

- **Live app:** we work on `main` but each phase is its own commit + its own Vercel
  deploy; if a phase looks wrong you say so and I revert just that commit.
  (Optional: do it on a `redesign` branch + Vercel preview URL so production stays on
  the old design until the whole thing is ready. **Recommended.**)
- **Scope is large** (≈40+ pages). Realistically multiple working sessions. The phase
  structure means it's always shippable at a phase boundary.
- **i18n:** redesign is visual; we won't regress the existing en/fr/es/ar dictionaries.
- **Don't break bookings/auth:** logic stays; we re-skin the shells around it and
  re-verify the booking + auth flows after each relevant phase.

---

## 5. Open decisions for you

1. **Branch strategy:** redesign on a `redesign` branch w/ Vercel **preview** URL
   (production keeps current design until done) — or straight on `main` (each phase
   live immediately)?
2. **Fonts:** adopt a new display font (e.g. Reem Kufi) or keep Raleway?
3. **Dark mode:** ship light+dark (square-ui supports it) or light-only for now?
4. **Tifinagh accent:** tasteful ⵉⵎⵓⵔⵉⴳ wordmark accent — yes/no?
5. **Start point:** Phase 0→1→2 then review, or build further before showing?
