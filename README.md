# chitraLekha

Chitra is a high-performance, decoupled video processing microservice designed to ingest, segment, analyze, and automate responses to live CCTV surveillance feeds.

## Dashboard stack

- **Backend**: Django + DRF (`/backend`)
- **Frontend**: React (Vite) + Tailwind (`/frontend`)
- **Database**: MongoDB
- **Orchestration**: Docker Compose

## API endpoint

- `GET /api/v1/chitra/alerts/` — list hazard alerts (newest first)
- `POST /api/v1/chitra/alerts/` — create a new hazard alert

## Run with Docker

```bash
docker compose up --build
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000/api/v1/chitra/alerts/`
- MongoDB: `mongodb://localhost:27017`
