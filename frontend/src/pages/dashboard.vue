<template>
  <!-- 
    O <v-container class="container-estreito"> foi removido daqui,
    pois agora ele está no default.vue envolvendo o <router-view>.
  -->

  <!-- Alert de processos não atribuídos (inalterado) -->
  <v-alert
    v-if="unassignedCount > 0 && showUnassignedAlert"
    type="warning"
    variant="tonal"
    closable
    @click:close="showUnassignedAlert = false"
    class="mb-6"
    border="start"
    prominent
  >
    <div class="d-flex justify-space-between align-center flex-wrap ga-2">
      <div>
        Atenção: Existem <strong>{{ unassignedCount }}</strong> processo(s) sem atribuição.
      </div>
      <v-btn
        color="warning"
        variant="flat"
        @click="filterUnassigned"
        size="small"
      >
        Filtrar Não Atribuídos
      </v-btn>
    </div>
  </v-alert>

  <!-- Barra lateral: teleportada ao body para sobrepor o app bar inteiro -->
  <Teleport to="body">
  <v-navigation-drawer
    v-model="drawerOpen"
    location="left"
    width="256"
    style="top: 0; height: 100%; position: fixed; z-index: 1010;"
  >
    <!-- Topo: saudação + ações de admin -->
    <v-list>
      <v-list-item
        v-if="user"
        prepend-icon="mdi-account-circle"
        :subtitle="user.nome"
        title="Bem-vindo"
      >
        <template #append>
          <v-btn
            v-if="!isWide"
            icon
            size="small"
            variant="text"
            aria-label="Fechar menu"
            @click="drawerOpen = false"
          >
            <v-icon size="20">mdi-close</v-icon>
          </v-btn>
        </template>
      </v-list-item>

      <template v-if="user?.admin_super">
        <v-divider class="mt-2" />
        <v-list-subheader>Administrador</v-list-subheader>
        <v-list-item
          prepend-icon="mdi-account-plus-outline"
          title="Cadastrar Usuário"
          @click="() => { drawerOpen = false; userDialogs?.abrirModalCadastro(); }"
        />
        <v-list-item
          prepend-icon="mdi-lock-reset"
          title="Resetar Senha"
          base-color="orange"
          @click="() => { drawerOpen = false; userDialogs?.abrirModalReset(); }"
        />
        <v-list-item
          prepend-icon="mdi-account-remove-outline"
          title="Apagar Usuário"
          base-color="red"
          @click="() => { drawerOpen = false; userDialogs?.abrirModalDelete(); }"
        />
        <v-list-item
          prepend-icon="mdi-file-upload-outline"
          title="Importar CSV"
          base-color="teal"
          @click="() => { drawerOpen = false; userDialogs?.abrirModalUpload(); }"
        />
      </template>
    </v-list>

    <!-- Rodapé fixo: tema e sair -->
    <template #append>
      <v-divider />
      <v-list>
        <v-list-item
          :prepend-icon="theme.global.current.value.dark ? 'mdi-white-balance-sunny' : 'mdi-weather-night'"
          :title="theme.global.current.value.dark ? 'Tema Claro' : 'Tema Escuro'"
          @click="toggleTheme"
        />
        <v-list-item
          prepend-icon="mdi-logout"
          title="Sair"
          base-color="error"
          @click="() => { drawerOpen = false; authStore.logout(); }"
        />
      </v-list>
    </template>
  </v-navigation-drawer>
  </Teleport>

  <!-- O resto do seu template do dashboard continua aqui (gráficos, filtros, tabela) -->
  <v-expansion-panels class="mb-6" :model-value="mdAndUp ? 0 : undefined">
    
    <v-expansion-panel :readonly="mdAndUp">
      
      <v-expansion-panel-title :hide-actions="mdAndUp">
        <v-icon start>mdi-chart-bar</v-icon>
        Gráficos e Estatísticas
      </v-expansion-panel-title>

      <v-expansion-panel-text>
        <v-row dense class="pt-0"> <v-col cols="12" lg="6" > 
            <stats-grid
              :stats="statsData"
              :loading="loadingCharts"
              style="padding-right: 1%;"
            />
          </v-col>       

          <v-col 
            cols="12" 
            lg="6" 
            :class="{ 'mt-6 border-s pl-4': mdAndUp }"
          > 
            <v-card-subtitle>Cumpridos por Usuário (Últimos 30 dias)</v-card-subtitle>
            <cumpridos-chart
              :chart-data="cumpridosChartData"
              :loading="loadingCharts"
            />
          </v-col>

        </v-row> 
      </v-expansion-panel-text>
      
    </v-expansion-panel>
  </v-expansion-panels>
  
  <v-expansion-panels class="mb-6">
      <v-expansion-panel> <v-expansion-panel-title>
        <v-icon start>mdi-filter-variant</v-icon>
        Filtros
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="filters.classe"
              :items="uniqueClasses"
              label="Classe"
              density="compact"
              variant="outlined"
              clearable
              multiple
              chips
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="filters.assunto"
              :items="uniqueAssuntos"
              label="Assunto"
              density="compact"
              variant="outlined"
              clearable
              multiple
              chips
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="filters.tarjas"
              :items="uniqueTarjas"
              label="Tarjas"
              density="compact"
              variant="outlined"
              clearable
              multiple
              chips
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="filters.userId"
              :items="uniqueUsers"
              item-title="title"
              item-value="value"
              label="Usuário"
              density="compact"
              variant="outlined"
              clearable
              multiple
              chips
              :disabled="!user?.admin_super"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="filters.cumprido"
              :items="statusCumpridoOptions"
              item-title="title"
              item-value="value"
              label="Status (Cumprido)"
              density="compact"
              variant="outlined"
              :disabled="!user?.admin_super"
            ></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="filters.prazo"
              :items="prazoOptions"
              item-title="title"
              item-value="value"
              label="Prazo Restante"
              density="compact"
              variant="outlined"
              clearable
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-menu
              v-model="menuInicio"
              :close-on-content-click="false"
              location="bottom end"
              transition="scale-transition"
            >
              <template v-slot:activator="{ props }">
                <v-text-field
                  v-model="formattedDataInicio"
                  label="Data Início (Cumprido)"
                  density="compact"
                  variant="outlined"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                  clearable
                  @click:clear="filters.data_inicio = null"
                  v-bind="props"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="filters.data_inicio"
                @update:model-value="menuInicio = false"
                locale="pt-BR"
                hide-header
                title="Data Início"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" md="3">
            <v-menu
              v-model="menuFim"
              :close-on-content-click="false"
              location="bottom end"
              transition="scale-transition"
            >
              <template v-slot:activator="{ props }">
                <v-text-field
                  v-model="formattedDataFim"
                  label="Data Fim (Cumprido)"
                  density="compact"
                  variant="outlined"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                  clearable
                  @click:clear="filters.data_fim = null"
                  v-bind="props"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="filters.data_fim"
                @update:model-value="menuFim = false"
                locale="pt-BR"
                hide-header
                title="Data Fim"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" md="2" class="d-flex align-center">
            <v-btn
              variant="tonal"
              color="grey"
              prepend-icon="mdi-filter-remove-outline"
              @click="limparFiltros"
              block
              aria-label="Limpar todos os filtros"
            >
              Limpar Filtros
            </v-btn>
          </v-col>
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
  


  <v-card>
    <v-card-title class="d-flex justify-space-between align-center flex-wrap ga-2">
      <span class="text-h5">Lista de Processos</span>
      <v-spacer></v-spacer>

      <div class="d-flex ga-2 flex-wrap justify-end">
        <v-btn
          color="primary"
          variant="flat"
          prepend-icon="mdi-download"
          @click="downloadPDF(serverItems)" :disabled="serverItems.length === 0 || actionLoading"
        >
          <span class="d-none d-md-inline">Baixar Exibidos</span>
        </v-btn>
        
        <v-btn
          color="blue-grey"
          variant="flat"
          prepend-icon="mdi-download-box-outline"
          @click="downloadPDF(selected)"
          :disabled="selected.length === 0"
        >
          <span class="d-none d-md-inline">Baixar Selecionados</span>
        </v-btn>

        <v-btn
          color="secondary"
          variant="flat"
          prepend-icon="mdi-account-arrow-right"
          @click="abrirModalBulkAssign"
          :disabled="selected.length === 0"
        >
          <span class="d-none d-md-inline">Atribuir Seleção</span>
        </v-btn>
      </div>
    </v-card-title>

    <v-card-text class="pt-2 pb-0">
      <v-text-field
        v-model="search"
        label="Buscar processo..."
        variant="outlined"
        density="compact"
        prepend-inner-icon="mdi-magnify"
        hide-details
        ></v-text-field>
    </v-card-text>
    
    <tabela-processos
      v-model:selected="selected"
      :items="serverItems"
      :totalItems="totalItems"
      :loading="loadingTable"
      :action-loading="actionLoading"
      :action-loading-text="actionLoadingText"
      @update:options="options = $event"
      @salvar-obs="handleSalvarObservacoes"
      @marcar-cumprido="handleMarcarComoCumprido"
    />
  
  </v-card> 
  
  <!-- Modais de administração de usuários (cadastro, reset, exclusão, CSV) -->
  <user-admin-dialogs
    ref="userDialogs"
    :all-users-options="allUsersOptions"
    @notify="notify"
    @users-changed="handleUsersChanged"
    @data-changed="reloadAllData"
  />

  <v-dialog v-model="dialogBulkAssign" max-width="500px" persistent>
    <v-card>
      <v-form ref="formBulkAssignRef" @submit.prevent="handleBulkAssign">
        <v-card-title>
          <span class="text-h5">Atribuir Processos Selecionados</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <div class="text-subtitle-1 mb-2">
                  <strong>{{ selected.length }}</strong> processo(s) selecionado(s).
                </div>
                <v-autocomplete
                  v-model="matriculaParaAtribuir"
                  item-title="title"
                  :items="allUsersOptions"
                  item-value="value"
                  label="Atribuir ao usuário:"
                  :rules="[requiredRule]"
                  variant="outlined"
                  density="compact"
                  placeholder="Selecione o usuário de destino..."
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="fecharModalBulkAssign">Cancelar</v-btn>
          <v-btn
            color="secondary"
            :loading="loadingBulkAssign"
            type="submit"
          >
            Atribuir
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>



  <!-- Dialog de confirmação (substitui confirm() nativo) -->
  <v-dialog v-model="dialogConfirm" max-width="450px">
    <v-card>
      <v-card-title class="text-h6">Confirmação</v-card-title>
      <v-card-text>{{ dialogConfirmText }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="dialogConfirm = false">Cancelar</v-btn>
        <v-btn color="primary" variant="flat" @click="onDialogConfirm">Confirmar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar
    v-model="snackbar"
    :color="snackbarColor"
    :timeout="snackbarTimeout"
    location="top right"
    multi-line
    class="toast-snackbar"
    @update:model-value="onSnackbarToggle"
  >
    {{ snackbarText }}
    <v-progress-linear
      :model-value="snackbarProgress"
      color="rgba(255,255,255,0.7)"
      bg-color="rgba(255,255,255,0.2)"
      height="3"
      class="mt-2"
      rounded
    ></v-progress-linear>
    <template v-slot:actions>
      <v-btn icon @click="snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
  
  <!-- O </v-container> final foi removido -->
</template>

<script setup>
// =================================================================
// 1. IMPORTS
// =================================================================
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import apiClient from '@/api/axios';
import TabelaProcessos from '../components/TabelaProcessos.vue';
import StatsGrid from '../components/StatsGrid.vue';
import CumpridosChart from '../components/CumpridosChart.vue';
import UserAdminDialogs from '../components/UserAdminDialogs.vue';
import { format } from 'date-fns';
import { useDisplay, useTheme } from 'vuetify';
import { useDrawer } from '@/composables/useDrawer';
import { useSnackbar } from '@/composables/useSnackbar';
import { getPrazoRestanteNum, formatarPrazo, getCorPrazo } from '@/utils/prazo';
import { getCache, setCache, clearCache } from '@/utils/sessionCache';
import { exportProcessesPDF } from '@/utils/pdfExport';
const { mdAndUp, smAndDown, width } = useDisplay();
const isWide = computed(() => width.value >= 1660);
const { drawerOpen } = useDrawer();
const theme = useTheme();
const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
};

// import { useTheme } from 'vuetify'; // REMOVIDO - Movido para default.vue


// const theme = useTheme(); // REMOVIDO
// const toggleTheme = () => { ... }; // REMOVIDO


// =================================================================
// 2. ESTADO PRINCIPAL (AUTH & FILTROS)
// =================================================================
const authStore = useAuthStore();
const { user } = storeToRefs(authStore); // MANTIDO - Ainda é necessário para o v-if dos botões de admin

const search = ref('');
const filters = ref({
  classe: [],
  assunto: [],
  tarjas: [],
  userId: [],
  prazo: null,
  cumprido: false, // Default é "Não Cumprido"
  data_inicio: null,
  data_fim: null,
});
const selected = ref([]);

// =================================================================
// 3. ESTADO DA TABELA E GRÁFICOS (PAGINAÇÃO DO SERVIDOR)
// =================================================================
const loadingTable = ref(true);
const serverItems = ref([]); // Itens da página atual
const totalItems = ref(0);  // Total de itens no DB
const options = ref({});    // { page, itemsPerPage, sortBy }

// Loading overlay para ações individuais (salvar obs, marcar cumprido, etc.)
const actionLoading = ref(false);
const actionLoadingText = ref('Processando...');

const loadingCharts = ref(true);
const statsResponse = ref(null); // Resposta da API de estatísticas
const unassignedCount = ref(0);
const showUnassignedAlert = ref(true);
const allUsersList = ref([]); // Lista de todos os usuários para modais/filtros

// Listas de todas as opções de filtros (cumulativas)
const allClassesList = ref([]); // Lista de todas as classes disponíveis
const allAssuntosList = ref([]); // Lista de todos os assuntos disponíveis
const allTarjasList = ref([]); // Lista de todas as tarjas disponíveis

// =================================================================
// 4. ESTADO DOS MODAIS E SNACKBAR
// =================================================================
// Snackbar centralizado no composable; modais de admin vivem em UserAdminDialogs
const {
  snackbar,
  snackbarText,
  snackbarColor,
  snackbarTimeout,
  snackbarProgress,
  notify,
  onSnackbarToggle,
} = useSnackbar();

const userDialogs = ref(null); // ref do componente UserAdminDialogs
const menuInicio = ref(false);
const menuFim = ref(false);

// Modal: Atribuir em Massa
const dialogBulkAssign = ref(false);
const formBulkAssignRef = ref(null);
const loadingBulkAssign = ref(false);
const matriculaParaAtribuir = ref(null);

// =================================================================
// 5. REGRAS DE VALIDAÇÃO
// =================================================================
const requiredRule = v => !!v || 'Campo obrigatório';

// =================================================================
// 6. PROPRIEDADES COMPUTADAS (COMPUTED)
// =================================================================
// Opções para os selects de filtro
const statusCumpridoOptions = [
  { title: 'Todos', value: null },
  { title: 'Cumprido', value: true },
  { title: 'Não Cumprido', value: false }
];

const prazoOptions = [
  { title: 'Vencido', value: 'vencido' },
  { title: 'A Vencer', value: 'a_vencer' }
];

// Gera a lista de usuários para os modais de admin
const allUsersOptions = computed(() => {
  return allUsersList.value.map(user => ({
    title: `${user.nome} (${user.matricula})`,
    value: user.matricula // Modais de admin usam 'matricula'
  }));
});

// Gera a lista de usuários para o FILTRO (incluindo "Não Atribuído")
const uniqueUsers = computed(() => {
  const naoAtribuidoOption = { title: 'Não Atribuído', value: 'NA' };
  const userOptions = allUsersList.value 
    ? allUsersList.value.map(user => ({
        title: user.nome,
        value: user.id // Filtro principal usa 'id'
      }))
    : [];
  return [naoAtribuidoOption, ...userOptions];
});

// Gera a lista de CLASSES (cumulativa - todas as opções disponíveis)
const uniqueClasses = computed(() => {
  return allClassesList.value;
});

// Gera a lista de ASSUNTOS (cumulativa - todas as opções disponíveis)
const uniqueAssuntos = computed(() => {
  return allAssuntosList.value;
});

// Gera a lista de TARJAS (cumulativa - todas as opções disponíveis)
const uniqueTarjas = computed(() => {
  return allTarjasList.value;
});

// Computed para o StatsGrid (baseado na resposta da API)
const statsData = computed(() => {
  if (!statsResponse.value) {
    return { total: 0, byUser: [], byPrazo: [], byAssunto: [] };
  }
  const { totalPendentes, byUser, byPrazo, byAssunto } = statsResponse.value;
  
  const byUserFormatted = byUser.map(user => ({
    ...user,
    percent: totalPendentes > 0 ? (user.count / totalPendentes) * 100 : 0
  }));
  
  const byPrazoFormatted = [
    { nome: 'Vencidos', count: byPrazo.vencidos, percent: totalPendentes > 0 ? (byPrazo.vencidos / totalPendentes) * 100 : 0 },
    { nome: 'P < 10d', count: byPrazo.p10d, percent: totalPendentes > 0 ? (byPrazo.p10d / totalPendentes) * 100 : 0 },
    { nome: 'P < 30d', count: byPrazo.p30d, percent: totalPendentes > 0 ? (byPrazo.p30d / totalPendentes) * 100 : 0 }
  ];
  
  const byAssuntoFormatted = byAssunto.map(assunto => ({
    ...assunto,
    percent: totalPendentes > 0 ? (assunto.count / totalPendentes) * 100 : 0
  }));

  return { 
    total: totalPendentes, 
    byUser: byUserFormatted, 
    byPrazo: byPrazoFormatted, 
    byAssunto: byAssuntoFormatted 
  };
});

// Computed para o CumpridosChart (baseado na resposta da API)
const cumpridosChartData = computed(() => {
  if (!statsResponse.value) {
    return { labels: [], datasets: [] };
  }
  const sortedUsers = statsResponse.value.cumpridos30d;
  const labels = sortedUsers.map(entry => entry.nome);
  const data = sortedUsers.map(entry => entry.count);
  
  return {
    labels: labels,
    datasets: [
      {
        label: 'Processos Cumpridos por Usuário (Últimos 30d)',
        backgroundColor: '#4CAF50',
        data: data
      }
    ]
  };
});

// Formata as datas para exibição nos campos de texto
const formattedDataInicio = computed(() => {
  return filters.value.data_inicio ? format(filters.value.data_inicio, 'dd/MM/yyyy') : '';
});
const formattedDataFim = computed(() => {
  return filters.value.data_fim ? format(filters.value.data_fim, 'dd/MM/yyyy') : '';
});


// =================================================================
// 7. FUNÇÕES HELPERS (Construtores de Query)
// =================================================================
// Helpers de prazo (getPrazoRestanteNum etc.) vivem em @/utils/prazo

// --- Helpers de Query Params ---
const buildChartQueryParams = () => {
  const params = new URLSearchParams();
  if (search.value) params.append('search', search.value);
  if (filters.value.prazo) params.append('prazo', filters.value.prazo);

  // ✅ INÍCIO DO NOVO BLOCO DE DATA
  // Formata a data para 'yyyy-MM-dd' antes de enviar
  if (filters.value.data_inicio) {
    params.append('dataInicio', format(filters.value.data_inicio, 'yyyy-MM-dd'));
  }
  if (filters.value.data_fim) {
    params.append('dataFim', format(filters.value.data_fim, 'yyyy-MM-dd'));
  }
  // ✅ FIM DO NOVO BLOCO
  
  filters.value.classe.forEach(v => params.append('classe', v));
  filters.value.assunto.forEach(v => params.append('assunto', v));
  filters.value.tarjas.forEach(v => params.append('tarjas', v));

  const userIdFilterValues = filters.value.userId || [];
  const realUserIds = userIdFilterValues.filter(id => id !== 'NA');
  const includesNaoAtribuido = userIdFilterValues.includes('NA');
  realUserIds.forEach(id => params.append('userId', id));
  if (includesNaoAtribuido) params.append('includeNA', 'true');

  return params;
};

const buildQueryParams = () => {
    const params = buildChartQueryParams(); 
    if (filters.value.cumprido !== null) {
      params.append('cumprido', filters.value.cumprido);
    }
    return params;
  };

// =================================================================
// 8. FUNÇÕES API (Chamadas ao Backend)
// =================================================================

// AbortControllers para cancelar requests anteriores quando filtros mudam rapidamente
let tableAbortController = null;
let chartAbortController = null;
let unassignedAbortController = null;

// Busca dados paginados para a TABELA
const fetchTableData = async () => {
  // Cancela request anterior se ainda estiver em andamento
  if (tableAbortController) {
    tableAbortController.abort();
  }
  tableAbortController = new AbortController();

  loadingTable.value = true;
  const params = buildQueryParams();
  params.append('page', options.value.page || 1);
  params.append('itemsPerPage', options.value.itemsPerPage || 10);
  params.append('sortBy', JSON.stringify(options.value.sortBy || []));

  try {
    const response = await apiClient.get('/admin/processes', {
      params,
      signal: tableAbortController.signal
    });
    serverItems.value = response.data.items.map(proc => {
      const prazoNum = getPrazoRestanteNum(proc);
      return {
        ...proc,
        prazoRestanteNum: prazoNum,
        prazoRestanteStr: formatarPrazo(prazoNum),
        prazoRestanteColor: getCorPrazo(prazoNum)
      };
    });
    totalItems.value = response.data.totalItems;
  } catch (error) {
    // Ignora erros de abort (request cancelado por novo filtro)
    if (error?.code === 'ERR_CANCELED') return;
    notify('Erro ao carregar processos da tabela.', 'error');
  } finally {
    loadingTable.value = false;
  }
};

// Busca dados de estatísticas para os GRÁFICOS
const fetchChartData = async () => {
  if (chartAbortController) chartAbortController.abort();
  chartAbortController = new AbortController();

  loadingCharts.value = true;
  const params = buildChartQueryParams();
  try {
    const response = await apiClient.get('/admin/stats/dashboard', {
      params,
      signal: chartAbortController.signal
    });
    statsResponse.value = response.data;
  } catch (error) {
    if (error?.code === 'ERR_CANCELED') return;
    notify('Erro ao carregar dados dos gráficos.', 'error');
  } finally {
    loadingCharts.value = false;
  }
};

// Busca contagem de não atribuídos para o ALERTA
const checkUnassignedProcesses = async () => {
  if (unassignedAbortController) unassignedAbortController.abort();
  unassignedAbortController = new AbortController();

  try {
    const response = await apiClient.get('/admin/stats/unassigned-count', {
      signal: unassignedAbortController.signal
    });
    unassignedCount.value = response.data.count;
    if (unassignedCount.value > 0) {
      showUnassignedAlert.value = true;
    }
  } catch (error) {
    if (error?.code === 'ERR_CANCELED') return;
    // Silenciado: alerta de não atribuídos é informativo, não crítico
  }
};

// Busca a lista de todos os usuários para os modais/filtros (com cache de 5 min)
const fetchAllUsers = async () => {
  const cached = getCache('cache:users');
  if (cached) {
    allUsersList.value = cached;
    return;
  }
  try {
    const response = await apiClient.get('/admin/users');
    allUsersList.value = response.data;
    setCache('cache:users', response.data);
  } catch {
    notify('Erro ao carregar lista de usuários.', 'error');
  }
};

// Após criar/apagar usuário: invalida o cache antes de rebuscar, senão a
// lista voltaria desatualizada do sessionStorage por até 5 minutos
const handleUsersChanged = async () => {
  clearCache('cache:users');
  await fetchAllUsers();
};

// Busca valores únicos para os filtros via endpoint dedicado (com cache de 5 min)
const fetchFilterOptions = async () => {
  const cached = getCache('cache:filterOptions');
  if (cached) {
    allClassesList.value = cached.classes;
    allAssuntosList.value = cached.assuntos;
    allTarjasList.value = cached.tarjas;
    return;
  }
  try {
    const { data } = await apiClient.get('/admin/filter-options');
    allClassesList.value = data.classes;
    allAssuntosList.value = data.assuntos;
    allTarjasList.value = data.tarjas;
    setCache('cache:filterOptions', data);
  } catch {
    // Silenciado: filtros usarão valores em cache ou ficarão vazios
  }
};

// Limpa todos os filtros e busca de volta ao estado padrão
const limparFiltros = () => {
  search.value = '';
  filters.value = {
    classe: [],
    assunto: [],
    tarjas: [],
    userId: [],
    prazo: null,
    cumprido: false,
    data_inicio: null,
    data_fim: null,
  };
};

// Recarrega todos os dados da página (em paralelo para melhor performance)
const reloadAllData = async () => {
  await Promise.all([
    fetchTableData(),
    fetchChartData(),
    checkUnassignedProcesses(),
  ]);
};

// =================================================================
// 9. HANDLERS DE EVENTOS (Tabela, UI, Logout)
// =================================================================

// --- Handlers da Tabela ---
// (MANTIDOS)
const handleSalvarObservacoes = async (itemEditado) => {
  actionLoading.value = true;
  actionLoadingText.value = 'Salvando observação...';
  try {
    const { id, observacoes } = itemEditado;
    await apiClient.put(`/admin/processes/${id}/observacoes`, { observacoes });
    await reloadAllData();
  } catch {
    notify('Erro ao salvar observação.', 'error');
  } finally {
    actionLoading.value = false;
  }
};

// Dialog de confirmação genérico (substitui confirm() nativo)
const dialogConfirm = ref(false);
const dialogConfirmText = ref('');
let dialogConfirmCallback = null;

const openConfirmDialog = (text, callback) => {
  dialogConfirmText.value = text;
  dialogConfirmCallback = callback;
  dialogConfirm.value = true;
};

const onDialogConfirm = async () => {
  dialogConfirm.value = false;
  if (dialogConfirmCallback) {
    await dialogConfirmCallback();
    dialogConfirmCallback = null;
  }
};

const handleMarcarComoCumprido = (item) => {
  const acao = item.cumprido ? 'desfazer-cumprir' : 'cumprir';
  const texto = `Deseja realmente ${item.cumprido ? 'DESMARCAR' : 'MARCAR'} o processo ${item.numero_processo} como cumprido?`;

  openConfirmDialog(texto, async () => {
    actionLoading.value = true;
    actionLoadingText.value = item.cumprido ? 'Desmarcando processo...' : 'Marcando como cumprido...';
    try {
      await apiClient.patch(`/admin/processes/${item.id}/${acao}`);
      await reloadAllData();
    } catch {
      notify(`Erro ao ${acao} processo.`, 'error');
    } finally {
      actionLoading.value = false;
    }
  });
};

// --- Handlers da UI ---
// (MANTIDOS)
const filterUnassigned = () => {
  filters.value.userId = ['NA'];
  showUnassignedAlert.value = false;
};

// const handleLogout = () => { ... }; // REMOVIDO - Movido para default.vue

// --- Handlers de PDF ---
// Descreve os filtros ativos para o cabeçalho do relatório
const buildFiltrosAtivos = () => {
  const filtrosAtivos = [];

  if (search.value) {
    filtrosAtivos.push(`Busca: "${search.value}"`);
  }
  if (filters.value.classe && filters.value.classe.length > 0) {
    filtrosAtivos.push(`Classe: ${filters.value.classe.join(', ')}`);
  }
  if (filters.value.assunto && filters.value.assunto.length > 0) {
    filtrosAtivos.push(`Assunto: ${filters.value.assunto.join(', ')}`);
  }
  if (filters.value.tarjas && filters.value.tarjas.length > 0) {
    filtrosAtivos.push(`Tarjas: ${filters.value.tarjas.join(', ')}`);
  }
  if (filters.value.userId && filters.value.userId.length > 0) {
    const userNames = filters.value.userId.map(id => {
      if (id === 'NA') return 'Não Atribuído';
      const usuario = allUsersList.value.find(u => u.id === id);
      return usuario ? usuario.nome : id;
    });
    filtrosAtivos.push(`Usuário: ${userNames.join(', ')}`);
  }
  if (filters.value.cumprido !== null && filters.value.cumprido !== false) {
    filtrosAtivos.push(`Status: ${filters.value.cumprido ? 'Cumprido' : 'Não Cumprido'}`);
  }
  if (filters.value.prazo) {
    const prazoLabel = filters.value.prazo === 'vencido' ? 'Vencido' : 'A Vencer';
    filtrosAtivos.push(`Prazo: ${prazoLabel}`);
  }
  if (filters.value.data_inicio) {
    filtrosAtivos.push(`Data Início: ${format(filters.value.data_inicio, 'dd/MM/yyyy')}`);
  }
  if (filters.value.data_fim) {
    filtrosAtivos.push(`Data Fim: ${format(filters.value.data_fim, 'dd/MM/yyyy')}`);
  }

  return filtrosAtivos;
};

const downloadPDF = async (dataToExport) => {
  const processesToExport = dataToExport === selected.value
    ? [...dataToExport]
    : [...serverItems.value];

  if (processesToExport.length === 0) {
    notify('Nenhum item para exportar.', 'info');
    return;
  }

  actionLoading.value = true;
  actionLoadingText.value = 'Gerando PDF...';
  await nextTick(); // garante que o overlay renderiza antes do trabalho síncrono

  try {
    await exportProcessesPDF(processesToExport, options.value.sortBy || [], buildFiltrosAtivos());
  } catch {
    notify('Erro ao gerar PDF.', 'error');
  } finally {
    actionLoading.value = false;
  }
};

// =================================================================
// 10. FUNÇÕES DOS MODAIS
// =================================================================
// Modais de admin (cadastro, reset, exclusão, CSV) vivem em UserAdminDialogs;
// aqui fica apenas o de atribuição em massa, acoplado à seleção da tabela.

// --- Modal Atribuir em Massa ---
const abrirModalBulkAssign = () => {
  if (selected.value.length === 0) {
    notify('Nenhum processo selecionado.', 'warning');
    return;
  }
  matriculaParaAtribuir.value = null;
  formBulkAssignRef.value?.resetValidation();
  dialogBulkAssign.value = true;
};
const fecharModalBulkAssign = () => { dialogBulkAssign.value = false; };
const handleBulkAssign = async () => {
  const { valid } = await formBulkAssignRef.value.validate();
  if (!valid) return;
  const processIds = selected.value.map(processo => processo.id);
  loadingBulkAssign.value = true;
  try {
    await apiClient.post('/admin/bulk-assign', {
      processIds: processIds,
      matricula: matriculaParaAtribuir.value
    });
    notify('Processos atribuídos com sucesso!');
    fecharModalBulkAssign();
    selected.value = [];
    await reloadAllData(); // Recarrega tudo
  } catch (error) {
    notify(error.response?.data?.error || 'Erro ao atribuir processos.', 'error');
  } finally {
    loadingBulkAssign.value = false;
  }
};

// =================================================================
// 11. OBSERVADORES (WATCHERS)
// =================================================================
// (a animação do snackbar vive no composable useSnackbar)

// Dispara quando 'options' (página, itensPorPagina, sortBy) muda
watch(options, fetchTableData, { deep: true });

// Dispara quando 'filters' ou 'search' mudam (com debounce de 400ms)
let filterDebounceTimer = null;
watch(
  [filters, search],
  () => {
    clearTimeout(filterDebounceTimer);
    filterDebounceTimer = setTimeout(() => {
      fetchTableData();
      fetchChartData();
      checkUnassignedProcesses();
    }, 400);
  },
  { deep: true }
);

// =================================================================
// 12. LIFECYCLE HOOKS
// =================================================================
// (MANTIDO)
onMounted(() => {
  // A chamada inicial do 'fetchTableData' é disparada pelo 'watch(options...)'
  // Mas as outras precisam ser chamadas manualmente.
  fetchChartData();
  fetchAllUsers();
  fetchFilterOptions(); // Busca opções cumulativas para os filtros
  checkUnassignedProcesses();
});

</script>

<style scoped>
.toast-snackbar :deep(.v-snackbar__wrapper) {
  opacity: 0.88;
}
</style>
