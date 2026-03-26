import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { expect, test, vi } from "vitest";

const requestHandler = vi.fn();
const createRequestHandler = vi.fn(() => requestHandler);

vi.mock("react-router", () => ({
  createRequestHandler,
}));

vi.mock("virtual:react-router/server-build", () => ({}));

test("wrangler config points at the app worker entry", () => {
  const config = readFileSync(resolve(process.cwd(), "wrangler.jsonc"), "utf8");

  expect(config).toContain("\"main\": \"./workers/app.ts\"");
});

test("react-router config enables the Cloudflare Vite environment API", () => {
  const config = readFileSync(resolve(process.cwd(), "react-router.config.ts"), "utf8");

  expect(config).toContain("v8_viteEnvironmentApi: true");
});

test("worker entry delegates fetch requests to React Router", async () => {
  requestHandler.mockResolvedValue(new Response("ok"));

  const module = await import("../app");
  const request = new Request("https://moment4us.test/");
  const env = { ASSET_HOST: "local" };
  const ctx = { waitUntil: vi.fn() };

  const response = await module.default.fetch(request, env as never, ctx as never);

  expect(response.status).toBe(200);
  expect(requestHandler).toHaveBeenCalledWith(request, {
    cloudflare: { env, ctx },
  });
  expect(createRequestHandler).toHaveBeenCalledWith(expect.any(Function), "test");
});
