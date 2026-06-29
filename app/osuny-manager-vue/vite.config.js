import { fileURLToPath, URL } from 'node:url'
import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import CONFIG from './config';

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    {
      name: 'osuny-manager-server',
      async configureServer(viteServer) {
        const { app } = await import('./server/server.js')
        viteServer.middlewares.use(app)
      },
    },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap')
    },
  },
  server: {
    host: '0.0.0.0',
    port: CONFIG.SERVER_PORT,
    proxy: {
      '/api': {
        target: 'IP/URL',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
})
