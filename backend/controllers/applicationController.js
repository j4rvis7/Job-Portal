/**
 * controllers/applicationController.js
 * Handles: apply, getMyApplications, withdraw, updateStatus
 */

const Application = require("../models/Application");
const Job = require("../models/Job");
const AppError = require("../utils/AppError");
const asyncWrapper = require("../utils/asyncWrapper");

// POST /api/applications/:jobId — apply for a job
const applyForJob = asyncWrapper(async (req, res, next) => {
  const { jobId } = req.params;
  const { coverLetter } = req.body;

  const job = await Job.findById(jobId);
  if (!job) return next(new AppError("Job not found.", 404));
  if (job.status === "closed") {
    return next(new AppError("This job is no longer accepting applications.", 400));
  }

  // Check if already applied
  const existing = await Application.findOne({
    job: jobId,
    applicant: req.user._id,
  });
  if (existing) {
    return next(new AppError("You have already applied for this job.", 400));
  }

  // Use the user's current resume
  const resume = req.user.resume || {};

  const application = new Application({
    job: jobId,
    applicant: req.user._id,
    coverLetter,
    resume: {
      url: resume.url || "",
      publicId: resume.publicId || "",
      filename: resume.filename || "",
    },
    status: "applied",
  });

  await application.save();

  // Add application reference to the Job document
  job.applications.push(application._id);
  await job.save();

  res.status(201).json({
    success: true,
    message: "Application submitted!",
    application,
  });
});

// GET /api/applications/my-applications — job seeker's applications
const getMyApplications = asyncWrapper(async (req, res) => {
  const applications = await Application.find({ applicant: req.user._id })
    .populate({
      path: "job",
      select: "title location jobType status salary",
      populate: {
        path: "company",
        select: "companyName companyLogo",
      },
    })
    .sort({ createdAt: -1 });

  res.json({ success: true, applications });
});

// DELETE /api/applications/:id/withdraw
const withdrawApplication = asyncWrapper(async (req, res) => {
  const application = req.application; // from isApplicationOwner middleware

  if (["accepted", "rejected"].includes(application.status)) {
    return res.status(400).json({
      success: false,
      message: "Cannot withdraw after a decision has been made.",
    });
  }

  application.status = "withdrawn";
  await application.save();

  // Remove reference from Job
  await Job.findByIdAndUpdate(application.job, {
    $pull: { applications: application._id },
  });

  res.json({ success: true, message: "Application withdrawn." });
});

// PATCH /api/applications/:id/status — recruiter updates status
const updateApplicationStatus = asyncWrapper(async (req, res, next) => {
  const { status, recruiterNotes } = req.body;

  const application = await Application.findById(req.params.id).populate(
    "job",
    "recruiter"
  );
  if (!application) return next(new AppError("Application not found.", 404));
  if (!application.job.recruiter.equals(req.user._id)) {
    return next(new AppError("Not authorized.", 403));
  }

  application.status = status;
  if (recruiterNotes !== undefined) application.recruiterNotes = recruiterNotes;
  await application.save();

  res.json({ success: true, message: "Application status updated.", application });
});

module.exports = {
  applyForJob,
  getMyApplications,
  withdrawApplication,
  updateApplicationStatus,
};
