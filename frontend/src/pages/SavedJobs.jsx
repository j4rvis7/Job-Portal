/**
 * pages/SavedJobs.jsx
 * Displays jobs the user has bookmarked.
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import JobCard from "../components/JobCard";
import Spinner from "../components/Spinner";

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get("/users/saved-jobs");
        setSavedJobs(data.savedJobs);
      } catch {
        setSavedJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <Spinner fullPage />;

  return (
    <div className="section">
      <div className="container">
        <div className="mb-8">
          <h1>Saved Jobs</h1>
          <p className="mt-2 text-secondary">Jobs you&apos;ve bookmarked for later.</p>
        </div>

        {savedJobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔖</div>
            <h3>No saved jobs yet</h3>
            <p>Browse jobs and save ones you&apos;re interested in.</p>
            <Link to="/jobs" className="btn btn-primary mt-4">Browse Jobs</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {savedJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
