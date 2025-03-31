import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext', // or 'modules' for wider browser support
    chunkSizeWarningLimit: 1000, // Adjust as needed (in kBs)
    sourcemap: true, // Enable sourcemaps for debugging
  },
  esbuild: {
    logLevel: 'info', // or 'debug' for more detailed logs
    minify: false, // Turn off minification for debugging
  },
});