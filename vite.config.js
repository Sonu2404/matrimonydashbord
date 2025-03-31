import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    minify: false, // Disable minification to avoid esbuild issues
    sourcemap: true // Generate source maps for debugging
  }
});