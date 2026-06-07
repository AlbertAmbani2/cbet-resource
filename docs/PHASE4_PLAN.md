# Phase 4 Implementation Plan (Real API Integration)

**Status**: Ready to begin | **Blockers**: 1 critical | **Estimated Time**: 4-6 hours

---

## 🔴 CRITICAL BLOCKER: AuthContext Not Integrated

### The Issue
- `AuthContext.tsx` exists with localStorage + trainerId persistence ✅
- `App.tsx` uses `TrainerSignupProvider` instead ❌
- Result: Signup works but trainerId is NOT saved

### The Fix (15 minutes)
```typescript
// src/App.tsx - Change from TrainerSignupProvider to AuthProvider
import { AuthProvider } from './features/TrainerOnboarding/AuthContext'

export default function App() {
  return (
    <Router>
      <AuthProvider>  {/* <- Replace TrainerSignupProvider */}
        {/* ... rest of app ... */}
      </AuthProvider>
    </Router>
  )
}
```

### Then Update Exports
```typescript
// src/features/TrainerOnboarding/index.ts
export * from './AuthContext'  // Add this
export { TrainerSignupModal } from './TrainerSignupModal'
```

---

## Phase 4 Implementation Roadmap

### Step 1: Activate AuthContext (15 min)
- [ ] Replace TrainerSignupProvider with AuthProvider in App.tsx
- [ ] Update feature exports to include AuthContext
- [ ] Test: Signup should now save trainerId to localStorage
- [ ] Test: Page refresh should preserve trainerId

### Step 2: Wire Protected Endpoints (30 min)
- [ ] Update TrainerSignupModal to show trainer profile after signup
- [ ] Create ProfileUpdateForm component (PUT /api/trainers/:id)
- [ ] Auto-include x-trainer-id header in fetch for protected endpoints
- [ ] Add x-trainer-id to all API calls in AuthContext.submitForm()

**Code Pattern**:
```typescript
const trainerId = localStorage.getItem('trainerId')
const headers: HeadersInit = {
  'Content-Type': 'application/json'
}
if (trainerId) {
  headers['x-trainer-id'] = trainerId
}
fetch(url, { headers })
```

### Step 3: Post-Signin Navigation (20 min)
- [ ] Create Dashboard page showing current user info
- [ ] Redirect to /dashboard after signin success
- [ ] Add logout button in Header (clears localStorage)
- [ ] Add login state indicator in Header

### Step 4: Use Shared Constants (15 min)
- [ ] Replace hardcoded URLs with constants from shared/constants.ts
- [ ] Update TrainerSignupContext.submitForm() to use API_ENDPOINTS
- [ ] Update SignInPage to use API_ENDPOINTS
- [ ] Update ProfileUpdateForm to use API_ENDPOINTS

**Example**:
```typescript
// Before
fetch('http://localhost:3000/api/trainers/signup', ...)

// After
import { API_ENDPOINTS } from '@/shared'
fetch(API_ENDPOINTS.TRAINERS.SIGNUP, ...)
```

### Step 5: Create Dashboard Page (45 min)
- [ ] src/pages/DashboardPage.tsx
- [ ] Display current user info from localStorage
- [ ] Show profile edit form (PUT /api/trainers/:id)
- [ ] Show resource upload section
- [ ] Add logout functionality

### Step 6: Enhanced Error Handling (20 min)
- [ ] Network error detection (TypeError)
- [ ] CORS error detection (status 0)
- [ ] 401 Unauthorized handling (redirect to signin)
- [ ] 403 Forbidden handling (ownership check failure)
- [ ] Generic error messages

### Step 7: Testing & Validation (45 min)
- [ ] Manual: Signup → saved to localStorage
- [ ] Manual: Signin → saved to localStorage
- [ ] Manual: Navigate to protected endpoint with x-trainer-id header
- [ ] Manual: Profile update works with ownership check
- [ ] Manual: Logout clears localStorage
- [ ] Unit tests for new components
- [ ] Integration tests with real backend

---

## Files to Create/Modify

### Create New
- [ ] `src/pages/DashboardPage.tsx` — User dashboard with profile editing
- [ ] `src/components/ProfileUpdateForm.tsx` — Form for profile updates

### Modify Existing
- [ ] `src/App.tsx` — Replace TrainerSignupProvider with AuthProvider
- [ ] `src/features/TrainerOnboarding/AuthContext.tsx` — Add x-trainer-id to API calls
- [ ] `src/features/TrainerOnboarding/index.ts` — Export AuthContext
- [ ] `src/components/Header.tsx` — Add logout button, show login state
- [ ] `src/pages/SignInPage.tsx` — Use shared constants

---

## Quick Reference: What Works Now

✅ Backend signup endpoint (POST /api/trainers/signup)
✅ Backend signin endpoint (POST /api/trainers/signin)  
✅ Backend profile endpoints (GET/PUT /api/trainers/:id)
✅ Database migrations and schema
✅ CORS configuration
✅ AuthContext with localStorage logic (just needs activation)
✅ All 22 frontend tests passing

---

## What Doesn't Work Yet

❌ trainerId not persisted after signup/signin
❌ x-trainer-id header not included in requests
❌ Protected endpoints cannot be called from frontend
❌ No dashboard/user profile page
❌ No logout functionality
❌ Signup modal doesn't show profile after success
❌ SignInPage doesn't redirect after login

---

## Success Criteria for Phase 4

- [ ] User can signup → trainerId saved to localStorage
- [ ] User can signin → trainerId saved to localStorage
- [ ] User can view their profile via dashboard
- [ ] User can update their profile (PUT with x-trainer-id)
- [ ] All protected endpoints work with x-trainer-id header
- [ ] User can logout (clear localStorage)
- [ ] Navigation redirects work (signin → dashboard)
- [ ] Error messages show specific issues (network, auth, validation)
- [ ] All existing tests still pass
- [ ] New tests added for auth flows

---

## Confidence Level

**Before Fix**: 🟠 60% (AuthContext exists but not used)
**After Step 1**: 🟡 75% (Auth state persisted)
**After Step 2**: 🟡 80% (Protected endpoints working)
**After All Steps**: 🟢 95% (Full integration complete)
