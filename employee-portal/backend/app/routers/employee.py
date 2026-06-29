from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.jwt import get_current_user
from app.models.employee import Employee
from app.schemas.employee import EmployeeProfile, EmployeeUpdate

router = APIRouter(tags=["employee"])


def _build_profile(user: Employee) -> dict:
    data = {c.name: getattr(user, c.name) for c in user.__table__.columns}
    data["manager_name"] = (
        f"{user.manager.first_name} {user.manager.last_name}" if user.manager else None
    )
    return data


@router.get("/me", response_model=EmployeeProfile)
def get_my_profile(user: Employee = Depends(get_current_user)):
    return _build_profile(user)


@router.put("/me", response_model=EmployeeProfile)
def update_my_profile(
    body: EmployeeUpdate,
    user: Employee = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return _build_profile(user)
