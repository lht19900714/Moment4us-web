import { expect, test } from "vitest";

import { buildSeo, toMetaDescriptors } from "../seo";

test("buildSeo returns canonical and social metadata for the homepage", () => {
  const seo = buildSeo({
    title: "Moment4us | Photography Studio",
    description: "Warm, authentic photography for real stories.",
    pathname: "/",
  });

  expect(seo.canonical).toBe("https://moment4us.com/");
  expect(seo.openGraph.url).toBe("https://moment4us.com/");
  expect(seo.twitter.card).toBe("summary_large_image");
});

test("toMetaDescriptors includes canonical and social tags for portfolio pages", () => {
  const seo = buildSeo({
    title: "Portfolio",
    description: "Selected stories from Moment4us sessions and celebrations.",
    pathname: "/portfolio",
    image: "https://moment4us.com/og/portfolio.jpg",
  });

  expect(toMetaDescriptors(seo)).toEqual(
    expect.arrayContaining([
      { title: "Portfolio" },
      { tagName: "link", rel: "canonical", href: "https://moment4us.com/portfolio" },
      { property: "og:url", content: "https://moment4us.com/portfolio" },
      { property: "og:image", content: "https://moment4us.com/og/portfolio.jpg" },
      { name: "twitter:image", content: "https://moment4us.com/og/portfolio.jpg" },
    ]),
  );
});
