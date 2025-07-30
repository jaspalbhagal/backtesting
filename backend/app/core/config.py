from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALGORITHM: str = "HS256"
    API_V1_STR : str="/api/v1"
    PROJECT_NAME: str = "FastAPI Production App"
    
    # CORS
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:8000"]
    
    

    # ✅ Add these
    SECRET_KEY: str
    DATABASE_URL: str

    class Config:
        env_file=".env"
        case_sensitive=True
settings = Settings()