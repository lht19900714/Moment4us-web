import { parseSlugSegment } from "./validators.js";
export const routes = {
    home: "/",
    portfolio: "/portfolio",
    about: "/about",
    services: "/services",
    contact: "/contact",
    admin: "/admin",
    blog: "/blog",
};
export const adminRoutes = {
    index: routes.admin,
    pages: `${routes.admin}/pages`,
    portfolio: `${routes.admin}/portfolio`,
    leads: `${routes.admin}/leads`,
};
export function routePath(key) {
    return routes[key];
}
export function toPortfolioProjectRoute(slug) {
    return `${routes.portfolio}/${sanitizePathSegment(slug)}`;
}
function sanitizePathSegment(segment) {
    return parseSlugSegment(segment, "Portfolio project slug");
}
