import os
import shutil
from fastapi import APIRouter, HTTPException, status, UploadFile, File, Form
from app.schemas.documents import DocumentCreate, DocumentResponse
from app.core.firebase import db
from datetime import datetime, timezone
from firebase_admin import firestore

router = APIRouter(prefix="/documents", tags=["documents"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_document(file: UploadFile = File(...), uploaded_by: str = Form(...)):
    """
    Accepts a file directly from the frontend, saves it locally,
    and creates a metadata record in Firestore.
    """
    if db is None:
        raise HTTPException(status_code=500, detail="Firebase not initialized")

    # Generate a unique filename and local path
    timestamp = int(datetime.now(timezone.utc).timestamp())
    safe_filename = file.filename.replace(" ", "_")
    unique_filename = f"{timestamp}_{safe_filename}"
    local_path = os.path.join(UPLOAD_DIR, unique_filename)

    # Save the file locally
    try:
        with open(local_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    doc_ref = db.collection('landRecords').document()
    
    doc_data = {
        "id": doc_ref.id,
        "file_name": file.filename,
        "local_path": local_path,
        "mime_type": file.content_type,
        "uploaded_by": uploaded_by,
        "uploaded_at": datetime.now(timezone.utc),
        "status": "uploaded",
        "extracted_data": None
    }
    
    doc_ref.set(doc_data)
    return doc_data

@router.get("/{doc_id}", response_model=DocumentResponse)
def get_document(doc_id: str):
    """Fetch metadata for a single document"""
    if db is None:
        raise HTTPException(status_code=500, detail="Firebase not initialized")

    doc_ref = db.collection('landRecords').document(doc_id)
    doc_snap = doc_ref.get()
    
    if not doc_snap.exists:
        raise HTTPException(status_code=404, detail="Document not found")
        
    return doc_snap.to_dict()

from fastapi.responses import FileResponse

@router.get("/{doc_id}/image")
def get_document_image(doc_id: str):
    """Serve the original uploaded image/file for a document"""
    if db is None:
        raise HTTPException(status_code=500, detail="Firebase not initialized")

    doc_ref = db.collection('landRecords').document(doc_id)
    doc_snap = doc_ref.get()
    
    if not doc_snap.exists:
        raise HTTPException(status_code=404, detail="Document not found")
        
    data = doc_snap.to_dict()
    local_path = data.get("local_path")
    
    if not local_path or not os.path.exists(local_path):
        raise HTTPException(status_code=404, detail="Image file not found on server")
        
    return FileResponse(local_path)

@router.get("/user/{user_id}", response_model=list[DocumentResponse])
def list_user_documents(user_id: str):
    """Fetch all documents uploaded by a specific user"""
    if db is None:
        raise HTTPException(status_code=500, detail="Firebase not initialized")

    docs = db.collection('landRecords').where('uploaded_by', '==', user_id).order_by('uploaded_at', direction=firestore.Query.DESCENDING).stream()
    
    return [doc.to_dict() for doc in docs]
