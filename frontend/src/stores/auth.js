// /fronted/src/stores/auth.js

import { defineStore } from 'pinia';
import apiClient from '@/api/axios'; // Nosso cliente Axios
import router from '@/router';       // O Vue Router

export const useAuthStore = defineStore('auth', {
  // 1. STATE (Onde os dados ficam)
  // Lemos o localStorage para manter o usuário logado se ele der F5
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    // Guarda os dados temporários entre a tela de login e a de primeiro login
    firstLoginData: JSON.parse(sessionStorage.getItem('firstLoginData')) || null
  }),

  // 2. GETTERS (Propriedades computadas)
  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdminSuper: (state) => state.user?.admin_super
  },

  // 3. ACTIONS (As funções que fazem o trabalho)
  actions: {
    
    /**
     * Ação de Login principal
     *
     */
    async login(matricula, senha, loginType) {
      // Chama o endpoint POST /api/auth/login
      const { data } = await apiClient.post('/auth/login', {
        matricula,
        senha,
        loginType // 'admin_padrao' ou 'admin_super'
      });

      // Cenário 1: É o primeiro login do usuário
      if (data.firstLogin) {
        this.firstLoginData = { userId: data.userId, loginType: data.loginType };
        // Salva temporariamente na sessionStorage caso o usuário dê F5
        sessionStorage.setItem('firstLoginData', JSON.stringify(this.firstLoginData));
        router.push('/primeiro-login'); // Redireciona para a troca de senha
        return;
      }

      // Cenário 2: Login normal
      this.setAuth(data.token, data.user);
      
      // Redireciona para o dashboard
      router.push('/dashboard');
    },

    /**
     * Ação para completar o primeiro login
     *
     */
    async completeFirstLogin(novaSenha) {
      if (!this.firstLoginData) {
        router.push('/login'); // Se não tiver os dados, volta pro login
        return;
      }
      
      const { userId, loginType } = this.firstLoginData;

      // Chama o endpoint POST /api/auth/primeiro-login
      const { data } = await apiClient.post('/auth/primeiro-login', {
        userId,
        novaSenha,
        loginType
      });

      // Salva os dados de autenticação
      this.setAuth(data.token, data.user);
      
      // Limpa os dados temporários
      this.firstLoginData = null;
      sessionStorage.removeItem('firstLoginData');

      // Redireciona para o dashboard
      router.push('/dashboard');
    },

    /**
     * Ação de Logout
     */
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('firstLoginData');
      router.push('/login');
    },
    
    /**
     * Função auxiliar para salvar o estado
     */
    setAuth(token, user) {
      this.token = token;
      this.user = user;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
  }
});