import { parseISODateString, parseSlugSegment, } from "@moment4us/shared";
export function parsePortfolioProject(input) {
    const value = parseRecord(input, "portfolio project");
    const project = {
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
function parseSeo(input, fieldName) {
    const value = parseRecord(input, fieldName);
    const seo = {
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
function parseRecord(input, fieldName) {
    if (typeof input !== "object" || input === null || Array.isArray(input)) {
        throw new Error(`${fieldName} must be an object`);
    }
    return input;
}
function parseString(input, fieldName) {
    if (typeof input !== "string" || input.trim().length === 0) {
        throw new Error(`${fieldName} must be a non-empty string`);
    }
    return input;
}
function parseBoolean(input, fieldName) {
    if (typeof input !== "boolean") {
        throw new Error(`${fieldName} must be a boolean`);
    }
    return input;
}
function parseStringArray(input, fieldName) {
    if (!Array.isArray(input)) {
        throw new Error(`${fieldName} must be an array`);
    }
    return input.map((item, index) => parseString(item, `${fieldName}[${index}]`));
}
