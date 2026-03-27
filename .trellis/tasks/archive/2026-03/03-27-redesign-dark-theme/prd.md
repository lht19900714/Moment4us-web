# Redesign: Boutique Gold Dark Theme

## Goal

Transform the Moment4us website from the current warm-brown SaaS-like glass-morphism design to a cinematic editorial dark theme inspired by premium photography studio websites. Use the approved "Boutique Gold + Espresso" color system with warm charcoal (`#1a1a1e`) backgrounds instead of pure black.

## Design System (Approved)

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-deep` | `#1a1a1e` | Primary dark background |
| `--bg-elevated` | `#2a2a2f` | Cards, nav on scroll |
| `--bg-mid` | `#3f3a35` | Dividers, secondary surfaces |
| `--accent` | `#c9a87c` | CTAs, eyebrows, hover effects |
| `--accent-hover` | `#dbbf98` | Accent hover state |
| `--text-on-dark` | `#f5f0e8` | Primary text on dark |
| `--text-on-dark-muted` | `#9a9590` | Secondary text on dark |
| `--bg-light` | `#f6f1ea` | Light section background |
| `--text-on-light` | `#1a1a1e` | Primary text on light |
| `--text-on-light-muted` | `#6b6560` | Secondary text on light |
| `--border-dark` | `rgba(255,255,255,0.06)` | Borders on dark bg |
| `--border-light` | `rgba(0,0,0,0.06)` | Borders on light bg |

### Typography

- Headings: **Playfair Display** (400-700)
- Body: **Inter** (300-600)
- Google Fonts import required

### Layout Principles

- Full-bleed hero with background image + gradient overlay
- Deep/light section alternation for rhythm
- No glass-morphism cards (remove backdrop-filter, heavy shadows, large border-radius)
- Minimal borders, dark elevated surfaces instead
- Ghost/outline buttons with gold accent
- Transparent nav on hero, blur+dark on scroll
- Gallery hover: scale(1.03) + dark gradient overlay + text fade-in
- Nav link hover: underline expand animation

## Requirements

- Replace all CSS custom properties with new palette
- Swap font-family to Playfair Display + Inter (add Google Fonts link)
- Rewrite hero section: full-bleed background image with gradient overlay
- Convert glass cards to dark elevated surfaces or remove cards entirely
- Deep/light section alternation on homepage
- Update nav: transparent first, dark+blur on scroll (via CSS or minimal JS)
- Update footer: dark full-width, simplified
- Update gallery: remove borders/shadows, add hover overlay effect
- Update all content pages (about, services, contact) to use the new theme
- Update contact form inputs for dark background
- Maintain responsive behavior at 720px breakpoint
- Add `prefers-reduced-motion` support for animations
- Reference design: `docs/design-preview.html`

## Acceptance Criteria

- [ ] Site uses Playfair Display + Inter fonts
- [ ] Dark warm charcoal background (#1a1a1e), NOT pure black
- [ ] Gold accent (#c9a87c) used for eyebrows, CTAs, hover effects
- [ ] Hero section has a background image with gradient overlay
- [ ] Glass-morphism removed (no backdrop-filter on content areas)
- [ ] Navigation is transparent over hero, dark+blur on scroll
- [ ] Gallery items have hover scale + overlay effect
- [ ] Ghost/outline CTA buttons with gold accent
- [ ] Deep/light section alternation on homepage
- [ ] Contact form styled for dark background
- [ ] All pages consistent with new theme
- [ ] Responsive layout maintained
- [ ] TypeCheck passes
- [ ] Tests pass

## Out of Scope

- Adding real photography images (keep using Unsplash placeholders or existing demo URLs)
- JavaScript scroll animations (Intersection Observer entrance effects) — future task
- Mobile hamburger menu — separate task
