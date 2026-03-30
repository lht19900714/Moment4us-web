import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { createRoutesStub } from "react-router";
import * as ReactRouter from "react-router";
import { afterEach, vi } from "vitest";

import { createFakeD1Database } from "../../../../../packages/data/src/__tests__/helpers/fake-d1";
import Root from "../../root";
import AboutRoute, { loader as aboutLoader, meta as aboutMeta } from "../about";
import ContactRoute, { loader as contactLoader } from "../contact";
import HomeRoute, { loader as homeLoader, meta as homeMeta } from "../home";
import PortfolioRoute, { loader as portfolioLoader, meta as portfolioMeta } from "../portfolio";
import ServicesRoute, { loader as servicesLoader } from "../services";

afterEach(() => {
  vi.restoreAllMocks();
});

test("home route renders the Moment4us heading", async () => {
  const data = await homeLoader({ context: {} } as never);
  vi.spyOn(ReactRouter, "useLoaderData").mockReturnValue(data);

  const Stub = createRoutesStub([
    {
      path: "/",
      Component: Root,
      children: [{ index: true, Component: HomeRoute }],
    },
  ]);
  const html = renderToString(<Stub initialEntries={["/"]} />);

  expect(html).toContain("Moment4us");
  expect(html).toContain("Warm, authentic photography");
  expect(html).toContain("Selected Stories");
  expect(html).toContain("About Moment4us");
  expect(html).toContain("What We Photograph");
  expect(html).toContain("Tell Your Story");
  expect(html).toContain("Portfolio");
  expect(html).toContain("About");
  expect(html).toContain("Services");
  expect(html).toContain("Contact");
});

test("home route exports a document title", async () => {
  const data = await homeLoader({ context: {} } as never);

  expect(homeMeta({ data } as never)).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        title: data.seo.title,
      }),
      expect.objectContaining({
        name: "description",
        content: data.seo.description,
      }),
    ]),
  );
});

test("home loader falls back to fixture content when persisted homepage layout is invalid", async () => {
  const fakeDb = createFakeD1Database();
  fakeDb.insert("site_pages", {
    slug: "home",
    title: "Broken Homepage",
    seo_title: "Broken Homepage",
    seo_description: "Broken homepage description",
    hero: "Broken homepage hero",
    sections_json: JSON.stringify([
      {
        id: "featured-portfolio",
        heading: "Broken Section",
        body: "This layout should not take the homepage down.",
      },
    ]),
    published: 1,
    seo_json: JSON.stringify({
      title: "Broken Homepage",
      description: "Broken homepage description",
      canonicalPath: "/",
    }),
  });

  const data = await homeLoader({
    context: {
      cloudflare: {
        env: {
          DB: fakeDb,
        },
      },
    },
  } as never);

  expect(data.page.title).toBe("Moment4us");
  expect(data.sections.hero.heading).toBe("Warm, authentic photography");
});

test("home loader falls back to featured project fixtures when portfolio data is invalid", async () => {
  const fakeDb = createFakeD1Database();
  fakeDb.insert("portfolio_projects", {
    slug: "broken-featured-project",
    title: "Broken Featured Project",
    category: "Wedding",
    cover_image: "broken-cover",
    summary: "Broken summary",
    story: "Broken story",
    featured: 1,
    published_at: "not-a-date",
    seo_json: null,
  });

  const data = await homeLoader({
    context: {
      cloudflare: {
        env: {
          DB: fakeDb,
        },
      },
    },
  } as never);

  expect(data.featuredProjects[0]?.slug).toBe("harbor-vows");
  expect(data.galleryItems[0]?.src).toContain("unsplash.com");
  expect(data.galleryItems[0]?.alt).toContain("Golden-hour portraits");
});

test("portfolio route renders placeholder content from loader data", () => {
  const page = portfolioLoader();
  vi.spyOn(ReactRouter, "useLoaderData").mockReturnValue(page);
  const html = renderToString(
    <ReactRouter.MemoryRouter>
      <PortfolioRoute />
    </ReactRouter.MemoryRouter>,
  );

  expect(html).toContain(page.title);
  expect(html).toContain(page.sections[0]?.heading ?? "");
});

test("about route renders editorial page content from loader data", () => {
  const data = aboutLoader();
  vi.spyOn(ReactRouter, "useLoaderData").mockReturnValue(data);
  const html = renderToString(
    <ReactRouter.MemoryRouter>
      <AboutRoute />
    </ReactRouter.MemoryRouter>,
  );

  expect(html).toContain("Stories Told in Warm Light");
  expect(html).toContain("Founded on the Belief That Every Moment Matters");
});

test("services route renders service cards and section content", () => {
  const data = servicesLoader();
  vi.spyOn(ReactRouter, "useLoaderData").mockReturnValue(data);
  const html = renderToString(
    <ReactRouter.MemoryRouter>
      <ServicesRoute />
    </ReactRouter.MemoryRouter>,
  );

  expect(html).toContain("Services");
  expect(html).toContain("Wedding &amp; Elopement");
  expect(html).toContain("How It Works");
  expect(html).toContain("Start Your Inquiry");
});

test("contact route renders starter page content from loader data", async () => {
  const page = await contactLoader({ context: {}, request: new Request("http://localhost/contact"), params: {} } as never);
  vi.spyOn(ReactRouter, "useLoaderData").mockReturnValue(page);
  vi.spyOn(ReactRouter, "useFetcher").mockReturnValue({
    state: "idle",
    data: undefined,
    Form: (props: Record<string, unknown>) => createElement("form", props),
    submit: vi.fn(),
    load: vi.fn(),
    formData: undefined,
    formAction: undefined,
    formMethod: undefined,
    formEncType: undefined,
    key: "",
    json: vi.fn(),
    text: vi.fn(),
  } as unknown as ReturnType<typeof ReactRouter.useFetcher>);
  const html = renderToString(<ContactRoute />);

  expect(html).toContain(page.title);
  expect(html).toContain("Start the conversation");
});

test("about route exports a document title", () => {
  const data = aboutLoader();
  expect(aboutMeta({ data } as never)).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        title: "About Moment4us — Our Story & Philosophy",
      }),
    ]),
  );
});

test("portfolio route exports a document title", () => {
  expect(portfolioMeta({} as never)).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        title: "Portfolio",
      }),
    ]),
  );
});
