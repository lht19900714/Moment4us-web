import { renderToString } from "react-dom/server";
import type { ReactNode } from "react";
import { vi } from "vitest";

vi.mock("../../styles/global.css?url", () => ({
  default: "/assets/global.css",
}));

function MockMarker({ label }: { label: string }) {
  return <span data-mock={label}>{label}</span>;
}

function MockLinks() {
  return <MockMarker label="links" />;
}

function MockLink({
  children,
  to,
}: {
  children: ReactNode;
  to: string;
}) {
  return <a href={to}>{children}</a>;
}

function MockMeta() {
  return <MockMarker label="meta" />;
}

function MockOutlet() {
  return <MockMarker label="outlet" />;
}

function MockScripts() {
  return <MockMarker label="scripts" />;
}

function MockScrollRestoration() {
  return <MockMarker label="scroll-restoration" />;
}

vi.mock("react-router", async () => {
  const actual = await vi.importActual<typeof import("react-router")>("react-router");

  return {
    ...actual,
    Link: ({ children, to }: { children: ReactNode; to: string }) => (
      <MockLink to={to}>{children}</MockLink>
    ),
    Links: () => <MockLinks />,
    Meta: () => <MockMeta />,
    Outlet: () => <MockOutlet />,
    Scripts: () => <MockScripts />,
    ScrollRestoration: () => <MockScrollRestoration />,
    useLocation: () => ({ pathname: "/", search: "", hash: "", state: null, key: "default" }),
  };
});

import Root, { Layout, links } from "../../root";

test("root layout renders the document shell", () => {
  const html = renderToString(
    <Layout>
      <main>Moment4us shell</main>
    </Layout>,
  );

  expect(html).toContain("<html lang=\"en\">");
  expect(html).toContain("<head>");
  expect(html).toContain("<body>");
  expect(html).toContain("data-mock=\"meta\"");
  expect(html).toContain("data-mock=\"links\"");
  expect(html).toContain("data-mock=\"scripts\"");
  expect(html).toContain("data-mock=\"scroll-restoration\"");
  expect(html).toContain("Moment4us shell");
});

test("root exports an outlet and stylesheet link descriptor", () => {
  const html = renderToString(<Root />);

  expect(html).toContain("data-mock=\"outlet\"");
  expect(html).toContain("href=\"/portfolio\"");
  expect(html).toContain("href=\"/about\"");
  expect(html).toContain("href=\"/services\"");
  expect(html).toContain("href=\"/contact\"");
  expect(html).toContain("Moment4us");
  expect(links()).toEqual([
    {
      href: "/assets/global.css",
      rel: "stylesheet",
    },
  ]);
});
