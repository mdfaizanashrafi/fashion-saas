# Deployment Guide

## Architecture Overview

The FashionB2B SaaS application consists of:
- **Frontend**: React + Vite (Port 3000)
- **Backend**: Node.js + Express (Port 5000)
- **Database**: PostgreSQL
- **Queue**: Redis (for job processing)
- **Storage**: Local file system (can be migrated to S3/Cloud Storage)

## Production Checklist

### Environment Variables

#### Frontend (.env.production)
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

#### Backend (.env)
```env
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL=postgresql://user:password@host:5432/fashion_saas

# Redis
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# API Keys
RUNWAY_ML_API_KEY=your-runway-ml-api-key
TRENDS_API_KEY=your-trends-api-key

# Security
JWT_SECRET=your-very-secure-secret-key
FRONTEND_URL=https://yourdomain.com

# File Upload
MAX_FILE_SIZE=52428800
UPLOAD_DIR=/app/uploads
PUBLIC_UPLOAD_DIR=/app/public/uploads
```

### Build Steps

1. **Build Frontend:**
```bash
cd frontend
npm ci
npm run build
```

2. **Build Backend:**
```bash
cd backend
npm ci
npm run build
```

3. **Run Database Migrations:**
```bash
cd backend
npm run migrate
```

### Docker Deployment

#### docker-compose.yml
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: fashion_saas
      POSTGRES_USER: fashion_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://fashion_user:${DB_PASSWORD}@postgres:5432/fashion_saas
      REDIS_HOST: redis
      REDIS_PORT: 6379
    ports:
      - "5000:5000"
    depends_on:
      - postgres
      - redis
    volumes:
      - ./uploads:/app/uploads
      - ./public:/app/public

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  postgres_data:
  redis_data:
```

#### Backend Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

#### Frontend Dockerfile
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Cloud Deployment Options

#### AWS
1. **EC2/ECS** for backend
2. **S3** for file storage
3. **RDS** for PostgreSQL
4. **ElastiCache** for Redis
5. **CloudFront** for CDN
6. **Route 53** for DNS

#### Google Cloud
1. **Cloud Run** for backend (containerized)
2. **Cloud Storage** for files
3. **Cloud SQL** for PostgreSQL
4. **Memorystore** for Redis
5. **Cloud CDN** for frontend

#### Heroku
1. Frontend on Heroku with static buildpack
2. Backend on Heroku with Node.js buildpack
3. Heroku Postgres addon
4. Heroku Redis addon
5. Configure environment variables

### Scaling Considerations

1. **Horizontal Scaling**: Use load balancer (nginx, AWS ALB)
2. **Job Processing**: Multiple worker processes with Bull Queue
3. **File Storage**: Migrate to S3/Cloud Storage for shared access
4. **Caching**: Redis for trend data and API responses
5. **CDN**: CloudFront/Cloudflare for static assets

### Monitoring

1. **Application Monitoring**: New Relic, DataDog, or Sentry
2. **Database Monitoring**: pg_stat_statements, slow query logs
3. **Job Queue Monitoring**: Bull Board dashboard
4. **Error Tracking**: Sentry or Rollbar

### Security

1. **HTTPS**: SSL certificates (Let's Encrypt)
2. **Rate Limiting**: Already implemented
3. **CORS**: Configure for production domain only
4. **API Authentication**: JWT tokens (implement auth middleware)
5. **File Validation**: Strict file type checking
6. **SQL Injection**: Parameterized queries (already using)
7. **XSS Protection**: Input sanitization

### Performance Optimization

1. **Database Indexes**: Already created in migrations
2. **Caching**: Redis for trend data (1 hour TTL)
3. **File Compression**: Gzip compression on nginx
4. **Image Optimization**: Use Sharp for thumbnails
5. **CDN**: Serve static assets via CDN
6. **Database Connection Pooling**: Configured in connection.ts

## Backup Strategy

1. **Database Backups**: Daily automated PostgreSQL dumps
2. **File Backups**: Sync uploads to cloud storage
3. **Configuration**: Version control for environment variables

## SSL/HTTPS Setup

### Using Let's Encrypt (Certbot)

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

