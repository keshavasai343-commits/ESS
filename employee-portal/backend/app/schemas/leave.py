from datetime import date

from pydantic import BaseModel


class LeaveBalanceResponse(BaseModel):
    id: int
    leave_type: str
    total: float
    used: float
    pending: float
    remaining: float

    model_config = {"from_attributes": True}


class LeaveRequestCreate(BaseModel):
    leave_type: str
    from_date: date
    to_date: date
    reason: str | None = None


class LeaveRequestResponse(BaseModel):
    id: int
    leave_type: str
    from_date: date
    to_date: date
    days: float
    reason: str | None = None
    status: str
    created_at: date
    reviewer_name: str | None = None

    model_config = {"from_attributes": True}
