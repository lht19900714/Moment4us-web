import { expect, test } from "vitest";

import { createFakeD1Database } from "./helpers/fake-d1";
import { createPortfolioProjectsRepository } from "../repositories/portfolio-projects";

test("listFeaturedProjects returns featured projects ordered by published date", async () => {
  const fakeDb = createFakeD1Database();
  fakeDb.insert("portfolio_projects", {
    slug: "city-elopement",
    title: "City Elopement",
    category: "elopement",
    cover_image: "cover-city",
    summary: "A city story",
    story: "Story",
    featured: 1,
    published_at: "2026-03-20",
    seo_json: JSON.stringify({
      title: "City Elopement",
      description: "Downtown wedding story",
    }),
  });
  fakeDb.insert("portfolio_projects", {
    slug: "mountain-vows",
    title: "Mountain Vows",
    category: "wedding",
    cover_image: "cover-mountain",
    summary: "A mountain story",
    story: "Story",
    featured: 1,
    published_at: "2026-03-25",
    seo_json: null,
  });
  fakeDb.insert("portfolio_projects", {
    slug: "studio-portraits",
    title: "Studio Portraits",
    category: "portrait",
    cover_image: "cover-studio",
    summary: "A portrait story",
    story: "Story",
    featured: 0,
    published_at: "2026-03-26",
    seo_json: null,
  });
  fakeDb.insert("portfolio_images", {
    id: "img-1",
    project_slug: "mountain-vows",
    image_id: "mountain-1",
    sort_order: 2,
  });
  fakeDb.insert("portfolio_images", {
    id: "img-2",
    project_slug: "mountain-vows",
    image_id: "mountain-0",
    sort_order: 1,
  });

  const repo = createPortfolioProjectsRepository(fakeDb);

  const projects = await repo.listFeaturedProjects(2);

  expect(projects).toHaveLength(2);
  expect(projects[0]?.slug).toBe("mountain-vows");
  expect(projects[0]?.galleryImages).toEqual(["mountain-0", "mountain-1"]);
  expect(projects[1]?.slug).toBe("city-elopement");
});

test("getProjectBySlug returns null when the project is missing", async () => {
  const repo = createPortfolioProjectsRepository(createFakeD1Database());

  await expect(repo.getProjectBySlug("missing-project")).resolves.toBeNull();
});
