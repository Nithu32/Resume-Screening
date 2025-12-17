from flask import Flask, request, jsonify
from resume_parser import extract_text_from_resume
from skill_extractor import extract_skills
from classifier import predict_job_role
from skill_gap import get_missing_skills
from chatbot import generate_response,detect_intent

app = Flask(__name__)

@app.route("/upload", methods=["POST"])
def upload_resume():
    resume = request.files.get("resume")
    job_description = request.form.get("job_description")

    resume_text = extract_text_from_resume(resume)
    skills = extract_skills(resume_text)
    job_role = predict_job_role(resume_text)
    missing_skills = get_missing_skills(resume_text, job_description)

    return jsonify({
        "extracted_skills": skills,
        "predicted_job_role": job_role,
        "missing_skills": missing_skills
    })


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()

    question = data.get("question", "")
    job_role = data.get("job_role", "")
    missing_skills = data.get("missing_skills", [])

    intent = detect_intent(question)

    context = {
        "job_role": job_role,
        "missing_skills": missing_skills
    }

    response = generate_response(intent, context)

    return {
        "question": question,
        "answer": response
    }



if __name__ == "__main__":
    app.run(debug=True)
