/**
 * pages/RecruiterDashboard.jsx
 * Main dashboard for recruiters — shows stats and list of posted jobs.
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import Spinner from "../components/Spinner";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchJobs = async () => {
    try {
      const { data } = await API.get("/jobs/my-jobs");
      setJobs(data.jobs);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleToggle = async (id) => {
    setToggling(id);
    try {
      const { data } = await API.patch(`/jobs/${id}/toggle-status`);
      setJobs((prev) =>
        prev.map((j) => (j._id === id ? { ...j, status: data.status } : j))
      );
    } catch { /* ignore */ }
    finally { setToggling(null); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this job posting and all its applications?")) return;
    setDeleting(id);
    try {
      await API.delete(`/jobs/${id}`);
      setJobs((prev) => prev.filter((j) => j._id !== id));
    } catch { /* ignore */ }
    finally { setDeleting(null); }
  };

  const openJobs   = jobs.filter((j) => j.status === "open").length;
  const closedJobs = jobs.filter((j) => j.status === "closed").length;
  const totalApps  = jobs.reduce((sum, j) => sum + (j.applications?.length || 0), 0);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  if (loading) return <Spinner fullPage />;

  return (
    <div className="section">
      <div className="container">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1>Recruiter Dashboard</h1>
            <p className="mt-2 text-secondary">Manage your job postings and view applicants.</p>
          </div>
          <Link to="/post-job" className="btn btn-primary">
            ＋ Post New Job
          </Link>
        </div>

        {/* Stats */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-value">{jobs.length}</div>
            <div className="stat-label">Total Jobs Posted</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🟢</div>
            <div className="stat-value">{openJobs}</div>
            <div className="stat-label">Open Positions</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔴</div>
            <div className="stat-value">{closedJobs}</div>
            <div className="stat-label">Closed Positions</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-value">{totalApps}</div>
            <div className="stat-label">Total Applications</div>
          </div>
        </div>

        {/* Jobs table */}
        <h2 className="mb-4">Your Job Postings</h2>

        {jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No jobs posted yet</h3>
            <p>Create your first job posting to start receiving applications.</p>
            <Link to="/post-job" className="btn btn-primary mt-4">Post a Job</Link>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Applications</th>
                  <th>Status</th>
                  <th>Posted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id}>
                    <td>
                      <Link to={`/jobs/${job._id}`} style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                        {job.title}
                      </Link>
                    </td>
                    <td><span className="badge badge-muted">{job.jobType}</span></td>
                    <td>{job.location}</td>
                    <td>
                      <Link to={`/jobs/${job._id}/applicants`} style={{ color: "var(--primary-light)", fontWeight: 600 }}>
                        {job.applications?.length || 0} applicants
                      </Link>
                    </td>
                    <td>
                      <span className={`badge ${job.status === "open" ? "badge-success" : "badge-danger"}`}>
                        {job.status === "open" ? "Open" : "Closed"}
                      </span>
                    </td>
                    <td>{formatDate(job.createdAt)}</td>
                    <td>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <Link to={`/edit-job/${job._id}`} className="btn btn-secondary btn-sm">Edit</Link>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => handleToggle(job._id)}
                          disabled={toggling === job._id}
                        >
                          {toggling === job._id ? "..." : job.status === "open" ? "Close" : "Reopen"}
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(job._id)}
                          disabled={deleting === job._id}
                        >
                          {deleting === job._id ? "..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
