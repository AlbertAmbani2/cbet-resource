# Implementation Guide: Trainer Onboarding Refactor

**Current Status:** May 22, 2026 | Phase 1 ✅ COMPLETE | Phase 2 ✅ COMPLETE | Backend ✅ VERIFIED | Phase 3 ✅ COMPLETE

This document provides step-by-step instructions to implement comprehensive testing for the trainer onboarding refactor.

## Overview

Transform 5 duplicate "Create Trainer Account" implementations into unified architecture with no breaking changes.

**Timeline:** 
- Phase 1 (foundation) ✅ COMPLETE
- Phase 2 (component migration) ✅ COMPLETE (2-3 hours)
- Phase 3 (testing & QA) ⏳ IN PROGRESS (2-3 hours)
- Phase 4 (enhancements) 📅 PLANNED (4-6 hours)

---

## Current Status Summary

### ✅ What's Been Completed

#### Phase 1: Frontend Foundation (8 files created)
- Centralized config: `src/config/trainerOnboarding.ts` (103 lines)
- State management hook: `src/features/TrainerOnboarding/hooks/useTrainerSignup.ts` (76 lines)
- Reusable button component: `src/components/CTAs/TrainerCTA.tsx` (61 lines)
- Button styling: `src/components/CTAs/TrainerCTA.css` (220 lines)
- Layout wrapper: `src/components/CTAs/TrainerCTAGroup.tsx` (38 lines)
- Feature component: `src/features/TrainerOnboarding/TrainerOnboarding.tsx` (190 lines)
- Feature styling: `src/features/TrainerOnboarding/TrainerOnboarding.css` (280 lines)
- Public API exports: `src/features/TrainerOnboarding/index.ts` (3 lines)

**Total:** ~971 lines of production-ready code | **Status:** ✅ Complete

#### Phase 2: Component Migration (5 components refactored)
- ✅ Hero.tsx → Integrated `<TrainerCTA variant="secondary" />`
- ✅ Solutions.tsx → Integrated `<TrainerCTA variant="small" />`
- ✅ TrainersHub.tsx → Integrated `<TrainerOnboarding.Preview />`
- ✅ FAQ.tsx → References `TRAINER_ONBOARDING.faq` config
- ✅ UserPaths.tsx → Removed (duplicate content eliminated)

**Time Invested:** 2-3 hours | **Status:** ✅ Complete | **Breaking Changes:** 0 | **App Status:** Running

#### Backend (Node.js + Express + PostgreSQL)
- ✅ Database schema implemented with Neon.tech
- ✅ Idempotent migration runner added in `server/src/db.ts`
- ✅ Expanded trainers table and created resources, downloads, subscriptions, payment_history, payment_plans
- ✅ Added `server/src/types.ts` for TrainerResponse, TrainerProfileUpdate, Resource, Subscription, PaymentHistoryRecord, PaymentPlan, ApiError
- ✅ Added `POST /api/trainers/signup` and `POST /api/trainers/signin`
- ✅ Added protected trainer profile routes: `GET /api/trainers/:id`, `PUT /api/trainers/:id`, `GET /api/trainers/me/profile`
- ✅ Added auth middleware in `server/src/middleware/authMiddleware.ts`
- ✅ Implemented profile controllers in `server/src/controllers/trainerController.ts`
- ✅ Updated route definitions in `server/src/routes/trainerRoutes.ts`
- ✅ Fixed server startup/workdir issues and confirmed `.env` loading for `DATABASE_URL`
- ✅ Verified backend with health check, signup, signin, profile retrieval, and profile update
- ✅ TypeScript compilation passes and runtime manual endpoint verification completed

**Status:** Backend verified May 18, 2026

#### Documentation (6 files)
- ARCHITECTURE.md (180 lines) — Problem & solution overview
- DECISIONS.md (covered in README_TRAINER_REFACTOR.md) — Trade-offs
- IMPLEMENTATION.md (this file) — Updated testing guide
- README_TRAINER_REFACTOR.md (350 lines) — Complete overview
- BACKEND_VERIFICATION_REPORT.md (200 lines) — API verification
- Example templates (4 files) — Reference implementations

### Backend Implementation Progress
- Created `server/src/db.ts` with migration runner and seed logic for payment plans
- Added and verified `server/src/server.ts` initialization with CORS and route registration
- Added `server/src/controllers/trainerController.ts` for signup, profile retrieval, profile update, and current-user profile
- Added `server/src/routes/trainerRoutes.ts` for authentication and profile endpoints
- Added `server/src/middleware/authMiddleware.ts` for authenticated access and ownership checks
- Verified backend with `curl` and Node fetch tests, confirming live endpoints on `http://localhost:3000`
- Found and resolved issues with stale processes, missing startup scripts, and local tsx execution

### May 22 Progress
- ✅ **Signin Feature Testing** — Created comprehensive test suite (`server/test-signin.js`) covering:
  - Valid signup → signin flow
  - Correct password acceptance (200)
  - Wrong password rejection (401)
  - Non-existent email rejection (401)
  - All tests passed successfully

- ✅ **Shared Folder Structure** — Created unified types and constants layer:
  - `shared/types.ts` — 180+ lines of shared TypeScript interfaces
  - `shared/constants.ts` — API endpoints, validation rules, error messages
  - `shared/index.ts` — Central export point
  - `shared/README.md` — Integration guide for frontend and backend
  - Benefits: Single source of truth, type safety across API boundary, reduced duplication

- ✅ **Testing Documentation** — Updated `TESTING_BACKEND.md` with:
  - Signin endpoint test cases (valid, invalid password, email not found, missing fields)
  - Expected response codes and error messages
  - Test results summary with all scenarios passing

### ⏳ What's Next (Phase 3)

**Phase 3: Testing & QA** (✅ COMPLETE - May 22, 2026)

#### Unit Tests (9 tests) ✅ PASSED
1. **TrainerCTA.test.tsx** (4 tests)
   - ✅ Renders primary variant with expected class
   - ✅ Renders secondary variant with custom label
   - ✅ Renders small variant with expected class
   - ✅ Calls onSignupClick when clicked

2. **trainerOnboarding.test.ts** (4 tests)
   - ✅ Contains required top-level config sections
   - ✅ Has non-empty primary CTA content
   - ✅ Has matching flow step labels for each step
   - ✅ Declares signup analytics event keys

3. **useTrainerSignup.test.tsx** (5 tests)
   - ✅ Starts with modal closed and first step active
   - ✅ Opens and closes signup modal
   - ✅ Progresses steps forward and backward with boundaries
   - ✅ Updates form data fields
   - ✅ Submits signup data through the backend API

#### Integration Tests (13 tests) ✅ PASSED
1. **TrainerSignup.integration.test.tsx** (6 tests)
   - ✅ Opens signup modal from any CTA button (2651ms)
   - ✅ Opens and closes modal from CTA and close button (1934ms)
   - ✅ Closes modal when backdrop is clicked (1331ms)
   - ✅ Shows inline validation errors (760ms)
   - ✅ Progresses through signup and submits to API (999ms)
   - ✅ Resets form after close and reopen (1654ms)

2. **TrainerSignup.lifecycle.integration.test.tsx** (3 tests)
   - ✅ Opens modal from CTA through shared hook context
   - ✅ Closes modal from close button and backdrop
   - ✅ Retains entered form data while progressing

#### Testing Infrastructure
- **vitest.config.mjs**: Configured with forks pool, singleThread mode, 30000ms timeout
- **Setup**: setupTests.ts with jsdom environment and Canvas API mocks
- **Total Test Time**: 18.87s (1.73s transform, 2.11s setup, 6.72s import, 11.58s tests)

#### Test Results Summary
- **Test Files**: 5 passed ✅
- **Tests**: 22 passed ✅
- **Coverage**: Component rendering, user interactions, form validation, API calls, state management
- **Status**: READY FOR DEPLOYMENT ✅

---

## Phase 4: Production Enhancements (4-6 hours) 📅 PLANNED

**Scope:** Real API integration, email verification, analytics, accessibility improvements, and Storybook documentation

### 📅 What's Planned (Phase 4)

**Phase 4: Enhancements**
- [ ] Real API integration (connect to backend)
- [ ] Email verification flow
- [ ] Analytics tracking
- [ ] Accessibility improvements
- [ ] Storybook documentation

**Estimated time:** 4-6 hours

---

## Phase 2: Component Refactoring (COMPLETE ✅)

**All 5 components successfully migrated on May 17, 2026.**

### What Was Done

#### 2.1 Hero.tsx ✅
- Integrated `<TrainerCTA variant="secondary" />`
- Removed hardcoded button
- Connected to `useTrainerSignup()` hook

#### 2.2 Solutions.tsx ✅
- Integrated `<TrainerCTA variant="small" />`
- Updated "Publish With Confidence" section
- Connected to `useTrainerSignup()` hook

#### 2.3 TrainersHub.tsx ✅
- Replaced entire trainer section with `<TrainerOnboarding.Preview />`
- Connected to `useTrainerSignup()` hook
- All styling handled by feature component

#### 2.4 FAQ.tsx ✅
- References `TRAINER_ONBOARDING.faq` config
- Trainer FAQ question/answer now centralized
- Single source of truth for copy

#### 2.5 UserPaths.tsx ✅
- Deleted (duplicate content now handled by TrainersHub)
- No broken imports
- App loads successfully

### Results

- **Duplicate CTAs:** 5 → 1 ✅
- **Files touching trainer copy:** 5 → 1 ✅
- **Time to change copy:** 5-10 min → 1 min ✅
- **Breaking changes:** 0 ✅
- **Build status:** ✅ Compiles successfully
- **App status:** ✅ Running without errors

---

## Phase 3: Testing & QA (IN PROGRESS ⏳)

Comprehensive test coverage for all new components and refactored functionality.

**Current Problem:**

```tsx
// ❌ Hardcoded button
<a href="#signup" className="btn-secondary">
  Become a Trainer
</a>
```

**Refactored Solution:**

```tsx
import TrainerCTA from "./CTAs/TrainerCTA";
import { useTrainerSignup } from "../features/TrainerOnboarding";

export default function Hero() {
  const { openSignup } = useTrainerSignup();

  return (
    <section className="hero">
      <h1>Share Your Knowledge</h1>
      <p>Turn training into impact</p>

      <TrainerCTA
        variant="secondary"
        label="Become a Trainer"
        onSignupClick={() => openSignup("hero")}
      />
    </section>
  );
}
```

**Changes:**

- Add imports (2 lines)
- Extract `useTrainerSignup()` (1 line)
- Replace button with `<TrainerCTA />` (5 lines)
- Remove old button styling (search for `.btn-secondary` in Hero.css, delete trainer-specific styles)

**Time:** 5 minutes

**Testing:**

```bash
# Dev: npm run dev → Click "Become a Trainer" → Modal opens ✓
# Component renders button ✓
# Modal closes when user clicks X ✓
```

---

### 2.2 Solutions.tsx — Trainer CTA (Small)

**Current Problem:**

```tsx
// ❌ Hardcoded button in footer-like section
<button className="call-out">Create Trainer Account</button>
```

**Refactored Solution:**

```tsx
import TrainerCTA from "./CTAs/TrainerCTA";
import { useTrainerSignup } from "../features/TrainerOnboarding";

export default function Solutions() {
  const { openSignup } = useTrainerSignup();

  return (
    <section className="solutions">
      {/* ... solutions grid ... */}

      <div className="solutions-cta">
        <h3>Ready to teach?</h3>
        <TrainerCTA
          variant="small"
          label="Create Trainer Account"
          onSignupClick={() => openSignup("solutions")}
        />
      </div>
    </section>
  );
}
```

**Changes:**

- Add imports (2 lines)
- Extract `useTrainerSignup()` (1 line)
- Replace button with `<TrainerCTA variant="small" />` (5 lines)
- Remove old button styling from Solutions.css

**Time:** 5 minutes

**Testing:**

```bash
# Dev: npm run dev → Click "Create Trainer Account" → Modal opens ✓
# Modal uses same state as Hero (form resets) ✓
```

---

### 2.3 TrainersHub.tsx — Trainer Onboarding Preview

**Current Problem:**

```tsx
// ❌ Full signup preview hardcoded in component
<section className="trainers-hub">
  <h2>Turn Training Into Impact</h2>
  <p>Detailed trainer benefits...</p>
  <button>Create Trainer Account</button>
  <button>Browse Resources</button>
</section>
```

**Refactored Solution:**

```tsx
import {
  TrainerOnboarding,
  useTrainerSignup,
} from "../features/TrainerOnboarding";

export default function TrainersHub() {
  const { openSignup } = useTrainerSignup();

  return (
    <div className="trainers-hub">
      <TrainerOnboarding.Preview
        onSignupClick={() => openSignup("trainers-hub")}
      />

      {/* Additional TrainersHub-specific content can live here */}
    </div>
  );
}
```

**What Happens:**

- `TrainerOnboarding.Preview` renders:
  - "Turn Training Into Impact" title
  - Trainer benefits list (from config)
  - Primary CTA "Create Trainer Account"
  - Secondary CTA "Browse Resources"
- All styling handled by TrainerOnboarding.css
- Both CTAs use the same `openSignup()` callback

**Changes:**

- Replace entire trainer section with `<TrainerOnboarding.Preview />`
- Remove all hardcoded trainer copy/buttons
- Remove TrainerOnboarding-specific CSS from TrainersHub.css

**Time:** 10 minutes

**Testing:**

```bash
# Dev: npm run dev → Check TrainersHub → Trainer preview renders ✓
# Click "Create Trainer Account" → Modal opens with email step ✓
# Click "Browse Resources" → Callback fired (implement in Phase 2)
# Modal uses same state as Hero/Solutions (consistent UX) ✓
```

---

### 2.4 FAQ.tsx — Trainer FAQ Reference

**Current Problem:**

```tsx
// ❌ Trainer FAQ hardcoded
const FAQS = [
  {
    question: "How do I become a trainer?",
    answer: "Click Create Trainer Account and fill out your profile...",
  },
  // ... more FAQs ...
];
```

**Refactored Solution:**

```tsx
import { TRAINER_ONBOARDING } from "../config/trainerOnboarding";

const FAQS = [
  {
    question: TRAINER_ONBOARDING.faq.question,
    answer: TRAINER_ONBOARDING.faq.answer,
  },
  // ... other FAQs ...
];
```

**Changes:**

- Add import (1 line)
- Replace hardcoded copy with config references (2 lines)
- Remove old trainer FAQ question/answer

**Time:** 3 minutes

**Testing:**

```bash
# Dev: npm run dev → FAQ page → Trainer FAQ shows ✓
# Copy matches trainerOnboarding.ts config ✓
```

---

### 2.5 UserPaths.tsx — REMOVE (Role Absorbed)

**Current Problem:**

```
UserPaths.tsx has "Create Trainer Account" section
(now handled by TrainersHub.tsx via TrainerOnboarding.Preview)
```

**Solution:** Delete `src/components/UserPaths.tsx` and remove from imports

**Changes to Other Files:**

```tsx
// In App.tsx or wherever UserPaths is imported
import UserPaths from './components/UserPaths'  // ❌ Remove this
⬇️
// UserPaths was displaying trainer info (now in TrainersHub)
// No other changes needed
```

**Impact:**

- No breaking changes (UserPaths was just duplicating TrainersHub content)
- Cleaner codebase
- One less component to maintain

**Time:** 2 minutes

**Testing:**

```bash
# Verify app still loads ✓
# No broken imports ✓
```

---

## Phase 3: Testing & QA (IN PROGRESS ⏳)

Now that Phase 2 migration is complete, add comprehensive test coverage for all new components and refactored functionality.

### Unit Tests

#### TrainerCTA Tests

```tsx
// src/components/CTAs/__tests__/TrainerCTA.test.tsx

describe("TrainerCTA", () => {
  it("renders with correct variant styles", () => {
    const { container } = render(
      <TrainerCTA variant="primary" onSignupClick={() => {}} />,
    );
    expect(container.querySelector(".trainer-cta-primary")).toBeInTheDocument();
  });

  it("calls onSignupClick when clicked", () => {
    const handleClick = jest.fn();
    const { getByRole } = render(
      <TrainerCTA variant="primary" label="Test" onSignupClick={handleClick} />,
    );
    fireEvent.click(getByRole("button"));
    expect(handleClick).toHaveBeenCalled();
  });

  it("applies custom label", () => {
    const { getByText } = render(
      <TrainerCTA
        variant="primary"
        label="Custom Label"
        onSignupClick={() => {}}
      />,
    );
    expect(getByText("Custom Label")).toBeInTheDocument();
  });

  it("disables button when disabled prop is true", () => {
    const { getByRole } = render(
      <TrainerCTA variant="primary" onSignupClick={() => {}} disabled />,
    );
    expect(getByRole("button")).toBeDisabled();
  });
});
```

#### useTrainerSignup Hook Tests

```tsx
// src/features/TrainerOnboarding/__tests__/hooks/useTrainerSignup.test.ts

describe("useTrainerSignup", () => {
  it("initializes with modal closed", () => {
    const { result } = renderHook(() => useTrainerSignup());
    expect(result.current.isOpen).toBe(false);
  });

  it("opens modal on openSignup()", () => {
    const { result } = renderHook(() => useTrainerSignup());
    act(() => result.current.openSignup("test-source"));
    expect(result.current.isOpen).toBe(true);
  });

  it("closes modal on closeSignup()", () => {
    const { result } = renderHook(() => useTrainerSignup());
    act(() => result.current.openSignup());
    act(() => result.current.closeSignup());
    expect(result.current.isOpen).toBe(false);
  });

  it("progresses through form steps", () => {
    const { result } = renderHook(() => useTrainerSignup());
    act(() => result.current.openSignup());
    expect(result.current.currentStep).toBe(0);

    act(() => result.current.nextStep());
    expect(result.current.currentStep).toBe(1);

    act(() => result.current.nextStep());
    expect(result.current.currentStep).toBe(2);

    act(() => result.current.prevStep());
    expect(result.current.currentStep).toBe(1);
  });

  it("updates form data", () => {
    const { result } = renderHook(() => useTrainerSignup());
    act(() => result.current.updateFormData("email", "test@example.com"));
    expect(result.current.formData.email).toBe("test@example.com");
  });

  it("submits form with complete data", async () => {
    const { result } = renderHook(() => useTrainerSignup());
    act(() => result.current.openSignup());
    act(() => result.current.updateFormData("email", "test@example.com"));

    const submitPromise = act(() => result.current.submitForm());
    expect(result.current.isOpen).toBe(false); // Closes after submit
  });
});
```

#### Config Tests

```tsx
// src/config/__tests__/trainerOnboarding.test.ts

describe("TrainerOnboarding Config", () => {
  it("has all required properties", () => {
    expect(TRAINER_ONBOARDING).toHaveProperty("primaryCTA");
    expect(TRAINER_ONBOARDING).toHaveProperty("signupModal");
    expect(TRAINER_ONBOARDING).toHaveProperty("faq");
  });

  it("primaryCTA has label and description", () => {
    expect(TRAINER_ONBOARDING.primaryCTA).toHaveProperty("label");
    expect(TRAINER_ONBOARDING.primaryCTA).toHaveProperty("description");
    expect(TRAINER_ONBOARDING.primaryCTA.label).toBeTruthy();
    expect(TRAINER_ONBOARDING.primaryCTA.description).toBeTruthy();
  });

  it("form steps match expected count", () => {
    expect(TRAINER_ONBOARDING.signupModal.steps.length).toBe(4);
  });
});
```

### Integration Tests

#### Hero + TrainerCTA

```tsx
describe("Hero with TrainerCTA", () => {
  it("opens signup modal when CTA is clicked", () => {
    const { getByText, getByRole } = render(<Hero />);
    const button = getByText("Become a Trainer");

    fireEvent.click(button);

    // Modal should appear
    expect(getByRole("dialog")).toBeInTheDocument();
  });
});
```

#### TrainersHub + TrainerOnboarding.Preview

```tsx
describe("TrainersHub with TrainerOnboarding.Preview", () => {
  it("displays trainer benefits from config", () => {
    const { getByText } = render(<TrainersHub />);

    // Should show config title
    expect(getByText("Turn Training Into Impact")).toBeInTheDocument();

    // Should show primary CTA
    expect(getByText(TRAINER_ONBOARDING.primaryCTA.label)).toBeInTheDocument();
  });

  it("opens signup when Create Account is clicked", () => {
    const { getByText, getByRole } = render(<TrainersHub />);
    fireEvent.click(getByText(TRAINER_ONBOARDING.primaryCTA.label));
    expect(getByRole("dialog")).toBeInTheDocument();
  });
});
```

### 3.3 E2E Tests

```bash
# Install Cypress
npm install --save-dev cypress

# Open Cypress UI
npx cypress open

# Or run headless
npx cypress run
```

**E2E Test Suite:**

```tsx
// cypress/e2e/trainer-signup.cy.ts

describe("Trainer Signup E2E", () => {
  beforeEach(() => {
    cy.visit("/")
  })

  it("completes full signup flow from Hero CTA", () => {
    // Step 0: Click CTA and verify modal opens
    cy.contains("Become a Trainer").click()
    cy.get(".signup-modal").should("be.visible")

    // Step 0: Email validation
    cy.get('input[name="email"]').type("trainer@example.com")
    cy.get('input[name="password"]').type("SecurePassword123")
    cy.contains("button", "Next").click()

    // Step 1: Profile
    cy.get('input[name="fullName"]').type("John Trainer")
    cy.contains("button", "Next").click()

    // Step 2: Department
    cy.get('select[name="department"]').select("ICT")
    cy.contains("button", "Next").click()

    // Step 3: Review & Submit
    cy.contains("trainer@example.com").should("be.visible")
    cy.contains("John Trainer").should("be.visible")
    cy.contains("ICT").should("be.visible")
    cy.contains("button", "Create Account").click()

    // Success message (mock API response for now)
    cy.contains("Welcome, John!").should("be.visible")
  })

  it("opens same modal from multiple CTAs (state consistency)", () => {
    // From Hero
    cy.contains("Become a Trainer").click()
    cy.get(".signup-modal").should("be.visible")
    cy.get('input[name="email"]').type("test@example.com")

    // Close modal
    cy.get(".close-button").click()

    // Open from Solutions
    cy.get("main").scrollTo("bottom")
    cy.contains("Create Trainer Account").eq(0).click()

    // Form should reset (not retain email)
    cy.get('input[name="email"]').should("have.value", "")
  })

  it("validates password requirements", () => {
    cy.contains("Become a Trainer").click()

    // Too short
    cy.get('input[name="password"]').type("Short1")
    cy.contains("button", "Next").click()
    cy.contains("at least 8 characters").should("be.visible")

    // Missing uppercase
    cy.get('input[name="password"]').clear().type("lowercase123")
    cy.contains("uppercase").should("be.visible")

    // Valid password
    cy.get('input[name="password"]').clear().type("ValidPassword123")
    cy.contains("uppercase").should("not.exist")
  })
})
```

---

## Rollback Plan

If issues arise, you can safely roll back:

1. **Stop Migration:** Don't update any more components
2. **Delete New Code:** Remove new files (they don't affect existing code)
3. **Restore Old Components:** git checkout old versions if modified
4. **Zero App Impact:** Architecture is additive, not destructive

**Estimated rollback time:** 5 minutes

---

## Code Checklists

### Before Starting Phase 2

- [ ] Read [ARCHITECTURE.md](./ARCHITECTURE.md) (15 min)
- [ ] Review [DECISIONS.md](./DECISIONS.md) for trade-offs (10 min)
- [ ] Run `npm run dev` and verify app loads
- [ ] Check that all Phase 1 files exist and have no errors

### During Phase 2 (Each Component)

- [ ] Create feature branch: `git checkout -b refactor/trainer-cta-hero`
- [ ] Update component with new imports and `useTrainerSignup()`
- [ ] Replace hardcoded button with `<TrainerCTA />`
- [ ] Test locally: `npm run dev`
- [ ] Run tests: `npm run test`
- [ ] Check console for errors/warnings
- [ ] Commit: `git commit -m "refactor: use TrainerCTA in Hero"`

### After Phase 2 Complete

- [ ] All 5 components refactored ✓
- [ ] No console errors ✓
- [ ] Build succeeds: `npm run build` ✓
- [ ] Tests pass: `npm run test` ✓
- [ ] Delete UserPaths.tsx
- [ ] Open PR for team review
- [ ] Merge to main

---

## Bundle Size Verification

After Phase 2 complete, verify bundle size:

```bash
# Build and analyze
npm run build

# Check dist/ size
ls -lh dist/assets/

# Expected:
# ≈ 150-160KB total (slight increase from +4KB new code, -3KB removed duplication)
```

---

## Performance Checklist

- [ ] No console errors on landing page load
- [ ] Modal opens/closes within 100ms
- [ ] Form steps transition smoothly
- [ ] No memory leaks (check DevTools heap snapshots)
- [ ] Lighthouse score unchanged (Core Web Vitals)

---

## Accessibility Checklist (Phase 3)

- [ ] ARIA labels on all buttons
- [ ] Focus management in modal
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Color contrast passes WCAG AA
- [ ] Screen reader reads all content

---

---

## Performance Checklist

- [ ] No console errors on landing page load
- [ ] Modal opens/closes within 100ms
- [ ] Form steps transition smoothly
- [ ] No memory leaks (check DevTools heap snapshots)
- [ ] Lighthouse score unchanged (Core Web Vitals)

---

## Accessibility Checklist (Phase 3)

- [ ] ARIA labels on all buttons
- [ ] Focus management in modal
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Color contrast passes WCAG AA
- [ ] Screen reader reads all content

---

## Success Criteria (Updated)

| Metric                            | Target         | Status        |
| --------------------------------- | -------------- | ------------- |
| **Duplicate CTAs eliminated**     | 5 → 1          | ✅ COMPLETE   |
| **Files touching trainer copy**   | 5 → 1          | ✅ COMPLETE   |
| **Time to change CTA copy**       | 5-10min → 1min | ✅ COMPLETE   |
| **Signup testable independently** | No → Yes       | ✅ COMPLETE   |
| **Trainer messaging consistency** | Medium → High  | ✅ COMPLETE   |
| **Bundle size**                   | +4KB justified | ✅ COMPLETE   |
| **Build succeeds**                | -              | ✅ COMPLETE   |
| **No breaking changes**           | -              | ✅ COMPLETE   |
| **Unit tests added**              | 0 → 8+         | ⏳ In Progress |
| **E2E tests added**               | 0 → 3+         | ⏳ In Progress |
| **Accessibility verified**        | ❌ → ✅        | ⏳ In Progress |
| **Mobile responsive verified**    | ❌ → ✅        | ⏳ In Progress |

---

## Timeline Estimate (Updated)

| Phase       | Task                           | Time          | Status          |
| ----------- | ------------------------------ | ------------- | --------------- |
| 1           | Create foundation files        | -             | ✅ Complete     |
| 2           | Refactor Hero.tsx              | 5 min         | ✅ Complete     |
| 2           | Refactor Solutions.tsx         | 5 min         | ✅ Complete     |
| 2           | Refactor TrainersHub.tsx       | 10 min        | ✅ Complete     |
| 2           | Refactor FAQ.tsx               | 3 min         | ✅ Complete     |
| 2           | Delete UserPaths.tsx           | 2 min         | ✅ Complete     |
| 2           | Testing & debugging            | 1-2 hours     | ✅ Complete     |
| **2 Total** | **Phase 2 Complete**           | **2-3 hours** | ✅ Complete     |
| 3.1         | Unit test suite                | 1-2 hours     | ⏳ Next Priority |
| 3.2         | E2E test suite                 | 1 hour        | ⏳ Next Priority |
| 3.3         | Accessibility audit            | 1 hour        | ⏳ Next Priority |
| 3.4         | Mobile responsive tests        | 30 min        | ⏳ Next Priority |
| 3.5         | Performance & bundle check     | 30 min        | ⏳ Next Priority |
| **3 Total** | **Phase 3 Complete**           | **2-3 hours** | ⏳ Next Priority |

---

## Next Steps

1. **NOW:** Start Phase 3.1 - Unit Tests
   - Create test files for TrainerCTA, useTrainerSignup, config
   - Aim for 80%+ code coverage

2. **THEN:** Phase 3.2 - E2E Tests
   - Set up Cypress
   - Write signup flow tests
   - Test form validation

3. **FINALLY:** Phase 3.3-3.5 - Accessibility & Performance
   - Run WCAG audit
   - Mobile responsive verification
   - Bundle size analysis

4. **PHASE 4:** Backend Integration & Enhancements

See [ARCHITECTURE.md](./ARCHITECTURE.md) for design rationale. See [README_TRAINER_REFACTOR.md](../README_TRAINER_REFACTOR.md) for complete overview.

---

## Backend Integration (Ready When Phase 3 Complete)

### Current Backend Status

The backend API is **production-ready** as of May 5, 2026. See [BACKEND_VERIFICATION_REPORT.md](../BACKEND_VERIFICATION_REPORT.md) for full details.

**Available Endpoint:**
```
POST /api/trainers/signup
http://localhost:3000/api/trainers/signup

Request Body:
{
  "email": "trainer@example.com",
  "password": "SecurePassword123",
  "fullName": "John Trainer",
  "department": "ICT"
}

Response (201 Created):
{
  "id": "uuid-here",
  "email": "trainer@example.com",
  "fullName": "John Trainer",
  "department": "ICT",
  "createdAt": "2026-05-17T10:30:00Z",
  "isVerified": false
}
```

### Integration Points

After Phase 2 migration is complete, integrate the frontend form with the backend:

1. **Update useTrainerSignup.ts** to call the API endpoint
2. **Add error handling** for duplicate emails, validation failures
3. **Add success handling** to show completion message
4. **Add loading states** to prevent double-submission

**Where to integrate:**
- File: `src/features/TrainerOnboarding/hooks/useTrainerSignup.ts`
- Function: `submitForm()` (currently returns mock response)
- API URL: `http://localhost:3000/api/trainers/signup`

**Phase 4 task:** Real API integration (4-6 hours)

---

## Progress Checklist (Updated May 17, 2026)

### Phase 1: Foundation ✅
- [x] Config layer created
- [x] Hooks layer created
- [x] CTA components created
- [x] Feature component created
- [x] Comprehensive documentation written
- [x] Example templates provided
- [x] Zero breaking changes introduced

### Phase 2: Component Refactoring ✅ COMPLETE
- [x] Hero.tsx refactored — Using `<TrainerCTA variant="secondary" />`
- [x] Solutions.tsx refactored — Using `<TrainerCTA variant="small" />`
- [x] TrainersHub.tsx refactored — Using `<TrainerOnboarding.Preview />`
- [x] FAQ.tsx updated — References `TRAINER_ONBOARDING.faq` config
- [x] UserPaths.tsx removed — Eliminated duplicate content
- [x] App loads without errors
- [x] No console errors or warnings
- [x] Build succeeds: `npm run build` ✅

### Phase 3: Testing & QA ⏳ IN PROGRESS
- [ ] Unit test suite added (TrainerCTA, useTrainerSignup, config)
- [ ] Integration tests added (components + hooks)
- [ ] E2E tests added (full signup flow)
- [ ] Mobile responsive verified (< 640px, 768px, 1024px)
- [ ] Accessibility audit completed (WCAG AA)
- [ ] Performance baseline established
- [ ] All tests passing with >80% coverage

### Phase 4: Enhancements 📅 PLANNED
- [ ] Real API integration (connect to backend)
- [ ] Email verification flow
- [ ] Analytics tracking (source, completion rate)
- [ ] Accessibility improvements (if needed)
- [ ] Storybook documentation

