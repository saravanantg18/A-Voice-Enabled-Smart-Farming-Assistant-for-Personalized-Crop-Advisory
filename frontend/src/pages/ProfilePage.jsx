import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { farmerAPI } from '../services/api';
import { User, Save, MapPin, Phone, Sprout, Languages, CheckCircle2 } from 'lucide-react';

const KERALA_DISTRICTS = [
  "Palakkad", "Wayanad", "Alappuzha", "Kottayam", "Thrissur", 
  "Ernakulam", "Idukki", "Kozhikode", "Thiruvananthapuram", 
  "Kannur", "Kasaragod", "Malappuram", "Kollam", "Pathanamthitta"
];

const ProfilePage = () => {
  const { user, profile, language, setProfile, toggleLanguage } = useAuth();
  
  const [formData, setFormData] = useState({
    phone: profile?.phone || '',
    district: profile?.district || 'Palakkad',
    current_crop: profile?.current_crop || 'Rice',
    farm_size_acres: profile?.farm_size_acres || 2.5,
    preferred_language: profile?.preferred_language || 'ml'
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await farmerAPI.updateProfile(formData);
      setProfile(res.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error('Failed to update profile:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-12 h-12 bg-emerald-700 text-white rounded-2xl flex items-center justify-center font-bold">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              {user?.full_name}
            </h2>
            <p className="text-xs text-slate-500 font-medium">{user?.email}</p>
          </div>
        </div>

        {saved && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl flex items-center gap-2 text-xs font-bold animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{language === 'ml' ? 'പ്രൊഫൈൽ വിവരങ്ങൾ അപഡേറ്റ് ചെയ്തു!' : 'Profile updated successfully!'}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'ml' ? 'ഫോൺ നമ്പർ' : 'Phone Number'}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'ml' ? 'ജില്ല' : 'District'}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none font-medium"
                >
                  {KERALA_DISTRICTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'ml' ? 'നിലവിലുള്ള വിള' : 'Current Primary Crop'}
              </label>
              <div className="relative">
                <Sprout className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={formData.current_crop}
                  onChange={(e) => setFormData({ ...formData, current_crop: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'ml' ? 'കൃഷിഭൂമിയുടെ അളവ് (ഏക്കർ)' : 'Farm Size (Acres)'}
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.farm_size_acres}
                onChange={(e) => setFormData({ ...formData, farm_size_acres: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 px-3 py-2.5 rounded-xl text-sm outline-none font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'ml' ? 'താല്പര്യമുള്ള ഭാഷ' : 'Preferred Language'}
            </label>
            <div className="flex items-center gap-4 pt-1">
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, preferred_language: 'ml' });
                  if (language !== 'ml') toggleLanguage();
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  formData.preferred_language === 'ml' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                മലയാളം (Malayalam)
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, preferred_language: 'en' });
                  if (language !== 'en') toggleLanguage();
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  formData.preferred_language === 'en' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                English
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full farmer-btn bg-emerald-700 hover:bg-emerald-600 text-white py-3.5 rounded-2xl text-base font-bold shadow-lg mt-4"
          >
            <Save className="w-5 h-5" />
            <span>{loading ? 'Saving...' : (language === 'ml' ? 'പ്രൊഫൈൽ സേവ് ചെയ്യുക' : 'Save Profile')}</span>
          </button>
        </form>
      </div>

    </div>
  );
};

export default ProfilePage;
