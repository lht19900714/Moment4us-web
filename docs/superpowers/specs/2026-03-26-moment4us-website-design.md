# Moment4us Website Design

Date: 2026-03-26
Status: Draft for review

## 1. Overview

This document defines the architecture and product structure for the Moment4us photography studio website.

The site is an English-first marketing website focused on:

* brand presentation
* portfolio showcase
* About Us storytelling
* contact and booking lead capture

The deployment target is Cloudflare. The implementation should use a monorepo and keep frontend and backend/runtime code together for maintainability.

## 2. Product Direction

### 2.1 Brand Positioning

Current working direction:

* warm
* authentic
* documentary-leaning

This direction is intentionally lightweight and can be refined later without requiring an architectural rewrite.

### 2.2 Reference Direction

The site direction is informed by:

* `https://lulanstudio.com/wedding-cn`

Relevant patterns from that reference:

* strong opening brand narrative
* prominent visual storytelling
* integrated About/brand story
* repeated inquiry prompts
* portfolio-forward presentation
* masonry/waterfall-style gallery treatment

Moment4us should take cues from this structure, but not copy it directly. The English site should be cleaner, more focused, and built for future editorial SEO growth.

## 3. Core Requirements

### 3.1 Functional Requirements

The MVP should include:

* homepage
* portfolio listing
* portfolio detail pages
* About Us page
* services page
* contact page
* booking inquiry flow
* lightweight admin area

### 3.2 Operational Requirements

* booking in MVP is lead capture only
* no self-service scheduling
* no payment flow
* form notifications should be sent to the studio email
* content should be manageable without editing code directly

### 3.3 Strategic Requirements

The architecture should leave room for:

* future blog/content-marketing pages
* SEO-focused editorial content
* richer content management later

## 4. Recommended Architecture

### 4.1 Decision

Recommended stack:

* React + TypeScript
* React Router v7
* Vite
* Cloudflare Workers
* pnpm workspaces
* Turborepo

This is a monorepo with a single primary deployable app and shared internal packages.

### 4.2 Why This Approach

This approach balances four needs:

* SEO support for a marketing website
* Cloudflare-first deployment
* one-repo maintainability
* room for future editorial expansion

A pure SPA would be simpler, but it would be a weaker fit for long-term SEO and content growth. Splitting the MVP into multiple deployed applications would increase operational complexity too early.

### 4.3 Monorepo Structure

```txt
apps/
  web/                  # Main public site + /admin, deployed to Cloudflare Workers
packages/
  ui/                   # Shared UI components and design primitives
  content/              # Content schemas, SEO helpers, content transforms
  data/                 # D1 / Images / storage access layer
  shared/               # Shared types, constants, utilities
  config/               # Shared tsconfig/eslint/tailwind settings
pnpm-workspace.yaml
turbo.json
```

### 4.4 Deployment Model

The MVP should deploy as one main Cloudflare application:

* public site routes
* booking/contact actions
* admin routes

This keeps the runtime simple while preserving internal code boundaries through packages.

## 5. Cloudflare Services

### 5.1 Selected Services

* Cloudflare Workers: application runtime
* Cloudflare D1: structured content and lead data
* Cloudflare Images: image delivery and transformations
* Cloudflare Turnstile: anti-spam protection for forms
* Cloudflare Email Routing `send_email`: notification emails to the studio inbox

### 5.2 Optional Services

These are not required for MVP but may become useful later:

* Cloudflare R2: if raw media or alternate storage workflows are needed
* Cloudflare Queues: if form processing becomes asynchronous or integrates with additional systems

### 5.3 Service Boundaries

Cloudflare Email Routing is sufficient for MVP notifications to verified inboxes. If the product later needs broader transactional or marketing email, a dedicated email provider may still be more appropriate.

## 6. Information Architecture

### 6.1 Routes

```txt
/
/portfolio
/portfolio/:slug
/about
/services
/contact
/blog                # reserved for future use
/admin
```

### 6.2 Homepage Structure

Approved homepage wireframe direction:

1. Header
2. Hero
3. Featured portfolio preview with masonry layout
4. About Us preview
5. Services snapshot
6. Experience / process section
7. Trust signals
8. Inquiry CTA
9. Footer

### 6.3 Homepage Narrative Flow

The homepage should follow this sequence:

* brand introduction
* visual proof
* about/story
* service/value explanation
* trust building
* inquiry conversion

This keeps the site emotionally driven while still supporting SEO and clear business messaging.

## 7. Content Model

### 7.1 Site Pages

Used for core marketing pages such as homepage sections, About, Services, and Contact content.

Representative fields:

* `slug`
* `title`
* `seoTitle`
* `seoDescription`
* `hero`
* `sections`
* `published`

### 7.2 Portfolio Projects

Used for gallery listings and project detail pages.

Representative fields:

* `slug`
* `title`
* `category`
* `coverImage`
* `galleryImages`
* `summary`
* `story`
* `featured`
* `publishedAt`

### 7.3 Blog Posts

Reserved for future content marketing and SEO.

Representative fields:

* `slug`
* `title`
* `excerpt`
* `coverImage`
* `content`
* `tags`
* `publishedAt`
* `seo`

### 7.4 Leads

Used for contact and booking inquiries.

Representative fields:

* `id`
* `type`
* `name`
* `email`
* `phone`
* `serviceType`
* `eventDate`
* `message`
* `status`
* `createdAt`

## 8. Data Flow

### 8.1 Public Content

* React SSR renders public routes on Workers
* page and portfolio metadata are read from D1
* images are delivered via Cloudflare Images

### 8.2 Admin Editing

* admin users update content in `/admin`
* validated content is written to D1
* image assets are associated with Cloudflare Images identifiers

### 8.3 Contact and Booking

* visitor submits a form
* Turnstile is verified
* Worker validates the payload
* lead is stored in D1
* notification email is sent to the studio inbox
* success response is returned to the user

The MVP makes no promise of confirmed time-slot scheduling.

## 9. Gallery and Visual Strategy

### 9.1 Masonry Use

The masonry/waterfall layout should be used selectively:

* homepage featured portfolio preview
* portfolio listing page

It should not dominate text-heavy pages like About or Services.

### 9.2 Why Selective Use Matters

Using masonry everywhere would weaken:

* narrative clarity
* content readability
* SEO content structure
* performance control

The site should feel image-led, not image-only.

### 9.3 Portfolio Detail Layout

Project detail pages should use a more controlled editorial/story layout rather than another endless masonry block. This improves pacing, storytelling, and metadata quality.

## 10. Admin Scope

The MVP admin area should remain intentionally small.

Included:

* manage portfolio entries
* manage base site content
* view inquiry leads

Not included:

* complex roles/permissions
* multi-step editorial workflows
* advanced analytics
* deep CRM features

## 11. SEO and Performance

### 11.1 SEO Foundations

The implementation should support:

* per-page title and meta description
* per-project metadata
* canonical URLs
* Open Graph metadata
* Twitter card metadata
* `sitemap.xml`
* `robots.txt`

### 11.2 Performance Foundations

Because this is a photography-heavy website:

* images should be optimized through Cloudflare Images
* homepage should preload only a small number of key visuals
* masonry assets should include dimensions or ratio metadata
* non-critical images should lazy-load
* mobile and desktop gallery layouts should differ by column count

## 12. MVP Scope

### 12.1 In Scope

* public marketing website
* homepage using the approved narrative structure
* portfolio list and project pages
* About Us page
* services page
* contact and booking inquiry forms
* admin content editing for MVP entities
* email notifications to the studio inbox

### 12.2 Out of Scope

* real-time availability
* online payment
* client accounts
* multilingual launch
* advanced CMS workflows
* external CRM dependency

## 13. Future Expansion Path

The architecture should support expansion in this order:

1. richer portfolio organization
2. blog/editorial publishing
3. stronger SEO page program
4. more capable admin tools
5. deeper marketing or CRM integrations

This order matches the studio's current priorities: brand site first, editorial growth second, operational sophistication later.

## 14. Implementation Slices

Suggested implementation order:

1. monorepo scaffolding and shared config
2. Cloudflare SSR app shell and routing
3. homepage, About, Services, Contact pages
4. portfolio model, listing, and project detail pages
5. form handling, Turnstile, D1, and email notification
6. lightweight admin area
7. SEO foundations and blog-ready content layer

## 15. References

* Cloudflare Vite plugin: `https://developers.cloudflare.com/workers/vite-plugin/`
* Cloudflare React guide: `https://developers.cloudflare.com/workers/frameworks/framework-guides/react/`
* React Router Cloudflare guide: `https://reactrouter.com/how-to/cloudflare`
* Cloudflare D1: `https://developers.cloudflare.com/d1/`
* Cloudflare Images: `https://developers.cloudflare.com/images/`
* Cloudflare Turnstile: `https://developers.cloudflare.com/turnstile/`
* Cloudflare Email Workers / send email: `https://developers.cloudflare.com/email-routing/email-workers/send-email-workers/`
* pnpm workspaces: `https://pnpm.io/workspaces`
* Turborepo docs: `https://turborepo.com/repo/docs`
