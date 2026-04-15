# Architectural Diagrams & Visuals

## Architecture Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Landing Page (App.tsx)                          │
└────────────┬─────────────────────────────────────────────┬──────────┘
             │                                             │
        ┌────▼────┐                                   ┌────▼────┐
        │   Hero  │                                   │ Solutions│
        └─┬──────┬─────────┬────────────────────┬──────┴────────┘
          │      │         │                    │
          │  "Browse       │              "Create Trainer
          │   Now"         │               Account"
          │                │
          │              ┌─▼──────────────────────────────┐
          │              │ BEFORE:                        │
          │              │ - 5 duplicate implementations  │
          │              │ - Hardcoded buttons            │
          │              │ - Inconsistent styling         │
          │              │ - Tight coupling               │
          │              └────────────────────────────────┘
          │
          │
          └─────┬──────────────────────────┬─────────────────┐
                │                          │                 │
                ▼                          ▼                 ▼
          ┌─────────────┐        ┌──────────────────┐    ┌──────────┐
          │ TrainersHub │        │ UserPaths/FAQ    │    │ Solutions│
          └──┬──────┬───┘        └──┬───────────────┘    └────┬─────┘
             │      │               │                        │
             │ "Create Trainer       │ Trainer copy          │
             │  Account" (primary)   │                       │


═══════════════════════════════════════════════════════════════════════
                                REFACTORED
═══════════════════════════════════════════════════════════════════════


                     Configuration Layer
                           ▲
                           │
                ┌──────────────────────────┐
                │ config/trainerOnboarding │
                │ .ts                      │
                │                          │
                │ • primaryCTA copy        │
                │ • form steps             │
                │ • FAQ question/answer    │
                │ • analytics events       │
                └──────────────────────────┘
                           ▲
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
    ┌────────────┐  ┌──────────────┐  ┌──────────┐
    │   Hero.tsx │  │TrainersHub   │  │Solutions │
    │            │  │.tsx          │  │.tsx      │
    │ Uses:      │  │              │  │          │
    │ TrainerCTA │  │ Uses:        │  │ Uses:    │
    └──┬────┬────┘  │ TrainerOn    │  │ Trainer  │
       │    │       │ boarding     │  │ CTA      │
       │    │       │ .Preview     │  │ (small)  │
       │    │       │              │  │          │
       │    └───────┼──────────────┘  └──────────┘
       │            │
       └─────┬──────┴──────────┬────────────┐
             │                 │            │
             ▼                 ▼            ▼
        ┌──────────────────────────────────────┐
        │ components/CTAs/TrainerCTA.tsx        │
        │                                      │
        │ Variants: primary | secondary | small│
        │ Props:    onSignupClick (DI)         │
        │                                      │
        │ ✓ Single implementation               │
        │ ✓ No business logic                   │
        │ ✓ Fully testable                     │
        └──────────┬───────────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ useTrainerSignup()   │
        │ hook                 │
        │                      │
        │ • Modal state        │
        │ • Form data          │
        │ • Step progression   │
        │ • Callbacks          │
        └──────────────────────┘
```

## Coupling Visualization

### BEFORE: Tight Coupling

```
┌──────────┐     ┌──────────────┐
│ Hero.tsx │────▶│ Signup Logic │
└──────────┘     │ Button Style │
                 │ Copy         │
┌──────────────┐  │ Behavior     │
│ TrainersHub  │──▶│ (duplicate)  │
│ .tsx         │   │              │
└──────────────┘   │              │
                   └──────────────┘
┌──────────────┐  
│ Solutions    │┐ All hardcoded  
│.tsx          │└─────────────────▶ No single source of truth
└──────────────┘

Problems:
❌ 5 tight couplings
❌ Duplicate copy everywhere
❌ Can't test signup independently
❌ Inconsistent styling
❌ Hard to maintain
```

### AFTER: Loose Coupling Via Abstraction

```
┌──────────────────────────────────────┐
│ config/trainerOnboarding.ts          │
│ (Single Source of Truth)             │
│                                      │
│ • Copy definitions                   │
│ • Form structure                     │
│ • Event names                        │
└────────┬───────────────┬─────────────┘
         │               │
    ┌────▼────┐      ┌───▼──────┐
    │ Hero    │      │ FAQ      │
    │ (uses   │      │ (refs    │
    │ config) │      │ config)  │
    └────┬────┘      └──────────┘
         │
    ┌────▼──────────────────────┐
    │ components/CTAs/          │
    │ TrainerCTA.tsx            │
    │ (Reusable, DI-based)      │
    │                           │
    │ Props:                    │
    │ - variant                 │
    │ - onSignupClick (DI) ◄────┴─── Parent provides behavior
    │ - label                   │     (loose coupling)
    │                           │
    └───────┬───────────────────┘
            │
            ▼
    ┌──────────────────────┐
    │ useTrainerSignup()   │
    │ (Isolated logic)     │
    │                      │
    │ • Testable           │
    │ • Reusable           │
    │ • No global state    │
    └──────────────────────┘

Benefits:
✅ 1 source of truth for copy
✅ 1 CTA component
✅ 1 signup hook
✅ Loose coupling everywhere
✅ Easy to test
✅ Easy to maintain
✅ Easy to extend
```

## Component Composition Pattern

```
┌─────────────────────────────────────────┐
│           Hero Component                │
├─────────────────────────────────────────┤
│                                         │
│  const { openSignup } = useTrainer...() │
│                                         │
│  return (                               │
│    <div>                                │
│      <h1>Find Resources</h1>            │
│      <a href="#" class="btn-primary">   │
│        Browse Now                       │
│      </a>                               │
│                                         │
│      ┌────────────────────────────┐    │
│      │ <TrainerCTA                │    │◄─── Reusable component
│      │   variant="secondary"      │    │     (no logic)
│      │   label="Become Trainer"   │    │
│      │   onSignupClick={          │    │
│      │     () => openSignup()     │    │◄─── Business logic (DI)
│      │   }                        │    │
│      │  />                        │    │
│      └────────────────────────────┘    │
│    </div>                               │
│  )                                      │
├─────────────────────────────────────────┤
│ Key Pattern:                            │
│ 1. Get signup function from hook        │
│ 2. Pass it to component via props       │
│ 3. Component never knows about signup  │
│ 4. Reusable, testable, composable      │
└─────────────────────────────────────────┘
```

## Data Flow Diagram

```
User clicks "Create Trainer Account"
        │
        ▼
┌─────────────────────────────────────┐
│ TrainerCTA onSignupClick ()          │
│ (callback from parent)               │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ useTrainerSignup.openSignup()        │
│ - setState({ isOpen: true })         │
│ - track analytics (source)           │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ Modal renders                        │
│ <TrainerOnboarding.Form />           │
│ - Shows step 0: Email & Password    │
└────────────┬────────────────────────┘
             │
User enters email & password
             │
             ▼
┌─────────────────────────────────────┐
│ useTrainerSignup.updateFormData()    │
│ - setState({ formData: { ... } })   │
└────────────┬────────────────────────┘
             │
             ▼
User clicks "Next"
             │
             ▼
┌─────────────────────────────────────┐
│ useTrainerSignup.nextStep()          │
│ - setState({ currentStep: 1 })      │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ Modal re-renders with step 1         │
│ (Profile section)                    │
└────────────┬────────────────────────┘
             │
     ... repeat steps 2-4 ...
             │
             ▼
User clicks "Create Account"
             │
             ▼
┌─────────────────────────────────────┐
│ useTrainerSignup.submitForm()        │
│ - API call (Phase 2)                 │
│ - closeSignup()                      │
│ - track 'signup_completed'           │
└─────────────────────────────────────┘
```

## State Management Visualization

### Before: No Centralized State

```
Each component manages its own state:

Hero.tsx
  state: { showModal, ... }
  
TrainersHub.tsx
  state: { showModal, ... }        ❌ Duplicated
  
Solutions.tsx
  state: { showModal, ... }        ❌ Duplicated

No single source of truth
```

### After: Centralized Hook

```
useTrainerSignup Hook (single instance per page)

    ┌────────────────────────────────┐
    │ Signup State                   │
    │                                │
    │ isOpen: boolean                │
    │ currentStep: number            │
    │ formData: {                    │
    │   email, password,             │
    │   fullName, department         │
    │ }                              │
    └────────────────────────────────┘
           ▲           ▲            ▲
           │           │            │
      ┌────┴───┐  ┌────┴───┐  ┌────┴────┐
      │ Hero   │  │Trainers │  │Solutions│
      │ reads  │  │Hub      │  │reads    │
      │& writes│  │reads    │  │& writes │
      └────────┘  └────────┘  └────────┘

Benefits:
✅ Single state object
✅ No duplication
✅ Consistent across page
✅ Easy to test
✅ Easy to debug
```

## Variant System Visualization

```
TrainerCTA Component with Variants

┌──────────────────────────────────────┐
│ <TrainerCTA variant="primary" />      │
│                                      │
│ ┌────────────────────────────────┐  │
│ │ [Create Trainer Account]       │  │ Large button
│ │ (14px, blue, full width)       │  │ Full description
│ └────────────────────────────────┘  │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ <TrainerCTA variant="secondary" />    │
│                                      │
│ ┌────────────────────────────────┐  │
│ │  [Become a Trainer]            │  │ Medium button
│ │  (white, border)               │  │ Secondary action
│ └────────────────────────────────┘  │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ <TrainerCTA variant="small" />        │
│                                      │
│ ┌──────────────────┐                │
│ │[Create Account]  │                │ Small button
│ │(13px, inline)    │                │ Footer/compact
│ └──────────────────┘                │
└──────────────────────────────────────┘

All share:
- Same component code
- Same styling approach
- Same callback interface
- Different visual presentation
```

## Testing Interaction Diagram

```
┌─────────────────────────────────────────┐
│ Unit Testing                            │
├─────────────────────────────────────────┤
│                                         │
│ TrainerCTA.test.tsx                     │
│ - Render with variant ✓                 │
│ - Call callback on click ✓              │
│ - Apply custom label ✓                  │
│                                         │
│ useTrainerSignup.test.ts                │
│ - Open modal ✓                          │
│ - Update form data ✓                    │
│ - Progress steps ✓                      │
│ - Submit form ✓                         │
│                                         │
│ trainerOnboarding.test.ts               │
│ - Config complete ✓                     │
│ - All copy non-empty ✓                  │
│ - Steps match labels ✓                  │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Integration Testing                     │
├─────────────────────────────────────────┤
│                                         │
│ Hero.test.tsx                           │
│ - Hero renders ✓                        │
│ - Click "Become Trainer" opens modal ✓  │
│ - Modal shows form ✓                    │
│                                         │
│ TrainersHub.test.tsx                    │
│ - Preview shows benefits ✓              │
│ - Click CTA opens modal ✓               │
│ - Can navigate through form ✓           │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ E2E Testing (Future)                    │
├─────────────────────────────────────────┤
│                                         │
│ signup.e2e.ts                           │
│ - User clicks CTA ✓                     │
│ - Modal opens ✓                         │
│ - Fill form (all steps) ✓               │
│ - Submit ✓                              │
│ - Verify account created ✓              │
│                                         │
└─────────────────────────────────────────┘
```

## Scalability Roadmap

```
Phase 1 (Complete) ✅
├─ Config creation
├─ Hook creation
├─ Component creation
└─ Infrastructure ready

Phase 2 (Next) ⏳
├─ Refactor Hero.tsx
├─ Refactor TrainersHub.tsx
├─ Refactor Solutions.tsx
├─ Update FAQ.tsx
└─ Remove UserPaths.tsx

Phase 3 (Future) 📅
├─ Add email verification
├─ Integrate real API
├─ Add analytics tracking
├─ Add accessibility fixes
└─ Create Storybook stories

Phase 4 (Advanced) 🚀
├─ Add trainer verification flow
├─ Payment processor integration
├─ Premium tier support
├─ Multi-language support (i18n)
└─ Feature flag support (A/B testing)
```

---

These diagrams show:
1. **Current problems** (scattered, coupled code)
2. **New architecture** (centralized, decoupled)
3. **How components interact** (dependency injection)
4. **Data flow** (user action → state update)
5. **Testing strategy** (unit + integration)
6. **Scalability path** (phased implementation)
