import os
import joblib
import numpy as np
import logging

logger = logging.getLogger(__name__)

# Agricultural knowledge dictionary for localized recommendations & Malayalam translation
CROP_KNOWLEDGE = {
    "rice": {
        "name_en": "Rice (நெൽ / നെല്ല്)",
        "name_ml": "നെല്ല് (Rice)",
        "reason_en": "High nitrogen & moisture with heavy rainfall in alluvial soil ideal for paddy cultivation.",
        "reason_ml": "ധാരാളം നൈട്രജനും ഈർപ്പവും സമൃദ്ധമായ മഴയും ലഭിക്കുന്ന നെൽക്കൃഷിക്ക് മികച്ച മണ്ണാണ് താങ്കളുടേത്.",
        "guidance_en": "Maintain 5-7cm water level during tillering. Apply 100:50:50 NPK fertilizer in split doses. Watch out for stem borer and blast disease.",
        "guidance_ml": "ഞാറു നടീൽ ഘട്ടത്തിൽ 5-7 സെ.മീ വെള്ളം നിലനിർത്തുക. NPK വളങ്ങൾ ഗഡുക്കളായി നൽകുക. തണ്ട് തുരപ്പൻ കീടത്തിനെതിരെ ജാഗ്രത പാലിക്കുക."
    },
    "coconut": {
        "name_en": "Coconut (തെങ്ങ്)",
        "name_ml": "തെങ്ങ് (Coconut)",
        "reason_en": "Balanced NPK and high humidity in coastal/sandy loam soil suited for coconut palms.",
        "reason_ml": "കേരളത്തിലെ കാലാവസ്ഥയ്ക്കും മണൽ കലർന്ന മണ്ണിലും സമൃദ്ധമായി വളരുന്ന വിളയാണ് തെങ്ങ്.",
        "guidance_en": "Apply 500g N, 320g P2O5, 1200g K2O per palm annually with organic compost during monsoon. Ensure basin irrigation in summer.",
        "guidance_ml": "വർഷത്തിൽ 500 ഗ്രാം നൈട്രജൻ, 320 ഗ്രാം ഫോസ്ഫറസ്, 1200 ഗ്രാം പൊട്ടാഷ് നൽകുക. വേനൽക്കാലത്ത് തടം തുറന്ന് നനയ്ക്കുക."
    },
    "banana": {
        "name_en": "Banana (വാഴ /  നേന്ത്രൻ)",
        "name_ml": "നേന്ത്രവാഴ (Banana)",
        "reason_en": "High Potassium requirement and rich organic soil ideal for Nendran / Robusta banana.",
        "reason_ml": "പൊട്ടാഷ് ധാരാളമുള്ള മണ്ണും ആവശ്യത്തിന് ഈർപ്പവും നേന്ത്രവാഴ കൃഷിക്ക് അത്യുത്തമമാണ്.",
        "guidance_en": "Plant at 2m x 2m spacing. Apply 300g N, 115g P, 450g K per plant. Prop with bamboo poles after flowering to protect against monsoon winds.",
        "guidance_ml": "2 മീറ്റർ അകലത്തിൽ തൈകൾ നടുക. കുലവന്ന ശേഷം കാറ്റിൽ ഒടിയാതിരിക്കാൻ മുളകൊണ്ടു താങ്ങ് നൽകുക."
    },
    "black_pepper": {
        "name_en": "Black Pepper (കുരുമുളക്)",
        "name_ml": "കുരുമുളക് (Black Pepper)",
        "reason_en": "High rainfall, tropical shade, and well-drained loamy soil suitable for King of Spices.",
        "reason_ml": "മഴയും ഭാഗികമായ തണലും നല്ല നീർവാർച്ചയുള്ള മണ്ണും കുരുമുളക് കൃഷിക്ക് അനുയോജ്യമാണ്.",
        "guidance_en": "Train vines on Erythrina or Silver Oak. Apply trichoderma enriched neem cake to prevent quick wilt disease.",
        "guidance_ml": "താങ്ങുമരങ്ങളിൽ വള്ളികൾ പടർത്തുക. ദ്രുതവാട്ടം തടയാൻ ട്രൈക്കോഡെർമ ചേർത്ത പിണ്ണാക്ക് നൽകുക."
    },
    "rubber": {
        "name_en": "Rubber (റബ്ബർ)",
        "name_ml": "റബ്ബർ (Rubber)",
        "reason_en": "Acidic soil pH and high annual rainfall ideal for Para rubber tree plantations in Kerala.",
        "reason_ml": "അമ്ലത്വമുള്ള മണ്ണും കനത്ത മഴ ലഭിക്കുന്ന മലയോര പ്രദേശങ്ങളും റബ്ബർ കൃഷിക്ക് അനുകൂലമാണ്.",
        "guidance_en": "Ensure proper rain-guarding during monsoon before tapping. Apply NPK 10:10:4:1.5 mixture.",
        "guidance_ml": "മഴക്കാലത്ത് റെയിൻ ഗാർഡിംഗ് നടത്തുക. ക്രമമായി പാൽ വെട്ടുന്നതിനു മുൻപ് തടം വളമിടുക."
    },
    "tapioca": {
        "name_en": "Tapioca / Cassava (കപ്പ / മരച്ചീനി)",
        "name_ml": "മരച്ചീനി / കപ്പ (Tapioca)",
        "reason_en": "Drought tolerant crop thriving in well-drained laterite soil with moderate potassium.",
        "reason_ml": "കേരളത്തിലെ ചെങ്കൽ മണ്ണിൽ കുറഞ്ഞ നനവിൽ പോലും നല്ല വിളവ് തരുന്ന കിഴങ്ങുവർഗ്ഗമാണ് മരച്ചീനി.",
        "guidance_en": "Plant healthy stems cut to 15-20cm vertically. Apply organic manure at planting and potash after 45 days.",
        "guidance_ml": "15-20 സെ.മീ തണ്ടുകൾ നിവർത്തി നടുക. 45 ദിവസത്തിന് ശേഷം പൊട്ടാഷ് വളം നൽകുക."
    },
    "cardamom": {
        "name_en": "Cardamom (ഏലം)",
        "name_ml": "ഏലം (Cardamom)",
        "reason_en": "High altitude, cool shade temperature (15-26°C), and forest loam rich in organic matter.",
        "reason_ml": "ഹൈറേഞ്ച് മേഖലകളിലെ തണുപ്പുള്ള കാലാവസ്ഥയും വനമണ്ണും ഏലക്കൃഷിക്ക് അത്യന്താപേക്ഷിതമാണ്.",
        "guidance_en": "Maintain 50% shade cover. Ensure shade management before monsoon. Keep soil moist through drip irrigation.",
        "guidance_ml": "50% തണൽ നിലനിർത്തുക. വേനലിൽ ഡ്രിപ്പ് ഇറിഗേഷൻ വഴി ജലസേചനം നടത്തുക."
    },
    "coffee": {
        "name_en": "Coffee (കാപ്പി)",
        "name_ml": "കാപ്പി (Coffee)",
        "reason_en": "Cool highland climate with shaded slope terrain suitable for Robusta/Arabica coffee.",
        "reason_ml": "വയനാട്, ഇടുക്കി മേഖലകളിലെ മലയോര കാലാവസ്ഥയും നിഴലും കാപ്പി കൃഷിക്ക് മികച്ചതാണ്.",
        "guidance_en": "Prune sucker branches annually. Apply lime if soil pH drops below 5.2. Control mealybugs.",
        "guidance_ml": "അനാവശ്യ ചില്ലകൾ മാറ്റുക (Pruning). മണ്ണിലെ അമ്ലത്വം കുറയ്ക്കാൻ കുമ്മായം ചേർക്കുക."
    },
    "tea": {
        "name_en": "Tea (തേയില)",
        "name_ml": "തേയില (Tea)",
        "reason_en": "Strongly acidic soil (pH 4.5-5.5) and misty cool weather in high altitudes like Munnar.",
        "reason_ml": "മൂന്നാർ പോലുള്ള ഉയർന്ന പ്രദേശങ്ങളിലെ തണുപ്പുള്ള കാലാവസ്ഥയും അമ്ലത്വമുള്ള മണ്ണും തേയിലയ്ക്ക് അനുയോജ്യമാണ്.",
        "guidance_en": "Pluck top two leaves and a bud every 7-10 days. Maintain drainage channels to avoid root rot.",
        "guidance_ml": "രണ്ടു ഇലയും ഒരു മുകുളവും വീതം പറിച്ചെടുക്കുക. നീർവാർച്ച ഉറപ്പാക്കുക."
    },
    "maize": {
        "name_en": "Maize (ചോളം)",
        "name_ml": "ചോളം (Maize)",
        "reason_en": "Moderate rainfall and warm climate suitable for short duration grain/fodder crop.",
        "reason_ml": "മിതമായ മഴയും നല്ല വെയിലും ലഭിക്കുന്ന പ്രദേശങ്ങളിൽ ചോളം നന്നായി വളരുന്നു.",
        "guidance_en": "Sow at 60cm x 20cm spacing. Protect young shoots from fall armyworm.",
        "guidance_ml": "ചാലുകൾ എടുത്ത് വിത്ത് പാകുക. പുഴുക്കളുടെ ആക്രമണത്തിനെതിരെ ശ്രദ്ധിക്കുക."
    },
    "ginger": {
        "name_en": "Ginger (ഇഞ്ചി)",
        "name_ml": "ഇഞ്ചി (Ginger)",
        "reason_en": "Rich humus content in friable soil with high humidity suitable for spice crops.",
        "reason_ml": "ജൈവാംശമുള്ള ഇളകിയ മണ്ണിൽ ഇഞ്ചി കൃഷി ചെയ്യുന്നത് മികച്ച വിളവ് നൽകും.",
        "guidance_en": "Mulch beds with green leaves heavily. Prevent soft rot by treating seed rhizomes with pseudomonas.",
        "guidance_ml": "തടങ്ങളിൽ പച്ചിലകൾ കൊണ്ട് നന്നായി പുതയിടുക. അഴുകൽ രോഗം തടയാൻ സ്യൂഡോമോണസ് ഉപയോഗിക്കുക."
    },
    "turmeric": {
        "name_en": "Turmeric (മഞ്ഞൾ)",
        "name_ml": "മഞ്ഞൾ (Turmeric)",
        "reason_en": "Warm humid environment with well-drained sandy loam soil suitable for high curcumin yield.",
        "reason_ml": "ചൂടും ഈർപ്പവുമുള്ള കാലാവസ്ഥ മഞ്ഞൾ കൃഷിക്ക് അത്യുത്തമമാണ്.",
        "guidance_en": "Plant rhizomes in raised beds during April-May. Apply cow dung compost and wood ash.",
        "guidance_ml": "ഏപ്രിൽ-മേയ് മാസങ്ങളിൽ മണ്ണൊരുക്കി വിത്തു മഞ്ഞൾ നടുക. ചാണകപ്പൊടിയും ചാരവും നൽകുക."
    },
    "cashew": {
        "name_en": "Cashew (കശുവണ്ടി)",
        "name_ml": "കശുവണ്ടി (Cashew)",
        "reason_en": "Low water requirement and hardy nature in hilly laterite soils of northern Kerala.",
        "reason_ml": "കുറഞ്ഞ ജലസേചനത്തിൽ കുന്നിൻ പ്രദേശങ്ങളിലെ മണ്ണിൽ നന്നായി വളരുന്ന വിളയാണ് കശുവണ്ടി.",
        "guidance_en": "Prune lower branches up to 2m. Spray carbaryl during flowering to prevent tea mosquito bug.",
        "guidance_ml": "പൂക്കുന്ന സമയത്ത് തേയിലക്കൊതുകിന്റെ ആക്രമണം തടയാൻ ജൈവ കീടനാശിനി തളിക്കുക."
    },
    "arecanut": {
        "name_en": "Arecanut (കവുങ്ങ് / അടയ്ക്ക)",
        "name_ml": "കവുങ്ങ് (Arecanut)",
        "reason_en": "Deep clay loam soil with high water holding capacity and regular irrigation.",
        "reason_ml": "നല്ല നീർവാർച്ചയും നനയുമുള്ള താഴ്‌വര പ്രദേശങ്ങളിൽ കവുങ്ങ് കൃഷി വളരെ ലാഭകരമാണ്.",
        "guidance_en": "Apply Bordeaux mixture before monsoon to prevent mahali (fruit rot) disease.",
        "guidance_ml": "കാലവർഷത്തിന് മുൻപ് മഹാളി രോഗം തടയാൻ ബോർഡോ മിശ്രിതം തളിക്കുക."
    }
}

class CropRecommendationEngine:
    def __init__(self):
        self.model = None
        self.is_demo = True
        self.load_model()

    def load_model(self):
        possible_paths = [
            "backend/app/ml/crop_recommendation_model.pkl",
            "ml/models/crop_recommendation_model.pkl",
            "app/ml/crop_recommendation_model.pkl"
        ]
        for path in possible_paths:
            if os.path.exists(path):
                try:
                    self.model = joblib.load(path)
                    self.is_demo = False
                    logger.info(f"Loaded ML model successfully from {path}")
                    return
                except Exception as e:
                    logger.error(f"Error loading ML model from {path}: {e}")
        
        logger.warning("ML model file not found or failed to load. Operating in Demo/Fallback Rule Mode.")
        self.is_demo = True

    def predict(self, N: float, P: float, K: float, temp: float, hum: float, ph: float, rain: float):
        if self.model is not None:
            try:
                features = np.array([[N, P, K, temp, hum, ph, rain]])
                pred = self.model.predict(features)[0]
                proba = self.model.predict_proba(features)
                confidence = float(np.max(proba)) * 100
                crop_key = str(pred).lower()
            except Exception as e:
                logger.error(f"ML prediction error: {e}")
                crop_key, confidence = self._rule_based_fallback(N, P, K, temp, hum, ph, rain)
        else:
            crop_key, confidence = self._rule_based_fallback(N, P, K, temp, hum, ph, rain)

        details = CROP_KNOWLEDGE.get(crop_key, {
            "name_en": crop_key.capitalize(),
            "name_ml": f"{crop_key.capitalize()} (വിള)",
            "reason_en": f"Soil NPK ({N},{P},{K}) and rainfall {rain}mm match this crop requirements.",
            "reason_ml": f"മണ്ണിലെ പോഷകനിലയും മഴയുടെ അളവും ഈ വിളയ്ക്ക് അനുയോജ്യമാണ്.",
            "guidance_en": "Ensure proper weed control, organic composting, and pest monitoring.",
            "guidance_ml": "കൃത്യമായ വളപ്രയോഗവും നീർവാർച്ചയും ഉറപ്പാക്കുക."
        })

        return {
            "recommended_crop": details["name_en"],
            "recommended_crop_ml": details["name_ml"],
            "confidence_score": round(confidence, 1),
            "reasoning": details["reason_en"],
            "reasoning_ml": details["reason_ml"],
            "guidance": details["guidance_en"],
            "guidance_ml": details["guidance_ml"],
            "is_demo_model": self.is_demo,
            "model_version": "RandomForest-v1.0" if not self.is_demo else "RuleEngine-Fallback"
        }

    def _rule_based_fallback(self, N, P, K, temp, hum, ph, rain):
        if rain > 1800 and N > 50:
            return "rice", 92.5
        elif hum > 75 and K > 40:
            return "coconut", 89.0
        elif K > 80 and temp > 24:
            return "banana", 87.4
        elif rain > 1600 and temp < 28:
            return "black_pepper", 85.0
        elif ph < 5.8 and temp < 24:
            return "tea", 88.0
        else:
            return "tapioca", 82.0

crop_engine = CropRecommendationEngine()
