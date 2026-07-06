/**
 * validations/schemas.js
 * JOI validation schemas for all incoming request bodies.
 * Each schema is exported and used by the validateBody middleware.
 */

const Joi = require("joi");

// ── Auth ──────────────────────────────────────────────────────────────────────

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.min": "Name must be at least 2 characters",
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
  role: Joi.string().valid("jobseeker", "recruiter").default("jobseeker"),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// ── User Profile ──────────────────────────────────────────────────────────────

const profileSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  phone: Joi.string().allow("").max(20),
  location: Joi.string().allow("").max(100),
  bio: Joi.string().allow("").max(500),
  skills: Joi.array().items(Joi.string()).max(20),
});

// ── Recruiter Profile ─────────────────────────────────────────────────────────

const recruiterProfileSchema = Joi.object({
  companyName: Joi.string().min(2).max(100).required().messages({
    "any.required": "Company name is required",
  }),
  website: Joi.string().uri({ allowRelative: false }).allow(""),
  industry: Joi.string().allow("").max(100),
  companySize: Joi.string()
    .valid("1-10", "11-50", "51-200", "201-500", "500+")
    .allow(""),
  description: Joi.string().allow("").max(2000),
  headquarters: Joi.string().allow("").max(100),
});

// ── Job ───────────────────────────────────────────────────────────────────────

const jobSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(20).required(),
  requirements: Joi.string().allow(""),
  location: Joi.string().min(2).max(100).required(),
  jobType: Joi.string()
    .valid("full-time", "part-time", "contract", "internship", "remote")
    .required(),
  experienceLevel: Joi.string()
    .valid("entry", "mid", "senior", "lead", "executive")
    .default("entry"),
  salary: Joi.object({
    min: Joi.number().min(0).default(0),
    max: Joi.number().min(0).default(0),
    currency: Joi.string().default("USD"),
  }),
  skills: Joi.array().items(Joi.string()).max(15),
});

// ── Application ───────────────────────────────────────────────────────────────

const applicationSchema = Joi.object({
  coverLetter: Joi.string().allow("").max(2000),
});

const applicationStatusSchema = Joi.object({
  status: Joi.string()
    .valid("applied", "under_review", "accepted", "rejected")
    .required(),
  recruiterNotes: Joi.string().allow("").max(500),
});

module.exports = {
  registerSchema,
  loginSchema,
  profileSchema,
  recruiterProfileSchema,
  jobSchema,
  applicationSchema,
  applicationStatusSchema,
};
