# Architecture

## Overview

Full-stack application with a React frontend and Express/PostgreSQL backend. Shared types between them live in `shared/`.

## Frontend

### Directory Structure

```
src/
├── components/ui/           # Design primitives (Button, Card, Badge, Avatar, …)
├── features/
│   ├── admin/               # AdminPage (pending-resource review)
│   ├── auth/                # AuthProvider, AuthContext, SignInPage
│   ├── dashboard/           # Portal pages: Overview, Profile, Resources, Subscription, Settings
│   ├── landing/             # LandingPage, Hero, HowItWorks, FAQ, TrainersHub, LandingSections
│   ├── leaderboard/         # LeaderboardPage
│   ├── onboarding/          # TrainerSignupModal, TrainerCTA, TrainerOnboarding
│   ├── resources/           # ResourceBrowser, ResourceCard, ResourceReviewModal
│   ├── resourceDetail/      # ResourceDetailPage
│   ├── subscription/        # SubscriptionSection
│   ├── trainer/             # Public TrainerProfilePage
│   └── upload/              # ResourceUploadPage
├── layouts/                 # PublicLayout, TrainerLayout, Header, Footer
├── routes/                  # AppRoutes, RequireAuth, ScrollToTop
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

`AppRoutes` wraps the app in `<AuthProvider>`. Two shells keep marketing and the trainer workspace separate:

| Area | Layout | Routes |
| --- | --- | --- |
| Public marketing + profiles | `PublicLayout` (Header, Footer, signup modal) | `/`, `/signin`, `/leaderboard`, `/trainer/:id`, `/resources/:id` |
| Trainer portal (auth required) | `TrainerLayout` (sidebar + topbar) | `/dashboard`, `/dashboard/resources`, `/dashboard/upload`, `/dashboard/profile`, `/dashboard/subscription`, `/dashboard/settings`, `/dashboard/admin` |

`RequireAuth` redirects unauthenticated visitors to `/signin?next=<path>`. Legacy `/upload` and `/admin` URLs redirect into the portal. The marketing header no longer renders trainer controls; signed-in visitors get a single **Dashboard** link.

The landing page renders through `PublicLayout`, which owns the fixed header, footer, and signup modal. `LandingPage` renders the section sequence:

1. `<Hero />` — full-viewport hero with particles, CTAs, stats
2. `<HowItWorks />` — learner/visitor flow (browse → download → review)
3. `<ResourceBrowser />` — department grid + resource listing
4. `<TrainersHub />` — trainer process steps + benefits + CTA
5. `<FAQ />` — accordion FAQ + stats grid

`<Header />` and `<Footer />` are supplied by `PublicLayout`, not by the landing page itself.

### Feature Pattern

Each feature follows the same convention:

- **Colocation** — components, hooks, styles, and tests live together
- **Barrel export** — `index.ts` exports the public API
- **No deep imports** — consumers import from `@/features/onboarding`, not `@/features/onboarding/hooks/useTrainerSignup`

### Key Libraries

- **Vite** — build tool
- **React Router v7** — client-side routing
- **Tailwind CSS v4** — primary styling system for new UI and the trainer portal (theme tokens in `src/tailwind.css`)
- **Plain CSS** — legacy landing/auth styles, kept where already established
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
