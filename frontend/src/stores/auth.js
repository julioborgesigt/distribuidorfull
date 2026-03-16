// /frontend/src/stores/auth.js

import { defineStore } from 'pinia';
import apiClient from '@/api/axios';
import router from '@/router';

export const useAuthStore = defineStore('auth', {
  // STATE
  // O token JWT agora é armazenado em cookie httpOnly pelo backend.
  // Apenas os dados do usuário ficam no localStorage (não é dado sensível).
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    firstLoginData: JSON.parse(sessionStorage.getItem('firstLoginData')) || null
  }),

  // GETTERS
  getters: {
    isLoggedIn: (state) => !!state.user,
    isAdminSuper: (state) => state.user?.admin_super
  },

  // ACTIONS
  actions: {
    /**
     * Ação de Login principal
     */
    async login(matricula, senha, loginType) {
      const { data } = await apiClient.post('/auth/login', {
        matricula,
        senha,
        loginType
      });

      // Cenário 1: É o primeiro login do usuário
      if (data.firstLogin) {
        this.firstLoginData = { userId: data.userId, loginType: data.loginType };
        sessionStorage.setItem('firstLoginData', JSON.stringify(this.firstLoginData));
        router.push('/primeiro-login');
        return;
      }

      // Cenário 2: Login normal
      // O token JWT já foi definido como cookie httpOnly pelo backend
      this.setUser(data.user);
      router.push('/dashboard');
    },

    /**
     * Ação para completar o primeiro login
     */
    async completeFirstLogin(novaSenha) {
      if (!this.firstLoginData) {
        router.push('/login');
        return;
      }

      const { userId, loginType } = this.firstLoginData;

      const { data } = await apiClient.post('/auth/primeiro-login', {
        userId,
        novaSenha,
        loginType
      });

      // O token JWT já foi definido como cookie httpOnly pelo backend
      this.setUser(data.user);

      // Limpa os dados temporários
      this.firstLoginData = null;
      sessionStorage.removeItem('firstLoginData');

      router.push('/dashboard');
    },

    /**
     * Ação de Logout
     */
    async logout() {
      try {
        // Solicita ao backend que limpe o cookie httpOnly
        await apiClient.post('/auth/logout');
      } catch {
        // Mesmo se falhar, limpa o estado local
      }
      this.user = null;
      localStorage.removeItem('user');
      sessionStorage.removeItem('firstLoginData');
      router.push('/login');
    },

    /**
     * Função auxiliar para salvar dados do usuário
     */
    setUser(user) {
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    }
  }
});
