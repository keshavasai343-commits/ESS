from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship

from app.database import Base


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    filename = Column(String(255), nullable=False)
    original_name = Column(String(255), nullable=False)
    file_type = Column(String(50))
    file_size = Column(Integer)  # bytes
    category = Column(String(50))  # tax, id, certificate, offer_letter
    uploaded_at = Column(Date, nullable=False)

    employee = relationship("Employee", back_populates="documents")
