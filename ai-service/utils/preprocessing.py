import datetime
from typing import Dict, Any

import numpy as np
import tensorflow as tf


def _safe_number(value, default=0.0):
    if value is None:
        return default

    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def normalize_gender(gender):
    if gender is None:
        return "Unknown"

    value = str(gender).strip().lower()

    if value in ["female", "perempuan", "wanita", "f"]:
        return "Female"

    if value in ["male", "laki-laki", "lakilaki", "pria", "m"]:
        return "Male"

    return str(gender).strip() or "Unknown"


def backend_payload_to_model_data(payload: Dict[str, Any]) -> Dict[str, Any]:
    age = payload.get("user_age")
    if age is None:
        age = 21

    return {
        "Gender": normalize_gender(payload.get("user_gender")),
        "Age": int(_safe_number(age, 21)),
        "Sleep_Hours_Night": _safe_number(payload.get("sleep_hours"), 7),
        "Screen_Time_Hours_Day": _safe_number(payload.get("screen_time"), 6),
        "Social_Media_Hours_Day": _safe_number(payload.get("social_media"), 3),
        "Trauma_History": int(_safe_number(payload.get("trauma_history"), 0)),
        "Previously_Diagnosed": int(_safe_number(payload.get("previously_diagnosed"), 0)),
        "Work_Hours_Per_Week": _safe_number(payload.get("work_hours"), 40),
        "Work_Stress_Level": int(_safe_number(payload.get("work_stress"), 1)),
        "Financial_Stress": int(_safe_number(payload.get("financial_stress"), 1)),
        "Mood_Swings": int(_safe_number(payload.get("mood_swings"), 1)),
        "Loneliness": int(_safe_number(payload.get("loneliness"), 1)),
    }


def add_engineered_features(data: Dict[str, Any]) -> Dict[str, Any]:
    data = data.copy()
    now = datetime.datetime.now()

    data.setdefault("screening_hour", now.hour)
    data.setdefault("screening_dayofweek", now.weekday())
    data.setdefault("screening_month", now.month)

    data["work_stress_risk"] = (data["Work_Stress_Level"] - 1) / 9
    data["financial_risk"] = (data["Financial_Stress"] - 1) / 9
    data["mood_swings_risk"] = data["Mood_Swings"] / 10
    data["loneliness_risk"] = (data["Loneliness"] - 1) / 9

    sleep_hours = data["Sleep_Hours_Night"]

    if sleep_hours < 7:
        data["sleep_risk"] = min((7 - sleep_hours) / 4, 1)
    elif sleep_hours > 9:
        data["sleep_risk"] = min((sleep_hours - 9) / 2, 1)
    else:
        data["sleep_risk"] = 0

    data["screen_time_risk"] = min(max((data["Screen_Time_Hours_Day"] - 6) / 10, 0), 1)
    data["social_media_risk"] = min(max((data["Social_Media_Hours_Day"] - 3) / 9, 0), 1)
    data["work_hours_risk"] = min(max((data["Work_Hours_Per_Week"] - 40) / 34, 0), 1)

    return data


def prepare_model_input(payload: Dict[str, Any], metadata: Dict[str, Any]):
    model_data = backend_payload_to_model_data(payload)
    enriched = add_engineered_features(model_data)

    model_input = {}

    for column in metadata["numeric_features"]:
        model_input[column] = np.array([[enriched[column]]], dtype=np.float32)

    for column in metadata["categorical_features"]:
        model_input[column] = tf.constant([[str(enriched[column])]], dtype=tf.string)

    return model_input, enriched