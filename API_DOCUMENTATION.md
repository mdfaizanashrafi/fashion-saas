# API Documentation

## Base URL
```
http://localhost:5000/api (Development)
https://api.yourdomain.com/api (Production)
```

## Authentication
Currently, the API does not require authentication for development. In production, implement JWT-based authentication.

## Endpoints

### Health Check

#### GET `/api/health`
Check API health status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600
}
```

---

### Catalogue Generator

#### POST `/api/catalogue/generate`
Upload dress images and generate AI model showcases.

**Content-Type:** `multipart/form-data`

**Request:**
- `images` (file[]): One or more dress images (JPEG, PNG, WebP)
- Max file size: 50MB per file
- Max files: 10 per request

**Response (202 Accepted):**
```json
{
  "jobId": "job-uuid-here",
  "status": "processing",
  "message": "Catalogue generation started. Check status endpoint for updates.",
  "estimatedTime": "5-10 minutes"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid file type or file too large
- `429 Too Many Requests`: Rate limit exceeded

---

#### GET `/api/catalogue/status/:jobId`
Get status of catalogue generation job.

**Response:**
```json
{
  "jobId": "job-uuid-here",
  "status": "processing" | "completed" | "failed" | "cancelled",
  "progress": 75,
  "items": [
    {
      "id": "item-uuid",
      "title": "Dress Name - Model Pose 1",
      "type": "pictures" | "clips" | "videos",
      "thumbnailUrl": "/uploads/thumbnails/thumb.jpg",
      "downloadUrl": "/api/catalogue/download/item-uuid",
      "metadata": {
        "marketAppeal": 85,
        "styleTags": ["elegant", "casual"],
        "bodyDiversity": "diverse",
        "angles": ["front", "side"],
        "duration": 15
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "error": null,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `404 Not Found`: Job not found

---

#### GET `/api/catalogue/download/:itemId`
Download a catalogue item (image or video).

**Response:** Binary file (image or video)

**Error Responses:**
- `404 Not Found`: Item not found

---

#### GET `/api/catalogue/jobs/:userId`
Get list of user's catalogue generation jobs.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "jobs": [
    {
      "job_id": "job-uuid",
      "user_id": "user-id",
      "status": "completed",
      "progress": 100,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

#### DELETE `/api/catalogue/jobs/:jobId`
Cancel a processing job.

**Response:**
```json
{
  "message": "Job cancelled successfully"
}
```

**Error Responses:**
- `404 Not Found`: Job not found or cannot be cancelled

---

### Trend Analyzer

#### GET `/api/trends`
Get trend data with optional filters.

**Query Parameters:**
- `ageGroup` (optional): `18-25` | `26-35` | `36-50` | `50+`
- `season` (optional): `spring` | `summer` | `fall` | `winter`
- `category` (optional): `casual` | `formal` | `party` | `wedding` | `maxi` | `mini`
- `timeRange` (optional): `30days` | `90days` | `1year` (default: `30days`)

**Response:**
```json
{
  "topTrendingStyle": "Maxi Dress",
  "yoyGrowth": 15.5,
  "lastUpdated": "2024-01-01T00:00:00.000Z",
  "trendingTypes": [
    {
      "name": "Maxi Dress",
      "searchVolume": 8500
    }
  ],
  "ageDemographics": [
    {
      "name": "18-25",
      "value": 30
    },
    {
      "name": "26-35",
      "value": 35
    },
    {
      "name": "36-50",
      "value": 25
    },
    {
      "name": "50+",
      "value": 10
    }
  ],
  "timeSeriesData": [
    {
      "date": "2024-01-01",
      "Maxi Dress": 8500,
      "Mini Dress": 7200
    }
  ],
  "seasonalTrends": [
    {
      "season": "Spring",
      "Maxi Dress": 7500,
      "Mini Dress": 6500
    }
  ],
  "categories": ["Maxi Dress", "Mini Dress", "Casual Dress"],
  "predictiveInsights": [
    {
      "title": "Rising Trend: Sustainable Materials",
      "description": "Dresses with eco-friendly materials showing 25% increase",
      "confidence": 85
    }
  ]
}
```

**Caching:** Results are cached for 1 hour. Subsequent requests with same filters return cached data.

---

#### GET `/api/trends/:trendId`
Get detailed trend information for a specific trend.

**Response:** Same structure as `/api/trends`

---

#### GET `/api/trends/categories/list`
Get list of available dress categories.

**Response:**
```json
[
  "casual",
  "formal",
  "party",
  "wedding",
  "maxi",
  "mini",
  "cocktail",
  "bridesmaid",
  "evening",
  "day-dress"
]
```

---

## Rate Limiting

- **Catalogue Generation**: 10 requests per hour per IP/user
- **Trend API**: No rate limit (cached responses)

## Error Format

All errors follow this format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

## Status Codes

- `200 OK`: Request successful
- `202 Accepted`: Request accepted, processing asynchronously
- `400 Bad Request`: Invalid request parameters
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

