import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { alertAPI } from '../services/api';
import { Bell, ShieldAlert, CloudRain, Bug, TrendingUp, Landmark } from 'lucide-react';

const AlertsPage = () => {
  const { language } = useAuth();
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await alertAPI.getAlerts();
      setAlerts(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const getCategoryIcon = (cat) => {
    switch(cat) {
      case 'weather': return <CloudRain className="w-6 h-6 text-amber-500" />;
      case 'pest': return <Bug className="w-6 h-6 text-rose-500" />;
      case 'market': return <TrendingUp className="w-6 h-6 text-emerald-600" />;
      case 'scheme': return <Landmark className="w-6 h-6 text-teal-600" />;
      default: return <Bell className="w-6 h-6 text-slate-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-3">
        <div className="w-12 h-12 bg-amber-400 text-slate-950 rounded-2xl flex items-center justify-center font-bold">
          <Bell className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            {language === 'ml' ? 'കർഷക മുന്നറിയിപ്പുകൾ' : 'Personalized Alerts & Notifications'}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            {language === 'ml' ? 'കാലാവസ്ഥ, കീടബാധ, വിപണി, സർക്കാർ പദ്ധതി അറിയിപ്പുകൾ' : 'Real-time weather warnings, pest outbreak risks, and government schemes'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {alerts.map((a) => (
          <div 
            key={a.id}
            className={`p-6 rounded-3xl border shadow-xs space-y-2 transition-all hover:shadow-md ${
              a.severity === 'alert'
                ? 'bg-rose-50 border-rose-200 text-rose-950'
                : a.severity === 'warning'
                  ? 'bg-amber-50 border-amber-200 text-amber-950'
                  : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getCategoryIcon(a.category)}
                <div>
                  <h3 className="font-extrabold text-base">
                    {language === 'ml' ? a.title_ml : a.title}
                  </h3>
                  <span className="text-[10px] uppercase font-extrabold tracking-wider opacity-70">
                    Category: {a.category}
                  </span>
                </div>
              </div>

              <span className={`text-[10px] uppercase font-black px-2.5 py-1 rounded-full ${
                a.severity === 'alert' ? 'bg-rose-200 text-rose-900' : 'bg-amber-200 text-amber-900'
              }`}>
                {a.severity}
              </span>
            </div>

            <p className="text-sm font-medium leading-relaxed pt-1">
              {language === 'ml' ? a.message_ml : a.message}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AlertsPage;
