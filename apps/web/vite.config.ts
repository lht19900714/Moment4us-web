import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  plugins: mode === "test" ? [] : [cloudflare({ viteEnvironment: { name: "ssr" } }), reactRouter()],
  server: {
    host: "0.0.0.0",
  },
  test: {
    globals: true,
  },
}));
