import { parsePortfolioProject, parseSitePage, type PortfolioProject, type SitePage } from "@moment4us/content";
import { routes, siteDescription, siteName, toPortfolioProjectRoute } from "@moment4us/shared";

export const homepageFixture = parseSitePage({
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
      heading: "Let's Tell Your Story",
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

export const portfolioProjectsFixture: PortfolioProject[] = [
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

export const portfolioListingFixture = {
  title: "Portfolio",
  hero: "Selected stories shaped with editorial polish, documentary warmth, and space for real moments to unfold.",
  sections: [
    {
      id: "selected-stories",
      heading: "Selected Stories",
      body: "Each gallery is paced like a narrative, balancing atmosphere, portrait direction, and unplanned connection.",
    },
  ],
} as const;

export const contactPageFixture = parseSitePage({
  slug: "contact",
  title: "Contact Moment4us",
  seoTitle: "Contact Moment4us",
  seoDescription: "Starter contact page copy for inquiry details and next steps.",
  hero: "Share the session, celebration, or family season you want documented and we can shape the next step from there.",
  sections: [
    {
      id: "inquiry",
      heading: "Start the conversation",
      body: "This placeholder route is ready for the final inquiry form and studio contact details that arrive in later tasks.",
    },
    {
      id: "details",
      heading: "What to share",
      body: "For now, plan to include your date, location, session type, and the feeling you want the photographs to carry.",
    },
  ],
  published: true,
  seo: {
    title: "Contact Moment4us",
    description: "Starter contact page copy for inquiry details and next steps.",
    canonicalPath: "/contact",
  },
});
