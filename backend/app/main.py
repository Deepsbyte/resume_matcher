from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.router import api_router
from app.db.session import engine, SessionLocal
from app.db.session import Base
from app.models.models import User, UserRole
from app.core.security import get_password_hash, verify_password

# Some Windows bcrypt wheels/versions can trigger passlib/bcrypt import quirks.
# Use a short demo password to avoid bcrypt edge-case truncation/validation.
DEMO_PASSWORD = "DemoPass123!"[:72]
DEMO_ACCOUNTS = (
    ("candidate@demo.example.com", "Demo Candidate", UserRole.candidate),
    ("recruiter@demo.example.com", "Demo Recruiter", UserRole.recruiter),
    ("admin@demo.example.com", "Demo Admin", UserRole.admin),
)


app = FastAPI(
    title="CareerIQ API",
    version="1.0.0",
    description="AI-Powered Career Intelligence Platform",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
        "http://127.0.0.1:5176",
        "https://resume-matcher-1-b5rz.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


def ensure_demo_accounts():
    db = SessionLocal()
    try:
        demo_password_hash = get_password_hash(DEMO_PASSWORD)
        changed = False

        for email, full_name, role in DEMO_ACCOUNTS:
            existing = db.query(User).filter(User.email == email).first()
            if not existing:
                role_name = email.split("@", 1)[0]
                for legacy_email in (f"{role_name}@example.com", f"{role_name}@demo.local"):
                    existing = db.query(User).filter(User.email == legacy_email).first()
                    if existing:
                        existing.email = email
                        changed = True
                        break

            if not existing:
                existing = User(email=email)
                db.add(existing)

            existing.full_name = full_name
            existing.hashed_password = demo_password_hash
            existing.role = role
            existing.is_active = True
            changed = True

        if changed:
            db.commit()
    finally:
        db.close()


@app.on_event("startup")
def startup():
    # Ensure DB path exists for SQLite.
    if settings.database_kind == "sqlite":
        settings.sqlite_path.parent.mkdir(parents=True, exist_ok=True)

    # Create tables (no migrations required for local dev).
    Base.metadata.create_all(bind=engine)
    ensure_demo_accounts()


@app.get("/health")
def health():
    return {"status": "ok", "service": "careeriq-api"}
