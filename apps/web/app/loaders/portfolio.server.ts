import { type PortfolioProject } from "@moment4us/content";
import {
  createPortfolioProjectsRepository,
  type CloudflareImageConfig,
} from "@moment4us/data";
import { routes, siteName, toPortfolioProjectRoute } from "@moment4us/shared";

import type { CloudflareContext } from "../lib/cloudflare-env";
import { buildSeo, type BuiltSeo } from "../lib/seo";
import { getImageConfig, buildImageSrc, buildImageSrcSet } from "./image-helpers";
import { portfolioProjectsFixture, portfolioListingFixture } from "./fixtures";

interface PortfolioSection {
  id: string;
  heading: string;
  body: string;
}

export interface PortfolioGalleryItem {
  id: string;
  href: string;
  title: string;
  category: string;
  summary: string;
  alt: string;
  width: number;
  height: number;
  src: string;
  srcSet: string;
  sizes: string;
}

export interface PortfolioProjectImage {
  id: string;
  alt: string;
  width: number;
  height: number;
  src: string;
  srcSet: string;
  sizes: string;
}

export interface PortfolioListingLoaderData {
  title: string;
  hero: string;
  sections: PortfolioSection[];
  projects: PortfolioProject[];
  galleryItems: PortfolioGalleryItem[];
  seo: BuiltSeo;
}

export interface PortfolioProjectLoaderData {
  project: PortfolioProject;
  heroImage: PortfolioProjectImage;
  editorialImages: PortfolioProjectImage[];
  seo: BuiltSeo;
}

const galleryDimensions: Record<string, { width: number; height: number }> = {
  "harbor-vows": { width: 960, height: 1280 },
  "at-home-newborn": { width: 960, height: 1120 },
  "studio-portraits": { width: 960, height: 1440 },
  "city-elopement": { width: 960, height: 1280 },
};

const projectImageDimensions: Record<string, { width: number; height: number }> = {
  "harbor-vows": { width: 1200, height: 1600 },
  "at-home-newborn": { width: 1200, height: 1500 },
  "studio-portraits": { width: 1200, height: 1700 },
  "city-elopement": { width: 1200, height: 1600 },
};

export function getPortfolioListingFixtureData(
  context?: CloudflareContext,
): PortfolioListingLoaderData {
  const imageConfig = getImageConfig(context);
  return buildPortfolioListingData(portfolioProjectsFixture, imageConfig);
}

export async function loadPortfolioListing(
  context?: CloudflareContext,
): Promise<PortfolioListingLoaderData> {
  const projects = await loadPortfolioProjects(context);
  const imageConfig = getImageConfig(context);
  return buildPortfolioListingData(projects, imageConfig);
}

export async function loadPortfolioProject(
  slug: string,
  context?: CloudflareContext,
): Promise<PortfolioProjectLoaderData> {
  const project = await loadProjectBySlug(slug, context);

  if (project === null) {
    throw new Response("Portfolio project not found", { status: 404 });
  }

  const imageConfig = getImageConfig(context);
  const heroImage = toProjectImage(project.coverImage, project, 0, imageConfig, "cover");
  const editorialImages = toProjectImages(project, imageConfig);
  const seoInput = {
    title: project.seo?.title ?? `${project.title} | ${siteName}`,
    description: project.seo?.description ?? project.summary,
    pathname: project.seo?.canonicalPath ?? toPortfolioProjectRoute(project.slug),
  } as const satisfies {
    title: string;
    description: string;
    pathname: string;
  };
  const seo = buildSeo({
    ...seoInput,
    image: heroImage.src,
    ...(project.seo?.keywords === undefined ? {} : { keywords: project.seo.keywords }),
  });

  return {
    project,
    heroImage,
    editorialImages,
    seo,
  };
}

async function loadPortfolioProjects(context?: CloudflareContext): Promise<PortfolioProject[]> {
  const database = context?.cloudflare?.env?.DB;

  if (database === undefined) {
    return portfolioProjectsFixture;
  }

  try {
    const projects = await createPortfolioProjectsRepository(database).listFeaturedProjects(24);
    return projects.length > 0 ? projects : portfolioProjectsFixture;
  } catch {
    return portfolioProjectsFixture;
  }
}

async function loadProjectBySlug(
  slug: string,
  context?: CloudflareContext,
): Promise<PortfolioProject | null> {
  const database = context?.cloudflare?.env?.DB;

  if (database === undefined) {
    return findFixtureProject(slug);
  }

  try {
    const project = await createPortfolioProjectsRepository(database).getProjectBySlug(slug);
    return project ?? findFixtureProject(slug);
  } catch {
    return findFixtureProject(slug);
  }
}

function buildPortfolioListingData(
  projects: readonly PortfolioProject[],
  imageConfig: CloudflareImageConfig,
): PortfolioListingLoaderData {
  return {
    title: portfolioListingFixture.title,
    hero: portfolioListingFixture.hero,
    sections: [...portfolioListingFixture.sections],
    projects: [...projects],
    galleryItems: projects.map((project) => toGalleryItem(project, imageConfig)),
    seo: buildSeo({
      title: "Portfolio",
      description:
        "Browse wedding, family, and portrait stories by Moment4us, crafted with warm tones and editorial storytelling.",
      pathname: routes.portfolio,
      keywords: ["portfolio photography", "wedding gallery", "family photography stories"],
    }),
  };
}

function findFixtureProject(slug: string): PortfolioProject | null {
  return portfolioProjectsFixture.find((project) => project.slug === slug) ?? null;
}

function toGalleryItem(project: PortfolioProject, config: CloudflareImageConfig): PortfolioGalleryItem {
  const dimensions = galleryDimensions[project.slug] ?? { width: 960, height: 1280 };

  return {
    id: project.slug,
    href: toPortfolioProjectRoute(project.slug),
    title: project.title,
    category: project.category,
    summary: project.summary,
    alt: `${project.title}: ${project.summary}`,
    width: dimensions.width,
    height: dimensions.height,
    src: buildImageSrc(project.coverImage, config, dimensions, 82),
    srcSet: buildImageSrcSet(project.coverImage, config, [400, 640, 960], dimensions.height, 82),
    sizes: "(min-width: 1100px) 30vw, (min-width: 720px) 45vw, 100vw",
  };
}

function toProjectImages(
  project: PortfolioProject,
  config: CloudflareImageConfig,
): PortfolioProjectImage[] {
  const imageIds = project.galleryImages.length > 0 ? project.galleryImages : [project.coverImage];
  return imageIds.map((imageId, index) => toProjectImage(imageId, project, index, config, "sequence"));
}

function toProjectImage(
  imageId: string,
  project: PortfolioProject,
  index: number,
  config: CloudflareImageConfig,
  role: "cover" | "sequence",
): PortfolioProjectImage {
  const dimensions = projectImageDimensions[project.slug] ?? { width: 1200, height: 1600 };
  const alt = role === "cover" ? `${project.title}: ${project.summary}` : `${project.title}: ${project.story}`;

  return {
    id: `${project.slug}-${index + 1}`,
    alt,
    width: dimensions.width,
    height: dimensions.height,
    src: buildImageSrc(imageId, config, dimensions, 84),
    srcSet: buildImageSrcSet(imageId, config, [480, 800, 1200], dimensions.height, 84),
    sizes: "(min-width: 1040px) 72rem, (min-width: 720px) 90vw, 100vw",
  };
}
