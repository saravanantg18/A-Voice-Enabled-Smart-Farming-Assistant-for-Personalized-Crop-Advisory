import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import NavigationTabs from './components/NavigationTabs';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import VoiceAssistant from './pages/VoiceAssistant';
import CropRecommend from './pages/CropRecommend';
import WeatherPage from './pages/WeatherPage';
import SoilInfo from './pages/SoilInfo';
import MarketPage from './pages/MarketPage';
import AlertsPage from './pages/AlertsPage';
import ProfilePage from './pages/ProfilePage';
import { Sprout, Heart } from 'lucide-react';

const MainContent = () => {
  const { user, loading } = useAuth();
  const [activePage, setActivePage] = useState(user ? 'dashboard' : 'landing');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-emerald-700 text-white rounded-2xl flex items-center justify-center mx-auto animate-bounce shadow-lg">
            <Sprout className="w-8 h-8 stroke-[2.5]" />
          </div>
          <p className="text-sm font-bold text-slate-700">Loading Smart Farming Assistant...</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (activePage) {
      case 'landing':
        return <Landing setActivePage={setActivePage} />;
      case 'login':
        return <Login setActivePage={setActivePage} />;
      case 'register':
        return <Register setActivePage={setActivePage} />;
      case 'dashboard':
        return user ? <Dashboard setActivePage={setActivePage} /> : <Login setActivePage={setActivePage} />;
      case 'voice':
        return user ? <VoiceAssistant /> : <Login setActivePage={setActivePage} />;
      case 'crop':
        return user ? <CropRecommend /> : <Login setActivePage={setActivePage} />;
      case 'weather':
        return user ? <WeatherPage /> : <Login setActivePage={setActivePage} />;
      case 'soil':
        return user ? <SoilInfo /> : <Login setActivePage={setActivePage} />;
      case 'market':
        return user ? <MarketPage /> : <Login setActivePage={setActivePage} />;
      case 'alerts':
        return user ? <AlertsPage /> : <Login setActivePage={setActivePage} />;
      case 'profile':
        return user ? <ProfilePage /> : <Login setActivePage={setActivePage} />;
      default:
        return user ? <Dashboard setActivePage={setActivePage} /> : <Landing setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-emerald-200">
      
      {/* Top Header Navbar */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* Navigation Tabs Bar for Authenticated Users */}
      {user && (
        <NavigationTabs activePage={activePage} setActivePage={setActivePage} />
      )}

      {/* Main Page Body */}
      <main className="flex-1 pb-16">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
            <Sprout className="w-5 h-5" />
            <span>Voice-Enabled Smart Farming Assistant for Personalized Crop Advisory</span>
          </div>
          <p className="text-slate-500 max-w-xl mx-auto">
            A comprehensive agricultural decision support system designed for farmers in Kerala, featuring Malayalam voice recognition, Random Forest ML crop recommendation, OpenWeather integration, and AGMARKNET market prices.
          </p>
          <div className="pt-2 text-[11px] text-slate-600 flex items-center justify-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Smallholder & Low-Literacy Farmers</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
};

export default App;
