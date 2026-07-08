from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.auth.jwt import get_current_user
from app.auth.password import hash_password
from app.database import get_db
from app.models.employee import Employee
from app.schemas.employee import EmployeeProfile

router = APIRouter(prefix="/admin", tags=["admin"])


def require_manager(user: Employee = Depends(get_current_user)) -> Employee:
    if user.role != "manager":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Manager access required")
    return user


def _build(emp: Employee) -> dict:
    data = {c.name: getattr(emp, c.name) for c in emp.__table__.columns}
    data["manager_name"] = (
        f"{emp.manager.first_name} {emp.manager.last_name}" if emp.manager else None
    )
    return data


class CreateUserRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    first_name: str
    last_name: str
    department: str
    designation: str
    role: str = "employee"
    location: str | None = None
    phone: str | None = None


@router.get("/users", response_model=list[EmployeeProfile])
def list_users(
    search: str = Query(""),
    manager: Employee = Depends(require_manager),
    db: Session = Depends(get_db),
):
    query = db.query(Employee)
    if search:
        pattern = f"%{search}%"
        query = query.filter(
            or_(
                Employee.first_name.ilike(pattern),
                Employee.last_name.ilike(pattern),
                Employee.email.ilike(pattern),
            )
        )
    return [_build(emp) for emp in query.order_by(Employee.id).all()]


@router.post("/users", response_model=EmployeeProfile, status_code=status.HTTP_201_CREATED)
def create_user(
    body: CreateUserRequest,
    manager: Employee = Depends(require_manager),
    db: Session = Depends(get_db),
):
    if db.query(Employee).filter(Employee.email == body.email).first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    last = db.query(Employee).order_by(Employee.id.desc()).first()
    emp_id = f"EMP{(last.id + 1) if last else 1:03d}"

    emp = Employee(
        email=body.email,
        hashed_password=hash_password(body.password),
        employee_id=emp_id,
        first_name=body.first_name,
        last_name=body.last_name,
        department=body.department,
        designation=body.designation,
        role=body.role,
        location=body.location,
        phone=body.phone,
        hire_date=date.today(),
    )
    db.add(emp)
    db.commit()
    db.refresh(emp)
    return _build(emp)


@router.patch("/users/{user_id}/toggle", response_model=EmployeeProfile)
def toggle_active(
    user_id: int,
    manager: Employee = Depends(require_manager),
    db: Session = Depends(get_db),
):
    emp = db.query(Employee).filter(Employee.id == user_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="User not found")
    if emp.id == manager.id:
        raise HTTPException(status_code=400, detail="Cannot deactivate your own account")
    emp.is_active = not emp.is_active
    db.commit()
    db.refresh(emp)
    return _build(emp)
