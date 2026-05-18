import random
from typing import Dict, Any, List

from app.model_loader import load_activity_bank, load_affirmation_bank


def _as_list(value):
    if isinstance(value, list):
        return value

    if isinstance(value, dict):
        for key in ["items", "activities", "affirmations", "data"]:
            if isinstance(value.get(key), list):
                return value[key]

    return []


def _get_tags(item: Dict[str, Any]) -> List[str]:
    tags = item.get("tags", [])

    if isinstance(tags, str):
        return [tags.lower()]

    if isinstance(tags, list):
        return [str(tag).lower() for tag in tags]

    return []


def _score_item(item: Dict[str, Any], risk_score: float, user_profile: str):
    score = 0.0
    tags = _get_tags(item)
    profile = (user_profile or "").lower()

    risk_min = item.get("risk_min", 0.0)
    risk_max = item.get("risk_max", 1.0)

    try:
        if float(risk_min) <= risk_score <= float(risk_max):
            score += 2.0
    except (TypeError, ValueError):
        pass

    for tag in tags:
        if tag in profile:
            score += 1.0

    if risk_score >= 0.66 and any(tag in tags for tag in ["grounding", "social_support", "low_energy"]):
        score += 0.7

    if 0.33 <= risk_score < 0.66 and any(tag in tags for tag in ["self_reflection", "planning", "movement"]):
        score += 0.5

    if risk_score < 0.33 and any(tag in tags for tag in ["movement", "planning", "self_reflection"]):
        score += 0.3

    score += random.random() * 0.01
    return score


def get_recommendations(risk_score: float, user_profile: str):
    activities = _as_list(load_activity_bank())
    affirmations = _as_list(load_affirmation_bank())

    ranked_activities = sorted(
        activities,
        key=lambda item: _score_item(item, risk_score, user_profile),
        reverse=True,
    )

    ranked_affirmations = sorted(
        affirmations,
        key=lambda item: _score_item(item, risk_score, user_profile),
        reverse=True,
    )

    selected_activity = ranked_activities[0] if ranked_activities else None
    selected_affirmation = ranked_affirmations[0] if ranked_affirmations else None

    return {
        "activity": selected_activity,
        "affirmation": selected_affirmation,
    }