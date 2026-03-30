import { Link } from "react-router";

import { routes, siteName } from "@moment4us/shared";

import { navigation } from "../content/site";

const copyrightLabel = "\u00A9 " + navigation.copyrightYear;

const footerLinks = [
  { href: routes.portfolio, label: navigation.footerLinks[0].label },
  { href: routes.about, label: navigation.footerLinks[1].label },
  { href: routes.services, label: navigation.footerLinks[2].label },
  { href: routes.contact, label: navigation.footerLinks[3].label },
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
          {copyrightLabel} {siteName}{navigation.copyrightSuffix}
        </p>
      </div>
    </footer>
  );
}
