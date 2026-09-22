import json
import random
from typing import Optional
from app.core.config import settings


def _call_openai(system: str, user: str) -> str:
    """Call OpenAI and return text response."""
    from openai import OpenAI
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    response = client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        temperature=0.4,
    )
    return response.choices[0].message.content


def _parse_json(text: str) -> dict:
    try:
        start = text.find("{")
        end = text.rfind("}") + 1
        return json.loads(text[start:end])
    except Exception:
        return {}


# ─── Resume Analysis ─────────────────────────────────────
def analyze_resume(resume_text: str) -> dict:
    if not settings.OPENAI_API_KEY:
        return _mock_resume_analysis()

    system = (
        "You are an expert resume analyst and ATS specialist. "
        "Return ONLY valid JSON with no markdown."
    )
    user = f"""Analyze this resume and return JSON:
{{
  "ats_score": <0-100>,
  "skills": ["skill1", ...],
  "education": [{{"degree":"","institution":"","year":""}}],
  "experience": [{{"title":"","company":"","duration":"","highlights":[]}}],
  "keywords": ["keyword1", ...],
  "strengths": ["strength1", ...],
  "weaknesses": ["weakness1", ...],
  "recommendations": ["rec1", ...]
}}

Resume:
{resume_text[:4000]}"""

    raw = _call_openai(system, user)
    result = _parse_json(raw)
    result["raw_result"] = raw
    return result


def _mock_resume_analysis() -> dict:
    return {
        "ats_score": round(random.uniform(62, 88), 1),
        "skills": ["Python", "React", "Django", "PostgreSQL", "REST APIs", "Git", "Docker"],
        "education": [{"degree": "B.E. Computer Science", "institution": "K S School of Engineering", "year": "2027"}],
        "experience": [{"title": "Software Intern", "company": "Oasis Infobyte", "duration": "1 month", "highlights": ["Built REST APIs", "Developed frontend components"]}],
        "keywords": ["full-stack", "backend", "authentication", "RBAC", "JWT"],
        "strengths": ["Strong technical stack", "Relevant project experience", "Good academic record"],
        "weaknesses": ["Limited professional experience", "No deployed projects", "Minimal DSA practice"],
        "recommendations": [
            "Deploy at least one project with a live URL",
            "Add quantified impact metrics to bullet points",
            "Include LeetCode or competitive programming profile",
            "Add a professional summary section",
        ],
    }


# ─── Job Match ───────────────────────────────────────────
def match_job(resume_text: str, job_description: str) -> dict:
    if not settings.OPENAI_API_KEY:
        return _mock_job_match()

    system = "You are an expert ATS and job matching specialist. Return ONLY valid JSON."
    user = f"""Match this resume against the job description and return JSON:
{{
  "match_score": <0-100>,
  "skill_match_score": <0-100>,
  "keyword_match_score": <0-100>,
  "missing_skills": ["skill1", ...],
  "missing_keywords": ["kw1", ...],
  "missing_technologies": ["tech1", ...],
  "recommendations": ["rec1", ...]
}}

Resume:
{resume_text[:2000]}

Job Description:
{job_description[:2000]}"""

    raw = _call_openai(system, user)
    result = _parse_json(raw)
    result["raw_result"] = raw
    return result


def _mock_job_match() -> dict:
    return {
        "match_score": round(random.uniform(55, 82), 1),
        "skill_match_score": round(random.uniform(50, 85), 1),
        "keyword_match_score": round(random.uniform(45, 78), 1),
        "missing_skills": ["Kubernetes", "AWS", "GraphQL", "Redis"],
        "missing_keywords": ["microservices", "CI/CD", "agile", "TDD"],
        "missing_technologies": ["Terraform", "Kafka", "Elasticsearch"],
        "recommendations": [
            "Add cloud experience (AWS/GCP) to strengthen profile",
            "Mention agile/scrum methodology experience",
            "Include any CI/CD pipeline work from projects",
        ],
    }


# ─── Recruiter Simulation ────────────────────────────────
def simulate_recruiter(resume_text: str) -> dict:
    if not settings.OPENAI_API_KEY:
        return _mock_recruiter()

    system = (
        "You are a senior technical recruiter at a top tech company. "
        "Be brutally honest. Return ONLY valid JSON."
    )
    user = f"""Review this resume as a recruiter and return JSON:
{{
  "shortlist_probability": <0-100>,
  "recruiter_notes": "<honest 2-3 sentence assessment>",
  "strengths": ["strength1", ...],
  "weaknesses": ["weakness1", ...],
  "risk_factors": ["risk1", ...],
  "hiring_recommendation": "Strong Yes | Yes | Maybe | No",
  "interview_questions": [{{"question":"","type":"technical|behavioral|situational"}}]
}}

Resume:
{resume_text[:3000]}"""

    raw = _call_openai(system, user)
    result = _parse_json(raw)
    result["raw_result"] = raw
    return result


def _mock_recruiter() -> dict:
    return {
        "shortlist_probability": round(random.uniform(40, 72), 1),
        "recruiter_notes": "Candidate shows technical aptitude with a solid academic record and relevant project work. However, the resume lacks demonstrated impact through metrics and the experience section is thin for competitive product company roles. The project descriptions need quantified outcomes to pass initial screening filters.",
        "strengths": ["Strong CGPA (8.94)", "Full-stack project with RBAC complexity", "Relevant tech stack"],
        "weaknesses": ["No deployed/live projects", "Single internship (virtual)", "No competitive programming profile", "Weak bullet point impact"],
        "risk_factors": ["Gap between academic and industry expectations", "No team collaboration evidence"],
        "hiring_recommendation": "Maybe",
        "interview_questions": [
            {"question": "Walk me through your TaskFlow architecture decisions.", "type": "technical"},
            {"question": "How did you implement JWT authentication and RBAC?", "type": "technical"},
            {"question": "Tell me about a time you debugged a complex issue.", "type": "behavioral"},
            {"question": "How would you scale your backend to 100k users?", "type": "situational"},
        ],
    }


# ─── Interview Prep ──────────────────────────────────────
def generate_interview_prep(job_role: str, resume_text: Optional[str] = None) -> dict:
    if not settings.OPENAI_API_KEY:
        return _mock_interview(job_role)

    system = "You are an expert technical interviewer. Return ONLY valid JSON."
    context = f"\nResume context:\n{resume_text[:1500]}" if resume_text else ""
    user = f"""Generate interview prep for a {job_role} role and return JSON:
{{
  "technical_questions": [{{"question":"","expected_answer":"","evaluation_criteria":""}}],
  "behavioral_questions": [{{"question":"","expected_answer":"","evaluation_criteria":""}}],
  "project_questions": [{{"question":"","expected_answer":"","evaluation_criteria":""}}]
}}{context}

Generate 4 questions per category."""

    raw = _call_openai(system, user)
    result = _parse_json(raw)
    result["raw_result"] = raw
    return result


def _mock_interview(job_role: str) -> dict:
    return {
        "technical_questions": [
            {"question": f"Explain RESTful API design principles for a {job_role} role.", "expected_answer": "Discuss statelessness, resource naming, HTTP methods, status codes, and versioning.", "evaluation_criteria": "Depth of understanding, practical examples"},
            {"question": "What is the difference between SQL and NoSQL databases?", "expected_answer": "Structured vs flexible schema, ACID vs BASE, use cases for each.", "evaluation_criteria": "Can articulate trade-offs"},
            {"question": "Explain the event loop in JavaScript.", "expected_answer": "Single-threaded, call stack, callback queue, microtask queue, Web APIs.", "evaluation_criteria": "Understands async behavior"},
            {"question": "How do you handle database migrations in production?", "expected_answer": "Zero-downtime strategies, backward compatibility, rollback plans.", "evaluation_criteria": "Production awareness"},
        ],
        "behavioral_questions": [
            {"question": "Tell me about a challenging project and how you overcame obstacles.", "expected_answer": "Use STAR method: Situation, Task, Action, Result with specific metrics.", "evaluation_criteria": "Structured thinking, ownership, impact"},
            {"question": "How do you prioritize tasks when you have multiple deadlines?", "expected_answer": "Time-boxing, prioritization matrix, communication with stakeholders.", "evaluation_criteria": "Time management, communication"},
            {"question": "Describe a time you disagreed with a technical decision.", "expected_answer": "Constructive disagreement, data-driven argument, team alignment.", "evaluation_criteria": "Maturity, collaboration"},
            {"question": "What motivates you to work in software engineering?", "expected_answer": "Genuine passion, problem-solving, continuous learning.", "evaluation_criteria": "Authenticity, growth mindset"},
        ],
        "project_questions": [
            {"question": "Walk me through your most complex project end-to-end.", "expected_answer": "Architecture, decisions made, challenges, learnings.", "evaluation_criteria": "System thinking, communication clarity"},
            {"question": "How would you improve your TaskFlow project if given more time?", "expected_answer": "Deployment, testing, performance optimization, new features.", "evaluation_criteria": "Self-awareness, product thinking"},
            {"question": "How did you handle authentication and authorization in your projects?", "expected_answer": "JWT flow, RBAC implementation, security considerations.", "evaluation_criteria": "Security awareness, depth"},
            {"question": "What testing strategies did you apply to your projects?", "expected_answer": "Unit tests, integration tests, test coverage.", "evaluation_criteria": "Quality consciousness"},
        ],
    }


# ─── Portfolio Analysis ──────────────────────────────────
def analyze_portfolio(github_username: str) -> dict:
    import httpx
    from urllib.parse import urlparse

    github_username = github_username.strip()
    if "github.com" in github_username.lower():
        parsed = urlparse(github_username if "://" in github_username else f"https://{github_username}")
        github_username = parsed.path.strip("/").split("/")[0]
    github_username = github_username.lstrip("@").strip()

    try:
        headers = {}
        repos_resp = httpx.get(
            f"https://api.github.com/users/{github_username}/repos?per_page=100&sort=updated",
            headers=headers, timeout=10.0
        )
        if repos_resp.status_code != 200:
            return _mock_portfolio(github_username)

        repos = repos_resp.json()
        if not isinstance(repos, list):
            return _mock_portfolio(github_username)

        languages: dict = {}
        for repo in repos:
            if repo.get("language"):
                lang = repo["language"]
                languages[lang] = languages.get(lang, 0) + 1

        total_stars = sum(r.get("stargazers_count", 0) for r in repos)
        has_readme = sum(1 for r in repos if r.get("description"))

        score = min(100, len(repos) * 3 + total_stars * 2 + has_readme * 2)

        readiness = "High" if score >= 70 else "Medium" if score >= 40 else "Low"

        suggestions = []
        if len(repos) < 5:
            suggestions.append("Add more projects to showcase breadth of skills")
        if total_stars < 5:
            suggestions.append("Polish your top 2-3 repos with detailed READMEs")
        if "Python" not in languages and "JavaScript" not in languages:
            suggestions.append("Add projects in mainstream languages for recruiter visibility")
        suggestions.append("Pin your best 6 repositories on your GitHub profile")
        suggestions.append("Add live demo links and deployment URLs to project READMEs")

        return {
            "repo_count": len(repos),
            "languages": languages,
            "portfolio_score": float(min(score, 100)),
            "internship_readiness": readiness,
            "suggestions": suggestions,
        }

    except Exception:
        return _mock_portfolio(github_username)


def _mock_portfolio(username: str) -> dict:
    return {
        "repo_count": 12,
        "languages": {"Python": 5, "JavaScript": 4, "Java": 2, "HTML": 1},
        "portfolio_score": 58.0,
        "internship_readiness": "Medium",
        "suggestions": [
            "Deploy at least 2 projects with live URLs",
            "Add comprehensive READMEs with screenshots",
            "Pin your 6 best repositories",
            "Contribute to open source projects for visibility",
            "Add CI/CD badges to your repositories",
        ],
    }
