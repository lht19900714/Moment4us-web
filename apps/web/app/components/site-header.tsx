import { Link } from "react-router";

import { routes, siteName } from "../../../../packages/shared/src";

const primaryNavItems = [
  { href: routes.portfolio, label: "Portfolio" },
  { href: routes.about, label: "About" },
  { href: routes.services, label: "Services" },
  { href: routes.contact, label: "Contact" },
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-header__brand" to={routes.home}>
          {siteName}
        </Link>
        <nav aria-label="Primary">
          <ul className="site-header__nav">
            {primaryNavItems.map((item) => (
              <li key={item.href}>
                <Link className="site-header__link" to={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
