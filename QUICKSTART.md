# Quick Start Guide

Get the Job Application Tracker running in 5 minutes!

## Prerequisites
- Node.js installed
- PostgreSQL installed and running

## Setup Steps

### 1. Database (2 minutes)
```bash
createdb job_tracker
cd server
psql -d job_tracker -f db/schema.sql
psql -d job_tracker -f db/seed.sql
```

### 2. Backend (1 minute)
```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` and set your PostgreSQL password:
```
DB_PASSWORD=your_postgres_password
```

Start server:
```bash
npm run dev
```

### 3. Frontend (1 minute)
Open a new terminal:
```bash
cd client
npm install
npm run dev
```

### 4. Open Browser
Visit: `http://localhost:5173`

Login with demo account:
- Email: `demo@example.com`
- Password: `password123`

## Chrome Extension (Optional)

1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `chrome-extension` folder
5. Note the extension ID
6. Add it to `server/.env`:
   ```
   CORS_ORIGIN=http://localhost:5173,chrome-extension://YOUR_EXTENSION_ID
   ```
7. Restart the backend server

## That's it!

You should now have:
- Backend running on http://localhost:5000
- Frontend running on http://localhost:5173
- Chrome extension loaded and ready

Happy job tracking! 🎯
