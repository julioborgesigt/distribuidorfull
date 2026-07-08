<template>
  <v-dialog v-model="dialog" max-width="820px" scrollable>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon start>mdi-office-building-outline</v-icon>
        Gerenciar Unidades
        <v-spacer />
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          size="small"
          variant="flat"
          @click="abrirNova"
        >
          Nova Unidade
        </v-btn>
        <v-btn class="ml-2" icon="mdi-close" variant="text" @click="dialog = false" />
      </v-card-title>
      <v-divider />

      <v-card-text style="max-height: 70vh;">
        <!-- Formulário de criação/edição -->
        <v-form v-if="editando" ref="formRef" class="mb-4" @submit.prevent="salvar">
          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.nome"
                density="compact"
                label="Nome da unidade"
                :rules="[requiredRule]"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.nome_pje"
                density="compact"
                hint="Nome como o PJe escreve na vinculação do aviso"
                label="Nome no PJe (trava de importação)"
                persistent-hint
                variant="outlined"
              />
            </v-col>
            <v-col cols="6" sm="4">
              <v-text-field
                v-model="form.sigla"
                density="compact"
                label="Sigla (opcional)"
                variant="outlined"
              />
            </v-col>
            <v-col class="d-flex align-center" cols="6" sm="4">
              <v-switch
                v-model="form.ativo"
                color="primary"
                density="compact"
                hide-details
                :label="form.ativo ? 'Ativa' : 'Inativa'"
              />
            </v-col>
            <v-col class="d-flex align-center justify-end ga-2" cols="12" sm="4">
              <v-btn variant="text" @click="cancelarEdicao">Cancelar</v-btn>
              <v-btn color="primary" :loading="salvando" type="submit" variant="flat">Salvar</v-btn>
            </v-col>
          </v-row>
        </v-form>

        <v-data-table
          density="compact"
          :headers="headers"
          :items="unidades"
          :items-per-page="-1"
          :loading="loading"
          no-data-text="Nenhuma unidade cadastrada."
        >
          <template #item.ativo="{ item }">
            <v-chip :color="item.ativo ? 'success' : 'grey'" size="small">
              {{ item.ativo ? 'Ativa' : 'Inativa' }}
            </v-chip>
          </template>
          <template #item.acoes="{ item }">
            <v-btn icon="mdi-pencil" size="small" variant="text" @click="editar(item)" />
            <v-btn color="red" icon="mdi-delete-outline" size="small" variant="text" @click="excluir(item)" />
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { reactive, ref } from 'vue'
  import apiClient from '@/api/axios'

  const emit = defineEmits(['notify', 'changed'])

  const dialog = ref(false)
  const loading = ref(false)
  const salvando = ref(false)
  const unidades = ref([])
  const editando = ref(false)
  const formRef = ref(null)
  const form = reactive({ id: null, nome: '', sigla: '', nome_pje: '', ativo: true })

  const requiredRule = v => !!v || 'Campo obrigatório'

  const headers = [
    { title: 'Nome', key: 'nome' },
    { title: 'Sigla', key: 'sigla' },
    { title: 'Nome no PJe', key: 'nome_pje' },
    { title: 'Status', key: 'ativo', align: 'center' },
    { title: 'Ações', key: 'acoes', align: 'end', sortable: false },
  ]

  async function carregar () {
    loading.value = true
    try {
      const { data } = await apiClient.get('/admin/unidades')
      unidades.value = data || []
    } catch {
      emit('notify', 'Erro ao carregar unidades.', 'error')
    } finally {
      loading.value = false
    }
  }

  function abrirNova () {
    Object.assign(form, { id: null, nome: '', sigla: '', nome_pje: '', ativo: true })
    editando.value = true
    formRef.value?.resetValidation()
  }

  function editar (item) {
    Object.assign(form, { id: item.id, nome: item.nome, sigla: item.sigla || '', nome_pje: item.nome_pje || '', ativo: !!item.ativo })
    editando.value = true
  }

  function cancelarEdicao () {
    editando.value = false
  }

  async function salvar () {
    const { valid } = await formRef.value.validate()
    if (!valid) return
    salvando.value = true
    try {
      const payload = { nome: form.nome, sigla: form.sigla || null, nome_pje: form.nome_pje || null, ativo: form.ativo }
      if (form.id) {
        await apiClient.put(`/admin/unidades/${form.id}`, payload)
      } else {
        await apiClient.post('/admin/unidades', payload)
      }
      emit('notify', 'Unidade salva com sucesso!', 'success')
      editando.value = false
      await carregar()
      emit('changed')
    } catch (err) {
      emit('notify', err.response?.data?.error || 'Erro ao salvar unidade.', 'error')
    } finally {
      salvando.value = false
    }
  }

  async function excluir (item) {
    if (!window.confirm(`Excluir a unidade "${item.nome}"? Só é possível se não houver usuários nem processos vinculados.`)) return
    try {
      await apiClient.delete(`/admin/unidades/${item.id}`)
      emit('notify', 'Unidade excluída.', 'success')
      await carregar()
      emit('changed')
    } catch (err) {
      emit('notify', err.response?.data?.error || 'Erro ao excluir unidade.', 'error')
    }
  }

  async function abrir () {
    editando.value = false
    dialog.value = true
    await carregar()
  }

  defineExpose({ abrir })
</script>
