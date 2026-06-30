from datetime import date

from pydantic import BaseModel


class NotificationItem(BaseModel):
    id: str
    type: str  # kudos, leave, goal
    title: str
    message: str
    date: date
    read: bool = False
