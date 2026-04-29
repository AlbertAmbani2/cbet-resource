# Trainer Onboarding: Architecture & Design

## Problem Statement

"Create Trainer Account" logic and messaging is scattered across 5 landing page components (Hero, TrainersHub, Solutions, UserPaths, FAQ), creating:

- **Tight coupling** — each component owns signup behavior
- **Code duplication** — 5 implementations of the same pattern
- **Poor maintainability** — changing trainer flow requires 5 file edits
- **Inconsistent messaging** — different copy in different places
- **Weak testability** — signup logic mixed with component rendering

## Solution: Four-Layer Clean Architecture

### New Folder Structure

```
src/
├── config/
│   └── trainerOnboarding.ts          # Centralized config (copy, form structure)
├── features/
│   └── TrainerOnboarding/
│       ├── hooks/
│       │   └── useTrainerSignup.ts    # Signup state + progression logic
│       ├── TrainerOnboarding.tsx      # Composition component (Preview + Form)
│       ├── TrainerOnboarding.css
│       └── index.ts
├── components/
│   ├── CTAs/
│   │   ├── TrainerCTA.tsx             # Reusable button (3 variants)
│   │   ├── TrainerCTA.css
│   │   └── TrainerCTAGroup.tsx        # Multi-CTA layout wrapper
│   └── ... (other components, refactored to use TrainerCTA)
```

### The Four Layers

| Layer            | Responsibility                     | File                                                   | Why This Matters                                        |
| ---------------- | ---------------------------------- | ------------------------------------------------------ | ------------------------------------------------------- |
| **Config**       | Copy, form fields, constants       | `config/trainerOnboarding.ts`                          | Single source of truth → change once, update everywhere |
| **Logic**        | State management, form progression | `features/TrainerOnboarding/hooks/useTrainerSignup.ts` | Testable, reusable, isolated from rendering             |
| **Presentation** | Button UI & styling, zero logic    | `components/CTAs/TrainerCTA.tsx`                       | Truly dumb component = flexible use cases               |
| **Feature**      | Trainer-specific UI composition    | `features/TrainerOnboarding/TrainerOnboarding.tsx`     | Cohesive domain logic in one place                      |

## Key Architectural Principles

### 1. Single Responsibility

Each file has ONE reason to change:

```tsx
// Change trainer copy? → Edit config/trainerOnboarding.ts only
// Change button styling? → Edit components/CTAs/TrainerCTA.css only
// Change signup flow? → Edit features/TrainerOnboarding/hooks/useTrainerSignup.ts only
// Change feature UI? → Edit features/TrainerOnboarding/TrainerOnboarding.tsx only
```

### 2. Dependency Injection (DI)

Components don't know about signup behavior. Parent provides it via props:

```tsx
<TrainerCTA
  variant="primary"
  label="Create Trainer Account"
  onSignupClick={() => openSignup("hero")} // ← DI: parent controls behavior
/>
```

**Benefit:** Same button works everywhere with different behaviors. No hardcoded logic.

### 3. Feature Encapsulation

```
src/features/TrainerOnboarding/
```

— All trainer signup code lives here
— Easy to find, move, test, or delete as a unit
— Clear ownership of trainer-related features

### 4. Centralized Configuration

```tsx
// Before: copy scattered in 5 files
Hero.tsx:       "Become a Trainer"
TrainersHub.tsx: "Create Trainer Account"
Solutions.tsx:   "Create Trainer Account"

// After: One file, updated everywhere
export const TRAINER_ONBOARDING = { primaryCTA: { label: '...' } }
```

## Coupling Reduction Visualization

### Before: Tight Coupling (Problem)

```
┌──────────┐     ┌──────────────┐
│ Hero.tsx │────▶│ Signup Logic │
├──────────┤     │ Button Style │
│ - Button │     │ Copy         │
│ - Signup │     │ Behavior     │
│ - Copy   │     │ (duplicate)  │
└──────────┘     │              │
                 └──────────────┘
┌──────────────────┐
│ TrainersHub.tsx  │───┐ All hardcoded in each component
├──────────────────┤   │ No single source of truth
│ - Button         │───▶▶ Tight coupling everywhere
│ - Signup Logic   │ │ Hard to change
│ - Copy           │─┘ Risk of inconsistency
└──────────────────┘

5 tight couplings = hard to maintain
```

### After: Loose Coupling Via Abstraction (Solution)

```
┌─────────────────────────────────────┐
│ config/trainerOnboarding.ts         │
│ (Single Source of Truth)            │
│                                     │
│ • primaryCTA: { label, description }│
│ • formSteps: [email, profile, ...]  │
│ • analytics event names             │
└────────────┬────────────────────────┘
             │
  ┌──────────┴──────────┬───────────────┐
  │                     │               │
  ▼                     ▼               ▼
┌──────────────┐  ┌─────────────┐  ┌────────────┐
│ Hero.tsx     │  │ TrainersHub  │  │ FAQ.tsx    │
│              │  │ .tsx         │  │            │
│ Uses:        │  │              │  │ References │
│ - TrainerCTA │  │ Uses:        │  │ config     │
│ - openSignup │  │ - Trainer    │  │            │
│              │  │   Onboarding │  │ No logic   │
└──────┬───────┘  │ - openSignup │  │ (loose     │
       │          │              │  │  coupling) │
       │          └──────┬───────┘  └────────────┘
       │                 │
       └─────────┬───────┘
                 │
        ┌────────▼──────────────────┐
        │ components/CTAs/          │
        │ TrainerCTA.tsx            │
        │                           │
        │ Props only:               │
        │ - variant (UI)            │
        │ - onSignupClick (DI)      │
        │ - label                   │
        │                           │
        │ ✓ Reusable                │
        │ ✓ Testable                │
        │ ✓ No business logic       │
        └────────┬───────────────────┘
                 │
        ┌────────▼──────────────────────┐
        │ features/TrainerOnboarding/    │
        │ hooks/useTrainerSignup.ts      │
        │                                │
        │ State management:              │
        │ • Modal visibility             │
        │ • Current form step            │
        │ • Form data                    │
        │ • Step navigation callbacks    │
        │                                │
        │ ✓ Isolated from rendering     │
        │ ✓ Fully testable              │
        │ ✓ Reusable in multiple places │
        └────────────────────────────────┘

All dependencies point downward via interfaces.
No circular imports. Clear separation.
```

## Component Composition Pattern

```tsx
// Example: How Hero.tsx uses the architecture

import TrainerCTA from "./CTAs/TrainerCTA";
import { useTrainerSignup } from "../features/TrainerOnboarding";

export function Hero() {
  const { openSignup } = useTrainerSignup(); // ← Get signup function

  return (
    <section>
      <h1>Share Your Knowledge</h1>
      <p>Turn training into impact</p>

      {/* ← Reusable component, custom behavior via DI */}
      <TrainerCTA
        variant="secondary"
        label="Become a Trainer" // ← Can come from config
        onSignupClick={() => openSignup("hero")} // ← Custom behavior
      />
    </section>
  );
}
```

**Why this works:**

1. `useTrainerSignup()` manages signup state (single instance per page)
2. `openSignup()` callback from hook
3. `<TrainerCTA />` never knows about signup — just calls callback
4. Same component works in Hero, TrainersHub, Solutions, etc.

## Data Flow Diagram

```
User clicks "Create Trainer Account"
        │
        ▼
┌──────────────────────────────────┐
│ <TrainerCTA />                   │
│ onSignupClick={() => ...}        │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ useTrainerSignup.openSignup()    │
│ - Set modal isOpen = true        │
│ - Track source (hero/solutions)  │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ Modal renders <TrainerOnboarding │
│ .Form /> with step 0 (email)     │
└────────────┬─────────────────────┘
             │
User enters email + password
             │
             ▼
┌──────────────────────────────────┐
│ useTrainerSignup.updateFormData()│
│ - Update formData.email          │
│ - Update formData.password       │
└────────────┬─────────────────────┘
             │
User clicks "Next"
             │
             ▼
┌──────────────────────────────────┐
│ useTrainerSignup.nextStep()      │
│ - currentStep = 1 (profile)      │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ Modal re-renders with step 1     │
│ (Full Name, Department)          │
└────────────┬─────────────────────┘
             │
     ... repeat steps 2-4 ...
             │
User clicks "Create Account"
             │
             ▼
┌──────────────────────────────────┐
│ useTrainerSignup.submitForm()    │
│ - Call API (Phase 2)             │
│ - closeSignup()                  │
│ - Track 'trainer_signup_complete'│
└──────────────────────────────────┘
```

## State Management Visualization

### Before: Duplicate State

```
Hero.tsx
  state: { showModal, ... }

TrainersHub.tsx
  state: { showModal, ... }     ❌ Duplicated state
                                ❌ Inconsistent behavior
Solutions.tsx
  state: { showModal, ... }
```

### After: Centralized State

```
useTrainerSignup Hook (single instance per page)

┌──────────────────────────────────┐
│ isOpen: boolean                  │
│ currentStep: number (0-3)        │
│ formData: { email, password, ... }│
└──────────────────────────────────┘
        │
        ├─ Hero accesses via hook
        ├─ TrainersHub accesses via hook
        ├─ Solutions accesses via hook
        │
        └─ All share same state
           ✓ Consistent behavior
           ✓ Single source of truth
           ✓ Easy to test
```

## Benefits Matrix

| Issue                      | Before | After | How                                           |
| -------------------------- | ------ | ----- | --------------------------------------------- |
| **Duplicate Copy**         | 5      | 1     | Centralized `trainerOnboarding.ts`            |
| **CTA Implementations**    | 5      | 1     | Single `TrainerCTA.tsx` with variants         |
| **Signup State Locations** | 5      | 1     | Centralized `useTrainerSignup()` hook         |
| **Time to Change Copy**    | 5 min  | 1 min | Edit 1 config file vs 5 components            |
| **Testing Signup Logic**   | Hard   | Easy  | Isolated hook = unit testable                 |
| **Consistency Risk**       | High   | Low   | Single source of truth guarantees consistency |
| **Code Reusability**       | None   | High  | `TrainerCTA` works everywhere with DI         |
| **Coupling**               | Tight  | Loose | Dependencies via interfaces (props)           |
| **Maintainability**        | Hard   | Easy  | Single responsibility per file                |

## Variant System

The `TrainerCTA` component supports 3 semantic variants:

### Primary Variant

```tsx
<TrainerCTA variant="primary" />
```

- Large button with full branding
- Used in TrainersHub as main CTA
- Features list included
- Color: #3b5bdb (brand blue)

### Secondary Variant

```tsx
<TrainerCTA variant="secondary" />
```

- Medium button with border
- Used in Hero as alternate action
- Emphasizes "try learning first, trainer later"
- Color: white background, blue border

### Small Variant

```tsx
<TrainerCTA variant="small" />
```

- Compact inline button
- Used in Solutions, footer
- Fits tight spaces
- Color: gray or blue (context-dependent)

All variants support:

- Custom labels via `label` prop
- Custom behavior via `onSignupClick` callback (DI)
- Disabled state for loading
- Responsive design (mobile-first)

## Migration Strategy

### Phase 1: Foundation (No Breaking Changes)

- ✅ Create `config/trainerOnboarding.ts`
- ✅ Create `useTrainerSignup.ts`
- ✅ Create `TrainerCTA.tsx` + CSS
- ✅ Create `TrainerOnboarding.tsx`
- All new files — existing code untouched

### Phase 2: Refactor Components

- Update Hero.tsx to use `TrainerCTA`
- Update TrainersHub.tsx to use `TrainerOnboarding.Preview`
- Update Solutions.tsx to use `TrainerCTA`
- Update FAQ.tsx to reference config
- Remove UserPaths.tsx (role absorbed by TrainersHub)
- All changes are local to each component

### Phase 3: Cleanup & Testing

- Add unit tests for `TrainerCTA`, `useTrainerSignup`, config
- Add integration tests for component + hook
- Add E2E test for full signup flow
- Verify bundle size improvements

## Next Steps

See [DECISIONS.md](./DECISIONS.md) for architectural trade-offs and why each choice was made.

See [IMPLEMENTATION.md](./IMPLEMENTATION.md) for detailed migration steps and code examples.
