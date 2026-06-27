import io
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.models import User, Resume, ResumeAnalysis
from app.schemas.schemas import ResumeOut, AnalysisOut
from app.services.ai_service import analyze_resume
from typing import List

router = APIRouter(prefix="/resumes", tags=["resumes"])


def extract_text(file: UploadFile) -> str:
    content = file.file.read()
    fname = file.filename.lower()
    try:
        if fname.endswith(".pdf"):
            import PyPDF2
            reader = PyPDF2.PdfReader(io.BytesIO(content))
            return "\n".join(p.extract_text() or "" for p in reader.pages)
        elif fname.endswith(".docx"):
            import docx
            doc = docx.Document(io.BytesIO(content))
            return "\n".join(p.text for p in doc.paragraphs)
        else:
            return content.decode("utf-8", errors="ignore")
    except Exception:
        return content.decode("utf-8", errors="ignore")


@router.post("/upload", response_model=ResumeOut, status_code=201)
def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    raw_text = extract_text(file)
    resume = Resume(user_id=user.id, filename=file.filename, raw_text=raw_text)
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return resume


@router.get("/", response_model=List[ResumeOut])
def list_resumes(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(Resume).filter(Resume.user_id == user.id).order_by(Resume.created_at.desc()).all()


@router.post("/{resume_id}/analyze", response_model=AnalysisOut, status_code=201)
def analyze(
    resume_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    result = analyze_resume(resume.raw_text or "")
    analysis = ResumeAnalysis(
        user_id=user.id,
        resume_id=resume.id,
        ats_score=result.get("ats_score"),
        skills=result.get("skills"),
        education=result.get("education"),
        experience=result.get("experience"),
        keywords=result.get("keywords"),
        strengths=result.get("strengths"),
        weaknesses=result.get("weaknesses"),
        recommendations=result.get("recommendations"),
        raw_result=result.get("raw_result"),
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    return analysis


@router.get("/analyses", response_model=List[AnalysisOut])
def list_analyses(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(ResumeAnalysis).filter(ResumeAnalysis.user_id == user.id).order_by(ResumeAnalysis.created_at.desc()).all()


@router.get("/{resume_id}/analyses", response_model=List[AnalysisOut])
def resume_analyses(
    resume_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return (
        db.query(ResumeAnalysis)
        .filter(ResumeAnalysis.resume_id == resume_id, ResumeAnalysis.user_id == user.id)
        .order_by(ResumeAnalysis.created_at.desc())
        .all()
    )
