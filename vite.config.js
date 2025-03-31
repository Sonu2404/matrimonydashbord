export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['pdfkit']
  }
});
