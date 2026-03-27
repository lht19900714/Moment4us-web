import { parsePortfolioProject, type PortfolioProject } from "../../../../packages/content/src";
import {
  buildCloudflareImageSrcSet,
  buildCloudflareImageUrl,
  createPortfolioProjectsRepository,
  type CloudflareImageConfig,
  type D1DatabaseLike,
} from "../../../../packages/data/src";
import { routes, siteName, toPortfolioProjectRoute } from "../../../../packages/shared/src";

import { buildSeo, type BuiltSeo } from "../lib/seo";

interface PortfolioLoaderContext {
  cloudflare?: {
    env?: {
      DB?: D1DatabaseLike;
      CLOUDFLARE_IMAGES_ACCOUNT_HASH?: string;
      CLOUDFLARE_IMAGES_VARIANT?: string;
    };
  };
}

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

const portfolioListingFixture = {
  title: "Portfolio",
  hero: "Selected stories shaped with editorial polish, documentary warmth, and space for real moments to unfold.",
  sections: [
    {
      id: "selected-stories",
      heading: "Selected Stories",
      body: "Each gallery is paced like a narrative, balancing atmosphere, portrait direction, and unplanned connection.",
    },
  ],
} as const satisfies {
  title: string;
  hero: string;
  sections: readonly PortfolioSection[];
};

const portfolioProjectsFixture = [
  parsePortfolioProject({
    slug: "harbor-vows",
    title: "Harbor Vows",
    category: "Wedding",
    coverImage: "harbor-vows-cover",
    galleryImages: ["harbor-vows-1", "harbor-vows-2", "harbor-vows-3"],
    summary: "Golden-hour portraits and a candlelit dinner by the water.",
    story: "A relaxed celebration that stayed centered on people, movement, and the shoreline light.",
    featured: true,
    publishedAt: "2026-03-24",
    seo: {
      title: "Harbor Vows",
      description: "A waterfront wedding story from Moment4us.",
      canonicalPath: toPortfolioProjectRoute("harbor-vows"),
    },
  }),
  parsePortfolioProject({
    slug: "at-home-newborn",
    title: "At-Home Newborn",
    category: "Family",
    coverImage: "at-home-newborn-cover",
    galleryImages: ["at-home-newborn-1", "at-home-newborn-2", "at-home-newborn-3"],
    summary: "A quiet morning documenting the first week at home.",
    story: "Textures, routines, and small details shaped a gallery that felt gentle instead of staged.",
    featured: true,
    publishedAt: "2026-03-18",
    seo: {
      title: "At-Home Newborn",
      description: "A documentary newborn session from Moment4us.",
      canonicalPath: toPortfolioProjectRoute("at-home-newborn"),
    },
  }),
  parsePortfolioProject({
    slug: "studio-portraits",
    title: "Studio Portraits",
    category: "Portrait",
    coverImage: "studio-portraits-cover",
    galleryImages: ["studio-portraits-1", "studio-portraits-2", "studio-portraits-3"],
    summary: "Editorial-inspired portraits with soft light and direct connection.",
    story: "A focused portrait session with space for movement, styling changes, and simple prompts.",
    featured: true,
    publishedAt: "2026-03-10",
    seo: {
      title: "Studio Portraits",
      description: "A portrait story from the Moment4us studio.",
      canonicalPath: toPortfolioProjectRoute("studio-portraits"),
    },
  }),
  parsePortfolioProject({
    slug: "city-elopement",
    title: "City Elopement",
    category: "Wedding",
    coverImage: "city-elopement-cover",
    galleryImages: ["city-elopement-1", "city-elopement-2", "city-elopement-3"],
    summary: "A downtown ceremony with rooftop portraits and a midnight walk.",
    story: "Minimal timelines and intentional styling made room for movement, architecture, and personal ritual.",
    featured: true,
    publishedAt: "2026-03-05",
    seo: {
      title: "City Elopement",
      description: "An editorial city elopement gallery from Moment4us.",
      canonicalPath: toPortfolioProjectRoute("city-elopement"),
    },
  }),
];

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
  context?: PortfolioLoaderContext,
): PortfolioListingLoaderData {
  const imageConfig = getImageConfig(context);
  return buildPortfolioListingData(portfolioProjectsFixture, imageConfig);
}

export async function loadPortfolioListing(
  context?: PortfolioLoaderContext,
): Promise<PortfolioListingLoaderData> {
  const projects = await loadPortfolioProjects(context);
  const imageConfig = getImageConfig(context);
  return buildPortfolioListingData(projects, imageConfig);
}

export async function loadPortfolioProject(
  slug: string,
  context?: PortfolioLoaderContext,
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

async function loadPortfolioProjects(context?: PortfolioLoaderContext): Promise<PortfolioProject[]> {
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
  context?: PortfolioLoaderContext,
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

function getImageConfig(context?: PortfolioLoaderContext): CloudflareImageConfig {
  return {
    accountHash: context?.cloudflare?.env?.CLOUDFLARE_IMAGES_ACCOUNT_HASH ?? "moment4us-demo",
    variant: context?.cloudflare?.env?.CLOUDFLARE_IMAGES_VARIANT ?? "public",
  };
}

function isDemoConfig(config: CloudflareImageConfig): boolean {
  return config.accountHash === "moment4us-demo";
}

/**
 * Unsplash placeholder images for local development when Cloudflare Images
 * account is not configured. Maps fixture image IDs to real Unsplash URLs.
 */
const demoImageUrls: Record<string, string> = {
  "harbor-vows-cover": "https://images.unsplash.com/photo-1519741497674-611481863552?w=%WIDTH%&h=%HEIGHT%&fit=crop&q=80",
  "harbor-vows-1": "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=%WIDTH%&h=%HEIGHT%&fit=crop&q=80",
  "harbor-vows-2": "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=%WIDTH%&h=%HEIGHT%&fit=crop&q=80",
  "harbor-vows-3": "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=%WIDTH%&h=%HEIGHT%&fit=crop&q=80",
  "at-home-newborn-cover": "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=%WIDTH%&h=%HEIGHT%&fit=crop&q=80",
  "at-home-newborn-1": "https://images.unsplash.com/photo-1544126592-807ade215a0b?w=%WIDTH%&h=%HEIGHT%&fit=crop&q=80",
  "at-home-newborn-2": "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=%WIDTH%&h=%HEIGHT%&fit=crop&q=80",
  "at-home-newborn-3": "https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=%WIDTH%&h=%HEIGHT%&fit=crop&q=80",
  "studio-portraits-cover": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=%WIDTH%&h=%HEIGHT%&fit=crop&q=80",
  "studio-portraits-1": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=%WIDTH%&h=%HEIGHT%&fit=crop&q=80",
  "studio-portraits-2": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=%WIDTH%&h=%HEIGHT%&fit=crop&q=80",
  "studio-portraits-3": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=%WIDTH%&h=%HEIGHT%&fit=crop&q=80",
  "city-elopement-cover": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=%WIDTH%&h=%HEIGHT%&fit=crop&q=80",
  "city-elopement-1": "https://images.unsplash.com/photo-1529636798458-92182e662485?w=%WIDTH%&h=%HEIGHT%&fit=crop&q=80",
  "city-elopement-2": "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=%WIDTH%&h=%HEIGHT%&fit=crop&q=80",
  "city-elopement-3": "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=%WIDTH%&h=%HEIGHT%&fit=crop&q=80",
};

function getDemoImageUrl(imageId: string, width: number, height: number): string {
  const template = demoImageUrls[imageId];
  if (template === undefined) {
    return `https://images.unsplash.com/photo-1519741497674-611481863552?w=${width}&h=${height}&fit=crop&q=80`;
  }
  return template.replace("%WIDTH%", String(width)).replace("%HEIGHT%", String(height));
}

function getDemoSrcSet(imageId: string, widths: readonly number[], height: number): string {
  return widths.map((w) => `${getDemoImageUrl(imageId, w, height)} ${w}w`).join(", ");
}

function toGalleryItem(project: PortfolioProject, config: CloudflareImageConfig): PortfolioGalleryItem {
  const dimensions = galleryDimensions[project.slug] ?? { width: 960, height: 1280 };
  const demo = isDemoConfig(config);

  return {
    id: project.slug,
    href: toPortfolioProjectRoute(project.slug),
    title: project.title,
    category: project.category,
    summary: project.summary,
    alt: `${project.title}: ${project.summary}`,
    width: dimensions.width,
    height: dimensions.height,
    src: demo
      ? getDemoImageUrl(project.coverImage, dimensions.width, dimensions.height)
      : buildCloudflareImageUrl(project.coverImage, config, {
          width: dimensions.width,
          height: dimensions.height,
          fit: "cover",
          quality: 82,
          format: "auto",
        }),
    srcSet: demo
      ? getDemoSrcSet(project.coverImage, [400, 640, 960], dimensions.height)
      : buildCloudflareImageSrcSet(project.coverImage, config, [400, 640, 960], {
          height: dimensions.height,
          fit: "cover",
          quality: 82,
          format: "auto",
        }),
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
  const demo = isDemoConfig(config);

  return {
    id: `${project.slug}-${index + 1}`,
    alt,
    width: dimensions.width,
    height: dimensions.height,
    src: demo
      ? getDemoImageUrl(imageId, dimensions.width, dimensions.height)
      : buildCloudflareImageUrl(imageId, config, {
          width: dimensions.width,
          height: dimensions.height,
          fit: "cover",
          quality: 84,
          format: "auto",
        }),
    srcSet: demo
      ? getDemoSrcSet(imageId, [480, 800, 1200], dimensions.height)
      : buildCloudflareImageSrcSet(imageId, config, [480, 800, 1200], {
          height: dimensions.height,
          fit: "cover",
          quality: 84,
          format: "auto",
        }),
    sizes: "(min-width: 1040px) 72rem, (min-width: 720px) 90vw, 100vw",
  };
}
