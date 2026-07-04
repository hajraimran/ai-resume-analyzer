# AI Resume Analyzer

Upload a resume and get an instant ATS compatibility score, detected skills, keyword gap analysis against a job description, and prioritized improvement suggestions.

🔗 **Live demo:** https://ai-resume-analyzer-gbr7.vercel.app/

## Features
- PDF resume text extraction
- Rule-based ATS score (0–100) with a category breakdown
- Keyword gap analysis against a pasted job description
- AI-generated skill analysis, strengths, and prioritized improvements (OpenAI API)

## Tech Stack
**Backend:** FastAPI, pdfplumber, Pydantic, OpenAI API
**Frontend:** React, Vite, Tailwind CSS, Axios
**Deployment:** Vercel

## Running Locally

**Backend:**

cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn main:app --reload


**Frontend:**

cd frontend
npm install
npm run dev


Add your OpenAI API key to a `.env` file inside `backend/`:

OPENAI_API_KEY=your_key_here
