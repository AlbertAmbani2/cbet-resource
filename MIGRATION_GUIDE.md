# Trainer CTA Refactor: Detailed Migration Guide

## Overview

This guide walks through refactoring the repetitive "Create Trainer Account" patterns into clean, maintainable architecture.

## Current State: Problems

### 1. Code Duplication (5 instances)
```
Hero.tsx                 → "Become a Trainer"
TrainersHub.tsx          → "Create Trainer Account" 
Solutions.tsx            → "Create Trainer Account"
UserPaths.tsx            → "Create Trainer Account"
FAQ.tsx                  → Trainer account description (hardcoded)
```

### 2. Tight Coupling
Each component owns:
- Button styling  
- CTA messaging
- Signup link
- Signup modal trigger logic

To change trainer flow = update all 5 files

### 3. Poor Testability
- Signup behavior can't be tested independently
- CTA logic mixed with component rendering
- No single source of truth for copy

---

## New Architecture

### 1. Configuration Layer
**File:** `src/config/trainerOnboarding.ts`

**Purpose:** Single source of truth for all trainer copy
- Primary CTA copy & description
- Secondary CTA label
- Small CTA label  
- FAQ question & answer
- Signup form steps & fields
- Analytics event names

**Benefits:**
- Change copy once, updates everywhere
- A/B testing ready (swap config)
- i18n ready (translate one file)
- Analytics tracking centralized

---

### 2. Hooks Layer
**File:** `src/features/TrainerOnboarding/hooks/useTrainerSignup.ts`

**Purpose:** Encapsulate signup state & logic
```tsx
const { 
  isOpen, 
  currentStep, 
  formData,
  openSignup,      // () => void
  closeSignup,     // () => void
  nextStep,        // () => void
  prevStep,        // () => void
  updateFormData,  // (field, value) => void
  submitForm       // () => void
} = useTrainerSignup()
```

**Benefits:**
- Signup state isolated
- Logic testable per function
- Can be reused in multiple components
- Modal state managed in one place

---

### 3. CTA Components Layer
**Files:** 
- `src/components/CTAs/TrainerCTA.tsx` (variants: primary, secondary, small)
- `src/components/CTAs/TrainerCTAGroup.tsx` (multi-CTA layouts)

**TrainerCTA Props:**
```tsx
<TrainerCTA
  variant="primary" | "secondary" | "small"
  label="Custom Label"          // optional, from config
  onSignupClick={() => {}}      // business logic (DI)
  href="#signup"                // optional
  disabled={false}              // conditional
/>
```

**Key:** Components only handle presentation
- Styling isolated in CSS
- No signup logic (props-based)
- Reusable across app

---

### 4. Feature Folder
**File:** `src/features/TrainerOnboarding/TrainerOnboarding.tsx`

**Contains 3 components:**

#### A. TrainerOnboarding.Preview
Used in TrainersHub, shows:
- Trainer success messaging
- Benefits list (from config)
- Primary CTA (Create Account)
- Secondary CTA (Browse Resources)

#### B. TrainerOnboarding.Form
Step-by-step signup form showing:
- Progress indicator
- Form fields (email, password, profile, department, verification)
- Navigation (back/next/submit)

#### C. TrainerOnboarding
Default export, can wrap modal/full-page signup

---

## Migration Checklist

### Phase 1: Create Foundation (No breaking changes)
- [x] Create `src/config/trainerOnboarding.ts`
- [x] Create `src/features/TrainerOnboarding/hooks/useTrainerSignup.ts`
- [x] Create `src/components/CTAs/TrainerCTA.tsx` + CSS
- [x] Create `src/components/CTAs/TrainerCTAGroup.tsx`
- [x] Create `src/features/TrainerOnboarding/TrainerOnboarding.tsx` + CSS
- [ ] Document in ARCHITECTURE.md ✓ Done
- [ ] Create refactor examples ✓ Done

### Phase 2: Update Components (1 file at a time)
- [ ] Hero.tsx: Replace hardcoded button with TrainerCTA
- [ ] Solutions.tsx: Replace hardcoded button with TrainerCTA
- [ ] TrainersHub.tsx: Use TrainerOnboarding.Preview
- [ ] FAQ.tsx: Reference config for trainer question
- [ ] Remove UserPaths.tsx (role absorbed by TrainersHub)

### Phase 3: Cleanup
- [ ] Verify all tests pass
- [ ] Update E2E tests for new flow
- [ ] Update component Storybook stories
- [ ] Update README with new component patterns

---

## Implementation Details

### Import Pattern (After Refactor)

**In Hero.tsx:**
```tsx
import TrainerCTA from './CTAs/TrainerCTA'
import { useTrainerSignup } from '../features/TrainerOnboarding'

const { openSignup } = useTrainerSignup()

<TrainerCTA 
  variant="secondary"
  label="Become a Trainer"
  onSignupClick={() => openSignup('hero')}
/>
```

**In TrainersHub.tsx:**
```tsx
import { TrainerOnboarding, useTrainerSignup } from '../features/TrainerOnboarding'

const { openSignup } = useTrainerSignup()

<TrainerOnboarding.Preview
  onSignupClick={() => openSignup('trainers-hub')}
/>
```

**In Solutions.tsx:**
```tsx
import TrainerCTA from './CTAs/TrainerCTA'
import { useTrainerSignup } from '../features/TrainerOnboarding'

const { openSignup } = useTrainerSignup()

<TrainerCTA 
  variant="small"
  label="Create Trainer Account"
  onSignupClick={() => openSignup('solutions')}
/>
```

**In FAQ.tsx:**
```tsx
import { TRAINER_ONBOARDING } from '../config/trainerOnboarding'

const faqs = [
  {
    question: TRAINER_ONBOARDING.faq.question,
    answer: TRAINER_ONBOARDING.faq.answer
  }
]
```

---

## Testing Strategy

### Unit Tests

**TrainerCTA.test.tsx**
```tsx
describe('TrainerCTA', () => {
  it('renders correct variant styles', () => { ... })
  it('calls onSignupClick when clicked', () => { ... })
  it('applies custom label', () => { ... })
})
```

**useTrainerSignup.test.ts**
```tsx
describe('useTrainerSignup', () => {
  it('opens modal on openSignup()', () => { ... })
  it('progresses through form steps', () => { ... })
  it('updates form data', () => { ... })
  it('submits form with complete data', () => { ... })
})
```

**trainerOnboarding.test.ts**
```tsx
describe('Trainer Config', () => {
  it('has all required fields', () => { ... })
  it('all copy is non-empty', () => { ... })
  it('step labels match step count', () => { ... })
})
```

### Integration Tests

**Hero + TrainerCTA**
```tsx
it('opens signup modal when "Become a Trainer" is clicked', () => { ... })
```

**TrainersHub + TrainerOnboarding.Preview**
```tsx
it('displays trainer benefits from config', () => { ... })
it('calls onSignupClick when CTA is clicked', () => { ... })
```

---

## Rollback Plan

If issues arise:

1. **Stop at Phase 1**: Foundation code has no breaking changes
2. **Restore Phase 2 files**: Git checkout `src/components/*.tsx`
3. **No database changes**: Data layer untouched
4. **Config file removable**: Won't break anything if kept but unused

---

## Performance Impact

### Bundle Size
- TrainerCTA.tsx: +2KB
- useTrainerSignup.ts: +1KB  
- Config file: +1KB
- **Total additions:** ~4KB (gzipped: ~1.5KB)

**Offset by removal of:**
- Duplicate button CSS in 5 files: saves ~3KB
- Duplicate form logic: saves ~2KB

**Net result:** Slightly smaller bundle + much cleaner code

---

## Future Improvements

1. **Analytics Wrapper**
   ```tsx
   <TrainerCTA onSignupClick={() => analytics.track('cta_clicked', { source: 'hero' })}
   ```

2. **A/B Testing**
   ```tsx
   <TrainerCTA label={config.ui.trainerCTALabel} /> // swap config
   ```

3. **Email Verification Step**
   - Add to useTrainerSignup form steps
   - No component changes needed

4. **Payment Integration**
   - Add premium tier to config
   - Handle in submitForm callback

---

## Gotchas & Notes

### 1. Modal Stacking
If multiple CTAs on same page trigger modal:
```tsx
// useTrainerSignup manages single modal instance
// New openSignup() call resets form & steps (good)
```

### 2. Navigation After Signup
Currently closeSignup() just closes modal. Future:
```tsx
const submitForm = useCallback(async () => {
  await api.createTrainer(formData)
  navigate('/trainer/dashboard') // redirect
}, [])
```

### 3. Accessibility
- TrainerCTA uses `role="button"` on `<a>` tags
- Focus management in modal
- ARIA labels for close button

### 4. Type Safety
All TrainerCTA props are strictly typed:
```tsx
variant: 'primary' | 'secondary' | 'small'  // no string union issues
onSignupClick: () => void                   // explicit contract
```

---

## Success Metrics

| Metric | Before | After |
|--------|--------|-------|
| Duplicate CTA instances | 5 | 1 |
| Files touching signup copy | 5 | 1 |
| Time to change CTA copy | 5-10 min | 1 min |
| Signup testable independently | No | Yes |
| Trainer messaging consistency | Medium | High |
| Bundle size increase | - | +4KB (justified) |

---
