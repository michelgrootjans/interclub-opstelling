import { defineConfig } from 'vite'

export default defineConfig({
  base: '/interclub-opstelling/',
  build: {
    target: 'es2022',
  },
  test: {
    environment: 'node',
  },
})
