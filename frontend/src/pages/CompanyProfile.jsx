/**
 * pages/CompanyProfile.jsx
 * Recruiter's company profile creation and management.
 */

import { useState, useEffect, useRef } from "react";
import API from "../api/axios";
import Spinner from "../components/Spinner";

const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "500+"];

const CompanyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const logoRef = useRef();

  const [form, setForm] = useState({
    companyName: "",
    website: "",
    industry: "",
    companySize: "",
    description: "",
    headquarters: "",
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get("/recruiter/profile");
        if (data.profile) {
          setProfile(data.profile);
          setForm({
            companyName: data.profile.companyName || "",
            website: data.profile.website || "",
            industry: data.profile.industry || "",
            companySize: data.profile.companySize || "",
            description: data.profile.description || "",
            headquarters: data.profile.headquarters || "",
          });
        }
      } catch { /* ignore */ }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: "", text: "" });
    try {
      let data;
      if (profile) {
        ({ data } = await API.put("/recruiter/profile", form));
      } else {
        ({ data } = await API.post("/recruiter/profile", form));
      }
      setProfile(data.profile);
      setMsg({ type: "success", text: "Company profile saved! ✓" });
    } catch (err) {
      setMsg({ type: "danger", text: err.response?.data?.message || "Save failed." });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("logo", file);
    setUploading(true);
    try {
      const { data } = await API.post("/recruiter/logo", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile((p) => ({ ...p, companyLogo: data.companyLogo }));
      setMsg({ type: "success", text: "Logo uploaded! ✓" });
    } catch {
      setMsg({ type: "danger", text: "Logo upload failed." });
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <Spinner fullPage />;

  const logoUrl = profile?.companyLogo?.url;
  const initial = (form.companyName || "C")[0].toUpperCase();

  return (
    <div className="section">
      <div className="container-sm">
        <h1 className="mb-2">Company Profile</h1>
        <p className="text-secondary mb-8">
          Build a compelling company profile to attract the best talent.
        </p>

        {msg.text && (
          <div className={`alert alert-${msg.type} mb-6`}>{msg.text}</div>
        )}

        {/* Logo */}
        <div className="card mb-6" style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          {logoUrl ? (
            <img src={logoUrl} alt="Company Logo" style={{ width: 80, height: 80, borderRadius: "var(--radius-md)", objectFit: "cover" }} />
          ) : (
            <div style={{
              width: 80, height: 80, borderRadius: "var(--radius-md)",
              background: "linear-gradient(135deg, var(--primary), var(--secondary))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2rem", fontWeight: 700, color: "white"
            }}>
              {initial}
            </div>
          )}
          <div>
            <h4 className="mb-1">{form.companyName || "Your Company"}</h4>
            <p className="text-sm text-secondary mb-2">Upload your company logo (JPG, PNG, WebP)</p>
            {profile ? (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => logoRef.current.click()}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Change Logo"}
              </button>
            ) : (
              <p className="text-xs text-muted">Save profile first to upload logo</p>
            )}
            <input ref={logoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleLogoUpload} />
          </div>
        </div>

        {/* Form */}
        <div className="card">
          <h3 className="mb-6">Company Details</h3>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="form-group">
              <label className="form-label">Company Name *</label>
              <input className="form-control" name="companyName" value={form.companyName} onChange={handleChange} required placeholder="Acme Corporation" />
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Website</label>
                <input className="form-control" name="website" value={form.website} onChange={handleChange} placeholder="https://yourcompany.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Industry</label>
                <input className="form-control" name="industry" value={form.industry} onChange={handleChange} placeholder="Technology, Finance..." />
              </div>
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Company Size</label>
                <select className="form-control" name="companySize" value={form.companySize} onChange={handleChange}>
                  <option value="">Select size</option>
                  {COMPANY_SIZES.map((s) => <option key={s} value={s}>{s} employees</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Headquarters</label>
                <input className="form-control" name="headquarters" value={form.headquarters} onChange={handleChange} placeholder="City, Country" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Company Description</label>
              <textarea
                className="form-control"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                placeholder="Tell candidates about your company culture, mission, and values..."
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start" }} disabled={saving}>
              {saving ? "Saving..." : profile ? "Update Profile" : "Create Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
