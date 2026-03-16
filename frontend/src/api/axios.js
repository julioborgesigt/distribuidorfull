// /frontend/src/api/axios.js

import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

// Em produção (servidor único) e desenvolvimento (via proxy Vite), baseURL aponta para /api.
// Para sobrescrever (ex: backend remoto), defina VITE_API_BASE_URL=https://meubackend.com/api
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: baseURL,
});

// Interceptor de request: adiciona token JWT
apiClient.interceptors.request.use(config => {
  const authStore = useAuthStore();
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  return config;
});

// Interceptor de response: logout automático quando token expira (401)
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore();
      if (authStore.isLoggedIn) {
        authStore.logout();
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;