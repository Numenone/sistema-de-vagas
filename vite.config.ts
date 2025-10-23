import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      srcDir: '.', // Look in the root directory
      filename: 'sw.ts', // The name of the service worker file
      devOptions: {
        enabled: true, // Enable PWA in development
      },
      manifest: {
        // Your PWA manifest options
        name: 'LinkedOut',
        short_name: 'LinkedOut',
      },
    }),
  ],
  server: {
    proxy: {
      // Redireciona requisições de API para o backend
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      // Redireciona rotas de autenticação que não estão sob /api
      '/login': { target: 'http://localhost:3001', changeOrigin: true },
      '/cadastro': { target: 'http://localhost:3001', changeOrigin: true },
      '/forgot-password': { target: 'http://localhost:3001', changeOrigin: true },
      '/reset-password': { target: 'http://localhost:3001', changeOrigin: true },
      '/pusher/auth': { target: 'http://localhost:3001', changeOrigin: true },
    },
  },
})