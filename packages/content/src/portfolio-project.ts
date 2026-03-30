import {
  parseISODateString,
  parseSlugSegment,
  type ISODateString,
  type SeoMetadata,
} from "@moment4us/shared";
import { parseBoolean, parseRecord, parseString, parseStringArray, parseSeo } from "./parsers.js";

export interface PortfolioProject {
  slug: string;
  title: string;
  category: string;
  coverImage: string;
  galleryImages: string[];
  summary: string;
  story: string;
  featured: boolean;
  publishedAt: ISODateString;
  seo?: SeoMetadata;
}

export function parsePortfolioProject(input: unknown): PortfolioProject {
  const value = parseRecord(input, "portfolio project");

  const project: PortfolioProject = {
    slug: parseSlugSegment(value.slug, "portfolio project.slug"),
    title: parseString(value.title, "portfolio project.title"),
    category: parseString(value.category, "portfolio project.category"),
    coverImage: parseString(value.coverImage, "portfolio project.coverImage"),
    galleryImages: parseStringArray(value.galleryImages, "portfolio project.galleryImages"),
    summary: parseString(value.summary, "portfolio project.summary"),
    story: parseString(value.story, "portfolio project.story"),
    featured: parseBoolean(value.featured, "portfolio project.featured"),
    publishedAt: parseISODateString(value.publishedAt, "portfolio project.publishedAt"),
  };

  if (value.seo !== undefined) {
    project.seo = parseSeo(value.seo, "portfolio project.seo");
  }

  return project;
}
