from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.config import settings
from app.database.session import engine, Base
from app.api.routers import auth, farmer, soil, crop, weather, market, chat, voice, alerts

# Initialize DB tables
Base.metadata.create_all(bind=engine)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="A Voice-Enabled Smart Farming Assistant API for Personalized Crop Advisory in Malayalam & English."
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
prefix = settings.API_V1_STR
app.include_router(auth.router, prefix=prefix)
app.include_router(farmer.router, prefix=prefix)
app.include_router(soil.router, prefix=prefix)
app.include_router(crop.router, prefix=prefix)
app.include_router(weather.router, prefix=prefix)
app.include_router(market.router, prefix=prefix)
app.include_router(chat.router, prefix=prefix)
app.include_router(voice.router, prefix=prefix)
app.include_router(alerts.router, prefix=prefix)

@app.get("/")
def root():
    return {
        "title": settings.PROJECT_NAME,
        "status": "online",
        "version": settings.VERSION,
        "demo_mode": settings.DEMO_MODE,
        "documentation": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
