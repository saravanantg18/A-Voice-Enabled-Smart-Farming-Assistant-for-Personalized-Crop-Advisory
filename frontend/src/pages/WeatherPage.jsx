import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { weatherAPI } from '../services/api';
import { CloudSun, MapPin, Droplets, Wind, Info, Calendar } from 'lucide-react';

const KERALA_DISTRICTS = [
  "Palakkad", "Wayanad", "Alappuzha", "Kottayam", "Thrissur", 
  "Ernakulam", "Idukki", "Kozhikode", "Thiruvananthapuram", 
  "Kannur", "Kasaragod", "Malappuram", "Kollam", "Pathanamthitta"
];

const WeatherPage = () => {
  const { profile, language } = useAuth();
  const [district, setDistrict] = useState(profile?.district || 'Palakkad');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWeather(district);
  }, [district]);

  const fetchWeather = async (dist) => {
    setLoading(true);
    try {
      const res = await weatherAPI.getWeather(dist);
      setWeatherData(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      
      {/* District Selector Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-400 text-slate-950 rounded-2xl flex items-center justify-center font-bold">
            <CloudSun className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              {language === 'ml' ? 'കാലാവസ്ഥ വിവരങ്ങൾ' : 'Weather Advisory'}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {language === 'ml' ? 'കേരളത്തിലെ ജില്ലകളിലെ കൃഷി കാലാവസ്ഥാ ഉപദേശം' : 'Agri-meteorological forecasts for Kerala districts'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-700" />
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="bg-slate-100 font-bold text-slate-800 px-4 py-2.5 rounded-xl text-sm border border-slate-300 outline-none"
          >
            {KERALA_DISTRICTS.map(d => (
              <option key={d} value={d}>{d} District</option>
            ))}
          </select>
        </div>
      </div>

      {weatherData && (
        <div className="space-y-6">
          
          {/* Main Weather Card */}
          <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white p-8 rounded-3xl shadow-xl space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-amber-300">
                  {weatherData.district} District Weather
                </span>
                <h3 className="text-4xl font-black mt-1">
                  {weatherData.temperature}°C
                </h3>
                <p className="text-emerald-100 font-semibold text-base">
                  {language === 'ml' ? weatherData.condition_ml : weatherData.condition}
                </p>
              </div>
              <span className="text-6xl">{weatherData.icon}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-emerald-700/60 text-xs font-bold">
              <div className="bg-emerald-950/60 p-3 rounded-2xl flex items-center gap-2">
                <Droplets className="w-5 h-5 text-amber-300" />
                <div>
                  <span className="text-[10px] text-emerald-300 uppercase block">{language === 'ml' ? 'ഈർപ്പം' : 'Humidity'}</span>
                  <span className="text-base">{weatherData.humidity}%</span>
                </div>
              </div>

              <div className="bg-emerald-950/60 p-3 rounded-2xl flex items-center gap-2">
                <Wind className="w-5 h-5 text-amber-300" />
                <div>
                  <span className="text-[10px] text-emerald-300 uppercase block">{language === 'ml' ? 'മഴ' : 'Rainfall'}</span>
                  <span className="text-base">{weatherData.rainfall_mm} mm</span>
                </div>
              </div>

              <div className="bg-emerald-950/60 p-3 rounded-2xl flex items-center gap-2 col-span-2 sm:col-span-1">
                <Info className="w-5 h-5 text-amber-300" />
                <div>
                  <span className="text-[10px] text-emerald-300 uppercase block">{language === 'ml' ? 'സോഴ്സ്' : 'Source'}</span>
                  <span className="text-xs">{weatherData.is_demo_data ? 'Regional Kerala DB' : 'OpenWeather API'}</span>
                </div>
              </div>
            </div>

            {/* Farming Advisory Box */}
            <div className="bg-amber-400 text-slate-950 p-4 rounded-2xl space-y-1">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-900">
                {language === 'ml' ? 'കർഷകർക്കുള്ള കാലാവസ്ഥ നിർദ്ദേശം:' : 'Agricultural Advisory:'}
              </h4>
              <p className="text-sm font-bold leading-relaxed">
                {language === 'ml' ? weatherData.advisory_ml : weatherData.advisory}
              </p>
            </div>

          </div>

          {/* 5-Day Forecast Grid */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Calendar className="w-5 h-5 text-emerald-700" />
              <h3 className="font-extrabold text-slate-900 text-base">
                {language === 'ml' ? 'അടുത്ത 5 ദിവസത്തെ പ്രവചനം' : '5-Day Weather Forecast'}
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              {weatherData.forecast.map((f, i) => (
                <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">
                    {language === 'ml' ? f.day_ml : f.day}
                  </span>
                  <span className="text-3xl block">{f.icon}</span>
                  <div className="text-lg font-black text-slate-900">{f.temp}°C</div>
                  <div className="text-[10px] font-bold text-emerald-700">🌧️ {f.rain_chance}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default WeatherPage;
