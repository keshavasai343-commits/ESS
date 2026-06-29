import math

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.auth.jwt import get_current_user
from app.models.employee import Employee
from app.schemas.employee import EmployeeDirectory, EmployeeProfile, PaginatedEmployees

router = APIRouter(prefix="/directory", tags=["directory"])


@router.get("/employees", response_model=PaginatedEmployees)
def list_employees(
    search: str = Query("", description="Search by name or email"),
    department: str = Query("", description="Filter by department"),
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    _user: Employee = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(Employee).filter(Employee.is_active == True)
    if search:
        pattern = f"%{search}%"
        query = query.filter(
            or_(
                Employee.first_name.ilike(pattern),
                Employee.last_name.ilike(pattern),
                Employee.email.ilike(pattern),
            )
        )
    if department:
        query = query.filter(Employee.department == department)
    total = query.count()
    items = query.offset((page - 1) * per_page).limit(per_page).all()
    return PaginatedEmployees(
        items=items,
        total=total,
        page=page,
        pages=math.ceil(total / per_page) if total else 0,
    )


@router.get("/employees/{employee_id}", response_model=EmployeeProfile)
def get_employee(employee_id: int, _user: Employee = Depends(get_current_user), db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == employee_id, Employee.is_active == True).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    data = {c.name: getattr(emp, c.name) for c in emp.__table__.columns}
    data["manager_name"] = f"{emp.manager.first_name} {emp.manager.last_name}" if emp.manager else None
    return data
