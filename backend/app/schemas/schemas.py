from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any
from datetime import datetime
from app.models.models import UserRole


# ─── Auth ────────────────────────────────────────────────
class RegisterRequest(BaseModel):
    email: EmailStr
    full_name: str
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ─── User ────────────────────────────────────────────────
class UserOut(BaseModel):
    id: str
    email: str
    full_name: str
    role: UserRole
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Resume ──────────────────────────────────────────────
class ResumeOut(BaseModel):
    id: str
    filename: str
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Analysis ────────────────────────────────────────────
class AnalysisOut(BaseModel):
    id: str
    resume_id: str
    ats_score: Optional[float]
    skills: Optional[Any]
    education: Optional[Any]
    experience: Optional[Any]
    keywords: Optional[Any]
    strengths: Optional[Any]
    weaknesses: Optional[Any]
    recommendations: Optional[Any]
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Job Match ───────────────────────────────────────────
class JobMatchRequest(BaseModel):
    resume_id: str
    job_title: str
    job_description: str


class JobMatchOut(BaseModel):
    id: str
    resume_id: str
    job_title: Optional[str]
    match_score: Optional[float]
    skill_match_score: Optional[float]
    keyword_match_score: Optional[float]
    missing_skills: Optional[Any]
    missing_keywords: Optional[Any]
    missing_technologies: Optional[Any]
    recommendations: Optional[Any]
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Recruiter ───────────────────────────────────────────
class RecruiterRequest(BaseModel):
    resume_id: str


class RecruiterReportOut(BaseModel):
    id: str
    resume_id: str
    shortlist_probability: Optional[float]
    recruiter_notes: Optional[str]
    strengths: Optional[Any]
    weaknesses: Optional[Any]
    risk_factors: Optional[Any]
    hiring_recommendation: Optional[str]
    interview_questions: Optional[Any]
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Interview ───────────────────────────────────────────
class InterviewRequest(BaseModel):
    resume_id: Optional[str] = None
    job_role: str


class InterviewSessionOut(BaseModel):
    id: str
    job_role: Optional[str]
    technical_questions: Optional[Any]
    behavioral_questions: Optional[Any]
    project_questions: Optional[Any]
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Portfolio ───────────────────────────────────────────
class PortfolioRequest(BaseModel):
    github_username: str


class PortfolioOut(BaseModel):
    id: str
    github_username: Optional[str]
    repo_count: Optional[int]
    languages: Optional[Any]
    portfolio_score: Optional[float]
    internship_readiness: Optional[str]
    suggestions: Optional[Any]
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Dashboard ───────────────────────────────────────────
class DashboardStats(BaseModel):
    ats_score: Optional[float]
    match_score: Optional[float]
    portfolio_score: Optional[float]
    interview_readiness: Optional[float]
    resume_count: int
    analysis_count: int
    match_count: int
    recruiter_report_count: int
