import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // 保证在任何静态目录 (根目录, docs, gh-pages) 下相对路径均正常加载
  server: {
    port: 5173,
    open: false
  }
})
