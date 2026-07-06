/**
 * pages/PostJob.jsx
 * Form for recruiters to create a new job posting.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const JOB_TYPES    = ["full-time", "part-time", "contract", "internship", "remote"];
const EXP_LEVELS   = ["entry", "mid", "senior", "lead", "executive"];
const CURRENCIES   = ["USD", "EUR", "GBP", "INR", "CAD", "AUD"];

const SkillsInput = ({ skills, setSkills }) => {
  const [input, setInput] = useState("");
  const add = () => {
    const s = input.trim();
    if (s && !skills.includes(s)) { setSkills([...skills, s]); setInput(""); }
  };
  return (
    <div className="skills-input-container">
      {skills.map((s) => (
        <span key={s} className="skill-tag-item">
          {s}<button type="button" onClick={() => setSkills(skills.filter((x) => x !== s))}>✕</button>
        </span>
      ))}
      <input
        type="text"
        placeholder="Add required skill, press Enter"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } }}
      />
    </div>
  );
};

const PostJob = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    jobType: "full-time",
    experienceLevel: "entry",
    salary: { min: "", max: "", currency: "USD" },
  });
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("salary.")) {
      const key = name.split(".")[1];
      setForm((p) => ({ ...p, salary: { ...p.salary, [key]: value } }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        ...form,
        skills,
        salary: {
          min: Number(form.salary.min) || 0,
          max: Number(form.salary.max) || 0,
          currency: form.salary.currency,
        },
      };
      const { data } = await API.post("/jobs", payload);
      navigate(`/jobs/${data.job._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <div className="container-sm">
        <div className="mb-8">
          <h1>Post a New Job</h1>
          <p className="text-secondary mt-2">Fill in the details to attract the right candidates.</p>
        </div>

        {error && <div className="alert alert-danger mb-6">⚠️ {error}</div>}

        <div className="card">
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Basic Info */}
            <h3>Basic Information</h3>

            <div className="form-group">
              <label className="form-label">Job Title *</label>
              <input className="form-control" name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Senior React Developer" />
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Job Type *</label>
                <select className="form-control" name="jobType" value={form.jobType} onChange={handleChange}>
                  {JOB_TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Experience Level *</label>
                <select className="form-control" name="experienceLevel" value={form.experienceLevel} onChange={handleChange}>
                  {EXP_LEVELS.map((l) => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Location *</label>
              <input className="form-control" name="location" value={form.location} onChange={handleChange} required placeholder="New York, NY or Remote" />
            </div>

            {/* Salary */}
            <div>
              <h3 className="mb-4">Salary Range (optional)</h3>
              <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                <select className="form-control" name="salary.currency" value={form.salary.currency} onChange={handleChange} style={{ width: "100px" }}>
                  {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                <input className="form-control" name="salary.min" type="number" value={form.salary.min} onChange={handleChange} placeholder="Min salary" style={{ flex: 1 }} />
                <span style={{ color: "var(--text-muted)" }}>—</span>
                <input className="form-control" name="salary.max" type="number" value={form.salary.max} onChange={handleChange} placeholder="Max salary" style={{ flex: 1 }} />
              </div>
            </div>

            {/* Skills */}
            <div className="form-group">
              <label className="form-label">Required Skills</label>
              <SkillsInput skills={skills} setSkills={setSkills} />
              <p className="form-hint">Press Enter or comma to add each skill</p>
            </div>

            {/* Description */}
            <h3>Job Details</h3>

            <div className="form-group">
              <label className="form-label">Job Description *</label>
              <textarea
                className="form-control"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={7}
                placeholder="Describe the role, responsibilities, and what a typical day looks like..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Requirements</label>
              <textarea
                className="form-control"
                name="requirements"
                value={form.requirements}
                onChange={handleChange}
                rows={5}
                placeholder="List education, years of experience, certifications required..."
              />
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? "Posting..." : "🚀 Publish Job"}
              </button>
              <button type="button" className="btn btn-ghost btn-lg" onClick={() => navigate("/dashboard")}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
