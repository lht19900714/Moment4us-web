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

export interface PortfolioProjectsRepository {
  getProjectBySlug(slug: string): Promise<PortfolioProject | null>;
  listFeaturedProjects(limit?: number): Promise<PortfolioProject[]>;
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
} satisfies Record<string, string>;
