import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";

export default defineConfig({
  resolve: { alias: { "@": "/src" } },
  plugins: [
    vue({ template: { transformAssetUrls } }),
    quasar({ sassVariables: "src/quasar-variables.sass" }),
  ],
  base: "./", //process.env.NODE_ENV === "production" ? "/Distance-Incremental-Rewritten/" : "/",
});
