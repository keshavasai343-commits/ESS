from datetime import date

from pydantic import BaseModel


class DocumentResponse(BaseModel):
    id: int
    filename: str
    original_name: str
    file_type: str | None = None
    file_size: int | None = None
    category: str | None = None
    uploaded_at: date

    model_config = {"from_attributes": True}
