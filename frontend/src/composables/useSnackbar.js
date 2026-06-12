// /frontend/src/composables/useSnackbar.js
// Estado e helpers do snackbar/toast com barra de progresso

import { ref, watch } from 'vue'

const DEFAULT_TIMEOUT = 3000

export function useSnackbar () {
  const snackbar = ref(false)
  const snackbarText = ref('')
  const snackbarColor = ref('success')
  const snackbarTimeout = ref(DEFAULT_TIMEOUT)
  const snackbarProgress = ref(100)
  let snackbarTimer = null

  // Anima a barra de progresso enquanto o snackbar está visível
  watch(snackbar, val => {
    if (snackbarTimer) {
      clearInterval(snackbarTimer)
    }
    if (val) {
      snackbarProgress.value = 100
      const interval = 50
      const decrement = 100 / (snackbarTimeout.value / interval)
      snackbarTimer = setInterval(() => {
        snackbarProgress.value = Math.max(0, snackbarProgress.value - decrement)
        if (snackbarProgress.value <= 0) {
          clearInterval(snackbarTimer)
        }
      }, interval)
    } else {
      snackbarProgress.value = 100
    }
  })

  /**
   * Exibe uma notificação.
   * @param {string} text - Mensagem
   * @param {string} color - success | error | warning | info
   * @param {number} timeout - Duração em ms
   */
  const notify = (text, color = 'success', timeout = DEFAULT_TIMEOUT) => {
    snackbarText.value = text
    snackbarColor.value = color
    snackbarTimeout.value = timeout
    snackbar.value = true
  }

  // Restaura os defaults quando o snackbar fecha
  const onSnackbarToggle = val => {
    if (!val) {
      snackbarTimeout.value = DEFAULT_TIMEOUT
      snackbarProgress.value = 100
    }
  }

  return {
    snackbar,
    snackbarText,
    snackbarColor,
    snackbarTimeout,
    snackbarProgress,
    notify,
    onSnackbarToggle,
  }
}
