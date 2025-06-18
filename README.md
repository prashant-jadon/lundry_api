# CareEase User API

This API provides user authentication, profile management, pincode validation, laundry order management, and admin management.

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

## **User Endpoints**

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
- If profile is completed:
```json
{
  "token": "<jwt_token>",
  "profileCompleted": true,
  "user": {
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
- If profile is not completed:
```json
{
  "token": "<jwt_token>",
  "profileCompleted": false
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
or
```json
{
  "message": "We don't deliver in this pincode"
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

### 9. **Update Order Status**

**PUT** `/api/admin/orders/:orderId/status`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "Delivered"
}
```

**Response:**
```json
{
  "message": "Order status updated",
  "order": {
    "_id": "...",
    "status": "Delivered",
    // ...other order fields
  }
}
```

---

# CareEase Delivery Boy API

This API allows delivery boys to log in, view their assigned orders, and update the delivery status of orders.

---

## **Authentication**

All delivery boy endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <delivery_boy_jwt_token>
```

---

## **Endpoints & Examples**

---

### 1. **Delivery Boy Login**

**POST** `/api/delivery/login`

**Request Body:**
```json
{
  "email": "deliveryboy@example.com",
  "password": "password123"
}
```

**Success Response:**
```json
{
  "token": "<delivery_boy_jwt_token>"
}
```

**Error Response:**
```json
{
  "message": "Invalid credentials or not a delivery boy"
}
```

---

### 2. **Get Assigned Orders**

**GET** `/api/delivery/orders`

**Headers:**
```
Authorization: Bearer <delivery_boy_jwt_token>
```

**Response:**
```json
{
  "orders": [
    {
      "_id": "665f4e7e2f8b2c0012a4e123",
      "userId": "665f4e7e2f8b2c0012a4e124",
      "washType": "premium",
      "items": { "shirt": 2, "pant": 1 },
      "status": "Picked Up",
      "deliveryBoyId": "665f4e7e2f8b2c0012a4e999"
      // ...other order fields
    }
    // ...more orders
  ]
}
```

---

### 3. **Update Order Status**

**PUT** `/api/delivery/orders/:orderId/status`

**Headers:**
```
Authorization: Bearer <delivery_boy_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "Delivered"
}
```

**Success Response:**
```json
{
  "message": "Order status updated",
  "order": {
    "_id": "665f4e7e2f8b2c0012a4e123",
    "status": "Delivered"
    // ...other order fields
  }
}
```

**Error Response:**
```json
{
  "message": "Order not found or not assigned to you"
}
```
or
```json
{
  "message": "Invalid status"
}
```

---

## **Admin: View All Delivery Boys**

**GET** `/api/admin/delivery-boys`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Response:**
```json
[
  {
    "_id": "665f4e7e2f8b2c0012a4e999",
    "email": "deliveryboy@example.com",
    "createdAt": "2025-06-16T12:34:56.789Z"
    // ...other user fields
  }
  // ...more delivery boys
]
```

---

## **Notes**

- Only delivery boys with `isDeliveryBoy: true` can log in and access these endpoints.
- Orders must have a `deliveryBoyId` field assigned to the delivery boy's user ID.
- Allowed statuses for update: `"Picked Up"`, `"In Progress"`, `"Delivered"`.

---