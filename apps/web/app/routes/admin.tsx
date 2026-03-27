import { Link, Outlet, type LoaderFunctionArgs } from "react-router";

import { requireAdmin } from "../lib/admin-auth.server";

interface CloudflareContext {
  cloudflare?: {
    env?: {
      DB?: unknown;
      ADMIN_PASSWORD_HASH?: string;
    };
  };
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const cfContext = context as CloudflareContext;
  requireAdmin(request, { ADMIN_PASSWORD_HASH: cfContext?.cloudflare?.env?.ADMIN_PASSWORD_HASH });
  return null;
}

const navItems = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/leads", label: "Leads" },
  { to: "/admin/portfolio", label: "Portfolio" },
  { to: "/admin/pages", label: "Pages" },
];

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <Link to="/admin" className="admin-sidebar__logo">
            Moment4us
          </Link>
          <span className="admin-sidebar__badge">Admin</span>
        </div>

        <nav className="admin-sidebar__nav">
          <a href="/admin" className="admin-sidebar__link">
            Dashboard
          </a>
          <Link to="/admin/leads" className="admin-sidebar__link">
            Leads
          </Link>
          <Link to="/admin/portfolio" className="admin-sidebar__link">
            Portfolio
          </Link>
          <Link to="/admin/pages" className="admin-sidebar__link">
            Pages
          </Link>
        </nav>

        <div className="admin-sidebar__footer">
          <Link to="/" className="admin-sidebar__link admin-sidebar__link--muted">
            View Site
          </Link>
          <form method="post" action="/admin/login?logout">
            <button type="submit" className="admin-sidebar__link admin-sidebar__link--muted admin-sidebar__logout">
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
