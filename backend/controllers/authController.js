/**
 * controllers/authController.js
 * Handles: register, login, logout, getCurrentUser
 */

const User = require("../models/User");
const passport = require("passport");
const AppError = require("../utils/AppError");
const asyncWrapper = require("../utils/asyncWrapper");

// POST /api/auth/register
const register = asyncWrapper(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Check if email already exists
  const existing = await User.findOne({ email });
  if (existing) {
    return next(new AppError("An account with that email already exists.", 400));
  }

  // Create user — password is handled by passport-local-mongoose (register method)
  const user = new User({ name, email, role });
  const registeredUser = await User.register(user, password);

  // Automatically log in after registration
  req.login(registeredUser, (err) => {
    if (err) return next(err);
    const { hash, salt, ...safeUser } = registeredUser.toObject();
    res.status(201).json({
      success: true,
      message: "Registration successful!",
      user: safeUser,
    });
  });
});

// POST /api/auth/login
// passport.authenticate is called from the route, not here
// This function runs after successful authentication
const login = (req, res) => {
  const { hash, salt, ...safeUser } = req.user.toObject();
  res.json({
    success: true,
    message: "Login successful!",
    user: safeUser,
  });
};

// POST /api/auth/logout
const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie("connect.sid");
      res.json({ success: true, message: "Logged out successfully." });
    });
  });
};

// GET /api/auth/me
const getCurrentUser = asyncWrapper(async (req, res) => {
  // Re-fetch user to get latest data (session may be stale)
  const user = await User.findById(req.user._id).select("-hash -salt");
  res.json({ success: true, user });
});

module.exports = { register, login, logout, getCurrentUser };
