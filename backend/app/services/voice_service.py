import logging
import base64

logger = logging.getLogger(__name__)

def generate_voice_payload(text_ml: str) -> str:
    """
    Returns voice metadata/payload.
    In browser, WebSpeech API (SpeechSynthesisUtterance) is used for native Malayalam voice playback.
    This helper returns a encoded string or identifier for client-side audio rendering fallback.
    """
    try:
        # Encode Malayalam text so frontend can synthesize or play via audio fallback
        encoded = base64.b64encode(text_ml.encode('utf-8')).decode('utf-8')
        return encoded
    except Exception as e:
        logger.error(f"Voice generation error: {e}")
        return ""
