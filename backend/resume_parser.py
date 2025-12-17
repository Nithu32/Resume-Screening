import PyPDF2

def extract_text_from_resume(file):
    text = ""
    reader = PyPDF2.PdfReader(file)
    for page in reader.pages:
        text += page.extract_text()
    return text.lower()
