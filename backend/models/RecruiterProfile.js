/**
 * models/RecruiterProfile.js
 * Extended profile for recruiters (company information).
 * One recruiter user → one RecruiterProfile document.
 */

const mongoose = require("mongoose");

const RecruiterProfileSchema = new mongoose.Schema(
  {
    // Reference back to the User document
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One profile per recruiter
    },

    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },

    companyLogo: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },

    website: {
      type: String,
      default: "",
      trim: true,
    },

    industry: {
      type: String,
      default: "",
      trim: true,
    },

    // e.g. "1-10", "11-50", "51-200", "201-500", "500+"
    companySize: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    headquarters: {
      type: String,
      default: "",
    },

    // Whether this company profile has been verified (admin feature)
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RecruiterProfile", RecruiterProfileSchema);
