import { Link, useLoaderData, type LoaderFunctionArgs, type MetaFunction } from "react-router";

import { HeroSection } from "../components/hero-section";
import { MasonryGallery } from "../components/masonry-gallery";
import { homeContent } from "../content/home";
import { images } from "../content/site";
import { toMetaDescriptors } from "../lib/seo";
import { loadHomePage } from "../loaders/home.server";

import { routes } from "@moment4us/shared";

export async function loader({ context }: LoaderFunctionArgs) {
  return loadHomePage(context);
}

export const meta: MetaFunction<typeof loader> = ({ data }) =>
  toMetaDescriptors(
    data?.seo ?? {
      title: "Moment4us",
      description: "Warm, authentic photography for real stories.",
      canonical: "https://moment4us.com/",
      openGraph: {
        title: "Moment4us",
        description: "Warm, authentic photography for real stories.",
        type: "website",
        url: "https://moment4us.com/",
        image: "https://moment4us.com/og/default.jpg",
        locale: "en",
        siteName: "Moment4us",
      },
      twitter: {
        card: "summary_large_image",
        title: "Moment4us",
        description: "Warm, authentic photography for real stories.",
        image: "https://moment4us.com/og/default.jpg",
      },
    },
  );

export default function HomeRoute() {
  const data = useLoaderData<typeof loader>();
  const { sections } = data;

  return (
    <main className="home-page">
      <HeroSection
        actions={[
          { label: homeContent.hero.primaryCta, href: routes.portfolio, variant: "primary" },
          { label: homeContent.hero.secondaryCta, href: routes.contact, variant: "secondary" },
        ]}
        backgroundImage={images.homeHero}
        body={sections.hero.body}
        eyebrow={homeContent.hero.eyebrow}
        title={sections.hero.heading}
      />

      {/* Portfolio Preview - dark alt */}
      <section className="section-dark-alt">
        <div className="section-inner">
          <p className="section-eyebrow">{homeContent.portfolioPreview.eyebrow}</p>
          <h2 className="section-heading">{sections["featured-portfolio"].heading}</h2>
          <p className="section-body">{sections["featured-portfolio"].body}</p>
          <MasonryGallery items={data.galleryItems} />
        </div>
      </section>

      {/* About + Services - light */}
      <section className="section-light">
        <div className="section-inner">
          <div className="card-grid">
            <div className="card-light">
              <p className="section-eyebrow" style={{ color: "var(--accent)" }}>{homeContent.aboutCard.eyebrow}</p>
              <h3 className="section-heading" style={{ color: "var(--text-on-light)", fontSize: "clamp(1.4rem, 3vw, 2rem)" }}>
                {sections["about-preview"].heading}
              </h3>
              <p style={{ color: "var(--text-on-light-muted)", lineHeight: 1.7, fontWeight: 300 }}>
                {sections["about-preview"].body}
              </p>
            </div>
            <div className="card-light">
              <p className="section-eyebrow" style={{ color: "var(--accent)" }}>{homeContent.servicesCard.eyebrow}</p>
              <h3 className="section-heading" style={{ color: "var(--text-on-light)", fontSize: "clamp(1.4rem, 3vw, 2rem)" }}>
                {sections["services-snapshot"].heading}
              </h3>
              <p style={{ color: "var(--text-on-light-muted)", lineHeight: 1.7, fontWeight: 300 }}>
                {sections["services-snapshot"].body}
              </p>
              <ul className="home-list" style={{ color: "var(--text-on-light-muted)" }}>
                {homeContent.servicesCard.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process + Trust - dark */}
      <section className="section-dark">
        <div className="section-inner">
          <p className="section-eyebrow">{homeContent.process.eyebrow}</p>
          <h2 className="section-heading">{sections["experience-process"].heading}</h2>
          <div className="card-grid">
            {homeContent.process.steps.map((step) => (
              <div className="card-dark" key={step.heading}>
                <h3>{step.heading}</h3>
                <p>{step.body}</p>
              </div>
            ))}
          </div>

          <div className="card-grid" style={{ marginTop: "2.5rem" }}>
            <div className="card-dark">
              <h3>{sections["trust-signals"].heading}</h3>
              <div className="trust-signals">
                {homeContent.trustSignals.map((signal) => (
                  <article key={signal.heading}>
                    <strong>{signal.heading}</strong>
                    <p>{signal.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="quote-block">
            <p className="quote-text">{homeContent.quote.text}</p>
            <p className="quote-attr">{homeContent.quote.attribution}</p>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="cta-section">
        <div className="section-inner">
          <p className="section-eyebrow">{homeContent.cta.eyebrow}</p>
          <h2 className="section-heading">{sections["inquiry-cta"].heading}</h2>
          <p className="section-body">{sections["inquiry-cta"].body}</p>
          <Link className="btn-ghost btn-ghost--filled" to={routes.contact}>
            {homeContent.cta.buttonLabel}
          </Link>
        </div>
      </section>
    </main>
  );
}
