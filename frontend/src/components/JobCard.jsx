/**
 * components/JobCard.jsx
 * Reusable card component displayed in job listings and search results.
 */

import { Link } from "react-router-dom";

// Helper to format salary range
const formatSalary = (salary) => {
  if (!salary || (!salary.min && !salary.max)) return null;
  const fmt = (n) =>
    n >= 1000 ? `${(n / 1000).toFixed(0)}k` : `${n}`;
  if (salary.min && salary.max) {
    return `${salary.currency || "USD"} ${fmt(salary.min)} – ${fmt(salary.max)}`;
  }
  if (salary.min) return `From ${salary.currency || "USD"} ${fmt(salary.min)}`;
  return `Up to ${salary.currency || "USD"} ${fmt(salary.max)}`;
};

// Badge color by job type
const jobTypeBadge = {
  "full-time": "badge-primary",
  "part-time": "badge-warning",
  contract: "badge-info",
  internship: "badge-muted",
  remote: "badge-success",
};

// Time ago helper
const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
};

const JobCard = ({ job }) => {
  const company = job.company || {};
  const logoUrl = company.companyLogo?.url;
  const companyInitial = (company.companyName || "C")[0].toUpperCase();
  const salary = formatSalary(job.salary);

  return (
    <Link to={`/jobs/${job._id}`} style={{ textDecoration: "none" }}>
      <div className="job-card">
        <div className="job-card-header">
          {logoUrl ? (
            <img src={logoUrl} alt={company.companyName} className="company-logo" />
          ) : (
            <div className="company-logo-placeholder">{companyInitial}</div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="job-card-title">{job.title}</div>
            <div className="job-card-company">
              {company.companyName || "Company"} &nbsp;·&nbsp; {job.location}
            </div>
          </div>
          <span className={`badge ${jobTypeBadge[job.jobType] || "badge-muted"}`}>
            {job.jobType}
          </span>
        </div>

        {/* Skills */}
        {job.skills?.length > 0 && (
          <div className="job-card-meta">
            {job.skills.slice(0, 4).map((s, i) => (
              <span key={i} className="tag">{s}</span>
            ))}
            {job.skills.length > 4 && (
              <span className="tag">+{job.skills.length - 4}</span>
            )}
          </div>
        )}

        <div className="job-card-footer">
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <span className="badge badge-muted" style={{ fontSize: "0.72rem" }}>
              {job.experienceLevel}
            </span>
            {salary && <span className="salary-range">{salary}</span>}
          </div>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            {timeAgo(job.createdAt)}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
