// /frontend/src/api/axios.js

import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'

const apiClient = axios.create({
  baseURL,
  withCredentials: true, // Envia cookies httpOnly automaticamente
})

// Flag para evitar loop infinito: logout → 401 → logout → 401 ...
let isLoggingOut = false

// Interceptor de response: logout automático quando token expira (401)
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 && !isLoggingOut) {
      const authStore = useAuthStore()
      if (authStore.isLoggedIn) {
        isLoggingOut = true
        authStore.logout().finally(() => {
          isLoggingOut = false
        })
      }
    }
    return Promise.reject(error)
  },
)

export default apiClient
