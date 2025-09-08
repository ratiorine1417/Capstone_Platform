import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5183,
    proxy: {
      // 백엔드가 /api/* 와 /auth/* 를 쓰므로 둘 다 8080으로 프록시
      '^/(api|auth)/.*': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false, // http 타깃이면 무해. self-signed https일 때만 꼭 필요
      },
    },
  },
})
