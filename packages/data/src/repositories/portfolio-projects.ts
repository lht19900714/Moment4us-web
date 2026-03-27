import { parsePortfolioProject, type PortfolioProject } from "@moment4us/content";
import { parseSlugSegment } from "@moment4us/shared";

import { ensureD1Client, type D1Client, type D1DatabaseLike } from "../d1/client.js";

const SELECT_PROJECT_BY_SLUG_SQL = `
  SELECT slug, title, category, cover_image, summary, story, featured, published_at, seo_json
  FROM portfolio_projects
  WHERE slug = ?
  LIMIT 1
`;

const SELECT_FEATURED_PROJECTS_SQL = `
  SELECT slug, title, category, cover_image, summary, story, featured, published_at, seo_json
  FROM portfolio_projects
  WHERE featured = 1
  ORDER BY published_at DESC
  LIMIT ?
`;

const SELECT_ALL_PROJECTS_SQL = `
  SELECT slug, title, category, cover_image, summary, story, featured, published_at, seo_json
  FROM portfolio_projects
  ORDER BY published_at DESC
`;

const UPSERT_PROJECT_SQL = `
  INSERT OR REPLACE INTO portfolio_projects (
    slug, title, category, cover_image, summary, story, featured, published_at, seo_json, created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const DELETE_PROJECT_SQL = `
  DELETE FROM portfolio_projects
  WHERE slug = ?
`;

const DELETE_PROJECT_IMAGES_SQL = `
  DELETE FROM portfolio_images
  WHERE project_slug = ?
`;

const INSERT_PROJECT_IMAGE_SQL = `
  INSERT INTO portfolio_images (id, project_slug, image_id, sort_order, created_at)
  VALUES (?, ?, ?, ?, ?)
`;

const COUNT_PROJECTS_SQL = `
  SELECT COUNT(*) as total FROM portfolio_projects
`;

const SELECT_PROJECT_IMAGES_SQL = `
  SELECT image_id
  FROM portfolio_images
  WHERE project_slug = ?
  ORDER BY sort_order ASC
`;

interface PortfolioProjectRow {
  slug: string;
  title: string;
  category: string;
  cover_image: string;
  summary: string;
  story: string;
  featured: number;
  published_at: string;
  seo_json: string | null;
}

interface PortfolioImageRow {
  image_id: string;
}

interface CountRow {
  total: number;
}

export interface PortfolioProjectsRepository {
  getProjectBySlug(slug: string): Promise<PortfolioProject | null>;
  listFeaturedProjects(limit?: number): Promise<PortfolioProject[]>;
  listAllProjects(): Promise<PortfolioProject[]>;
  upsertProject(project: PortfolioProject): Promise<void>;
  deleteProject(slug: string): Promise<void>;
  countProjects(): Promise<number>;
}

export function createPortfolioProjectsRepository(
  input: D1Client | D1DatabaseLike,
): PortfolioProjectsRepository {
  const client = ensureD1Client(input);

  return {
    async getProjectBySlug(slug: string): Promise<PortfolioProject | null> {
      const normalizedSlug = parseSlugSegment(slug, "portfolio project slug");
      const row = await client.first<PortfolioProjectRow>(SELECT_PROJECT_BY_SLUG_SQL, [normalizedSlug]);

      return row === null ? null : mapPortfolioProjectRow(client, row);
    },
    async listFeaturedProjects(limit = 3): Promise<PortfolioProject[]> {
      if (!Number.isInteger(limit) || limit < 1) {
        throw new Error("featured projects limit must be a positive integer");
      }

      const rows = await client.all<PortfolioProjectRow>(SELECT_FEATURED_PROJECTS_SQL, [limit]);

      return Promise.all(rows.map((row) => mapPortfolioProjectRow(client, row)));
    },
    async listAllProjects(): Promise<PortfolioProject[]> {
      const rows = await client.all<PortfolioProjectRow>(SELECT_ALL_PROJECTS_SQL);
      return Promise.all(rows.map((row) => mapPortfolioProjectRow(client, row)));
    },
    async upsertProject(project: PortfolioProject): Promise<void> {
      const timestamp = new Date().toISOString();
      await client.run(UPSERT_PROJECT_SQL, [
        project.slug,
        project.title,
        project.category,
        project.coverImage,
        project.summary,
        project.story,
        project.featured ? 1 : 0,
        project.publishedAt,
        project.seo ? JSON.stringify(project.seo) : null,
        timestamp,
        timestamp,
      ]);

      // Replace gallery images
      await client.run(DELETE_PROJECT_IMAGES_SQL, [project.slug]);

      for (let i = 0; i < project.galleryImages.length; i++) {
        const imageId = project.galleryImages[i];
        if (imageId !== undefined) {
          const imageRowId = `${project.slug}-img-${i}`;
          await client.run(INSERT_PROJECT_IMAGE_SQL, [imageRowId, project.slug, imageId, i, timestamp]);
        }
      }
    },
    async deleteProject(slug: string): Promise<void> {
      const normalizedSlug = parseSlugSegment(slug, "portfolio project slug");
      await client.run(DELETE_PROJECT_IMAGES_SQL, [normalizedSlug]);
      await client.run(DELETE_PROJECT_SQL, [normalizedSlug]);
    },
    async countProjects(): Promise<number> {
      const row = await client.first<CountRow>(COUNT_PROJECTS_SQL);
      return row?.total ?? 0;
    },
  };
}

async function mapPortfolioProjectRow(
  client: D1Client,
  row: PortfolioProjectRow,
): Promise<PortfolioProject> {
  const imageRows = await client.all<PortfolioImageRow>(SELECT_PROJECT_IMAGES_SQL, [row.slug]);

  return parsePortfolioProject({
    slug: row.slug,
    title: row.title,
    category: row.category,
    coverImage: row.cover_image,
    galleryImages: imageRows.map((image) => image.image_id),
    summary: row.summary,
    story: row.story,
    featured: row.featured === 1,
    publishedAt: row.published_at,
    seo: row.seo_json === null ? undefined : parseJsonField(row.seo_json, "portfolio_projects.seo_json"),
  });
}

function parseJsonField<T>(value: string, fieldName: string): T {
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    throw new Error(
      `${fieldName} must contain valid JSON: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}

export const portfolioProjectsSql = {
  selectProjectBySlug: SELECT_PROJECT_BY_SLUG_SQL,
  selectFeaturedProjects: SELECT_FEATURED_PROJECTS_SQL,
  selectProjectImages: SELECT_PROJECT_IMAGES_SQL,
  selectAllProjects: SELECT_ALL_PROJECTS_SQL,
  upsertProject: UPSERT_PROJECT_SQL,
  deleteProject: DELETE_PROJECT_SQL,
  deleteProjectImages: DELETE_PROJECT_IMAGES_SQL,
  insertProjectImage: INSERT_PROJECT_IMAGE_SQL,
  countProjects: COUNT_PROJECTS_SQL,
} satisfies Record<string, string>;
