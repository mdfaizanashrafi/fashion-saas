# FashionB2B SaaS - AI Model Catalogue Generator & Trend Analyzer

A comprehensive B2B SaaS application for fashion retailers and bulk buyers to generate AI-powered model showcases and analyze market trends.

## Features

- **Image Upload & Catalogue Generator**: Drag-and-drop interface for dress images with AI-generated 3D model showcases
- **AI Video Generation**: 15-second clips and 30-second runway-style videos from multiple angles
- **Trend Analyzer Dashboard**: Real-time trend analytics segmented by demographics, seasons, and categories
- **Modern UI/UX**: Premium, responsive interface with seamless navigation

## Tech Stack

### Frontend
- React 18+ with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Recharts for data visualization
- React Router for navigation

### Backend
- Node.js with Express.js
- TypeScript
- PostgreSQL for data storage
- Multer for file uploads
- Bull Queue for job processing
- Redis for caching

### External Integrations
- **Replicate API** for image and video generation (free tier available, recommended)
- Runway ML API for video generation (alternative, mock implementation included)
- Enhanced mock trend data with realistic patterns and seasonal variations

## Project Structure

```
fashion-saas/
├── frontend/          # React frontend application
├── backend/           # Node.js backend API
├── database/          # Database schema and migrations
└── docs/              # Additional documentation
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis (optional, for job queuing)

### Installation

1. Install frontend dependencies:
```bash
cd frontend
npm install
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Set up environment variables (see `.env.example` files)

4. Run database migrations:
```bash
cd backend
npm run migrate
```

### Development

Frontend:
```bash
cd frontend
npm run dev
```

Backend:
```bash
cd backend
npm run dev
```

## API Rate Limiting

- Video generation: 10 requests per hour per user
- Trend data refresh: Cached for 1 hour
- Image upload: 50MB max file size

## License

MIT


