from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("FarmerProfile", back_populates="user", uselist=False)

class FarmerProfile(Base):
    __tablename__ = "farmer_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    phone = Column(String, nullable=True)
    district = Column(String, default="Palakkad") # e.g. Palakkad, Wayanad, Alappuzha
    location = Column(String, default="Kerala, India")
    preferred_language = Column(String, default="ml") # 'ml' for Malayalam, 'en' for English
    farm_size_acres = Column(Float, default=2.5)
    current_crop = Column(String, default="Rice")
    soil_type = Column(String, default="Alluvial / Red Soil")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profile")
    soil_records = relationship("SoilData", back_populates="farmer")
    recommendations = relationship("CropRecommendation", back_populates="farmer")
    chats = relationship("ChatMessage", back_populates="farmer")
    alerts = relationship("Alert", back_populates="farmer")

class SoilData(Base):
    __tablename__ = "soil_data"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmer_profiles.id"))
    soil_type = Column(String, nullable=False)
    nitrogen = Column(Float, nullable=False) # N
    phosphorus = Column(Float, nullable=False) # P
    potassium = Column(Float, nullable=False) # K
    ph = Column(Float, nullable=False)
    moisture = Column(Float, default=65.0)
    temperature = Column(Float, default=27.5)
    rainfall = Column(Float, default=2200.0)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    farmer = relationship("FarmerProfile", back_populates="soil_records")

class CropRecommendation(Base):
    __tablename__ = "crop_recommendations"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmer_profiles.id"))
    recommended_crop = Column(String, nullable=False)
    confidence_score = Column(Float, nullable=False)
    reasoning = Column(Text, nullable=False)
    guidance = Column(Text, nullable=False)
    input_parameters = Column(Text, nullable=True) # JSON representation of inputs
    created_at = Column(DateTime, default=datetime.utcnow)

    farmer = relationship("FarmerProfile", back_populates="recommendations")

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmer_profiles.id"))
    query_text = Column(Text, nullable=False)
    response_text = Column(Text, nullable=False)
    response_audio_url = Column(String, nullable=True)
    language = Column(String, default="ml")
    is_voice = Column(Boolean, default=False)
    intent = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    farmer = relationship("FarmerProfile", back_populates="chats")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmer_profiles.id"))
    title = Column(String, nullable=False)
    title_ml = Column(String, nullable=True)
    message = Column(Text, nullable=False)
    message_ml = Column(Text, nullable=True)
    category = Column(String, default="weather") # weather, pest, irrigation, market, scheme
    severity = Column(String, default="warning") # info, warning, alert
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    farmer = relationship("FarmerProfile", back_populates="alerts")
