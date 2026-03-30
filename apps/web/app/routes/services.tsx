import { Link, type MetaFunction } from "react-router";

import { HeroSection } from "../components/hero-section";
import { servicesContent } from "../content/services";
import { images } from "../content/site";
import { buildSeo, toMetaDescriptors } from "../lib/seo";

import { routes } from "@moment4us/shared";

const seo = buildSeo({
  title: servicesContent.seo.title,
  description: servicesContent.seo.description,
  pathname: routes.services,
  keywords: [...servicesContent.seo.keywords],
});

export function loader() {
  return { seo };
}

export const meta: MetaFunction<typeof loader> = ({ data }) =>
  toMetaDescriptors(data?.seo ?? seo);

/* ---- Component ---- */

export default function ServicesRoute() {
  return (
    <main className="services-page">
      {/* Hero */}
      <HeroSection
        actions={[
          { label: servicesContent.hero.primaryCta, href: routes.contact, variant: "primary" },
          { label: servicesContent.hero.secondaryCta, href: routes.portfolio, variant: "secondary" },
        ]}
        backgroundImage={images.servicesHero}
        body={servicesContent.hero.body}
        eyebrow={servicesContent.hero.eyebrow}
        title={servicesContent.hero.title}
      />

      {/* Services Grid */}
      <section className="section-dark-alt">
        <div className="section-inner">
          <p className="section-eyebrow">{servicesContent.servicesGrid.eyebrow}</p>
          <h2 className="section-heading">{servicesContent.servicesGrid.heading}</h2>
          <p className="section-body">
            {servicesContent.servicesGrid.body}
          </p>
          <div className="card-grid services-card-grid">
            {servicesContent.services.map((service) => (
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
          <p className="section-eyebrow" style={{ color: "var(--accent)" }}>{servicesContent.process.eyebrow}</p>
          <h2 className="section-heading" style={{ color: "var(--text-on-light)" }}>{servicesContent.process.heading}</h2>
          <p className="section-body" style={{ color: "var(--text-on-light-muted)" }}>
            {servicesContent.process.body}
          </p>
          <div className="card-grid">
            {servicesContent.process.steps.map((step) => (
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
          <p className="section-eyebrow">{servicesContent.investment.eyebrow}</p>
          <h2 className="section-heading">{servicesContent.investment.heading}</h2>
          <p className="section-body">
            {servicesContent.investment.body}
          </p>
          <div className="card-grid" style={{ marginTop: "2.5rem" }}>
            {servicesContent.investment.items.map((item) => (
              <div className="card-dark" key={item.heading}>
                <h3>{item.heading}</h3>
                <p>
                  {item.price ? (
                    <>Sessions start from <strong style={{ color: "var(--accent)" }}>{item.price}</strong>. {item.body}</>
                  ) : item.ctaText ? (
                    <>{item.body}. <strong style={{ color: "var(--accent)" }}>{item.ctaText}</strong> and we will build a proposal together.</>
                  ) : (
                    item.body
                  )}
                </p>
              </div>
            ))}
          </div>

          <div className="quote-block">
            <p className="quote-text">
              {servicesContent.investment.quote.text}
            </p>
            <p className="quote-attr">{servicesContent.investment.quote.attribution}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="section-inner">
          <p className="section-eyebrow">{servicesContent.cta.eyebrow}</p>
          <h2 className="section-heading">{servicesContent.cta.heading}</h2>
          <p className="section-body">
            {servicesContent.cta.body}
          </p>
          <Link className="btn-ghost btn-ghost--filled" to={routes.contact}>
            {servicesContent.cta.buttonLabel}
          </Link>
        </div>
      </section>
    </main>
  );
}
