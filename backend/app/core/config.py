from __future__ import annotations

from pydantic_settings import BaseSettings
from typing import List, Optional
from pathlib import Path


class Settings(BaseSettings):
    # Allow DATABASE_URL to be absent for local SQLite fallback.
    DATABASE_URL: Optional[str] = None

    SECRET_KEY: str = "change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    BACKEND_CORS_ORIGINS: str = "http://localhost:5173"

    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o-mini"

    @property
    def cors_origins(self) -> List[str]:
        return [o.strip() for o in self.BACKEND_CORS_ORIGINS.split(",")]

    @property
    def sqlite_path(self) -> Path:
        # Repo root is: careeriq/backend/app/core/config.py -> ../../../../
        repo_root = Path(__file__).resolve().parents[3]
        return repo_root / "backend" / "careeriq.db"

    @property
    def database_url_effective(self) -> str:
        # If DATABASE_URL is provided, use it (PostgreSQL for production).
        if self.DATABASE_URL and self.DATABASE_URL.strip():
            return self.DATABASE_URL
        # Fallback to SQLite for local dev.
        # Use absolute path to avoid cwd issues.
        return f"sqlite:///{self.sqlite_path.as_posix()}"

    @property
    def database_kind(self) -> str:
        url = (self.database_url_effective or "").lower()
        if url.startswith("postgresql") or url.startswith("postgres"):
            return "postgres"
        if url.startswith("sqlite"):
            return "sqlite"
        return "unknown"

    class Config:
        # The backend starts from ./backend during local dev.
        # Also support running from ./ (repo root) by looking for ../.env.
        env_file = ".env"
        extra = "ignore"


settings = Settings()

