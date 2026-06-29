from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date, Text
from sqlalchemy.orm import relationship

from app.database import Base


class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    category = Column(String(50))  # technical, leadership, personal
    progress = Column(Float, default=0)  # 0-100
    status = Column(String(20), default="in_progress")  # in_progress, completed, overdue
    due_date = Column(Date)
    created_at = Column(Date, nullable=False)

    employee = relationship("Employee", back_populates="goals")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    reviewer_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    period = Column(String(20), nullable=False)  # Q1-2025, H1-2025
    rating = Column(Float)
    strengths = Column(Text)
    improvements = Column(Text)
    comments = Column(Text)
    created_at = Column(Date, nullable=False)

    employee = relationship("Employee", back_populates="reviews", foreign_keys=[employee_id])
    reviewer = relationship("Employee", foreign_keys=[reviewer_id])


class Kudos(Base):
    __tablename__ = "kudos"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    message = Column(Text, nullable=False)
    category = Column(String(50))  # teamwork, innovation, leadership
    created_at = Column(Date, nullable=False)

    sender = relationship("Employee", back_populates="kudos_given", foreign_keys=[sender_id])
    receiver = relationship("Employee", back_populates="kudos_received", foreign_keys=[receiver_id])
