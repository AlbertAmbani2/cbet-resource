# Shared Module

This folder contains shared types, constants, and utilities used by both the frontend and backend.

## Structure

- **types.ts** — TypeScript interfaces for all domain models (Trainer, Resource, Payment, etc.)
- **constants.ts** — API endpoints, validation rules, and configuration constants
- **index.ts** — Central export point

## Usage

### Frontend (React)

```typescript
// Import types for form validation and API calls
import { TrainerResponse, VALIDATION, API_ENDPOINTS } from '../../shared';

const trainer: TrainerResponse = response.data;
if (email.length < VALIDATION.EMAIL.MIN_LENGTH) {
  setError('Email too short');
}

// Use endpoints
const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.TRAINER_PROFILE(trainerId)}`);
```

### Backend (Node.js)

```typescript
// Import types for request validation and response formatting
import { TrainerResponse, TrainerSignupRequest, API_ENDPOINTS } from '../../shared';

export async function signup(req: Request, res: Response): Promise<void> {
  const body = req.body as TrainerSignupRequest;
  // validation logic...
  res.json(trainer as TrainerResponse);
}
```

## Key Exports

### Types
- `TrainerResponse` — Trainer profile data
- `TrainerSignupRequest` — Signup form data
- `Resource` — Resource metadata
- `Subscription` — Subscription details
- `PaymentHistoryRecord` — Payment records
- `ApiError` — Error response format

### Constants
- `API_ENDPOINTS` — All REST endpoints
- `VALIDATION` — Input validation rules
- `DEPARTMENTS` — Trainer department options
- `RESOURCE_TYPES` — Resource type options
- `ERROR_MESSAGES` — Standard error messages
- `SUCCESS_MESSAGES` — Standard success messages

## Benefits

✅ **Single source of truth** for types and constants  
✅ **Type safety** across API calls (frontend → backend)  
✅ **Reduced duplication** of validation rules  
✅ **Easy maintenance** — update once, propagates everywhere  
✅ **Better DX** — IDE autocomplete for endpoints and constants
