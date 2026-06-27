# CareerIQ — AI Career Intelligence Platform

A production-grade full-stack platform for AI-powered career intelligence: resume analysis, job matching, recruiter simulation, interview prep, and portfolio scoring.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, TypeScript, Vite, React Router v6, Recharts, Zustand |
| Backend | FastAPI, SQLAlchemy 2, JWT auth (python-jose), RBAC |
| Database | PostgreSQL 16 |
| AI | OpenAI GPT-4o-mini (with intelligent mock fallback) |
| Infra | Docker, Docker Compose, GitHub Actions CI |

## Features

- **Resume Lab** — Upload PDF/DOCX, get ATS score, skills, strengths, weaknesses, recommendations
- **Job Match** — Paste any JD, get match score, missing skills/keywords/tech, recommendations
- **AI Recruiter** — Shortlist probability, hiring recommendation, risk factors, interview questions
- **Interview Prep** — Role-tailored technical, behavioral, and project questions with model answers
- **Portfolio Analyzer** — GitHub username → repo count, language breakdown, portfolio score, suggestions
- **Analytics** — Score trends over time (ATS, match, portfolio)
- **Dashboard** — Overview of all scores, recent activity, quick actions
- **Auth** — JWT-based with register/login, 3 demo roles (candidate/recruiter/admin)

## Quick start

```bash
# 1. Clone and configure
cp .env.example .env
# Optionally add your OPENAI_API_KEY — platform works without it using mock data

# 2. Run everything
docker compose up --build
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API docs:** http://localhost:8000/docs

## Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Candidate | candidate@demo.local | DemoPass123! |
| Recruiter | recruiter@demo.local | DemoPass123! |
| Admin | admin@demo.local | DemoPass123! |

## Project structure

```
careeriq/
├── backend/
│   ├── app/
│   │   ├── api/v1/endpoints/   # auth, resumes, features (job/recruiter/interview/portfolio/dashboard)
│   │   ├── core/               # config, security, deps
│   │   ├── db/                 # session, Base
│   │   ├── models/             # SQLAlchemy models
│   │   ├── schemas/            # Pydantic schemas
│   │   ├── services/           # ai_service (OpenAI + mock fallback)
│   │   └── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/         # AppShell, ProtectedRoute
│   │   │   └── ui/             # Button, Card, Badge, ScoreRing, etc.
│   │   ├── pages/              # Landing, Auth, Dashboard, ResumeLab, JobMatch, etc.
│   │   ├── store/              # Zustand auth store
│   │   ├── lib/                # Axios API client
│   │   └── App.tsx             # Router
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
└── .github/workflows/ci.yml
```

## Without Docker (local dev)

**Backend:**
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
# Set DATABASE_URL to a local postgres or use SQLite by editing session.py
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## OpenAI integration

Add your `OPENAI_API_KEY` to `.env`. Without it, all AI features return realistic mock data so the platform is fully functional for demo purposes.

Model used: `gpt-4o-mini` (configurable via `OPENAI_MODEL` in `.env`)

## Notes for internship applications

This project demonstrates:
- Production FastAPI architecture (routers, deps, schemas, services)
- JWT auth + RBAC with SQLAlchemy 2
- React 18 with TypeScript, Zustand state, protected routes
- Docker multi-service orchestration
- AI integration with graceful fallback
- Real GitHub API integration (Portfolio Analyzer)
