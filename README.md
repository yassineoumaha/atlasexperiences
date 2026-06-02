# Imourig

A Morocco local-experiences marketplace (imourig.com). Travelers browse and request authentic
experiences (surf, cooking, desert, trekking, tours…) directly from verified
local operators — no middleman markup. Operators self-manage their listings;
admins moderate. The platform also carries a travel guide layer: destinations,
hotels, a blog, a taxi directory, and an interactive map.

## Tech stack

| Layer        | Choice                                                        |
| ------------ | ------------------------------------------------------------- |
| Framework    | Next.js 16 (App Router, Turbopack, React 19)                  |
| Styling      | Tailwind CSS v4 (`@theme inline`, no config file)             |
| Backend      | Supabase — Postgres + Auth + Storage (`@supabase/ssr`)        |
| Maps         | MapLibre GL v5 + OpenFreeMap tiles                            |
| Validation   | Zod v4 (booking + newsletter APIs)                            |
| i18n         | Custom dictionary system — `en` / `fr` / `es` / `ar` (RTL)    |
| Routing/Auth | `src/proxy.ts` (Next 16's middleware replacement)             |

> **Note on Next.js 16:** this project tracks Next 16's breaking changes. In
> particular, request middleware lives in `src/proxy.ts` (the old
> `middleware.ts` convention is deprecated — do not add it back). See
> `AGENTS.md`.

## Getting started

### 1. Prerequisites

- Node.js 20+
- A Supabase project (free tier is fine)

### 2. Install

```bash
npm install
```

### 3. Environment

Copy the example file and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

| Variable                        | Where to find it                                   |
| ------------------------------- | -------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase → Settings → API → Project URL            |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → `anon` public key      |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase → Settings → API → `service_role` (secret)|
| `NEXT_PUBLIC_SITE_URL`          | `http://localhost:3000` in dev                     |
| `ADMIN_EMAILS`                  | Comma-separated emails allowed into `/admin`       |

### 4. Database

Run the SQL files in the Supabase SQL editor **in this order** (each builds on
the previous):

1. `supabase/schema.sql` — destinations, properties, blog, newsletter, etc.
2. `supabase/experiences_schema.sql` — operators, experiences, bookings, reviews
3. `supabase/taxi_schema.sql` — taxi directory
4. `supabase/chat_schema.sql` — operator/traveler chat
5. `supabase/user_features.sql` — saved trips and user features
6. `supabase/features2_schema.sql` — ranking score and related additions
7. `supabase/security_fixes.sql` — **run last**: RLS hardening and `search_path` fixes

Then create the Storage bucket used for operator photo uploads:

- Bucket name: `experiences` (public read)

### 5. Run

```bash
npm run dev      # http://localhost:3000  (redirects to /en)
```

## Scripts

| Command         | What it does                          |
| --------------- | ------------------------------------- |
| `npm run dev`   | Start the dev server (Turbopack)      |
| `npm run build` | Production build                      |
| `npm start`     | Serve the production build            |
| `npm run lint`  | ESLint                                |

## Project layout

```
src/
  app/
    [locale]/            # all public + authed pages, per-locale
      portal/            # operator dashboard (create/edit experiences)
      admin/             # admin moderation (gated by ADMIN_EMAILS)
      auth/              # sign-in / sign-up
    api/
      booking/           # POST: price is recomputed server-side from the DB
      newsletter/        # POST: Zod-validated subscribe
    actions/             # server actions (auth, mutations)
  components/            # UI + sections
  lib/
    supabase/            # createClient (anon) + createAdminClient (service role)
    experiences-data.ts  # categories, cities (39), commission rate
  messages/              # en/fr/es/ar dictionaries
  proxy.ts               # locale redirect + auth guard + security headers
supabase/                # SQL migrations (see step 4)
scripts/
  make-og.cjs            # regenerates public/og-image.png
```

## How key pieces work

- **Auth & guarding.** `src/proxy.ts` redirects `/` to a locale, requires a
  session for `/portal` and `/bookings`, and restricts `/admin` to
  `ADMIN_EMAILS`. It also sets security headers (CSP, HSTS, X-Frame-Options).
- **Bookings are inquiry-only (MVP).** The booking API never trusts client
  prices — it reads `price_per_person` from the DB and recomputes the total,
  platform fee, and operator payout server-side. Payment is currently manual;
  Stripe fields exist in the schema but are not yet wired up.
- **Listings.** Operators create/edit experiences in `/portal`. New and edited
  listings go into an unapproved state and appear only after admin approval.
- **i18n.** Server components read a per-locale dictionary via
  `getDictionary()`. Arabic renders RTL.

## Known gaps / roadmap

- Payment processing (Stripe Connect) — schema is prepared, not yet integrated.
- Transactional email on booking (operator + traveler notifications).
- i18n coverage: marketing pages are translated; most portal/admin/legal pages
  are still English-only.
- Automated tests.
