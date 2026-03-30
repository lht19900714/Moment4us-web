import {
  useFetcher,
  useLoaderData,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "react-router";
import { useState } from "react";

import { parseSitePage } from "@moment4us/content";
import { createSitePagesRepository, type D1DatabaseLike } from "@moment4us/data";

interface CloudflareContext {
  cloudflare?: {
    env?: {
      DB?: D1DatabaseLike;
    };
  };
}

interface PageItem {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  hero: string;
  published: boolean;
}

interface PagesLoaderData {
  pages: PageItem[];
}

export async function loader({ context }: LoaderFunctionArgs): Promise<PagesLoaderData> {
  const cfContext = context as CloudflareContext;
  const db = cfContext?.cloudflare?.env?.DB;

  if (!db) {
    return { pages: [] };
  }

  const repo = createSitePagesRepository(db);
  const pages = await repo.listPages();

  return {
    pages: pages.map((p) => ({
      slug: p.slug,
      title: p.title,
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      hero: p.hero,
      published: p.published,
    })),
  };
}

interface PageActionSuccess {
  ok: true;
}

interface PageActionError {
  ok: false;
  error: string;
}

type PageActionResult = PageActionSuccess | PageActionError;

export async function action({ request, context }: ActionFunctionArgs): Promise<PageActionResult> {
  const cfContext = context as CloudflareContext;
  const db = cfContext?.cloudflare?.env?.DB;

  if (!db) {
    return { ok: false, error: "Database not configured." };
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return { ok: false, error: "Unable to process the form." };
  }

  const slug = getString(formData, "slug");
  const title = getString(formData, "title");
  const seoTitle = getString(formData, "seoTitle");
  const seoDescription = getString(formData, "seoDescription");
  const hero = getString(formData, "hero");
  const published = formData.get("published") === "on";

  if (!slug || !title || !seoTitle || !seoDescription || !hero) {
    return { ok: false, error: "All fields are required." };
  }

  try {
    const page = parseSitePage({
      slug,
      title,
      seoTitle,
      seoDescription,
      hero,
      sections: [],
      published,
    });

    const repo = createSitePagesRepository(db);
    await repo.upsertPage(page);

    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to save page." };
  }
}

export const meta: MetaFunction = () => [{ title: "Pages | Admin | Moment4us" }];

function getString(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export default function AdminPagesRoute() {
  const data = useLoaderData<typeof loader>();
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  return (
    <div className="admin-pages">
      <h1 className="admin-page-title">Pages</h1>
      <p className="admin-page-subtitle">
        {data.pages.length} pages — Edit SEO metadata and hero text for database-managed pages.
        About and Services pages use editorial layouts that are coded directly.
      </p>

      {data.pages.length === 0 ? (
        <p className="admin-empty">No pages configured.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Slug</th>
                <th>Title</th>
                <th>SEO Title</th>
                <th>Published</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.pages.map((page) => (
                <tr key={page.slug}>
                  <td>{page.slug}</td>
                  <td>{page.title}</td>
                  <td className="admin-table__truncate">{page.seoTitle}</td>
                  <td>{page.published ? "Yes" : "No"}</td>
                  <td>
                    <button
                      className="admin-link"
                      type="button"
                      onClick={() => setEditingSlug(editingSlug === page.slug ? null : page.slug)}
                    >
                      {editingSlug === page.slug ? "Close" : "Edit"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingSlug && (
        <PageEditForm
          page={data.pages.find((p) => p.slug === editingSlug)!}
          onClose={() => setEditingSlug(null)}
        />
      )}
    </div>
  );
}

function PageEditForm({ page, onClose }: { page: PageItem; onClose: () => void }) {
  const fetcher = useFetcher<PageActionResult>();
  const isSubmitting = fetcher.state === "submitting";
  const result = fetcher.data;
  const error = result && !result.ok ? result.error : undefined;
  const success = result?.ok === true;

  return (
    <div className="admin-page-edit">
      <div className="admin-page-edit__header">
        <h2>Edit: {page.slug}</h2>
        <button type="button" className="admin-link" onClick={onClose}>
          Close
        </button>
      </div>

      {error && (
        <p className="admin-form-error" role="alert">
          {error}
        </p>
      )}

      {success && (
        <p className="admin-form-success" role="status">
          Page updated successfully.
        </p>
      )}

      <fetcher.Form method="post" className="admin-form">
        <input type="hidden" name="slug" value={page.slug} />

        <div className="contact-form__field">
          <label className="contact-form__label" htmlFor={`page-title-${page.slug}`}>
            Title <span>*</span>
          </label>
          <input
            className="contact-form__input"
            id={`page-title-${page.slug}`}
            name="title"
            required
            type="text"
            defaultValue={page.title}
          />
        </div>

        <div className="contact-form__field">
          <label className="contact-form__label" htmlFor={`page-hero-${page.slug}`}>
            Hero Text <span>*</span>
          </label>
          <textarea
            className="contact-form__textarea"
            id={`page-hero-${page.slug}`}
            name="hero"
            required
            rows={3}
            defaultValue={page.hero}
          />
        </div>

        <div className="admin-form__row">
          <div className="contact-form__field">
            <label className="contact-form__label" htmlFor={`page-seo-title-${page.slug}`}>
              SEO Title <span>*</span>
            </label>
            <input
              className="contact-form__input"
              id={`page-seo-title-${page.slug}`}
              name="seoTitle"
              required
              type="text"
              defaultValue={page.seoTitle}
            />
          </div>

          <div className="contact-form__field">
            <label className="contact-form__label" htmlFor={`page-seo-desc-${page.slug}`}>
              SEO Description <span>*</span>
            </label>
            <input
              className="contact-form__input"
              id={`page-seo-desc-${page.slug}`}
              name="seoDescription"
              required
              type="text"
              defaultValue={page.seoDescription}
            />
          </div>
        </div>

        <div className="admin-form__checkbox">
          <input
            id={`page-published-${page.slug}`}
            name="published"
            type="checkbox"
            defaultChecked={page.published}
          />
          <label htmlFor={`page-published-${page.slug}`}>Published</label>
        </div>

        <button
          className="btn-ghost btn-ghost--filled"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Saving..." : "Save Page"}
        </button>
      </fetcher.Form>
    </div>
  );
}
