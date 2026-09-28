from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class DocumentCreate(BaseModel):
    file_name: str
    storage_path: Optional[str] = None
    local_path: Optional[str] = None
    mime_type: str
    uploaded_by: str  # User ID

class DocumentResponse(BaseModel):
    id: str
    file_name: str
    storage_path: Optional[str] = None
    local_path: Optional[str] = None
    mime_type: str
    uploaded_by: str
    uploaded_at: datetime
    status: str  # 'uploaded', 'processing', 'completed', 'failed'
    extracted_data: Optional[dict] = None
    validation_flags: Optional[list] = None
    validation_status: Optional[str] = None
