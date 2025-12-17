from embeddings import get_embedding
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

def get_missing_skills(resume_skills, jd_skills, threshold=0.75):
    missing = []

    resume_embeddings = {
        skill: get_embedding(skill) for skill in resume_skills
    }

    for jd_skill in jd_skills:
        jd_emb = get_embedding(jd_skill)

        if not resume_embeddings:
            missing.append(jd_skill)
            continue

        similarities = [
            cosine_similarity(
                [jd_emb], [resume_embeddings[rs]]
            )[0][0]
            for rs in resume_embeddings
        ]

        if max(similarities) < threshold:
            missing.append(jd_skill)

    return missing
