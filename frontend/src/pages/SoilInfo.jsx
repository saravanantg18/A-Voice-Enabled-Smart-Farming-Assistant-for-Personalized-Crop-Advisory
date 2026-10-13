import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { soilAPI } from '../services/api';
import { TestTube, Save, CheckCircle2, History } from 'lucide-react';

const SOIL_TYPES = [
  "Clay Loam / Alluvial (വണ്ടൽ മണ്ണ്)",
  "Laterite Soil (ചെങ്കൽ മണ്ണ്)",
  "Sandy Loam (മണൽ മണ്ണ്)",
  "Red Soil (ചുവന്ന മണ്ണ്)",
  "Forest Peaty Soil (വന മണ്ണ് / ഏലത്തോട്ട മണ്ണ്)",
  "Kuttanad Black Soil (കരി നിലങ്ങൾ)"
];

const SoilInfo = () => {
  const { language } = useAuth();
  const [formData, setFormData] = useState({
    soil_type: SOIL_TYPES[0],
    nitrogen: 75.0,
    phosphorus: 45.0,
    potassium: 40.0,
    ph: 6.5,
    moisture: 65.0,
    temperature: 28.0,
    rainfall: 2200.0,
    notes: 'Soil test report from Krishi Bhavan'
  });

  const [records, setRecords] = useState([]);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await soilAPI.getSoilRecords();
      setRecords(res.data);
      if (res.data && res.data.length > 0) {
        const latest = res.data[0];
        setFormData({
          soil_type: latest.soil_type,
          nitrogen: latest.nitrogen,
          phosphorus: latest.phosphorus,
          potassium: latest.potassium,
          ph: latest.ph,
          moisture: latest.moisture || 65.0,
          temperature: latest.temperature || 28.0,
          rainfall: latest.rainfall || 2200.0,
          notes: latest.notes || ''
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await soilAPI.addSoilRecord(formData);
      setSavedSuccess(true);
      fetchRecords();
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Soil record save error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-12 h-12 bg-emerald-700 text-white rounded-2xl flex items-center justify-center font-bold">
            <TestTube className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              {language === 'ml' ? 'മണ്ണും കൃഷിസ്ഥല വിവരങ്ങളും' : 'Soil & Farm Information'}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {language === 'ml' ? 'മണ്ണ് പരിശോധന ലാബിൽ നിന്നുള്ള വിവരങ്ങൾ നൽകുക' : 'Enter soil test values (N, P, K, pH) for precise AI crop advisory'}
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl flex items-center gap-2 text-xs font-bold animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{language === 'ml' ? 'മണ്ണ് വിവരങ്ങൾ വിജയികരമായി സേവ് ചെയ്തു!' : 'Soil records saved successfully!'}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              {language === 'ml' ? 'മണ്ണിന്റെ തരം' : 'Soil Type'}
            </label>
            <select
              value={formData.soil_type}
              onChange={(e) => setFormData({ ...formData, soil_type: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 px-4 py-3 rounded-2xl text-sm font-bold outline-none"
            >
              {SOIL_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nitrogen (N) kg/ha</label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.nitrogen}
                onChange={(e) => setFormData({ ...formData, nitrogen: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 px-4 py-2.5 rounded-xl text-base font-black text-center"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phosphorus (P) kg/ha</label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.phosphorus}
                onChange={(e) => setFormData({ ...formData, phosphorus: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 px-4 py-2.5 rounded-xl text-base font-black text-center"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Potassium (K) kg/ha</label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.potassium}
                onChange={(e) => setFormData({ ...formData, potassium: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 px-4 py-2.5 rounded-xl text-base font-black text-center"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">pH Level (3.5 - 9.0)</label>
              <input
                type="number"
                step="0.1"
                min="3.0"
                max="10.0"
                required
                value={formData.ph}
                onChange={(e) => setFormData({ ...formData, ph: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 px-4 py-2.5 rounded-xl text-base font-black text-center"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Soil Moisture (%)</label>
              <input
                type="number"
                step="0.1"
                value={formData.moisture}
                onChange={(e) => setFormData({ ...formData, moisture: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 px-4 py-2.5 rounded-xl text-base font-black text-center"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full farmer-btn bg-emerald-700 hover:bg-emerald-600 text-white py-4 rounded-2xl text-base font-bold shadow-lg"
          >
            <Save className="w-5 h-5" />
            <span>{loading ? 'Saving...' : (language === 'ml' ? 'സേവ് ചെയ്യുക' : 'Save Soil Information')}</span>
          </button>
        </form>
      </div>

    </div>
  );
};

export default SoilInfo;
