<template>
  <!-- Modal: Cadastrar Usuário -->
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
                  density="compact"
                  label="Nome Completo"
                  :rules="[requiredRule]"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="novoUsuario.matricula"
                  density="compact"
                  label="Matrícula"
                  :rules="[requiredRule]"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="novoUsuario.senha"
                  density="compact"
                  hint="Mínimo 8 caracteres"
                  label="Senha Provisória"
                  :rules="[requiredRule, senhaRule]"
                  type="password"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <label class="text-body-2">Tipo de Acesso</label>
                <v-radio-group v-model="novoUsuario.tipoCadastro" inline>
                  <v-radio
                    v-for="opt in tipoCadastroOptions"
                    :key="opt.value"
                    :label="opt.title"
                    :value="opt.value"
                  />
                </v-radio-group>
              </v-col>
              <!-- Unidade: o super escolhe; o admin da unidade cria sempre na
                   própria unidade (campo oculto). Não se aplica ao super global. -->
              <v-col v-if="authStore.isSuper && novoUsuario.tipoCadastro !== 'super'" cols="12">
                <v-autocomplete
                  v-model="novoUsuario.unidadeId"
                  density="compact"
                  item-title="nome"
                  item-value="id"
                  :items="unidades"
                  label="Unidade (delegacia)"
                  :rules="[requiredRule]"
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
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

  <!-- Modal: Resetar Senha -->
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
                  density="compact"
                  item-title="title"
                  item-value="value"
                  :items="allUsersOptions"
                  label="Selecionar Usuário"
                  placeholder="Digite o nome ou matrícula..."
                  :rules="[requiredRule]"
                  variant="outlined"
                />
                <div class="text-caption pa-1">
                  Uma nova senha temporária será gerada automaticamente.
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
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

  <!-- Modal: Upload CSV -->
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
                accept=".csv, text/csv"
                density="compact"
                :error-messages="uploadError"
                label="Selecionar arquivo CSV"
                variant="outlined"
                @change="onFileChange"
              />
              <div class="text-caption pa-1">
                O arquivo será processado pelo backend.
                Processos existentes serão atualizados se a data de intimação for mais recente.
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="fecharModalUpload">Cancelar</v-btn>
        <v-btn
          color="teal"
          :disabled="!csvFile"
          :loading="loadingUpload"
          @click="handleUploadCSV"
        >
          Enviar e Processar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Modal: Apagar Usuário -->
  <v-dialog v-model="dialogDelete" max-width="500px" persistent>
    <v-card>
      <v-form ref="formDeleteRef" @submit.prevent="handleDeleteUser">
        <v-card-title>
          <span class="text-h5">Apagar Usuário</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-alert
              border="start"
              class="mb-4"
              prominent
              type="error"
              variant="tonal"
            >
              <strong>Atenção:</strong> Esta ação é permanente e não pode ser desfeita. Todos os processos atribuídos a este usuário ficarão "Não Atribuídos".
            </v-alert>

            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  v-model="matriculaParaDelete"
                  density="compact"
                  item-title="title"
                  item-value="value"
                  :items="allUsersOptions"
                  label="Selecionar Usuário para Apagar"
                  placeholder="Digite o nome ou matrícula..."
                  :rules="[requiredRule]"
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
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
</template>

<script setup>
// Modais de administração de usuários (cadastro, reset de senha, exclusão)
// e importação de CSV. A página pai abre os modais via ref (defineExpose) e
// reage aos eventos para recarregar listas/dados e exibir notificações.
  import { computed, ref } from 'vue'
  import apiClient from '@/api/axios'
  import { useAuthStore } from '@/stores/auth'

  const props = defineProps({
    // Opções formatadas [{ title, value }] para os autocompletes de usuário
    allUsersOptions: {
      type: Array,
      default: () => [],
    },
    // Unidade de destino do upload de CSV (só relevante para o super global;
    // null para admin da unidade, que usa a própria).
    uploadUnidadeId: {
      type: [Number, String],
      default: null,
    },
  })

  const emit = defineEmits(['notify', 'users-changed', 'data-changed'])
  const authStore = useAuthStore()

  const requiredRule = v => !!v || 'Campo obrigatório'
  const senhaRule = v => (v && v.length >= 8) || 'Senha deve ter no mínimo 8 caracteres'

  // Papéis disponíveis conforme quem está cadastrando:
  //   super       → pode criar servidor, admin de unidade e outro super
  //   admin_unid. → só servidor e admin da própria unidade
  const tipoCadastroOptions = computed(() => {
    const base = [
      { title: 'Usuário', value: 'servidor' },
      { title: 'Admin unidade', value: 'admin_unidade' },
    ]
    if (authStore.isSuper) {
      base.push({ title: 'Admin global', value: 'super' })
    }
    return base
  })

  // Lista de unidades (para o super escolher a unidade do novo usuário).
  const unidades = ref([])
  async function carregarUnidades () {
    if (!authStore.isSuper) return
    try {
      const { data } = await apiClient.get('/admin/unidades')
      unidades.value = data || []
    } catch {
      // silencioso — sem unidades o super não consegue selecionar
    }
  }

  // --- Modal Cadastrar ---
  const dialogCadastro = ref(false)
  const formCadastroRef = ref(null)
  const loadingCadastro = ref(false)
  const novoUsuario = ref({ matricula: '', nome: '', senha: '', tipoCadastro: 'servidor', unidadeId: null })

  function abrirModalCadastro () {
    novoUsuario.value = { matricula: '', nome: '', senha: '', tipoCadastro: 'servidor', unidadeId: null }
    formCadastroRef.value?.resetValidation()
    carregarUnidades()
    dialogCadastro.value = true
  }
  function fecharModalCadastro () {
    dialogCadastro.value = false
  }
  async function handleSalvarCadastro () {
    const { valid } = await formCadastroRef.value.validate()
    if (!valid) return
    loadingCadastro.value = true
    try {
      await apiClient.post('/admin/pre-cadastro', novoUsuario.value)
      emit('notify', 'Usuário cadastrado com sucesso!', 'success')
      fecharModalCadastro()
      emit('users-changed')
    } catch (error) {
      emit('notify', error.response?.data?.error || 'Erro ao salvar usuário.', 'error')
    } finally {
      loadingCadastro.value = false
    }
  }

  // --- Modal Resetar Senha ---
  const dialogReset = ref(false)
  const formResetRef = ref(null)
  const loadingReset = ref(false)
  const matriculaParaReset = ref(null)

  function abrirModalReset () {
    matriculaParaReset.value = null
    formResetRef.value?.resetValidation()
    dialogReset.value = true
  }
  function fecharModalReset () {
    dialogReset.value = false
  }
  async function handleResetarSenha () {
    const { valid } = await formResetRef.value.validate()
    if (!valid) return
    loadingReset.value = true
    try {
      const { data } = await apiClient.post('/admin/reset-password', { matricula: matriculaParaReset.value })
      // Timeout longo: o admin precisa copiar a senha temporária exibida
      emit('notify', `Senha resetada! Nova senha temporária: ${data.senhaTemporaria}`, 'success', 15_000)
      fecharModalReset()
    } catch (error) {
      emit('notify', error.response?.data?.error || 'Erro ao resetar senha.', 'error')
    } finally {
      loadingReset.value = false
    }
  }

  // --- Modal Apagar Usuário ---
  const dialogDelete = ref(false)
  const formDeleteRef = ref(null)
  const loadingDelete = ref(false)
  const matriculaParaDelete = ref(null)

  function abrirModalDelete () {
    matriculaParaDelete.value = null
    formDeleteRef.value?.resetValidation()
    dialogDelete.value = true
  }
  function fecharModalDelete () {
    dialogDelete.value = false
  }
  async function handleDeleteUser () {
    const { valid } = await formDeleteRef.value.validate()
    if (!valid) return
    loadingDelete.value = true
    try {
      await apiClient.post('/admin/delete-matricula', { matricula: matriculaParaDelete.value })
      emit('notify', 'Usuário apagado com sucesso!', 'success')
      fecharModalDelete()
      emit('users-changed')
      emit('data-changed') // Processos podem ter sido desatribuídos
    } catch (error) {
      emit('notify', error.response?.data?.error || 'Erro ao apagar usuário.', 'error')
    } finally {
      loadingDelete.value = false
    }
  }

  // --- Modal Upload CSV ---
  const dialogUpload = ref(false)
  const loadingUpload = ref(false)
  const csvFile = ref(null)
  const uploadError = ref(null)

  function abrirModalUpload () {
    csvFile.value = null
    uploadError.value = null
    dialogUpload.value = true
  }
  function fecharModalUpload () {
    dialogUpload.value = false
  }
  function onFileChange (event) {
    const files = event.target.files
    if (files && files.length > 0) {
      if (files[0].type === 'text/csv' || files[0].name.endsWith('.csv')) {
        csvFile.value = files[0]
        uploadError.value = null
      } else {
        csvFile.value = null
        uploadError.value = 'Formato de arquivo inválido. Por favor, selecione um arquivo .csv'
      }
    }
  }
  async function handleUploadCSV () {
    if (!csvFile.value) {
      uploadError.value = 'Nenhum arquivo selecionado.'
      return
    }
    // Super precisa ter uma unidade ativa selecionada para saber onde importar.
    if (authStore.isSuper && !props.uploadUnidadeId) {
      uploadError.value = 'Selecione uma unidade ativa no menu antes de importar o CSV.'
      return
    }
    loadingUpload.value = true
    uploadError.value = null
    const formData = new FormData()
    formData.append('csvFile', csvFile.value)
    try {
      const params = authStore.isSuper && props.uploadUnidadeId ? { unidadeId: props.uploadUnidadeId } : {}
      const response = await apiClient.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        params,
      })
      loadingUpload.value = false
      fecharModalUpload()
      const message = response.data?.message
        ? `${response.data.message} (${response.data.totalRows} registros)`
        : 'CSV importado com sucesso!'
      emit('notify', message, 'success')
      emit('data-changed')
    } catch (error) {
      loadingUpload.value = false
      uploadError.value = error.response?.data?.error || 'Erro ao importar CSV.'
    }
  }

  defineExpose({
    abrirModalCadastro,
    abrirModalReset,
    abrirModalDelete,
    abrirModalUpload,
  })
</script>
