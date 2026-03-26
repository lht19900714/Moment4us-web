import { useLoaderData, type MetaFunction } from "react-router";

import { getPublicSitePageFixture } from "./site-page-fixtures";

const servicesPage = getPublicSitePageFixture("services");

export function loader() {
  return servicesPage;
}

export const meta: MetaFunction = () => [
  { title: servicesPage.seoTitle },
  { name: "description", content: servicesPage.seoDescription },
];

export default function ServicesRoute() {
  const page = useLoaderData<typeof loader>();

  return (
    <main className="content-page">
      <section className="content-page__hero">
        <p className="content-page__eyebrow">Services</p>
        <h1>{page.title}</h1>
        <p className="content-page__lede">{page.hero}</p>
      </section>
      <div className="content-page__sections">
        {page.sections.map((section) => (
          <section className="content-page__section" key={section.id}>
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
