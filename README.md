# 🚀 Careerlens - Job Search Intelligence Platform

A full-stack platform that transforms job searching from **tracking** into **intelligence + strategy**.

🔗 **Live Demo (Frontend Preview):**  
https://aruthrasathishkumar.github.io/job-application-tracker/

## ⚠️ Important Disclaimer

> This live demo is frontend-only (hosted on GitHub Pages).

- The backend (FastAPI + PostgreSQL) runs locally by design  
- Features like authentication, analytics, and data persistence require local backend setup  

💡 This is a deliberate product decision to keep sensitive job search data private.

## 🧠 What This Project Does

Careerlens solves the real problem behind job searching:

- Not just tracking applications  
- Understanding patterns  
- Improving strategy  
- Making better decisions  

## ⚡ Key Features

- 📊 Kanban Board - Track applications visually  
- 📈 Referral Funnel Analytics - Know which sources convert  
- 🧠 Interview Memory Bank - Store and search past interview insights  
- 😌 Burnout Detection - 7-day rolling mood analysis  
- 💰 Salary Intelligence - Offer comparison + counter suggestions  
- 🔗 Chrome Extension - Auto-add jobs from LinkedIn  

## 🛠️ Tech Stack

- Frontend: React + Tailwind CSS  
- Backend: FastAPI (Python)  
- Database: PostgreSQL  
- Auth: JWT + bcrypt + Google OAuth  
- Charts: Recharts  
- Extension: Chrome Manifest v3  

## 🏗️ Architecture

- React SPA (GitHub Pages)  
- FastAPI backend (local)  
- PostgreSQL relational database  
- Chrome Extension integration  

## 💻 Local Setup (Required for Full Functionality)

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
## 📸 Screenshots
```
<img src="./screenshots/Screenshot 2026-04-01 172217.png" width="800"/>

<img src="./screenshots/Screenshot 2026-04-01 172257.png" width="800"/>

<img src="./screenshots/Screenshot 2026-04-01 172334.png" width="800"/>

