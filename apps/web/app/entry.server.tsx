import type { AppLoadContext, EntryContext } from "react-router";
import { ServerRouter } from "react-router";
import { isbot } from "isbot";
import ReactDOMServer from "react-dom/server.browser";

const { renderToReadableStream } = ReactDOMServer;

export const streamTimeout = 5_000;

interface ReadableStreamWithAllReady extends ReadableStream {
  allReady?: Promise<void>;
}

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  _loadContext: AppLoadContext,
) {
  if (request.method.toUpperCase() === "HEAD") {
    return new Response(null, {
      headers: responseHeaders,
      status: responseStatusCode,
    });
  }

  let shellRendered = false;
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), streamTimeout + 1_000);

  try {
    const body = (await renderToReadableStream(
      <ServerRouter context={routerContext} url={request.url} />,
      {
        signal: abortController.signal,
        onError(error: unknown) {
          responseStatusCode = 500;

          if (shellRendered) {
            console.error(error);
          }
        },
      },
    )) as ReadableStreamWithAllReady;

    shellRendered = true;

    if ((request.headers.get("user-agent") && isbot(request.headers.get("user-agent"))) || routerContext.isSpaMode) {
      await body.allReady;
    }

    responseHeaders.set("Content-Type", "text/html");

    return new Response(body, {
      headers: responseHeaders,
      status: responseStatusCode,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}
