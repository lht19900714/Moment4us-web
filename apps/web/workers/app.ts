import { createRequestHandler, type ServerBuild } from "react-router";

interface WorkerExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException?(): void;
}

const handleRequest = createRequestHandler(
  () => import("virtual:react-router/server-build") as Promise<ServerBuild>,
  import.meta.env.MODE,
);

export default {
  fetch(request: Request, env: Env, ctx: WorkerExecutionContext) {
    return handleRequest(request, {
      cloudflare: {
        env,
        ctx,
      },
    });
  },
};
