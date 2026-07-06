/**
 * components/Footer.jsx
 */

import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="navbar-brand">
              <div className="brand-icon">💼</div>
              Job<span>Portal</span>
            </div>
            <p>
              Connecting talented professionals with great companies.
              Find your dream job or hire top talent today.
            </p>
          </div>

          <div className="footer-col">
            <h4>For Job Seekers</h4>
            <ul>
              <li><Link to="/jobs">Browse Jobs</Link></li>
              <li><Link to="/register">Create Profile</Link></li>
              <li><Link to="/my-applications">My Applications</Link></li>
              <li><Link to="/saved-jobs">Saved Jobs</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>For Recruiters</h4>
            <ul>
              <li><Link to="/post-job">Post a Job</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/company-profile">Company Profile</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><Link to="/">About Us</Link></li>
              <li><Link to="/">Contact</Link></li>
              <li><Link to="/">Privacy Policy</Link></li>
              <li><Link to="/">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} JobPortal. All rights reserved.</span>
          <span>Built with React + Node.js + MongoDB</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
