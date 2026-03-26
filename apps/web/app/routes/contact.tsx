import { useLoaderData, type MetaFunction } from "react-router";

import { getPublicSitePageFixture } from "./site-page-fixtures";

const contactPage = getPublicSitePageFixture("contact");

export function loader() {
  return contactPage;
}

export const meta: MetaFunction = () => [
  { title: contactPage.seoTitle },
  { name: "description", content: contactPage.seoDescription },
];

export default function ContactRoute() {
  const page = useLoaderData<typeof loader>();

  return (
    <main className="content-page">
      <section className="content-page__hero">
        <p className="content-page__eyebrow">Contact</p>
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
