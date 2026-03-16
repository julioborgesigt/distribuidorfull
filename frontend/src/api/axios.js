// /fronted/src/api/axios.js

import axios from 'axios';
import { useAuthStore } from '@/stores/auth';


const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://distribuidor.domcloud.dev';
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