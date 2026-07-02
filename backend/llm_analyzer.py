import os, json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

SYSTEM_PROMPT = """You are a resume reviewer for tech roles. Given a resume and optionally
a job description, return ONLY valid JSON matching this schema:

{
  "skill_analysis": {
    "identified_skills": [string],
    "missing_skills": [string],
    "skill_summary": string
  },
  "strengths": [string],
  "improvements": [
    {"section": string, "issue": string, "suggestion": string, "priority": "high"|"medium"|"low"}
  ],
  "overall_feedback": string
}

Rules:
- "strengths": 2-4 specific things this resume does well, referencing actual content (not generic praise).
- "improvements": at least 4 items covering different sections (summary, experience, projects, education, skills, formatting). Order by priority, high first.
- priority "high" = actively hurts ATS parsing or credibility; "medium" = weakens impact; "low" = polish.
- Be specific and reference actual lines/sections from the resume. No generic advice like "add more keywords" without saying which ones.
- No markdown, no preamble — JSON only."""

def analyze_resume(resume_text: str, jd_text: str | None = None) -> dict:
    user_prompt = f"RESUME:\n{resume_text}\n"
    if jd_text:
        user_prompt += f"\nJOB DESCRIPTION:\n{jd_text}\n"

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.3,
    )
    return json.loads(response.choices[0].message.content)