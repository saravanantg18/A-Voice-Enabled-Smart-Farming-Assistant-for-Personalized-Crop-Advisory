from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# User Schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=4)
    full_name: str
    phone: Optional[str] = "9876543210"
    district: Optional[str] = "Palakkad"
    preferred_language: Optional[str] = "ml"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    is_active: bool

    class Config:
        from_attributes = True

# Farmer Profile Schemas
class FarmerProfileBase(BaseModel):
    phone: Optional[str] = None
    district: Optional[str] = "Palakkad"
    location: Optional[str] = "Kerala, India"
    preferred_language: Optional[str] = "ml"
    farm_size_acres: Optional[float] = 2.5
    current_crop: Optional[str] = "Rice"
    soil_type: Optional[str] = "Alluvial Soil"

class FarmerProfileUpdate(FarmerProfileBase):
    pass

class FarmerProfileResponse(FarmerProfileBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Soil Data Schemas
class SoilDataCreate(BaseModel):
    soil_type: str = "Clay Loam / Alluvial"
    nitrogen: float = Field(..., ge=0, le=200, description="Nitrogen (N) in kg/ha")
    phosphorus: float = Field(..., ge=0, le=200, description="Phosphorus (P) in kg/ha")
    potassium: float = Field(..., ge=0, le=200, description="Potassium (K) in kg/ha")
    ph: float = Field(..., ge=3.0, le=10.0, description="Soil pH level")
    moisture: Optional[float] = 65.0
    temperature: Optional[float] = 28.0
    rainfall: Optional[float] = 2100.0
    notes: Optional[str] = None

class SoilDataResponse(SoilDataCreate):
    id: int
    farmer_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# ML Crop Recommendation Schemas
class CropPredictRequest(BaseModel):
    nitrogen: float = Field(75.0, description="N value")
    phosphorus: float = Field(45.0, description="P value")
    potassium: float = Field(40.0, description="K value")
    temperature: float = Field(27.0, description="Temperature C")
    humidity: float = Field(80.0, description="Humidity %")
    ph: float = Field(6.5, description="pH level")
    rainfall: float = Field(2200.0, description="Rainfall mm")

class CropRecommendationResponse(BaseModel):
    id: Optional[int] = None
    recommended_crop: str
    recommended_crop_ml: str
    confidence_score: float
    reasoning: str
    reasoning_ml: str
    guidance: str
    guidance_ml: str
    is_demo_model: bool = False
    model_version: str = "RandomForest-v1.0"
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Weather Schemas
class WeatherDataResponse(BaseModel):
    district: str
    temperature: float
    humidity: float
    rainfall_mm: float
    condition: str
    condition_ml: str
    icon: str
    forecast: List[dict]
    advisory: str
    advisory_ml: str
    is_demo_data: bool = True

# Market Price Schemas
class MarketPriceItem(BaseModel):
    crop_name: str
    crop_name_ml: str
    market_name: str
    current_price: float
    previous_price: float
    unit: str = "Rs / Quintal"
    trend: str  # 'up', 'down', 'stable'
    last_updated: str
    is_demo_data: bool = True

# Chatbot & Voice Schemas
class ChatQueryRequest(BaseModel):
    query: str
    language: Optional[str] = "ml"
    is_voice: Optional[bool] = False

class ChatQueryResponse(BaseModel):
    query: str
    intent: str
    response_text: str
    response_text_ml: str
    audio_data_base64: Optional[str] = None
    recommendations: Optional[dict] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TranscribeRequest(BaseModel):
    audio_base64: Optional[str] = None
    language: str = "ml-IN"
    text_fallback: Optional[str] = None

class SpeakRequest(BaseModel):
    text: str
    language: str = "ml"

# Alert Schemas
class AlertResponse(BaseModel):
    id: int
    title: str
    title_ml: str
    message: str
    message_ml: str
    category: str
    severity: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True
