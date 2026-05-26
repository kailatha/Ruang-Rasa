from typing import Dict, List, Optional, Any

from pydantic import BaseModel, Field


class ScreeningInput(BaseModel):
    user_age: Optional[int] = Field(default=None, ge=0, le=120)
    user_gender: Optional[str] = None

    sleep_hours: float = Field(..., ge=0, le=24)
    screen_time: float = Field(..., ge=0, le=24)
    social_media: float = Field(..., ge=0, le=24)

    trauma_history: int = Field(..., ge=0, le=10)
    previously_diagnosed: int = Field(..., ge=0, le=10)

    work_hours: float = Field(..., ge=0, le=120)
    work_stress: int = Field(..., ge=0, le=10)
    financial_stress: int = Field(..., ge=0, le=10)
    mood_swings: int = Field(..., ge=0, le=10)
    loneliness: int = Field(..., ge=0, le=10)


class PredictionResponse(BaseModel):
    level: str
    recommendation: str
    activity: Optional[Any] = None
    total_score: float
    risk_score: Optional[float] = None
    risk_confidence: Optional[float] = None
    user_profile: Optional[str] = None
    profile_confidence: Optional[float] = None
    source: Optional[str] = None
    error: Optional[str] = None

class JournalRequest(BaseModel):
    text: str = Field(
        ...,
        min_length=1
    )


class JournalResponse(BaseModel):

    emotion: str

    sentiment: str

    recommended_activities: List[Dict[str, Any]]

    recommended_affirmations: List[Dict[str, Any]]

    disclaimer: str