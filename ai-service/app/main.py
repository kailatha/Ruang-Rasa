from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import ScreeningInput, PredictionResponse, JournalRequest, JournalResponse
from app.inference import predict_screening
from app.journal_inference import predict_journal
from app.model_loader import load_model, load_metadata

app = FastAPI(title="Ruang Rasa AI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    # Preload model saat server nyala.
    load_model()
    load_metadata()


@app.get("/")
def root():
    return {
        "status": "ok",
        "message": "Ruang Rasa AI Service is running",
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "ai-service",
    }


@app.post("/predict", response_model=PredictionResponse)
def predict(data: ScreeningInput):
    payload = data.model_dump()
    return predict_screening(payload)

@app.post(
    "/journal/analyze",
    response_model=JournalResponse
)
def analyze_journal(
    data: JournalRequest
):

    result = predict_journal(
        data.text
    )

    return result