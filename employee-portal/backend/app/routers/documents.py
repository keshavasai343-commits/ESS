import os
import uuid
from datetime import date

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.jwt import get_current_user
from app.config import settings
from app.models.employee import Employee
from app.models.document import Document
from app.schemas.document import DocumentResponse

router = APIRouter(prefix="/documents", tags=["documents"])

ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg", ".doc", ".docx", ".xls", ".xlsx"}


@router.get("", response_model=list[DocumentResponse])
def list_documents(user: Employee = Depends(get_current_user), db: Session = Depends(get_db)):
    return (
        db.query(Document)
        .filter(Document.employee_id == user.id)
        .order_by(Document.uploaded_at.desc())
        .all()
    )


@router.post("/upload", response_model=DocumentResponse, status_code=201)
def upload_document(
    file: UploadFile = File(...),
    category: str = Form("general"),
    user: Employee = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"File type {ext} not allowed")

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    stored_name = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, stored_name)

    contents = file.file.read()
    with open(file_path, "wb") as f:
        f.write(contents)

    doc = Document(
        employee_id=user.id,
        filename=stored_name,
        original_name=file.filename or "unknown",
        file_type=ext.lstrip("."),
        file_size=len(contents),
        category=category,
        uploaded_at=date.today(),
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc


@router.get("/{doc_id}/download")
def download_document(doc_id: int, user: Employee = Depends(get_current_user), db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id, Document.employee_id == user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    file_path = os.path.join(settings.UPLOAD_DIR, doc.filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found on disk")
    return FileResponse(file_path, filename=doc.original_name)
