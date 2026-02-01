# Frontend API Integration Guide

## 📋 API Overview

The OrderApp frontend communicates with a backend API for authentication and order management. This document describes what the backend API should implement.

## 🔌 Base URL

```
{NEXT_PUBLIC_API_URL}

Example: http://localhost:3001/api
```

All endpoints are relative to this base URL.

---

## 🔐 Authentication Endpoints

### POST `/auth/register`

Register a new user account.

**Request:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response (Success 201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "user123",
    "email": "john@example.com",
    "fullName": "John Doe"
  }
}
```

**Response (Error 400):**
```json
{
  "success": false,
  "message": "Email already registered",
  "errors": {
    "email": ["Email is already in use"]
  }
}
```

---

### POST `/auth/login`

Authenticate user and get tokens.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "rememberMe": true
}
```

**Response (Success 200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_string...",
  "expiresIn": 3600,
  "user": {
    "id": "user123",
    "email": "john@example.com",
    "fullName": "John Doe",
    "avatar": "https://..."
  }
}
```

**Response (Error 401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Notes:**
- Access token expires in 3600 seconds (1 hour)
- Use `Authorization: Bearer {accessToken}` header for subsequent requests
- Store both tokens securely

---

### GET `/auth/me`

Get current authenticated user.

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response (Success 200):**
```json
{
  "user": {
    "id": "user123",
    "email": "john@example.com",
    "fullName": "John Doe",
    "avatar": "https://..."
  }
}
```

**Response (Error 401):**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

### POST `/auth/refresh`

Refresh access token using refresh token.

**Request:**
```json
{
  "refreshToken": "refresh_token_string..."
}
```

**Response (Success 200):**
```json
{
  "accessToken": "new_access_token...",
  "refreshToken": "new_refresh_token...",
  "expiresIn": 3600
}
```

**Response (Error 401):**
```json
{
  "success": false,
  "message": "Invalid refresh token"
}
```

---

### POST `/auth/logout`

Logout current user.

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response (Success 200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 📦 Order Endpoints

### GET `/orders`

Get paginated list of orders with filters and sorting.

**Query Parameters:**
```
?category=Electronics
&minPrice=10
&maxPrice=500
&sortBy=price-asc
&page=1
&pageSize=12
&search=laptop
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response (Success 200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "order123",
      "productName": "Laptop Pro",
      "category": "Electronics",
      "price": 999.99,
      "image": "https://...",
      "description": "High-performance laptop",
      "createdAt": "2026-01-15T10:30:00Z",
      "status": "completed"
    },
    {
      "id": "order124",
      "productName": "Wireless Mouse",
      "category": "Electronics",
      "price": 29.99,
      "image": "https://...",
      "description": "Ergonomic wireless mouse",
      "createdAt": "2026-01-16T14:20:00Z",
      "status": "pending"
    }
  ],
  "total": 156,
  "page": 1,
  "pageSize": 12,
  "hasNextPage": true
}
```

**Filter/Sort Options:**

| Parameter | Values | Notes |
|-----------|--------|-------|
| `category` | string | Optional, exact match |
| `minPrice` | number | Optional, inclusive |
| `maxPrice` | number | Optional, inclusive |
| `sortBy` | `newest`, `price-asc`, `price-desc`, `name-asc`, `name-desc` | Optional, default: `newest` |
| `page` | number | Optional, default: 1 |
| `pageSize` | number | Optional, default: 12 |
| `search` | string | Optional, searches productName |

---

### POST `/orders`

Create a new order.

**Headers:**
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Request:**
```json
{
  "productId": "product123",
  "quantity": 2,
  "notes": "Please deliver by Friday"
}
```

**Response (Success 201):**
```json
{
  "success": true,
  "data": {
    "id": "order_new_123",
    "productId": "product123",
    "quantity": 2,
    "notes": "Please deliver by Friday",
    "status": "pending",
    "createdAt": "2026-02-01T10:30:00Z",
    "customerId": "user123"
  },
  "message": "Order created successfully"
}
```

**Response (Error 400):**
```json
{
  "success": false,
  "message": "Invalid product or quantity",
  "errors": {
    "productId": ["Product not found"],
    "quantity": ["Quantity must be between 1 and 100"]
  }
}
```

---

### GET `/orders/:id`

Get a specific order by ID.

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response (Success 200):**
```json
{
  "success": true,
  "data": {
    "id": "order123",
    "productId": "product123",
    "customerId": "user123",
    "productName": "Laptop Pro",
    "category": "Electronics",
    "price": 999.99,
    "quantity": 1,
    "totalPrice": 999.99,
    "image": "https://...",
    "description": "High-performance laptop",
    "notes": "Please deliver by Friday",
    "status": "pending",
    "createdAt": "2026-01-15T10:30:00Z",
    "updatedAt": "2026-01-15T10:30:00Z"
  }
}
```

**Response (Error 404):**
```json
{
  "success": false,
  "message": "Order not found"
}
```

---

## 🔄 Error Handling

All error responses include:
- `success: false`
- `message`: Human-readable error message
- `errors` (optional): Field-specific errors
- Appropriate HTTP status code

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid token)
- `403` - Forbidden (permission denied)
- `404` - Not Found
- `500` - Server Error

---

## 🔐 Authentication Flow

### Login Sequence
```
1. POST /auth/login
   ├─ Validate credentials
   ├─ Generate accessToken (1 hour)
   ├─ Generate refreshToken
   └─ Return tokens + user

2. Client stores tokens in localStorage

3. Subsequent requests include:
   Authorization: Bearer {accessToken}
```

### Token Refresh Sequence
```
1. Request fails with 401
2. Client sends POST /auth/refresh
   ├─ Validate refreshToken
   ├─ Generate new accessToken
   ├─ Optionally rotate refreshToken
   └─ Return new tokens

3. Client retries original request with new token
```

### Logout Sequence
```
1. POST /auth/logout
2. Client clears tokens from storage
3. Redirect to login page
```

---

## 📊 Data Models

### User
```json
{
  "id": "string",
  "email": "string",
  "fullName": "string",
  "avatar": "string (optional)",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

### Order
```json
{
  "id": "string",
  "productName": "string",
  "category": "string",
  "price": "number",
  "quantity": "number (optional, for purchase orders)",
  "image": "string (optional)",
  "description": "string (optional)",
  "createdAt": "ISO date string",
  "status": "pending | completed | cancelled",
  "customerId": "string (optional)"
}
```

### Token
```json
{
  "accessToken": "JWT string",
  "refreshToken": "string",
  "expiresIn": "number (seconds)"
}
```

---

## 📝 Request/Response Headers

### Required Request Headers
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response Headers
```
Content-Type: application/json
```

---

## 🧪 Testing with cURL

### Test Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Get Orders
```bash
curl http://localhost:3001/api/orders?page=1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Test Create Order
```bash
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "productId": "product123",
    "quantity": 1,
    "notes": "Test order"
  }'
```

---

## 🎯 Frontend Expectations

The frontend expects:

### Pagination
- Must return `total`, `page`, `pageSize`, `hasNextPage`
- Page numbering starts at 1
- Returns empty array when page exceeds total

### Filtering
- Category: Exact string match
- Price: Inclusive range (min ≤ price ≤ max)
- Search: Case-insensitive substring match

### Sorting
- `newest`: Newest first (descending date)
- `price-asc`: Low to high
- `price-desc`: High to low
- `name-asc`: Alphabetical
- `name-desc`: Reverse alphabetical

### Error Responses
- Always include `success: false`
- Always include `message`
- Use appropriate HTTP status codes

---

## ⚙️ Implementation Notes

### CORS
- Frontend runs on `localhost:3000`
- API must allow CORS from frontend URL
- Include `Authorization` in allowed headers

### Rate Limiting
- Recommend rate limiting per user/IP
- Frontend doesn't handle 429 responses specially

### Validation
- Backend must validate all inputs
- Frontend also validates but don't trust it
- Return specific field errors when possible

### Security
- Use HTTPS in production
- Validate and sanitize all inputs
- Use secure token signing (HS256 or RS256)
- Implement CORS properly
- Use HTTPOnly cookies for tokens (optional)

---

## 📞 Support

For API issues:
1. Check this documentation
2. Verify request format
3. Check response headers
4. Review backend logs
5. Test with cURL

---

Last Updated: February 1, 2026
