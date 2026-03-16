<template>
  <div style="width: 100%; overflow-x: auto;">
    <v-data-table-server
      :headers="headers"
      :items="props.items"
      :items-length="props.totalItems" :loading="props.loading"
      
      show-select
      return-object
      :model-value="props.selected"
      @update:model-value="emit('update:selected', $event)"
      
      @update:options="emit('update:options', $event)" item-key="id"
      class="elevation-1"
      fixed-header
      height="70vh"
    >

      <template v-slot:no-data>
        <div class="pa-8 text-center">
          <v-icon 
            size="64" 
            color="grey-lighten-2"
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
      

      <template v-slot:item.user="{ item }">
        <span v-if="item.User">{{ item.User.nome }}</span>
        <v-chip v-else size="small" variant="tonal">Não Atribuído</v-chip>
      </template>
        
      <template v-slot:item.prazoRestanteNum="{ item }">
        <v-chip :color="item.prazoRestanteColor" size="small">
          {{ item.prazoRestanteStr }}
        </v-chip>
      </template>

      <template v-slot:item.observacoes="{ item }">
        <div @dblclick="abrirModalObs(item)" class="obs-celula" title="Clique duplo para editar">
          {{ item.observacoes || '...' }}
        </div>
      </template>

      <template v-slot:item.acaoCumprido="{ item }">
        <!-- ATUALIZADO: Estado CUMPRIDO (trocado 'icon' por 'variant="text"') -->
        <v-tooltip location="top" v-if="item.cumprido">
          <template v-slot:activator="{ props: tooltipProps }">
            <v-btn
              variant="text"
              color="success"
              v-bind="tooltipProps"
              @click="emitirEventoMarcarCumprido(item)"
              title="Desmarcar processo"
              size="x-small" 
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
          variant="text"
          color="grey-lighten-1"
          @click="emitirEventoMarcarCumprido(item)"
          title="Marcar como cumprido"
          size="x-small" 
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
            label="Observações do Processo"
            rows="5"
            auto-grow
            counter
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
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
import { ref } from 'vue';
import { parseISO, format } from 'date-fns';

// --- 1. PROPS (ATUALIZADO) ---
const props = defineProps({
  items: { type: Array, default: () => [] },
  totalItems: { type: Number, default: 0 }, // NOVO: Total de itens no DB
  loading: { type: Boolean, default: false },
  selected: { type: Array, default: () => [] },
  // 'search' foi removido (o pai controla)
  // 'sortBy' foi removido (agora vem pelo evento 'options')
});

// --- 2. EVENTS (ATUALIZADO) ---
const emit = defineEmits([
  'salvar-obs', 
  'marcar-cumprido', 
  'update:selected',
  'update:options' // NOVO: Evento de paginação/ordenação
]);

// --- 3. ESTADO LOCAL (Sem alteração) ---
const dialogObs = ref(false);
const itemEdicao = ref({ id: null, observacoes: '' });

// --- 4. HEADERS (Sem alteração, mas 'sortable: false' foi removido) ---
// Precisamos habilitar 'sortable' para a ordenação do servidor funcionar.
// O 'prazoRestanteNum' vai precisar de atenção especial.
const headers = ref([
  { title: 'Nº Processo', key: 'numero_processo', width: '220px' }, // Exemplo de largura fixa
  { title: 'Atribuído', key: 'user', width: '120px' },
  { title: 'Classe', key: 'classe_principal', width: '140px' },
  { title: 'Assunto', key: 'assunto_principal', width: '200px' },
  { title: 'Tarjas', key: 'tarjas', width: '150px' },
  { title: 'Prazo', key: 'prazoRestanteNum', width: '140px' },
  { title: 'Reit.', key: 'reiteracoes', width: '60px', align: 'center' },
  { title: 'Obs', key: 'observacoes',  width: '250px', sortable: false },
  { title: 'Cumprir', key: 'acaoCumprido', width: '70px', align: 'center', sortable: false },
]);

// --- 5. FUNÇÕES AUXILIARES (Sem alteração) ---
const formatarDataHora = (dataISO) => {
  if (!dataISO) return '';
  try {
    return format(parseISO(dataISO), 'dd/MM/yyyy HH:mm');
  } catch (e) {
    return 'Data inválida';
  }
};

// --- 6. MÉTODOS DE EMIT (Sem alteração) ---
const abrirModalObs = (item) => {
  itemEdicao.value = { ...item };
  dialogObs.value = true;
};
const emitirEventoSalvarObs = () => {
  emit('salvar-obs', itemEdicao.value);
  dialogObs.value = false;
};
const emitirEventoMarcarCumprido = (item) => {
  emit('marcar-cumprido', item);
};
</script>

<style scoped>
/* Seus estilos permanecem os mesmos */ 
.obs-celula {
  cursor: pointer;
  min-height: 40px;
  display: flex;
  align-items: center;
  width: 100%;
}

/* --- CORREÇÃO PARA LINHAS VERTICAIS ---
  O seu código original usava 'rgba(255, 255, 255, 0.12)' (branco), 
  que só funciona no modo escuro.
  Agora, ele aplica a cor correta para cada tema.
*/

/* ATUALIZADO: Removemos o :not(:last-child) para aplicar a borda em TODAS as colunas */
/* Estilo para MODO ESCURO (linha branca) */
:deep(.v-theme--dark th) {
  border-right: 1px solid rgba(255, 255, 255, 0.12) !important;
}
:deep(.v-theme--dark td) {
  border-right: 1px solid rgba(255, 255, 255, 0.12) !important;
}

/* Estilo para MODO CLARO (linha cinza/preta) */
:deep(.v-theme--light th) {
  border-right: 1px solid rgba(0, 0, 0, 0.12) !important;
}
:deep(.v-theme--light td) {
  border-right: 1px solid rgba(0, 0, 0, 0.12) !important;
}
/* --- FIM DA CORREÇÃO --- */


:deep(table) {
  table-layout: fixed;
}
:deep(td) {
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-all;
}
</style>

