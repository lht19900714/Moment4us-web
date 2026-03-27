import { useEffect, useState } from "react";
import { Link } from "react-router";

import { routes, siteName } from "../../../../packages/shared/src";

const primaryNavItems = [
  { href: routes.portfolio, label: "Portfolio" },
  { href: routes.about, label: "About" },
  { href: routes.services, label: "Services" },
] as const;

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
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
            <li>
              <Link className="nav-cta" to={routes.contact}>
                Inquire
              </Link>
            </li>
          </ul>
        </nav>

        {/* Hamburger toggle — visible only on mobile via CSS */}
        <button
          aria-expanded={isMenuOpen}
          aria-label="Open navigation menu"
          className="site-header__toggle"
          onClick={() => setIsMenuOpen(true)}
          type="button"
        >
          <span aria-hidden="true" className="site-header__toggle-icon">
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>
    </header>

    {/* Mobile navigation overlay — outside header to avoid backdrop-filter containing block */}
    <nav
      aria-label="Mobile navigation"
      className={`mobile-nav${isMenuOpen ? " mobile-nav--open" : ""}`}
      role="dialog"
      aria-modal={isMenuOpen}
    >
      <div
        className="mobile-nav__backdrop"
        onClick={closeMenu}
        aria-hidden="true"
      />
      <div className="mobile-nav__inner">
        <button
          aria-label="Close navigation menu"
          className="mobile-nav__close"
          onClick={closeMenu}
          type="button"
        >
          <svg
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <line x1="18" x2="6" y1="6" y2="18" />
            <line x1="6" x2="18" y1="6" y2="18" />
          </svg>
        </button>

        <ul className="mobile-nav__links">
          <li>
            <Link
              className="mobile-nav__link"
              onClick={closeMenu}
              to={routes.home}
            >
              Home
            </Link>
          </li>
          {primaryNavItems.map((item) => (
            <li key={item.href}>
              <Link
                className="mobile-nav__link"
                onClick={closeMenu}
                to={item.href}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          className="mobile-nav__cta"
          onClick={closeMenu}
          to={routes.contact}
        >
          Inquire
        </Link>
      </div>
    </nav>
    </>
  );
}
