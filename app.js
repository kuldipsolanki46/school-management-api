const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

const schoolRoutes = require("./src/routes/schoolRoutes");
const errorHandler = require("./src/middlewares/errorHandler");

const app = express();

// ─── Security & Utility Middleware ───────────────────────────────────────────
app.use(helmet());          // Sets secure HTTP response headers
app.use(cors());            // Enables Cross-Origin Resource Sharing
app.use(morgan("dev"));     // HTTP request logger
app.use(express.json());    // Parse incoming JSON request bodies

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "School Management API is running",
    version: "1.0.0",
    endpoints: {
      addSchool: "POST /addSchool",
      listSchools: "GET /listSchools?latitude=<lat>&longitude=<lon>",
    },
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/", schoolRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ─── Global Error Handler (must be last) ──────────────────────────────────────
app.use(errorHandler);

module.exports = app;
