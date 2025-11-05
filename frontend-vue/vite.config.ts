import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: 'src/MapCe.ts',
      formats: ['es'],
      fileName: () => 'vard-assets-map.es.js'
    },
    outDir: '../frontend/public/mf',
    emptyOutDir: false
  }
})
