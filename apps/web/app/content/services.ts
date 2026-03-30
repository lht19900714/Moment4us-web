export interface ServiceItem {
  title: string;
  description: string;
  includes: readonly string[];
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface PricingItem {
  heading: string;
  body: string;
  price?: string;
  ctaText?: string;
}

export const servicesContent = {
  seo: {
    title: "Services | Moment4us Photography",
    description: "Wedding, family, maternity, newborn, and portrait photography in a warm, documentary style. Learn about our approach and what every session includes.",
    keywords: [
      "wedding photography",
      "family portraits",
      "maternity photography",
      "newborn photography",
      "editorial portraits",
      "photography studio services",
    ],
  },
  hero: {
    eyebrow: "What We Offer",
    title: "Services",
    body: "Every session is shaped around the people in it. We bring warmth, patience, and an eye for the in-between moments that matter most.",
    primaryCta: "Get in Touch",
    secondaryCta: "View Portfolio",
  },
  servicesGrid: {
    eyebrow: "Our Sessions",
    heading: "Crafted Around Your Story",
    body: "From weddings to newborns, every session begins with a conversation. We want to understand what this moment means to you -- and build a session that reflects it.",
  },
  services: [
    {
      title: "Wedding & Elopement",
      description: "Full-day and half-day coverage from getting ready through the last dance. Intimate elopements, grand celebrations, and everything between -- documented with warmth and intention.",
      includes: [
        "Pre-wedding consultation and timeline support",
        "Coverage from ceremony through reception",
        "Professionally edited gallery within 6 weeks",
        "Online gallery with download and print access",
      ],
    },
    {
      title: "Family Sessions",
      description: "Indoor or outdoor lifestyle sessions that move at your family's pace. Seasonal mini sessions available throughout the year for growing families.",
      includes: [
        "60-minute session at a location of your choice",
        "Wardrobe and styling guidance",
        "40+ edited images in an online gallery",
        "Print-ready digital files",
      ],
    },
    {
      title: "Maternity",
      description: "Studio or on-location sessions that celebrate this quiet, expectant season. Styled or natural -- whichever feels most like you.",
      includes: [
        "45-minute studio or outdoor session",
        "Styling direction and wardrobe suggestions",
        "25+ edited images",
        "Option to pair with a newborn session",
      ],
    },
    {
      title: "Newborn",
      description: "In-home documentary sessions during baby's first week. No posing props or studio backdrops -- just your family settling into a new rhythm.",
      includes: [
        "In-home session within the first 14 days",
        "Relaxed, lifestyle approach at baby's pace",
        "30+ edited images in a private gallery",
        "Family and sibling portraits included",
      ],
    },
    {
      title: "Portraits",
      description: "Editorial, branding, headshots, or deeply personal portraits. Whether it's a milestone, a new chapter, or simply a Tuesday -- your portrait session is yours.",
      includes: [
        "30 or 60-minute session options",
        "Location scouting and creative direction",
        "20-40+ edited images depending on length",
        "Commercial licensing available for branding",
      ],
    },
    {
      title: "Custom & Editorial",
      description: "Brand campaigns, styled shoots, and creative direction for designers, small businesses, and publications. Collaborative from concept to final delivery.",
      includes: [
        "Creative brief and mood board development",
        "Half-day or full-day production coverage",
        "Retouching and color grading to brand spec",
        "Usage licensing tailored to your needs",
      ],
    },
  ] satisfies ServiceItem[],
  process: {
    eyebrow: "Process",
    heading: "How It Works",
    body: "Working with us is meant to feel easy. Three simple steps from first message to final gallery.",
    steps: [
      {
        number: "01",
        title: "Inquire",
        description: "Tell us about your session -- the occasion, the feeling you want, and any ideas you have. We will get back to you within 48 hours.",
      },
      {
        number: "02",
        title: "Plan Together",
        description: "We will build a session plan around your timeline, location, and comfort level. Styling tips and logistics are all part of the process.",
      },
      {
        number: "03",
        title: "Receive Your Gallery",
        description: "Your polished gallery arrives within 2-6 weeks, full of warm tones and honest moments. Download, print, and share at any time.",
      },
    ] satisfies ProcessStep[],
  },
  investment: {
    eyebrow: "Investment",
    heading: "Thoughtful Pricing, Tailored to You",
    body: "Every project is unique, and your investment reflects the time, artistry, and care that goes into your images. Below are starting points -- final pricing is always customized after we learn about your vision.",
    items: [
      {
        heading: "Portrait & Lifestyle Sessions",
        price: "$350",
        body: "Includes session time, professional editing, and a private online gallery.",
      },
      {
        heading: "Wedding & Event Coverage",
        price: "$2,800",
        body: "Coverage, timeline planning, and a fully edited gallery are always included.",
      },
      {
        heading: "Custom & Commercial",
        ctaText: "Reach out",
        body: "Priced per project based on scope, usage, and deliverables.",
      },
    ] satisfies PricingItem[],
    quote: {
      text: "\"Investment details are always shared during your consultation -- no surprises, just transparency.\"",
      attribution: "Moment4us Studio",
    },
  },
  cta: {
    eyebrow: "Ready?",
    heading: "Let\u2019s Create Something Beautiful",
    body: "Whether you have a date on the calendar or just a feeling you want to capture, we would love to hear from you. Start a conversation and we will take it from there.",
    buttonLabel: "Start Your Inquiry",
  },
} as const;
