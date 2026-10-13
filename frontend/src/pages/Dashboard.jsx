import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { weatherAPI, soilAPI, cropAPI, marketAPI, alertAPI } from '../services/api';
import { 
  Mic, 
  CloudSun, 
  Sprout, 
  TestTube, 
  TrendingUp, 
  Bell, 
  Droplets, 
  ShieldAlert, 
  Award, 
  ArrowRight,
  Info,
  ChevronRight
} from 'lucide-react';

const Dashboard = ({ setActivePage }) => {
  const { user, profile, language } = useAuth();
  const [weather, setWeather] = useState(null);
  const [soil, setSoil] = useState(null);
  const [cropRec, setCropRec] = useState(null);
  const [marketPrices, setMarketPrices] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [profile]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const district = profile?.district || 'Palakkad';
      
      const [wRes, sRes, cRes, mRes, aRes] = await Promise.all([
        weatherAPI.getWeather(district),
        soilAPI.getSoilRecords(),
        cropAPI.getHistory(),
        marketAPI.getMarketPrices(),
        alertAPI.getAlerts()
      ]);

      setWeather(wRes.data);
      if (sRes.data && sRes.data.length > 0) setSoil(sRes.data[0]);
      if (cRes.data && cRes.data.length > 0) setCropRec(cRes.data[0]);
      setMarketPrices(mRes.data);
      setAlerts(aRes.data);
    } catch (e) {
      console.error('Failed to load dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner & Main Prominent Voice Assistant Launch Button */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold text-amber-300">
              <span>{profile?.district || 'Palakkad'} District Farm</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">
              {language === 'ml' 
                ? `നമസ്കാരം ${user?.full_name || 'കർഷകാ'}! 👋` 
                : `Welcome, ${user?.full_name || 'Farmer'}! 👋`}
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base max-w-xl font-medium">
              {language === 'ml'
                ? 'നിങ്ങളുടെ കൃഷിസ്ഥലത്തെ സംശയങ്ങൾ ചോദിക്കാൻ താഴെയുള്ള മൈക്രോഫോൺ ബട്ടൺ അമർത്തൂ.'
                : 'Tap the microphone button below to ask any farming question in Malayalam or English.'}
            </p>
          </div>

          {/* LARGE PROMINENT VOICE ASSISTANT BUTTON */}
          <button
            onClick={() => setActivePage('voice')}
            className="farmer-btn bg-amber-400 hover:bg-amber-300 text-slate-950 px-8 py-5 text-xl rounded-3xl font-black shadow-2xl hover:scale-105 transition-all ring-4 ring-amber-300/50 group shrink-0"
          >
            <div className="w-10 h-10 bg-slate-950 text-amber-400 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
              <Mic className="w-6 h-6 animate-pulse" />
            </div>
            <div className="text-left">
              <span className="block text-xs uppercase font-extrabold tracking-wider text-slate-800">
                {language === 'ml' ? 'വോയ്‌സ് സഹായി' : 'Voice Assistant'}
              </span>
              <span className="text-lg sm:text-xl font-black">
                {language === 'ml' ? '🎤 ചോദിക്കൂ' : '🎤 Ask Question'}
              </span>
            </div>
          </button>

        </div>
      </div>

      {/* Grid Row 1: Weather & Soil Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Weather Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 relative">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <CloudSun className="w-6 h-6 text-amber-500" />
              <h3 className="font-extrabold text-slate-900 text-lg">
                {language === 'ml' ? 'കാലാവസ്ഥ വിവരങ്ങൾ' : 'Weather Status'}
              </h3>
            </div>
            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-bold">
              {weather?.is_demo_data ? (language === 'ml' ? 'ഡെമോ ഡാറ്റ' : 'Demo Data') : 'Live'}
            </span>
          </div>

          {weather ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-emerald-50 p-4 rounded-2xl">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{weather.icon}</span>
                  <div>
                    <div className="text-3xl font-black text-slate-900">{weather.temperature}°C</div>
                    <div className="text-xs font-semibold text-slate-600">
                      {language === 'ml' ? weather.condition_ml : weather.condition}
                    </div>
                  </div>
                </div>
                <div className="text-right text-xs font-bold text-slate-600 space-y-1">
                  <div>💧 {weather.humidity}% {language === 'ml' ? 'ഈർപ്പം' : 'Humidity'}</div>
                  <div>🌧️ {weather.rainfall_mm} mm {language === 'ml' ? 'മഴ' : 'Rain'}</div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl text-xs font-medium text-amber-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{language === 'ml' ? weather.advisory_ml : weather.advisory}</span>
              </div>
            </div>
          ) : (
            <div className="animate-pulse h-24 bg-slate-100 rounded-2xl"></div>
          )}

          <button
            onClick={() => setActivePage('weather')}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1 transition-colors"
          >
            <span>{language === 'ml' ? 'മുഴുവൻ പ്രവചനം കാണുക' : 'View Full 5-Day Forecast'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Soil Summary Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <TestTube className="w-6 h-6 text-emerald-600" />
              <h3 className="font-extrabold text-slate-900 text-lg">
                {language === 'ml' ? 'മണ്ണ് വിവരങ്ങൾ (Soil Parameters)' : 'Soil Information'}
              </h3>
            </div>
            <button
              onClick={() => setActivePage('soil')}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              {language === 'ml' ? 'മാറ്റം വരുത്തുക' : 'Edit Soil Data'}
            </button>
          </div>

          {soil ? (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="text-xs text-slate-500 font-bold">N (നൈട്രജൻ)</div>
                  <div className="text-xl font-black text-emerald-700">{soil.nitrogen}</div>
                  <div className="text-[10px] text-slate-400">kg/ha</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="text-xs text-slate-500 font-bold">P (ഫോസ്ഫറസ്)</div>
                  <div className="text-xl font-black text-emerald-700">{soil.phosphorus}</div>
                  <div className="text-[10px] text-slate-400">kg/ha</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="text-xs text-slate-500 font-bold">K (പൊട്ടാഷ്)</div>
                  <div className="text-xl font-black text-emerald-700">{soil.potassium}</div>
                  <div className="text-[10px] text-slate-400">kg/ha</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="text-xs text-slate-500 font-bold">pH നില</div>
                  <div className="text-xl font-black text-amber-600">{soil.ph}</div>
                  <div className="text-[10px] text-slate-400">Soil pH</div>
                </div>
              </div>

              <div className="text-xs font-medium text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between">
                <span>{language === 'ml' ? 'മണ്ണിന്റെ തരം:' : 'Soil Type:'} <strong>{soil.soil_type}</strong></span>
                <span>{language === 'ml' ? 'ഈർപ്പം:' : 'Moisture:'} <strong>{soil.moisture}%</strong></span>
              </div>
            </div>
          ) : (
            <div className="animate-pulse h-24 bg-slate-100 rounded-2xl"></div>
          )}

          <button
            onClick={() => setActivePage('crop')}
            className="w-full farmer-btn bg-emerald-700 hover:bg-emerald-600 text-white py-2.5 rounded-xl text-xs font-bold"
          >
            <Sprout className="w-4 h-4" />
            <span>{language === 'ml' ? 'ML വിള നിർദ്ദേശം നേടൂ' : 'Run Crop Recommendation ML Model'}</span>
          </button>
        </div>

      </div>

      {/* Recommended Crop & Guidance Card */}
      {cropRec && (
        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-700 text-white rounded-2xl flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-800">
                  {language === 'ml' ? 'ഏറ്റവും അനുയോജ്യമായ വിള (ML Model)' : 'Recommended Crop'}
                </span>
                <h3 className="text-2xl font-black text-slate-900">
                  {language === 'ml' ? cropRec.recommended_crop_ml : cropRec.recommended_crop}
                </h3>
              </div>
            </div>
            <div className="text-right">
              <span className="bg-emerald-200 text-emerald-900 font-extrabold text-xs px-3 py-1.5 rounded-full">
                {cropRec.confidence_score}% {language === 'ml' ? 'വിശ്വാസ്യത' : 'Confidence'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-white p-4 rounded-2xl border border-emerald-100 space-y-1">
              <h4 className="font-bold text-slate-800">{language === 'ml' ? 'കാരണം:' : 'Reasoning:'}</h4>
              <p className="text-slate-600">{language === 'ml' ? cropRec.reasoning_ml : cropRec.reasoning}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-emerald-100 space-y-1">
              <h4 className="font-bold text-slate-800">{language === 'ml' ? 'കൃഷി മാർഗ്ഗനിർദ്ദേശം:' : 'Farming Guidance:'}</h4>
              <p className="text-slate-600">{language === 'ml' ? cropRec.guidance_ml : cropRec.guidance}</p>
            </div>
          </div>
        </div>
      )}

      {/* Grid Row 2: Market Prices & Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Market Prices Ticker Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
              <h3 className="font-extrabold text-slate-900 text-lg">
                {language === 'ml' ? 'കേരള വിപണി വില (AGMARKNET)' : 'Kerala Market Prices'}
              </h3>
            </div>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 rounded-md font-bold">Demo Data</span>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {marketPrices.slice(0, 4).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs font-semibold">
                <div>
                  <div className="font-bold text-slate-900">
                    {language === 'ml' ? item.crop_name_ml : item.crop_name}
                  </div>
                  <div className="text-[10px] text-slate-500">{item.market_name}</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-slate-900 text-sm">₹{item.current_price}</div>
                  <div className={`text-[10px] font-bold ${item.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {item.trend === 'up' ? '▲ വില വർദ്ധിച്ചു' : '▼ വില കുറഞ്ഞു'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActivePage('market')}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700"
          >
            {language === 'ml' ? 'എല്ലാ ചന്തകളിലെയും വില കാണുക' : 'View All Market Prices'}
          </button>
        </div>

        {/* Dynamic Alerts Banner */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-6 h-6 text-amber-500" />
              <h3 className="font-extrabold text-slate-900 text-lg">
                {language === 'ml' ? 'പ്രധാന മുന്നറിയിപ്പുകൾ' : 'Personalized Alerts'}
              </h3>
            </div>
            <button
              onClick={() => setActivePage('alerts')}
              className="text-xs font-bold text-amber-700 hover:underline"
            >
              {language === 'ml' ? 'എല്ലാം കാണുക' : 'View All'}
            </button>
          </div>

          <div className="space-y-3">
            {alerts.slice(0, 3).map((a) => (
              <div 
                key={a.id} 
                className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
                  a.severity === 'alert' 
                    ? 'bg-rose-50 border-rose-200 text-rose-900' 
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <div className="font-extrabold flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>{language === 'ml' ? a.title_ml : a.title}</span>
                </div>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {language === 'ml' ? a.message_ml : a.message}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
