<template>
  <v-app :theme="theme.global.name.value">

    <v-app-bar
      app
      class="container-estreito app-bar-modern rounded-lg"
      color="surface"
      density="comfortable"
      flat
      :style="{ '--drawer-shift': appBarShift + 'px' }"
    >
      <v-btn
        aria-label="Abrir menu"
        class="ml-1"
        icon
        @click="drawerOpen = !drawerOpen"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>

      <v-icon class="ms-1 me-2 text-primary" size="22">mdi-scale-balance</v-icon>
      <span class="text-subtitle-1 font-weight-bold app-bar-title d-none d-sm-inline">Distribuidor</span>

      <v-spacer />

      <!-- Seletor de unidade ativa (somente admin global) -->
      <v-select
        v-if="authStore.isSuper"
        v-model="unidadeAtiva.selectedId"
        class="unidade-select me-2"
        clearable
        density="compact"
        hide-details
        item-title="nome"
        item-value="id"
        :items="unidadeAtiva.unidades"
        label="Unidade ativa"
        placeholder="Todas as unidades"
        prepend-inner-icon="mdi-office-building-marker-outline"
        rounded="lg"
        variant="solo-filled"
      />

      <v-chip
        v-if="user"
        v-show="isWide || !drawerOpen"
        class="me-2 font-weight-medium"
        color="primary"
        prepend-icon="mdi-account-circle"
        variant="tonal"
      >
        {{ user?.nome }}
      </v-chip>
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
  import { storeToRefs } from 'pinia'
  import { computed, onMounted, watch } from 'vue'
  import { useDisplay, useTheme } from 'vuetify'
  import { DRAWER_WIDTH, useDrawer } from '@/composables/useDrawer'
  import { useAuthStore } from '@/stores/auth'
  import { useUnidadeAtivaStore } from '@/stores/unidadeAtiva'

  const theme = useTheme()
  const { width } = useDisplay()
  const isWide = computed(() => width.value >= 1660)

  const authStore = useAuthStore()
  const { user } = storeToRefs(authStore)
  const unidadeAtiva = useUnidadeAtivaStore()

  const { drawerOpen } = useDrawer()

  // Carrega a lista de unidades para o seletor da barra (só admin global).
  function carregarUnidadesSeSuper () {
    if (authStore.isSuper && !unidadeAtiva.carregada) unidadeAtiva.carregar()
  }
  onMounted(carregarUnidadesSeSuper)
  // Se o usuário logar depois (troca de sessão), recarrega quando virar super.
  watch(() => authStore.isSuper, carregarUnidadesSeSuper)

  // Em telas largas, o drawer empurra o conteúdo (não sobrepõe) — desloca o
  // centro do app-bar (fixed) na mesma medida para acompanhar o v-main, que
  // já se ajusta sozinho por não ser fixed. Usa DRAWER_WIDTH (mesma constante
  // do dashboard.vue) para nunca ficar dessincronizado se a largura mudar.
  const appBarShift = computed(() => (drawerOpen.value && isWide.value) ? DRAWER_WIDTH / 2 : 0)
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
    --drawer-shift (via :style, calculado a partir de DRAWER_WIDTH) desloca o
    centro do app-bar exatamente na mesma medida que o drawer empurra o
    v-main, para os dois ficarem alinhados. 0px quando o drawer está fechado
    ou a tela não é larga o bastante para o drawer empurrar o conteúdo.
  */
  left: calc(50% + var(--drawer-shift, 0px)) !important;
  transform: translateX(-50%) !important;
  transition: left 0.2s ease;
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

/* Barra superior moderna: leve, com sombra sutil. */
.app-bar-modern {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.14) !important;
  backdrop-filter: saturate(1.2);
}
.app-bar-title {
  letter-spacing: 0.3px;
}

/* Seletor de unidade ativa na barra — compacto e responsivo. */
.unidade-select {
  max-width: 300px;
  min-width: 170px;
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
