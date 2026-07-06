/**
 * pages/Profile.jsx
 * User profile page — works for both jobseekers and recruiters.
 * Allows editing profile info, skills, and uploading avatar/resume.
 */

import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import API from "../api/axios";

const SkillsInput = ({ skills, setSkills }) => {
  const [input, setInput] = useState("");

  const addSkill = () => {
    const s = input.trim();
    if (s && !skills.includes(s) && skills.length < 20) {
      setSkills([...skills, s]);
      setInput("");
    }
  };

  const removeSkill = (s) => setSkills(skills.filter((sk) => sk !== s));

  return (
    <div className="skills-input-container">
      {skills.map((s) => (
        <span key={s} className="skill-tag-item">
          {s}
          <button type="button" onClick={() => removeSkill(s)}>✕</button>
        </span>
      ))}
      <input
        type="text"
        placeholder="Add a skill, press Enter"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") { e.preventDefault(); addSkill(); }
          if (e.key === "," || e.key === "Tab") { e.preventDefault(); addSkill(); }
        }}
      />
    </div>
  );
};

const Profile = () => {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    location: user?.location || "",
    bio: user?.bio || "",
  });
  const [skills, setSkills] = useState(user?.skills || []);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const [uploading, setUploading] = useState(false);
  const resumeRef = useRef();
  const avatarRef = useRef();

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: "", text: "" });
    try {
      const { data } = await API.put("/users/profile", { ...form, skills });
      updateUser(data.user);
      setMsg({ type: "success", text: "Profile updated! ✓" });
    } catch (err) {
      setMsg({ type: "danger", text: err.response?.data?.message || "Update failed." });
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("resume", file);
    setUploading(true);
    try {
      const { data } = await API.post("/users/resume", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateUser({ resume: data.resume });
      setMsg({ type: "success", text: "Resume uploaded! ✓" });
    } catch (err) {
      setMsg({ type: "danger", text: err.response?.data?.message || "Upload failed." });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!confirm("Delete your resume?")) return;
    try {
      await API.delete("/users/resume");
      updateUser({ resume: { url: "", publicId: "", filename: "" } });
      setMsg({ type: "success", text: "Resume deleted." });
    } catch {
      setMsg({ type: "danger", text: "Failed to delete resume." });
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("avatar", file);
    setUploading(true);
    try {
      const { data } = await API.post("/users/avatar", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateUser({ avatar: data.avatar });
      setMsg({ type: "success", text: "Avatar updated! ✓" });
    } catch {
      setMsg({ type: "danger", text: "Avatar upload failed." });
    } finally {
      setUploading(false);
    }
  };

  const initial = (user?.name || "U")[0].toUpperCase();

  return (
    <div className="section">
      <div className="container-sm">
        <h1 className="mb-2">My Profile</h1>
        <p className="mb-8 text-secondary">Keep your profile updated to get the best opportunities.</p>

        {msg.text && (
          <div className={`alert alert-${msg.type} mb-6`}>
            {msg.text}
          </div>
        )}

        {/* Profile header */}
        <div className="profile-header">
          {/* Avatar */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            {user?.avatar?.url ? (
              <img src={user.avatar.url} alt={user.name} className="profile-avatar" />
            ) : (
              <div className="profile-avatar">{initial}</div>
            )}
            <button
              title="Change avatar"
              onClick={() => avatarRef.current.click()}
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "var(--primary)",
                border: "2px solid var(--bg-dark)",
                color: "white",
                cursor: "pointer",
                fontSize: "0.85rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✏️
            </button>
            <input
              ref={avatarRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAvatarUpload}
            />
          </div>

          <div>
            <h2>{user?.name}</h2>
            <p style={{ color: "var(--text-secondary)", margin: "4px 0" }}>{user?.email}</p>
            <span className={`badge ${user?.role === "recruiter" ? "badge-warning" : "badge-primary"}`}>
              {user?.role === "recruiter" ? "🏢 Recruiter" : "👤 Job Seeker"}
            </span>
          </div>
        </div>

        {/* Edit form */}
        <div className="card mb-6">
          <h3 className="mb-6">Edit Profile</h3>
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-control" name="name" value={form.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-control" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 234 567 890" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input className="form-control" name="location" value={form.location} onChange={handleChange} placeholder="City, Country" />
            </div>
            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea className="form-control" name="bio" value={form.bio} onChange={handleChange} placeholder="Tell employers about yourself..." rows={4} />
            </div>

            {user?.role === "jobseeker" && (
              <div className="form-group">
                <label className="form-label">Skills (press Enter to add)</label>
                <SkillsInput skills={skills} setSkills={setSkills} />
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start" }} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Resume upload (job seekers only) */}
        {user?.role === "jobseeker" && (
          <div className="card mb-6">
            <h3 className="mb-2">Resume</h3>
            <p className="text-secondary text-sm mb-4">Upload your resume (PDF, DOC, DOCX — max 5MB). It will be used when you apply for jobs.</p>

            {user?.resume?.url ? (
              <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                <div className="card-glass" style={{ padding: "12px 20px", flex: 1, display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "1.5rem" }}>📄</span>
                  <div>
                    <p className="font-semibold text-sm">{user.resume.filename || "resume.pdf"}</p>
                    <a href={user.resume.url} target="_blank" rel="noreferrer" className="text-xs text-primary-color">
                      View / Download ↗
                    </a>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-secondary btn-sm" onClick={() => resumeRef.current.click()}>
                    Replace
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={handleDeleteResume}>
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="file-upload-area" onClick={() => resumeRef.current.click()}>
                <div style={{ fontSize: "2rem", marginBottom: "8px" }}>📤</div>
                <p className="font-semibold">Click to upload resume</p>
                <p className="text-sm text-muted mt-1">PDF, DOC, DOCX up to 5MB</p>
              </div>
            )}

            <input
              ref={resumeRef}
              type="file"
              accept=".pdf,.doc,.docx"
              style={{ display: "none" }}
              onChange={handleResumeUpload}
            />
            {uploading && <p className="text-sm text-secondary mt-2">Uploading...</p>}

            {user?.role === "recruiter" && (
              <div className="mt-4">
                <Link to="/company-profile" className="btn btn-primary btn-sm">
                  Manage Company Profile →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
