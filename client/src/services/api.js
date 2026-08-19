import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
};

export const analyticsAPI = {
  getDashboardData: (params) => API.get('/analytics/dashboard', { params }),
  getProductAnalytics: () => API.get('/analytics/products'),
  getCustomerAnalytics: () => API.get('/analytics/customers'),
  getSalesTeamAnalytics: () => API.get('/analytics/sales-team'),
};

export const importAPI = {
  uploadCSV: (formData) => API.post('/import/sales', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export default API;