import { type ISODateString, type SeoMetadata } from "@moment4us/shared";
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
export declare function parseBlogPost(input: unknown): BlogPost;
