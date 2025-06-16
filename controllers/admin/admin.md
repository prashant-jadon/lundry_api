# CareEase Admin API Documentation

This documentation describes the recommended admin APIs for managing users, orders, pricing, and wash types in the CareEase system.

---

## **Authentication**

All admin endpoints should be protected.  
Admins must log in and receive a JWT token with an `isAdmin: true` property in the payload.

**Header for all requests:**
```
Authorization: Bearer <admin_jwt_token>
```

---

## **Endpoints**

---

### 1. **View All Users**

**GET** `/api/admin/users`

**Description:**  
Fetch a list of all registered users.

**Response:**
```json
[
  {
    "_id": "...",
    "email": "user@example.com",
    "createdAt": "...",
    // ...other user fields
  }
  // ...more users
]
```

---

### 2. **View All User Profiles**

**GET** `/api/admin/user-profiles`

**Description:**  
Fetch all user profiles.

**Response:**
```json
[
  {
    "_id": "...",
    "userId": "...",
    "firstname": "John",
    "lastname": "Doe",
    "email": "user@example.com",
    "phone": "9876543210",
    "address": "123 Main St",
    "pincode": "110001",
    "city": "New Delhi",
    "state": "Delhi"
  }
  // ...more profiles
]
```

---

### 3. **View All Orders**

**GET** `/api/admin/orders`

**Description:**  
Fetch all orders in the system.

**Response:**
```json
[
  {
    "_id": "...",
    "userId": "...",
    "washType": "premium",
    "items": { "shirt": 2, "pant": 1 },
    "total": 320,
    "orderDate": "16-06-2025",
    "pickupSlot": "6–8 AM",
    "address": "123 Main Street",
    "city": "New Delhi",
    "state": "Delhi",
    "pincode": "110001",
    "createdAt": "2025-06-16T12:34:56.789Z"
  }
  // ...more orders
]
```

---

### 4. **Filter Orders**

**GET** `/api/admin/orders?washType=premium&city=New Delhi&date=16-06-2025`

**Description:**  
Filter orders by wash type, city, date, or any combination.

**Query Parameters:**
- `washType` (optional): `"standard"`, `"premium"`, `"dry cleaning"`, `"delicate"`
- `city` (optional)
- `state` (optional)
- `date` (optional): `"DD-MM-YYYY"`
- `userId` (optional)

**Response:**  
Same as above, but filtered.

---

### 5. **Update Wash Types and Pricing**

**GET** `/api/admin/pricing`

**Description:**  
Get current pricing for all wash types.

**Response:**
```json
{
  "standard":   { "shirt": 30, "pant": 40, "tshirt": 25, "dress": 50, "cottonDress": 60 },
  "premium":    { "shirt": 50, "pant": 60, "tshirt": 40, "dress": 80, "cottonDress": 100 },
  "dry cleaning": { "shirt": 80, "pant": 90, "tshirt": 70, "dress": 120, "cottonDress": 140 },
  "delicate":   { "shirt": 100, "pant": 110, "tshirt": 90, "dress": 150, "cottonDress": 170 }
}
```

**PUT** `/api/admin/pricing`

**Request Body:**
```json
{
  "washType": "premium",
  "prices": {
    "shirt": 55,
    "pant": 65,
    "tshirt": 45,
    "dress": 90,
    "cottonDress": 110
  }
}
```

**Response:**
```json
{
  "message": "Pricing updated",
  "pricing": {
    "premium": {
      "shirt": 55,
      "pant": 65,
      "tshirt": 45,
      "dress": 90,
      "cottonDress": 110
    }
  }
}
```

---

### 6. **Add or Remove Wash Types**

**POST** `/api/admin/wash-types`

**Request Body:**
```json
{
  "washType": "super deluxe",
  "prices": {
    "shirt": 120,
    "pant": 130,
    "tshirt": 110,
    "dress": 180,
    "cottonDress": 200
  }
}
```

**Response:**
```json
{
  "message": "Wash type added",
  "washType": "super deluxe"
}
```

**DELETE** `/api/admin/wash-types/:washType`

**Response:**
```json
{
  "message": "Wash type removed"
}
```

---

### 7. **Admin Authentication**

**POST** `/api/admin/login`

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "adminpassword"
}
```

**Success Response:**
```json
{
  "token": "<admin_jwt_token>"
}
```

---

## **Security Notes**

- All admin endpoints must use `authenticateToken` and check for `isAdmin: true` in the JWT payload.
- Never expose sensitive user data (like passwords).
- Only admins should be able to update pricing, wash types, or view all users/orders.

---

## **Other Recommendations**

- Implement pagination for large user/order lists.
- Log all admin actions for audit purposes.
- Validate all input data.

---
```<!-- filepath: /Users/prashantjadon/Desktop/careease-user/controllers/admin/admin.md -->

# CareEase Admin API Documentation

This documentation describes the recommended admin APIs for managing users, orders, pricing, and wash types in the CareEase system.

---

## **Authentication**

All admin endpoints should be protected.  
Admins must log in and receive a JWT token with an `isAdmin: true` property in the payload.

**Header for all requests:**
```
Authorization: Bearer <admin_jwt_token>
```

## **Endpoints**

---

### 1. **View All Users**

**GET** `/api/admin/users`

**Description:**  
Fetch a list of all registered users.

**Response:**
```json
[
  {
    "_id": "...",
    "email": "user@example.com",
    "createdAt": "...",
    // ...other user fields
  }
  // ...more users
]
```

---

### 2. **View All User Profiles**

**GET** `/api/admin/user-profiles`

**Description:**  
Fetch all user profiles.

**Response:**
```json
[
  {
    "_id": "...",
    "userId": "...",
    "firstname": "John",
    "lastname": "Doe",
    "email": "user@example.com",
    "phone": "9876543210",
    "address": "123 Main St",
    "pincode": "110001",
    "city": "New Delhi",
    "state": "Delhi"
  }
  // ...more profiles
]
```

---

### 3. **View All Orders**

**GET** `/api/admin/orders`

**Description:**  
Fetch all orders in the system.

**Response:**
```json
[
  {
    "_id": "...",
    "userId": "...",
    "washType": "premium",
    "items": { "shirt": 2, "pant": 1 },
    "total": 320,
    "orderDate": "16-06-2025",
    "pickupSlot": "6–8 AM",
    "address": "123 Main Street",
    "city": "New Delhi",
    "state": "Delhi",
    "pincode": "110001",
    "createdAt": "2025-06-16T12:34:56.789Z"
  }
  // ...more orders
]
```

---

### 4. **Filter Orders**

**GET** `/api/admin/orders?washType=premium&city=New Delhi&date=16-06-2025`

**Description:**  
Filter orders by wash type, city, date, or any combination.

**Query Parameters:**
- `washType` (optional): `"standard"`, `"premium"`, `"dry cleaning"`, `"delicate"`
- `city` (optional)
- `state` (optional)
- `date` (optional): `"DD-MM-YYYY"`
- `userId` (optional)

**Response:**  
Same as above, but filtered.

---

### 5. **Update Wash Types and Pricing**

**GET** `/api/admin/pricing`

**Description:**  
Get current pricing for all wash types.

**Response:**
```json
{
  "standard":   { "shirt": 30, "pant": 40, "tshirt": 25, "dress": 50, "cottonDress": 60 },
  "premium":    { "shirt": 50, "pant": 60, "tshirt": 40, "dress": 80, "cottonDress": 100 },
  "dry cleaning": { "shirt": 80, "pant": 90, "tshirt": 70, "dress": 120, "cottonDress": 140 },
  "delicate":   { "shirt": 100, "pant": 110, "tshirt": 90, "dress": 150, "cottonDress": 170 }
}
```

**PUT** `/api/admin/pricing`

**Request Body:**
```json
{
  "washType": "premium",
  "prices": {
    "shirt": 55,
    "pant": 65,
    "tshirt": 45,
    "dress": 90,
    "cottonDress": 110
  }
}
```

**Response:**
```json
{
  "message": "Pricing updated",
  "pricing": {
    "premium": {
      "shirt": 55,
      "pant": 65,
      "tshirt": 45,
      "dress": 90,
      "cottonDress": 110
    }
  }
}
```

---

### 6. **Add or Remove Wash Types**

**POST** `/api/admin/wash-types`

**Request Body:**
```json
{
  "washType": "super deluxe",
  "prices": {
    "shirt": 120,
    "pant": 130,
    "tshirt": 110,
    "dress": 180,
    "cottonDress": 200
  }
}
```

**Response:**
```json
{
  "message": "Wash type added",
  "washType": "super deluxe"
}
```

**DELETE** `/api/admin/wash-types/:washType`

**Response:**
```json
{
  "message": "Wash type removed"
}
```

---

### 7. **Admin Authentication**

**POST** `/api/admin/login`

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "adminpassword"
}
```

**Success Response:**
```json
{
  "token": "<admin_jwt_token>"
}
```

---

## **Security Notes**

- All admin endpoints must use `authenticateToken` and check for `isAdmin: true` in the JWT payload.
- Never expose sensitive user data (like passwords).
- Only admins should be able to update pricing, wash types, or view all users/orders.

---

## **Other Recommendations**

- Implement pagination for large user/order lists.
- Log all admin actions for audit purposes.
- Validate all input data.

---