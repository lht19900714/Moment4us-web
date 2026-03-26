import { Link, useLoaderData, type LoaderFunctionArgs, type MetaFunction } from "react-router";

import { HeroSection } from "../components/hero-section";
import { MasonryGallery } from "../components/masonry-gallery";
import { toMetaDescriptors } from "../lib/seo";
import { loadHomePage } from "../loaders/home.server";

import { routes } from "../../../../packages/shared/src";

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
          { label: "View Selected Stories", href: routes.portfolio, variant: "primary" },
          { label: "Start an Inquiry", href: routes.contact, variant: "secondary" },
        ]}
        backgroundImage="https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80"
        body={sections.hero.body}
        eyebrow="Moment4us Photography Studio"
        title={sections.hero.heading}
      />

      {/* Portfolio Preview - dark alt */}
      <section className="section-dark-alt">
        <div className="section-inner">
          <p className="section-eyebrow">Portfolio Preview</p>
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
              <p className="section-eyebrow" style={{ color: "var(--accent)" }}>Studio Story</p>
              <h3 className="section-heading" style={{ color: "var(--text-on-light)", fontSize: "clamp(1.4rem, 3vw, 2rem)" }}>
                {sections["about-preview"].heading}
              </h3>
              <p style={{ color: "var(--text-on-light-muted)", lineHeight: 1.7, fontWeight: 300 }}>
                {sections["about-preview"].body}
              </p>
            </div>
            <div className="card-light">
              <p className="section-eyebrow" style={{ color: "var(--accent)" }}>Services</p>
              <h3 className="section-heading" style={{ color: "var(--text-on-light)", fontSize: "clamp(1.4rem, 3vw, 2rem)" }}>
                {sections["services-snapshot"].heading}
              </h3>
              <p style={{ color: "var(--text-on-light-muted)", lineHeight: 1.7, fontWeight: 300 }}>
                {sections["services-snapshot"].body}
              </p>
              <ul className="home-list" style={{ color: "var(--text-on-light-muted)" }}>
                <li>Wedding and elopement coverage</li>
                <li>Family, maternity, and newborn sessions</li>
                <li>Portraits, branding, and seasonal stories</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process + Trust - dark */}
      <section className="section-dark">
        <div className="section-inner">
          <p className="section-eyebrow">Process</p>
          <h2 className="section-heading">{sections["experience-process"].heading}</h2>
          <div className="card-grid">
            <div className="card-dark">
              <h3>01 -- Share Your Story</h3>
              <p>Share your story, date, and what matters most.</p>
            </div>
            <div className="card-dark">
              <h3>02 -- Build a Plan</h3>
              <p>Build a session plan with location, timing, and pacing support.</p>
            </div>
            <div className="card-dark">
              <h3>03 -- Receive Your Gallery</h3>
              <p>Receive a polished gallery full of warm tones and real moments.</p>
            </div>
          </div>

          <div className="card-grid" style={{ marginTop: "2.5rem" }}>
            <div className="card-dark">
              <h3>{sections["trust-signals"].heading}</h3>
              <div className="trust-signals">
                <article>
                  <strong>Guided, never rigid</strong>
                  <p>Simple prompts keep people comfortable without flattening personality.</p>
                </article>
                <article>
                  <strong>Built for real timelines</strong>
                  <p>Coverage flexes around changing light, family rhythms, and event pace.</p>
                </article>
                <article>
                  <strong>Editing with restraint</strong>
                  <p>Color and retouching stay warm and clean without losing texture or truth.</p>
                </article>
              </div>
            </div>
          </div>

          <div className="quote-block">
            <p className="quote-text">"Every session is shaped around the people in it -- not around a shot list."</p>
            <p className="quote-attr">Moment4us Philosophy</p>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="cta-section">
        <div className="section-inner">
          <p className="section-eyebrow">Ready?</p>
          <h2 className="section-heading">{sections["inquiry-cta"].heading}</h2>
          <p className="section-body">{sections["inquiry-cta"].body}</p>
          <Link className="btn-ghost btn-ghost--filled" to={routes.contact}>
            Tell Us About Your Day
          </Link>
        </div>
      </section>
    </main>
  );
}
