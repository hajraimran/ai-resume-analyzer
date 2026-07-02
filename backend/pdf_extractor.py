import pdfplumber

def extract_text(file_bytes: bytes) -> str:
    text_chunks = []
    with pdfplumber.open(file_bytes) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text_chunks.append(page_text)
    text = "\n".join(text_chunks)
    if not text.strip():
        raise ValueError("No extractable text — resume may be a scanned image (needs OCR).")
    return text