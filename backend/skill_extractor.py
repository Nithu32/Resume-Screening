import csv

def load_skills():
    skills = []
    with open("..data/Resume.csv", "r") as f:
        reader = csv.reader(f)
        for row in reader:
            skills.append(row[0].lower())
    return skills


def extract_skills(text):
    skills_db = load_skills()
    extracted = []

    for skill in skills_db:
        if skill in text:
            extracted.append(skill)

    return list(set(extracted))
