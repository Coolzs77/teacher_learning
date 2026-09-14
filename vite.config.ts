import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // 保证在任何静态目录 (根目录, docs, gh-pages) 下相对路径均正常加载
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/pdfjs-dist')) {
            return 'pdfjs-vendor';
          }
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'lucide-vendor';
          }
          if (id.includes('node_modules/canvas-confetti')) {
            return 'confetti-vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 2500
  },
  server: {
    port: 5173,
    open: false
  }
})
