from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import json
from app.database.session import get_db
from app.models.domain import CropRecommendation, FarmerProfile
from app.schemas.schemas import CropPredictRequest, CropRecommendationResponse
from app.services.ml_service import crop_engine
from app.auth.security import get_current_farmer_profile

router = APIRouter(prefix="/crop", tags=["Crop Recommendation"])

@router.post("/recommend", response_model=CropRecommendationResponse)
def predict_crop(
    req: CropPredictRequest,
    profile: FarmerProfile = Depends(get_current_farmer_profile),
    db: Session = Depends(get_db)
):
    prediction = crop_engine.predict(
        N=req.nitrogen,
        P=req.phosphorus,
        K=req.potassium,
        temp=req.temperature,
        hum=req.humidity,
        ph=req.ph,
        rain=req.rainfall
    )
    
    # Save recommendation in database
    rec_record = CropRecommendation(
        farmer_id=profile.id,
        recommended_crop=prediction["recommended_crop"],
        confidence_score=prediction["confidence_score"],
        reasoning=prediction["reasoning"],
        guidance=prediction["guidance"],
        input_parameters=json.dumps(req.dict())
    )
    db.add(rec_record)
    db.commit()
    db.refresh(rec_record)

    prediction["id"] = rec_record.id
    prediction["created_at"] = rec_record.created_at
    return prediction

@router.get("/recommendations", response_model=List[CropRecommendationResponse])
def get_historical_recommendations(
    profile: FarmerProfile = Depends(get_current_farmer_profile),
    db: Session = Depends(get_db)
):
    recs = db.query(CropRecommendation).filter(CropRecommendation.farmer_id == profile.id).order_by(CropRecommendation.created_at.desc()).all()
    results = []
    for r in recs:
        results.append({
            "id": r.id,
            "recommended_crop": r.recommended_crop,
            "recommended_crop_ml": f"{r.recommended_crop} (വിള)",
            "confidence_score": r.confidence_score,
            "reasoning": r.reasoning,
            "reasoning_ml": r.reasoning,
            "guidance": r.guidance,
            "guidance_ml": r.guidance,
            "is_demo_model": crop_engine.is_demo,
            "model_version": "RandomForest-v1.0",
            "created_at": r.created_at
        })
    return results
