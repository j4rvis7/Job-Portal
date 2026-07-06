/**
 * routes/authRoutes.js
 * Routes: register, login, logout, /me
 */

const express = require("express");
const router = express.Router();
const passport = require("passport");
const { register, login, logout, getCurrentUser } = require("../controllers/authController");
const { isLoggedIn, validateBody } = require("../middleware");
const { registerSchema, loginSchema } = require("../validations/schemas");

// POST /api/auth/register
router.post("/register", validateBody(registerSchema), register);

// POST /api/auth/login
// passport.authenticate handles checking credentials and calling req.login()
router.post(
  "/login",
  validateBody(loginSchema),
  (req, res, next) => {
    passport.authenticate("local", { usernameField: "email" }, (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ success: false, message: info?.message || "Invalid credentials." });
      }
      req.login(user, (err) => {
        if (err) return next(err);
        login(req, res);
      });
    })(req, res, next);
  }
);

// POST /api/auth/logout
router.post("/logout", isLoggedIn, logout);

// GET /api/auth/me
router.get("/me", isLoggedIn, getCurrentUser);

module.exports = router;
