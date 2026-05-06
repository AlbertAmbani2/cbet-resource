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
