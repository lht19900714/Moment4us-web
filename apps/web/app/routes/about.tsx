import { Link, type MetaFunction } from "react-router";

import { HeroSection } from "../components/hero-section";
import { aboutContent } from "../content/about";
import { images } from "../content/site";
import { buildSeo, toMetaDescriptors } from "../lib/seo";

import { routes } from "@moment4us/shared";

const seo = buildSeo({
  title: aboutContent.seo.title,
  description: aboutContent.seo.description,
  pathname: routes.about,
  keywords: [...aboutContent.seo.keywords],
});

export function loader() {
  return { seo };
}

export const meta: MetaFunction<typeof loader> = ({ data }) =>
  toMetaDescriptors(data?.seo ?? seo);

export default function AboutRoute() {
  return (
    <main className="about-page">
      {/* Hero */}
      <HeroSection
        actions={[
          { label: aboutContent.hero.primaryCta, href: routes.portfolio, variant: "primary" },
          { label: aboutContent.hero.secondaryCta, href: routes.contact, variant: "secondary" },
        ]}
        backgroundImage={images.aboutHero}
        body={aboutContent.hero.body}
        eyebrow={aboutContent.hero.eyebrow}
        title={aboutContent.hero.title}
      />

      {/* Studio Story — light section */}
      <section className="section-light">
        <div className="section-inner about-story">
          <div className="about-story__text">
            <p className="section-eyebrow" style={{ color: "var(--accent)" }}>
              {aboutContent.story.eyebrow}
            </p>
            <h2
              className="section-heading"
              style={{ color: "var(--text-on-light)" }}
            >
              {aboutContent.story.heading}
            </h2>
            {aboutContent.story.paragraphs.map((paragraph, index) => (
              <p
                className="section-body"
                key={index}
                style={{ color: "var(--text-on-light-muted)", ...(index > 0 ? { marginTop: "1rem" } : {}) }}
              >
                {paragraph}
              </p>
            ))}
          </div>
          <div className="about-story__image">
            <img
              alt={images.aboutStoryAlt}
              className="about-story__img"
              loading="lazy"
              src={images.aboutStory}
            />
          </div>
        </div>
      </section>

      {/* Values — dark section */}
      <section className="section-dark">
        <div className="section-inner">
          <p className="section-eyebrow">{aboutContent.values.eyebrow}</p>
          <h2 className="section-heading">{aboutContent.values.heading}</h2>
          <div className="card-grid">
            {aboutContent.values.items.map((item) => (
              <div className="card-dark" key={item.heading}>
                <h3>{item.heading}</h3>
                <p>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Working Style — light section */}
      <section className="section-light">
        <div className="section-inner about-working">
          <p className="section-eyebrow" style={{ color: "var(--accent)" }}>
            {aboutContent.workingStyle.eyebrow}
          </p>
          <h2
            className="section-heading"
            style={{ color: "var(--text-on-light)" }}
          >
            {aboutContent.workingStyle.heading}
          </h2>
          <div className="card-grid">
            {aboutContent.workingStyle.items.map((item) => (
              <div className="card-light" key={item.heading}>
                <h3>{item.heading}</h3>
                <p>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy quote — dark-alt section */}
      <section className="section-dark-alt">
        <div className="section-inner">
          <div className="quote-block">
            <p className="quote-text">
              {aboutContent.quote.text}
            </p>
            <p className="quote-attr">{aboutContent.quote.attribution}</p>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="cta-section">
        <div className="section-inner">
          <p className="section-eyebrow">{aboutContent.cta.eyebrow}</p>
          <h2 className="section-heading">
            {aboutContent.cta.heading}
          </h2>
          <p className="section-body">
            {aboutContent.cta.body}
          </p>
          <Link className="btn-ghost btn-ghost--filled" to={routes.contact}>
            {aboutContent.cta.buttonLabel}
          </Link>
        </div>
      </section>
    </main>
  );
}
