# 💼 JobPortal — Full Stack MERN Job Portal

A production-ready, full-stack Job Portal application built following **Colt Steele's Web Developer Bootcamp** patterns. Job seekers can search, filter, and apply for jobs. Recruiters can post, manage, and review applicants — all with session-based authentication.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite, React Router, Axios, Plain CSS |
| Backend | Node.js, Express.js (MVC architecture) |
| Database | MongoDB + Mongoose |
| Auth | Passport.js + passport-local-mongoose + express-session |
| File Upload | Multer + Cloudinary |
| Validation | JOI + Express middleware |
| Session Store | connect-mongo (MongoDB) |

---

## 📁 Folder Structure

```
job-portal/
├── backend/
│   ├── config/          # passport.js, db.js
│   ├── controllers/     # authController, userController, jobController, etc.
│   ├── middleware/      # isLoggedIn, isRecruiter, validateBody, etc.
│   ├── models/          # User, RecruiterProfile, Job, Application
│   ├── routes/          # authRoutes, jobRoutes, applicationRoutes, etc.
│   ├── utils/           # AppError, asyncWrapper, cloudinary
│   ├── validations/     # JOI schemas
│   ├── app.js           # Express app
│   ├── server.js        # Entry point
│   └── .env.example
│
└── frontend/
    └── src/
        ├── api/         # axios.js
        ├── components/  # Navbar, Footer, Spinner, JobCard, ProtectedRoute
        ├── context/     # AuthContext.jsx
        └── pages/       # Home, Login, Register, JobListings, JobDetail, ...
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free)
- Cloudinary account (free)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/job-portal.git
cd job-portal
```

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values (see below)
npm run dev
```

### 3. Setup Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Fill in VITE_API_URL
npm run dev
```

The app will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api

---

## 🔧 Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/jobportal
SESSION_SECRET=your_super_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📡 API Endpoints

### Auth (`/api/auth`)
| Method | Route | Description |
|--------|-------|-------------|
| POST | /register | Register user |
| POST | /login | Login |
| POST | /logout | Logout |
| GET | /me | Get current user |

### Jobs (`/api/jobs`)
| Method | Route | Description |
|--------|-------|-------------|
| GET | / | List jobs (with filters) |
| GET | /:id | Get single job |
| POST | / | Create job (Recruiter) |
| PUT | /:id | Update job (Owner) |
| DELETE | /:id | Delete job (Owner) |
| PATCH | /:id/toggle-status | Open/Close job |
| GET | /my-jobs | Recruiter's jobs |
| GET | /:id/applicants | Job applicants |

### Applications (`/api/applications`)
| Method | Route | Description |
|--------|-------|-------------|
| POST | /:jobId | Apply for job |
| GET | /my-applications | My applications |
| DELETE | /:id/withdraw | Withdraw |
| PATCH | /:id/status | Update status (Recruiter) |

---

## 📦 Deployment

### Backend → Render / Railway

1. Push `backend/` to GitHub
2. Create a new Web Service on Render
3. Set build command: `npm install`
4. Set start command: `node server.js`
5. Add all environment variables from `.env`

### Frontend → Vercel

1. Push `frontend/` to GitHub
2. Import to Vercel
3. Set `VITE_API_URL` to your Render backend URL
4. Deploy

> **Important**: Update `CLIENT_URL` in your backend `.env` to your Vercel domain, and set `NODE_ENV=production`.

---

## ✨ Features

### Job Seekers
- ✅ Register / Login / Logout
- ✅ Create & Edit Profile
- ✅ Upload Resume (Cloudinary)
- ✅ Browse & Search Jobs
- ✅ Filter by Type, Experience, Location
- ✅ Apply with Cover Letter
- ✅ Track Application Status
- ✅ Withdraw Applications
- ✅ Save/Bookmark Jobs

### Recruiters
- ✅ Company Profile with Logo
- ✅ Post, Edit, Delete Jobs
- ✅ Open/Close Job Listings
- ✅ View All Applicants
- ✅ Accept / Reject / Review Applications
- ✅ Dashboard with Stats

---

## 🔒 Security

- Passwords hashed using `passport-local-mongoose` (pbkdf2 with salt)
- Sessions stored in MongoDB (connect-mongo)
- `HttpOnly` cookies for session management
- CORS restricted to frontend origin
- JOI validation on all inputs
- Role-based middleware on all protected routes

---

## 📝 License

MIT License — free to use and modify.
