import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  register: async (data: { email: string; password: string; name: string }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  
  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
  
  updateExcitementWeights: async (weights: Record<string, number>) => {
    const response = await api.put('/auth/excitement-weights', { weights });
    return response.data;
  },
  
  getExcitementWeights: async () => {
    const response = await api.get('/auth/excitement-weights');
    return response.data;
  },
};

export const processes = {
  create: async (data: any) => {
    const response = await api.post('/processes', data);
    return response.data;
  },
  
  getAll: async () => {
    const response = await api.get('/processes');
    return response.data;
  },
  
  getOne: async (id: string) => {
    const response = await api.get(`/processes/${id}`);
    return response.data;
  },
  
  update: async (id: string, data: any) => {
    const response = await api.put(`/processes/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    await api.delete(`/processes/${id}`);
  },
  
  updateExcitementRating: async (id: string, data: { scores: Record<string, number>; notes?: Record<string, string> }) => {
    const response = await api.put(`/processes/${id}/excitement`, data);
    return response.data;
  },
};

export const actionItems = {
  create: async (data: any) => {
    const response = await api.post('/action-items', data);
    return response.data;
  },
  
  update: async (id: string, data: any) => {
    const response = await api.put(`/action-items/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    await api.delete(`/action-items/${id}`);
  },
};

export default api;