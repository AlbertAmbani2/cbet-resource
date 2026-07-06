# Architecture

## Overview

Full-stack application with a React frontend and Express/PostgreSQL backend. Shared types between them live in `shared/`.

## Frontend

### Directory Structure

```
src/
├── components/ui/           # Reusable generic components (ErrorBoundary)
├── features/
│   ├── auth/                # AuthProvider, AuthContext, SignInPage
│   ├── dashboard/           # DashboardPage, ProfileUpdateForm
│   ├── landing/             # Hero, HowItWorks, FAQ, TrainersHub, LandingSections
│   ├── leaderboard/         # LeaderboardPage
│   ├── onboarding/          # TrainerSignupModal, TrainerCTA, TrainerOnboarding
│   ├── resources/           # ResourceBrowser, ResourceCard, ResourceReviewModal
│   └── trainer/             # TrainerProfilePage
├── layouts/                 # Header, Footer
├── routes/                  # Centralized route definitions
├── config/                  # App-level config (trainerOnboarding.ts)
├── App.tsx                  # BrowserRouter + AppRoutes only
└── main.tsx                 # Entry point
```

### Routing

Routes are defined in `src/routes/index.tsx` and consumed by `App.tsx`:

```tsx
<Router>
  <AppRoutes />
</Router>
```

`AppRoutes` wraps the app in `<AuthProvider>` and renders a persistent `<TrainerSignupModal>` overlay alongside all routes. The landing page (`/`) renders a fixed sequence:

1. `<Header />` — sticky nav with auth-aware actions
2. `<Hero />` — full-viewport hero with particles, CTAs, stats
3. `<HowItWorks />` — learner/visitor flow (browse → download → review)
4. `<ResourceBrowser />` — department grid + resource listing
5. `<TrainersHub />` — trainer process steps + benefits + CTA
6. `<FAQ />` — accordion FAQ + stats grid
7. `<Footer />` — links, trainer CTAs, newsletter

### Feature Pattern

Each feature follows the same convention:

- **Colocation** — components, hooks, styles, and tests live together
- **Barrel export** — `index.ts` exports the public API
- **No deep imports** — consumers import from `@/features/onboarding`, not `@/features/onboarding/hooks/useTrainerSignup`

### Key Libraries

- **Vite** — build tool
- **React Router v6** — client-side routing
- **Tailwind CSS** — utility-first styling
- **CSS modules** — component-specific styles (gradually migrating to Tailwind)
- **Vitest** — test runner

## Backend (`server/`)

```
server/
├── src/
│   ├── server.ts            # Express entry point
│   ├── db.ts                # PostgreSQL pool & schema init
│   ├── routes/              # Express route handlers
│   ├── controllers/         # Request handlers
│   ├── middleware/           # Auth middleware
│   └── seeds/               # Database seed scripts
└── .env                     # PORT, DATABASE_URL, FRONTEND_URL
```

### API Pattern

- RESTful routes under `/api/`
- Auth via `x-trainer-id` header
- Error responses follow `{ "error": "message" }`
- See [API.md](./API.md) for full reference

## Data Flow

```
[React App] --HTTP--> [Express API] --SQL--> [PostgreSQL (Local)]
     ↕                        ↕
  VITE_API_URL           shared/ types
```

## Key Decisions

- **Feature colocation** over type-first organization — easier to find, move, and delete code
- **Auth separated from onboarding** — AuthProvider handles global auth state; onboarding owns signup flow
- **Barrel exports** over deep imports — cleaner public API per feature
- **Route-level code splitting** — planned after UI stabilization
- See [DECISIONS.md](./DECISIONS.md) for trade-off details
