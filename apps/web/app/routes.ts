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
] satisfies RouteConfig;
