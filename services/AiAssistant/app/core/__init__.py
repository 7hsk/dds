import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    """Application settings loaded from environment variables."""
    APP_NAME: str = "DDS AI Assistant"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    
    # API Keys (for future LLM integration)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # CORS origins allowed
    CORS_ORIGINS: list = [
        "http://localhost:3000",  # Next.js dev server
        "http://localhost:3001",  # API dev server
    ]
    
    # Database URL (for fetching patient data if needed)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")

settings = Settings()
