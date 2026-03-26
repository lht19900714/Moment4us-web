import { type ISODateString, type SeoMetadata } from "@moment4us/shared";
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
export declare function parsePortfolioProject(input: unknown): PortfolioProject;
