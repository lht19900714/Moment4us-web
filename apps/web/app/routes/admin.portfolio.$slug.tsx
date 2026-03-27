import {
  useFetcher,
  useLoaderData,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "react-router";

import { parsePortfolioProject } from "../../../../packages/content/src";
import { createPortfolioProjectsRepository, type D1DatabaseLike } from "../../../../packages/data/src";

interface CloudflareContext {
  cloudflare?: {
    env?: {
      DB?: D1DatabaseLike;
    };
  };
}

interface ProjectData {
  slug: string;
  title: string;
  category: string;
  coverImage: string;
  galleryImages: string[];
  summary: string;
  story: string;
  featured: boolean;
  publishedAt: string;
}

interface EditLoaderData {
  project: ProjectData | null;
}

export async function loader({ params, context }: LoaderFunctionArgs): Promise<EditLoaderData> {
  const cfContext = context as CloudflareContext;
  const db = cfContext?.cloudflare?.env?.DB;
  const slug = params.slug;

  if (!db || !slug) {
    return { project: null };
  }

  const repo = createPortfolioProjectsRepository(db);
  const project = await repo.getProjectBySlug(slug);

  if (!project) {
    return { project: null };
  }

  return {
    project: {
      slug: project.slug,
      title: project.title,
      category: project.category,
      coverImage: project.coverImage,
      galleryImages: project.galleryImages,
      summary: project.summary,
      story: project.story,
      featured: project.featured,
      publishedAt: project.publishedAt,
    },
  };
}

interface ProjectActionSuccess {
  ok: true;
}

interface ProjectActionError {
  ok: false;
  error: string;
}

type ProjectActionResult = ProjectActionSuccess | ProjectActionError;

export async function action({ request, params, context }: ActionFunctionArgs): Promise<ProjectActionResult> {
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

  const intent = formData.get("intent");

  // Handle delete
  if (intent === "delete") {
    const slug = params.slug;
    if (!slug) {
      return { ok: false, error: "Project slug is missing." };
    }

    const repo = createPortfolioProjectsRepository(db);
    await repo.deleteProject(slug);
    return { ok: true };
  }

  // Handle update
  const title = getString(formData, "title");
  const slug = getString(formData, "slug") ?? params.slug;
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

    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to update project." };
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: `${data?.project?.title ?? "Edit Project"} | Admin | Moment4us` },
];

function getString(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function formatDateForInput(isoDate: string): string {
  try {
    return isoDate.slice(0, 10);
  } catch {
    return "";
  }
}

export default function AdminPortfolioEditRoute() {
  const data = useLoaderData<typeof loader>();
  const fetcher = useFetcher<ProjectActionResult>();
  const deleteFetcher = useFetcher<ProjectActionResult>();
  const isSubmitting = fetcher.state === "submitting";
  const result = fetcher.data;
  const error = result && !result.ok ? result.error : undefined;
  const success = result?.ok === true;
  const deleteSuccess = deleteFetcher.data?.ok === true;

  const project = data.project;

  if (!project) {
    return (
      <div className="admin-portfolio-form">
        <h1 className="admin-page-title">Project Not Found</h1>
        <p className="admin-empty">The requested portfolio project could not be found.</p>
      </div>
    );
  }

  if (deleteSuccess) {
    return (
      <div className="admin-portfolio-form">
        <h1 className="admin-page-title">Project Deleted</h1>
        <p className="admin-empty">The project has been deleted successfully.</p>
      </div>
    );
  }

  return (
    <div className="admin-portfolio-form">
      <h1 className="admin-page-title">Edit: {project.title}</h1>

      {error && (
        <p className="admin-form-error" role="alert">
          {error}
        </p>
      )}

      {success && (
        <p className="admin-form-success" role="status">
          Project updated successfully.
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
              defaultValue={project.title}
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
              defaultValue={project.slug}
              pattern="[a-z0-9-]+"
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
              defaultValue={project.category}
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
              defaultValue={formatDateForInput(project.publishedAt)}
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
            defaultValue={project.coverImage}
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
            defaultValue={project.summary}
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
            defaultValue={project.story}
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
            defaultValue={project.galleryImages.join("\n")}
          />
        </div>

        <div className="admin-form__checkbox">
          <input
            id="project-featured"
            name="featured"
            type="checkbox"
            defaultChecked={project.featured}
          />
          <label htmlFor="project-featured">Featured project</label>
        </div>

        <div className="admin-form__actions">
          <button
            className="btn-ghost btn-ghost--filled"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>

          <deleteFetcher.Form method="post" style={{ display: "inline" }}>
            <input type="hidden" name="intent" value="delete" />
            <button
              className="btn-ghost admin-btn-danger"
              type="submit"
              onClick={(e) => {
                if (!confirm("Are you sure you want to delete this project?")) {
                  e.preventDefault();
                }
              }}
            >
              Delete Project
            </button>
          </deleteFetcher.Form>
        </div>
      </fetcher.Form>
    </div>
  );
}
