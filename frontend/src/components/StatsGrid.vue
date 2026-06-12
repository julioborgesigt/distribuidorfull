<template>
  <v-card-text>
    <!-- Skeleton de carregamento -->
    <div v-if="loading">
      <v-row class="mb-6" dense justify="center">
        <v-skeleton-loader type="button" width="240" />
      </v-row>
      <v-row dense>
        <v-col
          v-for="n in 6"
          :key="n"
          cols="4"
          md="2"
          sm="2"
        >
          <div class="d-flex flex-column align-center ga-2 pa-1">
            <v-skeleton-loader :size="85" type="avatar" />
            <v-skeleton-loader type="text" width="60" />
          </div>
        </v-col>
      </v-row>
    </div>

    <div v-else-if="stats.total === 0" class="text-center text-grey">
      Nenhum dado para exibir com os filtros atuais.
    </div>

    <v-row v-else-if="!loading" class="mb-4 mt-0" dense justify="center">
      <v-btn-toggle
        v-model="currentView"
        class="d-flex flex-column flex-sm-row mb-6"
        color="primary"
        mandatory
        variant="outlined"
      >
        <v-btn
          class="w-100 w-sm-auto mb-2 mb-sm-0"
          value="users"
        >
          Pendentes por Usuário
        </v-btn>
        <v-btn
          class="w-100 w-sm-auto"
          value="details"
        >
          Por Prazo/Assunto
        </v-btn>
      </v-btn-toggle>
    </v-row>

    <div v-if="!loading && stats.total > 0 && currentView === 'users'">
      <v-row dense>

        <v-col cols="4" md="2" sm="2">
          <v-card class="text-center" variant="text">
            <v-progress-circular
              color="primary"
              :model-value="100"
              :size="circleSize"
              :width="circleWidth"
            >
              <strong>{{ stats.total }}</strong>
            </v-progress-circular>
            <v-card-text class="text-primary font-weight-bold pa-1">
              Total
            </v-card-text>
          </v-card>
        </v-col>

        <v-col
          v-for="user in paginatedUsers"
          :key="user.nome"
          cols="4"
          md="2"
          sm="2"
        >
          <v-card class="text-center" variant="text">
            <v-progress-circular
              color="primary"
              :model-value="user.percent"
              :size="circleSize"
              :width="circleWidth"
            >
              <strong>{{ user.count }}</strong>
            </v-progress-circular>
            <v-card-text class="pa-1">
              {{ user.nome }}<br>
              <span class="text-caption">({{ user.percent.toFixed(0) }}%)</span>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row v-if="totalUserPages > 1" class="mt-2" justify="center">
        <v-pagination
          v-model="userPage"
          density="compact"
          :length="totalUserPages"
          size="small"
        />
      </v-row>
    </div>

    <div v-else-if="!loading && stats.total > 0 && currentView === 'details'">

      <v-row dense>
        <v-col
          v-for="prazo in stats.byPrazo"
          :key="prazo.nome"
          cols="6"
          md="2"
          sm="4"
        >
          <v-card class="text-center" variant="text">
            <v-progress-circular
              color="orange"
              :model-value="prazo.percent"
              :size="circleSize"
              :width="circleWidth"
            >
              <strong>{{ prazo.count }}</strong>
            </v-progress-circular>
            <v-card-text class="pa-1">
              {{ prazo.nome }}<br>
              <span class="text-caption">({{ prazo.percent.toFixed(0) }}%)</span>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col
          v-for="assunto in stats.byAssunto"
          :key="assunto.nome"
          cols="6"
          md="2"
          sm="4"
        >
          <v-card class="text-center" variant="text">
            <v-progress-circular
              color="blue"
              :model-value="assunto.percent"
              :size="circleSize"
              :width="circleWidth"
            >
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
  import { computed, ref, watch } from 'vue'
  import { useDisplay } from 'vuetify'

  const props = defineProps({
    stats: {
      type: Object,
      default: () => ({ total: 0, byUser: [], byPrazo: [], byAssunto: [] }),
    },
    loading: {
      type: Boolean,
      default: false,
    },
  })

  // --- NOVO ESTADO DE VISÃO ---
  const currentView = ref('users')

  // --- LÓGICA DE PAGINAÇÃO (Sem alteração) ---
  const itemsPerPage = 11
  const userPage = ref(1)
  const totalUserPages = computed(() => {
    if (props.stats.byUser.length <= itemsPerPage) return 1
    return Math.ceil(props.stats.byUser.length / itemsPerPage)
  })
  // Volta para a primeira página se a atual deixar de existir (ex.: filtro
  // encolheu a lista) — antes isso era um efeito colateral dentro do computed
  // e só cobria o caso de 1 página, deixando a lista vazia nos demais.
  watch(totalUserPages, total => {
    if (userPage.value > total) {
      userPage.value = 1
    }
  })

  const paginatedUsers = computed(() => {
    const start = (userPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return props.stats.byUser.slice(start, end)
  })

  // --- ✅ 2. LÓGICA DE TAMANHO RESPONSIVO ---
  const { name: breakpointName } = useDisplay()

  // Define o tamanho do círculo com base no breakpoint
  const circleSize = computed(() => {
    switch (breakpointName.value) {
      case 'xs': { return 60
      } // Celulares
      case 'sm': { return 75
      } // Tablets
      default: { return 85
      } // Telas médias (md) ou maiores
    }
  })

  // Define a espessura do círculo com base no breakpoint
  const circleWidth = computed(() => {
    switch (breakpointName.value) {
      case 'xs': { return 6
      }
      case 'sm': { return 7
      }
      default: { return 8
      }
    }
  })

</script>
