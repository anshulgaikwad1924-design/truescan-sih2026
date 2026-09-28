from fastapi import APIRouter, HTTPException, status

router = APIRouter(prefix="/validation", tags=["validation"])


@router.get("/")
def not_implemented_yet():
    """Placeholder — implemented in Stage 6. Kept here so the route module,
    and the folder structure it lives in, exist from Stage 1 onward."""
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="validation endpoints arrive in Stage 6",
    )
