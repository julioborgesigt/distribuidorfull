// /stores/unidadeAtiva.js
// Estado compartilhado da "unidade ativa" do admin global. Fica num store
// porque é usado tanto pela barra superior (layouts/default.vue) quanto pela
// página do dashboard (filtra a visão e direciona importações/CSV/PJe).
import { defineStore } from 'pinia'
import apiClient from '@/api/axios'

export const useUnidadeAtivaStore = defineStore('unidadeAtiva', {
  state: () => ({
    unidades: [],
    // null = todas as unidades
    selectedId: null,
    carregada: false,
  }),
  actions: {
    async carregar () {
      try {
        const { data } = await apiClient.get('/admin/unidades')
        this.unidades = data || []
        this.carregada = true
      } catch {
        // silencioso — o seletor fica vazio
      }
    },
    setSelected (id) {
      this.selectedId = id ?? null
    },
  },
})
