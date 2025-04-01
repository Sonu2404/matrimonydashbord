import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/", // Ensure assets load correctly
  server: {
    port: 3000,
    open: true, // Automatically open browser on local run
  },
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 2000,
  },
});
