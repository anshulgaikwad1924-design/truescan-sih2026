from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.routes import (
    health,
    documents,
    ocr,
    extraction,
    validation,
    verification,
    records,
    dashboard,
    reports,
    audit,
    repository,
)

app = FastAPI(
    title=settings.app_name,
    description=(
        "TrueScan backend — AI-assisted land record digitization and validation. "
        "This service digitizes and flags records for human review; it does not "
        "establish legal ownership or prove fraud."
    ),
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(documents.router)
app.include_router(ocr.router)
app.include_router(extraction.router)
app.include_router(validation.router)
app.include_router(verification.router)
app.include_router(records.router)
app.include_router(dashboard.router)
app.include_router(reports.router)
app.include_router(audit.router)
app.include_router(repository.router)


@app.get("/")
def root():
    return {"message": "TrueScan API — see /docs for the interactive API reference"}
