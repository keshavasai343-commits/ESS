from datetime import date, datetime, time

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.jwt import get_current_user
from app.models.employee import Employee
from app.models.attendance import Attendance
from app.schemas.attendance import AttendanceResponse, AttendanceSummary

router = APIRouter(prefix="/attendance", tags=["attendance"])

LATE_THRESHOLD = time(9, 30)


@router.get("/today", response_model=AttendanceResponse | None)
def get_today(user: Employee = Depends(get_current_user), db: Session = Depends(get_db)):
    record = (
        db.query(Attendance)
        .filter(Attendance.employee_id == user.id, Attendance.date == date.today())
        .first()
    )
    return record


@router.get("/history", response_model=list[AttendanceResponse])
def get_history(user: Employee = Depends(get_current_user), db: Session = Depends(get_db)):
    return (
        db.query(Attendance)
        .filter(Attendance.employee_id == user.id)
        .order_by(Attendance.date.desc())
        .limit(30)
        .all()
    )


@router.get("/summary", response_model=AttendanceSummary)
def get_summary(user: Employee = Depends(get_current_user), db: Session = Depends(get_db)):
    today = date.today()
    records = (
        db.query(Attendance)
        .filter(
            Attendance.employee_id == user.id,
            Attendance.date >= today.replace(day=1),
        )
        .all()
    )
    days_present = len(records)
    hours = [r.total_hours for r in records if r.total_hours]
    avg_hours = round(sum(hours) / len(hours), 1) if hours else 0.0
    return AttendanceSummary(
        days_present=days_present,
        days_this_month=today.day,
        avg_hours=avg_hours,
    )


@router.post("/clock-in", response_model=AttendanceResponse, status_code=201)
def clock_in(user: Employee = Depends(get_current_user), db: Session = Depends(get_db)):
    today = date.today()
    record = (
        db.query(Attendance)
        .filter(Attendance.employee_id == user.id, Attendance.date == today)
        .first()
    )
    if record and record.clock_in:
        raise HTTPException(status_code=400, detail="Already clocked in today")

    now = datetime.now()
    status_label = "late" if now.time() > LATE_THRESHOLD else "present"

    if record:
        record.clock_in = now
        record.status = status_label
    else:
        record = Attendance(employee_id=user.id, date=today, clock_in=now, status=status_label)
        db.add(record)

    db.commit()
    db.refresh(record)
    return record


@router.post("/clock-out", response_model=AttendanceResponse)
def clock_out(user: Employee = Depends(get_current_user), db: Session = Depends(get_db)):
    today = date.today()
    record = (
        db.query(Attendance)
        .filter(Attendance.employee_id == user.id, Attendance.date == today)
        .first()
    )
    if not record or not record.clock_in:
        raise HTTPException(status_code=400, detail="You haven't clocked in today")
    if record.clock_out:
        raise HTTPException(status_code=400, detail="Already clocked out today")

    now = datetime.now()
    record.clock_out = now
    elapsed_hours = (now - record.clock_in).total_seconds() / 3600
    record.total_hours = round(elapsed_hours, 2)
    if elapsed_hours < 4:
        record.status = "half_day"

    db.commit()
    db.refresh(record)
    return record
