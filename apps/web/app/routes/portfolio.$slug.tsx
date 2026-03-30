import { Link, useLoaderData, type LoaderFunctionArgs, type MetaFunction } from "react-router";

import { buildSeo, toMetaDescriptors } from "../lib/seo";

import { routes } from "@moment4us/shared";

const fallbackSeo = buildSeo({
  title: "Portfolio",
  description: "Selected Moment4us stories.",
  pathname: routes.portfolio,
});

export async function loader({ params, context }: LoaderFunctionArgs) {
  const slug = params.slug;

  if (slug === undefined) {
    throw new Response("Portfolio project not found", { status: 404 });
  }

  const { loadPortfolioProject } = await import("../loaders/portfolio.server");
  return loadPortfolioProject(slug, context);
}

export const meta: MetaFunction<typeof loader> = ({ data }) => toMetaDescriptors(data?.seo ?? fallbackSeo);

export default function PortfolioProjectRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <main className="portfolio-detail">
      {/* Back link */}
      <Link className="portfolio-detail__back" to={routes.portfolio}>
        &larr; Back to Portfolio
      </Link>

      {/* Full-bleed hero with background image */}
      <section
        className="portfolio-detail__hero"
        style={{ backgroundImage: `url(${data.heroImage.src})` }}
      >
        <div className="portfolio-detail__hero-content">
          <p className="portfolio-detail__meta">{data.project.category}</p>
          <h1>{data.project.title}</h1>
          <p className="portfolio-detail__hero-summary">{data.project.summary}</p>
        </div>
      </section>

      {/* Story section with centered prose */}
      <section className="portfolio-detail__story">
        <div className="portfolio-detail__story-inner">
          <p className="portfolio-detail__story-eyebrow">The Story</p>
          <h2 className="portfolio-detail__story-heading">{data.project.title}</h2>
          <p className="portfolio-detail__story-text">{data.project.story}</p>
          <blockquote className="portfolio-detail__pullquote">
            &ldquo;{data.project.summary}&rdquo;
          </blockquote>
        </div>
      </section>

      {/* Editorial image gallery with visual rhythm */}
      <section className="portfolio-detail__gallery">
        <div className="portfolio-detail__gallery-inner">
          <p className="portfolio-detail__gallery-eyebrow">Editorial Sequence</p>
          {data.editorialImages.map((image, index) => {
            const isFullWidth = index === 0 || index % 3 === 0;
            if (isFullWidth) {
              return (
                <div className="portfolio-detail__gallery-row portfolio-detail__gallery-row--full" key={image.id}>
                  <figure className="portfolio-detail__gallery-figure">
                    <img
                      alt={image.alt}
                      className="portfolio-detail__gallery-image"
                      height={image.height}
                      loading={index === 0 ? "eager" : "lazy"}
                      sizes={image.sizes}
                      src={image.src}
                      srcSet={image.srcSet}
                      width={image.width}
                    />
                  </figure>
                </div>
              );
            }

            // For pair images, only render the row on the first of the pair
            const positionInGroup = index % 3;
            if (positionInGroup === 2) {
              // This is the second in a pair (index%3===2), skip — rendered with its partner
              return null;
            }

            // positionInGroup === 1: first in a pair
            const pairImage = data.editorialImages[index + 1];
            return (
              <div className="portfolio-detail__gallery-row portfolio-detail__gallery-row--pair" key={image.id}>
                <figure className="portfolio-detail__gallery-figure">
                  <img
                    alt={image.alt}
                    className="portfolio-detail__gallery-image"
                    height={image.height}
                    loading="lazy"
                    sizes="(min-width: 1040px) 36rem, (min-width: 720px) 45vw, 100vw"
                    src={image.src}
                    srcSet={image.srcSet}
                    width={image.width}
                  />
                </figure>
                {pairImage !== undefined && (
                  <figure className="portfolio-detail__gallery-figure">
                    <img
                      alt={pairImage.alt}
                      className="portfolio-detail__gallery-image"
                      height={pairImage.height}
                      loading="lazy"
                      sizes="(min-width: 1040px) 36rem, (min-width: 720px) 45vw, 100vw"
                      src={pairImage.src}
                      srcSet={pairImage.srcSet}
                      width={pairImage.width}
                    />
                  </figure>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA section with background overlay */}
      <section
        className="portfolio-detail__cta"
        style={{ backgroundImage: `url(${data.heroImage.src})` }}
      >
        <div className="portfolio-detail__cta-inner">
          <p className="section-eyebrow">Next Step</p>
          <h2 className="section-heading">Ready to plan your own story?</h2>
          <p className="section-body">
            Share your date, location, and what you want these images to feel like. We will design the
            pacing together.
          </p>
          <Link className="btn-ghost btn-ghost--filled" to={routes.contact}>
            Start Your Inquiry
          </Link>
        </div>
      </section>
    </main>
  );
}
