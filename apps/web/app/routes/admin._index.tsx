import { useLoaderData, type LoaderFunctionArgs, type MetaFunction } from "react-router";

import {
  createLeadsRepository,
  createPortfolioProjectsRepository,
  createSitePagesRepository,
  type D1DatabaseLike,
} from "../../../../packages/data/src";

interface CloudflareContext {
  cloudflare?: {
    env?: {
      DB?: D1DatabaseLike;
    };
  };
}

interface DashboardData {
  totalLeads: number;
  leadsByStatus: { status: string; count: number }[];
  totalProjects: number;
  totalPages: number;
}

export async function loader({ context }: LoaderFunctionArgs): Promise<DashboardData> {
  const cfContext = context as CloudflareContext;
  const db = cfContext?.cloudflare?.env?.DB;

  if (!db) {
    return { totalLeads: 0, leadsByStatus: [], totalProjects: 0, totalPages: 0 };
  }

  const leadsRepo = createLeadsRepository(db);
  const portfolioRepo = createPortfolioProjectsRepository(db);
  const pagesRepo = createSitePagesRepository(db);

  const [totalLeads, leadsByStatus, totalProjects, totalPages] = await Promise.all([
    leadsRepo.countLeads(),
    leadsRepo.countLeadsByStatus(),
    portfolioRepo.countProjects(),
    pagesRepo.countPages(),
  ]);

  return {
    totalLeads,
    leadsByStatus,
    totalProjects,
    totalPages,
  };
}

export const meta: MetaFunction = () => [{ title: "Dashboard | Admin | Moment4us" }];

export default function AdminDashboardRoute() {
  const data = useLoaderData<typeof loader>();

  const newLeads = data.leadsByStatus.find((s) => s.status === "new")?.count ?? 0;
  const contactedLeads = data.leadsByStatus.find((s) => s.status === "contacted")?.count ?? 0;

  return (
    <div className="admin-dashboard">
      <h1 className="admin-page-title">Dashboard</h1>

      <div className="admin-stats">
        <div className="admin-stat-card">
          <span className="admin-stat-card__value">{data.totalLeads}</span>
          <span className="admin-stat-card__label">Total Leads</span>
          <span className="admin-stat-card__detail">
            {newLeads} new, {contactedLeads} contacted
          </span>
        </div>

        <div className="admin-stat-card">
          <span className="admin-stat-card__value">{data.totalProjects}</span>
          <span className="admin-stat-card__label">Portfolio Projects</span>
        </div>

        <div className="admin-stat-card">
          <span className="admin-stat-card__value">{data.totalPages}</span>
          <span className="admin-stat-card__label">Site Pages</span>
        </div>
      </div>
    </div>
  );
}
