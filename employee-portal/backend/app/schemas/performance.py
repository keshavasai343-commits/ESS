from datetime import date

from pydantic import BaseModel


class GoalCreate(BaseModel):
    title: str
    description: str | None = None
    category: str | None = None
    due_date: date | None = None


class GoalUpdate(BaseModel):
    progress: float | None = None
    status: str | None = None
    title: str | None = None
    description: str | None = None


class GoalResponse(BaseModel):
    id: int
    title: str
    description: str | None = None
    category: str | None = None
    progress: float
    status: str
    due_date: date | None = None
    created_at: date

    model_config = {"from_attributes": True}


class ReviewResponse(BaseModel):
    id: int
    reviewer_name: str
    period: str
    rating: float | None = None
    strengths: str | None = None
    improvements: str | None = None
    comments: str | None = None
    created_at: date

    model_config = {"from_attributes": True}


class KudosCreate(BaseModel):
    receiver_id: int
    message: str
    category: str | None = None


class KudosResponse(BaseModel):
    id: int
    sender_name: str
    receiver_name: str
    message: str
    category: str | None = None
    created_at: date

    model_config = {"from_attributes": True}
