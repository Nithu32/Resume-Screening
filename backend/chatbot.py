def detect_intent(question):
    question = question.lower()

    if "job" in question or "role" in question:
        return "JOB_ROLE"

    if "skill" in question or "learn" in question or "improve" in question:
        return "SKILL_GAP"

    if "resume" in question:
        return "RESUME_TIPS"

    return "UNKNOWN"

def generate_response(intent, context):
    if intent == "JOB_ROLE":
        return f"You are best suited for the role of {context['job_role']}."

    if intent == "SKILL_GAP":
        missing = context.get("missing_skills", [])
        if not missing:
            return "You currently meet most of the job requirements."
        return "You should focus on learning: " + ", ".join(missing)

    if intent == "RESUME_TIPS":
        return "Try to include measurable achievements and highlight relevant skills clearly."

    return "I can assist only with resume and career-related queries."

