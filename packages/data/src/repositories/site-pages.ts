import { parseSitePage, type SitePage } from "@moment4us/content";
import { parseSlugSegment, siteDescription, siteName } from "@moment4us/shared";

import { ensureD1Client, type D1Client, type D1DatabaseLike } from "../d1/client.js";
import { parseJsonField } from "../d1/parse-json.js";

const SELECT_PAGE_BY_SLUG_SQL = `
  SELECT slug, title, seo_title, seo_description, hero, sections_json, published, seo_json
  FROM site_pages
  WHERE slug = ? AND published = 1
  LIMIT 1
`;

const SELECT_ALL_PAGES_SQL = `
  SELECT slug, title, seo_title, seo_description, hero, sections_json, published, seo_json
  FROM site_pages
  ORDER BY slug ASC
`;

const COUNT_PAGES_SQL = `
  SELECT COUNT(*) as total FROM site_pages
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

interface CountRow {
  total: number;
}

export interface SitePagesRepository {
  getPageBySlug(slug: string): Promise<SitePage | null>;
  seedHomepage(): Promise<void>;
  listPages(): Promise<SitePage[]>;
  upsertPage(page: SitePage): Promise<void>;
  countPages(): Promise<number>;
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
    async listPages(): Promise<SitePage[]> {
      const rows = await client.all<SitePageRow>(SELECT_ALL_PAGES_SQL);
      return rows.map(mapSitePageRow);
    },
    async upsertPage(page: SitePage): Promise<void> {
      const timestamp = new Date().toISOString();
      await client.run(UPSERT_PAGE_SQL, [
        page.slug,
        page.title,
        page.seoTitle,
        page.seoDescription,
        page.hero,
        JSON.stringify(page.sections),
        page.published ? 1 : 0,
        page.seo ? JSON.stringify(page.seo) : null,
        timestamp,
        timestamp,
      ]);
    },
    async countPages(): Promise<number> {
      const row = await client.first<CountRow>(COUNT_PAGES_SQL);
      return row?.total ?? 0;
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

function createHomepageSeed(): SitePage {
  return parseSitePage({
    slug: "home",
    title: siteName,
    seoTitle: `${siteName} | Photography Studio`,
    seoDescription: siteDescription,
    hero: siteDescription,
    sections: [
      {
        id: "hero",
        heading: "Warm, authentic photography",
        body: "For weddings, families, and portrait sessions that should feel calm in the moment and honest for years after.",
      },
      {
        id: "featured-portfolio",
        heading: "Selected Stories",
        body: "A small preview of recent celebrations, everyday family seasons, and portraits shaped around real connection.",
      },
      {
        id: "about-preview",
        heading: "About Moment4us",
        body: "Moment4us blends gentle direction with room for real emotion, so the gallery reflects how the day actually felt instead of forcing it into poses.",
      },
      {
        id: "services-snapshot",
        heading: "What We Photograph",
        body: "Wedding days, elopements, family sessions, maternity stories, newborn seasons, portraits, and custom editorial-style coverage.",
      },
      {
        id: "experience-process",
        heading: "A calm process from inquiry to gallery",
        body: "Simple planning, honest communication, and thoughtful pacing help every session stay grounded from the first note through final delivery.",
      },
      {
        id: "trust-signals",
        heading: "Why clients trust the experience",
        body: "Clear guidance, adaptable coverage, and photographs that stay warm and true without feeling over-directed.",
      },
      {
        id: "inquiry-cta",
        heading: "Let's Tell Your Story",
        body: "Share the date, place, and feeling you want to hold onto, and we can shape a session that fits naturally around it.",
      },
    ],
    published: true,
    seo: {
      title: `${siteName} | Photography Studio`,
      description: siteDescription,
      canonicalPath: "/",
      keywords: ["wedding photographer", "family photography", "portrait photography"],
    },
  });
}

export const sitePagesSql = {
  selectPageBySlug: SELECT_PAGE_BY_SLUG_SQL,
  selectAllPages: SELECT_ALL_PAGES_SQL,
  countPages: COUNT_PAGES_SQL,
  upsertPage: UPSERT_PAGE_SQL,
} satisfies Record<string, string>;
