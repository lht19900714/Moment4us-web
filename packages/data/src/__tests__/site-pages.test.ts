import { expect, test } from "vitest";

import { createFakeD1Database } from "./helpers/fake-d1";
import { createSitePagesRepository } from "../repositories/site-pages";

test("getPageBySlug returns homepage content", async () => {
  const fakeDb = createFakeD1Database();
  const repo = createSitePagesRepository(fakeDb);

  await repo.seedHomepage();

  const page = await repo.getPageBySlug("home");

  expect(page?.slug).toBe("home");
  expect(page?.sections[0]?.id).toBe("hero");
});
