import { afterEach, expect, test, vi } from "vitest";

const renderToReadableStream = vi.fn();

vi.mock("react-dom/server.browser", () => ({
  default: {
    renderToReadableStream,
  },
}));

test("entry server renders html with a readable stream response", async () => {
  const stream = new ReadableStream();
  Object.assign(stream, {
    allReady: Promise.resolve(),
  });
  renderToReadableStream.mockResolvedValue(stream);

  const module = await import("../entry.server");
  const response = await module.default(
    new Request("https://moment4us.test/"),
    200,
    new Headers(),
    { isSpaMode: false } as never,
    {} as never,
  );

  expect(response.status).toBe(200);
  expect(response.headers.get("Content-Type")).toBe("text/html");
  expect(renderToReadableStream).toHaveBeenCalledTimes(1);
});
