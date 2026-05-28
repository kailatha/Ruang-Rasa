import sys
import os
import json
import pickle
import datetime

import numpy as np

from dotenv import load_dotenv

from tensorflow import keras
from tensorflow.keras.preprocessing.sequence import (
    pad_sequences
)

# =====================================================
# ROOT SETUP
# =====================================================

ROOT_DIR = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        ".."
    )
)

sys.path.append(ROOT_DIR)

load_dotenv(
    os.path.join(ROOT_DIR, ".env")
)

# =====================================================
# IMPORTS
# =====================================================

from app.custom_objects import (
    CUSTOM_OBJECTS
)

from utils.preprocessing_journaling import (
    clean_text
)

from app.journal_recommendation import (
    recommend_for_journal
)

# =====================================================
# ENV PATH
# =====================================================

MODEL_PATH = os.getenv(
    "JOURNAL_MODEL_PATH"
)

TOKENIZER_PATH = os.getenv(
    "JOURNAL_TOKENIZER_PATH"
)

SCALER_PATH = os.getenv(
    "JOURNAL_SCALER_PATH"
)

METADATA_PATH = os.getenv(
    "JOURNAL_METADATA_PATH"
)

# =====================================================
# LOAD METADATA
# =====================================================

with open(
    METADATA_PATH,
    "r",
    encoding="utf-8"
) as f:

    metadata = json.load(f)

MAX_LEN = metadata["max_seq_len"]

EMOSI_MAP_INV = {

    int(k): v

    for k, v in metadata[
        "emosi_map_inv"
    ].items()
}

print("Metadata loaded")

# =====================================================
# LOAD TOKENIZER
# =====================================================

with open(
    TOKENIZER_PATH,
    "rb"
) as f:

    tokenizer = pickle.load(f)

print("Tokenizer loaded")

# =====================================================
# LOAD SCALER
# =====================================================

with open(
    SCALER_PATH,
    "rb"
) as f:

    scaler_extra = pickle.load(f)

print("Scaler loaded")

# =====================================================
# LOAD MODEL
# =====================================================

print("Loading journal model...")

model = keras.models.load_model(
    MODEL_PATH,
    custom_objects=CUSTOM_OBJECTS
)

print("Journal model loaded")

# =====================================================
# PREDICT FUNCTION
# =====================================================

def predict_journal(text):

    # ==========================================
    # CLEAN TEXT
    # ==========================================

    cleaned = clean_text(text)

    # ==========================================
    # TOKENIZE
    # ==========================================

    sequence = tokenizer.texts_to_sequences(
        [cleaned]
    )

    padded = pad_sequences(
        sequence,
        maxlen=MAX_LEN,
        padding="post",
        truncating="post"
    )

    # ==========================================
    # EXTRA FEATURES
    # ==========================================

    now = datetime.datetime.now()

    journal_hour = now.hour

    journal_dayofweek = now.weekday()

    journal_month = now.month

    is_night = int(
        journal_hour >= 21
        or journal_hour <= 5
    )

    is_weekend = int(
        journal_dayofweek >= 5
    )

    text_length = len(
        cleaned.split()
    )

    extra_raw = np.array([[
        journal_hour,
        journal_dayofweek,
        journal_month,
        is_night,
        is_weekend,
        text_length
    ]], dtype="float32")

    extra_scaled = scaler_extra.transform(
        extra_raw
    )

    # ==========================================
    # PREDICTION
    # ==========================================

    preds = model.predict(
        {
            "text_input": padded,
            "extra_input": extra_scaled
        },
        verbose=0
    )

    emosi_probs = preds[
        "emotion_output"
    ][0]

    emosi_id = int(
        np.argmax(emosi_probs)
    )

    emotion = EMOSI_MAP_INV[
        emosi_id
    ]
    sadness_keywords = [

        "capek",
        "cape",
        "lelah",
        "burnout",
        "sedih",
        "nangis",
        "kesepian",
        "sendiri",
        "hampa",
        "kosong"
    ]
    anger_keywords = [

    "marah",
    "kesal",
    "emosi",
    "benci"
    ]

    fear_keywords = [

        "takut",
        "cemas",
        "khawatir",
        "overthinking",
        "panik"
    ]

    joy_keywords = [

        "senang",
        "bahagia",
        "excited",
        "semangat"
    ]

    love_keywords = [

        "sayang",
        "cinta",
        "kangen"
    ]

    # ==========================================
    # SADNESS
    # ==========================================

    if any(
        word in cleaned
        for word in sadness_keywords
    ):

        emotion = "Sadness"

    # ==========================================
    # ANGER
    # ==========================================

    elif any(
        word in cleaned
        for word in anger_keywords
    ):

        emotion = "Anger"

    # ==========================================
    # FEAR
    # ==========================================

    elif any(
        word in cleaned
        for word in fear_keywords
    ):

        emotion = "Fear"

    # ==========================================
    # JOY
    # ==========================================

    elif any(
        word in cleaned
        for word in joy_keywords
    ):

        emotion = "Joy"

    # ==========================================
    # LOVE
    # ==========================================

    elif any(
        word in cleaned
        for word in love_keywords
    ):

        emotion = "Love"
        

    confidence = float(
        np.max(emosi_probs)
    )

    sentiment_score = float(
        preds[
            "sentiment_output"
        ][0][0]
    )

    # ==========================================
    # SENTIMENT LABEL
    # ==========================================

    sentiment_label = (
        "positive"
        if sentiment_score >= 0.5
        else "negative"
    )

    # ==========================================
    # BUILD PREDICTION RESULT
    # ==========================================

    prediction_result = {

        "emotion": emotion,

        "confidence": confidence,

        "sentiment_score": sentiment_score,

        "sentiment_label": sentiment_label
    }

    # ==========================================
    # RECOMMENDATION ENGINE
    # ==========================================

    recommendation_result = recommend_for_journal(
        prediction_result
    )
    # Merge prediction metadata with recommendation payload so callers
    # receive a single comprehensive result containing emotion, confidence,
    # sentiment scores AND recommended activities/affirmations.
    combined = {
        # prediction fields
        "emotion": prediction_result.get("emotion"),
        "confidence": prediction_result.get("confidence"),
        "sentiment_score": prediction_result.get("sentiment_score"),
        "sentiment_label": prediction_result.get("sentiment_label"),
        # recommendation fields
        **recommendation_result,
    }

    return combined