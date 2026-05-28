from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import ScreeningInput, PredictionResponse, JournalRequest, JournalResponse, ChatRequest, ChatResponse 
from app.inference import predict_screening
from app.journal_inference import predict_journal
from app.model_loader import load_model, load_metadata
from app.chatbot_engine import generate_chat_response

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
    "/journal/analyze"
)
def analyze_journal(
    data: JournalRequest
):

    # -----------------------------------------
    # Analyze journal
    # -----------------------------------------

    journal_result = predict_journal(
        data.text
    )

    # -----------------------------------------
    # Generate chatbot response
    # -----------------------------------------

    chat_result = generate_chat_response(

        emotion=journal_result["emotion"],

        confidence=journal_result[
            "confidence"
        ]
    )

    # -----------------------------------------
    # Return combined result including full recommendation payload
    # -----------------------------------------

    # Start with the full journal_result produced by the inference pipeline
    response = dict(journal_result)

    # Attach chatbot-specific reply + intervention/intensity for convenience
    response.update({
        "chatbot_reply": chat_result.get("reply"),
        "recommended_intervention": chat_result.get("intervention"),
        "intensity": chat_result.get("intensity"),
    })

    return response

@app.post(
    "/chat",
    response_model=ChatResponse
)
def chat(
    data: ChatRequest
):

    context = data.journal_context

    emotion = "Neutral"

    confidence = 0.5

    if context:

        emotion = context.get(
            "emotion",
            "Neutral"
        )

        confidence = context.get(
            "confidence",
            0.5
        )

    result = generate_chat_response(
        message=data.message,
        emotion=emotion,
        confidence=confidence
    )

    return {
        "reply": result["reply"],
        "emotion": result["emotion"]
    }