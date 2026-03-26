import { type SeoMetadata } from "@moment4us/shared";
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
export declare function parseSitePage(input: unknown): SitePage;
