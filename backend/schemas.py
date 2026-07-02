from pydantic import BaseModel
from typing import List

class SkillAnalysis(BaseModel):
    identified_skills: List[str]
    missing_skills: List[str]
    skill_summary: str

class Improvement(BaseModel):
    section: str
    issue: str
    suggestion: str

class AnalysisResponse(BaseModel):
    skill_analysis: SkillAnalysis
    improvements: List[Improvement]
    overall_feedback: str

class ATSResult(BaseModel):
    ats_score: int          # 0-100
    keyword_match_pct: float
    matched_keywords: List[str]
    missing_keywords: List[str]