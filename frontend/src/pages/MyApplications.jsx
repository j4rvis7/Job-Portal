/**
 * pages/MyApplications.jsx
 * Job seeker's view of all their applications with status tracking.
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import Spinner from "../components/Spinner";

const STATUS_CONFIG = {
  applied:      { label: "Applied",       cls: "badge-info",    icon: "📨" },
  under_review: { label: "Under Review",  cls: "badge-warning", icon: "👀" },
  accepted:     { label: "Accepted",      cls: "badge-success", icon: "✅" },
  rejected:     { label: "Rejected",      cls: "badge-danger",  icon: "❌" },
  withdrawn:    { label: "Withdrawn",     cls: "badge-muted",   icon: "↩️" },
};

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get("/applications/my-applications");
        setApplications(data.applications);
      } catch {
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleWithdraw = async (id) => {
    if (!confirm("Withdraw this application?")) return;
    setWithdrawing(id);
    try {
      await API.delete(`/applications/${id}/withdraw`);
      setApplications((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: "withdrawn" } : a))
      );
      setMsg("Application withdrawn.");
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to withdraw.");
    } finally {
      setWithdrawing(null);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  if (loading) return <Spinner fullPage />;

  return (
    <div className="section">
      <div className="container">
        <div className="mb-8">
          <h1>My Applications</h1>
          <p className="mt-2 text-secondary">Track all your job applications in one place.</p>
        </div>

        {msg && <div className="alert alert-info mb-6">{msg}</div>}

        {applications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No applications yet</h3>
            <p>Start applying to jobs to see your applications here.</p>
            <Link to="/jobs" className="btn btn-primary mt-4">Browse Jobs</Link>
          </div>
        ) : (
          <>
            {/* Summary stats */}
            <div className="dashboard-stats mb-6">
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                const count = applications.filter((a) => a.status === key).length;
                return count > 0 ? (
                  <div key={key} className="stat-card">
                    <div className="stat-icon">{cfg.icon}</div>
                    <div className="stat-value">{count}</div>
                    <div className="stat-label">{cfg.label}</div>
                  </div>
                ) : null;
              })}
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Job</th>
                    <th>Company</th>
                    <th>Type</th>
                    <th>Applied</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => {
                    const job = app.job || {};
                    const company = job.company || {};
                    const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.applied;

                    return (
                      <tr key={app._id}>
                        <td>
                          <Link to={`/jobs/${job._id}`} style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                            {job.title || "Job Removed"}
                          </Link>
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            {company.companyLogo?.url ? (
                              <img src={company.companyLogo.url} alt="" style={{ width: 28, height: 28, borderRadius: 6 }} />
                            ) : null}
                            {company.companyName || "—"}
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-muted">{job.jobType || "—"}</span>
                        </td>
                        <td>{formatDate(app.createdAt)}</td>
                        <td>
                          <span className={`badge ${cfg.cls}`}>{cfg.icon} {cfg.label}</span>
                        </td>
                        <td>
                          {["applied", "under_review"].includes(app.status) && (
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={() => handleWithdraw(app._id)}
                              disabled={withdrawing === app._id}
                            >
                              {withdrawing === app._id ? "..." : "Withdraw"}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
