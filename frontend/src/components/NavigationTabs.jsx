import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Mic, 
  Sprout, 
  CloudSun, 
  TestTube, 
  TrendingUp, 
  Bell, 
  User 
} from 'lucide-react';

const NavigationTabs = ({ activePage, setActivePage }) => {
  const { language } = useAuth();

  const navItems = [
    { id: 'dashboard', label_ml: 'ഡാഷ്‌ബോർഡ്', label_en: 'Dashboard', icon: LayoutDashboard },
    { id: 'voice', label_ml: 'വോയ്‌സ് അസിസ്റ്റന്റ്', label_en: 'Voice Assistant', icon: Mic, highlight: true },
    { id: 'crop', label_ml: 'വിള ഉപദേശം (ML)', label_en: 'Crop Advisory', icon: Sprout },
    { id: 'weather', label_ml: 'കാലാവസ്ഥ', label_en: 'Weather', icon: CloudSun },
    { id: 'soil', label_ml: 'മണ്ണ് വിവരങ്ങൾ', label_en: 'Soil Data', icon: TestTube },
    { id: 'market', label_ml: 'വിപണി വില', label_en: 'Market Prices', icon: TrendingUp },
    { id: 'alerts', label_ml: 'മുന്നറിയിപ്പുകൾ', label_en: 'Alerts', icon: Bell },
    { id: 'profile', label_ml: 'പ്രൊഫൈൽ', label_en: 'Profile', icon: User },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 shadow-xs sticky top-20 z-40">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-3 overflow-x-auto py-3 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all touch-manipulation ${
                  isActive
                    ? item.highlight
                      ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300 scale-102'
                      : 'bg-emerald-700 text-white shadow-md'
                    : item.highlight
                      ? 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span>{language === 'ml' ? item.label_ml : item.label_en}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default NavigationTabs;
