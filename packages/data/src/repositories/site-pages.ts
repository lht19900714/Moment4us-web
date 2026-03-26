import { parseSitePage, type SitePage } from "@moment4us/content";
import { parseSlugSegment, siteDescription, siteName } from "@moment4us/shared";

import { ensureD1Client, type D1Client, type D1DatabaseLike, type D1Value } from "../d1/client.js";

const SELECT_PAGE_BY_SLUG_SQL = `
  SELECT slug, title, seo_title, seo_description, hero, sections_json, published, seo_json
  FROM site_pages
  WHERE slug = ? AND published = 1
  LIMIT 1
`;

const UPSERT_PAGE_SQL = `
  INSERT OR REPLACE INTO site_pages (
    slug,
    title,
    seo_title,
    seo_description,
    hero,
    sections_json,
    published,
    seo_json,
    created_at,
    updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

interface SitePageRow {
  slug: string;
  title: string;
  seo_title: string;
  seo_description: string;
  hero: string;
  sections_json: string;
  published: number;
  seo_json: string | null;
}

export interface SitePagesRepository {
  getPageBySlug(slug: string): Promise<SitePage | null>;
  seedHomepage(): Promise<void>;
}

export function createSitePagesRepository(input: D1Client | D1DatabaseLike): SitePagesRepository {
  const client = ensureD1Client(input);

  return {
    async getPageBySlug(slug: string): Promise<SitePage | null> {
      const row = await client.first<SitePageRow>(SELECT_PAGE_BY_SLUG_SQL, [
        parseSlugSegment(slug, "site page slug"),
      ]);

      return row === null ? null : mapSitePageRow(row);
    },
    async seedHomepage(): Promise<void> {
      const homepage = createHomepageSeed();
      const timestamp = new Date().toISOString();

      await client.run(UPSERT_PAGE_SQL, [
        homepage.slug,
        homepage.title,
        homepage.seoTitle,
        homepage.seoDescription,
        homepage.hero,
        JSON.stringify(homepage.sections),
        homepage.published ? 1 : 0,
        JSON.stringify(homepage.seo),
        timestamp,
        timestamp,
      ]);
    },
  };
}

function mapSitePageRow(row: SitePageRow): SitePage {
  return parseSitePage({
    slug: row.slug,
    title: row.title,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    hero: row.hero,
    sections: parseJsonField(row.sections_json, "site_pages.sections_json"),
    published: row.published === 1,
    seo: row.seo_json === null ? undefined : parseJsonField(row.seo_json, "site_pages.seo_json"),
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

function createHomepageSeed(): SitePage {
  return parseSitePage({
    slug: "home",
    title: siteName,
    seoTitle: `${siteName} | Photography Studio`,
    seoDescription: siteDescription,
    hero: siteDescription,
    sections: [
      {
        id: "featured-portfolio",
        heading: "Featured stories",
        body: "A preview of the wedding, family, and portrait stories we document.",
      },
      {
        id: "services-snapshot",
        heading: "Thoughtful coverage",
        body: "Photography sessions shaped around calm pacing, clear guidance, and real moments.",
      },
    ],
    published: true,
    seo: {
      title: `${siteName} | Photography Studio`,
      description: siteDescription,
      canonicalPath: "/",
    },
  });
}

export const sitePagesSql = {
  selectPageBySlug: SELECT_PAGE_BY_SLUG_SQL,
  upsertPage: UPSERT_PAGE_SQL,
} satisfies Record<string, string>;
