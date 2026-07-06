/**
 * pages/NotFound.jsx
 * 404 page shown for unmatched routes.
 */

import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "24px",
      background: "radial-gradient(ellipse at center, rgba(108, 99, 255, 0.1) 0%, var(--bg-dark) 70%)"
    }}>
      <div>
        <div style={{
          fontSize: "8rem",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 800,
          background: "linear-gradient(135deg, var(--primary), var(--secondary))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          lineHeight: 1,
          marginBottom: "16px",
        }}>
          404
        </div>
        <h2 style={{ marginBottom: "12px" }}>Page Not Found</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "32px", maxWidth: "400px", margin: "0 auto 32px" }}>
          Oops! The page you&apos;re looking for doesn&apos;t exist. It might have been moved or deleted.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/" className="btn btn-primary btn-lg">🏠 Go Home</Link>
          <Link to="/jobs" className="btn btn-ghost btn-lg">Browse Jobs</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
