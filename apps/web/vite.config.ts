import path from "node:path";

import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  plugins: mode === "test" ? [] : [cloudflare({ viteEnvironment: { name: "ssr" } }), reactRouter()],
  resolve: {
    alias: {
      "@moment4us/shared": path.resolve(__dirname, "../../packages/shared/src/index.ts"),
      "@moment4us/content": path.resolve(__dirname, "../../packages/content/src/index.ts"),
      "@moment4us/data": path.resolve(__dirname, "../../packages/data/src/index.ts"),
    },
  },
  server: {
    host: "0.0.0.0",
  },
  test: {
    globals: true,
  },
}));
