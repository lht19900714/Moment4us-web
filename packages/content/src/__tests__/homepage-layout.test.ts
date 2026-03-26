import { expect, test } from "vitest";

import { parseBlogPost } from "../blog-post";
import { parseHomepageSections } from "../homepage-layout";
import { parseLead } from "../lead";
import { parsePortfolioProject } from "../portfolio-project";
import { parseSitePage } from "../site-page";

test("homepage layout requires the approved section order", () => {
  expect(() => parseHomepageSections(["hero", "about", "cta"])).toThrow(
    /featured-portfolio/,
  );
});

test("homepage layout accepts the approved section order", () => {
  expect(
    parseHomepageSections([
      "hero",
      "featured-portfolio",
      "about-preview",
      "services-snapshot",
      "experience-process",
      "trust-signals",
      "inquiry-cta",
    ]),
  ).toEqual([
    "hero",
    "featured-portfolio",
    "about-preview",
    "services-snapshot",
    "experience-process",
    "trust-signals",
    "inquiry-cta",
  ]);
});

test("homepage layout reports schema error when input is not an array", () => {
  expect(() => parseHomepageSections("hero" as unknown as readonly string[])).toThrow(
    /must be an array/i,
  );
});

test("portfolio project requires ISO date format for publishedAt", () => {
  expect(() =>
    parsePortfolioProject({
      slug: "city-elopement",
      title: "City Elopement",
      category: "elopement",
      coverImage: "/cover.jpg",
      galleryImages: ["/1.jpg", "/2.jpg"],
      summary: "Summary",
      story: "Story",
      featured: true,
      publishedAt: "not-a-date",
    }),
  ).toThrow(/portfolio project\.publishedAt must be a valid ISO date string/i);
});

test("blog post requires ISO date format for publishedAt", () => {
  expect(() =>
    parseBlogPost({
      slug: "how-we-shoot",
      title: "How We Shoot",
      excerpt: "Excerpt",
      coverImage: "/cover.jpg",
      content: "Long form copy",
      tags: ["guide"],
      publishedAt: "03-26-2026",
    }),
  ).toThrow(/blog post\.publishedAt must be a valid ISO date string/i);
});

test("lead requires ISO date format for createdAt and eventDate", () => {
  expect(() =>
    parseLead({
      id: "lead-1",
      type: "booking",
      name: "Ava Client",
      email: "ava@example.com",
      serviceType: "wedding",
      message: "Need a quote",
      status: "new",
      createdAt: "yesterday",
      eventDate: "2026/05/01",
    }),
  ).toThrow(/lead\.createdAt must be a valid ISO date string/i);
});

test("lead requires ISO date format for eventDate", () => {
  expect(() =>
    parseLead({
      id: "lead-2",
      type: "booking",
      name: "Ava Client",
      email: "ava@example.com",
      serviceType: "wedding",
      message: "Need a quote",
      status: "new",
      createdAt: "2026-03-26T00:00:00.000Z",
      eventDate: "May 1, 2026",
    }),
  ).toThrow(/lead\.eventDate must be a valid ISO date string/i);
});

test("lead rejects impossible ISO datetime values", () => {
  expect(() =>
    parseLead({
      id: "lead-3",
      type: "booking",
      name: "Ava Client",
      email: "ava@example.com",
      serviceType: "wedding",
      message: "Need a quote",
      status: "new",
      createdAt: "2026-02-30T00:00:00Z",
    }),
  ).toThrow(/lead\.createdAt must be a valid ISO date string/i);
});

test("lead rejects obviously invalid email values", () => {
  expect(() =>
    parseLead({
      id: "lead-4",
      type: "contact",
      name: "Ava Client",
      email: "@",
      serviceType: "wedding",
      message: "Need a quote",
      status: "new",
      createdAt: "2026-03-26T00:00:00.000Z",
    }),
  ).toThrow(/lead\.email must be a valid email/i);

  expect(() =>
    parseLead({
      id: "lead-5",
      type: "contact",
      name: "Ava Client",
      email: "name@",
      serviceType: "wedding",
      message: "Need a quote",
      status: "new",
      createdAt: "2026-03-26T00:00:00.000Z",
    }),
  ).toThrow(/lead\.email must be a valid email/i);
});

test("content schemas reject multi-segment slugs", () => {
  expect(() =>
    parsePortfolioProject({
      slug: "stories/city-elopement",
      title: "City Elopement",
      category: "elopement",
      coverImage: "/cover.jpg",
      galleryImages: ["/1.jpg", "/2.jpg"],
      summary: "Summary",
      story: "Story",
      featured: true,
      publishedAt: "2026-03-26",
    }),
  ).toThrow(/portfolio project\.slug must be a single path segment/i);

  expect(() =>
    parseBlogPost({
      slug: "blog/how-we-shoot",
      title: "How We Shoot",
      excerpt: "Excerpt",
      coverImage: "/cover.jpg",
      content: "Long form copy",
      tags: ["guide"],
      publishedAt: "2026-03-26",
    }),
  ).toThrow(/blog post\.slug must be a single path segment/i);

  expect(() =>
    parseSitePage({
      slug: "pages/about",
      title: "About",
      seoTitle: "About Moment4us",
      seoDescription: "About page",
      hero: "Hero copy",
      sections: [{ id: "mission", heading: "Mission", body: "Body copy" }],
      published: true,
    }),
  ).toThrow(/site page\.slug must be a single path segment/i);
});
