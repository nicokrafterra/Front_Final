import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(({ mode }) => {
  // Cargar TODAS las variables de entorno (no solo las prefijadas con VITE_)
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(),
      vueDevTools(),
    ],
    // Configuración de resolución de rutas
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~assets': fileURLToPath(new URL('./src/assets', import.meta.url))
    }
  },

  // Configuración para producción
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false, // Cambiar a true en desarrollo si necesitas debug
    minify: 'esbuild', // Usa esbuild que viene con Vite
    assetsInlineLimit: 4096, // 4KB - archivos más pequeños se convierten en base64
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        manualChunks: {
          vue: ['vue', 'vue-router', 'pinia'],
          vendor: ['axios', 'lodash']
        }
      }
    }
  },

    server: {
      cors: true,
      host: true, // Permite conexiones desde la red local
      port: parseInt(env.PORT) || 5173, // Usa el PORT del .env
      strictPort: true,
      proxy: {
        '/api': {
          target: env.VITE_API_URL, // Usa directamente la variable de entorno
          changeOrigin: true,
          secure: mode === 'production', // HTTPS en producción
          rewrite: (path) => path.replace(/^\/api/, ''),
          ws: true
        }
      }
    },
    base: env.VITE_BASE_PATH || '/', // Usa la base path del .env
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: env.VITE_APP_MODE === 'development',
      minify: mode === 'production' ? 'terser' : false,
    },
    preview: {
      port: parseInt(env.PORT) || 5173,
      host: true
    }
  }
})