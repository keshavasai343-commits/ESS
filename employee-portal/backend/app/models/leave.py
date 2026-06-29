from sqlalchemy import Column, Integer, String, Date, ForeignKey, Float, Text
from sqlalchemy.orm import relationship

from app.database import Base


class LeaveBalance(Base):
    __tablename__ = "leave_balances"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    leave_type = Column(String(20), nullable=False)  # annual, sick, casual
    total = Column(Float, default=0)
    used = Column(Float, default=0)
    pending = Column(Float, default=0)

    employee = relationship("Employee", back_populates="leave_balances")

    @property
    def remaining(self) -> float:
        return self.total - self.used - self.pending


class LeaveRequest(Base):
    __tablename__ = "leave_requests"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    leave_type = Column(String(20), nullable=False)
    from_date = Column(Date, nullable=False)
    to_date = Column(Date, nullable=False)
    days = Column(Float, nullable=False)
    reason = Column(Text)
    status = Column(String(20), default="pending")  # pending, approved, rejected, cancelled
    reviewer_id = Column(Integer, ForeignKey("employees.id"), nullable=True)
    review_comment = Column(Text)
    created_at = Column(Date, nullable=False)

    employee = relationship("Employee", back_populates="leave_requests", foreign_keys=[employee_id])
    reviewer = relationship("Employee", foreign_keys=[reviewer_id])
