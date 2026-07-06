# Development Best Practices

## Workspace Structure

```
cbet-app/
├── src/          → React + Vite frontend (npm)
├── server/       → Express + PostgreSQL backend (yarn)
├── shared/       → Types & constants for both sides
└── docs/         → Project documentation
```

Frontend and backend are independent packages with separate tooling. Develop them in parallel.

---

## 1. Development Workflow

### Terminal layout

| Terminal | Directory | Command | Purpose |
|----------|-----------|---------|---------|
| 1 | `server/` | `yarn dev` | Backend API on `:3000` (auto-restarts on changes) |
| 2 | root | `npm run dev` | Frontend on `:5173` (HMR on changes) |

### Before starting

```powershell
# Ensure local PostgreSQL is running and DB exists
psql -U postgres -c "CREATE DATABASE cbet_resource;"

# Start backend (migrations run automatically on boot)
cd server; yarn dev

# In another terminal, start frontend
npm run dev
```

### Before committing

```powershell
# 1. Type-check both sides
npx tsc --noEmit
cd server; yarn build   # also runs tsc

# 2. Run tests
npm run test            # frontend (vitest)
cd server; yarn test    # backend

# 3. Build frontend (catches Vite-level errors)
npm run build
```

---

## 2. Code Quality

### TypeScript

- **Strict mode is on** — do not use `any`, `@ts-ignore`, or `as` casts unless absolutely unavoidable
- **Shared types** live in `shared/types.ts` — import from `@shared/types` (frontend) or duplicate in `server/src/types.ts` (backend has no path alias)
- **Barrel exports** — each feature has an `index.ts` that exports its public API; consumers import from the barrel, never deep-import

### Naming

| Thing | Convention | Example |
|-------|-----------|---------|
| Components | PascalCase | `TrainerSignupModal.tsx` |
| Hooks | `use` prefix | `useAuth.ts` |
| CSS files | Match component name | `TrainerSignupModal.css` → imported in component |
| Routes, controllers | camelCase | `trainerRoutes.ts`, `trainerController.ts` |
| DB columns | snake_case | `full_name`, `created_at` |
| API responses | camelCase | `fullName`, `createdAt` |

### CSS

- Use CSS custom properties from `src/index.css` (`--accent-blue`, `--text-light`, etc.) — don't hardcode colors
- Each component owns its CSS file (co-located CSS, not modules)
- Responsive breakpoints: 480px / 768px / 1024px
- Don't add Tailwind classes to new components — the project uses plain CSS

---

## 3. Testing Strategy

| Layer | Tool | What to test | When to run |
|-------|------|-------------|-------------|
| Unit | Vitest | Hooks, utils, pure functions | `npm run test` |
| Integration | Vitest + jsdom | Component interaction, form flows, context state | `npm run test` |
| E2E | Vitest (excluded) | Full auth flow, page navigation | Manually with backend running |

### Rules

- **Mock external API calls** — every test uses `vi.fn()` + global fetch mock; never hit a real server
- **Mock lazy components** — `ResourceBrowser`, `SparklesCore`, and any `React.lazy()` import must be mocked in tests that don't need them, to avoid Suspense act() warnings
- **E2E files** end with `.e2e.test.tsx` and are excluded from vitest config — they require a running backend
- **Clean up timers** — if a test uses `vi.useFakeTimers()`, always restore with `vi.useRealTimers()` in `afterEach`

---

## 4. Database Changes

The project uses **inline SQL migrations** in `server/src/db.ts` (no Prisma/Drizzle).

### Adding a new migration

1. Append a new `// Migration N:` block to `runMigrations()` in `db.ts`
2. Always use `IF NOT EXISTS` / `IF EXISTS` to make migrations idempotent
3. Never drop or destructively alter columns that might have data
4. Create indexes after new tables

```ts
// Migration N: Add [feature] table
console.log('[Migrations] Migration N: Adding [feature] table...');
await query(`
  CREATE TABLE IF NOT EXISTS feature_table (
    id UUID PRIMARY KEY,
    ...
  );
`);
// Add indexes
await query(`CREATE INDEX IF NOT EXISTS idx_feature_table_column ON feature_table(column);`);
```

### Seeding

- Seed scripts live in `server/src/seeds/` and run standalone via `yarn seed:resources`
- Check if data already exists before inserting (idempotent seed)

---

## 5. Git Workflow

- **Branch from `main`** for each feature or fix
- **Commit message format**: `scope: short description` (e.g., `auth: add password strength meter`)
- **Before pushing**: build + test both sides
- **Don't commit** `.env` files, `dist/`, `node_modules/`, or secrets
- **Don't amend or force-push** unless requested

---

## 6. Performance

### Code splitting

- Non-landing routes (`/dashboard`, `/signin`, `/trainer/:id`, `/leaderboard`) use `React.lazy()` + `<Suspense>`
- `LandingSections` (below-fold content) is lazy-loaded separately from `Hero` (above-fold)
- `SparklesCore` (particles bundle ~295 kB) is lazy-loaded inside `Hero`
- CSS splits automatically via Vite — critical styles (Header, Hero) load first, the rest loads on-demand

### Bundle budget

| Chunk | Size | Strategy |
|-------|------|----------|
| Main (Hero + routes) | ~252 kB | Keep lean; static imports only for above-fold |
| LandingSections | ~40 kB | Lazy — loaded when user scrolls |
| SparklesCore | ~295 kB | Lazy — loaded only if Hero is in view |
| Route pages | ~15–30 kB each | Lazy per-route |

---

## 7. Keeping Docs in Sync

Every time you change a component, route, API, or database schema, update the relevant doc:

| Doc | Updates for |
|-----|-------------|
| `GETTING_STARTED.md` | Prerequisites, env vars, setup steps, seed commands |
| `ARCHITECTURE.md` | Directory structure, routing, data flow, section order |
| `API.md` | New/removed endpoints, changed request/response shapes |
| `STATUS.md` | Development practices (this file — rarely changes) |

---

## Verification Commands

```powershell
# Frontend type-check
npx tsc --noEmit

# Frontend build
npm run build

# Frontend tests
npm run test

# Backend build
cd server; yarn build

# Backend dev server
cd server; yarn dev

# Backend tests
cd server; yarn test
```
