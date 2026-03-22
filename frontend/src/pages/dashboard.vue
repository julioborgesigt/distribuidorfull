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
            <v-icon size="20">mdi-menu</v-icon>
          </v-btn>
        </template>
      </v-list-item>

      <template v-if="user?.admin_super">
        <v-divider class="mt-2" />
        <v-list-subheader>Administrador</v-list-subheader>
        <v-list-item
          prepend-icon="mdi-account-plus-outline"
          title="Cadastrar Usuário"
          @click="() => { drawerOpen = false; abrirModalCadastro(); }"
        />
        <v-list-item
          prepend-icon="mdi-lock-reset"
          title="Resetar Senha"
          base-color="orange"
          @click="() => { drawerOpen = false; abrirModalReset(); }"
        />
        <v-list-item
          prepend-icon="mdi-account-remove-outline"
          title="Apagar Usuário"
          base-color="red"
          @click="() => { drawerOpen = false; abrirModalDelete(); }"
        />
        <v-list-item
          prepend-icon="mdi-file-upload-outline"
          title="Importar CSV"
          base-color="teal"
          @click="() => { drawerOpen = false; abrirModalUpload(); }"
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
  
  <!-- 
    Todos os modais (v-dialog) e o snackbar
    PERMANECEM AQUI, pois são controlados pelos
    botões de admin e ações desta página.
  -->
  <v-dialog v-model="dialogCadastro" max-width="600px" persistent>
    <v-card>
      <v-form ref="formCadastroRef" @submit.prevent="handleSalvarCadastro">
        <v-card-title>
          <span class="text-h5">Cadastrar Novo Usuário</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="novoUsuario.nome"
                  label="Nome Completo"
                  :rules="[requiredRule]"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="novoUsuario.matricula"
                  label="Matrícula"
                  :rules="[requiredRule]"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="novoUsuario.senha"
                  label="Senha Provisória"
                  :rules="[requiredRule, senhaRule]"
                  type="password"
                  variant="outlined"
                  density="compact"
                  hint="Mínimo 8 caracteres"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <label class="text-body-2">Tipo de Acesso</label>
                <v-radio-group v-model="novoUsuario.tipoCadastro" inline>
                  <v-radio
                    v-for="opt in tipoCadastroOptions"
                    :key="opt.value"
                    :label="opt.title"
                    :value="opt.value"
                  ></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="fecharModalCadastro">Cancelar</v-btn>
          <v-btn
            color="primary"
            :loading="loadingCadastro"
            type="submit"
          >
            Salvar
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogReset" max-width="500px" persistent>
    <v-card>
      <v-form ref="formResetRef" @submit.prevent="handleResetarSenha">
        <v-card-title>
          <span class="text-h5">Resetar Senha de Usuário</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  v-model="matriculaParaReset"
                  :items="allUsersOptions"
                  item-title="title"
                  item-value="value"
                  label="Selecionar Usuário"
                  :rules="[requiredRule]"
                  variant="outlined"
                  density="compact"
                  placeholder="Digite o nome ou matrícula..."
                ></v-autocomplete>
                <div class="text-caption pa-1">
                  Uma nova senha temporária será gerada automaticamente.
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="fecharModalReset">Cancelar</v-btn>
          <v-btn
            color="orange"
            :loading="loadingReset"
            type="submit"
          >
            Resetar Senha
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogUpload" max-width="500px" persistent>
    <v-card>
      <v-card-title>
        <span class="text-h5">Importar e Atualizar CSV</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-file-input
                label="Selecionar arquivo CSV"
                accept=".csv, text/csv"
                variant="outlined"
                density="compact"
                @change="onFileChange"
                :error-messages="uploadError"
              ></v-file-input>
              <div class="text-caption pa-1">
                O arquivo será processado pelo backend.
                Processos existentes serão atualizados se a data de intimação for mais recente.
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="fecharModalUpload">Cancelar</v-btn>
        <v-btn
          color="teal"
          :loading="loadingUpload"
          @click="handleUploadCSV"
          :disabled="!csvFile"
        >
          Enviar e Processar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>


  <v-dialog v-model="dialogDelete" max-width="500px" persistent>
    <v-card>
      <v-form ref="formDeleteRef" @submit.prevent="handleDeleteUser">
        <v-card-title>
          <span class="text-h5">Apagar Usuário</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-alert
              type="error"
              variant="tonal"
              class="mb-4"
              border="start"
              prominent
            >
              <strong>Atenção:</strong> Esta ação é permanente e não pode ser desfeita. Todos os processos atribuídos a este usuário ficarão "Não Atribuídos".
            </v-alert>

            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  v-model="matriculaParaDelete"
                  item-title="title"
                  :items="allUsersOptions"
                  item-value="value"
                  label="Selecionar Usuário para Apagar"
                  :rules="[requiredRule]"
                  variant="outlined"
                  density="compact"
                  placeholder="Digite o nome ou matrícula..."
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="fecharModalDelete">Cancelar</v-btn>
          <v-btn
            color="red"
            :loading="loadingDelete"
            type="submit"
          >
            Apagar Usuário
          </v-btn>
        </v-card-actions>
      </v-form>
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
    @update:model-value="val => { if (!val) { snackbarTimeout = 3000; snackbarProgress = 100; } }"
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
import { differenceInDays, startOfToday, format } from 'date-fns';
// jsPDF e autoTable são carregados sob demanda (lazy) para não aumentar o bundle inicial
import { computed } from 'vue';
import { useDisplay, useTheme } from 'vuetify';
import { useDrawer } from '@/composables/useDrawer';
const { mdAndUp, width } = useDisplay();
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
// ... (Todo o estado dos modais e snackbar é MANTIDO aqui) ...
const snackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');
const snackbarTimeout = ref(3000);
const snackbarProgress = ref(100);
let snackbarTimer = null;
const menuInicio = ref(false);
const menuFim = ref(false);

// Modal: Cadastrar Usuário
const dialogCadastro = ref(false);
const formCadastroRef = ref(null);
const loadingCadastro = ref(false);
const novoUsuario = ref({ matricula: '', nome: '', senha: '', tipoCadastro: 'admin_padrao' });

// Modal: Resetar Senha
const dialogReset = ref(false);
const formResetRef = ref(null);
const loadingReset = ref(false);
const matriculaParaReset = ref(null);

// Modal: Apagar Usuário
const dialogDelete = ref(false);
const formDeleteRef = ref(null);
const loadingDelete = ref(false);
const matriculaParaDelete = ref(null);

// Modal: Upload CSV
const dialogUpload = ref(false);
const loadingUpload = ref(false);
const csvFile = ref(null);
const uploadError = ref(null);

// Modal: Atribuir em Massa
const dialogBulkAssign = ref(false);
const formBulkAssignRef = ref(null);
const loadingBulkAssign = ref(false);
const matriculaParaAtribuir = ref(null);

// =================================================================
// 5. REGRAS DE VALIDAÇÃO
// =================================================================
const requiredRule = v => !!v || 'Campo obrigatório';
const senhaRule = v => (v && v.length >= 8) || 'Senha deve ter no mínimo 8 caracteres';

// =================================================================
// 6. PROPRIEDADES COMPUTADAS (COMPUTED)
// =================================================================
// ... (Todas as computed properties são MANTIDAS aqui) ...
// Opções para os selects de filtro/modais
const tipoCadastroOptions = ref([
  { title: 'Admin Padrão', value: 'admin_padrao' },
  { title: 'Admin Super', value: 'admin_super' },
]);

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
// 7. FUNÇÕES HELPERS (Cálculo de Prazo, Construtores de Query)
// =================================================================
// ... (Todas as funções helper são MANTIDAS aqui) ...
// --- Helpers de Cálculo de Prazo (Usados pela Tabela) ---
// Converte "YYYY-MM-DD" para Date em horário local (evita erro de UTC no fuso Brasil)
const parseDateLocal = (str) => {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
};

// Calcula prazo sempre a partir de data_intimacao + prazo_processual,
// igual ao sistema antigo — ignora prazo_vencimento armazenado, que pode estar desatualizado.
// Usa prazo_vencimento apenas como último recurso (sem os outros campos).
const getPrazoRestanteNum = (proc) => {
  let dataVencimento = null;

  if (proc.data_intimacao && proc.prazo_processual) {
    const dias = parseInt(proc.prazo_processual, 10) || 0;
    dataVencimento = parseDateLocal(proc.data_intimacao);
    dataVencimento.setDate(dataVencimento.getDate() + dias);
  } else if (proc.prazo_vencimento) {
    dataVencimento = parseDateLocal(proc.prazo_vencimento);
  }

  if (!dataVencimento) return null;
  try {
    return differenceInDays(dataVencimento, startOfToday());
  } catch {
    return null;
  }
};
const formatarPrazo = (dias) => {
  if (dias === null) return 'N/A';
  if (dias < 0) return `Vencido há ${Math.abs(dias)} dias`;
  if (dias === 0) return 'Vence hoje';
  return `Vence em ${dias} dias`;
};
const getCorPrazo = (dias) => {
  if (dias === null) return 'grey';
  if (dias < 0) return 'red';
  if (dias <= 5) return 'orange';
  return 'green';
};

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
    snackbarText.value = 'Erro ao carregar processos da tabela.';
    snackbarColor.value = 'error';
    snackbar.value = true;
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
    snackbarText.value = 'Erro ao carregar dados dos gráficos.';
    snackbarColor.value = 'error';
    snackbar.value = true;
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

// --- Cache helpers (sessionStorage com TTL de 5 minutos) ---
const CACHE_TTL = 5 * 60 * 1000;

const getCache = (key) => {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) {
      sessionStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
};

const setCache = (key, data) => {
  sessionStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
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
    snackbarText.value = 'Erro ao carregar lista de usuários.';
    snackbarColor.value = 'error';
    snackbar.value = true;
  }
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
    snackbarText.value = 'Erro ao salvar observação.';
    snackbarColor.value = 'error';
    snackbar.value = true;
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
      snackbarText.value = `Erro ao ${acao} processo.`;
      snackbarColor.value = 'error';
      snackbar.value = true;
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
// (MANTIDOS)
const downloadPDF = async (dataToExport) => {
  let processesToExport;
  if (dataToExport === selected.value) {
    processesToExport = [...dataToExport];
  } else {
    processesToExport = [...serverItems.value];
  }

  const sortState = options.value.sortBy || [];
  if (sortState.length > 0) {
    processesToExport = sortProcesses(processesToExport, sortState);
  }

  if (processesToExport.length === 0) {
    snackbarText.value = 'Nenhum item para exportar.';
    snackbarColor.value = 'info';
    snackbar.value = true;
    return;
  }

  actionLoading.value = true;
  actionLoadingText.value = 'Gerando PDF...';
  await nextTick(); // garante que o overlay renderiza antes do trabalho síncrono

  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable')
  ]);
  const doc = new jsPDF('l', 'mm', 'a4');

  // --- CABEÇALHO DO PDF ---
  // Título
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Relatório de Processos', 15, 15);

  // Data de impressão
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  const dataAtual = format(new Date(), 'dd/MM/yyyy HH:mm');
  doc.text(`Data de Impressão: ${dataAtual}`, 15, 22);

  // Quantidade de processos
  doc.text(`Total de Processos: ${processesToExport.length}`, 15, 28);

  // Filtros aplicados
  let yPosition = 34;
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

  if (filtrosAtivos.length > 0) {
    doc.setFont(undefined, 'bold');
    doc.text('Filtros Aplicados:', 15, yPosition);
    doc.setFont(undefined, 'normal');
    yPosition += 6;

    filtrosAtivos.forEach((filtro, index) => {
      // Se o texto for muito longo, quebra em múltiplas linhas
      const maxWidth = 267; // Largura da página A4 landscape menos margens
      const linhas = doc.splitTextToSize(filtro, maxWidth);
      linhas.forEach(linha => {
        doc.text(`  • ${linha}`, 15, yPosition);
        yPosition += 5;
      });
    });
  } else {
    doc.text('Filtros: Nenhum filtro aplicado', 15, yPosition);
    yPosition += 6;
  }

  // Linha separadora
  doc.setLineWidth(0.5);
  doc.line(15, yPosition + 2, 282, yPosition + 2);

  // --- FIM DO CABEÇALHO ---

  const columns = [
    { header: 'Nº Processo', dataKey: 'numero_processo' },
    { header: 'Atribuído a', dataKey: 'user' },
    { header: 'Classe', dataKey: 'classe_principal' },
    { header: 'Assunto', dataKey: 'assunto_principal' },
    { header: 'Tarjas', dataKey: 'tarjas' },
    { header: 'Prazo', dataKey: 'prazoRestanteStr' },
    { header: 'Reiterações', dataKey: 'reiteracoes' },
    { header: 'Obs', dataKey: 'observacoes' }
  ];
  const rows = processesToExport.map(proc => ({
    numero_processo: proc.numero_processo || '',
    user: proc.User?.nome || 'N.A.',
    classe_principal: proc.classe_principal || '',
    assunto_principal: proc.assunto_principal || '',
    tarjas: proc.tarjas || '',
    prazoRestanteStr: proc.prazoRestanteStr || 'N/A',
    reiteracoes: proc.reiteracoes || 0,
    observacoes: proc.observacoes || ''
  }));

  // Inicia a tabela após o cabeçalho (yPosition + margem)
  autoTable(doc, {
    columns,
    body: rows,
    startY: yPosition + 8,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 139, 202], fontStyle: 'bold' }
  });

  doc.save('processos.pdf');
  actionLoading.value = false;
};

const getValue = (obj, path) => {
  if (path === 'user') return obj.User?.nome;
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const sortProcesses = (processList, sortState) => {
  if (!sortState || sortState.length === 0) return processList;
  const { key, order } = sortState[0];
  if (!key) return processList;
  return [...processList].sort((a, b) => {
    let valA = getValue(a, key);
    let valB = getValue(b, key);
    if (valA == null) return 1;
    if (valB == null) return -1;
    if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }
    if (valA < valB) return order === 'asc' ? -1 : 1;
    if (valA > valB) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

// =================================================================
// 10. FUNÇÕES DOS MODAIS (Admin)
// =================================================================
// ... (TODAS as funções de abrir/fechar/handle dos modais são MANTIDAS aqui) ...
// --- Modal Cadastrar ---
const abrirModalCadastro = () => {
  novoUsuario.value = { matricula: '', nome: '', senha: '', tipoCadastro: 'admin_padrao' };
  formCadastroRef.value?.resetValidation();
  dialogCadastro.value = true;
};
const fecharModalCadastro = () => { dialogCadastro.value = false; };
const handleSalvarCadastro = async () => {
  const { valid } = await formCadastroRef.value.validate();
  if (!valid) return;
  loadingCadastro.value = true;
  try {
    await apiClient.post('/admin/pre-cadastro', novoUsuario.value);
    snackbarText.value = 'Usuário cadastrado com sucesso!';
    snackbarColor.value = 'success';
    snackbar.value = true;
    fecharModalCadastro();
    await fetchAllUsers(); // Atualiza a lista de usuários
  } catch (error) {
    snackbarText.value = error.response?.data?.error || 'Erro ao salvar usuário.';
    snackbarColor.value = 'error';
    snackbar.value = true;
  } finally {
    loadingCadastro.value = false;
  }
};

// --- Modal Resetar Senha ---
const abrirModalReset = () => {
  matriculaParaReset.value = null;
  formResetRef.value?.resetValidation();
  dialogReset.value = true;
};
const fecharModalReset = () => { dialogReset.value = false; };
const handleResetarSenha = async () => {
  const { valid } = await formResetRef.value.validate();
  if (!valid) return;
  loadingReset.value = true;
  try {
    const { data } = await apiClient.post('/admin/reset-password', { matricula: matriculaParaReset.value });
    snackbarText.value = `Senha resetada! Nova senha temporária: ${data.senhaTemporaria}`;
    snackbarColor.value = 'success';
    snackbarTimeout.value = 15000;
    snackbar.value = true;
    fecharModalReset();
  } catch (error) {
    snackbarText.value = error.response?.data?.error || 'Erro ao resetar senha.';
    snackbarColor.value = 'error';
    snackbar.value = true;
  } finally {
    loadingReset.value = false;
  }
};

// --- Modal Apagar Usuário ---
const abrirModalDelete = () => {
  matriculaParaDelete.value = null;
  formDeleteRef.value?.resetValidation();
  dialogDelete.value = true;
};
const fecharModalDelete = () => { dialogDelete.value = false; };
const handleDeleteUser = async () => {
  const { valid } = await formDeleteRef.value.validate();
  if (!valid) return;
  loadingDelete.value = true;
  try {
    await apiClient.post('/admin/delete-matricula', { matricula: matriculaParaDelete.value });
    
    snackbarText.value = 'Usuário apagado com sucesso!';
    snackbarColor.value = 'success';
    snackbar.value = true;
    fecharModalDelete();
    await fetchAllUsers(); // Atualiza a lista de usuários
    await reloadAllData(); // Recarrega processos (podem ter sido desatribuídos)

  } catch (error) {
    // ✅ CORREÇÃO: Lê a propriedade 'error' da resposta JSON do backend
    snackbarText.value = error.response?.data?.error || 'Erro ao apagar usuário.';
    
    snackbarColor.value = 'error';
    snackbar.value = true;
  } finally {
    loadingDelete.value = false;
  }
};

// --- Modal Upload CSV ---
const abrirModalUpload = () => {
  csvFile.value = null;
  uploadError.value = null;
  dialogUpload.value = true;
};
const fecharModalUpload = () => { dialogUpload.value = false; };
const onFileChange = (event) => {
  const files = event.target.files;
  if (files && files.length > 0) {
    if (files[0].type === 'text/csv' || files[0].name.endsWith('.csv')) {
      csvFile.value = files[0];
      uploadError.value = null;
    } else {
      csvFile.value = null;
      uploadError.value = "Formato de arquivo inválido. Por favor, selecione um arquivo .csv";
    }
  }
};
const handleUploadCSV = async () => {
  if (!csvFile.value) {
    uploadError.value = "Nenhum arquivo selecionado.";
    return;
  }
  loadingUpload.value = true;
  uploadError.value = null;
  const formData = new FormData();
  formData.append('csvFile', csvFile.value);
  try {
    const response = await apiClient.post('/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    loadingUpload.value = false;
    fecharModalUpload();
    snackbarText.value = response.data?.message
      ? `${response.data.message} (${response.data.totalRows} registros)`
      : 'CSV importado com sucesso!';
    snackbarColor.value = 'success';
    snackbar.value = true;
    await reloadAllData(); // Recarrega tudo
  } catch (error) {
    loadingUpload.value = false;
    uploadError.value = error.response?.data?.error || 'Erro ao importar CSV.';
  }
};

// --- Modal Atribuir em Massa ---
const abrirModalBulkAssign = () => {
  if (selected.value.length === 0) {
    snackbarText.value = 'Nenhum processo selecionado.';
    snackbarColor.value = 'warning';
    snackbar.value = true;
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
    snackbarText.value = 'Processos atribuídos com sucesso!';
    snackbarColor.value = 'success';
    snackbar.value = true;
    fecharModalBulkAssign();
    selected.value = [];
    await reloadAllData(); // Recarrega tudo
  } catch (error) {
    snackbarText.value = error.response?.data?.error || 'Erro ao atribuir processos.';
    snackbarColor.value = 'error';
    snackbar.value = true;
  } finally {
    loadingBulkAssign.value = false;
  }
};

// =================================================================
// 11. OBSERVADORES (WATCHERS)
// =================================================================
// ... (Todos os watchers são MANTIDOS aqui) ...
// Anima a barra de progresso do snackbar
watch(snackbar, (val) => {
  if (snackbarTimer) clearInterval(snackbarTimer);
  if (val) {
    snackbarProgress.value = 100;
    const interval = 50;
    const decrement = 100 / (snackbarTimeout.value / interval);
    snackbarTimer = setInterval(() => {
      snackbarProgress.value = Math.max(0, snackbarProgress.value - decrement);
      if (snackbarProgress.value <= 0) clearInterval(snackbarTimer);
    }, interval);
  } else {
    snackbarProgress.value = 100;
  }
});

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
