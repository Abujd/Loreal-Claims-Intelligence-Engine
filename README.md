# L'Oréal Claims Intelligence Engine

A full-stack prototype that assesses whether clinical/study evidence substantiates a marketing claim, using a local LLM (via [Ollama](https://ollama.com)) plus rule-based guardrails, with a human-in-the-loop review step.

**Stack:** React (Vite) frontend · Express backend · PostgreSQL via Prisma · Ollama for local LLM inference.

## How it works

1. **Claim** — A marketing claim is proposed for a product (e.g. "Reduces wrinkle depth by 20% in 4 weeks"), scoped to one or more markets.
2. **Evidence** — A study is submitted against the claim (title, type, content).
3. **Assessment** — The backend sends the claim + evidence to the local LLM, which extracts findings and scores a set of criteria (endpoint match, magnitude, timeframe, sample size, method, statistical significance). Rule-based guardrails then flag inconsistencies (e.g. small sample size, timepoint exceeding study duration) and a verdict (`JUSTIFIED` / `NOT_JUSTIFIED` / `INSUFFICIENT_EVIDENCE`) is derived with a confidence score.
4. **Review** — A human evaluator can accept or override the AI verdict; every review is recorded as an append-only history entry.

## Project structure

```
backend/
  src/
    controllers/   Request handlers
    services/       Business logic (claim, assess pipeline, review, scoring, guardrails)
    repositories/   Prisma data access
    routes/         Express routes + OpenAPI annotations
    llm/            Ollama client, prompt building, LLM output schema
    schemas/        Zod request validation schemas
    prisma/         Prisma client instance
  prisma/
    schema.prisma   Data model (Claim -> Evidence -> Assessment -> AssessmentReview)
frontend/
  src/
    components/     React UI components
    data/           Static/sample data
    styles/         CSS
docker-compose.yml  Postgres + Ollama (+ one-shot model pull)
```

## Prerequisites

- Node.js 18+
- Docker (for Postgres and Ollama), or your own local instances of each

## Setup

### 1. Start Postgres and Ollama

```bash
docker compose up -d
```

This starts Postgres on `127.0.0.1:5433` and Ollama on `127.0.0.1:11435`, and pulls the default model (`llama3.2:3b`).

### 2. Backend

```bash
cd backend
npm install
npm run db:push        # or: npm run db:migrate
npm run start:dev
```

Configure `backend/.env` (see existing file for defaults):

| Variable | Description |
|---|---|
| `PORT` | API server port (default `3001`) |
| `DATABASE_URL` | Postgres connection string |
| `OLLAMA_HOST` | Ollama server URL |
| `OLLAMA_MODEL` | Model tag to use for assessment |
| `OLLAMA_NUM_CTX` | Context window size (tokens) |
| `OLLAMA_TIMEOUT_MS` | Request timeout for LLM calls |
| `POLICY_MIN_SAMPLE_SIZE` | Minimum study sample size before a guardrail flag is raised |

API docs are served at `http://localhost:3001/api/docs` (Swagger UI) once the server is running.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server runs on its default port and calls the backend directly (CORS is open in dev).

## API overview

| Endpoint | Description |
|---|---|
| `GET /api/health` | Server + Ollama reachability check |
| `POST /api/claims/create` | Create a claim |
| `GET /api/claims` | List claims |
| `POST /api/assess` | Run the LLM substantiation pipeline against a claim + evidence |
| `GET /api/assessments/:assessmentId/reviews` | List review history for an assessment |
| `POST /api/assessments/:assessmentId/reviews` | Record a human accept/override decision |

Full request/response schemas are available via the Swagger UI at `/api/docs`.
