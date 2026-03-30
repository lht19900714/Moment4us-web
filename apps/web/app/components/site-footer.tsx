import { Link } from "react-router";

import { routes, siteName } from "@moment4us/shared";

const copyrightLabel = "\u00A9 2026";

const footerLinks = [
  { href: routes.portfolio, label: "Portfolio" },
  { href: routes.about, label: "About" },
  { href: routes.services, label: "Services" },
  { href: routes.contact, label: "Contact" },
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <span className="site-footer__brand">{siteName}</span>
        <nav aria-label="Footer">
          <ul className="site-footer__nav">
            {footerLinks.map((item) => (
              <li key={item.href}>
                <Link className="site-footer__link" to={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="site-footer__copy">
          {copyrightLabel} {siteName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
