# Implementation Status

> Last updated: **2026-10-22** · Commit: `e442fc5` (+ 1 uncommitted Hero change)

## Stage Summary

**Stage: Feature-complete frontend over a Phase-1 backend.**

The UI surface for the whole product is built and routed. The backend implements the
read-side marketplace (auth → browse → detail → review → analytics) but is missing the
three write-side features the UI already renders. Those pages are presentational only —
they call endpoints that return `404 Route not found`.

```
Landing · SignIn · Dashboard · Trainer Profile · Leaderboard · Resource Detail   ✅ wired
Upload · Admin Approve/Reject · Subscription & Payments                          ⛔ backend missing
```

---

## Implemented & Wired End-to-End

| Area | Frontend | Backend | Notes |
| --- | --- | --- | --- |
| Signup / Signin | `AuthContext.tsx`, `SignInPage.tsx` | `POST /api/trainers/signup`, `/signin` | Session persisted in `localStorage` (`trainerData`, `trainerId`) |
| Trainer profile (me) | `DashboardPage.tsx` | `GET /api/trainers/me/profile` | Guarded by `requireTrainerAuth` |
| Trainer profile (public) | `TrainerProfilePage.tsx` | `GET /api/trainers/:id` | + `GET /:id/resources` |
| Profile update | `ProfileUpdateForm.tsx` | `PUT /api/trainers/:id` | `requireTrainerOwnership` |
| Resource browse | `ResourceBrowser.tsx` | `GET /api/resources` | Pagination, dept/type/search filters synced to URL |
| Resource detail | `ResourceDetailPage.tsx` | `GET /api/resources/:id` | + trainer + rating, download tracking |
| Reviews | `ReviewsList.tsx`, `ReviewForm.tsx`, `ResourceReviewModal.tsx` | `GET/POST/PUT/DELETE /api/resources/:id/reviews` | Full CRUD |
| Ratings | `ReviewSummary.tsx`, `StarRating.tsx` | `GET /api/resources/:id/rating` | Average + distribution |
| Download analytics | `ResourceCard.tsx` | `POST /api/analytics/download`, `GET /api/analytics/resources/:id` | 60s duplicate suppression |
| Leaderboard | `LeaderboardPage.tsx` | `GET /api/trainers/leaderboard` | Ranked by download count |

### Infrastructure in place

- `src/lib/api.ts` — typed API client (`get`/`post`/`put`/`delete`/`upload`) with `ApiError` + `x-trainer-id` header injection.
- `src/lib/queryClient.ts` — React Query client (TanStack Query v5).
- `src/routes/index.tsx` — all 8 routes, each wrapped in `ErrorBoundary` + `Suspense` via a `SafePage` wrapper.
- Route-level code splitting; `LandingSections` and `SparklesCore` (~295 kB) lazy-loaded.
- `server/src/db.ts` — 8 inline idempotent migrations: trainers, resources, downloads, subscriptions, payment_history, payment_plans, reviews + trainer profile columns. Payment plans seeded at boot.
- `server/src/seeds/resourceSeed.ts` — standalone seed script (`yarn seed:resources`).
- `ErrorBoundary` component with fallback UI.

---

## Not Implemented — Frontend Calls Missing Backend Endpoints

These three feature groups are **fully built in React but have zero server-side
implementation**. The `resources.status`, `trainers.is_admin`, `subscriptions`,
`payment_history` and `payment_plans` tables already exist, so these are CRUD gaps
rather than schema gaps.

### 1. Resource upload — `POST /api/resources/upload` ⛔

- Called by `ResourceUploadPage.tsx:102` via `api.upload()` (multipart `FormData`, field `file`).
- Server has **no** `POST` route on `/api/resources` — `resourceRoutes.ts` exposes only four `GET`s.
- No `multer` dependency; `server/src/types.ts:106` states *"File handling deferred to Phase 2 with multer setup."*
- Target column `resources.file_url VARCHAR(255) NOT NULL` exists but is unsatisfied by the current contract.
- **Blocks:** the core trainer loop — a trainer can browse and review but cannot publish.

### 2. Admin moderation — `/api/admin/resources/{pending,approve,reject}` ⛔

- Called by `AdminPage.tsx:38,58,72` → `GET /api/admin/resources/pending`, `PUT /api/admin/resources/:id/approve`, `PUT /api/admin/resources/:id/reject`.
- No `adminRoutes.ts` / `adminController.ts` exists; `/api/admin` is not mounted in `server.ts`.
- `trainers.is_admin` column and `idx_trainers_is_admin` index exist; **no middleware reads the flag**.
- **Blocks:** the moderation loop — newly uploaded resources stay `pending_review` forever.

### 3. Subscriptions & payments ⛔

- Called by `SubscriptionSection.tsx:23-25` → `GET /api/trainers/:id/subscription`, `GET /api/payment-plans`, `GET /api/trainers/:id/payments`.
- `subscriptions`, `payment_history`, `payment_plans` tables exist and are seeded, but there is **no controller and no route** for any of them.
- No payment-provider integration (no M-Pesa/Stripe client) — only the schema is in place.
- **Blocks:** monetisation, and the "Premium" gating implied by `shared/constants.ts` `PAYMENT_PLAN_DETAILS`.

---

## Bugs — Found and Verified

These are confirmed defects, not speculation. The first was reproduced by running the
build; the rest were confirmed by tracing the code against the migration schema.

### B1 — The compiled backend cannot start (blocker) 🔴

```
$ cd server && node dist/server.js
Error [ERR_MODULE_NOT_FOUND]: Cannot find module
'C:\...\server\dist\db' imported from C:\...\server\dist\controllers\signinController.js
```

`server/src/controllers/signinController.ts:2-3` imports `'../db'` and `'../passwordHelper'`
**without the `.js` extension**, while every other file in the server uses explicit
extensions. TypeScript's `moduleResolution: "bundler"` does not error on this, and `tsx`
(dev) resolves it — so the defect is invisible until you run the compiled output.

- `yarn dev` (tsx) → works
- `yarn build && yarn start` (node) → **crashes on boot**

**Fix:** add `.js` to both imports in `signinController.ts`, then rebuild.

### B2 — `approved_at` column does not exist (two call sites) 🔴

Migration 2 creates `resources.approval_date` (`db.ts:101`) and no later migration adds
`approved_at`. Two places reference the non-existent column:

| Call site | Effect |
| --- | --- |
| `server/src/controllers/resourceController.ts:145` | `GET /api/resources/:id/stats` → SQL error → **500 on every call** |
| `server/src/seeds/resourceSeed.ts:217` | `yarn seed:resources` → INSERT fails → **the documented seed command cannot run** |

**Fix:** change both to `approval_date`, or add an idempotent `ALTER TABLE resources ADD
COLUMN IF NOT EXISTS approved_at TIMESTAMP` migration and use that name consistently.

### B3 — Moderation bypass on direct resource fetch 🟠

`listResources` correctly filters `status = 'approved'` (`resourceController.ts:48`), but
`getResourceById` (`resourceController.ts:116`) selects by id with **no status filter**.
Once uploads exist, a `pending_review` or `rejected` resource is publicly readable by
anyone who knows its UUID — defeating the admin approve/reject workflow entirely.

**Fix:** filter to `status = 'approved'` in `getResourceById`, and allow `pending`/
`rejected` access only for the owning trainer or an admin.

### B4 — `uploadedAt` reads the wrong column 🟡

`formatResourceResponse` maps `uploadedAt: row.created_at` (`resourceController.ts:25`),
but the table has a distinct `uploaded_at` column (`db.ts:100`). The two are nearly
identical in practice, so this is a silent inaccuracy rather than an outage.

### B5 — Pricing mismatch between shared constants and seeded plans 🟡

| Plan | `shared/constants.ts` | `db.ts` seed |
| --- | --- | --- |
| Premium Monthly | 2,999 KES | 9,900 (99 KES) |
| Premium Annual | 29,990 KES | 250,000 (2,500 KES) |

The front end and the database disagree on price. Pick one source of truth before the
payment integration lands.

### B6 — Password rules disagree across three places 🟡

| Source | Rules |
| --- | --- |
| `shared/constants.ts` `VALIDATION.PASSWORD` | 8+, upper, lower, number, **special** |
| `server/src/passwordHelper.ts:33` | 8+, upper, lower, number — **no special-char check** |
| `docs/API.md:38` | "8+ chars, uppercase, lowercase, number" |

The shared constant demands a character the server never enforces, so a password the UI
rejects may still be accepted by the API.

---

## Known Issues & Risks

| # | Severity | Issue | Location |
| --- | --- | --- | --- |
| 1 | High | `requireTrainerAuth` only checks the `x-trainer-id` header is **present** — it never verifies the trainer exists. Any random UUID passes as a valid session. | `server/src/middleware/authMiddleware.ts:7` |
| 2 | High | No role enforcement anywhere. There is no `requireAdmin` guard, so any future admin route must add one before shipping. | `server/src/middleware/authMiddleware.ts` |
| 3 | Medium | Auth is header-based only — no JWT, no session expiry, no server-side revocation. | `server/src/middleware/authMiddleware.ts` |
| 4 | Medium | `server/package.json` defines `"test": "vitest"` but `vitest` is not a server devDependency and there are **no server test files**. `yarn test` in `server/` will fail. | `server/package.json:11` |
| 5 | Medium | API client adoption is inconsistent. `src/lib/api.ts` is used only by the 4 newest features (upload, admin, subscription, resource detail); 10 older files still use raw `fetch`. | `src/features/**` |
| 6 | Medium | `resourceController.ts:14` types its row as `any`, violating the project's own no-`any` rule (and hiding B3/B4). | `server/src/controllers/resourceController.ts:14` |
| 7 | Low | Frontend tests cannot execute in this sandbox — the vitest worker fails to spawn (`Timeout waiting for worker to respond`) under both `forks` and `threads` pools. Needs verification on a normal machine. | `vitest.config.mjs` |
| 8 | Low | `docs/ARCHITECTURE.md` is stale: claims React Router v6 (actual: v7), omits the `admin/`, `upload/`, `resourceDetail/`, `subscription/` feature folders, and describes both Tailwind and plain-CSS as in use. | `docs/ARCHITECTURE.md` |
| 9 | Low | `docs/API.md` documents only implemented endpoints, so the upload/admin/subscription endpoints the frontend calls are undocumented — correct today, but it hides the gap. It also lists `GET /api/resources/:resourceId/rating` under a heading implying a different path shape than `reviewRoutes.ts` registers. | `docs/API.md` |
| 10 | Low | The removed `IMPLEMENTATION_PLAN.md` / `docs/IMPLEMENTATION.md` (deleted in `d1b2480`) leaves no roadmap of record. This file now carries that role. | — |
| 11 | Low | `useTrainerSignup` is now a 5-line passthrough to `useAuth` — a vestigial indirection with no behaviour of its own. | `src/features/onboarding/hooks/useTrainerSignup.ts` |
| 12 | Low | Uncommitted work in the tree: `Hero.tsx` Tailwind rewrite + new `public/images/hero4.jpg`. The rewrite drops the `TrainerCTA` component and contradicts the "no Tailwind in new components" convention below. | working tree |

---

## Priorities (Next Work)

Ordered by what unblocks the most user-facing value.

**P0 — Fix the blockers (do these before anything else)**
1. **B1** — add `.js` to the two imports in `server/src/controllers/signinController.ts:2-3`; the compiled server currently cannot boot.
2. **B2** — resolve `approved_at` vs `approval_date` in `resourceController.ts:145` and `resourceSeed.ts:217`; the seed command and the stats endpoint are both dead.
3. **B3** — add a `status = 'approved'` filter to `getResourceById` before uploads exist, or moderation is bypassable from day one.

**P1 — Make the marketplace loop closable**
4. `POST /api/resources/upload` — add `multer`, accept the multipart `file`, persist to disk or object storage, write `file_url`, insert row with `status='pending_review'`.
5. Admin moderation — add `adminRoutes.ts` + `adminController.ts`, mount at `/api/admin`, and add a `requireAdmin` middleware that reads `trainers.is_admin` (fixes issues #1 and #2 together).

**P2 — Monetisation**
6. Subscription CRUD against the existing tables + `GET /api/payment-plans`.
7. Payment provider integration (M-Pesa / Stripe) writing to `payment_history`.
8. Enforce plan limits server-side (the `free` plan's "Upload up to 5 resources" is currently a front-end promise only).
9. Resolve **B5** (pricing) and **B6** (password rules) — pick a single source of truth for each.

**P3 — Hardening**
10. Real session tokens (JWT) replacing the raw `x-trainer-id` header; validate trainer existence on every authenticated request.
11. Add server test files + fix the `yarn test` script.
12. Migrate the remaining 10 `fetch` call sites onto `src/lib/api.ts`; replace the `any` row type in `resourceController.ts:14`.
13. Re-run the frontend suite on a machine where the vitest worker can spawn.

**P4 — Polish**
14. Refresh `docs/ARCHITECTURE.md` and `docs/API.md` once P0/P1 land.
15. Accessibility pass on the signup modal (ARIA labels, focus trap, keyboard nav) — flagged in `docs/DECISIONS.md` §6.
16. Drop the vestigial `useTrainerSignup` passthrough hook.

---

## Test Coverage

| Kind | Files | Tool | Status |
| --- | --- | --- | --- |
| Unit / integration | 5 | Vitest + jsdom | Written; **cannot run in this sandbox** (worker spawn timeout) |
| E2E (excluded from default run) | 3 | Vitest + live backend | `authFlow`, `downloadTracking`, `logoutFlow` |
| Backend | 0 | — | **None exist** |

---

## Conventions in Force

Preserved from the previous revision of this document.

### Workspace

```
gemini-app/
├── src/          → React + Vite frontend (npm)
├── server/       → Express + PostgreSQL backend (yarn)
├── shared/       → Types & constants shared by both sides
└── docs/         → Architecture, API, setup, status
```

Frontend and backend are independent packages with separate tooling. Develop them in parallel.

### Terminal layout

| Terminal | Directory | Command | Purpose |
| --- | --- | --- | --- |
| 1 | `server/` | `yarn dev` | Backend API on `:3000` (auto-restart) |
| 2 | root | `npm run dev` | Frontend on `:5173` (HMR) |

Before starting, ensure PostgreSQL is running and the database exists:
`psql -U postgres -c "CREATE DATABASE cbet_resource;"`

### TypeScript

- Strict mode is on — no `any`, no `@ts-ignore`, no `as` casts unless unavoidable.
- Shared types live in `shared/types.ts`; frontend imports via `@shared/types`, backend duplicates them in `server/src/types.ts` (no path alias on the server).
- Every feature has an `index.ts` barrel; consumers import from the barrel, never deep-import.

### Naming

| Thing | Convention | Example |
| --- | --- | --- |
| Components | PascalCase | `TrainerSignupModal.tsx` |
| Hooks | `use` prefix | `useAuth.ts` |
| CSS files | Match component name | `TrainerSignupModal.css` |
| Routes, controllers | camelCase | `trainerRoutes.ts` |
| DB columns | snake_case | `full_name` |
| API responses | camelCase | `fullName` |

### CSS

- Use CSS custom properties from `src/index.css` (`--accent-blue`, `--text-light`, …) — do not hardcode colours.
- Each component owns its CSS file, co-located.
- Breakpoints: 480px / 768px / 1024px.
- **Do not add Tailwind classes to new components** — the project uses plain CSS. (Exception in flight: the uncommitted `Hero.tsx` rewrite. Decide: revert, or adopt Tailwind as the project standard and update this rule.)

### Testing

- Mock every external call — `vi.fn()` + global `fetch` mock; never hit a real server.
- Mock lazy components (`ResourceBrowser`, `SparklesCore`, any `React.lazy()` import) in tests that don't need them, to avoid Suspense `act()` warnings.
- E2E files end in `.e2e.test.tsx` and are excluded from the default vitest run — they need a live backend.
- If a test uses `vi.useFakeTimers()`, restore with `vi.useRealTimers()` in `afterEach`.

### Database changes

The project uses **inline SQL migrations** in `server/src/db.ts` (no Prisma/Drizzle).

1. Append a new `// Migration N:` block to `runMigrations()` in `db.ts`.
2. Always use `IF NOT EXISTS` / `IF EXISTS` so migrations are idempotent.
3. Never drop or destructively alter columns that may hold data.
4. Create indexes after new tables.

Seed scripts live in `server/src/seeds/` and run standalone via `yarn seed:resources`.
Check for existing data before inserting (idempotent seed).

### Git workflow

- Branch from `main` for each feature or fix.
- Commit message format: `scope: short description` (e.g. `auth: add password strength meter`).
- Before pushing: build + test both sides.
- Never commit `.env`, `dist/`, `node_modules/`, or secrets.
- Do not amend or force-push unless requested.

### Doc sync

Update the relevant doc whenever you change a component, route, API, or schema.

| Doc | Updates for |
| --- | --- |
| `GETTING_STARTED.md` | Prerequisites, env vars, setup steps, seed commands |
| `ARCHITECTURE.md` | Directory structure, routing, data flow, section order |
| `API.md` | New/removed endpoints, changed request/response shapes |
| `STATUS.md` | This file — implementation state, gaps, priorities |

---

## Verification Commands

```powershell
# Frontend type-check
npx tsc --noEmit

# Backend type-check
npx tsc --noEmit -p server/tsconfig.json

# Frontend build
npm run build

# Frontend tests
npm run test

# Backend build
cd server; yarn build

# Backend dev server
cd server; yarn dev

# Seed sample resources
cd server; yarn seed:resources
```

---

## Related Docs

| Doc | What it covers |
| --- | --- |
| [Getting Started](GETTING_STARTED.md) | Full setup walkthrough |
| [API Reference](API.md) | Implemented endpoints, request/response shapes |
| [Architecture](ARCHITECTURE.md) | Frontend & backend design |
| [Decisions](DECISIONS.md) | Trainer onboarding refactor trade-offs & rationale |
