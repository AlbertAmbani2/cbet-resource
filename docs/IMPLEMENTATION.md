# Implementation Guide: Trainer Onboarding Refactor

This document provides step-by-step instructions to implement the trainer onboarding refactor across the landing page.

## Overview

Transform 5 duplicate "Create Trainer Account" implementations into unified architecture with no breaking changes.

**Timeline:** Phase 1 (foundation) already complete. Phase 2 (component migration) = 4-6 hours. Phase 3 (testing) = 2-3 hours.

---

## Phase 1: Foundation (COMPLETE ✅)

Created without modifying existing code:

- ✅ `src/config/trainerOnboarding.ts` — Centralized copy
- ✅ `src/features/TrainerOnboarding/hooks/useTrainerSignup.ts` — State management
- ✅ `src/components/CTAs/TrainerCTA.tsx` — Reusable button
- ✅ `src/components/CTAs/TrainerCTA.css` — Styling
- ✅ `src/components/CTAs/TrainerCTAGroup.tsx` — Layout wrapper
- ✅ `src/features/TrainerOnboarding/TrainerOnboarding.tsx` — Feature component
- ✅ `src/features/TrainerOnboarding/TrainerOnboarding.css` — Feature styling
- ✅ `src/features/TrainerOnboarding/index.ts` — Public API

**Status:** Ready to move to Phase 2. Zero breaking changes so far.

---

## Phase 2: Component Refactoring

Refactor 5 landing page components to use new infrastructure. Each can be done independently.

### 2.1 Hero.tsx — Trainer CTA (Secondary)

**Current Problem:**
```tsx
// ❌ Hardcoded button
<a href="#signup" className="btn-secondary">
  Become a Trainer
</a>
```

**Refactored Solution:**
```tsx
import TrainerCTA from './CTAs/TrainerCTA'
import { useTrainerSignup } from '../features/TrainerOnboarding'

export default function Hero() {
  const { openSignup } = useTrainerSignup()

  return (
    <section className="hero">
      <h1>Share Your Knowledge</h1>
      <p>Turn training into impact</p>
      
      <TrainerCTA
        variant="secondary"
        label="Become a Trainer"
        onSignupClick={() => openSignup('hero')}
      />
    </section>
  )
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
<button className="call-out">
  Create Trainer Account
</button>
```

**Refactored Solution:**
```tsx
import TrainerCTA from './CTAs/TrainerCTA'
import { useTrainerSignup } from '../features/TrainerOnboarding'

export default function Solutions() {
  const { openSignup } = useTrainerSignup()

  return (
    <section className="solutions">
      {/* ... solutions grid ... */}
      
      <div className="solutions-cta">
        <h3>Ready to teach?</h3>
        <TrainerCTA
          variant="small"
          label="Create Trainer Account"
          onSignupClick={() => openSignup('solutions')}
        />
      </div>
    </section>
  )
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
import { TrainerOnboarding, useTrainerSignup } from '../features/TrainerOnboarding'

export default function TrainersHub() {
  const { openSignup } = useTrainerSignup()

  return (
    <div className="trainers-hub">
      <TrainerOnboarding.Preview
        onSignupClick={() => openSignup('trainers-hub')}
      />
      
      {/* Additional TrainersHub-specific content can live here */}
    </div>
  )
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
    question: 'How do I become a trainer?',
    answer: 'Click Create Trainer Account and fill out your profile...'
  },
  // ... more FAQs ...
]
```

**Refactored Solution:**
```tsx
import { TRAINER_ONBOARDING } from '../config/trainerOnboarding'

const FAQS = [
  {
    question: TRAINER_ONBOARDING.faq.question,
    answer: TRAINER_ONBOARDING.faq.answer
  },
  // ... other FAQs ...
]
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

## Import Patterns (Quick Reference)

### Use TrainerCTA in Any Component

```tsx
import TrainerCTA from './CTAs/TrainerCTA'
import { useTrainerSignup } from '../features/TrainerOnboarding'

const { openSignup } = useTrainerSignup()

<TrainerCTA
  variant="primary|secondary|small"
  label="Custom Label"          // optional, from config
  onSignupClick={() => openSignup('your-component-name')}
/>
```

### Use TrainerOnboarding Feature

```tsx
import { TrainerOnboarding, useTrainerSignup } from '../features/TrainerOnboarding'

const { openSignup } = useTrainerSignup()

// Option 1: Preview (summary section)
<TrainerOnboarding.Preview
  onSignupClick={() => openSignup('trainers-hub')}
/>

// Option 2: Form (modal content)
<TrainerOnboarding.Form />

// Option 3: Default (wrapper)
<TrainerOnboarding />
```

### Reference Trainer Config

```tsx
import { TRAINER_ONBOARDING } from '../config/trainerOnboarding'

// Access any config value
const label = TRAINER_ONBOARDING.primaryCTA.label
const steps = TRAINER_ONBOARDING.signupModal.steps
const faqQuestion = TRAINER_ONBOARDING.faq.question
```

---

## Testing Strategy

### Unit Tests

#### TrainerCTA Tests

```tsx
// src/components/CTAs/__tests__/TrainerCTA.test.tsx

describe('TrainerCTA', () => {
  it('renders with correct variant styles', () => {
    const { container } = render(
      <TrainerCTA variant="primary" onSignupClick={() => {}} />
    )
    expect(container.querySelector('.trainer-cta-primary')).toBeInTheDocument()
  })

  it('calls onSignupClick when clicked', () => {
    const handleClick = jest.fn()
    const { getByRole } = render(
      <TrainerCTA
        variant="primary"
        label="Test"
        onSignupClick={handleClick}
      />
    )
    fireEvent.click(getByRole('button'))
    expect(handleClick).toHaveBeenCalled()
  })

  it('applies custom label', () => {
    const { getByText } = render(
      <TrainerCTA
        variant="primary"
        label="Custom Label"
        onSignupClick={() => {}}
      />
    )
    expect(getByText('Custom Label')).toBeInTheDocument()
  })

  it('disables button when disabled prop is true', () => {
    const { getByRole } = render(
      <TrainerCTA
        variant="primary"
        onSignupClick={() => {}}
        disabled
      />
    )
    expect(getByRole('button')).toBeDisabled()
  })
})
```

#### useTrainerSignup Hook Tests

```tsx
// src/features/TrainerOnboarding/__tests__/hooks/useTrainerSignup.test.ts

describe('useTrainerSignup', () => {
  it('initializes with modal closed', () => {
    const { result } = renderHook(() => useTrainerSignup())
    expect(result.current.isOpen).toBe(false)
  })

  it('opens modal on openSignup()', () => {
    const { result } = renderHook(() => useTrainerSignup())
    act(() => result.current.openSignup('test-source'))
    expect(result.current.isOpen).toBe(true)
  })

  it('closes modal on closeSignup()', () => {
    const { result } = renderHook(() => useTrainerSignup())
    act(() => result.current.openSignup())
    act(() => result.current.closeSignup())
    expect(result.current.isOpen).toBe(false)
  })

  it('progresses through form steps', () => {
    const { result } = renderHook(() => useTrainerSignup())
    act(() => result.current.openSignup())
    expect(result.current.currentStep).toBe(0)
    
    act(() => result.current.nextStep())
    expect(result.current.currentStep).toBe(1)
    
    act(() => result.current.nextStep())
    expect(result.current.currentStep).toBe(2)
    
    act(() => result.current.prevStep())
    expect(result.current.currentStep).toBe(1)
  })

  it('updates form data', () => {
    const { result } = renderHook(() => useTrainerSignup())
    act(() => result.current.updateFormData('email', 'test@example.com'))
    expect(result.current.formData.email).toBe('test@example.com')
  })

  it('submits form with complete data', async () => {
    const { result } = renderHook(() => useTrainerSignup())
    act(() => result.current.openSignup())
    act(() => result.current.updateFormData('email', 'test@example.com'))
    
    const submitPromise = act(() => result.current.submitForm())
    expect(result.current.isOpen).toBe(false) // Closes after submit
  })
})
```

#### Config Tests

```tsx
// src/config/__tests__/trainerOnboarding.test.ts

describe('TrainerOnboarding Config', () => {
  it('has all required properties', () => {
    expect(TRAINER_ONBOARDING).toHaveProperty('primaryCTA')
    expect(TRAINER_ONBOARDING).toHaveProperty('signupModal')
    expect(TRAINER_ONBOARDING).toHaveProperty('faq')
  })

  it('primaryCTA has label and description', () => {
    expect(TRAINER_ONBOARDING.primaryCTA).toHaveProperty('label')
    expect(TRAINER_ONBOARDING.primaryCTA).toHaveProperty('description')
    expect(TRAINER_ONBOARDING.primaryCTA.label).toBeTruthy()
    expect(TRAINER_ONBOARDING.primaryCTA.description).toBeTruthy()
  })

  it('form steps match expected count', () => {
    expect(TRAINER_ONBOARDING.signupModal.steps.length).toBe(4)
  })
})
```

### Integration Tests

#### Hero + TrainerCTA

```tsx
describe('Hero with TrainerCTA', () => {
  it('opens signup modal when CTA is clicked', () => {
    const { getByText, getByRole } = render(<Hero />)
    const button = getByText('Become a Trainer')
    
    fireEvent.click(button)
    
    // Modal should appear
    expect(getByRole('dialog')).toBeInTheDocument()
  })
})
```

#### TrainersHub + TrainerOnboarding.Preview

```tsx
describe('TrainersHub with TrainerOnboarding.Preview', () => {
  it('displays trainer benefits from config', () => {
    const { getByText } = render(<TrainersHub />)
    
    // Should show config title
    expect(getByText('Turn Training Into Impact')).toBeInTheDocument()
    
    // Should show primary CTA
    expect(getByText(TRAINER_ONBOARDING.primaryCTA.label)).toBeInTheDocument()
  })

  it('opens signup when Create Account is clicked', () => {
    const { getByText, getByRole } = render(<TrainersHub />)
    fireEvent.click(getByText(TRAINER_ONBOARDING.primaryCTA.label))
    expect(getByRole('dialog')).toBeInTheDocument()
  })
})
```

### E2E Tests (Phase 3)

```tsx
describe('Trainer Signup E2E', () => {
  it('completes full signup flow', async () => {
    cy.visit('/'); // Load landing page
    cy.contains('Create Trainer Account').click(); // Click CTA
    
    // Step 0: Email
    cy.get('input[name="email"]').type('trainer@example.com');
    cy.get('input[name="password"]').type('SecurePassword123');
    cy.contains('Next').click();
    
    // Step 1: Profile
    cy.get('input[name="fullName"]').type('John Trainer');
    cy.contains('Next').click();
    
    // Step 2: Department
    cy.get('select[name="department"]').select('Engineering');
    cy.contains('Next').click();
    
    // Step 3: Review
    cy.contains('trainer@example.com').should('be.visible');
    cy.contains('John Trainer').should('be.visible');
    cy.contains('Engineering').should('be.visible');
    cy.contains('Create Account').click();
    
    // Success (Phase 2)
    cy.contains('Welcome, John!').should('be.visible');
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

## Success Criteria

| Metric | Target | Status |
|--------|--------|--------|
| **Duplicate CTAs eliminated** | 5 → 1 | ✅ |
| **Files touching trainer copy** | 5 → 1 | After Phase 2 |
| **Time to change CTA copy** | 5-10min → 1min | After Phase 2 |
| **Signup testable independently** | No → Yes | After Phase 2 |
| **Trainer messaging consistency** | Medium → High | After Phase 2 |
| **Bundle size** | +4KB justified | After Phase 2 |
| **Build succeeds** | - | ✅ |
| **No breaking changes** | - | ✅ |

---

## Timeline Estimate

| Phase | Task | Time | Status |
|-------|------|------|--------|
| 1 | Create foundation files | - | ✅ Complete |
| 2 | Refactor Hero.tsx | 5 min | ⏳ Ready |
| 2 | Refactor Solutions.tsx | 5 min | ⏳ Ready |
| 2 | Refactor TrainersHub.tsx | 10 min | ⏳ Ready |
| 2 | Refactor FAQ.tsx | 3 min | ⏳ Ready |
| 2 | Delete UserPaths.tsx | 2 min | ⏳ Ready |
| 2 | Testing & debugging | 1-2 hours | ⏳ Ready |
| **2 Total** | **Phase 2 Complete** | **4-6 hours** | ⏳ Ready |
| 3 | Unit test suite | 1-2 hours | 📅 Next |
| 3 | E2E test suite | 1 hour | 📅 Next |
| 3 | Accessibility audit | 1 hour | 📅 Next |
| **3 Total** | **Phase 3 Complete** | **2-3 hours** | 📅 Next |

---

## Next Steps

1. **NOW:** Start Phase 2 with Hero.tsx (smallest change, fastest win)
2. **Then:** Solutions.tsx, TrainersHub.tsx, FAQ.tsx
3. **Finally:** Verify tests pass and delete UserPaths.tsx
4. **Phase 3:** Add comprehensive test coverage

See [ARCHITECTURE.md](./ARCHITECTURE.md) for design rationale. See [DECISIONS.md](./DECISIONS.md) for trade-off analysis.
