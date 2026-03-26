import { reactRouter } from "@react-router/dev/vite";
import { cloudflareDevProxy } from "@react-router/dev/vite/cloudflare";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  plugins: mode === "test" ? [] : [cloudflareDevProxy(), reactRouter()],
  server: {
    host: "127.0.0.1",
  },
  test: {
    globals: true,
  },
}));
