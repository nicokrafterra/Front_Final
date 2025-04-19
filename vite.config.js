import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer' // Opcional para análisis de bundle

export default defineConfig({
  plugins: [
    vue(),
    visualizer({ // Plugin opcional para visualizar el tamaño del bundle
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  ],
  
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'assets': fileURLToPath(new URL('./src/assets', import.meta.url))
    }
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'esbuild',
    assetsInlineLimit: 4096, // Archivos menores a 4kb serán inlinados como base64
    sourcemap: process.env.NODE_ENV !== 'production', // Generar sourcemaps solo en desarrollo
    chunkSizeWarningLimit: 1000, // Aumentar límite de advertencia de tamaño
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Separar vendor chunks
            if (id.includes('vue')) {
              return 'vendor-vue'
            }
            return 'vendor'
          }
        }
      }
    }
  },

  server: {
    port: 5173,
    strictPort: true, // No buscar otros puertos si el 5173 está ocupado
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:8000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '') // Opcional: eliminar prefijo /api
      }
    }
  },

  // Configuración para manejar los warnings de assets no resueltos
  assetsInclude: ['**/*.jpg', '**/*.png', '**/*.jpeg', '**/*.gif']
})