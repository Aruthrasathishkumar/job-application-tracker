# Job Application Tracker

A full-stack web application to track and manage job applications with a Kanban board, search/filter capabilities, CSV export, reminders, and a Chrome extension for quick job posting additions.

## Tech Stack

- **Frontend**: React + Tailwind CSS v3
- **Backend**: Node.js + Express.js (REST API)
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Chrome Extension**: Manifest V3

## Features

- User authentication (register/login)
- Kanban board with drag-and-drop functionality
- Add, edit, and delete job applications
- Search and filter applications
- Export applications to CSV
- Reminder system for upcoming deadlines
- Chrome extension to quickly add jobs from any webpage
- Application statistics dashboard

## Project Structure

```
job-application-tracker/
├── server/                 # Backend (Node.js + Express)
│   ├── src/
│   │   ├── index.js       # Main server file
│   │   ├── config/        # Database and JWT configuration
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Auth middleware
│   │   └── utils/         # Helper functions (CSV export)
│   ├── db/
│   │   ├── schema.sql     # Database schema
│   │   └── seed.sql       # Sample data
│   ├── package.json
│   └── .env.example
├── client/                # Frontend (React + Tailwind)
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API service
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── tailwind.config.js
├── chrome-extension/      # Chrome extension
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.js
│   └── styles.css
└── README.md
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** (comes with Node.js)
- **Git** (optional, for cloning)

## Installation & Setup

### 1. Clone or Download the Project

```bash
git clone <repository-url>
cd job-application-tracker
```

Or download and extract the ZIP file.

### 2. Database Setup

#### Create PostgreSQL Database

```bash
# Create a new database
createdb job_tracker

# Or using psql
psql -U postgres
CREATE DATABASE job_tracker;
\q
```

#### Run Schema and Seed Files

```bash
# Navigate to the server directory
cd server

# Run the schema file
psql -U postgres -d job_tracker -f db/schema.sql

# Run the seed file (optional - adds sample data)
psql -U postgres -d job_tracker -f db/seed.sql
```

**Note**: The seed file includes a demo account with email `demo@example.com` and password `password123`.

### 3. Backend Setup

```bash
# Navigate to server directory (if not already there)
cd server

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env
```

#### Configure Environment Variables

Edit the `.env` file with your settings:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=job_tracker
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# CORS Origins (comma-separated)
CORS_ORIGIN=http://localhost:5173,chrome-extension://
```

**Important**: Replace `your_postgres_password_here` with your actual PostgreSQL password.

#### Start the Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

You should see:
```
╔════════════════════════════════════════════╗
║   Job Application Tracker API Server      ║
╚════════════════════════════════════════════╝

✓ Server running on port 5000
✓ Environment: development
✓ Database connected successfully
✓ Health check: http://localhost:5000/health
```

### 4. Frontend Setup

Open a **new terminal** window/tab:

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```

The React app will start on `http://localhost:5173`

Visit `http://localhost:5173` in your browser.

### 5. Chrome Extension Setup

#### Step 1: Add Extension Icons (Optional but Recommended)

The extension needs three icon files in the `chrome-extension/` folder:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

You can:
- Create simple icons using an image editor
- Use an online icon generator
- Or temporarily remove icon references from `manifest.json` for testing

#### Step 2: Load Extension in Chrome

1. Open Google Chrome
2. Navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **Load unpacked**
5. Select the `chrome-extension` folder from your project
6. The extension will appear in your extensions list

#### Step 3: Configure CORS for Extension

1. After loading the extension, note its ID (visible on the chrome://extensions page)
2. Update your `server/.env` file:

```env
CORS_ORIGIN=http://localhost:5173,chrome-extension://YOUR_EXTENSION_ID_HERE
```

3. Restart your backend server

#### Step 4: Use the Extension

1. Click the extension icon in Chrome toolbar
2. Login with your credentials (or demo account: `demo@example.com` / `password123`)
3. The job URL will be auto-filled from your current tab
4. Fill in company, position, and other details
5. Click "Add Application"
6. The job will be added to your tracker!

## Usage Guide

### Demo Account

For quick testing, use the pre-seeded demo account:
- **Email**: `demo@example.com`
- **Password**: `password123`

### Creating a New Account

1. Visit `http://localhost:5173`
2. Click "Sign up" link
3. Fill in your name, email, and password
4. Click "Create Account"

### Dashboard Features

#### Statistics
- View total applications and breakdown by status (Wishlist, Applied, Interview, Offer, Rejected)

#### Adding Applications
- Click "Add New Application" button
- Fill in the form (Company and Position are required)
- Submit to add to your tracker

#### Kanban Board
- Applications are organized in 5 columns: Wishlist, Applied, Interview, Offer, Rejected
- **Drag and drop** cards between columns to update status
- Each card shows:
  - Company and position
  - Location and salary range
  - Applied date and deadline
  - Link to job posting

#### Search & Filters
- **Search**: Type company or position name to filter
- **Status Filter**: Filter by application status
- **Export CSV**: Download your applications as a CSV file

#### Reminders Widget
- Shows upcoming reminders for the next 7 days
- Helps you stay on top of deadlines and follow-ups

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth)

### Applications
- `GET /api/applications` - Get all applications (with optional filters)
- `GET /api/applications/:id` - Get single application
- `POST /api/applications` - Create new application
- `PUT /api/applications/:id` - Update application
- `DELETE /api/applications/:id` - Delete application
- `PATCH /api/applications/:id/status` - Update application status
- `GET /api/applications/stats` - Get application statistics
- `GET /api/applications/export` - Export applications to CSV

### Reminders
- `GET /api/reminders` - Get all reminders
- `GET /api/reminders/upcoming` - Get upcoming reminders (next 7 days)
- `POST /api/reminders` - Create reminder
- `PUT /api/reminders/:id` - Update reminder
- `DELETE /api/reminders/:id` - Delete reminder

**Note**: All endpoints except `/auth/register` and `/auth/login` require JWT authentication via `Authorization: Bearer <token>` header.

## Database Schema

### Users Table
- `id` (Primary Key)
- `email` (Unique)
- `password` (Hashed)
- `name`
- `created_at`, `updated_at`

### Applications Table
- `id` (Primary Key)
- `user_id` (Foreign Key → users)
- `company`, `position`, `status`
- `job_url`, `location`, `salary_range`
- `notes`, `applied_date`, `deadline`
- `created_at`, `updated_at`

### Reminders Table
- `id` (Primary Key)
- `application_id` (Foreign Key → applications)
- `user_id` (Foreign Key → users)
- `reminder_date`, `message`
- `is_sent`, `created_at`

## Troubleshooting

### Backend Issues

**Database connection failed**
- Ensure PostgreSQL is running: `pg_ctl status` or check services
- Verify database credentials in `.env`
- Check if database exists: `psql -U postgres -l`

**Port 5000 already in use**
- Change `PORT` in `.env` to another port (e.g., 5001)
- Update API URL in `client/src/services/api.js`

**JWT errors**
- Make sure `JWT_SECRET` is set in `.env`
- Clear browser localStorage and re-login

### Frontend Issues

**Cannot connect to backend**
- Ensure backend server is running on `http://localhost:5000`
- Check browser console for CORS errors
- Verify API URL in `client/src/services/api.js`

**Build errors**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`

### Chrome Extension Issues

**Extension not loading**
- Check for errors in `chrome://extensions/`
- Ensure `manifest.json` is valid JSON
- Icons can be temporarily removed from manifest if missing

**Cannot add applications**
- Ensure backend server is running
- Check extension ID is in `CORS_ORIGIN` in server `.env`
- Open DevTools on extension popup to see errors

**CORS errors**
- Add extension ID to `CORS_ORIGIN` in server `.env`
- Restart backend server after changing `.env`

## Production Deployment

### Backend
1. Set `NODE_ENV=production` in environment
2. Use a strong `JWT_SECRET`
3. Configure PostgreSQL connection for production database
4. Use a process manager like PM2: `pm2 start src/index.js`

### Frontend
1. Build for production: `npm run build`
2. Serve the `dist` folder using Nginx, Apache, or a CDN
3. Update API URL in build configuration

### Database
1. Set up PostgreSQL on your production server
2. Run schema.sql on production database
3. DO NOT run seed.sql in production (it contains demo data)

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.

## Support

For issues and questions:
1. Check the Troubleshooting section
2. Review API documentation
3. Check browser/server console for errors

---

**Happy Job Hunting!** 🎯
