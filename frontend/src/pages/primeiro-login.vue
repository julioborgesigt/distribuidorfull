<route lang="yaml">
meta:
  layout: login
</route>

<template>
  <v-sheet border class="mx-auto pa-6" rounded width="400">
    <h2 class="mb-4">Primeiro Acesso</h2>
    <p class="mb-4">Por favor, crie uma nova senha para continuar.</p>

    <v-alert v-if="error" class="mb-4" type="error" variant="tonal">
      {{ error }}
    </v-alert>

    <v-form @submit.prevent="handleFirstLogin">
      <v-text-field
        v-model="novaSenha"
        hint="Mínimo 8 caracteres, com maiúscula, minúscula e número"
        label="Nova Senha"
        persistent-hint
        :rules="senhaRules"
        type="password"
        variant="outlined"
      />

      <v-btn
        block
        class="mt-2"
        color="primary"
        :loading="loading"
        size="large"
        type="submit"
      >
        Definir Senha e Entrar
      </v-btn>
    </v-form>
  </v-sheet>
</template>

<script setup>
  import { ref } from 'vue'
  import { useAuthStore } from '@/stores/auth'

  const novaSenha = ref('')
  const loading = ref(false)
  const error = ref(null)
  const authStore = useAuthStore()

  const senhaRules = [
    v => !!v || 'A nova senha é obrigatória',
    v => (v && v.length >= 8) || 'Mínimo de 8 caracteres',
    v => /[A-Z]/.test(v) || 'Deve conter ao menos uma letra maiúscula',
    v => /[a-z]/.test(v) || 'Deve conter ao menos uma letra minúscula',
    v => /[0-9]/.test(v) || 'Deve conter ao menos um número',
  ]

  // Função que chama a action da store
  async function handleFirstLogin () {
    if (!novaSenha.value || senhaRules.some(rule => rule(novaSenha.value) !== true)) {
      error.value = 'Por favor, preencha a senha seguindo os requisitos.'
      return
    }

    loading.value = true
    error.value = null

    try {
      // Chama a ação que criamos na store
      await authStore.completeFirstLogin(novaSenha.value)
    // O redirecionamento para o dashboard é feito DENTRO da store
    } catch (error_) {
      loading.value = false
      error.value = error_.response && error_.response.data ? error_.response.data.error || 'Erro desconhecido' : 'Não foi possível conectar ao servidor.'
    }
  }
</script>
