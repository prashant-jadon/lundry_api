
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

## **Endpoints & Examples**

---

### 1. **View All Users**

**GET** `/api/admin/users`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Response:**
```json
[
  {
    "_id": "665f4e7e2f8b2c0012a4e123",
    "email": "user@example.com",
    "createdAt": "2025-06-16T12:34:56.789Z"
    // ...other user fields
  }
  // ...more users
]
```

---

### 2. **View All User Profiles**

**GET** `/api/admin/user-profiles`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Response:**
```json
[
  {
    "_id": "665f4e7e2f8b2c0012a4e124",
    "userId": "665f4e7e2f8b2c0012a4e123",
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

### 3. **View All Orders (with optional filters)**

**GET** `/api/admin/orders?washType=premium&city=New Delhi`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Response:**
```json
[
  {
    "_id": "6660f1e2b7e8e2a1c8a12345",
    "userId": "665f4e7e2f8b2c0012a4e123",
    "washType": "premium",
    "items": {
      "shirt": 2,
      "pant": 1
    },
    "total": 160,
    "orderDate": "16-06-2025",
    "pickupSlot": "6–8 AM",
    "address": "123 Main St",
    "city": "New Delhi",
    "state": "Delhi",
    "pincode": "110001",
    "createdAt": "2025-06-16T12:34:56.789Z"
  }
  // ...more orders
]
```

---

### 4. **Get Pricing**

**GET** `/api/admin/pricing`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Response:**
```json
{
  "standard":   { "shirt": 30, "pant": 40, "tshirt": 25, "dress": 50, "cottonDress": 60 },
  "premium":    { "shirt": 50, "pant": 60, "tshirt": 40, "dress": 80, "cottonDress": 100 },
  "dry cleaning": { "shirt": 80, "pant": 90, "tshirt": 70, "dress": 120, "cottonDress": 140 },
  "delicate":   { "shirt": 100, "pant": 110, "tshirt": 90, "dress": 150, "cottonDress": 170 }
}
```

---

### 5. **Update Pricing**

**PUT** `/api/admin/pricing`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

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

### 6. **Add Wash Type**

**POST** `/api/admin/wash-types`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

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

---

### 7. **Remove Wash Type**

**DELETE** `/api/admin/wash-types/super deluxe`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Response:**
```json
{
  "message": "Wash type removed"
}
```
or if not found:
```json
{
  "message": "Wash type not found"
}
```

---

### 8. **Admin Authentication**

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

---

## **Other Recommendations**

- Implement pagination for large user/order lists.
- Log all admin actions for audit purposes.
- Validate all input data.

---