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
</template>

<script setup>
// Modais de administração de usuários (cadastro, reset de senha, exclusão)
// e importação de CSV. A página pai abre os modais via ref (defineExpose) e
// reage aos eventos para recarregar listas/dados e exibir notificações.
import { ref } from 'vue';
import apiClient from '@/api/axios';

defineProps({
  // Opções formatadas [{ title, value }] para os autocompletes de usuário
  allUsersOptions: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['notify', 'users-changed', 'data-changed']);

const requiredRule = v => !!v || 'Campo obrigatório';
const senhaRule = v => (v && v.length >= 8) || 'Senha deve ter no mínimo 8 caracteres';

const tipoCadastroOptions = [
  { title: 'Admin Padrão', value: 'admin_padrao' },
  { title: 'Admin Super', value: 'admin_super' },
];

// --- Modal Cadastrar ---
const dialogCadastro = ref(false);
const formCadastroRef = ref(null);
const loadingCadastro = ref(false);
const novoUsuario = ref({ matricula: '', nome: '', senha: '', tipoCadastro: 'admin_padrao' });

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
    emit('notify', 'Usuário cadastrado com sucesso!', 'success');
    fecharModalCadastro();
    emit('users-changed');
  } catch (error) {
    emit('notify', error.response?.data?.error || 'Erro ao salvar usuário.', 'error');
  } finally {
    loadingCadastro.value = false;
  }
};

// --- Modal Resetar Senha ---
const dialogReset = ref(false);
const formResetRef = ref(null);
const loadingReset = ref(false);
const matriculaParaReset = ref(null);

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
    // Timeout longo: o admin precisa copiar a senha temporária exibida
    emit('notify', `Senha resetada! Nova senha temporária: ${data.senhaTemporaria}`, 'success', 15000);
    fecharModalReset();
  } catch (error) {
    emit('notify', error.response?.data?.error || 'Erro ao resetar senha.', 'error');
  } finally {
    loadingReset.value = false;
  }
};

// --- Modal Apagar Usuário ---
const dialogDelete = ref(false);
const formDeleteRef = ref(null);
const loadingDelete = ref(false);
const matriculaParaDelete = ref(null);

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
    emit('notify', 'Usuário apagado com sucesso!', 'success');
    fecharModalDelete();
    emit('users-changed');
    emit('data-changed'); // Processos podem ter sido desatribuídos
  } catch (error) {
    emit('notify', error.response?.data?.error || 'Erro ao apagar usuário.', 'error');
  } finally {
    loadingDelete.value = false;
  }
};

// --- Modal Upload CSV ---
const dialogUpload = ref(false);
const loadingUpload = ref(false);
const csvFile = ref(null);
const uploadError = ref(null);

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
    const message = response.data?.message
      ? `${response.data.message} (${response.data.totalRows} registros)`
      : 'CSV importado com sucesso!';
    emit('notify', message, 'success');
    emit('data-changed');
  } catch (error) {
    loadingUpload.value = false;
    uploadError.value = error.response?.data?.error || 'Erro ao importar CSV.';
  }
};

defineExpose({
  abrirModalCadastro,
  abrirModalReset,
  abrirModalDelete,
  abrirModalUpload,
});
</script>
