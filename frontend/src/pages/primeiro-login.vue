<route lang="yaml">
meta:
  layout: login
</route>

<template>
  <v-sheet width="400" class="mx-auto pa-6" border rounded>
    <h2 class="mb-4">Primeiro Acesso</h2>
    <p class="mb-4">Por favor, crie uma nova senha para continuar.</p>
    
    <v-alert v-if="error" type="error" class="mb-4" variant="tonal">
      {{ error }}
    </v-alert>

    <v-form @submit.prevent="handleFirstLogin">
      <v-text-field
        v-model="novaSenha"
        label="Nova Senha"
        type="password"
        variant="outlined"
        :rules="[v => !!v || 'A nova senha é obrigatória']"
      ></v-text-field>

      <v-btn 
        :loading="loading" 
        type="submit" 
        color="primary" 
        block 
        class="mt-2"
        size="large"
      >
        Definir Senha e Entrar
      </v-btn>
    </v-form>
  </v-sheet>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const novaSenha = ref('');
const loading = ref(false);
const error = ref(null);
const authStore = useAuthStore();

// Função que chama a action da store
const handleFirstLogin = async () => {
  if (!novaSenha.value) {
    error.value = 'Por favor, digite uma nova senha.';
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    // Chama a ação que criamos na store
    await authStore.completeFirstLogin(novaSenha.value);
    // O redirecionamento para o dashboard é feito DENTRO da store
    
  } catch (err) {
    loading.value = false;
    if (err.response && err.response.data) {
      error.value = err.response.data.error || 'Erro desconhecido';
    } else {
      error.value = 'Não foi possível conectar ao servidor.';
    }
  }
};
</script>