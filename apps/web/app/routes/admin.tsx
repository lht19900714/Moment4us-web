import { Link, NavLink, Outlet, type LoaderFunctionArgs } from "react-router";

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
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/leads", label: "Inquiry" },
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
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={"end" in item} className="admin-sidebar__link">
              {item.label}
            </NavLink>
          ))}
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
