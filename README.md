# School Management API

A REST API built with **Node.js**, **Express.js**, and **MySQL** that lets you add schools and fetch them sorted by proximity to a given location.

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL (via `mysql2`)
- **Dev Tool:** nodemon

---

## Project Structure

```
Nodejs_Assignment/
├── server.js       # All routes and business logic
├── db.js           # MySQL connection
├── schema.sql      # Database and table setup
├── .env            # Your local credentials (not committed)
├── .env.example    # Template for environment variables
├── .gitignore
└── package.json
```

---

## Local Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Nodejs_Assignment
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up MySQL database

Run the schema file to create the database and table:

```bash
mysql -u root -p < schema.sql
```

### 4. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=school_management
PORT=3000
```

### 5. Start the server

```bash
npm run dev     # development (auto-restart on changes)
npm start       # production
```

API runs at `http://localhost:3000`

---

## API Endpoints

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

**Validation rules:**
- All four fields are required
- `latitude` must be a number between -90 and 90
- `longitude` must be a number between -180 and 180

**Success Response (201):**

```json
{
  "success": true,
  "message": "School added successfully",
  "schoolId": 1
}
```

**Validation Error Response (400):**

```json
{
  "success": false,
  "message": "latitude must be a number between -90 and 90"
}
```

---

### GET `/listSchools`

Returns all schools sorted by distance (closest first) from the user's location.

**Query Parameters:**

| Parameter   | Type  | Required | Description          |
|-------------|-------|----------|----------------------|
| `latitude`  | Float | Yes      | User's latitude      |
| `longitude` | Float | Yes      | User's longitude     |

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

Uses the **Haversine formula** — calculates the shortest distance between two geographic coordinates on Earth's surface. Result is returned in kilometers as `distance_km`.

---

## Deployment (Railway)

### What you need
- A [Railway](https://railway.app) account (free, sign in with GitHub)
- Your code pushed to a GitHub repository

### Step-by-step

**1. Push your code to GitHub**

Make sure `.env` is in `.gitignore` (it already is). Then push:

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

**2. Create a MySQL database on Railway**

- Go to [railway.app](https://railway.app) → New Project → Add a service → Database → **MySQL**
- Once created, click the MySQL service → **Variables** tab
- Note down: `MYSQLHOST`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`, `MYSQLPORT`

**3. Run the schema on Railway's MySQL**

In the Railway MySQL service → **Query** tab, paste and run the contents of `schema.sql`.

**4. Deploy the Node.js app**

- In the same Railway project → **New Service** → **GitHub Repo**
- Select your repository
- Railway will auto-detect Node.js and run `npm start`

**5. Add environment variables**

In your Node.js service → **Variables** tab, add:

```
DB_HOST=<MYSQLHOST from Railway>
DB_PORT=<MYSQLPORT from Railway>
DB_USER=<MYSQLUSER from Railway>
DB_PASSWORD=<MYSQLPASSWORD from Railway>
DB_NAME=<MYSQLDATABASE from Railway>
PORT=3000
```

**6. Get your live URL**

In your Node.js service → **Settings** → **Networking** → **Generate Domain**

Your API will be live at something like:
```
https://school-management-api-production.up.railway.app
```

Test it:
```
GET https://your-url.railway.app/listSchools?latitude=12.9716&longitude=77.5946
```

---

## Live API

> **Base URL:** *(Add your Railway URL here after deploying)*

---

## Postman Collection

> **Collection Link:** *(Add your exported Postman collection link here)*

---

## Author

**Kuldip Solanki**
