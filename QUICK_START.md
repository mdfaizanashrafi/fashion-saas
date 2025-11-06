# Quick Start Guide

Get the FashionB2B SaaS application up and running in minutes.

## Prerequisites

- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **PostgreSQL 14+** installed and running ([Download](https://www.postgresql.org/download/))
- **npm** or **yarn** package manager

## 1. Install Dependencies

### Frontend
```bash
cd fashion-saas/frontend
npm install
```

### Backend
```bash
cd ../backend
npm install
```

## 2. Database Setup

Create a PostgreSQL database:
```bash
psql -U postgres
CREATE DATABASE fashion_saas;
\q
```

## 3. Configure Environment

### Backend Environment
Copy the example environment file and configure:
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fashion_saas
DB_USER=your_username
DB_PASSWORD=your_password
```

### Frontend Environment (Optional)
Create `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 4. Run Database Migrations

```bash
cd backend
npm run migrate
```

This creates all necessary database tables.

## 5. Start the Application

### Terminal 1 - Backend Server
```bash
cd backend
npm run dev
```

You should see:
```
✅ Connected to PostgreSQL database
✅ Connected to Redis (if Redis is available)
🚀 Server running on http://localhost:5000
```

### Terminal 2 - Frontend Server
```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.x.x ready in xxx ms
➜  Local:   http://localhost:3000/
```

## 6. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 7. Test the Application

### Test Image Upload
1. Navigate to "Catalogue Generator" in the sidebar
2. Drag and drop a dress image (JPEG, PNG, or WebP)
3. Click "Generate Catalogue"
4. The system will process the image and generate AI model showcases

### Test Trend Analyzer
1. Navigate to "Trend Analyzer" in the sidebar
2. Apply filters (age group, season, category)
3. View interactive charts and trend data

## Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running: `pg_isready` or `psql -U postgres -c "SELECT 1"`
- Check database credentials in `backend/.env`
- Ensure database exists: `psql -U postgres -l | grep fashion_saas`

### Port Already in Use
- Change ports in `.env` files or kill the process:
  - Windows: `netstat -ano | findstr :5000` then `taskkill /PID <pid> /F`
  - Mac/Linux: `lsof -ti:5000 | xargs kill`

### Redis Not Available
- The app works without Redis, but with limited functionality
- Install Redis for full job queuing and caching:
  - macOS: `brew install redis && brew services start redis`
  - Docker: `docker run -d -p 6379:6379 redis:latest`

### File Upload Errors
- Check directory permissions for `uploads/` folder
- Ensure `backend/uploads/` and `backend/public/uploads/` directories exist

## Next Steps

- Read [INSTALLATION.md](./INSTALLATION.md) for detailed setup instructions
- Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API endpoints
- Review [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment

## Mock Mode vs Production Mode

The application works in **mock mode** by default (no API keys required):
- AI video generation is simulated
- Trend data uses mock responses

To use real services:
1. Sign up for Runway ML API: https://runwayml.com
2. Set up Google Trends API or alternative
3. Add API keys to `backend/.env`

Even without API keys, you can fully test:
- Image upload interface
- Job processing workflow
- Trend dashboard UI
- Database operations
- Error handling

