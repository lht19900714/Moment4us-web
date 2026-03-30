import { Link, useLoaderData, type LoaderFunctionArgs, type MetaFunction } from "react-router";

import { routes } from "@moment4us/shared";

import { buildSeo, toMetaDescriptors } from "../lib/seo";
import { getPortfolioListingFixtureData, type PortfolioListingLoaderData } from "../loaders/portfolio.server";

const fallbackSeo = buildSeo({
  title: "Portfolio",
  description:
    "Browse wedding, family, and portrait stories by Moment4us, crafted with warm tones and editorial storytelling.",
  pathname: routes.portfolio,
  keywords: ["portfolio photography", "wedding gallery", "family photography stories"],
});

export function loader(): PortfolioListingLoaderData;
export function loader(args: LoaderFunctionArgs): PortfolioListingLoaderData | Promise<PortfolioListingLoaderData>;
export function loader(args?: LoaderFunctionArgs) {
  if (args === undefined) {
    return getPortfolioListingFixtureData();
  }

  return import("../loaders/portfolio.server").then(({ loadPortfolioListing }) =>
    loadPortfolioListing(args.context),
  );
}

export const meta: MetaFunction<typeof loader> = ({ data }) => toMetaDescriptors(data?.seo ?? fallbackSeo);

export default function PortfolioRoute() {
  const data = useLoaderData<typeof loader>();
  const introSection = data.sections[0];

  return (
    <main className="content-page portfolio-page">
      <section className="content-page__hero">
        <p className="content-page__eyebrow">Portfolio</p>
        <h1>{data.title}</h1>
        <p className="content-page__lede">{data.hero}</p>
      </section>

      {introSection === undefined ? null : (
        <section className="section-dark-alt">
          <div className="section-inner">
            <p className="section-eyebrow">Curated Collection</p>
            <h2 className="section-heading">{introSection.heading}</h2>
            <p className="section-body">{introSection.body}</p>
          </div>
        </section>
      )}

      <section className="section-dark">
        <div className="section-inner">
          <div className="masonry-gallery" data-count={data.galleryItems.length}>
            {data.galleryItems.map((item, index) => (
              <article className="masonry-gallery__item" key={item.id}>
                <Link className="masonry-gallery__link" to={item.href}>
                  <img
                    alt={item.alt}
                    className="masonry-gallery__image"
                    height={item.height}
                    loading={index === 0 ? "eager" : "lazy"}
                    sizes={item.sizes}
                    src={item.src}
                    srcSet={item.srcSet}
                    width={item.width}
                  />
                  <div className="masonry-gallery__overlay">
                    <p className="masonry-gallery__category">{item.category}</p>
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                    <span className="portfolio-page__story-link">View Story</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
