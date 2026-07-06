/**
 * utils/cloudinary.js
 * Cloudinary + Multer configuration.
 * Multer is set to memory storage so the file buffer can be uploaded to Cloudinary.
 */

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- Storage for Resumes (PDF / DOCX) ---
const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "job_portal/resumes",       // Cloudinary folder
    resource_type: "raw",               // PDF/DOCX are raw files
    allowed_formats: ["pdf", "doc", "docx"],
  },
});

// --- Storage for Images (Avatar / Company Logo) ---
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "job_portal/images",
    resource_type: "image",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

// Multer upload instances
const uploadResume = multer({
  storage: resumeStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
});

module.exports = { cloudinary, uploadResume, uploadImage };
