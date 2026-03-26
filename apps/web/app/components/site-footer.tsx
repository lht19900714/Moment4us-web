import { Link } from "react-router";

import { routes, siteName } from "../../../../packages/shared/src";

const copyrightLabel = "© 2026";

const footerLinks = [
  { href: routes.about, label: "About" },
  { href: routes.services, label: "Services" },
  { href: routes.contact, label: "Contact" },
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <p className="site-footer__eyebrow">Moment4us</p>
          <p className="site-footer__copy">
            Warm, authentic photography for real stories. Placeholder content routes are ready
            for the first editorial pass.
          </p>
        </div>
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
      </div>
      <p className="site-footer__legal">
        {copyrightLabel} {siteName}
      </p>
    </footer>
  );
}
