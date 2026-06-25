// /frontend/src/composables/useSnackbar.js
// Estado e helpers do snackbar/toast com barra de progresso.
//
// O fechamento é controlado AQUI (o v-snackbar usa timeout=-1), o que permite um
// toast PERSISTENTE: ele fica aberto, com barra de progresso indeterminada, até
// o próximo notify() aparecer (de sucesso ou erro). Útil para tarefas longas.

import { ref } from 'vue'

const DEFAULT_TIMEOUT = 3000

export function useSnackbar () {
  const snackbar = ref(false)
  const snackbarText = ref('')
  const snackbarColor = ref('success')
  const snackbarTimeout = ref(DEFAULT_TIMEOUT) // mantido por compatibilidade
  const snackbarProgress = ref(100)
  const snackbarIndeterminate = ref(false)

  let progressTimer = null
  let closeTimer = null

  function clearTimers () {
    if (progressTimer) { clearInterval(progressTimer); progressTimer = null }
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null }
  }

  /**
   * Exibe uma notificação.
   * @param {string} text - Mensagem
   * @param {string} color - success | error | warning | info
   * @param {number} timeout - Duração em ms (ignorado se opts.persistent)
   * @param {{persistent?: boolean}} opts - persistent = não fecha sozinho e mostra
   *        barra indeterminada; permanece até o próximo notify().
   */
  const notify = (text, color = 'success', timeout = DEFAULT_TIMEOUT, opts = {}) => {
    clearTimers()
    snackbarText.value = text
    snackbarColor.value = color
    snackbar.value = true

    if (opts.persistent) {
      snackbarIndeterminate.value = true
      snackbarProgress.value = 100
      snackbarTimeout.value = -1
      return // sem contagem regressiva, sem auto-fechar
    }

    snackbarIndeterminate.value = false
    snackbarTimeout.value = timeout
    snackbarProgress.value = 100

    const interval = 50
    const decrement = 100 / (timeout / interval)
    progressTimer = setInterval(() => {
      snackbarProgress.value = Math.max(0, snackbarProgress.value - decrement)
      if (snackbarProgress.value <= 0) {
        clearInterval(progressTimer)
        progressTimer = null
      }
    }, interval)
    closeTimer = setTimeout(() => { snackbar.value = false }, timeout)
  }

  // Restaura os defaults e limpa timers quando o snackbar fecha.
  const onSnackbarToggle = val => {
    if (!val) {
      clearTimers()
      snackbarIndeterminate.value = false
      snackbarProgress.value = 100
      snackbarTimeout.value = DEFAULT_TIMEOUT
    }
  }

  return {
    snackbar,
    snackbarText,
    snackbarColor,
    snackbarTimeout,
    snackbarProgress,
    snackbarIndeterminate,
    notify,
    onSnackbarToggle,
  }
}
