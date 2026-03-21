import { ref } from 'vue';

// Estado global singleton: compartilhado entre default.vue e dashboard.vue
const drawerOpen = ref(false);

export function useDrawer() {
  return { drawerOpen };
}
