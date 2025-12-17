import os
import joblib
from embeddings import get_embedding

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "models",
    "svm_model.pkl"
)

_model = None

def load_model():
    global _model
    if _model is None:
        if os.path.exists(MODEL_PATH):
            _model = joblib.load(MODEL_PATH)
        else:
            _model = None
    return _model


def predict_job_role(text):
    model = load_model()

    # Fallback logic if model is not available
    if model is None:
        return "Software Engineer"

    embedding = get_embedding(text)
    return model.predict([embedding])[0]
