from typing import List
from app.schemas.schemas import AlertResponse
from datetime import datetime

DEFAULT_ALERTS = [
    {
        "id": 1,
        "title": "Heavy Rain & Wind Warning",
        "title_ml": "കനത്ത മഴ മുന്നറിയിപ്പ്",
        "message": "High rainfall (over 45mm) expected in next 24 hours. Rain-guard rubber trees and prop banana plants.",
        "message_ml": "അടുത്ത 24 മണിക്കൂറിനുള്ളിൽ കനത്ത മഴയ്ക്ക് സാധ്യത. വാഴകൾക്ക് താങ്ങ് നൽകുക, റബ്ബറിന് റെയിൻ ഗാർഡ് ഇടുക.",
        "category": "weather",
        "severity": "warning",
        "is_read": False,
        "created_at": datetime.utcnow()
    },
    {
        "id": 2,
        "title": "Pest Outbreak Alert: Stem Borer",
        "title_ml": "കീടബാധ മുന്നറിയിപ്പ്: തണ്ട് തുരപ്പൻ",
        "message": "Paddy fields in your area reporting stem borer infestation. Apply Neem oil spray 5ml/L immediately.",
        "message_ml": "നെൽവയലുകളിൽ തണ്ട് തുരപ്പൻ പുഴുക്കളുടെ സാന്നിധ്യം റിപ്പോർട്ട് ചെയ്തിട്ടുണ്ട്. വേപ്പെണ്ണ മിശ്രിതം തളിക്കുക.",
        "category": "pest",
        "severity": "alert",
        "is_read": False,
        "created_at": datetime.utcnow()
    },
    {
        "id": 3,
        "title": "Rice Price Increase on AGMARKNET",
        "title_ml": "നെല്ല് വിപണി വില വർദ്ധിച്ചു",
        "message": "Palakkad APMC market rice prices increased by ₹150/quintal to ₹3,150. Good time to sell harvest.",
        "message_ml": "പാലക്കാട് മാർക്കറ്റിൽ നെല്ലിന്റെ വില ക്വിന്റലിന് ₹150 വർദ്ധിച്ച് ₹3,150 ആയി. വിളവ് വിൽക്കാൻ അനുയോജ്യമായ സമയം.",
        "category": "market",
        "severity": "info",
        "is_read": True,
        "created_at": datetime.utcnow()
    },
    {
        "id": 4,
        "title": "Subsidized Organic Fertilizer Scheme",
        "title_ml": "സർക്കാർ ജൈവവള സബ്സിഡി പദ്ധതി",
        "message": "Kerala Agriculture Dept announced 50% subsidy on organic compost and trichoderma for registered farmers.",
        "message_ml": "കൃഷിവകുപ്പിന്റെ 50% സബ്സിഡിയോടു കൂടിയ ജൈവവള വിതരണം ആരംഭിച്ചു. കൃഷി ഭവനുമായി ബന്ധപ്പെടുക.",
        "category": "scheme",
        "severity": "info",
        "is_read": False,
        "created_at": datetime.utcnow()
    }
]

def get_farmer_alerts(farmer_id: int) -> List[dict]:
    return DEFAULT_ALERTS
