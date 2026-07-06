/**
 * middleware/index.js
 * All custom middleware functions:
 *  - isLoggedIn       — user must be authenticated
 *  - isRecruiter      — user must have role "recruiter"
 *  - isJobSeeker      — user must have role "jobseeker"
 *  - isJobOwner       — recruiter must own the job
 *  - validateBody     — JOI schema validation factory
 */

const AppError = require("../utils/AppError");
const Job = require("../models/Job");
const Application = require("../models/Application");
const asyncWrapper = require("../utils/asyncWrapper");

// ── isLoggedIn ─────────────────────────────────────────────────────────────────
// Passport populates req.user if the session is valid.
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return next(new AppError("You must be logged in to do that.", 401));
};

// ── isRecruiter ────────────────────────────────────────────────────────────────
const isRecruiter = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "recruiter") return next();
  return next(
    new AppError("Access denied. Recruiter account required.", 403)
  );
};

// ── isJobSeeker ────────────────────────────────────────────────────────────────
const isJobSeeker = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "jobseeker") return next();
  return next(
    new AppError("Access denied. Job seeker account required.", 403)
  );
};

// ── isJobOwner ─────────────────────────────────────────────────────────────────
// Verifies the logged-in recruiter actually created this job.
const isJobOwner = asyncWrapper(async (req, res, next) => {
  const job = await Job.findById(req.params.id);
  if (!job) return next(new AppError("Job not found.", 404));
  if (!job.recruiter.equals(req.user._id)) {
    return next(new AppError("You are not authorized to edit this job.", 403));
  }
  req.job = job; // Attach job to request for downstream use
  next();
});

// ── isApplicationOwner ─────────────────────────────────────────────────────────
// Verifies the applicant owns this application (for withdraw).
const isApplicationOwner = asyncWrapper(async (req, res, next) => {
  const application = await Application.findById(req.params.id);
  if (!application) return next(new AppError("Application not found.", 404));
  if (!application.applicant.equals(req.user._id)) {
    return next(new AppError("You are not authorized.", 403));
  }
  req.application = application;
  next();
});

// ── validateBody ───────────────────────────────────────────────────────────────
// Factory function that returns a middleware validating req.body against a JOI schema.
const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      // Combine all JOI messages into one string
      const message = error.details.map((d) => d.message).join(", ");
      return next(new AppError(message, 400));
    }
    req.body = value; // Replace body with validated + coerced value
    next();
  };
};

module.exports = {
  isLoggedIn,
  isRecruiter,
  isJobSeeker,
  isJobOwner,
  isApplicationOwner,
  validateBody,
};
