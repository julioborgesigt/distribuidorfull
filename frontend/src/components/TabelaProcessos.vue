<template>
  <div style="width: 100%; overflow-x: auto; position: relative;">
    <!-- Overlay de carregamento para ações (salvar obs, marcar cumprido, etc.) -->
    <v-overlay
      class="align-center justify-center"
      contained
      :model-value="props.actionLoading"
      persistent
      scrim="rgba(0,0,0,0.4)"
    >
      <div class="text-center">
        <v-progress-circular
          color="primary"
          indeterminate
          size="48"
          width="4"
        />
        <div class="text-body-1 mt-3 text-white font-weight-medium">
          {{ props.actionLoadingText || 'Processando...' }}
        </div>
      </div>
    </v-overlay>

    <v-data-table-server
      class="elevation-1"
      fixed-header
      :headers="headers"
      height="70vh"
      item-key="id"
      :items="props.items"
      :items-length="props.totalItems"
      :loading="props.loading"
      loading-text="Carregando processos..."
      :model-value="props.selected"
      return-object
      show-select
      @update:model-value="emit('update:selected', $event)"
      @update:options="emit('update:options', $event)"
    >

      <template #no-data>
        <div class="pa-8 text-center">
          <v-icon
            color="grey-lighten-2"
            size="64"
          >
            mdi-magnify-remove-outline
          </v-icon>
          <div class="text-h6 text-grey-lighten-1 mt-4">
            Nenhum processo encontrado
          </div>
          <p class="text-body-2 text-grey-lighten-1 mt-1">
            Tente ajustar ou limpar os filtros de pesquisa.
          </p>
        </div>
      </template>

      <template #item.user="{ item }">
        <span v-if="item.User">{{ item.User.nome }}</span>
        <v-chip v-else size="small" variant="tonal">Não Atribuído</v-chip>
      </template>

      <template #item.prazoRestanteNum="{ item }">
        <v-chip :color="item.prazoRestanteColor" size="small">
          {{ item.prazoRestanteStr }}
        </v-chip>
      </template>

      <template #item.observacoes="{ item }">
        <div class="obs-celula" title="Clique duplo para editar" @dblclick="abrirModalObs(item)">
          {{ item.observacoes || '...' }}
        </div>
      </template>

      <template #item.acaoCumprido="{ item }">
        <!-- ATUALIZADO: Estado CUMPRIDO (trocado 'icon' por 'variant="text"') -->
        <v-tooltip v-if="item.cumprido" location="top">
          <template #activator="{ props: tooltipProps }">
            <v-btn
              color="success"
              v-bind="tooltipProps"
              size="x-small"
              title="Desmarcar processo"
              variant="text"
              @click="emitirEventoMarcarCumprido(item)"
            >
              <!-- Ícone de checkbox marcada -->
              <v-icon>mdi-checkbox-marked</v-icon>
            </v-btn>
          </template>
          <span>
            Cumprido em: {{ formatarDataHora(item.cumpridoDate) }}
          </span>
        </v-tooltip>

        <!-- ATUALIZADO: Estado NÃO CUMPRIDO (trocado 'icon' por 'variant="text"') -->
        <v-btn
          v-else
          color="grey-lighten-1"
          size="x-small"
          title="Marcar como cumprido"
          variant="text"
          @click="emitirEventoMarcarCumprido(item)"
        >
          <!-- Ícone de checkbox vazia -->
          <v-icon>mdi-checkbox-blank-outline</v-icon>
        </v-btn>
      </template>

    </v-data-table-server>

    <v-dialog v-model="dialogObs" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">Editar Observações</span>
        </v-card-title>
        <v-card-text>
          <v-textarea
            v-model="itemEdicao.observacoes"
            auto-grow
            counter
            label="Observações do Processo"
            maxlength="300"
            rows="5"
            :rules="[v => !v || v.length <= 300 || 'Máximo de 300 caracteres']"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialogObs = false">Cancelar</v-btn>
          <v-btn color="primary" @click="emitirEventoSalvarObs">
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
  import { format, parseISO } from 'date-fns'
  import { ref } from 'vue'

  // --- 1. PROPS (ATUALIZADO) ---
  const props = defineProps({
    items: { type: Array, default: () => [] },
    totalItems: { type: Number, default: 0 },
    loading: { type: Boolean, default: false },
    selected: { type: Array, default: () => [] },
    actionLoading: { type: Boolean, default: false },
    actionLoadingText: { type: String, default: 'Processando...' },
  })

  // --- 2. EVENTS (ATUALIZADO) ---
  const emit = defineEmits([
    'salvar-obs',
    'marcar-cumprido',
    'update:selected',
    'update:options', // NOVO: Evento de paginação/ordenação
  ])

  // --- 3. ESTADO LOCAL (Sem alteração) ---
  const dialogObs = ref(false)
  const itemEdicao = ref({ id: null, observacoes: '' })

  // --- 4. HEADERS (Sem alteração, mas 'sortable: false' foi removido) ---
  // Precisamos habilitar 'sortable' para a ordenação do servidor funcionar.
  // O 'prazoRestanteNum' vai precisar de atenção especial.
  const headers = ref([
    { title: 'Nº Processo', key: 'numero_processo', width: '180px' },
    { title: 'Atribuído', key: 'user', width: '100px' },
    { title: 'Classe', key: 'classe_principal', width: '120px' },
    { title: 'Assunto', key: 'assunto_principal', width: '140px' },
    { title: 'Tarjas', key: 'tarjas', width: '120px' },
    { title: 'Prazo', key: 'prazoRestanteNum', width: '120px' },
    { title: 'Reit.', key: 'reiteracoes', width: '70px', align: 'center' },
    { title: 'Observações', key: 'observacoes', width: '165px', sortable: false },
    { title: 'Cumprir', key: 'acaoCumprido', width: '70px', align: 'center', sortable: false },
  ])

  // --- 5. FUNÇÕES AUXILIARES (Sem alteração) ---
  function formatarDataHora (dataISO) {
    if (!dataISO) return ''
    try {
      return format(parseISO(dataISO), 'dd/MM/yyyy HH:mm')
    } catch {
      return 'Data inválida'
    }
  }

  // --- 6. MÉTODOS DE EMIT (Sem alteração) ---
  function abrirModalObs (item) {
    itemEdicao.value = { ...item }
    dialogObs.value = true
  }
  function emitirEventoSalvarObs () {
    emit('salvar-obs', itemEdicao.value)
    dialogObs.value = false
  }
  function emitirEventoMarcarCumprido (item) {
    emit('marcar-cumprido', item)
  }
</script>

<style scoped>
.obs-celula {
  cursor: pointer;
  min-height: 40px;
  display: flex;
  align-items: center;
  width: 100%;
}

/* Bordas verticais entre colunas */
:deep(.v-theme--dark th) {
  border-right: 1px solid rgba(255, 255, 255, 0.12) !important;
}
:deep(.v-theme--dark td) {
  border-right: 1px solid rgba(255, 255, 255, 0.12) !important;
}
:deep(.v-theme--light th) {
  border-right: 1px solid rgba(0, 0, 0, 0.12) !important;
}
:deep(.v-theme--light td) {
  border-right: 1px solid rgba(0, 0, 0, 0.12) !important;
}

/* Tabela responsiva - cabe no container */
:deep(table) {
  table-layout: fixed;
  width: 100% !important;
}
:deep(td), :deep(th) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-word;
}

/* Loading overlay customizado */
:deep(.v-data-table-server .v-data-table-progress) {
  position: sticky;
  top: 48px;
  z-index: 2;
}
</style>
