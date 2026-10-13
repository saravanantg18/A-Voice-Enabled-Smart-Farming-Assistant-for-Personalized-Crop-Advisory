import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { marketAPI } from '../services/api';
import { TrendingUp, Search, ArrowUpRight, ArrowDownRight, Minus, Building2 } from 'lucide-react';

const MarketPage = () => {
  const { language } = useAuth();
  const [prices, setPrices] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      const res = await marketAPI.getMarketPrices();
      setPrices(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredPrices = prices.filter(p => 
    p.crop_name.toLowerCase().includes(search.toLowerCase()) ||
    p.crop_name_ml.includes(search) ||
    p.market_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-700 text-white rounded-2xl flex items-center justify-center font-bold">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              {language === 'ml' ? 'വിപണി വില വിവരങ്ങൾ (AGMARKNET & eNAM)' : 'Kerala Agricultural Market Prices'}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {language === 'ml' ? 'കേരളത്തിലെ പ്രധാന അഗ്രികൾച്ചറൽ ചന്തകളിലെ ഇന്നത്തെ വിലനിലവാരം' : 'Daily wholesale market rates across Kerala APMC markets'}
            </p>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'ml' ? 'വിള തിരയുക...' : 'Search crop or market...'}
            className="w-full bg-slate-100 border border-slate-300 focus:border-emerald-600 pl-9 pr-4 py-2 rounded-xl text-xs outline-none font-medium"
          />
        </div>
      </div>

      {/* Market Prices Table / Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
          <span>{language === 'ml' ? 'വിളയും വിപണിയും' : 'Crop & APMC Market'}</span>
          <span>{language === 'ml' ? 'ഇന്നത്തെ വില' : 'Price Rate'}</span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredPrices.map((item, idx) => (
            <div key={idx} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-lg">
                    {language === 'ml' ? item.crop_name_ml : item.crop_name}
                  </span>
                  <span className="bg-emerald-100 text-emerald-900 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                    {item.unit}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{item.market_name}</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-2xl font-black text-slate-900">
                    ₹{item.current_price}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {language === 'ml' ? 'മുൻപത്തെ വില:' : 'Previous:'} ₹{item.previous_price}
                  </div>
                </div>

                <div className={`flex items-center gap-1 font-bold text-xs px-3 py-1.5 rounded-xl ${
                  item.trend === 'up' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : item.trend === 'down'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-slate-100 text-slate-700'
                }`}>
                  {item.trend === 'up' && <ArrowUpRight className="w-4 h-4 text-emerald-600" />}
                  {item.trend === 'down' && <ArrowDownRight className="w-4 h-4 text-rose-600" />}
                  {item.trend === 'stable' && <Minus className="w-4 h-4 text-slate-500" />}
                  <span>{item.trend.toUpperCase()}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default MarketPage;
