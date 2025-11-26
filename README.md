# Job Portal - Complete Setup Guide

A full-stack job portal application with **React frontend** and **Express backend**, featuring a unique **Dual Mode** that lets you switch between simulated API (localStorage) and real backend API.

---

## 📋 Project Overview

**Job Portal** is a modern job search and recruiter platform with:

- ✅ Browse and search jobs
- ✅ Apply for jobs with CV upload
- ✅ Recruiter dashboard to post jobs
- ✅ View and manage applications
- ✅ User authentication (Clerk)
- ✅ Dual Mode API (simulated or real backend)
- ✅ Responsive design (Tailwind CSS)
- ✅ Rwanda-only job locations

---

## 🚀 Quick Start

### Option 1: Simulated API (Easiest) 💾

**No backend needed. Perfect for quick development!**

```bash
cd client
npm run dev
```

Open: **http://localhost:5173**

✅ Works offline
✅ Data in browser localStorage
✅ Instant startup

---

### Option 2: Real Backend 🌐

**Full production-like setup with backend persistence.**

**Terminal 1 - Backend:**
```bash
cd server
npm start
```
✓ Runs on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
✓ Runs on http://localhost:5173 (or next available port)

Then update `client/.env.local`:
```bash
VITE_USE_REAL_API=true
```

---

## 📁 Project Structure

```
job-portal/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/              # React components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── JobLIsting.jsx
│   │   │   ├── JobCard.jsx
│   │   │   ├── ApplyModal.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── ...more components
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── AddJob.jsx
│   │   │   ├── Applications.jsx
│   │   │   ├── ManageJobs.jsx
│   │   │   └── ...more pages
│   │   ├── context/                 # State management
│   │   │   └── AppContext.jsx       # Global app context with dual mode
│   │   ├── utils/                   # Utilities
│   │   │   └── apiClient.js         # Dual mode API router
│   │   ├── assets/                  # Images, icons, data
│   │   │   └── assets.js            # Static job data
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── .env.local                   # Environment variables
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── server/                          # Express Backend
│   ├── db/                          # Database abstraction layer
│   │   ├── index.js                 # Core utilities & helpers
│   │   ├── jobs.js                  # Jobs CRUD operations
│   │   ├── applications.js          # Applications CRUD operations
│   │   └── users.js                 # Users CRUD operations
│   ├── data/                        # JSON data storage
│   │   ├── jobs.json                # Jobs database
│   │   ├── applications.json        # Applications database
│   │   └── users.json               # Users database
│   ├── server.js                    # Express server & API routes
│   ├── .env                         # Server configuration
│   ├── package.json
│   └── DB_ARCHITECTURE.md           # Database documentation
│
├── .git/                            # Git repository
├── README.md                        # This file
├── DUAL_MODE_SETUP.md               # Dual mode detailed guide
├── MODE_SWITCHING_GUIDE.md          # How to switch between modes
├── JOBS_CARDS_FIX.md                # Job cards loading fix
└── .gitignore
```

---

## 🔧 Technology Stack

### Frontend
- **React 19** - UI framework
- **Vite 7** - Build tool
- **React Router v7** - Navigation
- **Tailwind CSS** - Styling
- **Clerk** - Authentication
- **Quill 2.0** - Rich text editor
- **React Toastify** - Notifications
- **Moment.js** - Date formatting

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **JSON Files** - Data storage
- **CORS** - Cross-origin requests
- **dotenv** - Environment variables

---

## 🎯 Dual Mode Feature

The app can run in two modes:

### Mode 1: Simulated API 💾
Uses browser **localStorage** with simulated network delays.

```bash
# .env.local
VITE_USE_REAL_API=false
```

- No backend needed
- Works offline
- Perfect for development
- Data in browser

### Mode 2: Real Backend 🌐
Uses actual **Express backend** with JSON file storage.

```bash
# .env.local
VITE_USE_REAL_API=true
```

- Backend required
- Production-like
- Persistent data to disk
- Full CRUD operations

**See `DUAL_MODE_SETUP.md` for detailed guide.**

---

## ⚙️ Configuration

### Frontend (.env.local)

```bash
# Clerk authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Dual Mode
VITE_USE_REAL_API=false                    # false or true
VITE_API_URL=http://localhost:5000/api     # Backend URL

# Simulation
VITE_FAKE_API_DELAY=300                    # Network delay in ms
```

### Backend (.env)

```bash
# Server
PORT=5000

# Database (currently JSON files)
DATABASE_TYPE=json
```

---

## 🗄️ Database

### Storage Type: JSON Files

Data is stored in `/server/data/`:

```
/data/
├── jobs.json              # Job listings
├── applications.json      # Job applications
└── users.json             # User accounts
```

### Database Layer (server/db/)

Clean abstraction for all database operations:

- **db/index.js** - Core utilities
- **db/jobs.js** - Job CRUD
- **db/applications.js** - Application CRUD
- **db/users.js** - User CRUD

Easy to migrate to MongoDB/PostgreSQL - just update these files!

---

## 🔌 API Endpoints

### Available in Real Backend Mode

```
GET    /api/jobs                  - Get all jobs
GET    /api/applications          - Get all applications
POST   /api/applications          - Create application
PUT    /api/applications/:id      - Update application
DELETE /api/applications/:id      - Delete application
GET    /api/users                 - Get all users
```

---

## 👥 Features

### For Job Seekers
- ✅ Browse jobs with filters
- ✅ Search by title and location
- ✅ Apply for jobs
- ✅ Upload CV/Resume
- ✅ Manage applications
- ✅ View application status

### For Recruiters
- ✅ Post new job listings
- ✅ View job applications
- ✅ Manage posted jobs
- ✅ View applicant details
- ✅ Update application status

### Authentication
- ✅ Clerk OAuth integration
- ✅ Recruiter email/password
- ✅ Per-user data isolation
- ✅ Logout functionality

---

## 📊 Data

### Job Locations (Rwanda Only)
- Kigali
- Huye
- Butare
- Muhanga
- Gitarama
- Ruhengeri
- Musanze

### Job Categories
- IT
- Engineering
- Sales
- Marketing
- HR
- Finance

---

## 🚀 Running the Application

### Prerequisites

```bash
# Node.js 16+ required
node --version
npm --version
```

### Installation

```bash
# Frontend
cd client
npm install

# Backend
cd server
npm install
```

### Start Development

#### Simulated Mode (Fastest)
```bash
cd client
npm run dev
# Opens http://localhost:5173
```

#### Real Backend Mode
```bash
# Terminal 1
cd server
npm start

# Terminal 2
cd client
npm run dev
```

---

## 🔍 Console Debugging

When running, check browser console for API activity:

**Simulated Mode:**
```
💾 [14:23:45] (Simulated) GET /jobs
✓ Jobs loaded: 5
```

**Real Backend Mode:**
```
📡 [14:23:45] GET /jobs
✓ Jobs received: 5
```

---

## 🛠️ Development

### Frontend Only

```bash
cd client
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview build
npm run lint         # ESLint check
```

### Backend Only

```bash
cd server
npm start            # Start server
```

---

## 📚 Documentation

- **DUAL_MODE_SETUP.md** - Complete dual mode guide
- **MODE_SWITCHING_GUIDE.md** - How to switch modes
- **JOBS_CARDS_FIX.md** - Job cards loading explanation
- **server/DB_ARCHITECTURE.md** - Database layer documentation

---

## 🐛 Troubleshooting

### Jobs not showing?
```bash
# Check console for errors
# Simulated mode: Should show static jobs
# Real mode: Check if backend is running
```

### Port already in use?
```bash
# Kill existing process
lsof -ti:5173 | xargs kill -9  # Frontend
lsof -ti:5000 | xargs kill -9  # Backend
```

### Can't connect to backend?
```bash
# Verify backend is running
curl http://localhost:5000/

# Check VITE_USE_REAL_API=true in .env.local
# Check VITE_API_URL is correct
```

### Clear data?
```bash
# Simulated mode: Clear browser localStorage
# Real mode: Delete /server/data/*.json files
```

---

## 🔄 Switching Between Modes

### Current Mode?
Check `/client/.env.local`:
```bash
VITE_USE_REAL_API=false  # Simulated
# or
VITE_USE_REAL_API=true   # Real Backend
```

### To Switch
1. Edit `client/.env.local`
2. Restart frontend: `npm run dev`
3. Done!

**See MODE_SWITCHING_GUIDE.md for detailed instructions.**

---

## 📦 File Sizes

- Frontend bundle: ~500KB
- Backend: ~2MB (with node_modules)
- Database: ~50KB (JSON files)

---

## 🎓 Learning Resources

- React: https://react.dev
- Vite: https://vitejs.dev
- Express: https://expressjs.com
- Tailwind CSS: https://tailwindcss.com
- Clerk: https://clerk.com

---

## 📝 Notes

- All locations are Rwanda cities only
- Data persists based on mode (localStorage or JSON files)
- No switching between modes during session (requires restart)
- Backend can be easily migrated to real database
- Mobile responsive design

---

## 🚀 Deployment

### Frontend (Vercel, Netlify, etc.)
```bash
cd client
npm run build
# Deploy dist/ folder
```

### Backend (Heroku, Railway, etc.)
```bash
cd server
# Deploy with npm start command
```

Set environment variables on hosting platform!

---

## 📞 Support

**Issues?**
1. Check console for errors (F12)
2. Review documentation files
3. Verify configuration in .env files
4. Check if services are running

---

## ✨ Features Summary

| Feature | Status |
|---------|--------|
| Job Listings | ✅ Complete |
| Search & Filter | ✅ Complete |
| Job Applications | ✅ Complete |
| CV Upload | ✅ Complete |
| Recruiter Dashboard | ✅ Complete |
| Authentication | ✅ Complete |
| Dual Mode API | ✅ Complete |
| Database Layer | ✅ Complete |
| Responsive Design | ✅ Complete |
| Documentation | ✅ Complete |

---

## 🎉 Ready to Go!

Everything is set up and ready to use:

```bash
# Quick start (simulated mode)
cd client && npm run dev

# Then open http://localhost:5173
```

Enjoy building! 🚀

---

**Last Updated:** November 26, 2025
**Version:** 1.0.0
