/**
 * routes/recruiterRoutes.js
 */

const express = require("express");
const router = express.Router();
const {
  getProfile,
  createProfile,
  updateProfile,
  uploadLogo,
  getPublicProfile,
} = require("../controllers/recruiterController");
const { isLoggedIn, isRecruiter, validateBody } = require("../middleware");
const { recruiterProfileSchema } = require("../validations/schemas");
const { uploadImage } = require("../utils/cloudinary");

router.get("/profile", isLoggedIn, isRecruiter, getProfile);
router.post("/profile", isLoggedIn, isRecruiter, validateBody(recruiterProfileSchema), createProfile);
router.put("/profile", isLoggedIn, isRecruiter, validateBody(recruiterProfileSchema), updateProfile);
router.post("/logo", isLoggedIn, isRecruiter, uploadImage.single("logo"), uploadLogo);
router.get("/profile/:id", getPublicProfile); // Public endpoint

module.exports = router;
