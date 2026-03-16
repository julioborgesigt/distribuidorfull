<route lang="yaml">
meta:
  layout: login
</route>

<template>
  <!-- 
    CORREÇÃO: 
    Trocado 'width="400"' por 'max-width="400"' e 'width="100%"'.
    Agora o formulário ocupará 100% da largura em ecrãs pequenos,
    mas limitará a 400px em ecrãs maiores.
  -->
  <v-sheet max-width="400" width="100%" class="mx-auto pa-6" border rounded>
    <h2 class="mb-4">Painel de Admin</h2>
    
    <v-alert v-if="error" type="error" class="mb-4" variant="tonal">
      {{ error }}
    </v-alert>

    <v-form @submit.prevent="handleLogin">
      <v-text-field
        v-model="matricula"
        label="Matrícula"
        variant="outlined"
      ></v-text-field>

      <v-text-field
        v-model="senha"
        label="Senha"
        type="password"
        variant="outlined"
      ></v-text-field>
      
      <v-radio-group v-model="loginType" label="Tipo de Acesso" inline>
        <v-radio label="Admin Padrão" value="admin_padrao"></v-radio>
        <v-radio label="Admin Super" value="admin_super"></v-radio>
      </v-radio-group>

      <v-btn 
        :loading="loading" 
        type="submit" 
        color="primary" 
        block 
        class="mt-2"
        size="large"
      >
        Entrar
      </v-btn>
    </v-form>
  </v-sheet>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const matricula = ref('');
const senha = ref('');
const loginType = ref('admin_padrao');
const loading = ref(false);
const error = ref(null);
const authStore = useAuthStore();

const handleLogin = async () => {
  if (!matricula.value || !senha.value || !loginType.value) {
    error.value = 'Preencha todos os campos.';
    return;
  }
  loading.value = true;
  error.value = null;
  try {
    await authStore.login(matricula.value, senha.value, loginType.value);
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
