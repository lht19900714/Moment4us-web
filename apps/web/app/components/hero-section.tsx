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
  actions: readonly HeroSectionAction[];
  backgroundImage?: string;
}

export function HeroSection({
  eyebrow,
  title,
  body,
  actions,
  backgroundImage,
}: HeroSectionProps) {
  const hasImage = backgroundImage !== undefined && backgroundImage !== "";
  const sectionStyle = hasImage
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(26, 26, 30, 0.25) 0%, rgba(26, 26, 30, 0.65) 100%), url("${backgroundImage}")`,
      }
    : undefined;

  return (
    <section
      className={`hero-section${hasImage ? " hero-section--with-image" : ""}`}
      style={sectionStyle}
    >
      <div className="hero-section__content">
        <p className="hero-section__eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="hero-section__body">{body}</p>
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
    </section>
  );
}
