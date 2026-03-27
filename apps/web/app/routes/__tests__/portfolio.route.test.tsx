import { renderToString } from "react-dom/server";
import * as ReactRouter from "react-router";
import { afterEach, vi } from "vitest";

import PortfolioProjectRoute, {
  loader as portfolioProjectLoader,
  meta as portfolioProjectMeta,
} from "../portfolio.$slug";
import PortfolioRoute, { loader as portfolioLoader, meta as portfolioMeta } from "../portfolio";

afterEach(() => {
  vi.restoreAllMocks();
});

test("portfolio route renders selected stories and masonry cards", async () => {
  const data = await portfolioLoader({ context: {} } as never);
  vi.spyOn(ReactRouter, "useLoaderData").mockReturnValue(data);

  const html = renderToString(
    <ReactRouter.MemoryRouter>
      <PortfolioRoute />
    </ReactRouter.MemoryRouter>,
  );

  expect(html).toContain("Selected Stories");
  expect(html).toContain("View Story");
  expect(html).toContain("/portfolio/harbor-vows");
  expect(html).toContain("masonry-gallery");
  expect(html).toContain("data-discover=\"true\"");
});

test("portfolio route exports SEO meta descriptors", async () => {
  const data = await portfolioLoader({ context: {} } as never);

  expect(portfolioMeta({ data } as never)).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ title: data.seo.title }),
      expect.objectContaining({ name: "description", content: data.seo.description }),
      expect.objectContaining({ rel: "canonical", href: data.seo.canonical }),
    ]),
  );
});

test("portfolio listing loader uses cover images for story cards", async () => {
  const data = await portfolioLoader({ context: {} } as never);

  expect(data.galleryItems[0]?.src).toContain("unsplash.com");
  expect(data.galleryItems[0]?.alt).toContain("Golden-hour portraits");
});

test("portfolio project route renders hero, story sequence, and contact CTA", async () => {
  const data = await portfolioProjectLoader({
    context: {},
    params: { slug: "harbor-vows" },
  } as never);
  vi.spyOn(ReactRouter, "useLoaderData").mockReturnValue(data);

  const html = renderToString(
    <ReactRouter.MemoryRouter>
      <PortfolioProjectRoute />
    </ReactRouter.MemoryRouter>,
  );

  expect(html).toContain(data.project.title);
  expect(html).toContain(data.project.summary);
  expect(html).toContain(data.project.story);
  expect(html).toContain("Editorial Sequence");
  expect(html).toContain("/contact");
});

test("portfolio project route exports project-specific SEO metadata", async () => {
  const data = await portfolioProjectLoader({
    context: {},
    params: { slug: "harbor-vows" },
  } as never);

  expect(portfolioProjectMeta({ data } as never)).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ title: data.seo.title }),
      expect.objectContaining({ name: "description", content: data.seo.description }),
      expect.objectContaining({ rel: "canonical", href: data.seo.canonical }),
    ]),
  );
});

test("portfolio project loader uses the cover image for the hero and social metadata", async () => {
  const data = await portfolioProjectLoader({
    context: {},
    params: { slug: "harbor-vows" },
  } as never);

  expect(data.heroImage.src).toContain("unsplash.com");
  expect(data.heroImage.alt).toContain(data.project.summary);
  expect(data.editorialImages[0]?.alt).toContain(data.project.story);

  expect(portfolioProjectMeta({ data } as never)).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ property: "og:image", content: data.heroImage.src }),
      expect.objectContaining({ name: "twitter:image", content: data.heroImage.src }),
    ]),
  );
});
