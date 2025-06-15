import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  
  plugins: [react(),tailwindcss()],
  build: {
    
    target: 'esnext',
    rollupOptions: {
      // empty, but keeps it from using native modules
    },
    outDir: 'dist',  // This will place the build output in the public folder of Firebase Hosting
    
  },
})

