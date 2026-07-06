# JobPortal — Full-Stack MERN Application

A production-ready job portal web application built on the MERN stack (MongoDB, Express, React, Node.js). It connects job seekers looking for their next role with recruiters managing hiring pipelines, featuring role-based dashboards, secure session-based authentication, and cloud asset management.

### 🌐 Live Demo
**View the deployed app:** [https://job-portal-zeta-gray-69.vercel.app/](https://job-portal-zeta-gray-69.vercel.app/)

---

## 🏗️ Architecture & Engineering Highlights

This project follows classic RESTful API design and MVC architecture on the backend, paired with a modern Vite + React single-page application on the frontend.

* **Stateful, Secure Authentication:** Instead of storing stateless JWTs in `localStorage` (which is vulnerable to XSS attacks), this app implements server-side session management using `express-session`, `passport-local-mongoose`, and `connect-mongo`. Sessions are persisted in MongoDB and transmitted via secure, cross-domain `HttpOnly` cookies.
* **Production Proxy Handling:** Custom CORS and Express `trust proxy` configurations allow seamless communication between independent cloud hosts (Vercel for client, Render for API) while enforcing strict Origin checks and `SameSite=None; Secure` cookie attributes.
* **Strict Payload Validation:** Every incoming API request is validated at the routing layer using explicit **Joi** schemas before hitting the database controllers, preventing NoSQL injection and malformed document writes.
* **Cloud Asset Management:** Resume documents and company logos are handled via `multer` memory storage and directly streamed to **Cloudinary**, preventing server filesystem bloat.

---

## 💻 Tech Stack

**Frontend**
* **Framework:** React 18 (via Vite)
* **Routing:** React Router v6
* **HTTP Client:** Axios (configured with `withCredentials: true` for global cookie transport)
* **Styling:** Custom responsive CSS / CSS Modules

**Backend**
* **Runtime:** Node.js
* **Framework:** Express.js (MVC Pattern)
* **Database:** MongoDB Atlas with Mongoose ODM
* **Authentication:** Passport.js, express-session, connect-mongo
* **File Processing:** Multer, Cloudinary SDK
* **Validation & Error Handling:** Joi, Custom Async Error Boundary Middleware

---

## ✨ Key Features

### For Job Seekers
* **Profile & Resume Management:** Create a professional profile and upload PDF resumes directly to cloud storage.
* **Advanced Job Discovery:** Search active postings and filter by job type (Full-time, Remote, Internship), required experience, and location.
* **Application Tracking:** Apply to jobs with a tailored cover letter and track application progress (Pending, Reviewed, Accepted, Rejected) in real time from a dedicated user dashboard.
* **Job Bookmarking:** Save listings to review or apply to later.

### For Recruiters
* **Company Branding:** Set up a verified recruiter profile with company details and custom branding logos.
* **Listing Management:** Create, edit, and delete job postings. Toggle listings open or closed with a single click once positions are filled.
* **Applicant Review Pipeline:** View all incoming applications for a specific listing, review candidate resumes, and update application statuses directly from the recruiter dashboard.

---

## 🚀 Local Development Setup

### Prerequisites
* Node.js (v18 or higher)
* MongoDB Atlas account (or local MongoDB instance)
* Cloudinary account for media storage

### 1. Clone the repository
```bash
git clone [https://github.com/yourusername/job-portal.git](https://github.com/yourusername/job-portal.git)
cd job-portal