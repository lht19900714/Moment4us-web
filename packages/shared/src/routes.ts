import { parseSlugSegment } from "./validators.js";

export const routes = {
  home: "/",
  portfolio: "/portfolio",
  about: "/about",
  services: "/services",
  contact: "/contact",
  admin: "/admin",
  blog: "/blog",
} as const;

export const adminRoutes = {
  index: routes.admin,
  pages: `${routes.admin}/pages`,
  portfolio: `${routes.admin}/portfolio`,
  leads: `${routes.admin}/leads`,
} as const;

export type RouteKey = keyof typeof routes;

export function routePath(key: RouteKey): (typeof routes)[RouteKey] {
  return routes[key];
}

export function toPortfolioProjectRoute(slug: string): string {
  return `${routes.portfolio}/${sanitizePathSegment(slug)}`;
}

function sanitizePathSegment(segment: string): string {
  return parseSlugSegment(segment, "Portfolio project slug");
}
