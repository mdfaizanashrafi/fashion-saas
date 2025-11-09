# AI Agent Instructions for FashionB2B SaaS

## Architecture Overview

This is a full-stack TypeScript application with distinct frontend and backend services:

- **Frontend** (`/frontend`): React 18+ SPA using Vite, Tailwind CSS, and TypeScript
- **Backend** (`/backend`): Express.js API with TypeScript, PostgreSQL, and Redis
- **Core Features**: AI-powered catalogue generation, video processing, trend analysis

### Key Integration Points

1. **AI Video Generation Pipeline**:
   - Entry: `backend/src/controllers/catalogue.controller.ts`
   - Processing: `backend/src/services/aiVideo.service.ts`
   - Queue Management: `backend/src/queues/videoGeneration.queue.ts`

2. **External API Clients**:
   - `backend/src/clients/runwayMl.client.ts` - Primary AI video generation
   - `backend/src/clients/trendsApi.client.ts` - Market trend data

## Development Workflow

### Environment Setup

1. Required local services:
   ```bash
   # PostgreSQL
   docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:14
   
   # Redis (optional, for job queues)
   docker run -d -p 6379:6379 redis:alpine
   ```

2. Initial setup:
   ```bash
   # Frontend setup
   cd frontend && npm install
   
   # Backend setup
   cd backend && npm install
   npm run migrate
   ```

### Project Conventions

1. **Error Handling**:
   - Use `ApiError` class from `backend/src/utils/ApiError.ts`
   - All errors must be caught and transformed in controllers
   - Example: See `backend/src/controllers/trends.controller.ts`

2. **File Processing**:
   - Uploads go to `backend/public/uploads/{images,thumbnails,videos}`
   - Always use `fileUtils.ts` helpers for file operations

3. **API Rate Limiting**:
   - Implemented in `backend/src/middleware/rateLimiter.ts`
   - Video generation: 10/hour/user
   - Image upload: 50MB max

## Testing and Validation

1. Use test plans in `testsprite_tests/` for comprehensive coverage
2. Run `verify-setup.ps1` to validate environment configuration

## Common Pitfalls

1. Always check Redis connection before queue operations
2. Video generation may timeout - implement proper retries
3. Trend data is cached for 1 hour - consider cache invalidation

## Key Files for Context

- `backend/src/server.ts` - API setup and middleware configuration
- `frontend/src/services/api.ts` - API client configuration
- `backend/src/types/*.ts` - Type definitions and interfaces