import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  resolve: { alias: { "@": "/src" } },
  plugins: [vue()],
  base: "./", //process.env.NODE_ENV === "production" ? "/Distance-Incremental-Rewritten/" : "/",
});
