import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { cropAPI, soilAPI } from '../services/api';
import { Sprout, TestTube, Award, CheckCircle, RefreshCw, History, Info } from 'lucide-react';

const CropRecommend = () => {
  const { language } = useAuth();
  const [formData, setFormData] = useState({
    nitrogen: 75.0,
    phosphorus: 45.0,
    potassium: 40.0,
    temperature: 27.0,
    humidity: 80.0,
    ph: 6.5,
    rainfall: 2200.0
  });

  const [recommendation, setRecommendation] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSoilDefaults();
    fetchHistory();
  }, []);

  const loadSoilDefaults = async () => {
    try {
      const sRes = await soilAPI.getSoilRecords();
      if (sRes.data && sRes.data.length > 0) {
        const latest = sRes.data[0];
        setFormData(prev => ({
          ...prev,
          nitrogen: latest.nitrogen,
          phosphorus: latest.phosphorus,
          potassium: latest.potassium,
          ph: latest.ph,
          rainfall: latest.rainfall || 2200.0,
          temperature: latest.temperature || 27.0
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await cropAPI.getHistory();
      setHistory(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await cropAPI.predictCrop(formData);
      setRecommendation(res.data);
      fetchHistory();
    } catch (err) {
      console.error('ML Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-2">
        <div className="inline-flex items-center gap-2 bg-emerald-950/80 px-3 py-1 rounded-full text-xs font-bold text-amber-300 border border-emerald-500/30">
          <Sprout className="w-4 h-4" />
          <span>Machine Learning Random Forest Engine</span>
        </div>
        <h2 className="text-3xl font-black">
          {language === 'ml' ? 'AI വിള ശുപാർശ സംവിധാനം' : 'AI Crop Recommendation Engine'}
        </h2>
        <p className="text-emerald-100 text-sm max-w-2xl font-medium">
          {language === 'ml' 
            ? 'മണ്ണിലെ പോഷകനിലകളും (N, P, K, pH) കാലാവസ്ഥയും അടിസ്ഥാനമാക്കി നിങ്ങളുടെ കൃഷിസ്ഥലത്തിന് അനുയോജ്യമായ വിള കണ്ടെത്തൂ.' 
            : 'Enter soil parameters and micro-climate values to predict the highest yielding crop using trained Random Forest ML model.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Form Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <TestTube className="w-6 h-6 text-emerald-700" />
            <h3 className="font-extrabold text-slate-900 text-lg">
              {language === 'ml' ? 'മണ്ണിലെയും കാലാവസ്ഥയിലെയും അളവുകൾ' : 'Soil & Weather Input Parameters'}
            </h3>
          </div>

          <form onSubmit={handlePredict} className="space-y-4">
            
            {/* NPK Row */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nitrogen (N)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.nitrogen}
                  onChange={(e) => setFormData({ ...formData, nitrogen: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 px-3 py-2 rounded-xl text-sm font-bold text-center"
                />
                <span className="text-[10px] text-slate-400 block text-center mt-0.5">kg/ha</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phosphorus (P)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.phosphorus}
                  onChange={(e) => setFormData({ ...formData, phosphorus: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 px-3 py-2 rounded-xl text-sm font-bold text-center"
                />
                <span className="text-[10px] text-slate-400 block text-center mt-0.5">kg/ha</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Potassium (K)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.potassium}
                  onChange={(e) => setFormData({ ...formData, potassium: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 px-3 py-2 rounded-xl text-sm font-bold text-center"
                />
                <span className="text-[10px] text-slate-400 block text-center mt-0.5">kg/ha</span>
              </div>
            </div>

            {/* pH & Temp Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Soil pH Level</label>
                <input
                  type="number"
                  step="0.1"
                  min="3.0"
                  max="10.0"
                  required
                  value={formData.ph}
                  onChange={(e) => setFormData({ ...formData, ph: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 px-3 py-2 rounded-xl text-sm font-bold text-center"
                />
                <span className="text-[10px] text-slate-400 block text-center mt-0.5">Range: 3.5 - 9.0</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Temperature (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 px-3 py-2 rounded-xl text-sm font-bold text-center"
                />
                <span className="text-[10px] text-slate-400 block text-center mt-0.5">Average C</span>
              </div>
            </div>

            {/* Humidity & Rainfall Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Humidity (%)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.humidity}
                  onChange={(e) => setFormData({ ...formData, humidity: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 px-3 py-2 rounded-xl text-sm font-bold text-center"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Annual Rainfall (mm)</label>
                <input
                  type="number"
                  step="1"
                  required
                  value={formData.rainfall}
                  onChange={(e) => setFormData({ ...formData, rainfall: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 px-3 py-2 rounded-xl text-sm font-bold text-center"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full farmer-btn bg-emerald-700 hover:bg-emerald-600 text-white py-4 rounded-2xl text-base font-bold shadow-lg"
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Award className="w-5 h-5" />
              )}
              <span>{language === 'ml' ? 'വിള ശുപാർശ കണക്കാക്കൂ (Predict Crop)' : 'Calculate Crop Recommendation'}</span>
            </button>
          </form>
        </div>

        {/* ML Result Column */}
        <div className="lg:col-span-6 space-y-6">
          {recommendation ? (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-300 shadow-lg space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                  <h3 className="font-extrabold text-slate-900 text-lg">
                    {language === 'ml' ? 'ML പ്രവചന ഫലം' : 'ML Prediction Result'}
                  </h3>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-900 font-extrabold px-3 py-1 rounded-full">
                  {recommendation.model_version}
                </span>
              </div>

              <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white p-6 rounded-2xl text-center space-y-2 shadow-md">
                <span className="text-xs uppercase font-extrabold text-amber-200 tracking-wider">
                  {language === 'ml' ? 'ഏറ്റവും അനുയോജ്യമായ വിള' : 'Highest Confidence Match'}
                </span>
                <h4 className="text-3xl font-black">
                  {language === 'ml' ? recommendation.recommended_crop_ml : recommendation.recommended_crop}
                </h4>
                <div className="inline-block bg-white/20 px-4 py-1 rounded-full text-xs font-bold text-white">
                  {recommendation.confidence_score}% {language === 'ml' ? 'വിശ്വാസ്യത' : 'Match Score'}
                </div>
              </div>

              <div className="space-y-4 text-xs font-medium">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <h5 className="font-bold text-slate-800 text-sm">{language === 'ml' ? 'കാരണം:' : 'Reason for Recommendation:'}</h5>
                  <p className="text-slate-600 leading-relaxed">
                    {language === 'ml' ? recommendation.reasoning_ml : recommendation.reasoning}
                  </p>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-1 text-emerald-950">
                  <h5 className="font-bold text-emerald-900 text-sm">{language === 'ml' ? 'കൃഷി മാർഗ്ഗനിർദ്ദേശം:' : 'Farming Advisory:'}</h5>
                  <p className="leading-relaxed">
                    {language === 'ml' ? recommendation.guidance_ml : recommendation.guidance}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-100 p-8 rounded-3xl border border-dashed border-slate-300 text-center space-y-3">
              <Sprout className="w-12 h-12 text-slate-400 mx-auto" />
              <h4 className="font-bold text-slate-700 text-base">
                {language === 'ml' ? 'ഇതുവരെ പ്രവചനം നടത്തിയിട്ടില്ല' : 'No Active Prediction Run'}
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {language === 'ml' 
                  ? 'ഇടതുവശത്തെ ഫോമിൽ അളവുകൾ നൽകി ബട്ടൺ അമർത്തൂ.' 
                  : 'Enter NPK and pH values on the left form to calculate ML crop recommendation.'}
              </p>
            </div>
          )}

          {/* Historical Recommendations List */}
          {history.length > 0 && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <History className="w-5 h-5 text-slate-600" />
                <h4 className="font-bold text-slate-900 text-sm">
                  {language === 'ml' ? 'മുൻകാല നിർദ്ദേശ ചരിത്രം' : 'Recommendation History'}
                </h4>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto text-xs">
                {history.slice(0, 3).map((h, i) => (
                  <div key={i} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100 font-semibold">
                    <div>
                      <span className="font-bold text-emerald-800">{h.recommended_crop}</span>
                      <span className="text-[10px] text-slate-400 block">{new Date(h.created_at).toLocaleDateString()}</span>
                    </div>
                    <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded-md font-extrabold text-[10px]">
                      {h.confidence_score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default CropRecommend;
