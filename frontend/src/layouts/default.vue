<template>
  <v-app :theme="theme.global.name.value">

    <v-app-bar
      app
      color="surface"
      density="compact"
      class="container-estreito rounded"
      elevation="2"
    >
      <!-- Hamburger: visível apenas no mobile -->
      <v-btn
        icon
        class="d-flex d-sm-none ml-1"
        aria-label="Abrir menu"
        @click="drawerOpen = !drawerOpen"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>

      <!-- Botão de tema: visível apenas no desktop -->
      <v-btn
        :title="theme.global.current.value.dark ? 'Mudar para tema claro' : 'Mudar para tema escuro'"
        icon
        @click="toggleTheme"
        class="mr-1 ml-4 d-none d-sm-flex"
      >
        <v-icon>
          {{ theme.global.current.value.dark ? 'mdi-white-balance-sunny' : 'mdi-weather-night' }}
        </v-icon>
      </v-btn>

      <v-col class="text-md-left" v-if="user">
        <div class="text-subtitle-1 font-weight-medium">Bem-vindo, {{ user?.nome }}!</div>
      </v-col>

      <v-spacer></v-spacer>

      <!-- Botão de sair: visível apenas no desktop -->
      <v-btn @click="handleLogout" prepend-icon="mdi-logout" variant="text" class="d-none d-sm-flex">
        <span class="d-none d-sm-inline">Sair</span>
      </v-btn>
    </v-app-bar>

    <!-- Conteúdo Principal da Página -->
    <v-main>
      <v-container class="container-estreito py-6">
        <router-view />
      </v-container>
    </v-main>

  </v-app>
</template>

<script setup>
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import { useDrawer } from '@/composables/useDrawer';

// --- Lógica do Tema ---
const theme = useTheme();
const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
};

// --- Lógica de Autenticação e Logout ---
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const handleLogout = () => {
  authStore.logout();
};

// --- Drawer (menu lateral mobile) — controlado pelo dashboard.vue ---
const { drawerOpen } = useDrawer();
</script>

<!--
  ATUALIZAÇÃO IMPORTANTE:
  Removi o "scoped" da tag <style>.
  Isto é necessário para que a nossa classe .container-estreito
  consiga modificar o componente <v-app-bar> do Vuetify.
-->
<style>
/* Esta regra aplica-se à v-app-bar (que é 'fixed').
*/
.container-estreito {
  max-width: 1400px !important;
  width: 100%;

  /* CORREÇÃO: Esta é a forma robusta de centrar
    um elemento 'fixed' (a v-app-bar).
  */
  left: 50% !important;
  transform: translateX(-50%) !important;
}

/* Esta regra garante que o container DENTRO do v-main
  (que NÃO é 'fixed') use o 'margin: auto' normal
  e anule o 'transform' da regra acima.
*/
.v-main .container-estreito {
  /* Anula a centralização 'fixed' */
  left: unset !important;
  right: unset !important;
  transform: none !important;

  /* Adiciona a centralização 'static' (normal) */
  margin-left: auto !important;
  margin-right: auto !important;

  padding-left: 0px;
  padding-right: 0px;
}

/* CORREÇÃO PARA TABELA EM MODO CLARO:
  Força as linhas da tabela (v-data-table) a serem visíveis
  no tema claro (v-theme--light).
*/
.v-theme--light .v-data-table .v-table__wrapper > table > tbody > tr > td,
.v-theme--light .v-data-table .v-table__wrapper > table > thead > tr > th {
    border-bottom-color: rgba(0, 0, 0, 0.12) !important; /* Cor cinza padrão */
}
</style>
