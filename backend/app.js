/**
 * app.js
 * Express application setup.
 * All middleware, session config, passport, and routes are wired here.
 */

require("dotenv").config();
const express = require("express");
const session = require("express-session");
// connect-mongo v6 uses ES module exports — MongoStore is a named export
const { MongoStore } = require("connect-mongo");
const cors = require("cors");

const connectDB = require("./config/db");
const configurePassport = require("./config/passport");
const AppError = require("./utils/AppError");

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const recruiterRoutes = require("./routes/recruiterRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();

// ── Connect to Database ────────────────────────────────────────────────────────
connectDB();

// ── Core Middleware ────────────────────────────────────────────────────────────
// Allow React frontend to communicate with backend
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // Required for cookies/sessions to work cross-origin
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Session Configuration ──────────────────────────────────────────────────────
// Try to use MongoDB session store; fall back to memory store if DB unavailable
let sessionStore;
try {
  sessionStore = MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    touchAfter: 24 * 3600,
    // Don't crash the app if the store can't connect
    mongoOptions: { serverSelectionTimeoutMS: 5000 },
  });
  sessionStore.on("error", (err) => {
    console.error("⚠️  Session store error (MongoDB unreachable):", err.message);
  });
} catch (err) {
  console.error("⚠️  Could not create MongoDB session store, using memory store:", err.message);
  sessionStore = undefined; // express-session uses memory store by default
}

app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback-secret-change-in-production",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: true,                                         // Prevents JS access (XSS protection)
      secure: process.env.NODE_ENV === "production",          // HTTPS only in production
      maxAge: 1000 * 60 * 60 * 24 * 7,                      // 7 days
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

// ── Passport Configuration ─────────────────────────────────────────────────────
configurePassport(app);

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Job Portal API is running!" });
});

// ── 404 Handler ────────────────────────────────────────────────────────────────
// Express 5: use app.use() for catch-all — bare "*" is no longer valid
app.use((req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server.`, 404));
});

// ── Global Error Handler ───────────────────────────────────────────────────────
// Must have 4 parameters for Express to recognize it as error middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong." } = err;

  // Handle Mongoose duplicate key errors (e.g. duplicate email)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // Handle invalid MongoDB ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  if (process.env.NODE_ENV === "development") {
    console.error("❌ ERROR:", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

module.exports = app;
