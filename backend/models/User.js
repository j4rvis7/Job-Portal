/**
 * models/User.js
 * User model — works for both Job Seekers and Recruiters.
 * passport-local-mongoose adds username, hash, salt fields + authentication methods.
 */

const mongoose = require("mongoose");
// passport-local-mongoose v9 uses ES module exports — unwrap .default if needed
const _plm = require("passport-local-mongoose");
const passportLocalMongoose = _plm.default || _plm;

const UserSchema = new mongoose.Schema(
  {
    // passport-local-mongoose uses "username" by default; we use email
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    // Role determines what the user can do
    role: {
      type: String,
      enum: ["jobseeker", "recruiter"],
      default: "jobseeker",
    },

    // Profile fields (optional at registration, filled in profile)
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    bio: { type: String, default: "" },

    // Skills array (job seekers)
    skills: [{ type: String }],

    // Avatar image stored on Cloudinary
    avatar: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },

    // Resume stored on Cloudinary (job seekers)
    resume: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
      filename: { type: String, default: "" },
    },

    // Jobs the user has saved/bookmarked
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
  },
  { timestamps: true }
);

// Plug in passport-local-mongoose — adds username (mapped to email), hash, salt
// usernameField: "email" tells it to use our email field as the username
UserSchema.plugin(passportLocalMongoose, { usernameField: "email" });

module.exports = mongoose.model("User", UserSchema);
