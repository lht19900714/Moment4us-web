import { Link, useLoaderData, type LoaderFunctionArgs, type MetaFunction } from "react-router";

import { createPortfolioProjectsRepository, type D1DatabaseLike } from "../../../../packages/data/src";

interface CloudflareContext {
  cloudflare?: {
    env?: {
      DB?: D1DatabaseLike;
    };
  };
}

interface PortfolioItem {
  slug: string;
  title: string;
  category: string;
  featured: boolean;
  publishedAt: string;
}

interface PortfolioLoaderData {
  projects: PortfolioItem[];
}

export async function loader({ context }: LoaderFunctionArgs): Promise<PortfolioLoaderData> {
  const cfContext = context as CloudflareContext;
  const db = cfContext?.cloudflare?.env?.DB;

  if (!db) {
    return { projects: [] };
  }

  const repo = createPortfolioProjectsRepository(db);
  const projects = await repo.listAllProjects();

  return {
    projects: projects.map((p) => ({
      slug: p.slug,
      title: p.title,
      category: p.category,
      featured: p.featured,
      publishedAt: p.publishedAt,
    })),
  };
}

export const meta: MetaFunction = () => [{ title: "Portfolio | Admin | Moment4us" }];

function formatDate(isoDate: string): string {
  try {
    return new Date(isoDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return isoDate;
  }
}

export default function AdminPortfolioRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="admin-portfolio">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Portfolio</h1>
          <p className="admin-page-subtitle">{data.projects.length} projects</p>
        </div>
        <Link to="/admin/portfolio/new" className="btn-ghost btn-ghost--filled">
          New Project
        </Link>
      </div>

      {data.projects.length === 0 ? (
        <p className="admin-empty">No portfolio projects yet.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Featured</th>
                <th>Published</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.projects.map((project) => (
                <tr key={project.slug}>
                  <td>{project.title}</td>
                  <td>{project.category}</td>
                  <td>{project.featured ? "Yes" : "No"}</td>
                  <td>{formatDate(project.publishedAt)}</td>
                  <td>
                    <Link to={`/admin/portfolio/${project.slug}`} className="admin-link">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
