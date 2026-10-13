# A Voice-Enabled Smart Farming Assistant for Personalized Crop Advisory

[![Python FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React Vite](https://img.shields.io/badge/React-18+-61DAFB.svg?style=flat&logo=react)](https://reactjs.org/)
[![Scikit-Learn ML](https://img.shields.io/badge/scikit--learn-RandomForest-F7931E.svg?style=flat&logo=scikit-learn)](https://scikit-learn.org/)
[![Malayalam STT/TTS](https://img.shields.io/badge/Voice-Malayalam%20STT%2FTTS-10B981.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

A complete full-stack AI-powered smart farming decision support system built specifically for smallholder farmers in Kerala with low digital literacy. The system enables farmers to communicate using **Malayalam voice input** and receive personalized crop recommendations, irrigation advice, fertilizer schedules, weather alerts, and market prices via text and audio responses.

---

## 🌟 Key Features

1. **Malayalam Voice Assistant (Main Feature)**
   - Press a large, high-visibility microphone button to speak questions in Malayalam (`ml-IN`).
   - Web Speech API integration with real-time text-to-speech (`ml-IN` SpeechSynthesis) audio playback.
   - Text-input fallback for environments without browser speech recognition.
   - Intent classification engine handling questions like:
     - “എന്റെ മണ്ണിന് ഏത് വിളയാണ് അനുയോജ്യം?” (Which crop fits my soil?)
     - “ഇന്ന് മഴ പെയ്യുമോ?” (Will it rain today?)
     - “നെല്ലിന് എത്ര വെള്ളം വേണം?” (How much water is needed for paddy?)
     - “എന്റെ വിളയ്ക്ക് എന്ത് വളം ഉപയോഗിക്കണം?” (What fertilizer to apply?)

2. **AI Crop Recommendation Engine (Machine Learning)**
   - Random Forest Classifier trained on soil parameters (N, P, K, pH, moisture, temperature, rainfall).
   - Tailored specifically for Kerala crops (*Rice, Coconut, Nendran Banana, Black Pepper, Rubber, Tapioca, Cardamom, Coffee, Tea, Maize, Ginger, Turmeric, Cashew, Arecanut*).
   - Generates confidence scores, localized Malayalam reasons, and agricultural management guidance.

3. **Agri-Weather & Advisory Module**
   - Kerala district weather forecasts (Palakkad, Wayanad, Alappuzha, Kottayam, Thrissur, Idukki, Kozhikode, etc.).
   - OpenWeatherMap API integration structure with rich regional fallback database.
   - Customized agricultural advisories per district weather condition.

4. **Market Price Module (AGMARKNET & eNAM)**
   - Wholesale market prices from Kerala APMCs (Palakkad Jaya Paddy, Wayanad Pepper, Kozhikode Coconut, Kottayam Rubber, Thrissur Nendran Banana).
   - Price trend indicators (Upward ▲, Downward ▼, Stable ▬).

5. **Personalized Farming Alerts**
   - Weather warnings (heavy rain, wind).
   - Pest outbreak alerts (Stem borer, quick wilt).
   - Market price spike notifications.
   - Government subsidy scheme announcements (Krishi Bhavan organic compost subsidy).

6. **Farmer Profile & Soil Data Manager**
   - Secure JWT authentication with PBKDF2-SHA256 password hashing.
   - Soil NPK and pH parameter management.

---

## 🏗️ System Architecture

```
                       Farmer
                          │
                React.js Frontend (Vite + Tailwind)
                          │
             ┌────────────┴────────────┐
       Malayalam Voice            Text Fallback
             └────────────┬────────────┘
                          ▼
                 FastAPI Backend
                          │
       ┌──────────────────┼──────────────────┐
       ▼                  ▼                  ▼
  JWT Security     Data Layer (ORM)   Intent Processor
       │                  │                  │
       ▼                  ▼                  ▼
  SQLite Database   Farmer/Soil Profile  ML Engine (RandomForest)
                                             │
                                             ▼
                                  External Services (Weather/Market)
                                             │
                                             ▼
                                  Malayalam Text & Audio Response
```

---

## 📁 Folder Structure

```
voice/
├── backend/
│   ├── app/
│   │   ├── api/routers/      # REST API endpoints (auth, soil, crop, weather, market, chat, voice, alerts)
│   │   ├── auth/             # JWT security & PBKDF2 password hashing
│   │   ├── database/         # SQLAlchemy engine & SQLite session
│   │   ├── ml/               # Trained Random Forest model artifact (.pkl)
│   │   ├── models/           # SQLAlchemy ORM domain models
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── services/         # ML recommendation, Weather, Market, Chatbot, Alert services
│   │   ├── config.py         # App settings & env reader
│   │   └── main.py           # FastAPI entrypoint
│   ├── tests/                # Automated pytest suite
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/       # Navbar, NavigationTabs
│   │   ├── context/          # AuthContext & Language state
│   │   ├── pages/            # Landing, Login, Register, Dashboard, VoiceAssistant, CropRecommend, WeatherPage, SoilInfo, MarketPage, AlertsPage, ProfilePage
│   │   ├── services/         # Axios API client & Malayalam Voice Assistant service
│   │   ├── App.jsx
│   │   └── index.css         # Agricultural theme tokens & animations
│   ├── package.json
│   └── vite.config.js
├── ml/
│   ├── dataset/              # Generated crop dataset CSV
│   ├── training/             # train_model.py script
│   └── models/               # crop_recommendation_model.pkl
├── .env.example
└── README.md
```

---

## 🚀 Step-by-Step Setup & Execution Commands

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Train the ML Model
```bash
# From project root:
python ml/training/train_model.py
```
*Output: Saves Random Forest trained model `crop_recommendation_model.pkl` to `backend/app/ml/`.*

---

### 2. Start Backend (FastAPI Server)
```bash
# Open Terminal 1 (from project root):
python -m uvicorn app.main:app --reload --app-dir backend --host 127.0.0.1 --port 8000
```
- API Documentation: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- Base API Endpoint: [http://127.0.0.1:8000/api/v1](http://127.0.0.1:8000/api/v1)

---

### 3. Run Backend Tests
```bash
# In Terminal 1 or new terminal:
pytest backend/tests/test_api.py
```

---

### 4. Start Frontend (React + Vite)
```bash
# Open Terminal 2:
cd frontend
npm run dev
```
- Local Application URL: [http://localhost:5173](http://localhost:5173)

---

## 🔑 Demo Mode & Environment Variables

Create `.env` in the root folder (or copy `.env.example`):
```env
PROJECT_NAME="A Voice-Enabled Smart Farming Assistant"
SECRET_KEY="smart_farming_assistant_secret_key_kerala_2026"
DATABASE_URL="sqlite:///./smart_farming.db"
WEATHER_API_KEY=""  # Optional: Enter OpenWeather API Key for live weather
DEMO_MODE="True"
```

*Note: In DEMO MODE, realistic Kerala agricultural datasets (AGMARKNET prices & Kerala district weather advisories) are utilized so the system is fully functional offline.*

---

## 🧪 Verified User Flow

1. Register new farmer / Login with default credentials (`farmer_test@kerala.org` / `password123`).
2. Navigate to **Soil Data** and enter NPK & pH test values.
3. Open **Dashboard** to view live district weather, crop advisories, and price trends.
4. Click **🎤 "Ask Your Farming Assistant"** to launch Malayalam Voice Assistant.
5. Speak in Malayalam or click a sample question chip.
6. System processes context (Farmer + Soil + Weather + ML Model) and responds with Malayalam text and **Audio Speech**.
7. Navigate to **Crop Advisory** to run Random Forest ML prediction with custom parameters.
