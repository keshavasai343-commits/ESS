from datetime import date

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.employee import Employee
from app.auth.password import verify_password, hash_password
from app.auth.jwt import create_access_token, create_refresh_token, verify_token
from app.schemas.auth import LoginRequest, TokenResponse, RefreshRequest, SignupRequest

router = APIRouter(prefix="/auth", tags=["auth"])


def _next_employee_id(db: Session) -> str:
    last = db.query(Employee).order_by(Employee.id.desc()).first()
    next_num = (last.id + 1) if last else 1
    return f"EMP{next_num:03d}"


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def signup(body: SignupRequest, db: Session = Depends(get_db)):
    existing = db.query(Employee).filter(Employee.email == body.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    user = Employee(
        email=body.email,
        hashed_password=hash_password(body.password),
        employee_id=_next_employee_id(db),
        first_name=body.first_name,
        last_name=body.last_name,
        phone=body.phone,
        location=body.location,
        hire_date=date.today(),
        department=body.department,
        designation=body.designation,
        role="employee",
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    data = {"sub": str(user.id)}
    return TokenResponse(
        access_token=create_access_token(data),
        refresh_token=create_refresh_token(data),
    )


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(Employee).filter(Employee.email == body.email).first()
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account deactivated")
    data = {"sub": str(user.id)}
    return TokenResponse(
        access_token=create_access_token(data),
        refresh_token=create_refresh_token(data),
    )


@router.post("/refresh", response_model=TokenResponse)
def refresh(body: RefreshRequest):
    payload = verify_token(body.refresh_token, expected_type="refresh")
    data = {"sub": payload["sub"]}
    return TokenResponse(
        access_token=create_access_token(data),
        refresh_token=create_refresh_token(data),
    )


@router.post("/logout")
def logout():
    return {"message": "Logged out successfully"}
