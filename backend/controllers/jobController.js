/**
 * controllers/jobController.js
 * Handles all Job CRUD operations and search/filter functionality.
 */

const Job = require("../models/Job");
const RecruiterProfile = require("../models/RecruiterProfile");
const Application = require("../models/Application");
const AppError = require("../utils/AppError");
const asyncWrapper = require("../utils/asyncWrapper");

// GET /api/jobs — list open jobs with search and filters
const getAllJobs = asyncWrapper(async (req, res) => {
  const {
    search,
    location,
    jobType,
    experienceLevel,
    minSalary,
    maxSalary,
    page = 1,
    limit = 10,
  } = req.query;

  const filter = { status: "open" };

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { skills: { $regex: search, $options: "i" } },
    ];
  }
  if (location) filter.location = { $regex: location, $options: "i" };
  if (jobType) filter.jobType = jobType;
  if (experienceLevel) filter.experienceLevel = experienceLevel;
  if (minSalary) filter["salary.min"] = { $gte: Number(minSalary) };
  if (maxSalary) filter["salary.max"] = { $lte: Number(maxSalary) };

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Job.countDocuments(filter);
  const jobs = await Job.find(filter)
    .populate("company", "companyName companyLogo industry headquarters")
    .populate("recruiter", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.json({
    success: true,
    jobs,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  });
});

// GET /api/jobs/:id — single job
const getJob = asyncWrapper(async (req, res, next) => {
  const job = await Job.findById(req.params.id)
    .populate("company", "companyName companyLogo website industry description headquarters companySize")
    .populate("recruiter", "name email");
  if (!job) return next(new AppError("Job not found.", 404));
  res.json({ success: true, job });
});

// POST /api/jobs — create job (recruiter only)
const createJob = asyncWrapper(async (req, res, next) => {
  const profile = await RecruiterProfile.findOne({ user: req.user._id });
  if (!profile) {
    return next(new AppError("Please create a company profile before posting jobs.", 400));
  }
  const job = new Job({
    ...req.body,
    recruiter: req.user._id,
    company: profile._id,
  });
  await job.save();
  res.status(201).json({ success: true, message: "Job posted!", job });
});

// PUT /api/jobs/:id — update job
const updateJob = asyncWrapper(async (req, res) => {
  const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.json({ success: true, message: "Job updated!", job });
});

// DELETE /api/jobs/:id — delete job
const deleteJob = asyncWrapper(async (req, res) => {
  const job = await Job.findByIdAndDelete(req.params.id);
  // Remove all related applications
  await Application.deleteMany({ job: req.params.id });
  res.json({ success: true, message: "Job deleted." });
});

// PATCH /api/jobs/:id/toggle-status — open/close
const toggleStatus = asyncWrapper(async (req, res) => {
  const job = req.job; // already fetched by isJobOwner middleware
  job.status = job.status === "open" ? "closed" : "open";
  await job.save();
  res.json({ success: true, message: `Job is now ${job.status}.`, status: job.status });
});

// GET /api/jobs/my-jobs — recruiter's own jobs
const getMyJobs = asyncWrapper(async (req, res) => {
  const jobs = await Job.find({ recruiter: req.user._id })
    .populate("company", "companyName companyLogo")
    .sort({ createdAt: -1 });
  res.json({ success: true, jobs });
});

// GET /api/jobs/:id/applicants — applications for a job
const getApplicants = asyncWrapper(async (req, res, next) => {
  const job = await Job.findById(req.params.id);
  if (!job) return next(new AppError("Job not found.", 404));
  if (!job.recruiter.equals(req.user._id)) {
    return next(new AppError("Not authorized.", 403));
  }

  const applications = await Application.find({ job: req.params.id })
    .populate("applicant", "name email phone location skills avatar resume")
    .sort({ createdAt: -1 });

  res.json({ success: true, applications, jobTitle: job.title });
});

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  toggleStatus,
  getMyJobs,
  getApplicants,
};
