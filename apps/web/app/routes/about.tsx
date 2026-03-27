import { Link, type MetaFunction } from "react-router";

import { HeroSection } from "../components/hero-section";
import { buildSeo, toMetaDescriptors } from "../lib/seo";

import { routes } from "../../../../packages/shared/src";

const seo = buildSeo({
  title: "About Moment4us — Our Story & Philosophy",
  description:
    "Warm, documentary-leaning photography rooted in real emotion. Learn about the Moment4us studio, our approach, and what makes every session feel like home.",
  pathname: routes.about,
  keywords: [
    "about moment4us",
    "photography studio story",
    "documentary wedding photographer",
    "warm photography style",
  ],
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
          { label: "View Our Work", href: routes.portfolio, variant: "primary" },
          { label: "Get in Touch", href: routes.contact, variant: "secondary" },
        ]}
        backgroundImage="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1600&q=80"
        body="We believe the best photographs happen when people feel at ease — when the light is warm, the pace is gentle, and there is room for real connection."
        eyebrow="About the Studio"
        title="Stories Told in Warm Light"
      />

      {/* Studio Story — light section */}
      <section className="section-light">
        <div className="section-inner about-story">
          <div className="about-story__text">
            <p className="section-eyebrow" style={{ color: "var(--accent)" }}>
              Our Story
            </p>
            <h2
              className="section-heading"
              style={{ color: "var(--text-on-light)" }}
            >
              Founded on the Belief That Every Moment Matters
            </h2>
            <p className="section-body" style={{ color: "var(--text-on-light-muted)" }}>
              Moment4us grew from a simple conviction: the most meaningful photographs
              are not posed — they are felt. What began as a love for candid storytelling
              has become a studio built around warmth, patience, and genuine connection
              with every family and couple who steps in front of our lens.
            </p>
            <p className="section-body" style={{ color: "var(--text-on-light-muted)", marginTop: "1rem" }}>
              Our approach is rooted in documentary photography — the kind that values
              natural light, unhurried timelines, and the quiet in-between moments that
              most people forget to capture. Whether it is a wedding day, a growing
              family, or a quiet portrait session, we bring the same intention: to create
              a space where people can simply be themselves.
            </p>
            <p className="section-body" style={{ color: "var(--text-on-light-muted)", marginTop: "1rem" }}>
              We specialize in weddings, families, maternity, newborn, portrait, and
              branding photography — always with the same warm, story-first sensibility.
            </p>
          </div>
          <div className="about-story__image">
            <img
              alt="Photographer working with a couple during golden hour"
              className="about-story__img"
              loading="lazy"
              src="https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=80"
            />
          </div>
        </div>
      </section>

      {/* Values — dark section */}
      <section className="section-dark">
        <div className="section-inner">
          <p className="section-eyebrow">What We Stand For</p>
          <h2 className="section-heading">Three Things We Never Compromise</h2>
          <div className="card-grid">
            <div className="card-dark">
              <h3>Real Moments</h3>
              <p>
                We chase what is honest, not what is perfect. The laugh that catches
                you off guard, the tears you did not plan — those are the images that
                matter ten years from now.
              </p>
            </div>
            <div className="card-dark">
              <h3>Warm Tones</h3>
              <p>
                Our editing leans into warmth without losing texture or truth. Skin
                stays natural, light stays golden, and every frame feels like it
                belongs in the same story.
              </p>
            </div>
            <div className="card-dark">
              <h3>Guided Comfort</h3>
              <p>
                We offer gentle direction — simple prompts and unhurried pacing that
                help people relax without flattening their personality. Comfort is
                the foundation of a great photograph.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Working Style — light section */}
      <section className="section-light">
        <div className="section-inner about-working">
          <p className="section-eyebrow" style={{ color: "var(--accent)" }}>
            How We Work
          </p>
          <h2
            className="section-heading"
            style={{ color: "var(--text-on-light)" }}
          >
            What a Session Feels Like
          </h2>
          <div className="card-grid">
            <div className="card-light">
              <h3>Before the Session</h3>
              <p>
                We start with a conversation — not a questionnaire. We want to know
                your story, your timeline, and the moments that matter most to you.
                From there, we build a plan around real life, not a rigid shot list.
              </p>
            </div>
            <div className="card-light">
              <h3>During the Session</h3>
              <p>
                Expect gentle guidance, not stiff posing. We move at your pace,
                follow the light, and leave room for spontaneous moments. Whether it
                is a wedding day or a family portrait, the atmosphere stays calm and
                unhurried.
              </p>
            </div>
            <div className="card-light">
              <h3>After the Session</h3>
              <p>
                Every image is hand-edited with warm, clean tones that honor the
                original light. Your gallery arrives as a cohesive story — one you
                will want to revisit for years to come.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy quote — dark-alt section */}
      <section className="section-dark-alt">
        <div className="section-inner">
          <div className="quote-block">
            <p className="quote-text">
              &ldquo;Photography, for us, is not about creating a perfect image. It is
              about holding space for a real one — and making sure the warmth of that
              moment survives long after the day is over.&rdquo;
            </p>
            <p className="quote-attr">Moment4us Philosophy</p>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="cta-section">
        <div className="section-inner">
          <p className="section-eyebrow">Ready?</p>
          <h2 className="section-heading">
            Let Us Tell Your Story
          </h2>
          <p className="section-body">
            Whether it is a wedding, a growing family, or a quiet afternoon —
            we would love to hear what matters to you.
          </p>
          <Link className="btn-ghost btn-ghost--filled" to={routes.contact}>
            Start a Conversation
          </Link>
        </div>
      </section>
    </main>
  );
}
