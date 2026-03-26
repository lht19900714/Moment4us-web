import { Link, useLoaderData, type LoaderFunctionArgs, type MetaFunction } from "react-router";

import { buildSeo, toMetaDescriptors, type BuiltSeo } from "../lib/seo";

import { routes } from "../../../../packages/shared/src";

interface PortfolioSection {
  id: string;
  heading: string;
  body: string;
}

interface PortfolioGalleryItem {
  id: string;
  href: string;
  title: string;
  category: string;
  summary: string;
  alt: string;
  width: number;
  height: number;
  src: string;
  srcSet: string;
  sizes: string;
}

interface PortfolioRouteLoaderData {
  title: string;
  hero: string;
  sections: PortfolioSection[];
  galleryItems: PortfolioGalleryItem[];
  seo: BuiltSeo;
}

const fallbackSeo = buildSeo({
  title: "Portfolio",
  description:
    "Browse wedding, family, and portrait stories by Moment4us, crafted with warm tones and editorial storytelling.",
  pathname: routes.portfolio,
  keywords: ["portfolio photography", "wedding gallery", "family photography stories"],
});

const listingFixtureData: PortfolioRouteLoaderData = {
  title: "Portfolio",
  hero: "Selected stories shaped with editorial polish, documentary warmth, and space for real moments to unfold.",
  sections: [
    {
      id: "selected-stories",
      heading: "Selected Stories",
      body: "Each gallery is paced like a narrative, balancing atmosphere, portrait direction, and unplanned connection.",
    },
  ],
  galleryItems: [
    {
      id: "harbor-vows",
      href: "/portfolio/harbor-vows",
      title: "Harbor Vows",
      category: "Wedding",
      summary: "Golden-hour portraits and a candlelit dinner by the water.",
      alt: "Harbor Vows: Golden-hour portraits and a candlelit dinner by the water.",
      width: 960,
      height: 1280,
      src: "https://imagedelivery.net/moment4us-demo/harbor-vows-cover/public/width=960,height=1280,fit=cover",
      srcSet:
        "https://imagedelivery.net/moment4us-demo/harbor-vows-cover/public/width=400,height=1280,fit=cover 400w, https://imagedelivery.net/moment4us-demo/harbor-vows-cover/public/width=640,height=1280,fit=cover 640w, https://imagedelivery.net/moment4us-demo/harbor-vows-cover/public/width=960,height=1280,fit=cover 960w",
      sizes: "(min-width: 1100px) 30vw, (min-width: 720px) 45vw, 100vw",
    },
  ],
  seo: fallbackSeo,
};

export function loader(): PortfolioRouteLoaderData;
export function loader(args: LoaderFunctionArgs): PortfolioRouteLoaderData | Promise<PortfolioRouteLoaderData>;
export function loader(args?: LoaderFunctionArgs) {
  if (args === undefined) {
    return listingFixtureData;
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
        <section className="content-page__section portfolio-page__intro">
          <p className="content-page__eyebrow">Curated Collection</p>
          <h2>{introSection.heading}</h2>
          <p>{introSection.body}</p>
        </section>
      )}

      <section className="content-page__section">
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
      </section>
    </main>
  );
}
