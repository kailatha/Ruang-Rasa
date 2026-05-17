import json
import os
from pathlib import Path
from functools import lru_cache

import tensorflow as tf
from dotenv import load_dotenv

from app.custom_objects import CUSTOM_OBJECTS

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = BASE_DIR / os.getenv("MODEL_PATH", "model/screening_model.keras")
MODEL_METADATA_PATH = BASE_DIR / os.getenv("MODEL_METADATA_PATH", "model/model_metadata.json")
PROFILE_NAME_MAP_PATH = BASE_DIR / os.getenv("PROFILE_NAME_MAP_PATH", "data/profile_name_map.json")
ACTIVITY_BANK_PATH = BASE_DIR / os.getenv("ACTIVITY_BANK_PATH", "data/activity_bank.json")
AFFIRMATION_BANK_PATH = BASE_DIR / os.getenv("AFFIRMATION_BANK_PATH", "data/affirmation_bank.json")


def _load_json(path: Path, default):
    if not path.exists():
        return default

    with open(path, "r", encoding="utf-8") as file:
        return json.load(file)


def _resolve_model_path() -> Path:
    if MODEL_PATH.exists():
        return MODEL_PATH

    model_dir = BASE_DIR / "model"
    keras_files = list(model_dir.glob("*.keras"))

    if len(keras_files) == 1:
        return keras_files[0]

    if len(keras_files) > 1:
        raise FileNotFoundError(
            "Ada lebih dari satu file .keras di folder model/. "
            "Rename model utama menjadi screening_model.keras."
        )

    raise FileNotFoundError(
        f"Model tidak ditemukan di {MODEL_PATH}. "
        "Taruh file .keras di ai-service/model/ dan rename menjadi screening_model.keras."
    )


@lru_cache(maxsize=1)
def load_model():
    model_path = _resolve_model_path()
    return tf.keras.models.load_model(
        model_path,
        custom_objects=CUSTOM_OBJECTS,
        compile=False,
    )


@lru_cache(maxsize=1)
def load_metadata():
    metadata = _load_json(MODEL_METADATA_PATH, default={})

    risk_label_map = metadata.get("risk_label_map", {
        "0": "low",
        "1": "medium",
        "2": "high",
    })

    # JSON menyimpan key sebagai string, jadi kita normalisasi.
    risk_label_map = {int(k): v for k, v in risk_label_map.items()}

    profile_name_map = metadata.get("profile_name_map")
    if profile_name_map is None:
        profile_name_map = _load_json(PROFILE_NAME_MAP_PATH, default={})

    profile_name_map = {int(k): v for k, v in profile_name_map.items()} if profile_name_map else {}

    numeric_features = metadata.get("numeric_features", [
        "Age",
        "Sleep_Hours_Night",
        "Screen_Time_Hours_Day",
        "Social_Media_Hours_Day",
        "Trauma_History",
        "Previously_Diagnosed",
        "Work_Hours_Per_Week",
        "Work_Stress_Level",
        "Financial_Stress",
        "Mood_Swings",
        "Loneliness",
        "screening_hour",
        "screening_dayofweek",
        "screening_month",
        "sleep_risk",
        "screen_time_risk",
        "social_media_risk",
        "work_hours_risk",
        "work_stress_risk",
        "financial_risk",
        "mood_swings_risk",
        "loneliness_risk",
    ])

    categorical_features = metadata.get("categorical_features", ["Gender"])

    return {
        **metadata,
        "risk_label_map": risk_label_map,
        "profile_name_map": profile_name_map,
        "numeric_features": numeric_features,
        "categorical_features": categorical_features,
    }


@lru_cache(maxsize=1)
def load_activity_bank():
    return _load_json(ACTIVITY_BANK_PATH, default=[])


@lru_cache(maxsize=1)
def load_affirmation_bank():
    return _load_json(AFFIRMATION_BANK_PATH, default=[])