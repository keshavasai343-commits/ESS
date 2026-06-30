from datetime import date, datetime

from pydantic import BaseModel


class AttendanceResponse(BaseModel):
    id: int
    date: date
    clock_in: datetime | None = None
    clock_out: datetime | None = None
    total_hours: float | None = None
    status: str

    model_config = {"from_attributes": True}


class AttendanceSummary(BaseModel):
    days_present: int
    days_this_month: int
    avg_hours: float
