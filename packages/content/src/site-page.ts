import { parseSlugSegment, type SeoMetadata } from "@moment4us/shared";
import { parseBoolean, parseRecord, parseString, parseStringArray, parseSeo } from "./parsers.js";

export interface SitePageSection {
  id: string;
  heading: string;
  body: string;
}

export interface SitePage {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  hero: string;
  sections: SitePageSection[];
  published: boolean;
  seo?: SeoMetadata;
}

export function parseSitePage(input: unknown): SitePage {
  const value = parseRecord(input, "site page");

  const sitePage: SitePage = {
    slug: parseSlugSegment(value.slug, "site page.slug"),
    title: parseString(value.title, "site page.title"),
    seoTitle: parseString(value.seoTitle, "site page.seoTitle"),
    seoDescription: parseString(value.seoDescription, "site page.seoDescription"),
    hero: parseString(value.hero, "site page.hero"),
    sections: parseSections(value.sections),
    published: parseBoolean(value.published, "site page.published"),
  };

  if (value.seo !== undefined) {
    sitePage.seo = parseSeo(value.seo, "site page.seo");
  }

  return sitePage;
}

function parseSections(input: unknown): SitePageSection[] {
  if (!Array.isArray(input)) {
    throw new Error("site page.sections must be an array");
  }

  return input.map((item, index) => {
    const section = parseRecord(item, `site page.sections[${index}]`);
    return {
      id: parseString(section.id, `site page.sections[${index}].id`),
      heading: parseString(section.heading, `site page.sections[${index}].heading`),
      body: parseString(section.body, `site page.sections[${index}].body`),
    };
  });
}
