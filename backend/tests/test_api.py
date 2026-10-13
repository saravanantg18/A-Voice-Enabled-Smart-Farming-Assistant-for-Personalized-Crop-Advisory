import os
import sys
import pytest
from fastapi.testclient import TestClient

# Ensure app is in python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app
from app.config import settings

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_auth_register_and_login():
    email = "farmer_test@kerala.org"
    password = "password123"
    
    # Register
    reg_res = client.post(
        f"{settings.API_V1_STR}/auth/register",
        json={
            "email": email,
            "password": password,
            "full_name": "Raman Nair",
            "phone": "9847012345",
            "district": "Palakkad",
            "preferred_language": "ml"
        }
    )
    assert reg_res.status_code in [200, 400] # 400 if already created in previous run

    # Login
    login_res = client.post(
        f"{settings.API_V1_STR}/auth/login",
        json={"email": email, "password": password}
    )
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    assert token is not None

    return token

def test_crop_recommendation_and_services():
    token = test_auth_register_and_login()
    headers = {"Authorization": f"Bearer {token}"}

    # Test ML Crop Recommendation
    crop_res = client.post(
        f"{settings.API_V1_STR}/crop/recommend",
        json={
            "nitrogen": 80.0,
            "phosphorus": 50.0,
            "potassium": 40.0,
            "temperature": 26.5,
            "humidity": 85.0,
            "ph": 6.2,
            "rainfall": 2300.0
        },
        headers=headers
    )
    assert crop_res.status_code == 200
    data = crop_res.json()
    assert "recommended_crop" in data
    assert "guidance" in data
    assert data["confidence_score"] > 0

    # Test Weather API
    w_res = client.get(f"{settings.API_V1_STR}/weather?district=Palakkad", headers=headers)
    assert w_res.status_code == 200
    assert w_res.json()["district"] == "Palakkad"

    # Test Market Prices API
    m_res = client.get(f"{settings.API_V1_STR}/market-prices", headers=headers)
    assert m_res.status_code == 200
    assert len(m_res.json()) > 0

    # Test Chatbot
    chat_res = client.post(
        f"{settings.API_V1_STR}/chat",
        json={
            "query": "എന്റെ മണ്ണിന് ഏത് വിളയാണ് അനുയോജ്യം?",
            "language": "ml",
            "is_voice": True
        },
        headers=headers
    )
    assert chat_res.status_code == 200
    assert "response_text_ml" in chat_res.json()

    # Test Alerts
    alert_res = client.get(f"{settings.API_V1_STR}/alerts", headers=headers)
    assert alert_res.status_code == 200
    assert len(alert_res.json()) > 0
