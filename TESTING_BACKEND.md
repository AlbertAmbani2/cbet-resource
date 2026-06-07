# Backend API Testing Guide

## ✅ Server Status

- **Status**: Running on `http://localhost:3000`
- **Environment**: development
- **Database**: Connected to Neon.tech PostgreSQL
- **Tables**: trainers table created with email index

---

## **Test Endpoints**

### 1. Health Check

```bash
curl http://localhost:3000/health
```

**Expected Response (200)**:

```json
{
  "status": "ok",
  "timestamp": "2026-05-04T...",
  "environment": "development"
}
```

---

### 2. Valid Trainer Signup

```bash
curl -X POST http://localhost:3000/api/trainers/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "trainer1@example.com",
    "password": "SecurePass123",
    "fullName": "John Trainer",
    "department": "ICT"
  }'
```

**Expected Response (201)**:

```json
{
  "id": "uuid-here",
  "email": "trainer1@example.com",
  "fullName": "John Trainer",
  "department": "ICT",
  "createdAt": "2026-05-04T...",
  "isVerified": false
}
```

---

### 3. Duplicate Email (Error Case)

```bash
curl -X POST http://localhost:3000/api/trainers/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "trainer1@example.com",
    "password": "SecurePass456",
    "fullName": "Another Trainer",
    "department": "Business"
  }'
```

**Expected Response (400)**:

```json
{
  "error": "Email already registered"
}
```

---

### 4. Weak Password (Error Case)

```bash
curl -X POST http://localhost:3000/api/trainers/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "trainer2@example.com",
    "password": "weak",
    "fullName": "Jane Trainer",
    "department": "Business"
  }'
```

**Expected Response (400)**:

```json
{
  "error": "Password must be at least 8 characters"
}
```

---

### 5. Invalid Department (Error Case)

```bash
curl -X POST http://localhost:3000/api/trainers/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "trainer3@example.com",
    "password": "SecurePass123",
    "fullName": "Bob Trainer",
    "department": "InvalidDept"
  }'
```

**Expected Response (400)**:

```json
{
  "error": "Department must be one of: ICT, Business, Automotive, Hospitality, Construction, Tourism, Health, Agriculture, Other"
}
```

---

### 6. Missing Required Field (Error Case)

```bash
curl -X POST http://localhost:3000/api/trainers/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "trainer4@example.com",
    "fullName": "Alice Trainer",
    "department": "Health"
  }'
```

**Expected Response (400)**:

```json
{
  "error": "Password is required"
}
```

---

## **Trainer Signin**

### 1. Valid Signin

First, create a trainer account:

```bash
curl -X POST http://localhost:3000/api/trainers/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "signin-test@example.com",
    "password": "SigninTest123",
    "fullName": "Signin Tester",
    "department": "ICT"
  }'
```

Then sign in with the same credentials:

```bash
curl -X POST http://localhost:3000/api/trainers/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "signin-test@example.com",
    "password": "SigninTest123"
  }'
```

**Expected Response (200)**:

```json
{
  "id": "uuid-here",
  "email": "signin-test@example.com",
  "fullName": "Signin Tester",
  "department": "ICT",
  "createdAt": "2026-05-22T...",
  "isVerified": false
}
```

---

### 2. Invalid Password

```bash
curl -X POST http://localhost:3000/api/trainers/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "signin-test@example.com",
    "password": "WrongPassword123"
  }'
```

**Expected Response (401)**:

```json
{
  "error": "Email or password is incorrect"
}
```

---

### 3. Email Not Found

```bash
curl -X POST http://localhost:3000/api/trainers/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@example.com",
    "password": "SomePassword123"
  }'
```

**Expected Response (401)**:

```json
{
  "error": "Email or password is incorrect"
}
```

---

### 4. Missing Email Field

```bash
curl -X POST http://localhost:3000/api/trainers/signin \
  -H "Content-Type: application/json" \
  -d '{
    "password": "SigninTest123"
  }'
```

**Expected Response (400)**:

```json
{
  "error": "Email is required"
}
```

---

### 5. Missing Password Field

```bash
curl -X POST http://localhost:3000/api/trainers/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "signin-test@example.com"
  }'
```

**Expected Response (400)**:

```json
{
  "error": "Password is required"
}
```

---

## **Valid Departments**

- ICT
- Business
- Automotive
- Hospitality
- Construction
- Tourism
- Health
- Agriculture
- Other

---

## **Password Requirements**

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

---

## **Server Logs**

Check the dev server terminal (running `yarn dev`) for:

- `[DB] Executed query` - SQL logs with duration
- `[Controller] Signup error` - Any processing errors
- `[Server]` - Startup and health check logs
---

## **Test Results Summary**

### ✅ Signin Feature Verification (May 22, 2026)

**Test Suite:** `server/test-signin.js`  
**Status:** ✅ ALL TESTS PASSED

**Scenarios Verified:**

1. ✅ **Signup Flow** — Account creation successful (201)
   - Email: signin-test-{timestamp}@example.com
   - Returns: trainerId, email, fullName, department, createdAt, isVerified

2. ✅ **Valid Signin** — Correct credentials (200)
   - Same email/password as signup
   - Returns authenticated trainer profile
   - No password in response

3. ✅ **Invalid Password** — Rejects wrong password (401)
   - Returns: `"Email or password is incorrect"`
   - Prevents credential exposure

4. ✅ **Email Not Found** — Rejects non-existent email (401)
   - Returns: `"Email or password is incorrect"`
   - Prevents account enumeration

### Shared Folder Addition (May 22, 2026)

**New Structure:**
```
shared/
├── types.ts       — 180+ lines of shared TypeScript interfaces
├── constants.ts   — 150+ lines of API endpoints & validation rules
├── index.ts       — Central export point
└── README.md      — Usage guide
```

**Exports:**
- API_ENDPOINTS object for all routes
- VALIDATION rules for input validation
- DEPARTMENTS and RESOURCE_TYPES enums
- Error/success message constants
- Trainer, Resource, Payment models
- All types used across frontend and backend

**Benefits:**
- Single source of truth for types and endpoints
- Type safety across API boundary
- Reduced duplication of validation logic
- Easy maintenance and updates
- Better IDE autocomplete support

---

## Server Logs