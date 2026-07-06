/**
 * config/passport.js
 * Passport.js configuration using passport-local strategy.
 * passport-local-mongoose handles hashing + salting automatically.
 */

const passport = require("passport");
const User = require("../models/User");

module.exports = (app) => {
  // Initialize passport middleware
  app.use(passport.initialize());
  // Restore authentication state from session
  app.use(passport.session());

  // Use the local strategy provided by passport-local-mongoose
  passport.use(User.createStrategy());

  // Serialize: store user ID in session
  passport.serializeUser(User.serializeUser());

  // Deserialize: fetch user from DB using session ID
  passport.deserializeUser(User.deserializeUser());
};
