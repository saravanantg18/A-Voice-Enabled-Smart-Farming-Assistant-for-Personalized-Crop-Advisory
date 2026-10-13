import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sprout, User, Mail, Lock, Phone, MapPin, AlertCircle, ArrowRight } from 'lucide-react';

const KERALA_DISTRICTS = [
  "Palakkad", "Wayanad", "Alappuzha", "Kottayam", "Thrissur", 
  "Ernakulam", "Idukki", "Kozhikode", "Thiruvananthapuram", 
  "Kannur", "Kasaragod", "Malappuram", "Kollam", "Pathanamthitta"
];

const Register = ({ setActivePage }) => {
  const { register, language } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    district: 'Palakkad',
    preferred_language: 'ml'
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(formData);
      setActivePage('dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-amber-400 text-slate-950 rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Sprout className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black text-slate-900">
            {language === 'ml' ? 'പുതിയ കർഷക രജിസ്ട്രേഷൻ' : 'Farmer Registration'}
          </h2>
          <p className="text-xs text-slate-600">
            {language === 'ml' ? 'നിങ്ങളുടെ വിവരങ്ങൾ നൽകി സേവനം സൗജന്യമായി ഉപയോഗിക്കൂ' : 'Create your farmer profile to receive personalized advice'}
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {language === 'ml' ? 'പേര്' : 'Full Name'}
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-slate-400 absolute left-4 top-3" />
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:bg-white pl-12 pr-4 py-2.5 rounded-xl text-sm outline-none"
                placeholder="Raman Nair"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {language === 'ml' ? 'ഇമെയിൽ വിലാസം' : 'Email'}
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-3" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:bg-white pl-12 pr-4 py-2.5 rounded-xl text-sm outline-none"
                placeholder="farmer@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {language === 'ml' ? 'പാസ്‌വേഡ്' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-3" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:bg-white pl-12 pr-4 py-2.5 rounded-xl text-sm outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {language === 'ml' ? 'ഫോൺ നമ്പർ' : 'Phone'}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:bg-white pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none"
                  placeholder="9847012345"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {language === 'ml' ? 'ജില്ല' : 'District'}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:bg-white pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none font-medium"
                >
                  {KERALA_DISTRICTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full farmer-btn bg-emerald-700 hover:bg-emerald-600 text-white py-3.5 rounded-2xl text-base font-bold shadow-lg"
          >
            <span>{submitting ? 'Creating account...' : (language === 'ml' ? 'രജിസ്റ്റർ ചെയ്യുക' : 'Create Account')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-sm text-slate-600">
            {language === 'ml' ? 'നേരത്തെ അക്കൗണ്ട് ഉണ്ടോ?' : 'Already have an account?'}{' '}
            <button
              onClick={() => setActivePage('login')}
              className="text-emerald-700 font-bold hover:underline"
            >
              {language === 'ml' ? 'ലോഗിൻ ചെയ്യുക' : 'Login Here'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;
