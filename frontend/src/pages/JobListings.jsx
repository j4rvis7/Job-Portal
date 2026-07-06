/**
 * pages/JobListings.jsx
 * Browse all open jobs with search and filter sidebar.
 */

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/axios";
import JobCard from "../components/JobCard";
import Spinner from "../components/Spinner";

const JOB_TYPES = ["full-time", "part-time", "contract", "internship", "remote"];
const EXP_LEVELS = ["entry", "mid", "senior", "lead", "executive"];

const JobListings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [expLevel, setExpLevel] = useState("");
  const [page, setPage] = useState(1);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (location) params.set("location", location);
      if (jobType) params.set("jobType", jobType);
      if (expLevel) params.set("experienceLevel", expLevel);
      params.set("page", page);
      params.set("limit", 9);

      const { data } = await API.get(`/jobs?${params.toString()}`);
      setJobs(data.jobs);
      setTotal(data.total);
      setPages(data.pages);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [search, location, jobType, expLevel, page]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setJobType("");
    setExpLevel("");
    setPage(1);
  };

  return (
    <div className="section">
      <div className="container">
        {/* Page header */}
        <div className="mb-8">
          <h1>Find Your Next Role</h1>
          <p className="mt-2">
            {total > 0 ? `${total} jobs found` : "Search and filter to find the perfect job"}
          </p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
          <input
            id="jobs-search"
            className="form-control"
            type="text"
            placeholder="Search job title, skill, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1 }}
          />
          <input
            id="jobs-location"
            className="form-control"
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{ width: "200px" }}
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>

        <div className="jobs-layout">
          {/* ── Filter Sidebar ── */}
          <aside className="filter-sidebar">
            <h3>🔧 Filters</h3>

            <div className="filter-section">
              <h4>Job Type</h4>
              {JOB_TYPES.map((t) => (
                <label key={t} className="filter-option">
                  <input
                    type="radio"
                    name="jobType"
                    value={t}
                    checked={jobType === t}
                    onChange={() => { setJobType(t); setPage(1); }}
                  />
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </label>
              ))}
              {jobType && (
                <button
                  className="btn btn-ghost btn-sm mt-2"
                  onClick={() => { setJobType(""); setPage(1); }}
                >
                  Clear
                </button>
              )}
            </div>

            <div className="filter-section">
              <h4>Experience Level</h4>
              {EXP_LEVELS.map((l) => (
                <label key={l} className="filter-option">
                  <input
                    type="radio"
                    name="expLevel"
                    value={l}
                    checked={expLevel === l}
                    onChange={() => { setExpLevel(l); setPage(1); }}
                  />
                  {l.charAt(0).toUpperCase() + l.slice(1)}
                </label>
              ))}
              {expLevel && (
                <button
                  className="btn btn-ghost btn-sm mt-2"
                  onClick={() => { setExpLevel(""); setPage(1); }}
                >
                  Clear
                </button>
              )}
            </div>

            <button className="btn btn-ghost btn-full mt-4" onClick={clearFilters}>
              Reset All Filters
            </button>
          </aside>

          {/* ── Job Grid ── */}
          <div>
            {loading ? (
              <Spinner />
            ) : jobs.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No jobs found</h3>
                <p>Try adjusting your search terms or filters.</p>
                <button className="btn btn-primary" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {jobs.map((job) => (
                    <JobCard key={job._id} job={job} />
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      ‹
                    </button>
                    {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={page === p ? "active" : ""}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage((p) => Math.min(pages, p + 1))}
                      disabled={page === pages}
                    >
                      ›
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListings;
