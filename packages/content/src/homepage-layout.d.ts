export declare const homepageSectionOrder: readonly ["hero", "featured-portfolio", "about-preview", "services-snapshot", "experience-process", "trust-signals", "inquiry-cta"];
export type HomepageSectionId = (typeof homepageSectionOrder)[number];
export declare function parseHomepageSections(input: unknown): HomepageSectionId[];
export declare function isHomepageSectionId(input: string): input is HomepageSectionId;
