/**
 * controllers/userController.js
 * Handles: getProfile, updateProfile, uploadResume, deleteResume, saveJob
 */

const User = require("../models/User");
const { cloudinary } = require("../utils/cloudinary");
const AppError = require("../utils/AppError");
const asyncWrapper = require("../utils/asyncWrapper");

// GET /api/users/profile
const getProfile = asyncWrapper(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("-hash -salt")
    .populate("savedJobs", "title company location jobType status");
  res.json({ success: true, user });
});

// PUT /api/users/profile
const updateProfile = asyncWrapper(async (req, res) => {
  const { name, phone, location, bio, skills } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone, location, bio, skills },
    { new: true, runValidators: true }
  ).select("-hash -salt");

  res.json({ success: true, message: "Profile updated!", user });
});

// POST /api/users/avatar — upload profile picture
const uploadAvatar = asyncWrapper(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded." });
  }

  const user = await User.findById(req.user._id);

  // Delete old avatar from Cloudinary if it exists
  if (user.avatar && user.avatar.publicId) {
    await cloudinary.uploader.destroy(user.avatar.publicId, {
      resource_type: "image",
    });
  }

  user.avatar = {
    url: req.file.path,         // Cloudinary URL
    publicId: req.file.filename, // Cloudinary public_id
  };
  await user.save();

  res.json({ success: true, message: "Avatar uploaded!", avatar: user.avatar });
});

// POST /api/users/resume
const uploadResume = asyncWrapper(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded." });
  }

  const user = await User.findById(req.user._id);

  // Delete old resume from Cloudinary if it exists
  if (user.resume && user.resume.publicId) {
    await cloudinary.uploader.destroy(user.resume.publicId, {
      resource_type: "raw",
    });
  }

  user.resume = {
    url: req.file.path,
    publicId: req.file.filename,
    filename: req.file.originalname,
  };
  await user.save();

  res.json({ success: true, message: "Resume uploaded!", resume: user.resume });
});

// DELETE /api/users/resume
const deleteResume = asyncWrapper(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user.resume && user.resume.publicId) {
    await cloudinary.uploader.destroy(user.resume.publicId, {
      resource_type: "raw",
    });
  }

  user.resume = { url: "", publicId: "", filename: "" };
  await user.save();

  res.json({ success: true, message: "Resume deleted." });
});

// GET /api/users/saved-jobs
const getSavedJobs = asyncWrapper(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: "savedJobs",
    populate: { path: "company", select: "companyName companyLogo" },
  });
  res.json({ success: true, savedJobs: user.savedJobs });
});

// POST /api/users/saved-jobs/:jobId — toggle save/unsave
const toggleSaveJob = asyncWrapper(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { jobId } = req.params;

  const index = user.savedJobs.indexOf(jobId);
  let saved;
  if (index > -1) {
    user.savedJobs.splice(index, 1); // Already saved → remove
    saved = false;
  } else {
    user.savedJobs.push(jobId);      // Not saved → add
    saved = true;
  }

  await user.save();
  res.json({ success: true, saved, message: saved ? "Job saved!" : "Job unsaved." });
});

module.exports = {
  getProfile,
  updateProfile,
  uploadAvatar,
  uploadResume,
  deleteResume,
  getSavedJobs,
  toggleSaveJob,
};
