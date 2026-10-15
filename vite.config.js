import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages hosts this project under /First-Website/.
  base: '/First-Website/',
})

