from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import io

from pdf_extractor import extract_text
from ats_scorer import ats_score
from llm_analyzer import analyze_resume

app = FastAPI(title="Resume Analyzer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://ai-resume-analyzer-gbr7.vercel.app",  # you'll get this URL after Step 3 — come back and update it
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze(
    resume: UploadFile = File(...),
    job_description: str = Form(None),
):
    if resume.content_type != "application/pdf":
        raise HTTPException(400, "Please upload a PDF")

    file_bytes = io.BytesIO(await resume.read())
    try:
        resume_text = extract_text(file_bytes)
    except ValueError as e:
        raise HTTPException(422, str(e))

    ats = ats_score(resume_text, job_description)
    llm_result = analyze_resume(resume_text, job_description)

    return {**llm_result, "ats": ats}