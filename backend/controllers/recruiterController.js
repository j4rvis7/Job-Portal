/**
 * controllers/recruiterController.js
 * Handles recruiter profile creation, update, and logo upload.
 */

const RecruiterProfile = require("../models/RecruiterProfile");
const { cloudinary } = require("../utils/cloudinary");
const AppError = require("../utils/AppError");
const asyncWrapper = require("../utils/asyncWrapper");

// GET /api/recruiter/profile
const getProfile = asyncWrapper(async (req, res) => {
  const profile = await RecruiterProfile.findOne({ user: req.user._id });
  if (!profile) {
    return res.json({ success: true, profile: null });
  }
  res.json({ success: true, profile });
});

// POST /api/recruiter/profile — create profile
const createProfile = asyncWrapper(async (req, res, next) => {
  // A recruiter can only have one profile
  const existing = await RecruiterProfile.findOne({ user: req.user._id });
  if (existing) {
    return next(new AppError("Recruiter profile already exists. Use PUT to update.", 400));
  }

  const profile = new RecruiterProfile({
    user: req.user._id,
    ...req.body,
  });
  await profile.save();

  res.status(201).json({
    success: true,
    message: "Company profile created!",
    profile,
  });
});

// PUT /api/recruiter/profile
const updateProfile = asyncWrapper(async (req, res, next) => {
  const profile = await RecruiterProfile.findOneAndUpdate(
    { user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!profile) {
    return next(new AppError("Profile not found. Create one first.", 404));
  }
  res.json({ success: true, message: "Profile updated!", profile });
});

// POST /api/recruiter/logo — upload company logo
const uploadLogo = asyncWrapper(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("No file uploaded.", 400));
  }

  const profile = await RecruiterProfile.findOne({ user: req.user._id });
  if (!profile) {
    return next(new AppError("Create a company profile first.", 404));
  }

  // Delete old logo from Cloudinary
  if (profile.companyLogo && profile.companyLogo.publicId) {
    await cloudinary.uploader.destroy(profile.companyLogo.publicId, {
      resource_type: "image",
    });
  }

  profile.companyLogo = {
    url: req.file.path,
    publicId: req.file.filename,
  };
  await profile.save();

  res.json({
    success: true,
    message: "Logo uploaded!",
    companyLogo: profile.companyLogo,
  });
});

// GET /api/recruiter/profile/:id — public recruiter profile by id
const getPublicProfile = asyncWrapper(async (req, res, next) => {
  const profile = await RecruiterProfile.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!profile) return next(new AppError("Company not found.", 404));
  res.json({ success: true, profile });
});

module.exports = { getProfile, createProfile, updateProfile, uploadLogo, getPublicProfile };
