from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.models.domain import SoilData, FarmerProfile
from app.schemas.schemas import SoilDataCreate, SoilDataResponse
from app.auth.security import get_current_farmer_profile

router = APIRouter(prefix="/soil", tags=["Soil Information"])

@router.post("", response_model=SoilDataResponse)
def create_soil_record(
    soil_in: SoilDataCreate,
    profile: FarmerProfile = Depends(get_current_farmer_profile),
    db: Session = Depends(get_db)
):
    record = SoilData(
        farmer_id=profile.id,
        soil_type=soil_in.soil_type,
        nitrogen=soil_in.nitrogen,
        phosphorus=soil_in.phosphorus,
        potassium=soil_in.potassium,
        ph=soil_in.ph,
        moisture=soil_in.moisture or 65.0,
        temperature=soil_in.temperature or 28.0,
        rainfall=soil_in.rainfall or 2200.0,
        notes=soil_in.notes
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.get("", response_model=List[SoilDataResponse])
def get_soil_records(
    profile: FarmerProfile = Depends(get_current_farmer_profile),
    db: Session = Depends(get_db)
):
    records = db.query(SoilData).filter(SoilData.farmer_id == profile.id).order_by(SoilData.created_at.desc()).all()
    if not records:
        # Default initial record if none exists
        default_soil = SoilData(
            farmer_id=profile.id,
            soil_type="Clay Loam / Alluvial",
            nitrogen=75.0,
            phosphorus=45.0,
            potassium=40.0,
            ph=6.5,
            moisture=65.0,
            temperature=27.5,
            rainfall=2200.0,
            notes="Default initial soil analysis"
        )
        db.add(default_soil)
        db.commit()
        db.refresh(default_soil)
        return [default_soil]
    return records
