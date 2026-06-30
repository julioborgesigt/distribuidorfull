<template>
  <v-dialog v-model="dialog" max-width="520px" persistent>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon start>mdi-shield-key-outline</v-icon>
        Autenticação PJe
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" @click="fechar" />
      </v-card-title>

      <v-card-text>
        <!-- Status atual -->
        <v-alert
          v-if="status.configured"
          border="start"
          class="mb-4"
          density="compact"
          type="success"
          variant="tonal"
        >
          <div>Credenciais configuradas: CPF <strong>{{ status.cpfDisplay }}</strong></div>
          <div v-if="status.atualizadoPorNome" class="text-caption">
            Salvo por {{ status.atualizadoPorNome }}
            <span v-if="status.atualizadoEm"> em {{ formatarData(status.atualizadoEm) }}</span>
          </div>
        </v-alert>
        <v-alert
          v-else
          border="start"
          class="mb-4"
          density="compact"
          type="info"
          variant="tonal"
        >
          Nenhuma credencial salva. O sistema usará as variáveis de ambiente
          <code>PJE_CPF</code> / <code>PJE_SENHA</code>.
        </v-alert>

        <v-alert
          border="start"
          class="mb-4"
          density="compact"
          type="warning"
          variant="tonal"
        >
          <strong>Atenção:</strong> estas credenciais dão acesso a dados sigilosos e
          permitem peticionar no PJe em nome da conta cadastrada. Compartilhe apenas
          com responsáveis pela integração.
        </v-alert>

        <!-- Formulário -->
        <v-form ref="formRef" @submit.prevent="salvar">
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="form.cpf"
                density="compact"
                hint="Somente números, 11 dígitos (CPF do usuário do PJe)"
                label="CPF"
                maxlength="14"
                :rules="[cpfRule]"
                variant="outlined"
                @input="mascararCpf"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.senha"
                autocomplete="new-password"
                density="compact"
                label="Senha do PJe"
                :rules="[senhaRule]"
                :type="mostrarSenha ? 'text' : 'password'"
                variant="outlined"
              >
                <template #append-inner>
                  <v-icon
                    :icon="mostrarSenha ? 'mdi-eye-off' : 'mdi-eye'"
                    style="cursor:pointer"
                    @click="mostrarSenha = !mostrarSenha"
                  />
                </template>
              </v-text-field>
            </v-col>
          </v-row>

          <div class="text-caption text-medium-emphasis mb-1">
            As credenciais são validadas contra o PJe antes de serem salvas e ficam
            armazenadas <strong>criptografadas</strong> (AES-256-GCM). A chave de
            criptografia vive apenas no ambiente do servidor — nunca no banco.
          </div>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn
          v-if="status.configured"
          color="red"
          :disabled="salvando"
          :loading="removendo"
          prepend-icon="mdi-delete-outline"
          variant="tonal"
          @click="remover"
        >
          Remover
        </v-btn>
        <v-spacer />
        <v-btn :disabled="salvando || removendo" variant="text" @click="fechar">
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          :loading="salvando"
          prepend-icon="mdi-content-save"
          @click="salvar"
        >
          Salvar e Testar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import apiClient from '@/api/axios'
import { format, parseISO } from 'date-fns'

const emit = defineEmits(['notify'])

const dialog = ref(false)
const formRef = ref(null)
const salvando = ref(false)
const removendo = ref(false)
const mostrarSenha = ref(false)
const status = reactive({ configured: false, cpfDisplay: null, atualizadoEm: null, atualizadoPorNome: null })
const form = reactive({ cpf: '', senha: '' })

const cpfRule = v => {
  const digits = String(v || '').replace(/\D/g, '')
  return digits.length === 11 || 'CPF deve ter 11 dígitos'
}
const senhaRule = v => (v && String(v).trim().length > 0) || 'Senha obrigatória'

function mascararCpf () {
  const digits = form.cpf.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 3) {
    form.cpf = digits
  } else if (digits.length <= 6) {
    form.cpf = `${digits.slice(0, 3)}.${digits.slice(3)}`
  } else if (digits.length <= 9) {
    form.cpf = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  } else {
    form.cpf = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`
  }
}

function formatarData (iso) {
  try {
    return format(parseISO(iso), 'dd/MM/yyyy HH:mm')
  } catch {
    return iso
  }
}

async function carregarStatus () {
  try {
    const { data } = await apiClient.get('/admin/pje-auth/status')
    Object.assign(status, { configured: false, cpfDisplay: null, atualizadoEm: null, atualizadoPorNome: null }, data)
  } catch {
    // status permanece com defaults
  }
}

async function abrir () {
  form.cpf = ''
  form.senha = ''
  mostrarSenha.value = false
  formRef.value?.resetValidation()
  await carregarStatus()
  dialog.value = true
}

function fechar () {
  dialog.value = false
}

async function salvar () {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  salvando.value = true
  try {
    const cpfDigits = form.cpf.replace(/\D/g, '')
    const { data } = await apiClient.post('/admin/pje-auth/salvar', { cpf: cpfDigits, senha: form.senha })
    Object.assign(status, data)
    form.senha = ''
    formRef.value?.resetValidation()
    emit('notify', 'Credenciais do PJe salvas e testadas com sucesso!', 'success')
  } catch (err) {
    emit('notify', err.response?.data?.error || 'Erro ao salvar credenciais.', 'error')
  } finally {
    salvando.value = false
  }
}

async function remover () {
  if (!window.confirm('Remover as credenciais salvas? O sistema voltará a usar as variáveis de ambiente PJE_CPF/PJE_SENHA.')) return
  removendo.value = true
  try {
    await apiClient.delete('/admin/pje-auth')
    Object.assign(status, { configured: false, cpfDisplay: null, atualizadoEm: null, atualizadoPorNome: null })
    emit('notify', 'Credenciais removidas. O sistema usará as variáveis de ambiente.', 'success')
  } catch (err) {
    emit('notify', err.response?.data?.error || 'Erro ao remover credenciais.', 'error')
  } finally {
    removendo.value = false
  }
}

defineExpose({ abrir })
</script>
