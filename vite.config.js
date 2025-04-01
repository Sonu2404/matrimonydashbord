export default defineConfig({
  plugins: [react()],
  base: './',
  esbuild: {
    target: 'esnext', // Ensure modern JavaScript support
  },
});
