from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Central app configuration, loaded from environment variables / .env.
    Stage 1 only needs the basics. Stage 3 adds Firebase Admin credentials,
    Stage 5 adds Gemini/OCR keys — all read the same way, never hard-coded.
    """

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "TrueScan API"
    environment: str = "development"
    cors_origins: list[str] = ["http://127.0.0.1:5173", "http://localhost:5173"]

    # Stage 3+ (left optional so Stage 1 runs with zero credentials configured)
    firebase_project_id: str | None = None
    firebase_credentials_path: str | None = None

    # Stage 5+
    gemini_api_key: str | None = None

settings = Settings()
