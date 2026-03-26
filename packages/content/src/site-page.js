import { parseSlugSegment } from "@moment4us/shared";
export function parseSitePage(input) {
    const value = parseRecord(input, "site page");
    const sitePage = {
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
function parseSections(input) {
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
