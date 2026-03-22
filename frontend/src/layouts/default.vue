<template>
  <v-app :theme="theme.global.name.value">

    <v-app-bar
      app
      color="surface"
      density="compact"
      :class="['container-estreito', 'rounded', { 'drawer-open': drawerOpen }]"
      elevation="2"
    >
      <!-- Hamburger: apenas desktop (md+) -->
      <v-btn
        icon
        class="ml-1 d-none d-md-inline-flex"
        aria-label="Abrir menu"
        @click="drawerOpen = !drawerOpen"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>

      <v-spacer />
      <div class="text-subtitle-1 font-weight-medium mr-3" v-if="user">
        Bem-vindo, {{ user?.nome }}!
      </div>
    </v-app-bar>

    <!-- FAB mobile: flutuante, visível só em telas < md e com drawer fechado -->
    <Teleport to="body">
      <v-btn
        v-if="!drawerOpen"
        icon
        size="small"
        color="surface"
        elevation="4"
        class="d-flex d-md-none"
        style="position: fixed; top: 8px; left: 8px; z-index: 1500;"
        aria-label="Abrir menu"
        @click="drawerOpen = true"
      >
        <v-icon size="20">mdi-menu</v-icon>
      </v-btn>
    </Teleport>

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

// useTheme aqui apenas para a binding :theme no v-app
const theme = useTheme();

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

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
  transition: left 0.2s ease;
}

/* Quando o drawer (256px) está aberto, desloca o centro do app bar */
.container-estreito.drawer-open {
  left: calc(50% + 128px) !important;
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
