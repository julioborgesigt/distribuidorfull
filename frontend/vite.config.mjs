// /fronted/vite.config.mjs (Corrigido)

// Plugins
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
// import Fonts from 'unplugin-fonts/vite' // Removido - usando @fontsource diretamente
import Layouts from 'vite-plugin-vue-layouts-next'
import Vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueRouter(),
    Layouts(),
    Vue({
      template: { transformAssetUrls },
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    Vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/settings.scss',
      },
    }),
    Components(),
    // Fonts plugin removido - usando @fontsource/roboto diretamente no main.js
    AutoImport({
      imports: [
        'vue',
        VueRouterAutoImports,
        {
          pinia: ['defineStore', 'storeToRefs'],
        },
      ],
      eslintrc: {
        enabled: true,
      },
      vueTemplate: true,
    }),
  ],
  optimizeDeps: {
    // Desabilita o pre-bundling de deps (que usa esbuild.Build() e causa deadlock no ARM64)
    noDiscovery: true,
    include: [],
    exclude: [
      'vuetify',
      'vue-router',
      'unplugin-vue-router/runtime',
      'unplugin-vue-router/data-loaders',
      'unplugin-vue-router/data-loaders/basic',
    ],
  },
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },

  // --- SEÇÃO CORRIGIDA ---
  build: {
    // Desabilita minificação por esbuild para evitar deadlock no ARM64
    minify: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-vue': ['vue', 'vue-router', 'pinia'],
          'vendor-vuetify': ['vuetify'],
          'vendor-charts': ['chart.js', 'vue-chartjs'],
          'vendor-utils': ['axios', 'date-fns'],
          'vendor-pdf': ['jspdf', 'jspdf-autotable'],
        }
      }
    }
  },

  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Backend local em desenvolvimento
        changeOrigin: true,
      }
    }
  },
  // --- FIM DA SEÇÃO ---
})