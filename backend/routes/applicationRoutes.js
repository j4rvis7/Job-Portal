/**
 * routes/applicationRoutes.js
 */

const express = require("express");
const router = express.Router();
const {
  applyForJob,
  getMyApplications,
  withdrawApplication,
  updateApplicationStatus,
} = require("../controllers/applicationController");
const {
  isLoggedIn,
  isJobSeeker,
  isRecruiter,
  isApplicationOwner,
  validateBody,
} = require("../middleware");
const {
  applicationSchema,
  applicationStatusSchema,
} = require("../validations/schemas");

router.get("/my-applications", isLoggedIn, isJobSeeker, getMyApplications);
router.post("/:jobId", isLoggedIn, isJobSeeker, validateBody(applicationSchema), applyForJob);
router.delete("/:id/withdraw", isLoggedIn, isJobSeeker, isApplicationOwner, withdrawApplication);
router.patch("/:id/status", isLoggedIn, isRecruiter, validateBody(applicationStatusSchema), updateApplicationStatus);

module.exports = router;
