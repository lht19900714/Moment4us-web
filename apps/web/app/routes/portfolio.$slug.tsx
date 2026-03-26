import { useLoaderData, type LoaderFunctionArgs, type MetaFunction } from "react-router";

import { buildSeo, toMetaDescriptors } from "../lib/seo";

import { routes } from "../../../../packages/shared/src";

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
    <main className="content-page portfolio-project-page">
      <section className="content-page__hero">
        <p className="content-page__eyebrow">{data.project.category}</p>
        <h1>{data.project.title}</h1>
        <p className="content-page__lede">{data.project.summary}</p>
        <img
          alt={data.heroImage.alt}
          className="portfolio-project-page__hero-image"
          height={data.heroImage.height}
          sizes={data.heroImage.sizes}
          src={data.heroImage.src}
          srcSet={data.heroImage.srcSet}
          width={data.heroImage.width}
        />
      </section>

      <section className="content-page__section">
        <p className="content-page__eyebrow">Story Summary</p>
        <h2>The Story</h2>
        <p>{data.project.story}</p>
      </section>

      <section className="content-page__section">
        <p className="content-page__eyebrow">Editorial Sequence</p>
        <div className="portfolio-project-page__sequence">
          {data.editorialImages.map((image, index) => (
            <figure className="portfolio-project-page__figure" key={image.id}>
              <img
                alt={image.alt}
                className="portfolio-project-page__image"
                height={image.height}
                loading={index === 0 ? "eager" : "lazy"}
                sizes={image.sizes}
                src={image.src}
                srcSet={image.srcSet}
                width={image.width}
              />
            </figure>
          ))}
        </div>
      </section>

      <section className="content-page__section portfolio-project-page__cta">
        <p className="content-page__eyebrow">Next Step</p>
        <h2>Ready to plan your own story?</h2>
        <p>
          Share your date, location, and what you want these images to feel like. We will design the
          pacing together.
        </p>
        <a className="btn-ghost btn-ghost--filled" href={routes.contact}>
          Start Your Inquiry
        </a>
      </section>
    </main>
  );
}
