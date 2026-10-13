import re
import logging
from typing import Dict, Any
from app.services.ml_service import crop_engine
from app.services.weather_service import get_weather_for_district
from app.services.market_service import get_market_prices

logger = logging.getLogger(__name__)

class FarmingChatbotEngine:
    def __init__(self):
        pass

    def process_query(self, query: str, farmer_context: Dict[str, Any] = None) -> Dict[str, Any]:
        query_clean = query.strip().lower()
        district = farmer_context.get("district", "Palakkad") if farmer_context else "Palakkad"
        current_crop = farmer_context.get("current_crop", "Rice") if farmer_context else "Rice"
        
        # Determine intent based on keywords (Malayalam & English)
        intent = self._classify_intent(query_clean)
        
        if intent == "crop_recommendation":
            res = self._handle_crop_recommendation(farmer_context)
        elif intent == "weather":
            res = self._handle_weather(district)
        elif intent == "irrigation":
            res = self._handle_irrigation(current_crop, district)
        elif intent == "fertilizer":
            res = self._handle_fertilizer(current_crop)
        elif intent == "market_price":
            res = self._handle_market_price(current_crop)
        elif intent == "pest_disease":
            res = self._handle_pest(current_crop)
        else:
            res = self._handle_general(query, current_crop, district)

        return {
            "query": query,
            "intent": intent,
            "response_text": res["en"],
            "response_text_ml": res["ml"],
            "recommendations": res.get("data")
        }

    def _classify_intent(self, q: str) -> str:
        # Malayalam keywords
        if any(w in q for w in ["വിള", "ഏത് വിള", "കൃഷി", "മണ്ണിന്", "crop", "recommend"]):
            return "crop_recommendation"
        if any(w in q for w in ["മഴ", "കാലാവസ്ഥ", "ചൂട്", "weather", "rain", "temperature"]):
            return "weather"
        if any(w in q for w in ["വെള്ളം", "നന", "ജലസേചനം", "water", "irrigate", "irrigation"]):
            return "irrigation"
        if any(w in q for w in ["വളം", "വളപ്രയോഗം", "fertilizer", "npk", "manure"]):
            return "fertilizer"
        if any(w in q for w in ["വില", "ചന്ത", "മാർക്കറ്റ്", "price", "market", "rate"]):
            return "market_price"
        if any(w in q for w in ["രോഗം", "കീടം", "പുഴു", "വാട്ടം", "pest", "disease", "rot"]):
            return "pest_disease"
        return "general"

    def _handle_crop_recommendation(self, farmer_context: Dict[str, Any]) -> Dict[str, Any]:
        # Default soil values or from context
        N = farmer_context.get("N", 75.0) if farmer_context else 75.0
        P = farmer_context.get("P", 45.0) if farmer_context else 45.0
        K = farmer_context.get("K", 40.0) if farmer_context else 40.0
        ph = farmer_context.get("ph", 6.5) if farmer_context else 6.5
        
        prediction = crop_engine.predict(N, P, K, 27.5, 80.0, ph, 2200.0)
        crop_ml = prediction["recommended_crop_ml"]
        crop_en = prediction["recommended_crop"]
        reason_ml = prediction["reasoning_ml"]
        
        return {
            "en": f"Based on your soil conditions (N:{N}, P:{P}, K:{K}, pH:{ph}), the best crop for your farm is {crop_en}. {prediction['reasoning']}",
            "ml": f"താങ്കളുടെ മണ്ണിന്റെ പരിശോധനാ ഫലം അനുസരിച്ച് കൃഷി ചെയ്യാൻ ഏറ്റവും അനുയോജ്യമായ വിള {crop_ml} ആണ്. {reason_ml}",
            "data": prediction
        }

    def _handle_weather(self, district: str) -> Dict[str, Any]:
        w = get_weather_for_district(district)
        return {
            "en": f"Current weather in {w['district']}: {w['temperature']}°C with {w['condition']}. Humidity is {w['humidity']}%. {w['advisory']}",
            "ml": f"{w['district']} ജില്ലയിലെ ഇപ്പോഴത്തെ കാലാവസ്ഥ: {w['temperature']}°C ചൂട്, {w['condition_ml']}. ഈർപ്പം {w['humidity']}%. {w['advisory_ml']}"
        }

    def _handle_irrigation(self, current_crop: str, district: str) -> Dict[str, Any]:
        return {
            "en": f"For {current_crop} in {district}, maintain soil moisture around 65%. During rain, ensure excess water is drained off immediately.",
            "ml": f"{district} ജില്ലയിൽ {current_crop} കൃഷിക്ക് മണ്ണിൽ 65% ഈർപ്പം നിലനിർത്തുക. മഴയുള്ളപ്പോൾ അധികജലം ഒഴുക്കിക്കളയാൻ തോടുകൾ തുറന്നിടുക."
        }

    def _handle_fertilizer(self, current_crop: str) -> Dict[str, Any]:
        return {
            "en": f"For {current_crop}, apply balanced NPK in two split doses along with 5kg organic compost per plant or 25kg/cent.",
            "ml": f"{current_crop} കൃഷിക്ക് രാസവളങ്ങൾ (NPK) രണ്ട് ഗഡുക്കളായി നൽകുക. കൂടെ തടമൊന്നിന് 5 കിലോ ജൈവവളം ചേർക്കുക."
        }

    def _handle_market_price(self, current_crop: str) -> Dict[str, Any]:
        prices = get_market_prices()
        p_item = next((p for p in prices if current_crop.lower() in p.crop_name.lower()), prices[0])
        return {
            "en": f"Current market price for {p_item.crop_name} at {p_item.market_name} is ₹{p_item.current_price} ({p_item.trend}ward trend).",
            "ml": f"{p_item.market_name}-ൽ {p_item.crop_name_ml} വിപണി വില കിലോയ്ക്ക്/ക്വിന്റലിന് ₹{p_item.current_price} ആണ് (വിലയിൽ {p_item.trend} പ്രവണത)."
        }

    def _handle_pest(self, current_crop: str) -> Dict[str, Any]:
        return {
            "en": f"High humidity increases pest risk in {current_crop}. Spray Neem oil formulation (5ml/L) or organic bio-pesticide Pseudomonas as a preventive measure.",
            "ml": f"ഈർപ്പം കൂടിയ കാലാവസ്ഥയിൽ {current_crop} വിളകളിൽ പുഴുക്കളുടെ ശല്യം ഉണ്ടാകാം. പ്രതിരോധമായി വേപ്പെണ്ണ മിശ്രിതം അല്ലെങ്കിൽ സ്യൂഡോമോണസ് തളിക്കുക."
        }

    def _handle_general(self, query: str, current_crop: str, district: str) -> Dict[str, Any]:
        return {
            "en": f"Thank you for asking. For your {current_crop} farm in {district}, ensure regular weeding, organic manuring, and keep checking weather alerts.",
            "ml": f"നന്ദി. {district} ജില്ലയിലെ താങ്കളുടെ {current_crop} കൃഷിക്ക് കൃത്യസമയത്ത് ജൈവവളം നൽകുകയും കളകൾ നീക്കം ചെയ്യുകയും ചെയ്യുക."
        }

chatbot_engine = FarmingChatbotEngine()
