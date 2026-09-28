import firebase_admin
from firebase_admin import credentials, firestore, storage
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# Initialize Firebase Admin
def init_firebase():
    if not firebase_admin._apps:
        if settings.firebase_credentials_path:
            try:
                cred = credentials.Certificate(settings.firebase_credentials_path)
                firebase_admin.initialize_app(cred, {
                    'storageBucket': f"{settings.firebase_project_id}.firebasestorage.app" if settings.firebase_project_id else "truescan-dec9e.firebasestorage.app"
                })
                logger.info("Firebase Admin initialized successfully.")
            except Exception as e:
                logger.error(f"Failed to initialize Firebase Admin: {e}")
        else:
            logger.warning("FIREBASE_CREDENTIALS_PATH not set. Firebase Admin not initialized.")

init_firebase()

db = firestore.client() if firebase_admin._apps else None
bucket = storage.bucket() if firebase_admin._apps else None
