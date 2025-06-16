# CareEase User API

This API provides user authentication, profile management, pincode validation, and laundry order management.

---

## **Base URL**

```
http://localhost:4000/api
```

---

## **Authentication**

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

---

## **Endpoints**

---

### 1. **Check Pincode**

**POST** `/api/check-pincode`

**Request Body:**
```json
{
  "pincode": "110001"
}
```

**Success Response (200):**
```json
{
  "message": "Service available"
}
```

**Error Response (400):**
```json
{
  "message": "Service not available"
}
```

---

### 2. **Signup**

**POST** `/api/signup`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "pass123"
}
```

**Success Response (200):**
```json
{
  "token": "<jwt_token>"
}
```

**Error Response (400):**
```json
{
  "message": "User already exists"
}
```

---

### 3. **Login**

**POST** `/api/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "pass123"
}
```

**Success Response (200):**
```json
{
  "token": "<jwt_token>"
}
```

**Error Response (400):**
```json
{
  "message": "Invalid credentials"
}
```

---

### 4. **Create/Update Profile**

**POST** `/api/profile`

**Headers:**  
`Authorization: Bearer <jwt_token>`

**Request Body:**
```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "user@example.com",
  "phone": "9876543210",
  "address": "123 Main St",
  "pincode": "110001",
  "city": "New Delhi",
  "state": "Delhi"
}
```

**Success Response (200):**
```json
{
  "message": "Profile saved",
  "profile": {
    "_id": "...",
    "userId": "...",
    "firstname": "John",
    "lastname": "Doe",
    "email": "user@example.com",
    "phone": "9876543210",
    "address": "123 Main St",
    "pincode": "110001",
    "city": "New Delhi",
    "state": "Delhi",
    "__v": 0
  }
}
```

**Error Response (400):**
```json
{
  "message": "All fields are required"
}
```

---

### 5. **Get Profile**

**GET** `/api/profile`

**Headers:**  
`Authorization: Bearer <jwt_token>`

**Success Response (200):**
```json
{
  "profile": {
    "_id": "...",
    "userId": "...",
    "firstname": "John",
    "lastname": "Doe",
    "email": "user@example.com",
    "phone": "9876543210",
    "address": "123 Main St",
    "pincode": "110001",
    "city": "New Delhi",
    "state": "Delhi",
    "__v": 0
  }
}
```

**Error Response (404):**
```json
{
  "message": "Profile not found"
}
```
---

### 6. **Get All Orders**

**GET** `/api/orders`

**Headers:**  
`Authorization: Bearer <jwt_token>`

**Success Response (200):**
```json
{
  "orders": [
    {
      "_id": "...",
      "userId": "...",
      "washType": "premium",
      "items": {
        "shirt": 2,
        "pant": 1,
        "tshirt": 3,
        "dress": 0,
        "cottonDress": 1
      },
      "total": 320,
      "orderDate": "16-06-2025",
      "pickupSlot": "6–8 AM",
      "createdAt": "2025-06-16T12:34:56.789Z",
      "__v": 0
    }
    // ...more orders
  ],
  "total": 320
}
```

---

### 7. **Place Order (with Address Details)**

**POST** `/api/order`

**Headers:**  
`Authorization: Bearer <jwt_token>`

**Request Body:**
```json
{
  "washType": "premium",
  "items": {
    "shirt": 2,
    "pant": 1,
    "tshirt": 3,
    "dress": 0,
    "cottonDress": 1
  },
  "pickupSlot": "6–8 AM",
  "address": "123 Main Street",
  "city": "New Delhi",
  "state": "Delhi",
  "pincode": "110001"
}
```

**Success Response (200):**
```json
{
  "message": "Order placed",
  "order": {
    "_id": "...",
    "userId": "...",
    "washType": "premium",
    "items": {
      "shirt": 2,
      "pant": 1,
      "tshirt": 3,
      "dress": 0,
      "cottonDress": 1
    },
    "total": 320,
    "orderDate": "16-06-2025",
    "pickupSlot": "6–8 AM",
    "address": "123 Main Street",
    "city": "New Delhi",
    "state": "Delhi",
    "pincode": "110001",
    "createdAt": "2025-06-16T12:34:56.789Z",
    "__v": 0
  },
  "total": 320
}
```

**Error Response (400):**
```json
{
  "message": "Address, city, state, and pincode are required"
}
```
or
```json
{
  "message": "Invalid wash type"
}
```
or
```json
{
  "message": "Items are required"
}
```
or
```json
{
  "message": "Invalid pickup slot"
}
```
or
```json
{
  "message": "User profile not found"
}
```

---

## **Notes**

- Always use the JWT token from `/api/signup` or `/api/login` for protected endpoints.
- The `total` in order is calculated based on the selected wash type and item quantities.
- The `orderDate` is in `DD-MM-YYYY` format and `pickupSlot` can be `"6–8 AM"`, `"5–7 PM"`, or `"emergency"`.
- All endpoints return JSON.

---