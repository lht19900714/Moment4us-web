import type { ReactNode } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import globalStylesHref from "./styles/global.css?url";

export function links() {
  return [{ rel: "stylesheet", href: globalStylesHref }];
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <Outlet />
      <SiteFooter />
    </div>
  );
}
