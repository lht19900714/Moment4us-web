import { useFetcher, useLoaderData, type ActionFunctionArgs, type LoaderFunctionArgs, type MetaFunction } from "react-router";

import { handleContactAction } from "../actions/contact.server";

import { getPublicSitePageFixture } from "./site-page-fixtures";

const contactPage = getPublicSitePageFixture("contact");

interface ContactLoaderData {
  title: string;
  seoTitle: string;
  seoDescription: string;
  hero: string;
  turnstileSiteKey: string;
}

interface ContactActionSuccess {
  ok: true;
}

interface ContactActionValidationError {
  ok: false;
  errors: Record<string, string>;
}

interface ContactActionServerError {
  ok: false;
  error: string;
}

type ContactActionResult = ContactActionSuccess | ContactActionValidationError | ContactActionServerError;

const SERVICE_OPTIONS = [
  { value: "", label: "Select a service..." },
  { value: "Wedding", label: "Wedding" },
  { value: "Family", label: "Family" },
  { value: "Maternity", label: "Maternity" },
  { value: "Newborn", label: "Newborn" },
  { value: "Portrait", label: "Portrait" },
  { value: "Branding", label: "Branding" },
  { value: "Other", label: "Other" },
];

export async function loader({ context }: LoaderFunctionArgs) {
  const siteKey = (context as Record<string, unknown> | undefined)?.cloudflare
    ? ((context as { cloudflare?: { env?: { TURNSTILE_SITE_KEY?: string } } }).cloudflare?.env?.TURNSTILE_SITE_KEY ?? "")
    : "";

  return {
    title: contactPage.title,
    seoTitle: contactPage.seoTitle,
    seoDescription: contactPage.seoDescription,
    hero: contactPage.hero,
    turnstileSiteKey: siteKey,
  } satisfies ContactLoaderData;
}

export async function action({ request, context }: ActionFunctionArgs) {
  return handleContactAction(request, context as Parameters<typeof handleContactAction>[1]);
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: data?.seoTitle ?? contactPage.seoTitle },
  { name: "description", content: data?.seoDescription ?? contactPage.seoDescription },
];

export default function ContactRoute() {
  const data = useLoaderData<typeof loader>();
  const fetcher = useFetcher<ContactActionResult>();

  const isSubmitting = fetcher.state === "submitting";
  const result = fetcher.data;
  const isSuccess = result?.ok === true;
  const fieldErrors = result && !result.ok && "errors" in result ? result.errors : undefined;
  const serverError = result && !result.ok && "error" in result ? result.error : undefined;

  return (
    <main className="content-page">
      <section className="content-page__hero">
        <p className="content-page__eyebrow">Contact</p>
        <h1>{data.title}</h1>
        <p className="content-page__lede">{data.hero}</p>
      </section>

      <section className="section-dark-alt">
        <div className="section-inner">
          {isSuccess ? (
            <div className="contact-form__success" role="status">
              <h2>Thank you for your inquiry</h2>
              <p>
                We received your message and will be in touch soon. We typically respond within one
                to two business days.
              </p>
            </div>
          ) : (
            <fetcher.Form className="contact-form" method="post">
              <h2>Start the conversation</h2>
              <p className="contact-form__intro">
                Share the details of your session, celebration, or family season and we will shape
                the next step from there.
              </p>

              {serverError && (
                <p className="contact-form__server-error" role="alert">
                  {serverError}
                </p>
              )}

              <div className="contact-form__row">
                <div className="contact-form__field">
                  <label className="contact-form__label" htmlFor="contact-name">
                    Name <span aria-hidden="true">*</span>
                  </label>
                  <input
                    aria-describedby={fieldErrors?.name ? "contact-name-error" : undefined}
                    aria-invalid={fieldErrors?.name ? true : undefined}
                    autoComplete="name"
                    className="contact-form__input"
                    id="contact-name"
                    name="name"
                    required
                    type="text"
                  />
                  {fieldErrors?.name && (
                    <p className="contact-form__error" id="contact-name-error" role="alert">
                      {fieldErrors.name}
                    </p>
                  )}
                </div>

                <div className="contact-form__field">
                  <label className="contact-form__label" htmlFor="contact-email">
                    Email <span aria-hidden="true">*</span>
                  </label>
                  <input
                    aria-describedby={fieldErrors?.email ? "contact-email-error" : undefined}
                    aria-invalid={fieldErrors?.email ? true : undefined}
                    autoComplete="email"
                    className="contact-form__input"
                    id="contact-email"
                    name="email"
                    required
                    type="email"
                  />
                  {fieldErrors?.email && (
                    <p className="contact-form__error" id="contact-email-error" role="alert">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="contact-form__row">
                <div className="contact-form__field">
                  <label className="contact-form__label" htmlFor="contact-phone">
                    Phone
                  </label>
                  <input
                    autoComplete="tel"
                    className="contact-form__input"
                    id="contact-phone"
                    name="phone"
                    type="tel"
                  />
                </div>

                <div className="contact-form__field">
                  <label className="contact-form__label" htmlFor="contact-date">
                    Preferred date
                  </label>
                  <input
                    className="contact-form__input"
                    id="contact-date"
                    name="eventDate"
                    type="date"
                  />
                </div>
              </div>

              <div className="contact-form__field">
                <label className="contact-form__label" htmlFor="contact-service">
                  Service type <span aria-hidden="true">*</span>
                </label>
                <select
                  aria-describedby={fieldErrors?.serviceType ? "contact-service-error" : undefined}
                  aria-invalid={fieldErrors?.serviceType ? true : undefined}
                  className="contact-form__select"
                  id="contact-service"
                  name="serviceType"
                  required
                >
                  {SERVICE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {fieldErrors?.serviceType && (
                  <p className="contact-form__error" id="contact-service-error" role="alert">
                    {fieldErrors.serviceType}
                  </p>
                )}
              </div>

              <div className="contact-form__field">
                <label className="contact-form__label" htmlFor="contact-message">
                  Message <span aria-hidden="true">*</span>
                </label>
                <textarea
                  aria-describedby={fieldErrors?.message ? "contact-message-error" : undefined}
                  aria-invalid={fieldErrors?.message ? true : undefined}
                  className="contact-form__textarea"
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                />
                {fieldErrors?.message && (
                  <p className="contact-form__error" id="contact-message-error" role="alert">
                    {fieldErrors.message}
                  </p>
                )}
              </div>

              {fieldErrors?.turnstile && (
                <p className="contact-form__error" role="alert">
                  {fieldErrors.turnstile}
                </p>
              )}

              {data.turnstileSiteKey && (
                <div className="cf-turnstile" data-sitekey={data.turnstileSiteKey} />
              )}

              <button
                className="contact-form__submit btn-ghost btn-ghost--filled"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Sending..." : "Send Inquiry"}
              </button>
            </fetcher.Form>
          )}
        </div>
      </section>
    </main>
  );
}
