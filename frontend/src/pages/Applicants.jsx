/**
 * pages/Applicants.jsx
 * Recruiter view of all applicants for a specific job.
 * Can update application status (under_review, accepted, rejected).
 */

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";
import Spinner from "../components/Spinner";

const STATUS_OPTIONS = ["applied", "under_review", "accepted", "rejected"];
const STATUS_COLORS = {
  applied:      "badge-info",
  under_review: "badge-warning",
  accepted:     "badge-success",
  rejected:     "badge-danger",
};

const Applicants = () => {
  const { id } = useParams(); // job id
  const [applications, setApplications] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get(`/jobs/${id}/applicants`);
        setApplications(data.applications);
        setJobTitle(data.jobTitle);
      } catch {
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleStatusUpdate = async (appId, status) => {
    setUpdating(appId);
    try {
      const { data } = await API.patch(`/applications/${appId}/status`, {
        status,
        recruiterNotes: notes,
      });
      setApplications((prev) =>
        prev.map((a) =>
          a._id === appId ? { ...a, status: data.application.status } : a
        )
      );
      setSelectedApp(null);
      setNotes("");
    } catch { /* ignore */ }
    finally { setUpdating(null); }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  if (loading) return <Spinner fullPage />;

  return (
    <div className="section">
      <div className="container">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <Link to="/dashboard" style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>← Dashboard</Link>
            <h1 className="mt-2">Applicants</h1>
            <p className="text-secondary mt-1">{jobTitle} — {applications.length} applications</p>
          </div>
          <div className="flex gap-3">
            <span className="badge badge-success">
              {applications.filter((a) => a.status === "accepted").length} Accepted
            </span>
            <span className="badge badge-danger">
              {applications.filter((a) => a.status === "rejected").length} Rejected
            </span>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No applications yet</h3>
            <p>Share your job posting to attract candidates.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {applications.map((app) => {
              const applicant = app.applicant || {};
              const initial = (applicant.name || "A")[0].toUpperCase();

              return (
                <div key={app._id} className="card" style={{ display: "flex", gap: "20px", alignItems: "flex-start", flexWrap: "wrap" }}>
                  {/* Avatar */}
                  {applicant.avatar?.url ? (
                    <img src={applicant.avatar.url} alt={applicant.name} style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                  ) : (
                    <div style={{
                      width: 52, height: 52, borderRadius: "50%", flexShrink: 0,
                      background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "1.2rem", fontWeight: 700, color: "white"
                    }}>
                      {initial}
                    </div>
                  )}

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <h4>{applicant.name || "Unknown"}</h4>
                        <p className="text-sm text-secondary">{applicant.email}</p>
                        {applicant.location && <p className="text-xs text-muted mt-1">📍 {applicant.location}</p>}
                      </div>
                      <span className={`badge ${STATUS_COLORS[app.status] || "badge-muted"}`}>
                        {app.status?.replace("_", " ")}
                      </span>
                    </div>

                    {/* Skills */}
                    {applicant.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {applicant.skills.slice(0, 5).map((s, i) => (
                          <span key={i} className="tag">{s}</span>
                        ))}
                      </div>
                    )}

                    {/* Cover letter */}
                    {app.coverLetter && (
                      <div style={{ marginTop: "12px", padding: "12px", background: "var(--bg-input)", borderRadius: "var(--radius-md)" }}>
                        <p className="text-xs text-muted mb-1">Cover Letter:</p>
                        <p className="text-sm" style={{ lineHeight: 1.6 }}>
                          {app.coverLetter.length > 200
                            ? app.coverLetter.slice(0, 200) + "..."
                            : app.coverLetter}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 mt-3 flex-wrap items-center">
                      {app.resume?.url && (
                        <a href={app.resume.url} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
                          📄 Resume
                        </a>
                      )}

                      <p className="text-xs text-muted" style={{ marginLeft: "auto" }}>
                        Applied {formatDate(app.createdAt)}
                      </p>

                      {/* Status change buttons */}
                      {app.status !== "accepted" && (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleStatusUpdate(app._id, "accepted")}
                          disabled={updating === app._id}
                        >
                          ✓ Accept
                        </button>
                      )}
                      {app.status !== "rejected" && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleStatusUpdate(app._id, "rejected")}
                          disabled={updating === app._id}
                        >
                          ✗ Reject
                        </button>
                      )}
                      {app.status === "applied" && (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleStatusUpdate(app._id, "under_review")}
                          disabled={updating === app._id}
                        >
                          👀 Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applicants;
