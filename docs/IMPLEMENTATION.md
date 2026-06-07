# Implementation Status

Last reviewed: June 7, 2026

This document tracks the current implementation state of the CBET application. It replaces the older step-by-step trainer onboarding guide, which had become stale, duplicated, and mixed completed work with outdated instructions.

## Current Summary

The trainer onboarding refactor is implemented and integrated into the landing page. The application has also expanded beyond the original trainer CTA scope: it now includes backend-backed trainer signup/signin, shared frontend/backend types, profile/dashboard routes, resource browsing, and payment-related backend schema work.

Current verification status:

| Area | Status | Notes |
| --- | --- | --- |
| Frontend build | Passing | `npm.cmd run build` completed successfully. Vite reports a large JS chunk warning around 584 KB. |
| Backend build | Passing | `yarn build` in `server/` completed successfully. |
| Frontend tests | Not green | Current run had 21 passing tests, 1 failing trainer signup integration test, and worker timeout errors for some e2e-style test files. |
| Backend runtime | Environment-dependent | Server requires a valid `DATABASE_URL` and Neon/Postgres connectivity before API routes are usable. |
| Responsive/icon migration | Planned / in progress | Tailwind is available, but most components still use CSS files and several emoji/symbol UI elements remain. |

## Completed Work

### Trainer Onboarding

- Centralized trainer onboarding copy and signup flow configuration exists in `src/config/trainerOnboarding.ts`.
- Shared trainer signup state exists through `TrainerSignupProvider`, `TrainerSignupContext`, `TrainerSignupModal`, and `useTrainerSignup`.
- Reusable CTA components exist in `src/components/CTAs`.
- Landing page trainer entry points have been consolidated:
  - `Hero` opens trainer signup.
  - `Solutions` has trainer CTA integration.
  - `TrainersHub` renders `TrainerOnboarding.Preview`.
  - `FAQ` references centralized trainer FAQ copy.
  - `UserPaths` duplicate flow has been removed.

### Auth And Routing

- `App.tsx` wraps the app with `AuthProvider` and `TrainerSignupProvider`.
- Routes exist for:
  - `/`
  - `/signin`
  - `/dashboard`
- `SignInPage` uses the active auth context and calls the trainer signin endpoint.
- `DashboardPage` and profile update flow are present.

### Backend

- Express backend exists in `server/`.
- Trainer routes include:
  - `POST /api/trainers/signup`
  - `POST /api/trainers/signin`
  - `GET /api/trainers/:id`
  - `GET /api/trainers/me/profile`
  - `PUT /api/trainers/:id`
- Auth middleware and trainer profile controllers are implemented.
- Database initialization and migrations exist in `server/src/db.ts`.
- Shared API types/constants exist in `shared/`.

### Shared Types

- `shared/types.ts`, `shared/constants.ts`, and `shared/index.ts` provide a shared contract layer.
- Frontend and tests now rely on the `@shared` alias.

## Current Issues

### Frontend Tests

The test suite is not currently reliable enough to treat as a deployment gate.

Observed issues:

- `TrainerSignup.integration.test.tsx` fails during the full signup flow.
- `ResourceBrowser` can crash in tests when mocked fetch responses do not match the expected resource response shape.
- Some e2e-style test files can hit Vitest worker startup timeouts.

Recommended fix:

- Stabilize API mocking so resource requests and auth requests do not consume each other's mock responses.
- Make `ResourceBrowser` defensive against malformed or unrelated API responses.
- Separate high-level auth e2e-style tests from fast component/integration tests if worker startup remains slow.

### Runtime API Connectivity

The frontend expects `VITE_API_URL`, currently pointing to `http://localhost:3000`.

Backend startup depends on:

- running commands from the correct directory: `server/`;
- a valid `server/.env`;
- reachable Neon/Postgres database connection.

Recommended local run sequence:

```powershell
cd server
yarn dev
```

Then verify:

```powershell
Invoke-RestMethod http://localhost:3000/health
```

Only after the backend responds should the frontend signin/signup flows be tested.

### Responsive Tailwind And Icons

Tailwind is installed and imported, but the app still has many component CSS files.

Known remaining emoji/symbol UI:

- Department emoji values in `src/lib/mockData.ts`.
- Modal symbols in `TrainerSignupModal`.
- FAQ `+` / `x` symbols.
- Resource browser arrows, warning, and empty-state book icon.
- Resource card approval check.
- Payment success check.
- Sign-in back arrow.

Recommended migration approach:

- Work one container at a time.
- Use Tailwind as the default component styling method.
- Keep CSS only for global styles, complex keyframes, third-party styles, or pseudo-elements that are not worth forcing into JSX.
- Remove each component CSS import only when Tailwind fully replaces that component's styling.
- Use `lucide-react` for icons.

## Next Implementation Priorities

1. Stabilize tests.
   - Fix `ResourceBrowser` response handling.
   - Fix signup/signin integration test mocks.
   - Re-run `npm.cmd run test` until the frontend suite is green.

2. Continue responsive/icon migration.
   - Start with `Header`, then `Hero`, then `ResourceBrowser`.
   - Convert one container at a time.
   - Apply consistent Tailwind button, input, card, and container patterns.

3. Replace emoji/symbol UI.
   - Use Lucide icons only.
   - Do not store React icon components directly in data.
   - Map department IDs to icons in the component layer.

4. Improve frontend bundle size.
   - Current frontend build passes but warns about a large JS chunk.
   - Consider route-level code splitting after UI stabilization.

5. Verify backend runtime.
   - Confirm `/health` locally.
   - Confirm signup/signin endpoints manually with the active database connection.

## Verification Commands

Frontend build:

```powershell
npm.cmd run build
```

Frontend tests:

```powershell
npm.cmd run test
```

Backend build:

```powershell
cd server
yarn build
```

Backend dev server:

```powershell
cd server
yarn dev
```

## Removed From This Document

The previous document contained implementation snippets for already-completed Phase 2 work, repeated testing sections, old Cypress setup notes, duplicated checklists, stale timelines, and contradictory status claims. Those have been removed so this file can serve as a current implementation status and next-step guide.
