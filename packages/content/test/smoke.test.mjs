import test from "node:test";
import assert from "node:assert/strict";
import {
  homepageSectionOrder,
  parseBlogPost,
  parseHomepageSections,
  parseLead,
  parsePortfolioProject,
  parseSitePage,
} from "../dist/index.js";

test("content package build exports homepage parser contracts", () => {
  assert.deepEqual(parseHomepageSections(homepageSectionOrder), homepageSectionOrder);
  assert.throws(() => parseHomepageSections(["hero"]), /must include 7 sections/i);
});

test("content package lead parser works via built package exports", () => {
  const lead = parseLead({
    id: "lead-1",
    type: "contact",
    name: "Ava Client",
    email: "ava@example.com",
    serviceType: "wedding",
    message: "Need a quote",
    status: "new",
    createdAt: "2026-03-26T00:00:00.000Z",
  });

  assert.equal(lead.type, "contact");
  assert.equal(lead.status, "new");
});

test("content package site page parser works via built package exports", () => {
  const page = parseSitePage({
    slug: "about",
    title: "About",
    seoTitle: "About Moment4us",
    seoDescription: "About page",
    hero: "Hero copy",
    sections: [{ id: "mission", heading: "Mission", body: "Body copy" }],
    published: true,
  });

  assert.equal(page.slug, "about");
  assert.equal(page.sections[0]?.id, "mission");
});

test("content package portfolio project parser works via built package exports", () => {
  const project = parsePortfolioProject({
    slug: "city-elopement",
    title: "City Elopement",
    category: "elopement",
    coverImage: "/cover.jpg",
    galleryImages: ["/1.jpg", "/2.jpg"],
    summary: "Summary",
    story: "Story",
    featured: true,
    publishedAt: "2026-03-26",
  });

  assert.equal(project.slug, "city-elopement");
  assert.equal(project.publishedAt, "2026-03-26");
});

test("content package blog post parser works via built package exports", () => {
  const post = parseBlogPost({
    slug: "how-we-shoot",
    title: "How We Shoot",
    excerpt: "Excerpt",
    coverImage: "/cover.jpg",
    content: "Long form copy",
    tags: ["guide", "workflow"],
    publishedAt: "2026-03-26",
  });

  assert.equal(post.slug, "how-we-shoot");
  assert.deepEqual(post.tags, ["guide", "workflow"]);
});
