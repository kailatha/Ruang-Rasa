from typing import Dict, Any

import numpy as np

from app.model_loader import load_model, load_metadata
from app.recommendation import get_recommendations
from utils.preprocessing import prepare_model_input


def _level_to_indonesian(level: str) -> str:
    level = (level or "").lower()

    if level == "low":
        return "Minimal"

    if level == "medium":
        return "Sedang"

    if level == "high":
        return "Berat"

    return level.capitalize()


def _make_recommendation(level: str, risk_score: float, user_profile: str):
    level_lower = (level or "").lower()
    profile_text = user_profile.replace("_", " ") if user_profile else "kondisi emosional"

    if level_lower == "low":
        return (
            f"Kondisi emosional Anda saat ini relatif stabil. "
            f"Tetap lanjutkan journaling, istirahat cukup, dan pantau perubahan mood. "
            f"Profil utama yang terdeteksi: {profile_text}."
        )

    if level_lower == "medium":
        return (
            f"Ada indikasi tekanan emosional sedang. "
            f"Cobalah melakukan refleksi singkat, latihan napas, dan kurangi pemicu stres. "
            f"Profil utama yang terdeteksi: {profile_text}."
        )

    return (
        f"Ada indikasi tekanan emosional tinggi. "
        f"Disarankan mencari dukungan dari orang terpercaya atau profesional kesehatan mental. "
        f"Profil utama yang terdeteksi: {profile_text}."
    )


def _fallback_prediction(payload: Dict[str, Any]):
    numeric_values = [
        payload.get("sleep_hours", 0),
        payload.get("screen_time", 0),
        payload.get("social_media", 0),
        payload.get("trauma_history", 0),
        payload.get("previously_diagnosed", 0),
        payload.get("work_hours", 0),
        payload.get("work_stress", 0),
        payload.get("financial_stress", 0),
        payload.get("mood_swings", 0),
        payload.get("loneliness", 0),
    ]

    total_score = float(sum(float(value or 0) for value in numeric_values))

    normalized_score = min(max(total_score / 100, 0), 1)

    if normalized_score < 0.33:
        level = "low"
    elif normalized_score < 0.66:
        level = "medium"
    else:
        level = "high"

    user_profile = "fallback_profile"
    recommendations = get_recommendations(normalized_score, user_profile)

    return {
        "level": _level_to_indonesian(level),
        "recommendation": _make_recommendation(level, normalized_score, user_profile),
        "activity": recommendations.get("activity"),
        "affirmation": recommendations.get("affirmation"),
        "total_score": total_score,
        "risk_score": normalized_score,
        "risk_confidence": None,
        "user_profile": user_profile,
        "profile_confidence": None,
        "source": "fallback",
    }


def predict_screening(payload: Dict[str, Any]):
    try:
        model = load_model()
        metadata = load_metadata()

        model_input, enriched = prepare_model_input(payload, metadata)
        predictions = model.predict(model_input, verbose=0)

        risk_probs = predictions["risk_class"][0]
        profile_probs = predictions["user_profile"][0]

        risk_class_id = int(np.argmax(risk_probs))
        profile_id = int(np.argmax(profile_probs))

        risk_label_map = metadata["risk_label_map"]
        profile_name_map = metadata.get("profile_name_map", {})

        risk_level = risk_label_map.get(risk_class_id, "medium")
        risk_score = float(predictions["risk_score"][0][0])
        risk_confidence = float(np.max(risk_probs))

        user_profile = profile_name_map.get(profile_id, f"profile_{profile_id}")
        profile_confidence = float(np.max(profile_probs))

        # Backend menyimpan total_score. Kita kirim versi 0-100 agar cocok dengan database screening.
        total_score = round(risk_score * 100, 2)

        recommendations = get_recommendations(risk_score, user_profile)

        return {
            "level": _level_to_indonesian(risk_level),
            "recommendation": _make_recommendation(risk_level, risk_score, user_profile),
            "activity": recommendations.get("activity"),
            "affirmation": recommendations.get("affirmation"),
            "total_score": total_score,
            "risk_score": risk_score,
            "risk_confidence": risk_confidence,
            "risk_probabilities": {
                "low": float(risk_probs[0]),
                "medium": float(risk_probs[1]),
                "high": float(risk_probs[2]),
            },
            "user_profile": user_profile,
            "profile_confidence": profile_confidence,
            "source": "tensorflow_model",
        }

    except Exception as error:
        error_message = str(error)
        print("AI inference error, menggunakan fallback:", error_message)

        result = _fallback_prediction(payload)
        result["source"] = "fallback_after_model_error"
        result["error"] = error_message
        return result