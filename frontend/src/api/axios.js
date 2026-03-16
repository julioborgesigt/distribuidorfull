// /fronted/src/api/axios.js

import axios from 'axios';
import { useAuthStore } from '@/stores/auth';


// Em produção (servidor único) e desenvolvimento (via proxy Vite), baseURL aponta para /api.
// Para sobrescrever (ex: backend remoto), defina VITE_API_BASE_URL=https://meubackend.com/api
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';
// 1. Cria uma instância do Axios

const apiClient = axios.create({
  baseURL: baseURL,
});

// Seu interceptor de token (provavelmente você tem algo assim)
apiClient.interceptors.request.use(config => {
  const authStore = useAuthStore();
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  return config;
});

export default apiClient;