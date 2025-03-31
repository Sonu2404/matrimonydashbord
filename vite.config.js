import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: './src/index.js' // Replace with your actual entry file path
    }
  }
});