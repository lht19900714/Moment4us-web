import type { MetaDescriptor } from "react-router";

import { siteDescription, siteLocale, siteName } from "../../../../packages/shared/src";

const defaultSiteUrl = "https://moment4us.com";
const defaultSocialImage = `${defaultSiteUrl}/og/default.jpg`;

export interface BuildSeoInput {
  title: string;
  description?: string;
  pathname: string;
  image?: string;
  keywords?: readonly string[];
}

export interface BuiltSeo {
  title: string;
  description: string;
  canonical: string;
  keywords?: string[];
  openGraph: {
    title: string;
    description: string;
    type: "website" | "article";
    url: string;
    image: string;
    locale: string;
    siteName: string;
  };
  twitter: {
    card: "summary_large_image";
    title: string;
    description: string;
    image: string;
  };
}

export function buildSeo(input: BuildSeoInput): BuiltSeo {
  const description = input.description?.trim() || siteDescription;
  const canonical = buildCanonicalUrl(input.pathname);
  const image = normalizeImageUrl(input.image);
  const keywords = input.keywords?.map((keyword) => keyword.trim()).filter(Boolean);

  const seo: BuiltSeo = {
    title: input.title.trim(),
    description,
    canonical,
    openGraph: {
      title: input.title.trim(),
      description,
      type: "website",
      url: canonical,
      image,
      locale: siteLocale,
      siteName,
    },
    twitter: {
      card: "summary_large_image",
      title: input.title.trim(),
      description,
      image,
    },
  };

  if (keywords !== undefined && keywords.length > 0) {
    seo.keywords = keywords;
  }

  return seo;
}

export function toMetaDescriptors(seo: BuiltSeo): MetaDescriptor[] {
  const descriptors: MetaDescriptor[] = [
    { title: seo.title },
    { name: "description", content: seo.description },
    { tagName: "link", rel: "canonical", href: seo.canonical },
    { property: "og:title", content: seo.openGraph.title },
    { property: "og:description", content: seo.openGraph.description },
    { property: "og:type", content: seo.openGraph.type },
    { property: "og:url", content: seo.openGraph.url },
    { property: "og:image", content: seo.openGraph.image },
    { property: "og:locale", content: seo.openGraph.locale },
    { property: "og:site_name", content: seo.openGraph.siteName },
    { name: "twitter:card", content: seo.twitter.card },
    { name: "twitter:title", content: seo.twitter.title },
    { name: "twitter:description", content: seo.twitter.description },
    { name: "twitter:image", content: seo.twitter.image },
  ];

  if (seo.keywords !== undefined && seo.keywords.length > 0) {
    descriptors.push({ name: "keywords", content: seo.keywords.join(", ") });
  }

  return descriptors;
}

function buildCanonicalUrl(pathname: string): string {
  const normalizedPath = pathname === "/" ? "/" : `/${pathname.replace(/^\/+|\/+$/g, "")}`;
  return new URL(normalizedPath, `${defaultSiteUrl}/`).toString();
}

function normalizeImageUrl(image?: string): string {
  if (image === undefined || image.trim().length === 0) {
    return defaultSocialImage;
  }

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return new URL(image.startsWith("/") ? image.slice(1) : image, `${defaultSiteUrl}/`).toString();
}
