from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.domain import ChatMessage, FarmerProfile, SoilData
from app.schemas.schemas import ChatQueryRequest, ChatQueryResponse
from app.services.chatbot_service import chatbot_engine
from app.services.voice_service import generate_voice_payload
from app.auth.security import get_current_farmer_profile

router = APIRouter(prefix="/chat", tags=["Chatbot"])

@router.post("", response_model=ChatQueryResponse)
def ask_chatbot(
    req: ChatQueryRequest,
    profile: FarmerProfile = Depends(get_current_farmer_profile),
    db: Session = Depends(get_db)
):
    # Fetch latest soil record for context
    soil = db.query(SoilData).filter(SoilData.farmer_id == profile.id).order_by(SoilData.created_at.desc()).first()
    
    farmer_ctx = {
        "district": profile.district,
        "current_crop": profile.current_crop,
        "N": soil.nitrogen if soil else 75.0,
        "P": soil.phosphorus if soil else 45.0,
        "K": soil.potassium if soil else 40.0,
        "ph": soil.ph if soil else 6.5
    }

    res = chatbot_engine.process_query(req.query, farmer_ctx)
    audio_base64 = generate_voice_payload(res["response_text_ml"])

    # Log to chat history
    chat_record = ChatMessage(
        farmer_id=profile.id,
        query_text=req.query,
        response_text=res["response_text_ml"],
        language=req.language or "ml",
        is_voice=req.is_voice or False,
        intent=res["intent"]
    )
    db.add(chat_record)
    db.commit()

    return ChatQueryResponse(
        query=res["query"],
        intent=res["intent"],
        response_text=res["response_text"],
        response_text_ml=res["response_text_ml"],
        audio_data_base64=audio_base64,
        recommendations=res.get("recommendations")
    )
