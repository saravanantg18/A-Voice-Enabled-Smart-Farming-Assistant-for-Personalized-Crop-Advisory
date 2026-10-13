from fastapi import APIRouter
from typing import List
from app.schemas.schemas import MarketPriceItem
from app.services.market_service import get_market_prices

router = APIRouter(prefix="/market-prices", tags=["Market Prices"])

@router.get("", response_model=List[MarketPriceItem])
def get_prices():
    return get_market_prices()
