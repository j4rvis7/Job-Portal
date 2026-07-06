/**
 * routes/jobRoutes.js
 */

const express = require("express");
const router = express.Router();
const {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  toggleStatus,
  getMyJobs,
  getApplicants,
} = require("../controllers/jobController");
const {
  isLoggedIn,
  isRecruiter,
  isJobOwner,
  validateBody,
} = require("../middleware");
const { jobSchema } = require("../validations/schemas");

// Public routes
router.get("/", getAllJobs);

// Recruiter-specific — MUST come before /:id to avoid conflict
router.get("/my-jobs", isLoggedIn, isRecruiter, getMyJobs);

// Public single job
router.get("/:id", getJob);

// Protected recruiter routes
router.post("/", isLoggedIn, isRecruiter, validateBody(jobSchema), createJob);
router.put("/:id", isLoggedIn, isRecruiter, isJobOwner, validateBody(jobSchema), updateJob);
router.delete("/:id", isLoggedIn, isRecruiter, isJobOwner, deleteJob);
router.patch("/:id/toggle-status", isLoggedIn, isRecruiter, isJobOwner, toggleStatus);
router.get("/:id/applicants", isLoggedIn, isRecruiter, getApplicants);

module.exports = router;
