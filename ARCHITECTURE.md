# Clean Architecture Refactor: Trainer Onboarding

## Problem Statement
"Create Trainer Account" logic and messaging is scattered across multiple components (Hero, TrainersHub, Solutions, UserPaths, FAQ), creating tight coupling, poor maintainability, and duplicate code.

## Solution: Clear Separation of Concerns

### New Folder Structure

```
src/
├── config/
│   └── trainerOnboarding.ts          # Centralized trainer flow config
├── features/
│   └── TrainerOnboarding/
│       ├── hooks/
│       │   ├── useTrainerSignup.ts    # Signup state + logic
│       │   └── useTrainerFlow.ts      # Flow navigation logic
│       ├── types.ts                   # Trainer onboarding types
│       ├── constants.ts               # Copy/messages
│       └── TrainerOnboarding.tsx      # Main onboarding component
├── components/
│   ├── CTAs/
│   │   ├── TrainerCTA.tsx             # Reusable trainer CTA (variants)
│   │   ├── TrainerCTA.css
│   │   └── TrainerCTAGroup.tsx        # Multiple CTAs with layout
│   ├── Hero.tsx                       # Uses <TrainerCTA variant="secondary" />
│   ├── TrainersHub.tsx                # Uses <TrainerOnboarding.Preview />
│   ├── Solutions.tsx                  # Uses <TrainerCTA variant="small" />
│   ├── UserPaths.tsx                  # REMOVED (role handled by TrainersHub)
│   ├── FAQ.tsx                        # References trainer flow config
│   └── ...
└── hooks/ (shared)
    ├── useSignup.ts                   # Generic signup modal trigger
    └── useNavigation.ts               # Navigation state
```

## Key Architectural Principles

### 1. **Single Responsibility**
- `TrainerCTA.tsx` - only renders button/CTA UI
- `useTrainerSignup.ts` - only handles signup state
- `trainerOnboarding.ts` - only contains copy/config

### 2. **Dependency Injection**
```tsx
<TrainerCTA 
  variant="primary"
  onSignupClick={handleSignup}
  label="Create Trainer Account"
/>
```

### 3. **Feature Encapsulation**
- All trainer signup logic lives in `features/TrainerOnboarding/`
- Reusable UI components in `components/CTAs/`
- Global shared hooks in `hooks/`

### 4. **Centralized Configuration**
- Copy/messages in one place: `config/trainerOnboarding.ts`
- Change copy once, updates everywhere
- A/B testing ready (swap config, no code changes)

## Coupling Reduction

**Before:**
```
Hero.tsx ─┐
          ├─> Hardcoded "Become a Trainer"
TrainersHub.tsx ┤
          ├─> Hardcoded "Create Trainer Account"
Solutions.tsx ─┤
          └─> Hardcoded signup link
```

**After:**
```
Hero.tsx ──┐
           ├─> <TrainerCTA variant="secondary" />
TrainersHub.tsx ─┤      │
           ├──────────> TrainerCTA.tsx (single source)
Solutions.tsx ──┘       │
               └─> config/trainerOnboarding.ts
```

## Benefits

| Issue | Solution |
|-------|----------|
| Duplicate copy | Centralized `trainerOnboarding.ts` |
| Multiple CTA implementations | Single `TrainerCTA.tsx` with variants |
| Tight coupling | DI via props |
| Untestable signup logic | Extracted to `useTrainerSignup` hook |
| Inconsistent messaging | Single source of truth |
| Hard to change flow | Feature folder isolates changes |
| No reusability | `TrainerCTA` composable across app |

## Migration Path

1. Create `config/trainerOnboarding.ts` with all copy
2. Create `TrainerCTA.tsx` with variants (primary, secondary, small)
3. Extract `useTrainerSignup.ts` hook
4. Update Hero.tsx (smallest change)
5. Update TrainersHub.tsx
6. Update Solutions.tsx
7. Remove UserPaths.tsx (role absorbed by TrainersHub)
8. Update FAQ.tsx references
9. Refactor TrainersHub into `features/TrainerOnboarding.Preview`

## Testing Strategy

```
TrainerCTA.test.tsx
  ✓ Renders correct label
  ✓ Calls onSignupClick
  ✓ Applies variant styles

useTrainerSignup.test.ts
  ✓ Opens signup modal
  ✓ Tracks signup intent

trainerOnboarding.test.ts
  ✓ All copy defined
  ✓ No missing i18n keys
```

## Self-Critique

### ✅ What Works
- Clear separation of concerns
- Testable, isolated pieces
- DRY (Don't Repeat Yourself) achieved
- Easy to A/B test messaging
- Variant system scales to new CTA types

### ⚠️ Edge Cases to Handle
- Multiple CTAs on same page (modal stacking)
- Navigation after signup (callback contract)
- Analytics tracking (which CTA was clicked?)
- Mobile responsiveness per variant
- Accessibility (aria-labels, focus management)

### ⚠️ Things to Monitor
- Don't let `useTrainerSignup` become a god hook (keep it simple)
- Keep `TrainerCTA` focused on presentation only
- Config file shouldn't grow > 200 lines (split if needed)
- Variant explosion (limit to 3-4 variants max)

### 🔄 Future Improvements
- Add analytics wrapper hook
- Create TrainerFlow step indicator
- Add email verification step
- Payment processor integration (Phase 2)
