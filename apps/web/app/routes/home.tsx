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
      <div className="home-page__inner">
        <HeroSection
          actions={[
            { label: "View Selected Stories", href: routes.portfolio, variant: "primary" },
            { label: "Start an Inquiry", href: routes.contact, variant: "secondary" },
          ]}
          aside={
            <div className="hero-proof">
              <p className="hero-proof__label">Approach</p>
              <p className="hero-proof__value">Documentary warmth with gentle guidance.</p>
              <p className="hero-proof__note">
                Sessions are paced to feel easy, connected, and true to the people in them.
              </p>
            </div>
          }
          body={sections.hero.body}
          eyebrow="Moment4us Photography Studio"
          highlights={[
            "Wedding days with honest pacing",
            "Family sessions shaped around connection",
            "Portraits that feel polished without feeling stiff",
          ]}
          title={sections.hero.heading}
        />

        <section className="home-panel">
          <div className="home-panel__intro">
            <p className="home-panel__eyebrow">Portfolio Preview</p>
            <h2>{sections["featured-portfolio"].heading}</h2>
            <p>{sections["featured-portfolio"].body}</p>
          </div>
          <MasonryGallery items={data.galleryItems} />
        </section>

        <div className="home-grid">
          <section className="home-panel">
            <p className="home-panel__eyebrow">Studio Story</p>
            <h2>{sections["about-preview"].heading}</h2>
            <p>{sections["about-preview"].body}</p>
          </section>

          <section className="home-panel">
            <p className="home-panel__eyebrow">Services</p>
            <h2>{sections["services-snapshot"].heading}</h2>
            <p>{sections["services-snapshot"].body}</p>
            <ul className="home-list">
              <li>Wedding and elopement coverage</li>
              <li>Family, maternity, and newborn sessions</li>
              <li>Portraits, branding, and seasonal stories</li>
            </ul>
          </section>
        </div>

        <div className="home-grid">
          <section className="home-panel">
            <p className="home-panel__eyebrow">Process</p>
            <h2>{sections["experience-process"].heading}</h2>
            <ol className="home-steps">
              <li>Share your story, date, and what matters most.</li>
              <li>Build a session plan with location, timing, and pacing support.</li>
              <li>Receive a polished gallery full of warm tones and real moments.</li>
            </ol>
          </section>

          <section className="home-panel">
            <p className="home-panel__eyebrow">Trust Signals</p>
            <h2>{sections["trust-signals"].heading}</h2>
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
          </section>
        </div>

        <section className="home-panel home-panel--cta">
          <p className="home-panel__eyebrow">Inquiry</p>
          <h2>{sections["inquiry-cta"].heading}</h2>
          <p>{sections["inquiry-cta"].body}</p>
          <Link className="hero-section__action hero-section__action--primary" to={routes.contact}>
            Tell Us About Your Day
          </Link>
        </section>
      </div>
    </main>
  );
}
