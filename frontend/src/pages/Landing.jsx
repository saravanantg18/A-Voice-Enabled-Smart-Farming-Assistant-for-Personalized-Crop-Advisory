import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Mic, Sprout, CloudSun, ShieldCheck, Sparkles, PhoneCall, Volume2 } from 'lucide-react';

const Landing = ({ setActivePage }) => {
  const { language } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Hero Section */}
      <section className="gradient-hero text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          
          <div className="flex-1 space-y-6 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-emerald-900/60 border border-emerald-400/30 px-4 py-2 rounded-full text-amber-300 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>{language === 'ml' ? 'AI അധിഷ്ഠിത മലയാളം കർഷക സഹായി' : 'AI-Powered Malayalam Farming Assistant'}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
              {language === 'ml' ? (
                <>നിങ്ങളുടെ കൃഷി സംശയങ്ങൾ <span className="text-amber-300">സംസാരിച്ചു ചോദിക്കൂ</span></>
              ) : (
                <>Ask Your Farming Questions <span className="text-amber-300">Using Your Voice</span></>
              )}
            </h1>

            <p className="text-lg sm:text-xl text-emerald-100 max-w-2xl font-medium">
              {language === 'ml' 
                ? 'നിങ്ങളുടെ മണ്ണിനും കാലാവസ്ഥയ്ക്കും അനുയോജ്യമായ വിള നിർദ്ദേശങ്ങളും കൃഷി ഉപദേശങ്ങളും ശബ്ദ സന്ദേശമായി നേടൂ.' 
                : 'Get personalized crop advisory, weather forecasts, and market prices in Malayalam through voice input & audio response.'}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
              <button
                onClick={() => setActivePage('register')}
                className="farmer-btn bg-amber-400 hover:bg-amber-300 text-slate-950 px-8 py-4 text-xl rounded-2xl shadow-xl hover:scale-105"
              >
                <Mic className="w-7 h-7 text-slate-900 fill-slate-900" />
                <span>{language === 'ml' ? 'സൗജന്യമായി ആരംഭിക്കൂ' : 'Start Free Now'}</span>
              </button>

              <button
                onClick={() => setActivePage('login')}
                className="farmer-btn bg-emerald-900/80 hover:bg-emerald-950 text-white border border-emerald-400/40 px-6 py-4 text-lg rounded-2xl"
              >
                <span>{language === 'ml' ? 'ലോഗിൻ ചെയ്യുക' : 'Login'}</span>
              </button>
            </div>
          </div>

          {/* Microphone Interactive Teaser Visual */}
          <div className="flex-1 flex justify-center">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl text-center space-y-6 max-w-md w-full shadow-2xl">
              <div className="relative inline-block">
                <button
                  onClick={() => setActivePage('register')}
                  className="w-28 h-28 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-pulse-mic cursor-pointer"
                >
                  <Mic className="w-14 h-14" />
                </button>
              </div>

              <div className="bg-emerald-950/70 p-4 rounded-2xl border border-emerald-700/50">
                <p className="text-amber-300 font-bold text-lg mb-1">
                  {language === 'ml' ? 'ഉദാഹരണ ചോദ്യം:' : 'Sample Question:'}
                </p>
                <p className="text-white text-base italic font-serif">
                  “എന്റെ മണ്ണിന് ഏത് വിളയാണ് അനുയോജ്യം?”
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-emerald-200 text-sm font-semibold">
                <Volume2 className="w-5 h-5 text-amber-300" />
                <span>{language === 'ml' ? 'മറുപടി മലയാളത്തിൽ കേൾക്കാം' : 'Listen to response in Malayalam audio'}</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
            {language === 'ml' ? 'പ്രധാന സവിശേഷതകൾ' : 'Core System Modules'}
          </h2>
          <p className="text-slate-600 text-lg">
            {language === 'ml' ? 'സാധാരണക്കാരായ കർഷകർക്കായി ലളിതമായി രൂപകൽപ്പന ചെയ്ത സംവിധാനം' : 'Designed specifically for smallholder farmers with low digital literacy.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center">
              <Mic className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {language === 'ml' ? 'മലയാളം വോയ്‌സ് അസിസ്റ്റന്റ്' : 'Malayalam Voice Assistant'}
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              {language === 'ml' 
                ? 'ഒരു ബട്ടൺ അമർത്തി മലയാളത്തിൽ ചോദ്യങ്ങൾ ചോദിക്കാം. മറുപടി ശബ്ദരൂപത്തിൽ കേൾക്കാം.'
                : 'Press a button, speak in Malayalam, and receive instant localized audio guidance.'}
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center">
              <Sprout className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {language === 'ml' ? 'AI വിള ശുപാർശ (ML Engine)' : 'AI Crop Recommendation'}
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              {language === 'ml' 
                ? 'മണ്ണിലെ N, P, K ഘടകങ്ങളും pH നിലയും വിലയിരുത്തി വരാനിരിക്കുന്ന സീസണിലെ മികച്ച വിള നിർദ്ദേശിക്കുന്നു.'
                : 'Random Forest ML model recommends the best high-yield crop based on soil nutrients and rainfall.'}
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-14 h-14 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center">
              <CloudSun className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {language === 'ml' ? 'കാലാവസ്ഥയും വിപണി വിലയും' : 'Weather & Market Prices'}
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              {language === 'ml' 
                ? 'കേരളത്തിലെ ജില്ലകളിലെ തത്സമയ കാലാവസ്ഥാ മുന്നറിയിപ്പുകളും AGMARKNET ചന്തയിലെ വില വിവരങ്ങളും ലഭ്യമാണ്.'
                : 'Real-time Kerala district weather advisories and AGMARKNET crop market prices.'}
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Landing;
