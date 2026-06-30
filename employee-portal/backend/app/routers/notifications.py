from datetime import date, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.jwt import get_current_user
from app.models.employee import Employee
from app.models.performance import Kudos, Goal
from app.models.leave import LeaveRequest
from app.schemas.notification import NotificationItem

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("", response_model=list[NotificationItem])
def get_notifications(user: Employee = Depends(get_current_user), db: Session = Depends(get_db)):
    items: list[NotificationItem] = []
    since = date.today() - timedelta(days=30)
    soon = date.today() + timedelta(days=14)

    kudos = (
        db.query(Kudos)
        .filter(Kudos.receiver_id == user.id, Kudos.created_at >= since)
        .order_by(Kudos.created_at.desc())
        .all()
    )
    for k in kudos:
        items.append(NotificationItem(
            id=f"kudos-{k.id}",
            type="kudos",
            title="You received kudos!",
            message=f"{k.sender.first_name} {k.sender.last_name}: \"{k.message}\"",
            date=k.created_at,
        ))

    leave_updates = (
        db.query(LeaveRequest)
        .filter(
            LeaveRequest.employee_id == user.id,
            LeaveRequest.status.in_(["approved", "rejected"]),
            LeaveRequest.created_at >= since,
        )
        .order_by(LeaveRequest.created_at.desc())
        .all()
    )
    for lr in leave_updates:
        items.append(NotificationItem(
            id=f"leave-{lr.id}",
            type="leave",
            title=f"Leave request {lr.status}",
            message=f"Your {lr.leave_type} leave from {lr.from_date} to {lr.to_date} was {lr.status}",
            date=lr.created_at,
        ))

    goals_due = (
        db.query(Goal)
        .filter(
            Goal.employee_id == user.id,
            Goal.status == "in_progress",
            Goal.due_date.isnot(None),
            Goal.due_date <= soon,
        )
        .order_by(Goal.due_date.asc())
        .all()
    )
    for g in goals_due:
        items.append(NotificationItem(
            id=f"goal-{g.id}",
            type="goal",
            title="Goal due soon",
            message=f"\"{g.title}\" is due on {g.due_date}",
            date=date.today(),
        ))

    items.sort(key=lambda i: i.date, reverse=True)
    return items[:20]
