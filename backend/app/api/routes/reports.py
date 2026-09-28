from fastapi import APIRouter, HTTPException, status

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/")
def not_implemented_yet():
    """Placeholder — implemented in Stage 7. Kept here so the route module,
    and the folder structure it lives in, exist from Stage 1 onward."""
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="reports endpoints arrive in Stage 7",
    )
