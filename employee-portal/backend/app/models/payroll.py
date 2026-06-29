from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date
from sqlalchemy.orm import relationship

from app.database import Base


class Payslip(Base):
    __tablename__ = "payslips"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    month = Column(String(7), nullable=False)  # YYYY-MM
    pay_date = Column(Date, nullable=False)
    gross_earnings = Column(Float, nullable=False)
    total_deductions = Column(Float, nullable=False)
    net_pay = Column(Float, nullable=False)

    employee = relationship("Employee", back_populates="payslips")
    items = relationship("PayslipItem", back_populates="payslip", cascade="all, delete-orphan")


class PayslipItem(Base):
    __tablename__ = "payslip_items"

    id = Column(Integer, primary_key=True, index=True)
    payslip_id = Column(Integer, ForeignKey("payslips.id"), nullable=False)
    category = Column(String(20), nullable=False)  # earning, deduction
    label = Column(String(100), nullable=False)
    amount = Column(Float, nullable=False)

    payslip = relationship("Payslip", back_populates="items")


class Benefit(Base):
    __tablename__ = "benefits"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    benefit_type = Column(String(50), nullable=False)  # health, pf, allowance
    name = Column(String(100), nullable=False)
    description = Column(String(500))
    amount = Column(Float)
    frequency = Column(String(20))  # monthly, annual

    employee = relationship("Employee", back_populates="benefits")
