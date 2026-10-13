import requests
import logging
from app.config import settings

logger = logging.getLogger(__name__)

# Sample/Fallback Weather Database for Kerala Districts
KERALA_DISTRICT_WEATHER = {
    "palakkad": {
        "temperature": 31.5,
        "humidity": 72,
        "rainfall_mm": 12.5,
        "condition": "Partly Cloudy with Light Rain",
        "condition_ml": "ഭാഗികമായി മേഘാവൃതമായ ആകാശം, നേരിയ മഴയ്ക്ക് സാധ്യത",
        "icon": "⛅",
        "advisory": "Good conditions for paddy field land preparation. Ensure proper drainage in low-lying areas.",
        "advisory_ml": "നെൽവയലുകൾ ഒരുക്കാൻ നല്ല സമയമാണ്. താഴ്ന്ന പ്രദേശങ്ങളിൽ നീർവാർച്ച ഉറപ്പാക്കുക."
    },
    "wayanad": {
        "temperature": 23.0,
        "humidity": 88,
        "rainfall_mm": 45.0,
        "condition": "Moderate to Heavy Rain",
        "condition_ml": "മിതമായത് മുതൽ കനത്ത മഴ വരെ",
        "icon": "🌧️",
        "advisory": "High risk of fungal rot in coffee & pepper. Hold fertilizer application until rain eases.",
        "advisory_ml": "കാപ്പി, കുരുമുളക് തോട്ടങ്ങളിൽ ഫംഗസ് രോഗ സാധ്യതയുണ്ട്. മഴ ശമിക്കുന്നതുവരെ വളപ്രയോഗം നടത്തരുത്."
    },
    "alappuzha": {
        "temperature": 29.8,
        "humidity": 82,
        "rainfall_mm": 18.0,
        "condition": "Humid with Scattered Showers",
        "condition_ml": "ഈർപ്പമുള്ള കാലാവസ്ഥ, ഒറ്റപ്പെട്ട മഴ",
        "icon": "🌦️",
        "advisory": "Protect Kuttanad paddy fields from backwater intrusion. Monitor leaf roller pests.",
        "advisory_ml": "കുട്ടനാടൻ നെൽപാടങ്ങളിൽ കായൽ വെള്ളം കയറാതെ സംരക്ഷിക്കുക."
    },
    "kottayam": {
        "temperature": 28.5,
        "humidity": 80,
        "rainfall_mm": 22.0,
        "condition": "Overcast with Intermittent Rain",
        "condition_ml": "ഇടവിട്ട് പെയ്യുന്ന മഴ",
        "icon": "🌧️",
        "advisory": "Rubber tapping should be rain-guarded. Ideal moisture for planting tapioca and yam.",
        "advisory_ml": "റബ്ബർ ടാപ്പിംഗിന് റെയിൻ ഗാർഡ് ഉപയോഗിക്കുക. കപ്പ നടീലിന് അനുയോജ്യമായ ഈർപ്പം."
    },
    "thrissur": {
        "temperature": 30.2,
        "humidity": 76,
        "rainfall_mm": 8.0,
        "condition": "Mostly Sunny",
        "condition_ml": "പ്രധാനമായും തെളിഞ്ഞ ആകാശം",
        "icon": "☀️",
        "advisory": "Suitable day for banana fertilization and vegetables spraying.",
        "advisory_ml": "നേന്ത്രവാഴ വളമിടലിനും പച്ചക്കറികളിൽ മരുന്ന് തളിക്കുന്നതിനും അനുയോജ്യമാണ്."
    },
    "idukki": {
        "temperature": 21.5,
        "humidity": 90,
        "rainfall_mm": 55.0,
        "condition": "Heavy Mist and Continuous Rain",
        "condition_ml": "കനത്ത മൂടൽമഞ്ഞും തുടർച്ചയായ മഴയും",
        "icon": "⛈️",
        "advisory": "Cardamom capsules rot precaution. Inspect drainage channels in hill slopes.",
        "advisory_ml": "ഏലക്കായ അഴുകൽ രോഗത്തിനെതിരെ ജാഗ്രത പാലിക്കുക. ഓടകൾ തെളിക്കുക."
    }
}

DEFAULT_WEATHER = {
    "temperature": 29.0,
    "humidity": 78,
    "rainfall_mm": 15.0,
    "condition": "Partly Cloudy",
    "condition_ml": "ഭാഗികമായി മേഘാവൃതം",
    "icon": "⛅",
    "advisory": "Regular agricultural practices can be continued with standard irrigation.",
    "advisory_ml": "സാധാരണ കൃഷിരീതികളും ജലസേചനവും തുടരാവുന്നതാണ്."
}

def get_weather_for_district(district: str) -> dict:
    dist_key = district.strip().lower()
    
    # Try fetching live data if API key is provided
    if settings.WEATHER_API_KEY and not settings.DEMO_MODE:
        try:
            params = {
                "q": f"{district},IN",
                "appid": settings.WEATHER_API_KEY,
                "units": "metric"
            }
            res = requests.get(settings.WEATHER_API_URL, params=params, timeout=5)
            if res.status_code == 200:
                data = res.json()
                temp = data["main"]["temp"]
                hum = data["main"]["humidity"]
                cond = data["weather"][0]["description"].title()
                return {
                    "district": district,
                    "temperature": temp,
                    "humidity": hum,
                    "rainfall_mm": data.get("rain", {}).get("1h", 5.0),
                    "condition": cond,
                    "condition_ml": f"{cond} (തത്സമയ കാലാവസ്ഥ)",
                    "icon": "🌤️",
                    "forecast": _get_mock_forecast(temp),
                    "advisory": f"Current weather in {district}: {cond}. Manage irrigation accordingly.",
                    "advisory_ml": f"{district} ജില്ലയിൽ നിലവിലെ അവസ്ഥ: {cond}. ജലസേചനം ക്രമീകരിക്കുക.",
                    "is_demo_data": False
                }
        except Exception as e:
            logger.error(f"Live Weather API call failed: {e}. Falling back to regional weather database.")

    # Fallback to rich Kerala regional weather data
    w = KERALA_DISTRICT_WEATHER.get(dist_key, DEFAULT_WEATHER)
    return {
        "district": district.capitalize(),
        "temperature": w["temperature"],
        "humidity": w["humidity"],
        "rainfall_mm": w["rainfall_mm"],
        "condition": w["condition"],
        "condition_ml": w["condition_ml"],
        "icon": w["icon"],
        "forecast": _get_mock_forecast(w["temperature"]),
        "advisory": w["advisory"],
        "advisory_ml": w["advisory_ml"],
        "is_demo_data": True
    }

def _get_mock_forecast(base_temp: float):
    days = ["Today", "Tomorrow", "Day 3", "Day 4", "Day 5"]
    days_ml = ["ഇന്ന്", "നാളെ", "മറ്റന്നാൾ", "ദിവസം 4", "ദിവസം 5"]
    icons = ["⛅", "🌧️", "🌦️", "☀️", "⛅"]
    forecast = []
    for i in range(5):
        t = round(base_temp + (i % 3 - 1) * 1.5, 1)
        forecast.append({
            "day": days[i],
            "day_ml": days_ml[i],
            "temp": t,
            "humidity": 75 + (i * 2) % 15,
            "rain_chance": "40%" if i in [1, 2] else "15%",
            "icon": icons[i]
        })
    return forecast
