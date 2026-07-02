import re

STOPWORDS = {"the","and","a","to","of","in","for","with","on","is","as","an","at","by"}

def tokenize(text: str) -> set:
    words = re.findall(r"[a-zA-Z][a-zA-Z0-9+.#]{1,}", text.lower())
    return {w for w in words if w not in STOPWORDS and len(w) > 2}

def keyword_gap(resume_text: str, jd_text: str):
    resume_tokens = tokenize(resume_text)
    jd_tokens = tokenize(jd_text)
    matched = sorted(resume_tokens & jd_tokens)
    missing = sorted(jd_tokens - resume_tokens)
    match_pct = round(len(matched) / max(len(jd_tokens), 1) * 100, 1)
    return matched, missing, match_pct

def ats_score(resume_text: str, jd_text: str = None) -> dict:
    breakdown = {}
    score = 0

    length_ok = len(resume_text) >= 300
    length_score = 20 if length_ok else 0
    breakdown["content_length"] = {
        "score": length_score, "max": 20,
        "note": "Enough extractable text for a parser to work with" if length_ok
                else "Very little text extracted — resume may be image-based, which most ATS systems can't read at all"
    }
    score += length_score

    has_email = bool(re.search(r"[\w.+-]+@[\w-]+\.[\w.-]+", resume_text))
    has_phone = bool(re.search(r"(\+?\d[\d\-\s]{8,}\d)", resume_text))
    contact_score = (10 if has_email else 0) + (10 if has_phone else 0)
    missing_contact = [x for x, ok in [("email", has_email), ("phone", has_phone)] if not ok]
    breakdown["contact_info"] = {
        "score": contact_score, "max": 20,
        "note": "Email and phone both detected" if not missing_contact
                else f"Missing: {', '.join(missing_contact)} — ATS systems often reject resumes without clear contact info"
    }
    score += contact_score

    section_keywords = ["experience", "education", "skills", "projects"]
    found_sections = [s for s in section_keywords if s in resume_text.lower()]
    section_score = len(found_sections) * 5
    breakdown["standard_sections"] = {
        "score": section_score, "max": 20,
        "note": f"Found: {', '.join(found_sections)}" if found_sections else "No standard section headers detected"
    }
    score += section_score

    bullet_like = len(re.findall(r"[•\-\*]\s", resume_text))
    bullet_score = min(bullet_like, 15)
    breakdown["formatting"] = {
        "score": bullet_score, "max": 15,
        "note": f"{bullet_like} bullet points detected — bullets parse more reliably than dense paragraphs"
    }
    score += bullet_score

    matched, missing, match_pct = [], [], None
    if jd_text:
        matched, missing, match_pct = keyword_gap(resume_text, jd_text)
        kw_score = min(int(match_pct * 0.35), 35)
        breakdown["keyword_match"] = {
            "score": kw_score, "max": 35,
            "note": f"{match_pct}% of job description keywords appear in the resume"
        }
        score += kw_score
    else:
        breakdown["keyword_match"] = {"score": 0, "max": 35, "note": "No job description provided"}

    return {
        "ats_score": min(score, 100),
        "keyword_match_pct": match_pct,
        "matched_keywords": matched,
        "missing_keywords": missing,
        "breakdown": breakdown,
    }