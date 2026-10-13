import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Voice-Enabled Smart Farming Assistant"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "smart_farming_assistant_secret_key_kerala_2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./smart_farming.db")
    
    WEATHER_API_KEY: str = os.getenv("WEATHER_API_KEY", "")
    WEATHER_API_URL: str = os.getenv("WEATHER_API_URL", "https://api.openweathermap.org/data/2.5/weather")
    
    DEMO_MODE: bool = os.getenv("DEMO_MODE", "True").lower() in ("true", "1", "t")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
