from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health")
def health_check():
    """Basic liveness check used by Stage 1 to confirm the backend is up."""
    return {"status": "ok", "service": "truescan-api"}
