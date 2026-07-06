# API Reference

Base URL: `http://localhost:3000` (configurable via `VITE_API_URL`)

---

## Health

### `GET /health`

Returns server & database status.

```json
{ "status": "ok", "timestamp": "...", "environment": "development" }
```

---

## Trainer Signup

### `POST /api/trainers/signup`

**Headers:** `Content-Type: application/json`

**Body:**

```json
{
  "email": "trainer@example.com",
  "password": "SecurePass123!",
  "fullName": "John Trainer",
  "department": "ICT"
}
```

**Valid departments:** ICT, Business, Automotive, Hospitality, Construction, Tourism, Health, Agriculture, Other

**Password rules:** 8+ chars, uppercase, lowercase, number

**201 Success:**

```json
{
  "id": "uuid",
  "email": "trainer@example.com",
  "fullName": "John Trainer",
  "department": "ICT",
  "createdAt": "2026-...",
  "isVerified": false
}
```

**400 Errors:** `Email already registered`, `Password must be at least 8 characters`, `Department must be one of: ...`, `Email format is invalid`, `Password is required`, `Full name is required`

---

## Trainer Signin

### `POST /api/trainers/signin`

**Body:**

```json
{ "email": "trainer@example.com", "password": "SecurePass123!" }
```

**200 Success:** Same shape as signup response.

**401 Errors:** `Email or password is incorrect`

---

## Trainer Profile

### `GET /api/trainers/me/profile`

**Headers:** `x-trainer-id: <uuid>`

Returns the authenticated trainer's full profile.

### `GET /api/trainers/:id`

Public profile for any trainer.

### `PUT /api/trainers/:id`

**Headers:** `x-trainer-id: <uuid>`

**Body:**

```json
{
  "fullName": "Updated Name",
  "department": "ICT",
  "bio": "...",
  "institution": "...",
  "contactEmail": "..."
}
```

---

## Resources

### `GET /api/resources`

**Query params:** `page`, `limit`, `department`, `resourceType`, `search`

Paginated list of resources.

### `GET /api/resources/:resourceId/rating`

Aggregate rating data (average, count, distribution).

### `GET/POST/PUT/DELETE /api/resources/:resourceId/reviews`

Review CRUD. Requires `x-trainer-id` header for write operations.

### `GET /api/resources/:resourceId/reviews/:reviewId`
### `PUT /api/resources/:resourceId/reviews/:reviewId`
### `DELETE /api/resources/:resourceId/reviews/:reviewId`

---

## Analytics

### `POST /api/analytics/download`

**Body:** `{ "resourceId": "uuid" }`

Tracks a download. 60-second cache prevents duplicate increments.

---

## Leaderboard

### `GET /api/trainers/leaderboard`

**Query params:** `limit`

Top trainers by download count.

---

## Error Format

All errors follow:

```json
{ "error": "Human-readable message" }
```

HTTP status codes: 400 (validation), 401 (auth), 404 (not found), 500 (server)
