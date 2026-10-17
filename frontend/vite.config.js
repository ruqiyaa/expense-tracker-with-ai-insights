import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth' : 'http://localhost:3000',
      '/me' : 'http://localhost:3000',
      '/categories' : 'http://localhost:3000',
      '/expenses' : 'http://localhost:3000',
      '/summary' : 'http://localhost:3000',
    },
  },
});