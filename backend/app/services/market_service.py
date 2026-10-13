from typing import List
from app.schemas.schemas import MarketPriceItem

KERALA_MARKET_PRICES: List[dict] = [
    {
        "crop_name": "Rice (Jaya Paddy)",
        "crop_name_ml": "നെല്ല് (ജയ തരം)",
        "market_name": "Palakkad APMC Market",
        "current_price": 3150.0,
        "previous_price": 3000.0,
        "unit": "Rs / Quintal",
        "trend": "up",
        "last_updated": "Today, 09:30 AM"
    },
    {
        "crop_name": "Coconut (Raw)",
        "crop_name_ml": "പച്ചത്തേങ്ങ",
        "market_name": "Kozhikode Coconut Market",
        "current_price": 38.0,
        "previous_price": 35.5,
        "unit": "Rs / Kg",
        "trend": "up",
        "last_updated": "Today, 10:15 AM"
    },
    {
        "crop_name": "Nendran Banana",
        "crop_name_ml": "നേന്ത്രക്കായ",
        "market_name": "Thrissur Wholesale Market",
        "current_price": 46.0,
        "previous_price": 48.0,
        "unit": "Rs / Kg",
        "trend": "down",
        "last_updated": "Today, 08:45 AM"
    },
    {
        "crop_name": "Black Pepper (Garbled)",
        "crop_name_ml": "കുരുമുളക്",
        "market_name": "Wayanad Spices APMC",
        "current_price": 645.0,
        "previous_price": 630.0,
        "unit": "Rs / Kg",
        "trend": "up",
        "last_updated": "Today, 11:00 AM"
    },
    {
        "crop_name": "Natural Rubber (RSS-4)",
        "crop_name_ml": "റബ്ബർ (RSS-4)",
        "market_name": "Kottayam Rubber Exchange",
        "current_price": 184.0,
        "previous_price": 184.0,
        "unit": "Rs / Kg",
        "trend": "stable",
        "last_updated": "Today, 11:30 AM"
    },
    {
        "crop_name": "Green Cardamom",
        "crop_name_ml": "ഏലക്കായ് (പച്ച)",
        "market_name": "Bodinayakanur / Spices Board Idukki",
        "current_price": 2450.0,
        "previous_price": 2380.0,
        "unit": "Rs / Kg",
        "trend": "up",
        "last_updated": "Today, 10:00 AM"
    },
    {
        "crop_name": "Tapioca (Fresh)",
        "crop_name_ml": "മരച്ചീനി (പച്ച)",
        "market_name": "Thiruvananthapuram APMC",
        "current_price": 22.0,
        "previous_price": 24.0,
        "unit": "Rs / Kg",
        "trend": "down",
        "last_updated": "Today, 09:00 AM"
    }
]

def get_market_prices() -> List[MarketPriceItem]:
    return [MarketPriceItem(**item, is_demo_data=True) for item in KERALA_MARKET_PRICES]
