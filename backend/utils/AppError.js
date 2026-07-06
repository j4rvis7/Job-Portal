/**
 * utils/AppError.js
 * Custom error class that extends the built-in Error.
 * Allows us to set a status code and message on every error.
 */

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);          // Pass message to the parent Error class
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; // Mark as operational (expected) error

    // Capture stack trace, excluding the constructor call
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
