from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.domain import FarmerProfile
from app.schemas.schemas import FarmerProfileResponse, FarmerProfileUpdate
from app.auth.security import get_current_farmer_profile

router = APIRouter(prefix="/farmer", tags=["Farmer Profile"])

@router.get("/profile", response_model=FarmerProfileResponse)
def get_profile(profile: FarmerProfile = Depends(get_current_farmer_profile)):
    return profile

@router.put("/profile", response_model=FarmerProfileResponse)
def update_profile(
    profile_update: FarmerProfileUpdate,
    profile: FarmerProfile = Depends(get_current_farmer_profile),
    db: Session = Depends(get_db)
):
    for field, value in profile_update.dict(exclude_unset=True).items():
        setattr(profile, field, value)
    db.commit()
    db.refresh(profile)
    return profile
