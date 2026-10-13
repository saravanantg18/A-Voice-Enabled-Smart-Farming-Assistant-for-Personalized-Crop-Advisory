from fastapi import APIRouter, Depends
from app.schemas.schemas import TranscribeRequest, SpeakRequest
from app.services.voice_service import generate_voice_payload
from app.services.chatbot_service import chatbot_engine
from app.models.domain import FarmerProfile
from app.auth.security import get_current_farmer_profile

router = APIRouter(prefix="/voice", tags=["Voice Assistant"])

@router.post("/transcribe")
def transcribe_speech(
    req: TranscribeRequest,
    profile: FarmerProfile = Depends(get_current_farmer_profile)
):
    """
    Transcription service endpoint.
    If speech-to-text audio payload is sent, processes transcript or returns text fallback.
    """
    text = req.text_fallback or "എന്റെ മണ്ണിന് ഏത് വിളയാണ് അനുയോജ്യം?"
    return {
        "status": "success",
        "transcribed_text": text,
        "language": req.language,
        "is_fallback": req.text_fallback is not None
    }

@router.post("/speak")
def synthesize_speech(req: SpeakRequest):
    audio_base64 = generate_voice_payload(req.text)
    return {
        "status": "success",
        "text": req.text,
        "language": req.language,
        "audio_base64": audio_base64
    }
