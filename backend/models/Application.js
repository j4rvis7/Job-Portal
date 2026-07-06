/**
 * models/Application.js
 * A job application submitted by a job seeker for a specific job.
 */

const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    // The job being applied to
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    // The user applying (must be a jobseeker)
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Resume snapshot at the time of applying (may differ from current resume)
    resume: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
      filename: { type: String, default: "" },
    },

    coverLetter: {
      type: String,
      default: "",
    },

    // Tracks the current stage of the application
    status: {
      type: String,
      enum: ["applied", "under_review", "accepted", "rejected", "withdrawn"],
      default: "applied",
    },

    // Private notes the recruiter can add
    recruiterNotes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Ensure a user can only apply once per job
ApplicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model("Application", ApplicationSchema);
