import { redirect, useFetcher, type ActionFunctionArgs, type MetaFunction } from "react-router";

import { parsePortfolioProject } from "../../../../packages/content/src";
import { createPortfolioProjectsRepository, type D1DatabaseLike } from "../../../../packages/data/src";

interface CloudflareContext {
  cloudflare?: {
    env?: {
      DB?: D1DatabaseLike;
      IMAGES_BUCKET?: unknown;
    };
  };
}

interface ProjectActionError {
  ok: false;
  error: string;
}

type ProjectActionResult = ProjectActionError;

export async function action({ request, context }: ActionFunctionArgs): Promise<ProjectActionError | Response> {
  const cfContext = context as CloudflareContext;
  const db = cfContext?.cloudflare?.env?.DB as D1DatabaseLike | undefined;

  if (!db) {
    return { ok: false, error: "Database not configured." };
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return { ok: false, error: "Unable to process the form." };
  }

  const title = getString(formData, "title");
  const slug = getString(formData, "slug");
  const category = getString(formData, "category");
  const summary = getString(formData, "summary");
  const story = getString(formData, "story");
  const coverImage = getString(formData, "coverImage") ?? "placeholder";
  const featured = formData.get("featured") === "on";
  const galleryImagesRaw = getString(formData, "galleryImages");
  const publishedAt = getString(formData, "publishedAt") ?? new Date().toISOString();

  if (!title || !slug || !category || !summary || !story) {
    return { ok: false, error: "Title, slug, category, summary, and story are required." };
  }

  const galleryImages = galleryImagesRaw
    ? galleryImagesRaw.split("\n").map((s) => s.trim()).filter(Boolean)
    : [];

  try {
    const project = parsePortfolioProject({
      slug,
      title,
      category,
      coverImage,
      galleryImages,
      summary,
      story,
      featured,
      publishedAt,
    });

    const repo = createPortfolioProjectsRepository(db);
    await repo.upsertProject(project);

    return redirect("/admin/portfolio");
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to create project." };
  }
}

export const meta: MetaFunction = () => [{ title: "New Project | Admin | Moment4us" }];

function getString(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export default function AdminPortfolioNewRoute() {
  const fetcher = useFetcher<ProjectActionResult>();
  const isSubmitting = fetcher.state === "submitting";
  const result = fetcher.data;
  const error = result && !result.ok ? result.error : undefined;

  return (
    <div className="admin-portfolio-form">
      <h1 className="admin-page-title">New Portfolio Project</h1>

      {error && (
        <p className="admin-form-error" role="alert">
          {error}
        </p>
      )}

      <fetcher.Form method="post" className="admin-form">
        <div className="admin-form__row">
          <div className="contact-form__field">
            <label className="contact-form__label" htmlFor="project-title">
              Title <span>*</span>
            </label>
            <input
              className="contact-form__input"
              id="project-title"
              name="title"
              required
              type="text"
            />
          </div>

          <div className="contact-form__field">
            <label className="contact-form__label" htmlFor="project-slug">
              Slug <span>*</span>
            </label>
            <input
              className="contact-form__input"
              id="project-slug"
              name="slug"
              required
              type="text"
              pattern="[a-z0-9-]+"
              placeholder="e.g. harbor-vows"
            />
          </div>
        </div>

        <div className="admin-form__row">
          <div className="contact-form__field">
            <label className="contact-form__label" htmlFor="project-category">
              Category <span>*</span>
            </label>
            <input
              className="contact-form__input"
              id="project-category"
              name="category"
              required
              type="text"
              placeholder="e.g. Wedding, Family, Portrait"
            />
          </div>

          <div className="contact-form__field">
            <label className="contact-form__label" htmlFor="project-published">
              Published At
            </label>
            <input
              className="contact-form__input"
              id="project-published"
              name="publishedAt"
              type="date"
            />
          </div>
        </div>

        <div className="contact-form__field">
          <label className="contact-form__label" htmlFor="project-cover">
            Cover Image ID
          </label>
          <input
            className="contact-form__input"
            id="project-cover"
            name="coverImage"
            type="text"
            placeholder="Cloudflare Image ID or R2 key"
          />
        </div>

        <div className="contact-form__field">
          <label className="contact-form__label" htmlFor="project-summary">
            Summary <span>*</span>
          </label>
          <textarea
            className="contact-form__textarea"
            id="project-summary"
            name="summary"
            required
            rows={3}
          />
        </div>

        <div className="contact-form__field">
          <label className="contact-form__label" htmlFor="project-story">
            Story <span>*</span>
          </label>
          <textarea
            className="contact-form__textarea"
            id="project-story"
            name="story"
            required
            rows={6}
          />
        </div>

        <div className="contact-form__field">
          <label className="contact-form__label" htmlFor="project-gallery">
            Gallery Image IDs (one per line)
          </label>
          <textarea
            className="contact-form__textarea"
            id="project-gallery"
            name="galleryImages"
            rows={4}
            placeholder="image-id-1&#10;image-id-2&#10;image-id-3"
          />
        </div>

        <div className="admin-form__checkbox">
          <input id="project-featured" name="featured" type="checkbox" />
          <label htmlFor="project-featured">Featured project</label>
        </div>

        <button
          className="btn-ghost btn-ghost--filled"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Creating..." : "Create Project"}
        </button>
      </fetcher.Form>
    </div>
  );
}
