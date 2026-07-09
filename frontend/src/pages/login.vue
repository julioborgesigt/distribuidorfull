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
  <v-sheet
    border
    class="mx-auto pa-6"
    max-width="400"
    rounded
    width="100%"
  >
    <h2 class="mb-4">Painel de Admin</h2>

    <v-alert v-if="error" class="mb-4" type="error" variant="tonal">
      {{ error }}
    </v-alert>

    <v-form @submit.prevent="handleLogin">
      <v-text-field
        v-model="matricula"
        label="Matrícula"
        variant="outlined"
      />

      <v-text-field
        v-model="senha"
        label="Senha"
        type="password"
        variant="outlined"
      />

      <v-radio-group v-model="modo" inline label="Modo de acesso">
        <v-radio label="Usuário" value="usuario" />
        <v-radio label="Adm Unidade" value="unidade" />
      </v-radio-group>
      <div class="text-caption text-medium-emphasis mb-2">
        <div><strong>Usuário</strong>: vê apenas os processos atribuídos a você.</div>
        <div><strong>Adm Unidade</strong>: consegue ver e distribuir todos os processos da sua unidade.</div>
      </div>

      <v-btn
        block
        class="mt-2"
        color="primary"
        :loading="loading"
        size="large"
        type="submit"
      >
        Entrar
      </v-btn>
    </v-form>
  </v-sheet>
</template>

<script setup>
  import { ref } from 'vue'
  import { useAuthStore } from '@/stores/auth'

  const matricula = ref('')
  const senha = ref('')
  const modo = ref('usuario')
  const loading = ref(false)
  const error = ref(null)
  const authStore = useAuthStore()

  async function handleLogin () {
    if (!matricula.value || !senha.value) {
      error.value = 'Preencha todos os campos.'
      return
    }
    loading.value = true
    error.value = null
    try {
      await authStore.login(matricula.value, senha.value, modo.value)
    } catch (error_) {
      loading.value = false
      error.value = error_.response && error_.response.data ? error_.response.data.error || 'Erro desconhecido' : 'Não foi possível conectar ao servidor.'
    }
  }
</script>
