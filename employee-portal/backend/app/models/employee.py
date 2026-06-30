from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey, Text
from sqlalchemy.orm import relationship

from app.database import Base


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    employee_id = Column(String(20), unique=True, index=True, nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    phone = Column(String(20))
    avatar_url = Column(String(500))
    date_of_birth = Column(Date)
    hire_date = Column(Date, nullable=False)
    department = Column(String(100), nullable=False)
    designation = Column(String(100), nullable=False)
    role = Column(String(20), default="employee")
    manager_id = Column(Integer, ForeignKey("employees.id"), nullable=True)
    location = Column(String(100))
    is_active = Column(Boolean, default=True)

    # Emergency contact
    emergency_contact_name = Column(String(100))
    emergency_contact_phone = Column(String(20))
    emergency_contact_relation = Column(String(50))

    # Bank details
    bank_name = Column(String(100))
    bank_account_number = Column(String(50))
    bank_ifsc = Column(String(20))

    address = Column(Text)

    manager = relationship("Employee", remote_side=[id], backref="direct_reports")
    leave_balances = relationship("LeaveBalance", back_populates="employee")
    leave_requests = relationship("LeaveRequest", back_populates="employee", foreign_keys="LeaveRequest.employee_id")
    payslips = relationship("Payslip", back_populates="employee")
    benefits = relationship("Benefit", back_populates="employee")
    goals = relationship("Goal", back_populates="employee")
    reviews = relationship("Review", back_populates="employee", foreign_keys="Review.employee_id")
    documents = relationship("Document", back_populates="employee")
    kudos_given = relationship("Kudos", back_populates="sender", foreign_keys="Kudos.sender_id")
    kudos_received = relationship("Kudos", back_populates="receiver", foreign_keys="Kudos.receiver_id")
    attendance_records = relationship("Attendance", back_populates="employee")
