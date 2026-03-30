import { Link, type MetaFunction } from "react-router";

import { HeroSection } from "../components/hero-section";
import { buildSeo, toMetaDescriptors } from "../lib/seo";

import { routes } from "@moment4us/shared";

const seo = buildSeo({
  title: "Services | Moment4us Photography",
  description:
    "Wedding, family, maternity, newborn, and portrait photography in a warm, documentary style. Learn about our approach and what every session includes.",
  pathname: routes.services,
  keywords: [
    "wedding photography",
    "family portraits",
    "maternity photography",
    "newborn photography",
    "editorial portraits",
    "photography studio services",
  ],
});

export function loader() {
  return { seo };
}

export const meta: MetaFunction<typeof loader> = ({ data }) =>
  toMetaDescriptors(data?.seo ?? seo);

/* ---- Service data ---- */

interface ServiceItem {
  title: string;
  description: string;
  includes: readonly string[];
}

const services: readonly ServiceItem[] = [
  {
    title: "Wedding & Elopement",
    description:
      "Full-day and half-day coverage from getting ready through the last dance. Intimate elopements, grand celebrations, and everything between -- documented with warmth and intention.",
    includes: [
      "Pre-wedding consultation and timeline support",
      "Coverage from ceremony through reception",
      "Professionally edited gallery within 6 weeks",
      "Online gallery with download and print access",
    ],
  },
  {
    title: "Family Sessions",
    description:
      "Indoor or outdoor lifestyle sessions that move at your family's pace. Seasonal mini sessions available throughout the year for growing families.",
    includes: [
      "60-minute session at a location of your choice",
      "Wardrobe and styling guidance",
      "40+ edited images in an online gallery",
      "Print-ready digital files",
    ],
  },
  {
    title: "Maternity",
    description:
      "Studio or on-location sessions that celebrate this quiet, expectant season. Styled or natural -- whichever feels most like you.",
    includes: [
      "45-minute studio or outdoor session",
      "Styling direction and wardrobe suggestions",
      "25+ edited images",
      "Option to pair with a newborn session",
    ],
  },
  {
    title: "Newborn",
    description:
      "In-home documentary sessions during baby's first week. No posing props or studio backdrops -- just your family settling into a new rhythm.",
    includes: [
      "In-home session within the first 14 days",
      "Relaxed, lifestyle approach at baby's pace",
      "30+ edited images in a private gallery",
      "Family and sibling portraits included",
    ],
  },
  {
    title: "Portraits",
    description:
      "Editorial, branding, headshots, or deeply personal portraits. Whether it's a milestone, a new chapter, or simply a Tuesday -- your portrait session is yours.",
    includes: [
      "30 or 60-minute session options",
      "Location scouting and creative direction",
      "20-40+ edited images depending on length",
      "Commercial licensing available for branding",
    ],
  },
  {
    title: "Custom & Editorial",
    description:
      "Brand campaigns, styled shoots, and creative direction for designers, small businesses, and publications. Collaborative from concept to final delivery.",
    includes: [
      "Creative brief and mood board development",
      "Half-day or full-day production coverage",
      "Retouching and color grading to brand spec",
      "Usage licensing tailored to your needs",
    ],
  },
];

/* ---- Process steps ---- */

interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

const processSteps: readonly ProcessStep[] = [
  {
    number: "01",
    title: "Inquire",
    description:
      "Tell us about your session -- the occasion, the feeling you want, and any ideas you have. We will get back to you within 48 hours.",
  },
  {
    number: "02",
    title: "Plan Together",
    description:
      "We will build a session plan around your timeline, location, and comfort level. Styling tips and logistics are all part of the process.",
  },
  {
    number: "03",
    title: "Receive Your Gallery",
    description:
      "Your polished gallery arrives within 2-6 weeks, full of warm tones and honest moments. Download, print, and share at any time.",
  },
];

/* ---- Component ---- */

export default function ServicesRoute() {
  return (
    <main className="services-page">
      {/* Hero */}
      <HeroSection
        actions={[
          { label: "Get in Touch", href: routes.contact, variant: "primary" },
          { label: "View Portfolio", href: routes.portfolio, variant: "secondary" },
        ]}
        backgroundImage="https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1600&q=80"
        body="Every session is shaped around the people in it. We bring warmth, patience, and an eye for the in-between moments that matter most."
        eyebrow="What We Offer"
        title="Services"
      />

      {/* Services Grid */}
      <section className="section-dark-alt">
        <div className="section-inner">
          <p className="section-eyebrow">Our Sessions</p>
          <h2 className="section-heading">Crafted Around Your Story</h2>
          <p className="section-body">
            From weddings to newborns, every session begins with a conversation. We want to understand what this moment means to you -- and build a session that reflects it.
          </p>
          <div className="card-grid services-card-grid">
            {services.map((service) => (
              <div className="card-dark services-card" key={service.title}>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul className="services-card__includes">
                  {service.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-light">
        <div className="section-inner">
          <p className="section-eyebrow" style={{ color: "var(--accent)" }}>Process</p>
          <h2 className="section-heading" style={{ color: "var(--text-on-light)" }}>How It Works</h2>
          <p className="section-body" style={{ color: "var(--text-on-light-muted)" }}>
            Working with us is meant to feel easy. Three simple steps from first message to final gallery.
          </p>
          <div className="card-grid">
            {processSteps.map((step) => (
              <div className="card-light" key={step.number}>
                <p className="section-eyebrow" style={{ color: "var(--accent)" }}>
                  {step.number}
                </p>
                <h3
                  className="section-heading"
                  style={{ color: "var(--text-on-light)", fontSize: "clamp(1.4rem, 3vw, 2rem)" }}
                >
                  {step.title}
                </h3>
                <p style={{ color: "var(--text-on-light-muted)", lineHeight: 1.7, fontWeight: 300 }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment */}
      <section className="section-dark">
        <div className="section-inner">
          <p className="section-eyebrow">Investment</p>
          <h2 className="section-heading">Thoughtful Pricing, Tailored to You</h2>
          <p className="section-body">
            Every project is unique, and your investment reflects the time, artistry, and care that goes into your images. Below are starting points -- final pricing is always customized after we learn about your vision.
          </p>
          <div className="card-grid" style={{ marginTop: "2.5rem" }}>
            <div className="card-dark">
              <h3>Portrait & Lifestyle Sessions</h3>
              <p>
                Sessions start from <strong style={{ color: "var(--accent)" }}>$350</strong>. Includes session time, professional editing, and a private online gallery.
              </p>
            </div>
            <div className="card-dark">
              <h3>Wedding & Event Coverage</h3>
              <p>
                Collections begin at <strong style={{ color: "var(--accent)" }}>$2,800</strong>. Coverage, timeline planning, and a fully edited gallery are always included.
              </p>
            </div>
            <div className="card-dark">
              <h3>Custom & Commercial</h3>
              <p>
                Priced per project based on scope, usage, and deliverables. <strong style={{ color: "var(--accent)" }}>Reach out</strong> and we will build a proposal together.
              </p>
            </div>
          </div>

          <div className="quote-block">
            <p className="quote-text">
              "Investment details are always shared during your consultation -- no surprises, just transparency."
            </p>
            <p className="quote-attr">Moment4us Studio</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="section-inner">
          <p className="section-eyebrow">Ready?</p>
          <h2 className="section-heading">Let's Create Something Beautiful</h2>
          <p className="section-body">
            Whether you have a date on the calendar or just a feeling you want to capture, we would love to hear from you. Start a conversation and we will take it from there.
          </p>
          <Link className="btn-ghost btn-ghost--filled" to={routes.contact}>
            Start Your Inquiry
          </Link>
        </div>
      </section>
    </main>
  );
}
