# Quick Reference: Running the App

## 🚀 Quick Start (TL;DR)

```powershell
# 1. Verify setup
.\verify-setup.ps1

# 2. Run database migrations
cd backend
npm run migrate

# 3. Start backend (Terminal 1)
cd backend
npm run dev

# 4. Start frontend (Terminal 2)
cd frontend
npm run dev

# 5. Open browser
# http://localhost:3000
```

## 📋 Prerequisites

- ✅ Node.js 18+
- ✅ PostgreSQL 14+
- ✅ npm (comes with Node.js)
- ⚠️ Redis (optional)

## 🔧 Environment Files

### `backend/.env`
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fashion_saas
DB_USER=postgres
DB_PASSWORD=your_password
PORT=5000
```

### `frontend/.env`
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 🌐 URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/api/health

## ✅ Verification Commands

```powershell
# Check backend health
Invoke-WebRequest http://localhost:5000/api/health

# Check database
psql -U postgres -d fashion_saas -c "SELECT COUNT(*) FROM catalogues;"

# Check if ports are in use
netstat -ano | findstr :5000
netstat -ano | findstr :3000
```

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Port in use | `taskkill /PID <PID> /F` |
| Database error | Check `.env` credentials |
| Dependencies missing | `npm install` in frontend/backend |
| CORS error | Check `FRONTEND_URL` in backend `.env` |

## 📚 Full Documentation

- **Detailed Guide:** `RUN_APP_GUIDE.md`
- **Installation:** `INSTALLATION.md`
- **Quick Start:** `QUICK_START.md`
- **Deployment:** `DEPLOYMENT.md`

