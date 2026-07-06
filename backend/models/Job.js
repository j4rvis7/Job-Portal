/**
 * models/Job.js
 * Job posting created by a recruiter.
 */

const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Job description is required"],
    },

    requirements: {
      type: String,
      default: "",
    },

    // The recruiter (User) who posted the job
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // The company profile associated with the recruiter
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RecruiterProfile",
    },

    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },

    // "full-time" | "part-time" | "contract" | "internship" | "remote"
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship", "remote"],
      required: [true, "Job type is required"],
    },

    // "entry" | "mid" | "senior" | "lead" | "executive"
    experienceLevel: {
      type: String,
      enum: ["entry", "mid", "senior", "lead", "executive"],
      default: "entry",
    },

    salary: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      currency: { type: String, default: "USD" },
    },

    // Required skill tags
    skills: [{ type: String }],

    // "open" | "closed"
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },

    // All applications for this job
    applications: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Application" },
    ],
  },
  { timestamps: true }
);

// Virtual: count of applications
JobSchema.virtual("applicationCount").get(function () {
  return this.applications.length;
});

// Text index for search
JobSchema.index({ title: "text", description: "text", skills: "text" });

module.exports = mongoose.model("Job", JobSchema);
