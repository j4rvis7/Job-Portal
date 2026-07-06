/**
 * pages/EditJob.jsx
 * Prefills the job form for editing an existing job posting.
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import Spinner from "../components/Spinner";

const JOB_TYPES  = ["full-time", "part-time", "contract", "internship", "remote"];
const EXP_LEVELS = ["entry", "mid", "senior", "lead", "executive"];
const CURRENCIES = ["USD", "EUR", "GBP", "INR", "CAD", "AUD"];

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
        placeholder="Add skill, press Enter"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } }}
      />
    </div>
  );
};

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");
  const [skills, setSkills]   = useState([]);

  const [form, setForm] = useState({
    title: "", description: "", requirements: "", location: "",
    jobType: "full-time", experienceLevel: "entry",
    salary: { min: "", max: "", currency: "USD" },
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get(`/jobs/${id}`);
        const j = data.job;
        setForm({
          title: j.title,
          description: j.description,
          requirements: j.requirements || "",
          location: j.location,
          jobType: j.jobType,
          experienceLevel: j.experienceLevel,
          salary: {
            min: j.salary?.min || "",
            max: j.salary?.max || "",
            currency: j.salary?.currency || "USD",
          },
        });
        setSkills(j.skills || []);
      } catch {
        setError("Job not found.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

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
    setSaving(true);
    setError("");
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
      await API.put(`/jobs/${id}`, payload);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner fullPage />;
  if (error && !form.title) return <div className="section container"><div className="alert alert-danger">{error}</div></div>;

  return (
    <div className="section">
      <div className="container-sm">
        <div className="mb-8">
          <h1>Edit Job Posting</h1>
          <p className="text-secondary mt-2">Update the details for your job posting.</p>
        </div>

        {error && <div className="alert alert-danger mb-6">⚠️ {error}</div>}

        <div className="card">
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <h3>Basic Information</h3>

            <div className="form-group">
              <label className="form-label">Job Title *</label>
              <input className="form-control" name="title" value={form.title} onChange={handleChange} required />
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
              <input className="form-control" name="location" value={form.location} onChange={handleChange} required />
            </div>

            <div>
              <h3 className="mb-4">Salary Range</h3>
              <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                <select className="form-control" name="salary.currency" value={form.salary.currency} onChange={handleChange} style={{ width: "100px" }}>
                  {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                <input className="form-control" name="salary.min" type="number" value={form.salary.min} onChange={handleChange} placeholder="Min" style={{ flex: 1 }} />
                <span style={{ color: "var(--text-muted)" }}>—</span>
                <input className="form-control" name="salary.max" type="number" value={form.salary.max} onChange={handleChange} placeholder="Max" style={{ flex: 1 }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Skills</label>
              <SkillsInput skills={skills} setSkills={setSkills} />
            </div>

            <h3>Job Details</h3>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea className="form-control" name="description" value={form.description} onChange={handleChange} required rows={7} />
            </div>

            <div className="form-group">
              <label className="form-label">Requirements</label>
              <textarea className="form-control" name="requirements" value={form.requirements} onChange={handleChange} rows={5} />
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
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

export default EditJob;
