from datetime import date

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.jwt import get_current_user
from app.models.employee import Employee
from app.models.leave import LeaveBalance, LeaveRequest
from app.schemas.leave import LeaveBalanceResponse, LeaveRequestCreate, LeaveRequestResponse

router = APIRouter(prefix="/leave", tags=["leave"])


@router.get("/balances", response_model=list[LeaveBalanceResponse])
def get_balances(user: Employee = Depends(get_current_user), db: Session = Depends(get_db)):
    balances = db.query(LeaveBalance).filter(LeaveBalance.employee_id == user.id).all()
    results = []
    for b in balances:
        results.append(LeaveBalanceResponse(
            id=b.id,
            leave_type=b.leave_type,
            total=b.total,
            used=b.used,
            pending=b.pending,
            remaining=b.remaining,
        ))
    return results


@router.get("/requests", response_model=list[LeaveRequestResponse])
def get_requests(user: Employee = Depends(get_current_user), db: Session = Depends(get_db)):
    requests = (
        db.query(LeaveRequest)
        .filter(LeaveRequest.employee_id == user.id)
        .order_by(LeaveRequest.created_at.desc())
        .all()
    )
    results = []
    for r in requests:
        results.append(LeaveRequestResponse(
            id=r.id,
            leave_type=r.leave_type,
            from_date=r.from_date,
            to_date=r.to_date,
            days=r.days,
            reason=r.reason,
            status=r.status,
            created_at=r.created_at,
            reviewer_name=(
                f"{r.reviewer.first_name} {r.reviewer.last_name}" if r.reviewer else None
            ),
        ))
    return results


@router.post("/requests", response_model=LeaveRequestResponse, status_code=status.HTTP_201_CREATED)
def create_request(
    body: LeaveRequestCreate,
    user: Employee = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if body.to_date < body.from_date:
        raise HTTPException(status_code=400, detail="to_date must be after from_date")
    days = (body.to_date - body.from_date).days + 1
    leave_req = LeaveRequest(
        employee_id=user.id,
        leave_type=body.leave_type,
        from_date=body.from_date,
        to_date=body.to_date,
        days=days,
        reason=body.reason,
        status="pending",
        created_at=date.today(),
    )
    db.add(leave_req)
    balance = (
        db.query(LeaveBalance)
        .filter(LeaveBalance.employee_id == user.id, LeaveBalance.leave_type == body.leave_type)
        .first()
    )
    if balance:
        balance.pending += days
    db.commit()
    db.refresh(leave_req)
    return LeaveRequestResponse(
        id=leave_req.id,
        leave_type=leave_req.leave_type,
        from_date=leave_req.from_date,
        to_date=leave_req.to_date,
        days=leave_req.days,
        reason=leave_req.reason,
        status=leave_req.status,
        created_at=leave_req.created_at,
        reviewer_name=None,
    )


@router.put("/requests/{request_id}/cancel", response_model=LeaveRequestResponse)
def cancel_request(
    request_id: int,
    user: Employee = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    leave_req = (
        db.query(LeaveRequest)
        .filter(LeaveRequest.id == request_id, LeaveRequest.employee_id == user.id)
        .first()
    )
    if not leave_req:
        raise HTTPException(status_code=404, detail="Leave request not found")
    if leave_req.status != "pending":
        raise HTTPException(status_code=400, detail="Only pending requests can be cancelled")
    leave_req.status = "cancelled"
    balance = (
        db.query(LeaveBalance)
        .filter(LeaveBalance.employee_id == user.id, LeaveBalance.leave_type == leave_req.leave_type)
        .first()
    )
    if balance:
        balance.pending = max(0, balance.pending - leave_req.days)
    db.commit()
    db.refresh(leave_req)
    return LeaveRequestResponse(
        id=leave_req.id,
        leave_type=leave_req.leave_type,
        from_date=leave_req.from_date,
        to_date=leave_req.to_date,
        days=leave_req.days,
        reason=leave_req.reason,
        status=leave_req.status,
        created_at=leave_req.created_at,
        reviewer_name=None,
    )
