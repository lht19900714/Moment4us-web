export declare const routes: {
    readonly home: "/";
    readonly portfolio: "/portfolio";
    readonly about: "/about";
    readonly services: "/services";
    readonly contact: "/contact";
    readonly admin: "/admin";
    readonly blog: "/blog";
};
export declare const adminRoutes: {
    readonly index: "/admin";
    readonly pages: "/admin/pages";
    readonly portfolio: "/admin/portfolio";
    readonly leads: "/admin/leads";
};
export type RouteKey = keyof typeof routes;
export declare function routePath(key: RouteKey): (typeof routes)[RouteKey];
export declare function toPortfolioProjectRoute(slug: string): string;
