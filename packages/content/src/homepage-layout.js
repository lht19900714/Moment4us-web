export const homepageSectionOrder = [
    "hero",
    "featured-portfolio",
    "about-preview",
    "services-snapshot",
    "experience-process",
    "trust-signals",
    "inquiry-cta",
];
export function parseHomepageSections(input) {
    if (!Array.isArray(input)) {
        throw new Error("Homepage layout must be an array");
    }
    if (input.length !== homepageSectionOrder.length) {
        throw new Error(`Homepage layout must include ${homepageSectionOrder.length} sections in this order: ${homepageSectionOrder.join(", ")}`);
    }
    return homepageSectionOrder.map((expectedSection, index) => {
        const actualSection = input[index];
        if (actualSection !== expectedSection) {
            throw new Error(`Invalid homepage section order at index ${index}: expected "${expectedSection}" but received "${actualSection ?? "(missing)"}".`);
        }
        return expectedSection;
    });
}
export function isHomepageSectionId(input) {
    return homepageSectionOrder.includes(input);
}
