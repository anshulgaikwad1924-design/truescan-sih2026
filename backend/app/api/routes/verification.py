from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from app.core.firebase import db
import logging
from datetime import datetime

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/verification", tags=["verification"])

class DocumentUpdate(BaseModel):
    extracted_data: Dict[str, Any]

@router.post("/{doc_id}/approve")
def approve_document(doc_id: str):
    if db is None:
        raise HTTPException(status_code=500, detail="Firebase not initialized")
    
    try:
        doc_ref = db.collection('landRecords').document(doc_id)
        doc = doc_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Document not found")
        
        doc_ref.update({
            "validation_status": "approved",
            "verified_at": datetime.utcnow().isoformat(),
            "status": "completed"
        })
        return {"message": "Document approved successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error approving doc: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{doc_id}/reject")
def reject_document(doc_id: str):
    if db is None:
        raise HTTPException(status_code=500, detail="Firebase not initialized")
    
    try:
        doc_ref = db.collection('landRecords').document(doc_id)
        doc = doc_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Document not found")
        
        doc_ref.update({
            "validation_status": "rejected",
            "rejected_at": datetime.utcnow().isoformat(),
            "status": "completed"
        })
        return {"message": "Document rejected successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error rejecting doc: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{doc_id}/update")
def update_extracted_data(doc_id: str, data: DocumentUpdate):
    if db is None:
        raise HTTPException(status_code=500, detail="Firebase not initialized")
    
    try:
        doc_ref = db.collection('landRecords').document(doc_id)
        doc = doc_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Document not found")
        
        doc_ref.update({
            "extracted_data": data.extracted_data,
            "validation_status": "approved", # We assume if an admin manually edits it, it's approved
            "verified_at": datetime.utcnow().isoformat(),
            "status": "completed"
        })
        return {"message": "Document data updated and approved successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating doc data: {e}")
        raise HTTPException(status_code=500, detail=str(e))
