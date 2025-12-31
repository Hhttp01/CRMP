import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // הגדרה זו קריטית עבור GitHub Pages ושרתים סטטיים
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // משפר ביצועים בטעינה סטטית
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'lucide-react'],
        },
      },
    },
  },
})
