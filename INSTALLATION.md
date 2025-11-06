# Installation Guide

## Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- Redis (optional, for job queuing and caching)
- npm or yarn

## Step-by-Step Installation

### 1. Clone or Navigate to Project

```bash
cd fashion-saas
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Install Backend Dependencies

```bash
cd ../backend
npm install
```

### 4. Set Up Database

1. Create PostgreSQL database:
```sql
CREATE DATABASE fashion_saas;
```

2. Update backend `.env` file with your database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fashion_saas
DB_USER=your_username
DB_PASSWORD=your_password
```

3. Run migrations:
```bash
cd backend
npm run migrate
```

### 5. Set Up Redis (Optional)

If using Redis for job queuing:

```bash
# Install Redis (macOS)
brew install redis
brew services start redis

# Or use Docker
docker run -d -p 6379:6379 redis:latest
```

Update `.env`:
```env
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 6. Configure Environment Variables

#### Frontend `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

#### Backend `.env`:
Copy `backend/.env.example` to `backend/.env` and update with your values:
- Database credentials
- Redis credentials (if using)
- API keys for Runway ML and Trends API (optional for mock mode)

### 7. Create Required Directories

The application will auto-create upload directories, but you can create them manually:

```bash
mkdir -p backend/uploads/temp
mkdir -p backend/public/uploads/images
mkdir -p backend/public/uploads/videos
mkdir -p backend/public/uploads/thumbnails
```

### 8. Start Development Servers

#### Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### 9. Access Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

## API Keys (Optional for Mock Mode)

The application works in mock mode without API keys. To use real services:

### Runway ML API
1. Sign up at https://runwayml.com
2. Get API key from dashboard
3. Add to `backend/.env`:
```env
RUNWAY_ML_API_KEY=your_api_key_here
RUNWAY_ML_API_URL=https://api.runwayml.com/v1
```

### Google Trends API
1. Set up Google Cloud project
2. Enable Trends API
3. Create API key
4. Add to `backend/.env`:
```env
TRENDS_API_KEY=your_api_key_here
TRENDS_API_URL=https://trends.googleapis.com/v1beta
```

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running: `pg_isready`
- Check database credentials in `.env`
- Ensure database exists: `psql -l | grep fashion_saas`

### Redis Connection Issues
- Verify Redis is running: `redis-cli ping` (should return PONG)
- If Redis is unavailable, app will use memory-based rate limiting and job queue

### Port Already in Use
- Change ports in `.env` files or `package.json` scripts
- Kill process using port: `lsof -ti:5000 | xargs kill`

### File Upload Errors
- Check directory permissions for `uploads/` folder
- Verify `MAX_FILE_SIZE` in backend `.env` matches expected file sizes

## Production Deployment

1. Build frontend:
```bash
cd frontend
npm run build
```

2. Build backend:
```bash
cd backend
npm run build
```

3. Start production server:
```bash
cd backend
npm start
```

4. Serve frontend build with nginx or similar:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /path/to/fashion-saas/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:5000;
    }
}
```

