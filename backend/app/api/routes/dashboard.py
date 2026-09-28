from fastapi import APIRouter, HTTPException
from app.core.firebase import db
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/stats")
def get_dashboard_stats():
    """
    Fetches real-time aggregated stats from Firestore for the dashboard.
    """
    if db is None:
        raise HTTPException(status_code=500, detail="Firebase not initialized")

    try:
        # We will fetch all documents and aggregate in memory. 
        # For production with millions of rows, we'd use Firestore Aggregation Queries.
        docs_ref = db.collection('landRecords').order_by('uploaded_at', direction='DESCENDING').stream()
        
        documents = []
        for doc in docs_ref:
            data = doc.to_dict()
            data['id'] = doc.id
            documents.append(data)
            
        total_docs = len(documents)
        
        # Awaiting OCR / Processing
        processing = sum(1 for d in documents if d.get('status') in ['uploaded', 'processing'])
        
        # Needs Verification (Flagged)
        needs_verification = sum(1 for d in documents if d.get('validation_status') == 'flagged')
        
        # Verified Records (Approved)
        verified = sum(1 for d in documents if d.get('validation_status') == 'approved')
        
        # Recent activity (Top 5)
        recent_activity = documents[:5]
        
        return {
            "stats": {
                "total": total_docs,
                "processing": processing,
                "needs_verification": needs_verification,
                "verified": verified
            },
            "recent_activity": recent_activity
        }
    except Exception as e:
        logger.error(f"Error fetching dashboard stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))
