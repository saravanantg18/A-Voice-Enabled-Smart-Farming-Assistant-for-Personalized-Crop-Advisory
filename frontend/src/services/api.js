import axios from 'axios';

const API_BASE = '/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT Auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('farmer_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const farmerAPI = {
  getProfile: () => api.get('/farmer/profile'),
  updateProfile: (data) => api.put('/farmer/profile', data),
};

export const soilAPI = {
  getSoilRecords: () => api.get('/soil'),
  addSoilRecord: (data) => api.post('/soil', data),
};

export const cropAPI = {
  predictCrop: (data) => api.post('/crop/recommend', data),
  getHistory: () => api.get('/crop/recommendations'),
};

export const weatherAPI = {
  getWeather: (district) => api.get('/weather', { params: { district } }),
};

export const marketAPI = {
  getMarketPrices: () => api.get('/market-prices'),
};

export const chatAPI = {
  query: (data) => api.post('/chat', data),
};

export const voiceAPI = {
  transcribe: (data) => api.post('/voice/transcribe', data),
  speak: (data) => api.post('/voice/speak', data),
};

export const alertAPI = {
  getAlerts: () => api.get('/alerts'),
};

export default api;
