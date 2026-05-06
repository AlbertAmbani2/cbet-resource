# Complete Postman API Testing Guide

## **Prerequisites**

- ✅ Server running: `http://localhost:3000`
- ✅ Database connected to Neon.tech
- ✅ All tables created

---

## **Test 1: Valid Trainer Signup (Should Return 201)**

### Postman Setup

- **Method**: `POST`
- **URL**: `http://localhost:3000/api/trainers/signup`
- **Headers**:

  ```
  Content-Type: application/json
  ```

- **Body (raw JSON)**:
  ```json
  {
    "email": "trainer1@example.com",
    "password": "SecurePass123",
    "fullName": "John Trainer",
    "department": "ICT"
  }
  ```

### Expected Response (201 Created)

```json
{
  "id": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
  "email": "trainer1@example.com",
  "fullName": "John Trainer",
  "department": "ICT",
  "createdAt": "2026-05-05T01:10:00.000Z",
  "isVerified": false
}
```

### Validation Checklist

- [ ] Status Code: **201**
- [ ] Response has UUID `id`
- [ ] Email is lowercase in response
- [ ] Department matches input
- [ ] `isVerified` is `false`
- [ ] `createdAt` timestamp present

---

## **Test 2: Duplicate Email (Should Return 400)**

### Postman Setup

- **Method**: `POST`
- **URL**: `http://localhost:3000/api/trainers/signup`
- **Headers**:

  ```
  Content-Type: application/json
  ```

- **Body (raw JSON)**:
  ```json
  {
    "email": "trainer1@example.com",
    "password": "AnotherPass456",
    "fullName": "Another Person",
    "department": "Business"
  }
  ```

### Expected Response (400 Bad Request)

```json
{
  "error": "Email already registered"
}
```

### Validation Checklist

- [ ] Status Code: **400**
- [ ] Error message: "Email already registered"
- [ ] No trainer created in database

---

## **Test 3: Weak Password (Should Return 400)**

### Postman Setup

- **Method**: `POST`
- **URL**: `http://localhost:3000/api/trainers/signup`
- **Headers**:

  ```
  Content-Type: application/json
  ```

- **Body (raw JSON)**:
  ```json
  {
    "email": "trainer2@example.com",
    "password": "weak",
    "fullName": "Jane Trainer",
    "department": "Business"
  }
  ```

### Expected Response (400 Bad Request)

```json
{
  "error": "Password must be at least 8 characters"
}
```

### Why It Fails

- Password "weak" is only 4 characters (minimum 8 required)

### Valid Password Examples

- ✅ `SecurePass123` - 13 chars, has uppercase, lowercase, numbers
- ✅ `MyPass2024` - 10 chars, has uppercase, lowercase, numbers
- ❌ `password123` - no uppercase
- ❌ `PASSWORD123` - no lowercase
- ❌ `Password` - no numbers

### Validation Checklist

- [ ] Status Code: **400**
- [ ] Error message contains "Password must be at least 8 characters"
- [ ] Email **trainer2@example.com** was NOT created

---

## **Test 4: Invalid Department (Should Return 400)**

### Postman Setup

- **Method**: `POST`
- **URL**: `http://localhost:3000/api/trainers/signup`
- **Headers**:

  ```
  Content-Type: application/json
  ```

- **Body (raw JSON)**:
  ```json
  {
    "email": "trainer3@example.com",
    "password": "SecurePass123",
    "fullName": "Bob Trainer",
    "department": "InvalidDept"
  }
  ```

### Expected Response (400 Bad Request)

```json
{
  "error": "Department must be one of: ICT, Business, Automotive, Hospitality, Construction, Tourism, Health, Agriculture, Other"
}
```

### Valid Departments (Case-Sensitive)

- ✅ `ICT`
- ✅ `Business`
- ✅ `Automotive`
- ✅ `Hospitality`
- ✅ `Construction`
- ✅ `Tourism`
- ✅ `Health`
- ✅ `Agriculture`
- ✅ `Other`

### Validation Checklist

- [ ] Status Code: **400**
- [ ] Error lists all valid departments
- [ ] Email **trainer3@example.com** was NOT created
- [ ] Department value is case-sensitive (`ict` will fail, must be `ICT`)

---

## **Test 5: Missing Password Field (Should Return 400)**

### Postman Setup

- **Method**: `POST`
- **URL**: `http://localhost:3000/api/trainers/signup`
- **Headers**:

  ```
  Content-Type: application/json
  ```

- **Body (raw JSON)**:
  ```json
  {
    "email": "trainer4@example.com",
    "fullName": "Alice Trainer",
    "department": "Health"
  }
  ```

### Expected Response (400 Bad Request)

```json
{
  "error": "Password is required"
}
```

### Validation Checklist

- [ ] Status Code: **400**
- [ ] Error message: "Password is required"
- [ ] Email **trainer4@example.com** was NOT created
- [ ] Trainer count in database should still be 1 (only from Test 1)

---

## **Test 6: Invalid Email Format (Should Return 400)**

### Postman Setup

- **Method**: `POST`
- **URL**: `http://localhost:3000/api/trainers/signup`
- **Headers**:

  ```
  Content-Type: application/json
  ```

- **Body (raw JSON)**:
  ```json
  {
    "email": "invalid-email",
    "password": "SecurePass123",
    "fullName": "Charlie Trainer",
    "department": "Automotive"
  }
  ```

### Expected Response (400 Bad Request)

```json
{
  "error": "Email format is invalid"
}
```

### Valid Email Examples

- ✅ `trainer1@example.com`
- ✅ `john.doe@company.org`
- ✅ `user+tag@domain.co.uk`
- ❌ `invalid-email` - no @ symbol
- ❌ `user@` - no domain
- ❌ `@example.com` - no username

### Validation Checklist

- [ ] Status Code: **400**
- [ ] Error message: "Email format is invalid"
- [ ] Email **invalid-email** was NOT created

---

## **Test 7: Successful Signup #2 (Case-Insensitive Email)**

### Postman Setup

- **Method**: `POST`
- **URL**: `http://localhost:3000/api/trainers/signup`
- **Headers**:

  ```
  Content-Type: application/json
  ```

- **Body (raw JSON)**:
  ```json
  {
    "email": "TRAINER5@EXAMPLE.COM",
    "password": "MyPassword2024",
    "fullName": "Diana Trainer",
    "department": "Tourism"
  }
  ```

### Expected Response (201 Created)

```json
{
  "id": "xyz-uuid-here",
  "email": "trainer5@example.com",
  "fullName": "Diana Trainer",
  "department": "Tourism",
  "createdAt": "2026-05-05T01:15:00.000Z",
  "isVerified": false
}
```

### Key Point

- Input email: `TRAINER5@EXAMPLE.COM`
- Stored email: `trainer5@example.com` (converted to lowercase)
- Password is hashed (never sent back)

### Validation Checklist

- [ ] Status Code: **201**
- [ ] Email in response is lowercase
- [ ] Response has different UUID than Test 1
- [ ] Password is NOT in response (never send passwords back)

---

## **Expected Database State After All Tests**

```
✅ Database should contain 2 trainers:
1. trainer1@example.com (from Test 1)
2. trainer5@example.com (from Test 7)

❌ Rejected (never created):
- trainer1@example.com (duplicate in Test 2)
- trainer2@example.com (weak password in Test 3)
- trainer3@example.com (invalid department in Test 4)
- trainer4@example.com (missing password in Test 5)
- invalid-email (bad format in Test 6)
```

---

## **How to Run in Postman**

### Option 1: Manual Testing

1. Open Postman
2. Create new request for each test
3. Copy URL, method, headers, and body
4. Click "Send"
5. Verify status code and response

### Option 2: Import Collection (Optional)

Save JSON collection file with all 7 tests and import into Postman

### Option 3: Use cURL in Terminal

```bash
# Test 1: Valid Signup
curl -X POST http://localhost:3000/api/trainers/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"trainer1@example.com","password":"SecurePass123","fullName":"John Trainer","department":"ICT"}'

# Test 2: Duplicate Email
curl -X POST http://localhost:3000/api/trainers/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"trainer1@example.com","password":"AnotherPass456","fullName":"Another Person","department":"Business"}'
```

---

## **Common Issues & Fixes**

### Issue: Connection Refused (Connection Error)

**Problem**: Cannot connect to `http://localhost:3000`
**Solution**:

1. Check server is running: `yarn dev` in server folder
2. Check port 3000 is not blocked by firewall
3. Verify no other app using port 3000

### Issue: 404 Not Found

**Problem**: Status 404 on `/api/trainers/signup`
**Solution**:

1. Check URL is exactly: `http://localhost:3000/api/trainers/signup`
2. Verify method is `POST` (not GET)
3. Check spelling of endpoint

### Issue: Missing Content-Type Header

**Problem**: Postman error about headers
**Solution**:

1. Add header: `Content-Type: application/json`
2. Use "raw" body type in Postman
3. Make sure JSON is valid (use Postman validator)

### Issue: 500 Internal Server Error

**Problem**: Status 500 on valid request
**Solution**:

1. Check server logs in dev terminal (look for `[DB] Query failed`)
2. Verify `.env` file has `DATABASE_URL`
3. Verify Neon.tech credentials are correct
4. Check network connection to Neon.tech

### Issue: "Email already registered" When First Signup

**Problem**: Getting 400 error on first test
**Solution**:

1. Verify database is empty or use different email
2. Check if previous test runs left data
3. Consider clearing database (delete all records) if needed

---

## **Password Requirements Validation**

Server validates all these conditions:

- ✅ Minimum 8 characters long
- ✅ At least one UPPERCASE letter
- ✅ At least one lowercase letter
- ✅ At least one number (0-9)

Test Examples:

- ✅ `SecurePass123` - passes all checks
- ❌ `securepass123` - no uppercase
- ❌ `SECUREPASS123` - no lowercase
- ❌ `SecurePass` - no number
- ❌ `Secure123` - too short (8 chars exactly would pass if has all types)

---

## **Final Verification**

After completing all 7 tests:

1. **Server Logs**: Check `yarn dev` terminal for:

   ```
   [DB] Executed query {...rows: 1...} // for successful inserts
   [Controller] Signup error // for validation failures
   ```

2. **Database Check** (via Neon.tech console):
   - Table `trainers` exists
   - Contains 2 records (trainer1@example.com, trainer5@example.com)
   - Email has index for fast lookups
   - Password is hashed (not plain text)

3. **API Response Times**: All should be < 1 second

---

**You're Ready for Postman Testing!** 🚀
