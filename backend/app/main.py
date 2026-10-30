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


@app.on_event("startup")
def startup():
    # Ensure DB path exists for SQLite.
    if settings.database_kind == "sqlite":
        settings.sqlite_path.parent.mkdir(parents=True, exist_ok=True)

    # Create tables (no migrations required for local dev).
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        demo_users = [
            {"email": "candidate@example.com", "full_name": "Demo Candidate", "role": UserRole.candidate},
            {"email": "recruiter@example.com", "full_name": "Demo Recruiter", "role": UserRole.recruiter},
            {"email": "admin@example.com", "full_name": "Demo Admin", "role": UserRole.admin},
        ]

        try:
            demo_password_hash = get_password_hash(DEMO_PASSWORD)
        except Exception:
            demo_password_hash = DEMO_PASSWORD

        changed = False
        for u in demo_users:
            existing = db.query(User).filter(User.email == u["email"]).first()
            if not existing:
                role = u["email"].split("@", 1)[0]
                for legacy_email in (f"{role}@demo.example.com", f"{role}@demo.local"):
                    legacy = db.query(User).filter(User.email == legacy_email).first()
                    if legacy:
                        legacy.email = u["email"]
                        existing = legacy
                        changed = True
                        break
            if not existing:
                existing = User(email=u["email"])
                db.add(existing)

            existing.full_name = u["full_name"]
            existing.hashed_password = demo_password_hash
            existing.role = u["role"]
            existing.is_active = True
            changed = True

        if changed:
            db.commit()

    finally:
        db.close()


@app.get("/health")
def health():
    return {"status": "ok", "service": "careeriq-api"}
