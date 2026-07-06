/**
 * pages/JobDetail.jsx
 * Single job detail page with apply modal.
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import Spinner from "../components/Spinner";

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Apply modal state
  const [showApply, setShowApply] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);
  const [applyMsg, setApplyMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await API.get(`/jobs/${id}`);
        setJob(data.job);
      } catch {
        setError("Job not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) { navigate("/login"); return; }
    if (!user.resume?.url) {
      setApplyMsg({ type: "danger", text: "Please upload your resume in your profile before applying." });
      return;
    }
    setApplying(true);
    try {
      await API.post(`/applications/${id}`, { coverLetter });
      setApplyMsg({ type: "success", text: "Application submitted successfully! 🎉" });
      setCoverLetter("");
    } catch (err) {
      setApplyMsg({ type: "danger", text: err.response?.data?.message || "Application failed." });
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <Spinner fullPage />;
  if (error) return (
    <div className="section container text-center">
      <div className="empty-state">
        <div className="empty-icon">😕</div>
        <h3>{error}</h3>
        <Link to="/jobs" className="btn btn-primary mt-4">Back to Jobs</Link>
      </div>
    </div>
  );

  const company = job.company || {};
  const logoUrl = company.companyLogo?.url;
  const initial = (company.companyName || "C")[0].toUpperCase();

  return (
    <div className="section">
      <div className="container-sm">
        {/* Back link */}
        <Link to="/jobs" style={{ color: "var(--text-muted)", fontSize: "0.875rem", display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "24px" }}>
          ← Back to Jobs
        </Link>

        {/* Header card */}
        <div className="card mb-6">
          <div className="flex gap-4 items-start">
            {logoUrl ? (
              <img src={logoUrl} alt={company.companyName} className="company-logo" style={{ width: 72, height: 72 }} />
            ) : (
              <div className="company-logo-placeholder" style={{ width: 72, height: 72, fontSize: "1.6rem" }}>{initial}</div>
            )}
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: "1.75rem", marginBottom: "4px" }}>{job.title}</h1>
              <p style={{ fontSize: "1rem", color: "var(--text-secondary)", margin: 0 }}>
                {company.companyName} &nbsp;·&nbsp; {job.location}
              </p>
            </div>
            <span className={`badge ${job.status === "open" ? "badge-success" : "badge-danger"}`}>
              {job.status === "open" ? "🟢 Open" : "🔴 Closed"}
            </span>
          </div>

          {/* Meta badges */}
          <div className="flex flex-wrap gap-3 mt-4">
            <span className="badge badge-primary">{job.jobType}</span>
            <span className="badge badge-muted">{job.experienceLevel} level</span>
            {job.salary?.min > 0 && (
              <span className="badge badge-success">
                💰 {job.salary.currency} {job.salary.min.toLocaleString()} – {job.salary.max.toLocaleString()}
              </span>
            )}
          </div>

          {/* CTA */}
          <div className="flex gap-3 mt-6">
            {user?.role === "jobseeker" && job.status === "open" && (
              <button id="apply-btn" className="btn btn-primary btn-lg" onClick={() => setShowApply(true)}>
                Apply Now
              </button>
            )}
            {!user && (
              <Link to="/login" className="btn btn-primary btn-lg">Login to Apply</Link>
            )}
            {company.website && (
              <a href={company.website} target="_blank" rel="noreferrer" className="btn btn-ghost">
                Visit Company ↗
              </a>
            )}
          </div>
        </div>

        {/* Skills */}
        {job.skills?.length > 0 && (
          <div className="card mb-6">
            <h3 className="mb-4">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((s, i) => (
                <span key={i} className="skill-tag-item" style={{ fontSize: "0.85rem", padding: "5px 14px" }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="card mb-6">
          <h3 className="mb-4">Job Description</h3>
          <div style={{ color: "var(--text-secondary)", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
            {job.description}
          </div>
        </div>

        {/* Requirements */}
        {job.requirements && (
          <div className="card mb-6">
            <h3 className="mb-4">Requirements</h3>
            <div style={{ color: "var(--text-secondary)", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
              {job.requirements}
            </div>
          </div>
        )}

        {/* Company Info */}
        {company.description && (
          <div className="card mb-6">
            <h3 className="mb-4">About {company.companyName}</h3>
            <p style={{ lineHeight: 1.8 }}>{company.description}</p>
            {company.industry && <p className="mt-2 text-sm text-secondary"><strong>Industry:</strong> {company.industry}</p>}
            {company.headquarters && <p className="text-sm text-secondary"><strong>HQ:</strong> {company.headquarters}</p>}
            {company.companySize && <p className="text-sm text-secondary"><strong>Size:</strong> {company.companySize} employees</p>}
          </div>
        )}
      </div>

      {/* ── Apply Modal ── */}
      {showApply && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowApply(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3>Apply for {job.title}</h3>
              <button className="modal-close" onClick={() => setShowApply(false)}>✕</button>
            </div>

            {applyMsg.text && (
              <div className={`alert alert-${applyMsg.type} mb-4`}>
                {applyMsg.text}
              </div>
            )}

            {applyMsg.type !== "success" && (
              <form onSubmit={handleApply}>
                {/* Resume preview */}
                <div className="card-glass mb-4" style={{ padding: "16px" }}>
                  <p className="text-sm text-secondary mb-1">📎 Resume attached:</p>
                  <p className="text-sm" style={{ color: "var(--accent)" }}>
                    {user?.resume?.filename || "Your uploaded resume"}
                  </p>
                  {!user?.resume?.url && (
                    <p className="text-sm text-danger mt-2">
                      ⚠️ No resume uploaded.{" "}
                      <Link to="/profile" style={{ color: "var(--primary-light)" }}>Upload one</Link> first.
                    </p>
                  )}
                </div>

                <div className="form-group mb-4">
                  <label className="form-label">Cover Letter (optional)</label>
                  <textarea
                    className="form-control"
                    rows={5}
                    placeholder="Why are you a great fit for this role?"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={applying || !user?.resume?.url}
                  >
                    {applying ? "Submitting..." : "Submit Application"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setShowApply(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {applyMsg.type === "success" && (
              <div className="flex gap-3 mt-4">
                <Link to="/my-applications" className="btn btn-primary">View My Applications</Link>
                <button className="btn btn-ghost" onClick={() => setShowApply(false)}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;
