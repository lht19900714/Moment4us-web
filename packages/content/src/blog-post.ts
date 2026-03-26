import {
  parseISODateString,
  parseSlugSegment,
  type ISODateString,
  type SeoMetadata,
} from "@moment4us/shared";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  content: string;
  tags: string[];
  publishedAt: ISODateString;
  seo?: SeoMetadata;
}

export function parseBlogPost(input: unknown): BlogPost {
  const value = parseRecord(input, "blog post");

  const post: BlogPost = {
    slug: parseSlugSegment(value.slug, "blog post.slug"),
    title: parseString(value.title, "blog post.title"),
    excerpt: parseString(value.excerpt, "blog post.excerpt"),
    coverImage: parseString(value.coverImage, "blog post.coverImage"),
    content: parseString(value.content, "blog post.content"),
    tags: parseStringArray(value.tags, "blog post.tags"),
    publishedAt: parseISODateString(value.publishedAt, "blog post.publishedAt"),
  };

  if (value.seo !== undefined) {
    post.seo = parseSeo(value.seo, "blog post.seo");
  }

  return post;
}

function parseSeo(input: unknown, fieldName: string): SeoMetadata {
  const value = parseRecord(input, fieldName);
  const seo: SeoMetadata = {
    title: parseString(value.title, `${fieldName}.title`),
    description: parseString(value.description, `${fieldName}.description`),
  };

  if (value.canonicalPath !== undefined) {
    seo.canonicalPath = parseString(value.canonicalPath, `${fieldName}.canonicalPath`);
  }

  if (value.image !== undefined) {
    seo.image = parseString(value.image, `${fieldName}.image`);
  }

  if (value.keywords !== undefined) {
    seo.keywords = parseStringArray(value.keywords, `${fieldName}.keywords`);
  }

  return seo;
}

function parseRecord(input: unknown, fieldName: string): Record<string, unknown> {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new Error(`${fieldName} must be an object`);
  }

  return input as Record<string, unknown>;
}

function parseString(input: unknown, fieldName: string): string {
  if (typeof input !== "string" || input.trim().length === 0) {
    throw new Error(`${fieldName} must be a non-empty string`);
  }

  return input;
}

function parseStringArray(input: unknown, fieldName: string): string[] {
  if (!Array.isArray(input)) {
    throw new Error(`${fieldName} must be an array`);
  }

  return input.map((item, index) => parseString(item, `${fieldName}[${index}]`));
}
