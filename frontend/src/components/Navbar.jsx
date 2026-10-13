import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sprout, Mic, Languages, User as UserIcon, LogOut, Bell } from 'lucide-react';

const Navbar = ({ activePage, setActivePage }) => {
  const { user, profile, language, toggleLanguage, logout } = useAuth();

  return (
    <header className="bg-emerald-800 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Project Title */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActivePage('dashboard')}
          >
            <div className="w-12 h-12 bg-white text-emerald-800 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Sprout className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-extrabold text-xl sm:text-2xl leading-tight tracking-tight">
                {language === 'ml' ? 'കർഷക മിത്ര' : 'Smart Farmer AI'}
              </h1>
              <p className="text-xs text-emerald-200 font-medium">
                {language === 'ml' ? 'ശബ്ദ സഹായ കർഷക ഉപദേശകൻ' : 'Voice-Enabled Crop Advisory'}
              </p>
            </div>
          </div>

          {/* Center Main Action: Large Voice Assistant Launch Button */}
          {user && (
            <button
              onClick={() => setActivePage('voice')}
              className={`farmer-btn px-5 py-2.5 rounded-full text-base sm:text-lg font-bold shadow-lg transition-all ${
                activePage === 'voice' 
                  ? 'bg-amber-400 text-slate-900 scale-105 ring-4 ring-amber-300' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              <Mic className="w-6 h-6 animate-pulse text-amber-300 fill-amber-300" />
              <span>{language === 'ml' ? '🎤 സംസാരിക്കൂ' : '🎤 Ask Voice AI'}</span>
            </button>
          )}

          {/* Right Menu Controls */}
          <div className="flex items-center gap-3">
            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-600 px-3 py-2 rounded-xl text-sm font-semibold transition-colors"
              title="Change Language"
            >
              <Languages className="w-4 h-4 text-emerald-300" />
              <span className="text-amber-300 font-bold">{language === 'ml' ? 'EN' : 'മലയാളം'}</span>
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActivePage('profile')}
                  className="p-2 hover:bg-emerald-700/60 rounded-xl transition-colors text-emerald-100 flex items-center gap-2"
                >
                  <UserIcon className="w-6 h-6" />
                  <span className="hidden md:inline text-sm font-medium">{user.full_name.split(' ')[0]}</span>
                </button>
                <button
                  onClick={logout}
                  className="p-2 hover:bg-rose-700/80 rounded-xl text-rose-200 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActivePage('login')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 font-semibold rounded-xl text-sm transition-all"
                >
                  {language === 'ml' ? 'ലോഗിൻ' : 'Login'}
                </button>
                <button
                  onClick={() => setActivePage('register')}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-sm shadow transition-all"
                >
                  {language === 'ml' ? 'രജിസ്റ്റർ' : 'Register'}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
