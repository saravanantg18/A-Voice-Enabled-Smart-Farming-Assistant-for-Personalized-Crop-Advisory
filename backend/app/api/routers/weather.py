from fastapi import APIRouter, Depends, Query
from app.schemas.schemas import WeatherDataResponse
from app.services.weather_service import get_weather_for_district
from app.models.domain import FarmerProfile
from app.auth.security import get_current_farmer_profile

router = APIRouter(prefix="/weather", tags=["Weather"])

@router.get("", response_model=WeatherDataResponse)
def get_weather(
    district: str = Query(None, description="District name in Kerala"),
    profile: FarmerProfile = Depends(get_current_farmer_profile)
):
    target_district = district or (profile.district if profile else "Palakkad")
    return get_weather_for_district(target_district)
