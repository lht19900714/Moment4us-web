import type { ReactNode } from "react";
import { Link } from "react-router";

export interface HeroSectionAction {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
}

interface HeroSectionProps {
  eyebrow: string;
  title: string;
  body: string;
  highlights: readonly string[];
  actions: readonly HeroSectionAction[];
  aside?: ReactNode;
}

export function HeroSection({
  eyebrow,
  title,
  body,
  highlights,
  actions,
  aside,
}: HeroSectionProps) {
  return (
    <section className="hero-section">
      <div className="hero-section__content">
        <p className="hero-section__eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="hero-section__body">{body}</p>
        <ul className="hero-section__highlights" aria-label="Homepage highlights">
          {highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
        <div className="hero-section__actions">
          {actions.map((action) => (
            <Link
              key={`${action.href}-${action.label}`}
              className={`hero-section__action hero-section__action--${action.variant ?? "primary"}`}
              to={action.href}
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
      {aside === undefined ? null : <div className="hero-section__aside">{aside}</div>}
    </section>
  );
}
