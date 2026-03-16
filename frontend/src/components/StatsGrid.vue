<template>
  <v-card-text>
    <div v-if="stats.total === 0" class="text-center text-grey">
      Nenhum dado para exibir com os filtros atuais.
    </div>

    <v-row v-else dense justify="center" class="mb-4 mt-0">
      <v-btn-toggle
        v-model="currentView"
        color="primary"
        variant="outlined"
        mandatory
        class="d-flex flex-column flex-sm-row mb-6"
      >
        <v-btn 
          value="users" 
          class="w-100 w-sm-auto mb-2 mb-sm-0" >
          Pendentes por Usuário
        </v-btn>
        <v-btn 
          value="details" 
          class="w-100 w-sm-auto" >
          Por Prazo/Assunto
        </v-btn>
      </v-btn-toggle>
    </v-row>

    <div v-if="stats.total > 0 && currentView === 'users'">
      <v-row dense>
        
        <v-col cols="4" sm="2" md="2">
          <v-card variant="text" class="text-center">
            <v-progress-circular
            :model-value="100"
            color="primary"
            :size="circleSize"  :width="circleWidth" >
            <strong>{{ stats.total }}</strong>
          </v-progress-circular>
            <v-card-text class="text-primary font-weight-bold pa-1">
              Total
            </v-card-text>
          </v-card>
        </v-col>

        <v-col v-for="user in paginatedUsers" :key="user.nome" cols="4" sm="2" md="2">
          <v-card variant="text" class="text-center">
            <v-progress-circular
            :model-value="user.percent"
            color="primary"
            :size="circleSize"  :width="circleWidth" >
            <strong>{{ user.count }}</strong>
          </v-progress-circular>
            <v-card-text class="pa-1">
              {{ user.nome }}<br>
              <span class="text-caption">({{ user.percent.toFixed(0) }}%)</span>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row v-if="totalUserPages > 1" justify="center" class="mt-2">
        <v-pagination
          v-model="userPage"
          :length="totalUserPages"
          size="small"
          density="compact"
        ></v-pagination>
      </v-row>
    </div>

    <div v-else-if="stats.total > 0 && currentView === 'details'">
      
      <v-row dense>
        <v-col v-for="prazo in stats.byPrazo" :key="prazo.nome" cols="6" sm="4" md="2">
          <v-card variant="text" class="text-center">
            <v-progress-circular
            :model-value="prazo.percent"
            color="orange"
            :size="circleSize"  :width="circleWidth" >
            <strong>{{ prazo.count }}</strong>
          </v-progress-circular>
            <v-card-text class="pa-1">
              {{ prazo.nome }}<br>
              <span class="text-caption">({{ prazo.percent.toFixed(0) }}%)</span>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col v-for="assunto in stats.byAssunto" :key="assunto.nome" cols="6" sm="4" md="2">
          <v-card variant="text" class="text-center">
            <v-progress-circular
            :model-value="assunto.percent"
            color="blue"
            :size="circleSize"  :width="circleWidth" >
            <strong>{{ assunto.count }}</strong>
          </v-progress-circular>
            <v-card-text class="pa-1">
              {{ assunto.nome }}<br>
              <span class="text-caption">({{ assunto.percent.toFixed(0) }}%)</span>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

  </v-card-text>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useDisplay } from 'vuetify';

// Props (Sem alteração)
const props = defineProps({
  stats: {
    type: Object,
    required: true,
    default: () => ({ total: 0, byUser: [], byPrazo: [], byAssunto: [] })
  }
});

// --- NOVO ESTADO DE VISÃO ---
const currentView = ref('users');

// --- LÓGICA DE PAGINAÇÃO (Sem alteração) ---
const itemsPerPage = 11; 
const userPage = ref(1);
const totalUserPages = computed(() => {
  if (props.stats.byUser.length <= itemsPerPage) return 1;
  return Math.ceil(props.stats.byUser.length / itemsPerPage);
});
const paginatedUsers = computed(() => {
  if (totalUserPages.value === 1) {
    userPage.value = 1;
  }
  const start = (userPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return props.stats.byUser.slice(start, end);
});


// --- ✅ 2. LÓGICA DE TAMANHO RESPONSIVO ---
const { name: breakpointName } = useDisplay();

// Define o tamanho do círculo com base no breakpoint
const circleSize = computed(() => {
  switch (breakpointName.value) {
    case 'xs': return 60; // Celulares
    case 'sm': return 75; // Tablets
    default: return 85;  // Telas médias (md) ou maiores
  }
});

// Define a espessura do círculo com base no breakpoint
const circleWidth = computed(() => {
  switch (breakpointName.value) {
    case 'xs': return 6;
    case 'sm': return 7;
    default: return 8;
  }
});

</script>