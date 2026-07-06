/**
 * pages/Home.jsx
 * Landing page with hero, search, stats, and featured jobs.
 */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${encodeURIComponent(searchQuery)}`);
  };

  const categories = [
    { icon: "💻", title: "Technology", count: "1,240+ jobs" },
    { icon: "📊", title: "Finance", count: "780+ jobs" },
    { icon: "🏥", title: "Healthcare", count: "620+ jobs" },
    { icon: "🎨", title: "Design", count: "450+ jobs" },
    { icon: "📣", title: "Marketing", count: "390+ jobs" },
    { icon: "⚙️", title: "Engineering", count: "870+ jobs" },
  ];

  const steps = [
    { step: "01", icon: "👤", title: "Create Profile", desc: "Sign up and build your professional profile in minutes." },
    { step: "02", icon: "🔍", title: "Search Jobs", desc: "Browse thousands of jobs with powerful search and filters." },
    { step: "03", icon: "📝", title: "Apply Easily", desc: "One-click apply with your uploaded resume." },
    { step: "04", icon: "🚀", title: "Get Hired", desc: "Track your applications and land your dream job." },
  ];

  return (
    <>
      {/* ── Hero ────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />

        <div className="container hero-content">
          <div className="hero-badge">
            <span>✨</span> Over 10,000 jobs available right now
          </div>

          <h1>Find Your Dream<br />Career Today</h1>

          <p>
            Connect with top companies hiring now. Search thousands of jobs,
            upload your resume, and start your next chapter.
          </p>

          {/* Search bar */}
          <form className="hero-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Job title, skills, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="hero-search-input"
            />
            <button type="submit" className="btn btn-primary">
              🔍 Search
            </button>
          </form>

          {/* Stats */}
          <div className="hero-stats">
            <div>
              <div className="hero-stat-number">10K+</div>
              <div className="hero-stat-label">Jobs Posted</div>
            </div>
            <div>
              <div className="hero-stat-number">5K+</div>
              <div className="hero-stat-label">Companies</div>
            </div>
            <div>
              <div className="hero-stat-number">50K+</div>
              <div className="hero-stat-label">Candidates</div>
            </div>
            <div>
              <div className="hero-stat-number">98%</div>
              <div className="hero-stat-label">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Job Categories ───────────────────────────── */}
      <section className="section" style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border-light)" }}>
        <div className="container">
          <div className="text-center mb-8">
            <h2>Browse by Category</h2>
            <p className="mt-2">Explore opportunities across top industries</p>
          </div>

          <div className="grid grid-3">
            {categories.map((cat, i) => (
              <Link
                key={i}
                to={`/jobs?search=${cat.title}`}
                style={{ textDecoration: "none" }}
              >
                <div className="card" style={{ textAlign: "center", cursor: "pointer" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>{cat.icon}</div>
                  <h4 style={{ marginBottom: "4px" }}>{cat.title}</h4>
                  <span className="badge badge-primary">{cat.count}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-8">
            <h2>How It Works</h2>
            <p className="mt-2">Get hired in four simple steps</p>
          </div>

          <div className="grid grid-4">
            {steps.map((s, i) => (
              <div key={i} style={{ textAlign: "center", padding: "24px" }}>
                <div style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: "var(--primary-light)",
                  letterSpacing: "0.15em",
                  marginBottom: "16px"
                }}>
                  STEP {s.step}
                </div>
                <div style={{
                  width: "64px",
                  height: "64px",
                  background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                  borderRadius: "var(--radius-lg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.8rem",
                  margin: "0 auto 16px",
                }}>
                  {s.icon}
                </div>
                <h4 style={{ marginBottom: "8px" }}>{s.title}</h4>
                <p style={{ fontSize: "0.875rem" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────── */}
      {!user && (
        <section className="section" style={{
          background: "linear-gradient(135deg, rgba(108,99,255,0.15), rgba(255,101,132,0.1))",
          borderTop: "1px solid var(--border-light)",
          borderBottom: "1px solid var(--border-light)"
        }}>
          <div className="container text-center">
            <h2>Ready to Get Started?</h2>
            <p className="mt-2 mb-6">
              Join thousands of professionals who found their dream jobs through JobPortal.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/register" className="btn btn-primary btn-lg">
                🚀 Create Free Account
              </Link>
              <Link to="/jobs" className="btn btn-ghost btn-lg">
                Browse Jobs
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Home;
