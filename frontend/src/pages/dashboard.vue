<template>
  <!--
    O <v-container class="container-estreito"> foi removido daqui,
    pois agora ele está no default.vue envolvendo o <router-view>.
  -->

  <!-- Alert de processos não atribuídos (inalterado) -->
  <v-alert
    v-if="unassignedCount > 0 && showUnassignedAlert"
    border="start"
    class="mb-6"
    closable
    prominent
    type="warning"
    variant="tonal"
    @click:close="showUnassignedAlert = false"
  >
    <div class="d-flex justify-space-between align-center flex-wrap ga-2">
      <div>
        Atenção: Existem <strong>{{ unassignedCount }}</strong> processo(s) sem atribuição.
      </div>
      <v-btn
        color="warning"
        size="small"
        variant="flat"
        @click="filterUnassigned"
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
      style="top: 0; height: 100%; position: fixed; z-index: 1010;"
      width="256"
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
              aria-label="Fechar menu"
              icon
              size="small"
              variant="text"
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
            base-color="orange"
            prepend-icon="mdi-lock-reset"
            title="Resetar Senha"
            @click="() => { drawerOpen = false; userDialogs?.abrirModalReset(); }"
          />
          <v-list-item
            base-color="red"
            prepend-icon="mdi-account-remove-outline"
            title="Apagar Usuário"
            @click="() => { drawerOpen = false; userDialogs?.abrirModalDelete(); }"
          />
          <v-list-item
            base-color="teal"
            prepend-icon="mdi-file-upload-outline"
            title="Importar CSV"
            @click="() => { drawerOpen = false; userDialogs?.abrirModalUpload(); }"
          />
          <v-list-item
            base-color="indigo"
            prepend-icon="mdi-shield-key-outline"
            title="Autenticação PJe"
            @click="() => { drawerOpen = false; pjeAuthDialog?.abrir(); }"
          />
          <v-list-item
            base-color="green"
            :disabled="importandoPje"
            prepend-icon="mdi-download-network-outline"
            title="Importar do PJe"
            @click="() => { drawerOpen = false; importarPje(); }"
          />
          <v-list-item
            base-color="green"
            prepend-icon="mdi-history"
            title="Logs do PJe"
            @click="() => { drawerOpen = false; abrirLogsPje(); }"
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
            base-color="error"
            prepend-icon="mdi-logout"
            title="Sair"
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
        <v-row class="pt-0" dense> <v-col cols="12" lg="6">
                                     <stats-grid
                                       :loading="loadingCharts"
                                       :stats="statsData"
                                       style="padding-right: 1%;"
                                     />
                                   </v-col>

          <v-col
            :class="{ 'mt-6 border-s pl-4': mdAndUp }"
            cols="12"
            lg="6"
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
              chips
              clearable
              density="compact"
              :items="uniqueClasses"
              label="Classe"
              multiple
              variant="outlined"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="filters.assunto"
              chips
              clearable
              density="compact"
              :items="uniqueAssuntos"
              label="Assunto"
              multiple
              variant="outlined"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="filters.tarjas"
              chips
              clearable
              density="compact"
              :items="uniqueTarjas"
              label="Tarjas"
              multiple
              variant="outlined"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="filters.fonte"
              chips
              clearable
              density="compact"
              item-title="title"
              item-value="value"
              :items="fonteOptions"
              label="Fonte (Origem)"
              multiple
              variant="outlined"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="filters.vinculacao"
              chips
              clearable
              density="compact"
              :items="uniqueVinculacoes"
              label="Vinculação"
              multiple
              variant="outlined"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="filters.userId"
              chips
              clearable
              density="compact"
              :disabled="!user?.admin_super"
              item-title="title"
              item-value="value"
              :items="uniqueUsers"
              label="Usuário"
              multiple
              variant="outlined"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="filters.cumprido"
              density="compact"
              :disabled="!user?.admin_super"
              item-title="title"
              item-value="value"
              :items="statusCumpridoOptions"
              label="Status (Cumprido)"
              variant="outlined"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="filters.prazo"
              clearable
              density="compact"
              item-title="title"
              item-value="value"
              :items="prazoOptions"
              label="Prazo Restante"
              variant="outlined"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-menu
              v-model="menuInicio"
              :close-on-content-click="false"
              location="bottom end"
              transition="scale-transition"
            >
              <template #activator="{ props }">
                <v-text-field
                  v-model="formattedDataInicio"
                  clearable
                  density="compact"
                  label="Data Início (Cumprido)"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                  variant="outlined"
                  v-bind="props"
                  @click:clear="filters.data_inicio = null"
                />
              </template>
              <v-date-picker
                v-model="filters.data_inicio"
                hide-header
                locale="pt-BR"
                title="Data Início"
                @update:model-value="menuInicio = false"
              />
            </v-menu>
          </v-col>
          <v-col cols="12" md="3">
            <v-menu
              v-model="menuFim"
              :close-on-content-click="false"
              location="bottom end"
              transition="scale-transition"
            >
              <template #activator="{ props }">
                <v-text-field
                  v-model="formattedDataFim"
                  clearable
                  density="compact"
                  label="Data Fim (Cumprido)"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                  variant="outlined"
                  v-bind="props"
                  @click:clear="filters.data_fim = null"
                />
              </template>
              <v-date-picker
                v-model="filters.data_fim"
                hide-header
                locale="pt-BR"
                title="Data Fim"
                @update:model-value="menuFim = false"
              />
            </v-menu>
          </v-col>
          <v-col class="d-flex align-center" cols="12" md="2">
            <v-btn
              aria-label="Limpar todos os filtros"
              block
              color="grey"
              prepend-icon="mdi-filter-remove-outline"
              variant="tonal"
              @click="limparFiltros"
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
      <v-spacer />

      <div class="d-flex ga-2 flex-wrap justify-end">
        <v-btn
          color="primary"
          :disabled="totalItems === 0 || actionLoading"
          prepend-icon="mdi-download"
          variant="flat"
          @click="downloadFiltrados()"
        >
          <span class="d-none d-md-inline">Baixar Filtrados</span>
        </v-btn>

        <v-btn
          color="blue-grey"
          :disabled="selected.length === 0 || actionLoading"
          prepend-icon="mdi-download-box-outline"
          variant="flat"
          @click="downloadSelecionados()"
        >
          <span class="d-none d-md-inline">Baixar Selecionados</span>
        </v-btn>

        <v-btn
          color="secondary"
          :disabled="selected.length === 0"
          prepend-icon="mdi-account-arrow-right"
          variant="flat"
          @click="abrirModalBulkAssign"
        >
          <span class="d-none d-md-inline">Atribuir Seleção</span>
        </v-btn>
      </div>
    </v-card-title>

    <v-card-text class="pt-2 pb-0">
      <v-text-field
        v-model="search"
        density="compact"
        hide-details
        label="Buscar processo..."
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
      />
    </v-card-text>

    <tabela-processos
      v-model:selected="selected"
      :action-loading="actionLoading"
      :action-loading-text="actionLoadingText"
      :items="serverItems"
      :loading="loadingTable"
      :total-items="totalItems"
      @marcar-cumprido="handleMarcarComoCumprido"
      @salvar-obs="handleSalvarObservacoes"
      @update:options="options = $event"
    />

  </v-card>

  <!-- Modais de administração de usuários (cadastro, reset, exclusão, CSV) -->
  <user-admin-dialogs
    ref="userDialogs"
    :all-users-options="allUsersOptions"
    @data-changed="reloadAllData"
    @notify="notify"
    @users-changed="handleUsersChanged"
  />

  <!-- Modal: Credenciais PJe (admin_super) -->
  <pje-auth-dialog ref="pjeAuthDialog" @notify="notify" />

  <!-- Histórico de importações do PJe -->
  <v-dialog v-model="dialogLogsPje" max-width="1150px" scrollable>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon start>mdi-history</v-icon>
        Histórico de Importações do PJe
        <v-spacer />
        <v-btn
          icon="mdi-refresh"
          :loading="loadingLogsPje"
          variant="text"
          @click="carregarLogsPje"
        />
        <v-btn icon="mdi-close" variant="text" @click="dialogLogsPje = false" />
      </v-card-title>
      <v-divider />
      <v-card-text style="max-height: 70vh;">
        <v-data-table
          density="compact"
          :headers="logsHeaders"
          :items="logsPje"
          :items-per-page="-1"
          :loading="loadingLogsPje"
          no-data-text="Nenhuma importação registrada ainda."
        >
          <template #item.created_at="{ item }">
            {{ formatarDataHoraLog(item.created_at) }}
          </template>
          <template #item.duracaoMs="{ item }">
            {{ (item.duracaoMs / 1000).toFixed(1) }}s
          </template>
          <template #item.status="{ item }">
            <v-tooltip v-if="item.erro" location="top">
              <template #activator="{ props: tip }">
                <v-chip color="error" size="small" v-bind="tip">Erro</v-chip>
              </template>
              <span>{{ item.erro }}</span>
            </v-tooltip>
            <v-chip v-else color="success" size="small">OK</v-chip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-dialog>

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
                  density="compact"
                  item-title="title"
                  item-value="value"
                  :items="allUsersOptions"
                  label="Atribuir ao usuário:"
                  placeholder="Selecione o usuário de destino..."
                  :rules="[requiredRule]"
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
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
        <v-spacer />
        <v-btn variant="text" @click="dialogConfirm = false">Cancelar</v-btn>
        <v-btn color="primary" variant="flat" @click="onDialogConfirm">Confirmar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar
    v-model="snackbar"
    class="toast-snackbar"
    :color="snackbarColor"
    location="top right"
    multi-line
    :timeout="-1"
    @update:model-value="onSnackbarToggle"
  >
    {{ snackbarText }}
    <v-progress-linear
      bg-color="rgba(255,255,255,0.2)"
      class="mt-2"
      color="rgba(255,255,255,0.7)"
      height="3"
      :indeterminate="snackbarIndeterminate"
      :model-value="snackbarIndeterminate ? undefined : snackbarProgress"
      rounded
    />
    <template #actions>
      <v-btn icon @click="snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>

  <!-- O </v-container> final foi removido -->
</template>

<script setup>
  import { format } from 'date-fns'
  import { storeToRefs } from 'pinia'
  // =================================================================
  // 1. IMPORTS
  // =================================================================
  import { computed, nextTick, onMounted, ref, watch } from 'vue'
  import { useDisplay, useTheme } from 'vuetify'
  import apiClient from '@/api/axios'
  import { useDrawer } from '@/composables/useDrawer'
  import { useSnackbar } from '@/composables/useSnackbar'
  import { useAuthStore } from '@/stores/auth'
  import { exportProcessesPDF } from '@/utils/pdfExport'
  import { formatarPrazo, getCorPrazo, getPrazoRestanteNum } from '@/utils/prazo'
  import { clearCache, getCache, setCache } from '@/utils/sessionCache'
  import CumpridosChart from '../components/CumpridosChart.vue'
  import StatsGrid from '../components/StatsGrid.vue'
  import TabelaProcessos from '../components/TabelaProcessos.vue'
  import UserAdminDialogs from '../components/UserAdminDialogs.vue'
  import PjeAuthDialog from '../components/PjeAuthDialog.vue'
  const { mdAndUp, width } = useDisplay()
  const isWide = computed(() => width.value >= 1660)
  const { drawerOpen } = useDrawer()
  const theme = useTheme()
  function toggleTheme () {
    theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  }

  // import { useTheme } from 'vuetify'; // REMOVIDO - Movido para default.vue

  // const theme = useTheme(); // REMOVIDO
  // const toggleTheme = () => { ... }; // REMOVIDO

  // =================================================================
  // 2. ESTADO PRINCIPAL (AUTH & FILTROS)
  // =================================================================
  const authStore = useAuthStore()
  const { user } = storeToRefs(authStore) // MANTIDO - Ainda é necessário para o v-if dos botões de admin

  const search = ref('')
  const filters = ref({
    classe: [],
    assunto: [],
    tarjas: [],
    fonte: [],
    vinculacao: [],
    userId: [],
    prazo: null,
    cumprido: false, // Default é "Não Cumprido"
    data_inicio: null,
    data_fim: null,
  })
  const selected = ref([])

  // Opções fixas do filtro de origem do registro.
  const fonteOptions = [
    { title: 'eSAJ', value: 'esaj' },
    { title: 'PJe', value: 'pje' },
  ]
  const importandoPje = ref(false)

  // Histórico de importações do PJe
  const dialogLogsPje = ref(false)
  const logsPje = ref([])
  const loadingLogsPje = ref(false)
  const logsHeaders = [
    { title: 'Data', key: 'created_at' },
    { title: 'Por', key: 'usuario' },
    { title: 'Avisos', key: 'avisos', align: 'center' },
    { title: 'Criados', key: 'criados', align: 'center' },
    { title: 'Atualizados', key: 'atualizados', align: 'center' },
    { title: 'Com prazo', key: 'comPrazo', align: 'center' },
    { title: 'Sem prazo', key: 'semPrazo', align: 'center' },
    { title: 'Falhas', key: 'falhasTeor', align: 'center' },
    { title: 'Duração', key: 'duracaoMs', align: 'center' },
    { title: 'Status', key: 'status', align: 'center', sortable: false },
  ]

  // =================================================================
  // 3. ESTADO DA TABELA E GRÁFICOS (PAGINAÇÃO DO SERVIDOR)
  // =================================================================
  const loadingTable = ref(true)
  const serverItems = ref([]) // Itens da página atual
  const totalItems = ref(0) // Total de itens no DB
  const options = ref({}) // { page, itemsPerPage, sortBy }

  // Loading overlay para ações individuais (salvar obs, marcar cumprido, etc.)
  const actionLoading = ref(false)
  const actionLoadingText = ref('Processando...')

  const loadingCharts = ref(true)
  const statsResponse = ref(null) // Resposta da API de estatísticas
  const unassignedCount = ref(0)
  const showUnassignedAlert = ref(true)
  const allUsersList = ref([]) // Lista de todos os usuários para modais/filtros

  // Listas de todas as opções de filtros (cumulativas)
  const allClassesList = ref([]) // Lista de todas as classes disponíveis
  const allAssuntosList = ref([]) // Lista de todos os assuntos disponíveis
  const allTarjasList = ref([]) // Lista de todas as tarjas disponíveis
  const allVinculacoesList = ref([]) // Lista de todas as vinculações disponíveis (PJe)

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
    snackbarIndeterminate,
    notify,
    onSnackbarToggle,
  } = useSnackbar()

  const userDialogs = ref(null) // ref do componente UserAdminDialogs
  const pjeAuthDialog = ref(null) // ref do componente PjeAuthDialog
  const menuInicio = ref(false)
  const menuFim = ref(false)

  // Modal: Atribuir em Massa
  const dialogBulkAssign = ref(false)
  const formBulkAssignRef = ref(null)
  const loadingBulkAssign = ref(false)
  const matriculaParaAtribuir = ref(null)

  // =================================================================
  // 5. REGRAS DE VALIDAÇÃO
  // =================================================================
  const requiredRule = v => !!v || 'Campo obrigatório'

  // =================================================================
  // 6. PROPRIEDADES COMPUTADAS (COMPUTED)
  // =================================================================
  // Opções para os selects de filtro
  const statusCumpridoOptions = [
    { title: 'Todos', value: null },
    { title: 'Cumprido', value: true },
    { title: 'Não Cumprido', value: false },
  ]

  const prazoOptions = [
    { title: 'Vencido', value: 'vencido' },
    { title: 'A Vencer', value: 'a_vencer' },
  ]

  // Gera a lista de usuários para os modais de admin
  const allUsersOptions = computed(() => {
    return allUsersList.value.map(user => ({
      title: `${user.nome} (${user.matricula})`,
      value: user.matricula, // Modais de admin usam 'matricula'
    }))
  })

  // Gera a lista de usuários para o FILTRO (incluindo "Não Atribuído")
  const uniqueUsers = computed(() => {
    const naoAtribuidoOption = { title: 'Não Atribuído', value: 'NA' }
    const userOptions = allUsersList.value
      ? allUsersList.value.map(user => ({
        title: user.nome,
        value: user.id, // Filtro principal usa 'id'
      }))
      : []
    return [naoAtribuidoOption, ...userOptions]
  })

  // Gera a lista de CLASSES (cumulativa - todas as opções disponíveis)
  const uniqueClasses = computed(() => {
    return allClassesList.value
  })

  // Gera a lista de ASSUNTOS (cumulativa - todas as opções disponíveis)
  const uniqueAssuntos = computed(() => {
    return allAssuntosList.value
  })

  // Gera a lista de TARJAS (cumulativa - todas as opções disponíveis)
  const uniqueTarjas = computed(() => {
    return allTarjasList.value
  })

  // Gera a lista de VINCULAÇÕES (cumulativa - todas as opções disponíveis)
  const uniqueVinculacoes = computed(() => {
    return allVinculacoesList.value
  })

  // Computed para o StatsGrid (baseado na resposta da API)
  const statsData = computed(() => {
    if (!statsResponse.value) {
      return { total: 0, byUser: [], byPrazo: [], byAssunto: [] }
    }
    const { totalPendentes, byUser, byPrazo, byAssunto } = statsResponse.value

    const byUserFormatted = byUser.map(user => ({
      ...user,
      percent: totalPendentes > 0 ? (user.count / totalPendentes) * 100 : 0,
    }))

    const byPrazoFormatted = [
      { nome: 'Vencidos', count: byPrazo.vencidos, percent: totalPendentes > 0 ? (byPrazo.vencidos / totalPendentes) * 100 : 0 },
      { nome: 'P < 10d', count: byPrazo.p10d, percent: totalPendentes > 0 ? (byPrazo.p10d / totalPendentes) * 100 : 0 },
      { nome: 'P < 30d', count: byPrazo.p30d, percent: totalPendentes > 0 ? (byPrazo.p30d / totalPendentes) * 100 : 0 },
    ]

    const byAssuntoFormatted = byAssunto.map(assunto => ({
      ...assunto,
      percent: totalPendentes > 0 ? (assunto.count / totalPendentes) * 100 : 0,
    }))

    return {
      total: totalPendentes,
      byUser: byUserFormatted,
      byPrazo: byPrazoFormatted,
      byAssunto: byAssuntoFormatted,
    }
  })

  // Computed para o CumpridosChart (baseado na resposta da API)
  const cumpridosChartData = computed(() => {
    if (!statsResponse.value) {
      return { labels: [], datasets: [] }
    }
    const sortedUsers = statsResponse.value.cumpridos30d
    const labels = sortedUsers.map(entry => entry.nome)
    const data = sortedUsers.map(entry => entry.count)

    return {
      labels: labels,
      datasets: [
        {
          label: 'Processos Cumpridos por Usuário (Últimos 30d)',
          backgroundColor: '#4CAF50',
          data: data,
        },
      ],
    }
  })

  // Formata as datas para exibição nos campos de texto
  const formattedDataInicio = computed(() => {
    return filters.value.data_inicio ? format(filters.value.data_inicio, 'dd/MM/yyyy') : ''
  })
  const formattedDataFim = computed(() => {
    return filters.value.data_fim ? format(filters.value.data_fim, 'dd/MM/yyyy') : ''
  })

  // =================================================================
  // 7. FUNÇÕES HELPERS (Construtores de Query)
  // =================================================================
  // Helpers de prazo (getPrazoRestanteNum etc.) vivem em @/utils/prazo

  // --- Helpers de Query Params ---
  function buildChartQueryParams () {
    const params = new URLSearchParams()
    if (search.value) params.append('search', search.value)
    if (filters.value.prazo) params.append('prazo', filters.value.prazo)

    // ✅ INÍCIO DO NOVO BLOCO DE DATA
    // Formata a data para 'yyyy-MM-dd' antes de enviar
    if (filters.value.data_inicio) {
      params.append('dataInicio', format(filters.value.data_inicio, 'yyyy-MM-dd'))
    }
    if (filters.value.data_fim) {
      params.append('dataFim', format(filters.value.data_fim, 'yyyy-MM-dd'))
    }
    // ✅ FIM DO NOVO BLOCO

    for (const v of filters.value.classe) params.append('classe', v)
    for (const v of filters.value.assunto) params.append('assunto', v)
    for (const v of filters.value.tarjas) params.append('tarjas', v)

    const userIdFilterValues = filters.value.userId || []
    const realUserIds = userIdFilterValues.filter(id => id !== 'NA')
    const includesNaoAtribuido = userIdFilterValues.includes('NA')
    for (const id of realUserIds) params.append('userId', id)
    if (includesNaoAtribuido) params.append('includeNA', 'true')

    return params
  }

  function buildQueryParams () {
    const params = buildChartQueryParams()
    if (filters.value.cumprido !== null) {
      params.append('cumprido', filters.value.cumprido)
    }
    for (const v of filters.value.fonte || []) params.append('fonte', v)
    for (const v of filters.value.vinculacao || []) params.append('vinculacao', v)
    return params
  }

  // =================================================================
  // 8. FUNÇÕES API (Chamadas ao Backend)
  // =================================================================

  // AbortControllers para cancelar requests anteriores quando filtros mudam rapidamente
  let tableAbortController = null
  let chartAbortController = null
  let unassignedAbortController = null

  // Busca dados paginados para a TABELA
  async function fetchTableData () {
    // Cancela request anterior se ainda estiver em andamento
    if (tableAbortController) {
      tableAbortController.abort()
    }
    tableAbortController = new AbortController()

    loadingTable.value = true
    const params = buildQueryParams()
    params.append('page', options.value.page || 1)
    params.append('itemsPerPage', options.value.itemsPerPage || 10)
    params.append('sortBy', JSON.stringify(options.value.sortBy || []))

    try {
      const response = await apiClient.get('/admin/processes', {
        params,
        signal: tableAbortController.signal,
      })
      serverItems.value = response.data.items.map(proc => {
        const prazoNum = getPrazoRestanteNum(proc)
        return {
          ...proc,
          prazoRestanteNum: prazoNum,
          prazoRestanteStr: formatarPrazo(prazoNum),
          prazoRestanteColor: getCorPrazo(prazoNum),
        }
      })
      totalItems.value = response.data.totalItems
    } catch (error) {
      // Ignora erros de abort (request cancelado por novo filtro)
      if (error?.code === 'ERR_CANCELED') return
      notify('Erro ao carregar processos da tabela.', 'error')
    } finally {
      loadingTable.value = false
    }
  }

  // Busca dados de estatísticas para os GRÁFICOS
  async function fetchChartData () {
    if (chartAbortController) chartAbortController.abort()
    chartAbortController = new AbortController()

    loadingCharts.value = true
    const params = buildChartQueryParams()
    try {
      const response = await apiClient.get('/admin/stats/dashboard', {
        params,
        signal: chartAbortController.signal,
      })
      statsResponse.value = response.data
    } catch (error) {
      if (error?.code === 'ERR_CANCELED') return
      notify('Erro ao carregar dados dos gráficos.', 'error')
    } finally {
      loadingCharts.value = false
    }
  }

  // Busca contagem de não atribuídos para o ALERTA
  async function checkUnassignedProcesses () {
    if (unassignedAbortController) unassignedAbortController.abort()
    unassignedAbortController = new AbortController()

    try {
      const response = await apiClient.get('/admin/stats/unassigned-count', {
        signal: unassignedAbortController.signal,
      })
      unassignedCount.value = response.data.count
      if (unassignedCount.value > 0) {
        showUnassignedAlert.value = true
      }
    } catch (error) {
      if (error?.code === 'ERR_CANCELED') return
    // Silenciado: alerta de não atribuídos é informativo, não crítico
    }
  }

  // Busca a lista de todos os usuários para os modais/filtros (com cache de 5 min)
  async function fetchAllUsers () {
    const cached = getCache('cache:users')
    if (cached) {
      allUsersList.value = cached
      return
    }
    try {
      const response = await apiClient.get('/admin/users')
      allUsersList.value = response.data
      setCache('cache:users', response.data)
    } catch {
      notify('Erro ao carregar lista de usuários.', 'error')
    }
  }

  // Após criar/apagar usuário: invalida o cache antes de rebuscar, senão a
  // lista voltaria desatualizada do sessionStorage por até 5 minutos
  async function handleUsersChanged () {
    clearCache('cache:users')
    await fetchAllUsers()
  }

  // Busca valores únicos para os filtros via endpoint dedicado (com cache de 5 min)
  async function fetchFilterOptions () {
    const cached = getCache('cache:filterOptions')
    if (cached) {
      allClassesList.value = cached.classes
      allAssuntosList.value = cached.assuntos
      allTarjasList.value = cached.tarjas
      allVinculacoesList.value = cached.vinculacoes || []
      return
    }
    try {
      const { data } = await apiClient.get('/admin/filter-options')
      allClassesList.value = data.classes
      allAssuntosList.value = data.assuntos
      allTarjasList.value = data.tarjas
      allVinculacoesList.value = data.vinculacoes || []
      setCache('cache:filterOptions', data)
    } catch {
    // Silenciado: filtros usarão valores em cache ou ficarão vazios
    }
  }

  // Limpa todos os filtros e busca de volta ao estado padrão
  function limparFiltros () {
    search.value = ''
    filters.value = {
      classe: [],
      assunto: [],
      tarjas: [],
      fonte: [],
      vinculacao: [],
      userId: [],
      prazo: null,
      cumprido: false,
      data_inicio: null,
      data_fim: null,
    }
  }

  // Importa processos do PJe (webservice MNI). ATENÇÃO: por padrão abre o teor
  // de cada aviso, o que registra ciência e inicia o prazo — por isso pedimos
  // confirmação explícita antes de disparar.
  async function importarPje () {
    if (importandoPje.value) return
    const ok = window.confirm(
      'Importar do PJe?\n\nIsto consulta os avisos pendentes e ABRE as intimações ' +
        'que já atingiram o limiar de ciência configurado, para capturar o prazo. ' +
        'Abrir a intimação REGISTRA CIÊNCIA e INICIA O PRAZO no PJe. As demais ' +
        'entram no painel sem prazo e são abertas num import futuro. Continuar?'
    )
    if (!ok) return

    importandoPje.value = true
    // Toast PERSISTENTE com barra indeterminada: fica até o toast de
    // sucesso/erro aparecer. A importação roda em segundo plano (pode levar
    // minutos abrindo os teores); acompanhamos pelo endpoint de status.
    notify('Importação do PJe iniciada. Aguardando conclusão...', 'info', 0, { persistent: true })
    try {
      await apiClient.post('/admin/import-pje')
      await aguardarImportPje()
    } catch (error) {
      if (error.response?.status === 409) {
        notify('Já existe uma importação do PJe em andamento.', 'warning')
      } else {
        notify(error.response?.data?.error || 'Erro ao iniciar a importação do PJe.', 'error')
      }
    } finally {
      importandoPje.value = false
    }
  }

  // Faz polling do status da importação até concluir (ou estourar o tempo).
  async function aguardarImportPje () {
    const limiteMs = 8 * 60 * 1000 // 8 minutos
    const inicio = Date.now()
    while (Date.now() - inicio < limiteMs) {
      await new Promise(resolve => setTimeout(resolve, 5000))
      let data
      try {
        ({ data } = await apiClient.get('/admin/import-pje/status'))
      } catch {
        continue // erro transitório de rede; tenta de novo
      }
      if (data && !data.running) {
        if (data.error) {
          notify(`Importação do PJe falhou: ${data.error}`, 'error')
        } else if (data.result) {
          const r = data.result
          const partes = [`${r.avisos ?? 0} avisos`]
          if (r.comPrazo != null) partes.push(`${r.comPrazo} com prazo`)
          if (r.adiados) partes.push(`${r.adiados} aguardando ciência`)
          if (r.falhasTeor) partes.push(`${r.falhasTeor} falha(s) ao abrir`)
          if (r.tpu) {
            const tc = r.tpu.classes?.resolvidos ?? 0
            const ta = r.tpu.assuntos?.resolvidos ?? 0
            if (tc || ta) partes.push(`${tc} classe(s) e ${ta} assunto(s) traduzidos`)
          }
          notify(`Importação do PJe concluída: ${partes.join(', ')}.`, 'success', 6000)
        } else {
          notify('Importação do PJe concluída.', 'success', 6000)
        }
        clearCache('cache:filterOptions') // novas classes/assuntos podem ter surgido
        await fetchFilterOptions()
        await reloadAllData()
        return
      }
    }
    notify('A importação do PJe está demorando mais que o esperado; atualize a página em instantes.', 'warning')
  }

  // Abre o diálogo de histórico e carrega os logs.
  async function abrirLogsPje () {
    dialogLogsPje.value = true
    await carregarLogsPje()
  }

  async function carregarLogsPje () {
    loadingLogsPje.value = true
    try {
      const { data } = await apiClient.get('/admin/import-pje/logs')
      logsPje.value = data.items || []
    } catch {
      notify('Erro ao carregar o histórico de importações do PJe.', 'error')
    } finally {
      loadingLogsPje.value = false
    }
  }

  function formatarDataHoraLog (valor) {
    try {
      return format(new Date(valor), 'dd/MM/yyyy HH:mm')
    } catch {
      return valor
    }
  }

  // Recarrega todos os dados da página (em paralelo para melhor performance)
  async function reloadAllData () {
    await Promise.all([
      fetchTableData(),
      fetchChartData(),
      checkUnassignedProcesses(),
    ])
  }

  // =================================================================
  // 9. HANDLERS DE EVENTOS (Tabela, UI, Logout)
  // =================================================================

  // --- Handlers da Tabela ---
  // (MANTIDOS)
  async function handleSalvarObservacoes (itemEditado) {
    actionLoading.value = true
    actionLoadingText.value = 'Salvando observação...'
    try {
      const { id, observacoes } = itemEditado
      await apiClient.put(`/admin/processes/${id}/observacoes`, { observacoes })
      await reloadAllData()
    } catch {
      notify('Erro ao salvar observação.', 'error')
    } finally {
      actionLoading.value = false
    }
  }

  // Dialog de confirmação genérico (substitui confirm() nativo)
  const dialogConfirm = ref(false)
  const dialogConfirmText = ref('')
  let dialogConfirmCallback = null

  function openConfirmDialog (text, callback) {
    dialogConfirmText.value = text
    dialogConfirmCallback = callback
    dialogConfirm.value = true
  }

  async function onDialogConfirm () {
    dialogConfirm.value = false
    if (dialogConfirmCallback) {
      await dialogConfirmCallback()
      dialogConfirmCallback = null
    }
  }

  function handleMarcarComoCumprido (item) {
    const acao = item.cumprido ? 'desfazer-cumprir' : 'cumprir'
    const texto = `Deseja realmente ${item.cumprido ? 'DESMARCAR' : 'MARCAR'} o processo ${item.numero_processo} como cumprido?`

    openConfirmDialog(texto, async () => {
      actionLoading.value = true
      actionLoadingText.value = item.cumprido ? 'Desmarcando processo...' : 'Marcando como cumprido...'
      try {
        await apiClient.patch(`/admin/processes/${item.id}/${acao}`)
        await reloadAllData()
      } catch {
        notify(`Erro ao ${acao} processo.`, 'error')
      } finally {
        actionLoading.value = false
      }
    })
  }

  // --- Handlers da UI ---
  // (MANTIDOS)
  function filterUnassigned () {
    filters.value.userId = ['NA']
    showUnassignedAlert.value = false
  }

  // const handleLogout = () => { ... }; // REMOVIDO - Movido para default.vue

  // --- Handlers de PDF ---
  // Descreve os filtros ativos para o cabeçalho do relatório
  function buildFiltrosAtivos () {
    const filtrosAtivos = []

    if (search.value) {
      filtrosAtivos.push(`Busca: "${search.value}"`)
    }
    if (filters.value.classe && filters.value.classe.length > 0) {
      filtrosAtivos.push(`Classe: ${filters.value.classe.join(', ')}`)
    }
    if (filters.value.assunto && filters.value.assunto.length > 0) {
      filtrosAtivos.push(`Assunto: ${filters.value.assunto.join(', ')}`)
    }
    if (filters.value.tarjas && filters.value.tarjas.length > 0) {
      filtrosAtivos.push(`Tarjas: ${filters.value.tarjas.join(', ')}`)
    }
    if (filters.value.userId && filters.value.userId.length > 0) {
      const userNames = filters.value.userId.map(id => {
        if (id === 'NA') return 'Não Atribuído'
        const usuario = allUsersList.value.find(u => u.id === id)
        return usuario ? usuario.nome : id
      })
      filtrosAtivos.push(`Usuário: ${userNames.join(', ')}`)
    }
    if (filters.value.cumprido !== null && filters.value.cumprido !== false) {
      filtrosAtivos.push(`Status: ${filters.value.cumprido ? 'Cumprido' : 'Não Cumprido'}`)
    }
    if (filters.value.prazo) {
      const prazoLabel = filters.value.prazo === 'vencido' ? 'Vencido' : 'A Vencer'
      filtrosAtivos.push(`Prazo: ${prazoLabel}`)
    }
    if (filters.value.data_inicio) {
      filtrosAtivos.push(`Data Início: ${format(filters.value.data_inicio, 'dd/MM/yyyy')}`)
    }
    if (filters.value.data_fim) {
      filtrosAtivos.push(`Data Fim: ${format(filters.value.data_fim, 'dd/MM/yyyy')}`)
    }

    return filtrosAtivos
  }

  // Adiciona os campos calculados de prazo (iguais aos da tabela) aos itens.
  function comPrazoCalculado (items) {
    return items.map(proc => {
      const prazoNum = getPrazoRestanteNum(proc)
      return {
        ...proc,
        prazoRestanteNum: prazoNum,
        prazoRestanteStr: formatarPrazo(prazoNum),
        prazoRestanteColor: getCorPrazo(prazoNum),
      }
    })
  }

  // Exporta uma lista já pronta (com overlay e tratamento de erro).
  async function exportarLista (items) {
    if (!items || items.length === 0) {
      notify('Nenhum item para exportar.', 'info')
      return
    }
    actionLoading.value = true
    actionLoadingText.value = 'Gerando PDF...'
    await nextTick() // garante que o overlay renderiza antes do trabalho síncrono
    try {
      await exportProcessesPDF(items, options.value.sortBy || [], buildFiltrosAtivos())
    } catch {
      notify('Erro ao gerar PDF.', 'error')
    } finally {
      actionLoading.value = false
    }
  }

  // Baixa os processos SELECIONADOS na tela.
  async function downloadSelecionados () {
    await exportarLista([...selected.value])
  }

  // Baixa TODOS os processos que batem com o filtro atual (não só a página
  // visível). Busca a lista completa no servidor com itemsPerPage=-1.
  async function downloadFiltrados () {
    actionLoading.value = true
    actionLoadingText.value = 'Buscando todos os processos...'
    try {
      const params = buildQueryParams()
      params.append('page', '1')
      params.append('itemsPerPage', '-1')
      params.append('sortBy', JSON.stringify(options.value.sortBy || []))
      const { data } = await apiClient.get('/admin/processes', { params })
      const items = comPrazoCalculado(data.items || [])
      if (items.length === 0) {
        notify('Nenhum processo para exportar.', 'info')
        return
      }
      actionLoadingText.value = 'Gerando PDF...'
      await nextTick()
      await exportProcessesPDF(items, options.value.sortBy || [], buildFiltrosAtivos())
    } catch {
      notify('Erro ao gerar PDF.', 'error')
    } finally {
      actionLoading.value = false
    }
  }

  // =================================================================
  // 10. FUNÇÕES DOS MODAIS
  // =================================================================
  // Modais de admin (cadastro, reset, exclusão, CSV) vivem em UserAdminDialogs;
  // aqui fica apenas o de atribuição em massa, acoplado à seleção da tabela.

  // --- Modal Atribuir em Massa ---
  function abrirModalBulkAssign () {
    if (selected.value.length === 0) {
      notify('Nenhum processo selecionado.', 'warning')
      return
    }
    matriculaParaAtribuir.value = null
    formBulkAssignRef.value?.resetValidation()
    dialogBulkAssign.value = true
  }
  function fecharModalBulkAssign () {
    dialogBulkAssign.value = false
  }
  async function handleBulkAssign () {
    const { valid } = await formBulkAssignRef.value.validate()
    if (!valid) return
    const processIds = selected.value.map(processo => processo.id)
    loadingBulkAssign.value = true
    try {
      await apiClient.post('/admin/bulk-assign', {
        processIds: processIds,
        matricula: matriculaParaAtribuir.value,
      })
      notify('Processos atribuídos com sucesso!')
      fecharModalBulkAssign()
      selected.value = []
      await reloadAllData() // Recarrega tudo
    } catch (error) {
      notify(error.response?.data?.error || 'Erro ao atribuir processos.', 'error')
    } finally {
      loadingBulkAssign.value = false
    }
  }

  // =================================================================
  // 11. OBSERVADORES (WATCHERS)
  // =================================================================
  // (a animação do snackbar vive no composable useSnackbar)

  // Dispara quando 'options' (página, itensPorPagina, sortBy) muda
  watch(options, fetchTableData, { deep: true })

  // Dispara quando 'filters' ou 'search' mudam (com debounce de 400ms)
  let filterDebounceTimer = null
  watch(
    [filters, search],
    () => {
      clearTimeout(filterDebounceTimer)
      filterDebounceTimer = setTimeout(() => {
        fetchTableData()
        fetchChartData()
        checkUnassignedProcesses()
      }, 400)
    },
    { deep: true },
  )

  // =================================================================
  // 12. LIFECYCLE HOOKS
  // =================================================================
  // (MANTIDO)
  onMounted(() => {
    // A chamada inicial do 'fetchTableData' é disparada pelo 'watch(options...)'
    // Mas as outras precisam ser chamadas manualmente.
    fetchChartData()
    fetchAllUsers()
    fetchFilterOptions() // Busca opções cumulativas para os filtros
    checkUnassignedProcesses()
  })

</script>

<style scoped>
.toast-snackbar :deep(.v-snackbar__wrapper) {
  opacity: 0.88;
}
</style>
