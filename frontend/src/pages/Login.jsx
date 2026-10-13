import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sprout, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

const Login = ({ setActivePage }) => {
  const { login, language } = useAuth();
  const [email, setEmail] = useState('farmer_test@kerala.org');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      setActivePage('dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-8">
        
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-emerald-700 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <Sprout className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-slate-900">
            {language === 'ml' ? 'കർഷക ലോഗിൻ' : 'Farmer Login'}
          </h2>
          <p className="text-sm text-slate-600">
            {language === 'ml' ? 'സ്മാർട്ട് അസിസ്റ്റന്റ് ഉപയോഗിക്കാൻ ലോഗിൻ ചെയ്യുക' : 'Access your smart farming dashboard & voice assistant'}
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              {language === 'ml' ? 'ഇമെയിൽ വിലാസം' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:bg-white pl-12 pr-4 py-3 rounded-2xl text-base outline-none transition-all"
                placeholder="farmer@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              {language === 'ml' ? 'പാസ്‌വേഡ്' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:bg-white pl-12 pr-4 py-3 rounded-2xl text-base outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full farmer-btn bg-emerald-700 hover:bg-emerald-600 text-white py-4 rounded-2xl text-lg font-bold shadow-lg"
          >
            <span>{submitting ? 'Please wait...' : (language === 'ml' ? 'ലോഗിൻ ചെയ്യുക' : 'Login')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-sm text-slate-600">
            {language === 'ml' ? 'അക്കൗണ്ട് ഇല്ലേ?' : 'Don\'t have an account?'}{' '}
            <button
              onClick={() => setActivePage('register')}
              className="text-emerald-700 font-bold hover:underline"
            >
              {language === 'ml' ? 'രജിസ്റ്റർ ചെയ്യുക' : 'Register Here'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
