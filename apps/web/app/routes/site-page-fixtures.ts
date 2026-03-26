import { parseSitePage, type SitePage } from "../../../../packages/content/src";

type PublicSitePageSlug = "portfolio" | "about" | "services" | "contact";

const publicSitePages = {
  portfolio: parseSitePage({
    slug: "portfolio",
    title: "Portfolio",
    seoTitle: "Portfolio",
    seoDescription: "A placeholder overview for the Moment4us portfolio route.",
    hero: "A simple placeholder route for selected stories until the full portfolio listing arrives.",
    sections: [
      {
        id: "portfolio-placeholder",
        heading: "Selected stories are coming next",
        body: "This page keeps the public shell navigation truthful while the real portfolio listing and project routes are built in Task 7.",
      },
    ],
    published: true,
    seo: {
      title: "Portfolio",
      description: "A placeholder overview for the Moment4us portfolio route.",
      canonicalPath: "/portfolio",
    },
  }),
  about: parseSitePage({
    slug: "about",
    title: "About Moment4us",
    seoTitle: "About Moment4us",
    seoDescription: "Learn how Moment4us approaches calm, story-first photography sessions.",
    hero: "A warm, guided approach to photographing the people and moments that matter.",
    sections: [
      {
        id: "studio-story",
        heading: "A calm, story-first studio",
        body: "Moment4us is being shaped for couples and families who want natural direction, honest pacing, and photographs that still feel like them.",
      },
      {
        id: "working-style",
        heading: "How we work",
        body: "This placeholder page marks the space for the studio story, values, and process notes that will be expanded in the next content pass.",
      },
    ],
    published: true,
    seo: {
      title: "About Moment4us",
      description: "Learn how Moment4us approaches calm, story-first photography sessions.",
      canonicalPath: "/about",
    },
  }),
  services: parseSitePage({
    slug: "services",
    title: "Photography services",
    seoTitle: "Photography services",
    seoDescription: "Starter service overview for weddings, families, portraits, and custom sessions.",
    hero: "Flexible session coverage designed to keep the day grounded and the photographs honest.",
    sections: [
      {
        id: "coverage",
        heading: "Coverage designed around real moments",
        body: "The services page will outline wedding, family, portrait, and seasonal session formats without overcomplicating the booking conversation.",
      },
      {
        id: "planning",
        heading: "What sessions can include",
        body: "Expect planning guidance, location recommendations, pacing support, and simple deliverables language once the final service copy is ready.",
      },
    ],
    published: true,
    seo: {
      title: "Photography services",
      description: "Starter service overview for weddings, families, portraits, and custom sessions.",
      canonicalPath: "/services",
    },
  }),
  contact: parseSitePage({
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
  }),
} satisfies Record<PublicSitePageSlug, SitePage>;

export function getPublicSitePageFixture(slug: PublicSitePageSlug): SitePage {
  return publicSitePages[slug];
}
