from fastapi import APIRouter, Depends
from typing import List
from app.schemas.schemas import AlertResponse
from app.services.alert_service import get_farmer_alerts
from app.models.domain import FarmerProfile
from app.auth.security import get_current_farmer_profile

router = APIRouter(prefix="/alerts", tags=["Alerts & Notifications"])

@router.get("", response_model=List[AlertResponse])
def get_alerts(profile: FarmerProfile = Depends(get_current_farmer_profile)):
    return get_farmer_alerts(profile.id)
