# School Management API

![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Railway](https://img.shields.io/badge/Deployed%20on-Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)

A production-ready REST API for managing school data, built with **Node.js**, **Express.js**, and **MySQL**. Supports adding schools and retrieving them sorted by proximity using the **Haversine formula**.

> **Live API:** https://school-management-api-production-903f.up.railway.app

---

## Features

- **Add School** — Validated POST endpoint to register a new school
- **List Schools** — GET endpoint returning schools sorted by distance from user's coordinates
- **Haversine Distance** — Accurate geographic distance calculation between two coordinates
- **Input Validation** — Full validation using `express-validator` with descriptive error messages
- **Security** — HTTP headers secured via `helmet`
- **Logging** — HTTP request logging via `morgan`
- **CORS** — Enabled for cross-origin access
- **Global Error Handling** — Centralized error middleware for consistent error responses

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 22.x |
| Framework | Express.js 4.x |
| Database | MySQL 8.x (via `mysql2`) |
| Validation | express-validator |
| Security | helmet, cors |
| Logging | morgan |
| Deployment | Railway |

---

## Project Structure

```
Nodejs_Assignment/
├── src/
│   ├── config/
│   │   └── db.js                  # MySQL connection setup
│   ├── controllers/
│   │   └── schoolController.js    # Business logic for both APIs
│   ├── middlewares/
│   │   ├── validate.js            # express-validator rules
│   │   └── errorHandler.js        # Global error handler
│   ├── routes/
│   │   └── schoolRoutes.js        # Route definitions
│   └── utils/
│       └── haversine.js           # Haversine distance formula
├── app.js                         # Express app configuration
├── server.js                      # Entry point — starts the server
├── schema.sql                     # Database schema
├── .env.example                   # Environment variable template
├── .gitignore
└── package.json
```

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/kuldipsolanki46/school-management-api.git
cd school-management-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up MySQL database

```bash
mysql -u root -p < schema.sql
```

### 4. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your local MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=school_management
DB_PORT=3306
PORT=3000
```

### 5. Start the server

```bash
npm run dev    # Development (auto-restart on file changes)
npm start      # Production
```

API runs at: `http://localhost:3000`

---

## API Reference

### Health Check

```
GET /
```

**Response (200):**
```json
{
  "success": true,
  "message": "School Management API is running",
  "version": "1.0.0",
  "endpoints": {
    "addSchool": "POST /addSchool",
    "listSchools": "GET /listSchools?latitude=<lat>&longitude=<lon>"
  }
}
```

---

### POST `/addSchool`

Adds a new school to the database.

**Request Body (JSON):**

```json
{
  "name": "Greenwood High School",
  "address": "123 MG Road, Bangalore, Karnataka",
  "latitude": 12.9716,
  "longitude": 77.5946
}
```

**Validation Rules:**

| Field | Type | Rules |
|---|---|---|
| `name` | String | Required, non-empty |
| `address` | String | Required, non-empty |
| `latitude` | Float | Required, between -90 and 90 |
| `longitude` | Float | Required, between -180 and 180 |

**Success Response (201):**

```json
{
  "success": true,
  "message": "School added successfully",
  "data": {
    "schoolId": 1,
    "name": "Greenwood High School",
    "address": "123 MG Road, Bangalore, Karnataka",
    "latitude": 12.9716,
    "longitude": 77.5946
  }
}
```

**Validation Error Response (400):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "latitude", "message": "Latitude must be a number between -90 and 90" }
  ]
}
```

---

### GET `/listSchools`

Returns all schools sorted by distance from the user's coordinates (closest first).

**Query Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `latitude` | Float | Yes | User's latitude (-90 to 90) |
| `longitude` | Float | Yes | User's longitude (-180 to 180) |

**Example Request:**

```
GET /listSchools?latitude=12.9716&longitude=77.5946
```

**Success Response (200):**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "name": "Greenwood High School",
      "address": "123 MG Road, Bangalore",
      "latitude": 12.9716,
      "longitude": 77.5946,
      "distance_km": 0.0
    },
    {
      "id": 2,
      "name": "Sunrise Academy",
      "address": "45 Koramangala, Bangalore",
      "latitude": 12.9352,
      "longitude": 77.6245,
      "distance_km": 4.73
    }
  ]
}
```

---

## Distance Calculation

Uses the **Haversine Formula** — calculates the shortest distance between two points on the Earth's surface given their latitude and longitude. Result is returned in kilometers as `distance_km`.

---

## Deployment

This API is deployed on **Railway** with an auto-provisioned **MySQL** database.

Every push to the `main` branch triggers an automatic rebuild and redeploy.

**Live Base URL:**
```
https://school-management-api-production-903f.up.railway.app
```

**Test the live API:**
```
GET https://school-management-api-production-903f.up.railway.app/listSchools?latitude=19.07&longitude=72.87
```

---

## Postman Collection

> **Collection Link:** *(Add your Postman public collection link here)*

---

## Author

**Kuldip Solanki**
