import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, farmerAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('farmer_token') || null);
  const [language, setLanguage] = useState('ml'); // 'ml' for Malayalam, 'en' for English
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      loadUserData();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userRes = await authAPI.getMe();
      setUser(userRes.data);

      const profileRes = await farmerAPI.getProfile();
      setProfile(profileRes.data);
      if (profileRes.data?.preferred_language) {
        setLanguage(profileRes.data.preferred_language);
      }
    } catch (err) {
      console.error('Failed to load user state:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const newToken = res.data.access_token;
    localStorage.setItem('farmer_token', newToken);
    setToken(newToken);
    return res.data;
  };

  const register = async (formData) => {
    const res = await authAPI.register(formData);
    // Auto login after register
    return await login(formData.email, formData.password);
  };

  const logout = () => {
    localStorage.removeItem('farmer_token');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const toggleLanguage = async () => {
    const nextLang = language === 'ml' ? 'en' : 'ml';
    setLanguage(nextLang);
    if (profile) {
      try {
        const updated = await farmerAPI.updateProfile({ preferred_language: nextLang });
        setProfile(updated.data);
      } catch (e) {
        console.error('Language update failed:', e);
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      token,
      language,
      loading,
      login,
      register,
      logout,
      toggleLanguage,
      setProfile,
      loadUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
