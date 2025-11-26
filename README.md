# JobGuaranteed - Job Portal Platform

A full-stack job portal application with **React 19 frontend** and **Express backend**, featuring a unique **Dual Mode** (simulated API or real backend).

---

## 📋 What is JobGuaranteed?

A modern job search platform with:
- ✅ Browse and search jobs
- ✅ Apply for jobs with CV upload
- ✅ Recruiter dashboard to post jobs
- ✅ View and manage applications
- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ Rwanda-only job locations

---

## 🛠️ Prerequisites

Before starting, ensure you have:

1. **Node.js 16+** and **npm 8+**
   ```bash
   node --version
   npm --version
   ```
   Install from: https://nodejs.org/

2. **Git** (optional, for cloning)
   ```bash
   git --version
   ```

3. **A code editor** (VS Code recommended)

---

## �� Quick Start (5 Minutes)

### Step 1: Clone & Navigate
```bash
git clone https://github.com/Tapiwanashe6/job-portal.git
cd JobGuaranteed
```

### Step 2: Install Dependencies

**Terminal 1 - Frontend:**
```bash
cd client
npm install
```

**Terminal 2 - Backend:**
```bash
cd server
npm install
```

### Step 3: Run the App

**Option A: Simulated Mode (No Backend) ⚡**
```bash
cd client
npm run dev
```
Open: **http://localhost:5173**

**Option B: Real Backend 🌐**

Terminal 1:
```bash
cd server
npm start
```

Terminal 2:
```bash
cd client
# Edit .env.local: VITE_USE_REAL_API=true
npm run dev
```

---

## 📁 Project Structure

```
JobGuaranteed/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── pages/           # Page components
│   │   ├── context/         # State management
│   │   ├── utils/           # Utilities
│   │   └── App.jsx          # Main app
│   ├── .env.local           # Frontend config
│   └── package.json
│
├── server/                    # Express Backend
│   ├── db/                   # Database layer (jobs, applications, users)
│   ├── data/                 # JSON storage (jobs.json, applications.json)
│   ├── server.js            # Express server
│   ├── .env                 # Backend config
│   └── package.json
│
└── README.md                 # This file
```

---

## ⚙️ Configuration

### Frontend: `client/.env.local`
```bash
# Clerk authentication (optional)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY

# Dual Mode
VITE_USE_REAL_API=false              # false=simulated, true=real backend
VITE_API_URL=http://localhost:5000/api
VITE_FAKE_API_DELAY=300              # Simulated network delay (ms)
```

### Backend: `server/.env`
```bash
PORT=5000
DATABASE_TYPE=json
```

---

## 🔄 Dual Mode Explained

### Mode 1: Simulated 💾
- No backend needed
- Data in browser localStorage
- Perfect for learning/testing
- **Set:** `VITE_USE_REAL_API=false`

### Mode 2: Real Backend 🌐
- Express backend required
- Data in JSON files (`/server/data/`)
- Production-like
- **Set:** `VITE_USE_REAL_API=true`

### Switch Modes
Edit `client/.env.local` and change `VITE_USE_REAL_API`, then restart frontend.

---

## 🔧 Technology Stack

| Layer | Tech |
|-------|------|
| **Frontend** | React 19, Vite 7, React Router, Tailwind CSS |
| **Backend** | Node.js, Express 5, CORS |
| **Database** | JSON files (easily swap for MongoDB/PostgreSQL) |
| **Auth** | Clerk (optional) |
| **Editor** | Quill 2.0 (rich text) |

---

## 🔌 API Endpoints (Real Backend)

```bash
GET    /api/jobs                  # Get all jobs
GET    /api/applications          # Get all applications
POST   /api/applications          # Create application
PUT    /api/applications/:id      # Update application
DELETE /api/applications/:id      # Delete application
GET    /api/users                 # Get all users
```

Test with:
```bash
curl http://localhost:5000/api/jobs
```

---

## 📚 Available Commands

### Frontend
```bash
cd client
npm install                 # Install dependencies
npm run dev               # Start dev server (port 5173)
npm run build             # Production build
npm run preview           # Preview production build
npm run lint              # ESLint check
```

### Backend
```bash
cd server
npm install               # Install dependencies
npm start                # Start server (port 5000)
npm run server           # Start with nodemon (auto-reload)
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process using port 5173
lsof -ti:5173 | xargs kill -9

# Kill process using port 5000
lsof -ti:5000 | xargs kill -9

# Windows: Use Task Manager or taskkill
```

### Module Not Found
```bash
cd client (or server)
rm -rf node_modules package-lock.json
npm install
```

### Can't Connect to Backend
- Check backend is running: `npm start` in `/server`
- Verify `VITE_USE_REAL_API=true` in `client/.env.local`
- Test: `curl http://localhost:5000/`

### Jobs Not Showing
1. Check browser console (F12)
2. Verify `.env.local` configuration
3. Check if backend is running (for real mode)
4. Restart the app

### .env Changes Not Applied
- Edit the `.env.local` file
- Wait 2-3 seconds for hot reload
- If not working, restart: `Ctrl+C` then `npm run dev`

---

## 📦 Project Features

| Feature | Status |
|---------|--------|
| Job Listings | ✅ Complete |
| Search & Filter | ✅ Complete |
| Apply for Jobs | ✅ Complete |
| CV Upload | ✅ Complete |
| Recruiter Dashboard | ✅ Complete |
| Application Tracking | ✅ Complete |
| Dual Mode API | ✅ Complete |
| Responsive Design | ✅ Complete |
| Dark Mode Ready | ✅ Tailwind |

---

## 📊 Data Format

### Jobs (jobs.json)
```json
{
  "id": "unique-id",
  "title": "Software Engineer",
  "company": "Tech Company",
  "location": "Kigali",
  "description": "Job details...",
  "salary": "$50,000 - $70,000",
  "postedDate": "2025-11-26"
}
```

### Applications (applications.json)
```json
{
  "id": "unique-id",
  "jobId": "job-id",
  "applicantName": "John Doe",
  "applicantEmail": "john@example.com",
  "cv": "base64-encoded-file",
  "appliedDate": "2025-11-26"
}
```

---

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy dist/ folder to Vercel or Netlify
```

### Backend (Railway/Render)
```bash
# On Railway.app:
# 1. Connect GitHub repo
# 2. Select repo
# 3. Deploy automatically

# On Render.com:
# 1. New Web Service
# 2. Build: npm install
# 3. Start: npm start
```

**Set Environment Variables on Host:**
- Frontend: `VITE_API_URL=https://your-backend-url/api`
- Backend: `PORT=5000`

---

## 🏙️ Supported Locations & Categories

**Locations:** Kigali, Muhanga, Huye, Gitarama, Ruhengeri, Musanze, Butare

**Categories:** IT, Engineering, Finance, Sales, Marketing, HR, Education, Healthcare

---

## 📚 Learning Resources

- **React:** https://react.dev
- **Vite:** https://vitejs.dev
- **Express:** https://expressjs.com
- **Tailwind:** https://tailwindcss.com
- **Node.js:** https://nodejs.org/docs

---

## 📝 Important Notes

- Data persists based on mode (localStorage or JSON files)
- No password hashing in current version (add for production)
- Add input validation before production use
- Use real database (MongoDB/PostgreSQL) for production
- Implement proper authentication (JWT/OAuth) before deploying

---

## 🎓 Next Steps

1. ✅ Run the app in simulated mode
2. 📖 Explore the code in `/client/src/`
3. 🔄 Switch to real backend mode
4. 🎨 Customize colors/design
5. ✨ Add new features
6. 🚀 Deploy to production

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📞 Support

- **Issues:** https://github.com/Tapiwanashe6/job-portal/issues
- **Browser Console:** F12 for errors
- **Terminal Output:** Check for error messages

---

## 📄 License

ISC License - Free to use, modify, and distribute.

---

**Last Updated:** November 26, 2025  
**Status:** ✅ Production Ready (with modifications)  
**Version:** 1.0.0

Happy coding! 🚀
