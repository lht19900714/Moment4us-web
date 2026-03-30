import {
  parseISODateString,
  parseSlugSegment,
  type ISODateString,
  type SeoMetadata,
} from "@moment4us/shared";
import { parseRecord, parseString, parseStringArray, parseSeo } from "./parsers.js";

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
