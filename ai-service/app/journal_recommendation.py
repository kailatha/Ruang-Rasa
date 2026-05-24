import json
import os

from dotenv import load_dotenv

load_dotenv()

# =====================================================
# PATH
# =====================================================

ACTIVITY_PATH = os.getenv(
    "JOURNAL_ACTIVITY_BANK_PATH"
)

AFFIRMATION_PATH = os.getenv(
    "JOURNAL_AFFIRMATION_BANK_PATH"
)

# =====================================================
# LOAD JSON
# =====================================================

with open(
    ACTIVITY_PATH,
    "r",
    encoding="utf-8"
) as f:

    activity_bank = json.load(f)

with open(
    AFFIRMATION_PATH,
    "r",
    encoding="utf-8"
) as f:

    affirmation_bank = json.load(f)

# =====================================================
# JOURNAL RECOMMENDATION
# =====================================================

def recommend_for_journal(
    prediction_result
):

    emotion = prediction_result[
        "emotion"
    ]

    sentiment = prediction_result[
        "sentiment_label"
    ]

    # ==========================================
    # FILTER ACTIVITY
    # ==========================================

    recommended_activities = [

        item

        for item in activity_bank

        if emotion in item["emotion_tags"]
    ]

    # ==========================================
    # FILTER AFFIRMATION
    # ==========================================

    recommended_affirmations = [

        item

        for item in affirmation_bank

        if emotion in item["emotion_tags"]
    ]

    # ==========================================
    # LIMIT RESULT
    # ==========================================

    recommended_activities = (
        recommended_activities[:3]
    )

    recommended_affirmations = (
        recommended_affirmations[:3]
    )

    return {

        "emotion": emotion,

        "sentiment": sentiment,

        "recommended_activities":
            recommended_activities,

        "recommended_affirmations":
            recommended_affirmations,

        "disclaimer":
            "Rekomendasi ini bukan pengganti bantuan profesional."
    }