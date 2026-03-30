import {
  parseHomepageSections,
  type HomepageSectionId,
  type PortfolioProject,
  type SitePage,
  type SitePageSection,
} from "@moment4us/content";
import {
  createPortfolioProjectsRepository,
  createSitePagesRepository,
  type CloudflareImageConfig,
} from "@moment4us/data";
import { routes, siteName, type SeoMetadata } from "@moment4us/shared";

import { homepageFixture, portfolioProjectsFixture } from "./fixtures";

import type { CloudflareContext } from "../lib/cloudflare-env";
import { buildSeo, type BuiltSeo } from "../lib/seo";
import { getImageConfig, buildImageSrc, buildImageSrcSet } from "./image-helpers";

export interface HomeGalleryItem {
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

export interface HomeLoaderData {
  page: SitePage;
  featuredProjects: PortfolioProject[];
  galleryItems: HomeGalleryItem[];
  seo: BuiltSeo;
  sections: Record<HomepageSectionId, SitePageSection>;
}

const homeFeaturedFixture = portfolioProjectsFixture.slice(0, 3);

const galleryDimensions: Record<string, { width: number; height: number }> = {
  "harbor-vows": { width: 960, height: 1280 },
  "at-home-newborn": { width: 960, height: 1120 },
  "studio-portraits": { width: 960, height: 1440 },
};

export async function loadHomePage(context?: CloudflareContext): Promise<HomeLoaderData> {
  const page = await loadHomepagePage(context);
  const featuredProjects = await loadFeaturedProjects(context);
  const imageConfig = getImageConfig(context);
  const seoSource = page.seo ?? createFallbackSeoMetadata();
  const seoInput = {
    title: seoSource.title,
    description: seoSource.description,
    pathname: seoSource.canonicalPath ?? routes.home,
  } as const satisfies {
    title: string;
    description: string;
    pathname: string;
  };
  const seo = buildSeo(
    seoSource.keywords === undefined
      ? seoInput
      : {
          ...seoInput,
          keywords: seoSource.keywords,
        },
  );

  return {
    page,
    featuredProjects,
    galleryItems: featuredProjects.map((project) => toGalleryItem(project, imageConfig)),
    seo,
    sections: indexSections(page.sections),
  };
}

async function loadHomepagePage(context?: CloudflareContext): Promise<SitePage> {
  const database = context?.cloudflare?.env?.DB;

  if (database === undefined) {
    return homepageFixture;
  }

  try {
    const page = await createSitePagesRepository(database).getPageBySlug("home");

    if (page === null || !hasApprovedHomepageLayout(page.sections)) {
      return homepageFixture;
    }

    return page;
  } catch {
    return homepageFixture;
  }
}

async function loadFeaturedProjects(context?: CloudflareContext): Promise<PortfolioProject[]> {
  const database = context?.cloudflare?.env?.DB;

  if (database === undefined) {
    return homeFeaturedFixture;
  }

  try {
    const projects = await createPortfolioProjectsRepository(database).listFeaturedProjects(3);
    return projects.length > 0 ? projects : homeFeaturedFixture;
  } catch {
    return homeFeaturedFixture;
  }
}

function toGalleryItem(project: PortfolioProject, config: CloudflareImageConfig): HomeGalleryItem {
  const dimensions = galleryDimensions[project.slug] ?? { width: 960, height: 1280 };

  return {
    id: project.slug,
    href: routes.portfolio,
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

function indexSections(sections: SitePageSection[]): Record<HomepageSectionId, SitePageSection> {
  const orderedIds = parseHomepageSections(sections.map((section) => section.id));

  return orderedIds.reduce(
    (accumulator, id) => {
      const section = sections.find((candidate) => candidate.id === id);

      if (section === undefined) {
        throw new Error(`Homepage section ${id} is missing content`);
      }

      accumulator[id] = section;
      return accumulator;
    },
    {} as Record<HomepageSectionId, SitePageSection>,
  );
}

function hasApprovedHomepageLayout(sections: SitePageSection[]): boolean {
  try {
    parseHomepageSections(sections.map((section) => section.id));
    return true;
  } catch {
    return false;
  }
}

function createFallbackSeoMetadata(): SeoMetadata {
  return {
    title: `${siteName} | Photography Studio`,
    description: homepageFixture.seoDescription,
    canonicalPath: routes.home,
  };
}
