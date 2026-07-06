/**
 * routes/userRoutes.js
 */

const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  uploadAvatar,
  uploadResume,
  deleteResume,
  getSavedJobs,
  toggleSaveJob,
} = require("../controllers/userController");
const { isLoggedIn, isJobSeeker, validateBody } = require("../middleware");
const { profileSchema } = require("../validations/schemas");
const { uploadResume: multerResume, uploadImage } = require("../utils/cloudinary");

router.get("/profile", isLoggedIn, getProfile);
router.put("/profile", isLoggedIn, validateBody(profileSchema), updateProfile);
router.post("/avatar", isLoggedIn, uploadImage.single("avatar"), uploadAvatar);
router.post("/resume", isLoggedIn, multerResume.single("resume"), uploadResume);
router.delete("/resume", isLoggedIn, deleteResume);
router.get("/saved-jobs", isLoggedIn, isJobSeeker, getSavedJobs);
router.post("/saved-jobs/:jobId", isLoggedIn, isJobSeeker, toggleSaveJob);

module.exports = router;
