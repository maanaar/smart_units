import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    proxy: {
      '/smart_unit': {
        target: 'http://localhost:8077',
        changeOrigin: true,
      },
      '/id_scanner': {
        target: 'http://209.38.41.253:8006',
        changeOrigin: true,
      },
    }
  }
})

