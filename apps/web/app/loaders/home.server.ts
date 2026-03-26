import {
  parseHomepageSections,
  parsePortfolioProject,
  parseSitePage,
  type HomepageSectionId,
  type PortfolioProject,
  type SitePage,
  type SitePageSection,
} from "../../../../packages/content/src";
import {
  buildCloudflareImageSrcSet,
  buildCloudflareImageUrl,
  createPortfolioProjectsRepository,
  createSitePagesRepository,
  type CloudflareImageConfig,
  type D1DatabaseLike,
} from "../../../../packages/data/src";
import { routes, siteDescription, siteName, type SeoMetadata } from "../../../../packages/shared/src";

import { buildSeo, type BuiltSeo } from "../lib/seo";

interface HomeLoaderContext {
  cloudflare?: {
    env?: {
      DB?: D1DatabaseLike;
      CLOUDFLARE_IMAGES_ACCOUNT_HASH?: string;
      CLOUDFLARE_IMAGES_VARIANT?: string;
    };
  };
}

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

const homepageFixture = parseSitePage({
  slug: "home",
  title: siteName,
  seoTitle: `${siteName} | Photography Studio`,
  seoDescription: siteDescription,
  hero: siteDescription,
  sections: [
    {
      id: "hero",
      heading: "Warm, authentic photography",
      body: "For weddings, families, and portrait sessions that should feel calm in the moment and honest for years after.",
    },
    {
      id: "featured-portfolio",
      heading: "Selected Stories",
      body: "A small preview of recent celebrations, everyday family seasons, and portraits shaped around real connection.",
    },
    {
      id: "about-preview",
      heading: "About Moment4us",
      body: "Moment4us blends gentle direction with room for real emotion, so the gallery reflects how the day actually felt instead of forcing it into poses.",
    },
    {
      id: "services-snapshot",
      heading: "What We Photograph",
      body: "Wedding days, elopements, family sessions, maternity stories, newborn seasons, portraits, and custom editorial-style coverage.",
    },
    {
      id: "experience-process",
      heading: "A calm process from inquiry to gallery",
      body: "Simple planning, honest communication, and thoughtful pacing help every session stay grounded from the first note through final delivery.",
    },
    {
      id: "trust-signals",
      heading: "Why clients trust the experience",
      body: "Clear guidance, adaptable coverage, and photographs that stay warm and true without feeling over-directed.",
    },
    {
      id: "inquiry-cta",
      heading: "Let’s Tell Your Story",
      body: "Share the date, place, and feeling you want to hold onto, and we can shape a session that fits naturally around it.",
    },
  ],
  published: true,
  seo: {
    title: `${siteName} | Photography Studio`,
    description: siteDescription,
    canonicalPath: routes.home,
    keywords: ["wedding photographer", "family photography", "portrait photography"],
  },
});

const featuredProjectsFixture = [
  parsePortfolioProject({
    slug: "harbor-vows",
    title: "Harbor Vows",
    category: "Wedding",
    coverImage: "harbor-vows-cover",
    galleryImages: ["harbor-vows-1", "harbor-vows-2"],
    summary: "Golden-hour portraits and a candlelit dinner by the water.",
    story: "A relaxed celebration that stayed centered on people, movement, and the shoreline light.",
    featured: true,
    publishedAt: "2026-03-24",
    seo: {
      title: "Harbor Vows",
      description: "A waterfront wedding story from Moment4us.",
      canonicalPath: `${routes.portfolio}/harbor-vows`,
    },
  }),
  parsePortfolioProject({
    slug: "at-home-newborn",
    title: "At-Home Newborn",
    category: "Family",
    coverImage: "at-home-newborn-cover",
    galleryImages: ["at-home-newborn-1", "at-home-newborn-2"],
    summary: "A quiet morning documenting the first week at home.",
    story: "Textures, routines, and small details shaped a gallery that felt gentle instead of staged.",
    featured: true,
    publishedAt: "2026-03-18",
    seo: {
      title: "At-Home Newborn",
      description: "A documentary newborn session from Moment4us.",
      canonicalPath: `${routes.portfolio}/at-home-newborn`,
    },
  }),
  parsePortfolioProject({
    slug: "studio-portraits",
    title: "Studio Portraits",
    category: "Portrait",
    coverImage: "studio-portraits-cover",
    galleryImages: ["studio-portraits-1", "studio-portraits-2"],
    summary: "Editorial-inspired portraits with soft light and direct connection.",
    story: "A focused portrait session with space for movement, styling changes, and simple prompts.",
    featured: true,
    publishedAt: "2026-03-10",
    seo: {
      title: "Studio Portraits",
      description: "A portrait story from the Moment4us studio.",
      canonicalPath: `${routes.portfolio}/studio-portraits`,
    },
  }),
];

const galleryDimensions: Record<string, { width: number; height: number }> = {
  "harbor-vows": { width: 960, height: 1280 },
  "at-home-newborn": { width: 960, height: 1120 },
  "studio-portraits": { width: 960, height: 1440 },
};

export async function loadHomePage(context?: HomeLoaderContext): Promise<HomeLoaderData> {
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

async function loadHomepagePage(context?: HomeLoaderContext): Promise<SitePage> {
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

async function loadFeaturedProjects(context?: HomeLoaderContext): Promise<PortfolioProject[]> {
  const database = context?.cloudflare?.env?.DB;

  if (database === undefined) {
    return featuredProjectsFixture;
  }

  try {
    const projects = await createPortfolioProjectsRepository(database).listFeaturedProjects(3);
    return projects.length > 0 ? projects : featuredProjectsFixture;
  } catch {
    return featuredProjectsFixture;
  }
}

function getImageConfig(context?: HomeLoaderContext): CloudflareImageConfig {
  return {
    accountHash: context?.cloudflare?.env?.CLOUDFLARE_IMAGES_ACCOUNT_HASH ?? "moment4us-demo",
    variant: context?.cloudflare?.env?.CLOUDFLARE_IMAGES_VARIANT ?? "public",
  };
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
    src: buildCloudflareImageUrl(project.coverImage, config, {
      width: dimensions.width,
      height: dimensions.height,
      fit: "cover",
      quality: 82,
      format: "auto",
    }),
    srcSet: buildCloudflareImageSrcSet(project.coverImage, config, [400, 640, 960], {
      height: dimensions.height,
      fit: "cover",
      quality: 82,
      format: "auto",
    }),
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
    description: siteDescription,
    canonicalPath: routes.home,
  };
}
