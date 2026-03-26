import { parseBlogPost, type BlogPost } from "@moment4us/content";
import { parseSlugSegment } from "@moment4us/shared";

import { ensureD1Client, type D1Client, type D1DatabaseLike } from "../d1/client.js";

const SELECT_BLOG_POST_BY_SLUG_SQL = `
  SELECT slug, title, excerpt, cover_image, content, tags_json, published_at, seo_json
  FROM blog_posts
  WHERE slug = ?
  LIMIT 1
`;

const SELECT_PUBLISHED_BLOG_POSTS_SQL = `
  SELECT slug, title, excerpt, cover_image, content, tags_json, published_at, seo_json
  FROM blog_posts
  ORDER BY published_at DESC
  LIMIT ?
`;

interface BlogPostRow {
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string;
  content: string;
  tags_json: string;
  published_at: string;
  seo_json: string | null;
}

export interface BlogPostsRepository {
  getPostBySlug(slug: string): Promise<BlogPost | null>;
  listPublishedPosts(limit?: number): Promise<BlogPost[]>;
}

export function createBlogPostsRepository(input: D1Client | D1DatabaseLike): BlogPostsRepository {
  const client = ensureD1Client(input);

  return {
    async getPostBySlug(slug: string): Promise<BlogPost | null> {
      const row = await client.first<BlogPostRow>(SELECT_BLOG_POST_BY_SLUG_SQL, [
        parseSlugSegment(slug, "blog post slug"),
      ]);

      return row === null ? null : mapBlogPostRow(row);
    },
    async listPublishedPosts(limit = 10): Promise<BlogPost[]> {
      if (!Number.isInteger(limit) || limit < 1) {
        throw new Error("published posts limit must be a positive integer");
      }

      const rows = await client.all<BlogPostRow>(SELECT_PUBLISHED_BLOG_POSTS_SQL, [limit]);
      return rows.map(mapBlogPostRow);
    },
  };
}

function mapBlogPostRow(row: BlogPostRow): BlogPost {
  return parseBlogPost({
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    coverImage: row.cover_image,
    content: row.content,
    tags: parseJsonField(row.tags_json, "blog_posts.tags_json"),
    publishedAt: row.published_at,
    seo: row.seo_json === null ? undefined : parseJsonField(row.seo_json, "blog_posts.seo_json"),
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

export const blogPostsSql = {
  selectPostBySlug: SELECT_BLOG_POST_BY_SLUG_SQL,
  selectPublishedPosts: SELECT_PUBLISHED_BLOG_POSTS_SQL,
} satisfies Record<string, string>;
