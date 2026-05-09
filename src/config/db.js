const mysql = require("mysql2");
require("dotenv").config();

// Railway provides a single MYSQL_URL connection string.
// Locally, we use individual variables from .env
const db = process.env.MYSQL_URL
  ? mysql.createConnection(process.env.MYSQL_URL)
  : mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
  console.log("Connected to MySQL database");
});

module.exports = db;
