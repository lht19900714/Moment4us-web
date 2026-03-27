import { type RouteConfig, index, route } from "@react-router/dev/routes";

import { routes } from "../../../packages/shared/src";

function childPath(pathname: string): string {
  return pathname.replace(/^\//, "");
}

export default [
  index("./routes/home.tsx"),
  route(childPath(routes.portfolio), "./routes/portfolio.tsx"),
  route(childPath(`${routes.portfolio}/:slug`), "./routes/portfolio.$slug.tsx"),
  route(childPath(routes.about), "./routes/about.tsx"),
  route(childPath(routes.services), "./routes/services.tsx"),
  route(childPath(routes.contact), "./routes/contact.tsx"),
  route("admin/login", "./routes/admin.login.tsx"),
  route("admin", "./routes/admin.tsx", [
    index("./routes/admin._index.tsx"),
    route("leads", "./routes/admin.leads.tsx"),
    route("portfolio", "./routes/admin.portfolio.tsx"),
    route("portfolio/new", "./routes/admin.portfolio.new.tsx"),
    route("portfolio/:slug", "./routes/admin.portfolio.$slug.tsx"),
    route("pages", "./routes/admin.pages.tsx"),
  ]),
] satisfies RouteConfig;
