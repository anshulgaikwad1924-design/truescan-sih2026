from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.core.firebase import db
from app.services.ocr_service import extract_raw_text
from app.services.gemini_service import extract_structured_data
from app.services.validation_service import validate_extracted_data
from firebase_admin import firestore
import traceback
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/extraction", tags=["extraction"])

def run_extraction_pipeline(doc_id: str, local_path: str):
    """Background task to run OCR and AI extraction."""
    if db is None:
        return
        
    doc_ref = db.collection('landRecords').document(doc_id)
    
    try:
        # 1. Update status to processing
        doc_ref.update({"status": "processing"})
        
        # 2. Skip Tesseract OCR and run Gemini AI natively on the image
        logger.info(f"Starting native Gemini extraction for {doc_id}")
        structured_data = extract_structured_data(local_path)
        
        # 2.5 Run Validation
        logger.info(f"Running validation for {doc_id}")
        validation_flags = validate_extracted_data(structured_data)
        
        # 3. Update Firestore with success and validation flags
        doc_ref.update({
            "status": "completed",
            "extracted_data": structured_data,
            "raw_text": "Extracted natively via Gemini Vision", # Store placeholder text
            "validation_flags": validation_flags,
            "validation_status": "flagged" if len(validation_flags) > 0 else "approved"
        })
        logger.info(f"Pipeline completed for {doc_id}")
        
    except Exception as e:
        logger.error(f"Pipeline failed for {doc_id}: {str(e)}\n{traceback.format_exc()}")
        # Update Firestore with failure
        doc_ref.update({
            "status": "failed",
            "error_message": str(e)
        })

@router.post("/{doc_id}")
def trigger_extraction(doc_id: str, background_tasks: BackgroundTasks):
    """
    Triggers the OCR and AI extraction pipeline for a given document.
    Runs asynchronously in the background.
    """
    if db is None:
        raise HTTPException(status_code=500, detail="Firebase not initialized")

    doc_ref = db.collection('landRecords').document(doc_id)
    doc_snap = doc_ref.get()
    
    if not doc_snap.exists:
        raise HTTPException(status_code=404, detail="Document not found")
        
    doc_data = doc_snap.to_dict()
    
    if doc_data.get('status') == 'processing':
        return {"message": "Document is already being processed"}
        
    local_path = doc_data.get('local_path')
    if not local_path:
        raise HTTPException(status_code=400, detail="Document has no local_path")
        
    # Queue the background task
    background_tasks.add_task(run_extraction_pipeline, doc_id, local_path)
    
    return {"message": "Extraction pipeline triggered successfully", "doc_id": doc_id}
