import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { expect, test } from "vitest";

test("global styles provide visible focus treatment for interactive links", () => {
  const currentDirectory = dirname(fileURLToPath(import.meta.url));
  const css = readFileSync(resolve(currentDirectory, "../global.css"), "utf8");

  expect(css).toContain("a:focus-visible,");
  expect(css).toMatch(/outline:\s*2px solid/);
  expect(css).toContain(".masonry-gallery__link:focus-visible");
  expect(css).toContain(".hero-section__action:focus-visible");
});
