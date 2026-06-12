
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // INJETADO: Força o servidor local a rodar na porta padrão que o Supabase aceita
  server: {
    port: 5173,
    strictPort: true,
    cors: true
  }
})