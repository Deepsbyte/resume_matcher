from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.router import api_router
from app.db.session import engine, SessionLocal
from app.db.session import Base
from app.models.models import User, UserRole
from app.core.security import get_password_hash

# Some Windows bcrypt wheels/versions can trigger passlib/bcrypt import quirks.
# Use a short demo password to avoid bcrypt edge-case truncation/validation.
DEMO_PASSWORD = "DemoPass123!"[:72]


app = FastAPI(
    title="CareerIQ API",
    version="1.0.0",
    description="AI-Powered Career Intelligence Platform",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5176"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.on_event("startup")
def startup():
    # Ensure DB path exists for SQLite.
    if settings.database_kind == "sqlite":
        settings.sqlite_path.parent.mkdir(parents=True, exist_ok=True)

    # Create tables (no migrations required for local dev).
    Base.metadata.create_all(bind=engine)

    # Seed demo users only if DB is empty.
    db = SessionLocal()
    try:
        # Seed demo users only if the database is empty.
        # Use a robust per-user existence check to avoid UNIQUE constraint failures
        # if the DB file already exists from an earlier run.
        demo_users = [
            {"email": "candidate@demo.local", "full_name": "Demo Candidate", "role": UserRole.candidate},
            {"email": "recruiter@demo.local", "full_name": "Demo Recruiter", "role": UserRole.recruiter},
            {"email": "admin@demo.local", "full_name": "Demo Admin", "role": UserRole.admin},
        ]

        for u in demo_users:
            existing = db.query(User).filter(User.email == u["email"]).first()
            if existing:
                continue

            # Avoid passlib/bcrypt on startup in misconfigured Windows environments.
            # Store a deterministic hash compatible with our verify_password().
            # If bcrypt hashing fails, fall back to plaintext demo password.
            try:
                hashed = get_password_hash(DEMO_PASSWORD)
            except Exception:
                hashed = DEMO_PASSWORD

            user = User(
                email=u["email"],
                full_name=u["full_name"],
                hashed_password=hashed,
                role=u["role"],
            )
            db.add(user)

        # Only commit if we actually added anything.
        if db.new:
            db.commit()

    finally:
        db.close()


@app.get("/health")
def health():
    return {"status": "ok", "service": "careeriq-api"}

