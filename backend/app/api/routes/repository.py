from fastapi import APIRouter, HTTPException
from app.core.firebase import db
from typing import List
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/repository", tags=["repository"])

@router.get("/")
def get_all_documents():
    """
    Fetches all uploaded land records from Firestore.
    Used for the Supervisor Document Repository dashboard.
    """
    if db is None:
        raise HTTPException(status_code=500, detail="Firebase not initialized")

    try:
        # Fetch documents ordered by upload date descending
        docs_ref = db.collection('landRecords').order_by('uploaded_at', direction='DESCENDING').stream()
        
        documents = []
        for doc in docs_ref:
            data = doc.to_dict()
            data['id'] = doc.id
            documents.append(data)
            
        return {"documents": documents}
    except Exception as e:
        logger.error(f"Error fetching repository: {e}")
        raise HTTPException(status_code=500, detail=str(e))
