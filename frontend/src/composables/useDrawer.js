import { ref } from 'vue'

// Estado global singleton: compartilhado entre default.vue e dashboard.vue
const drawerOpen = ref(false)

// Largura do drawer (dashboard.vue) — fonte única, também usada por
// default.vue para deslocar o app-bar na mesma medida quando o drawer
// empurra o conteúdo (telas largas). Mudou aqui, muda nos dois lugares.
export const DRAWER_WIDTH = 230

export function useDrawer () {
  return { drawerOpen }
}
