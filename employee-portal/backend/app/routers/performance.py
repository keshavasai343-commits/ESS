from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.jwt import get_current_user
from app.models.employee import Employee
from app.models.performance import Goal, Review, Kudos
from app.schemas.performance import (
    GoalCreate, GoalUpdate, GoalResponse,
    ReviewResponse, KudosCreate, KudosResponse,
)

router = APIRouter(prefix="/performance", tags=["performance"])


@router.get("/goals", response_model=list[GoalResponse])
def list_goals(user: Employee = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Goal).filter(Goal.employee_id == user.id).order_by(Goal.created_at.desc()).all()


@router.post("/goals", response_model=GoalResponse, status_code=201)
def create_goal(body: GoalCreate, user: Employee = Depends(get_current_user), db: Session = Depends(get_db)):
    goal = Goal(
        employee_id=user.id,
        title=body.title,
        description=body.description,
        category=body.category,
        due_date=body.due_date,
        created_at=date.today(),
    )
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal


@router.put("/goals/{goal_id}", response_model=GoalResponse)
def update_goal(
    goal_id: int,
    body: GoalUpdate,
    user: Employee = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    goal = db.query(Goal).filter(Goal.id == goal_id, Goal.employee_id == user.id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(goal, field, value)
    if goal.progress >= 100:
        goal.status = "completed"
    db.commit()
    db.refresh(goal)
    return goal


@router.get("/reviews", response_model=list[ReviewResponse])
def list_reviews(user: Employee = Depends(get_current_user), db: Session = Depends(get_db)):
    reviews = (
        db.query(Review)
        .filter(Review.employee_id == user.id)
        .order_by(Review.created_at.desc())
        .all()
    )
    return [
        ReviewResponse(
            id=r.id,
            reviewer_name=f"{r.reviewer.first_name} {r.reviewer.last_name}",
            period=r.period,
            rating=r.rating,
            strengths=r.strengths,
            improvements=r.improvements,
            comments=r.comments,
            created_at=r.created_at,
        )
        for r in reviews
    ]


@router.post("/kudos", response_model=KudosResponse, status_code=201)
def give_kudos(body: KudosCreate, user: Employee = Depends(get_current_user), db: Session = Depends(get_db)):
    receiver = db.query(Employee).filter(Employee.id == body.receiver_id).first()
    if not receiver:
        raise HTTPException(status_code=404, detail="Receiver not found")
    if receiver.id == user.id:
        raise HTTPException(status_code=400, detail="Cannot give kudos to yourself")
    kudos = Kudos(
        sender_id=user.id,
        receiver_id=body.receiver_id,
        message=body.message,
        category=body.category,
        created_at=date.today(),
    )
    db.add(kudos)
    db.commit()
    db.refresh(kudos)
    return KudosResponse(
        id=kudos.id,
        sender_name=f"{user.first_name} {user.last_name}",
        receiver_name=f"{receiver.first_name} {receiver.last_name}",
        message=kudos.message,
        category=kudos.category,
        created_at=kudos.created_at,
    )
