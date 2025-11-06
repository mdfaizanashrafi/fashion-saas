# In-Depth Guide: Running the FashionB2B SaaS Application

This guide provides detailed step-by-step instructions to set up, run, and verify that the FashionB2B SaaS application is working correctly.

## Table of Contents
1. [Prerequisites Check](#prerequisites-check)
2. [Installation Steps](#installation-steps)
3. [Database Setup](#database-setup)
4. [Environment Configuration](#environment-configuration)
5. [Running the Application](#running-the-application)
6. [Verification Steps](#verification-steps)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites Check

### 1. Verify Node.js Installation

**Windows (PowerShell):**
```powershell
node --version
npm --version
```

**Expected Output:**
- Node.js version: `v18.0.0` or higher
- npm version: `8.0.0` or higher

**If not installed:**
- Download from: https://nodejs.org/
- Install the LTS version

### 2. Verify PostgreSQL Installation

**Windows (PowerShell):**
```powershell
psql --version
```

**Expected Output:**
- PostgreSQL version: `14.0` or higher

**If not installed:**
- Download from: https://www.postgresql.org/download/windows/
- During installation, remember the password you set for the `postgres` user

**Verify PostgreSQL is Running:**
```powershell
# Check if PostgreSQL service is running
Get-Service -Name postgresql*
```

**If not running, start it:**
```powershell
# Start PostgreSQL service (replace with your service name)
Start-Service postgresql-x64-14
```

### 3. Verify Redis Installation (Optional but Recommended)

**Windows:**
Redis is optional. The app will work without it, but with limited caching and job queue functionality.

**If you want to install Redis:**
- Download from: https://github.com/microsoftarchive/redis/releases
- Or use Docker: `docker run -d -p 6379:6379 redis:latest`

**Verify Redis (if installed):**
```powershell
redis-cli ping
# Should return: PONG
```

---

## Installation Steps

### Step 1: Navigate to Project Directory

```powershell
cd D:\Python\fashion-saas
```

### Step 2: Install Frontend Dependencies

```powershell
cd frontend
npm install
```

**Expected Output:**
```
added 500+ packages, and audited 500+ packages in 30s
```

**Time Required:** 2-5 minutes depending on internet speed

**If you encounter errors:**
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

### Step 3: Install Backend Dependencies

```powershell
cd ..\backend
npm install
```

**Expected Output:**
```
added 200+ packages, and audited 200+ packages in 20s
```

**Time Required:** 1-3 minutes

---

## Database Setup

### Step 1: Create PostgreSQL Database

**Option A: Using psql Command Line**

```powershell
# Connect to PostgreSQL (use your postgres user password)
psql -U postgres

# In psql prompt, run:
CREATE DATABASE fashion_saas;

# Verify database was created
\l

# Exit psql
\q
```

**Option B: Using pgAdmin (GUI)**
1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Right-click "Databases" → "Create" → "Database"
4. Name: `fashion_saas`
5. Click "Save"

### Step 2: Run Database Migrations

```powershell
cd backend
npm run migrate
```

**Expected Output:**
```
✅ Connected to PostgreSQL database
✅ Running migrations...
✅ Created table: catalogues
✅ Created table: catalogue_items
✅ Created table: trends
✅ Migrations completed successfully
```

**If you see errors:**
- Verify database exists: `psql -U postgres -l | Select-String fashion_saas`
- Check database credentials (see Environment Configuration section)

---

## Environment Configuration

### Step 1: Create Backend Environment File

```powershell
cd backend
# Create .env file (if it doesn't exist)
New-Item -Path .env -ItemType File -Force
```

**Edit `backend/.env` with the following content:**

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fashion_saas
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here

# Redis Configuration (Optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# API Keys (Optional - app works in mock mode without these)
RUNWAY_ML_API_KEY=
RUNWAY_ML_API_URL=https://api.runwayml.com/v1
TRENDS_API_KEY=
TRENDS_API_URL=https://trends.googleapis.com/v1beta

# Security
JWT_SECRET=your-secret-key-change-in-production
FRONTEND_URL=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=52428800
UPLOAD_DIR=./uploads
PUBLIC_UPLOAD_DIR=./public/uploads
```

**Important:** Replace `your_postgres_password_here` with your actual PostgreSQL password.

### Step 2: Create Frontend Environment File

```powershell
cd ..\frontend
# Create .env file
New-Item -Path .env -ItemType File -Force
```

**Edit `frontend/.env` with the following content:**

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Step 3: Create Required Directories

```powershell
cd ..\backend

# Create upload directories
New-Item -ItemType Directory -Force -Path uploads\temp
New-Item -ItemType Directory -Force -Path public\uploads\images
New-Item -ItemType Directory -Force -Path public\uploads\videos
New-Item -ItemType Directory -Force -Path public\uploads\thumbnails
```

**Or use PowerShell one-liner:**
```powershell
@('uploads\temp', 'public\uploads\images', 'public\uploads\videos', 'public\uploads\thumbnails') | ForEach-Object { New-Item -ItemType Directory -Force -Path $_ }
```

---

## Running the Application

### Method 1: Manual Start (Recommended for Development)

#### Terminal 1: Start Backend Server

```powershell
cd D:\Python\fashion-saas\backend
npm run dev
```

**Expected Output:**
```
✅ Connected to PostgreSQL database
✅ Connected to Redis (or ⚠️ Redis not available, caching disabled)
🚀 Server running on http://localhost:5000
📊 Environment: development
```

**Keep this terminal open!**

#### Terminal 2: Start Frontend Server

```powershell
cd D:\Python\fashion-saas\frontend
npm run dev
```

**Expected Output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

**Keep this terminal open!**

### Method 2: Using Docker Compose (Alternative)

If you have Docker installed:

```powershell
cd D:\Python\fashion-saas
docker-compose up -d
```

This will start:
- PostgreSQL on port 5432
- Redis on port 6379
- Backend on port 5000
- Frontend on port 3000

**Check status:**
```powershell
docker-compose ps
```

**View logs:**
```powershell
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## Verification Steps

### Step 1: Verify Backend Health Endpoint

**Using PowerShell:**
```powershell
# Test backend health endpoint
Invoke-WebRequest -Uri http://localhost:5000/api/health -Method GET
```

**Or using curl (if installed):**
```powershell
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected",
  "redis": "connected" // or "unavailable"
}
```

**If you get an error:**
- Check if backend is running (Terminal 1)
- Verify port 5000 is not blocked by firewall
- Check backend logs for errors

### Step 2: Verify Frontend is Accessible

1. Open your web browser
2. Navigate to: `http://localhost:3000`
3. You should see the FashionB2B SaaS application homepage

**Expected UI Elements:**
- Sidebar navigation
- Main content area
- "Catalogue Generator" and "Trend Analyzer" menu items

**If you see a blank page or error:**
- Check browser console (F12 → Console tab)
- Verify frontend is running (Terminal 2)
- Check for CORS errors in console

### Step 3: Test API Connection from Frontend

1. Open browser Developer Tools (F12)
2. Go to "Network" tab
3. Navigate to "Trend Analyzer" in the app
4. Check for API calls to `http://localhost:5000/api/trends`
5. Verify the response status is `200 OK`

**Expected Network Request:**
```
GET http://localhost:5000/api/trends?ageGroup=all&season=all&category=all
Status: 200 OK
```

### Step 4: Test Image Upload Feature

1. Navigate to "Catalogue Generator" in the app
2. Click on the upload area or drag and drop an image file
3. Select a test image (JPEG, PNG, or WebP format)
4. Click "Generate Catalogue"

**Expected Behavior:**
- Image preview appears
- Upload progress indicator shows
- Job ID is displayed
- Status updates (processing → completed)

**Check Backend Logs:**
You should see in Terminal 1:
```
📤 File uploaded: filename.jpg
🔄 Job created: job-id-123
✅ Processing job: job-id-123
```

### Step 5: Test Trend Analyzer

1. Navigate to "Trend Analyzer" in the app
2. Select different filters:
   - Age Group: 18-25, 26-35, etc.
   - Season: Spring, Summer, Fall, Winter
   - Category: Dresses, Tops, etc.
3. Click "Apply Filters"

**Expected Behavior:**
- Charts update with trend data
- Statistics display correctly
- No console errors

**Check Backend Logs:**
You should see:
```
📊 Fetching trends with filters: { ageGroup: '18-25', ... }
✅ Trends fetched successfully
```

### Step 6: Verify Database Operations

**Connect to PostgreSQL:**
```powershell
psql -U postgres -d fashion_saas
```

**Check if tables exist:**
```sql
\dt
```

**Expected Tables:**
- `catalogues`
- `catalogue_items`
- `trends`

**Check if data is being stored:**
```sql
-- Check catalogues
SELECT COUNT(*) FROM catalogues;

-- Check catalogue_items
SELECT COUNT(*) FROM catalogue_items;

-- Check trends
SELECT COUNT(*) FROM trends;
```

**Exit psql:**
```sql
\q
```

### Step 7: Verify File Uploads

**Check if files are being saved:**
```powershell
# Check upload directories
Get-ChildItem -Path backend\uploads\temp -Recurse
Get-ChildItem -Path backend\public\uploads\images -Recurse
```

**After uploading an image, you should see:**
- Original file in `uploads/temp/`
- Processed file in `public/uploads/images/`

---

## Troubleshooting

### Issue 1: Backend Won't Start

**Error: "Database connection error"**

**Solutions:**
1. Verify PostgreSQL is running:
   ```powershell
   Get-Service -Name postgresql*
   ```

2. Check database credentials in `backend/.env`:
   - Verify `DB_USER` and `DB_PASSWORD` are correct
   - Verify `DB_NAME` exists: `psql -U postgres -l | Select-String fashion_saas`

3. Test database connection manually:
   ```powershell
   psql -U postgres -d fashion_saas -c "SELECT 1;"
   ```

**Error: "Port 5000 already in use"**

**Solutions:**
1. Find process using port 5000:
   ```powershell
   netstat -ano | findstr :5000
   ```

2. Kill the process (replace PID with actual process ID):
   ```powershell
   taskkill /PID <PID> /F
   ```

3. Or change port in `backend/.env`:
   ```env
   PORT=5001
   ```
   Then update `frontend/.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:5001/api
   ```

### Issue 2: Frontend Won't Start

**Error: "Port 3000 already in use"**

**Solutions:**
1. Find and kill process:
   ```powershell
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

2. Or change Vite port:
   ```powershell
   cd frontend
   npm run dev -- --port 3001
   ```

**Error: "Cannot find module"**

**Solutions:**
1. Delete `node_modules` and reinstall:
   ```powershell
   Remove-Item -Recurse -Force node_modules
   Remove-Item -Force package-lock.json
   npm install
   ```

### Issue 3: API Calls Fail (CORS Error)

**Error in browser console: "CORS policy blocked"**

**Solutions:**
1. Verify backend CORS is configured correctly
2. Check `FRONTEND_URL` in `backend/.env` matches frontend URL
3. Restart backend server after changing `.env`

### Issue 4: Database Migration Fails

**Error: "relation already exists"**

**Solutions:**
1. Drop and recreate database:
   ```powershell
   psql -U postgres -c "DROP DATABASE fashion_saas;"
   psql -U postgres -c "CREATE DATABASE fashion_saas;"
   npm run migrate
   ```

**Error: "permission denied"**

**Solutions:**
1. Verify database user has proper permissions
2. Try using `postgres` superuser for development

### Issue 5: File Upload Fails

**Error: "ENOENT: no such file or directory"**

**Solutions:**
1. Verify upload directories exist:
   ```powershell
   Test-Path backend\uploads\temp
   Test-Path backend\public\uploads\images
   ```

2. Create missing directories (see Environment Configuration section)

**Error: "File too large"**

**Solutions:**
1. Check `MAX_FILE_SIZE` in `backend/.env` (value is in bytes)
2. Current limit: 52428800 bytes = 50 MB

### Issue 6: Redis Connection Warnings

**Warning: "Redis not available, caching disabled"**

**This is OK for development!** The app works without Redis, but:
- Caching is disabled
- Job queue uses in-memory storage (jobs lost on restart)

**To enable Redis:**
1. Install and start Redis
2. Verify connection: `redis-cli ping`
3. Restart backend server

---

## Quick Verification Checklist

Use this checklist to quickly verify everything is working:

- [ ] Node.js and npm are installed and accessible
- [ ] PostgreSQL is installed and running
- [ ] Database `fashion_saas` exists
- [ ] Database migrations completed successfully
- [ ] Backend `.env` file is configured correctly
- [ ] Frontend `.env` file is configured correctly
- [ ] Upload directories exist
- [ ] Backend server starts without errors
- [ ] Frontend server starts without errors
- [ ] Health endpoint returns `200 OK`
- [ ] Frontend loads in browser
- [ ] API calls from frontend succeed
- [ ] Image upload works
- [ ] Trend analyzer displays data
- [ ] Database tables exist and can store data

---

## Next Steps

Once everything is verified and working:

1. **Explore the Application:**
   - Upload multiple images
   - Generate catalogues
   - Analyze trends with different filters

2. **Review Documentation:**
   - `API_DOCUMENTATION.md` - API endpoints reference
   - `DEPLOYMENT.md` - Production deployment guide

3. **Development:**
   - Make code changes
   - Test new features
   - Check logs for debugging

4. **Production Preparation:**
   - Set up proper API keys
   - Configure production database
   - Set up SSL/HTTPS
   - Review security settings

---

## Support

If you encounter issues not covered in this guide:

1. Check the application logs (Terminal 1 and Terminal 2)
2. Check browser console for frontend errors
3. Verify all prerequisites are installed correctly
4. Review the other documentation files in the project

**Common Log Locations:**
- Backend logs: Terminal 1 output
- Frontend logs: Terminal 2 output
- Browser logs: F12 → Console tab
- Database logs: PostgreSQL log files

---

**Last Updated:** 2024
**Application Version:** 1.0.0

