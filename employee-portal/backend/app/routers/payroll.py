from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.jwt import get_current_user
from app.models.employee import Employee
from app.models.payroll import Payslip, Benefit
from app.schemas.payroll import PayslipSummary, PayslipDetail, BenefitResponse

router = APIRouter(prefix="/payroll", tags=["payroll"])


@router.get("/payslips", response_model=list[PayslipSummary])
def list_payslips(user: Employee = Depends(get_current_user), db: Session = Depends(get_db)):
    return (
        db.query(Payslip)
        .filter(Payslip.employee_id == user.id)
        .order_by(Payslip.month.desc())
        .all()
    )


@router.get("/payslips/{month}", response_model=PayslipDetail)
def get_payslip(month: str, user: Employee = Depends(get_current_user), db: Session = Depends(get_db)):
    payslip = (
        db.query(Payslip)
        .filter(Payslip.employee_id == user.id, Payslip.month == month)
        .first()
    )
    if not payslip:
        raise HTTPException(status_code=404, detail="Payslip not found")
    return payslip


@router.get("/benefits", response_model=list[BenefitResponse])
def get_benefits(user: Employee = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Benefit).filter(Benefit.employee_id == user.id).all()
