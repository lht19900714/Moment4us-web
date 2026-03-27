# brainstorm: Moment4us studio website

## Goal

Plan the architecture and technology stack for the Moment4us photography studio website. The site should support company branding, portfolio showcase, booking intent capture, and contact channels, with full deployment on Cloudflare and a React + TypeScript leaning.

## What I already know

* The website is for a photography studio named Moment4us.
* Primary goals mentioned so far: company promotion, portfolio display, booking, and contact methods.
* The user prefers React + TypeScript.
* The user wants the site fully deployed on Cloudflare.
* The domain is already managed on Cloudflare.
* The user accepted using a visual companion for later visual/architecture discussion if helpful.
* The user approved Approach B direction: React SSR on Cloudflare Workers.
* The user wants a monorepo so frontend and backend code live together for maintenance.
* The user approved keeping `/admin` inside the same primary app rather than splitting a second app for MVP.
* The user wants form notifications to go to the studio email in MVP.
* The user explicitly wants an `About Us` section on the website.
* The user provided `https://lulanstudio.com/wedding-cn` as a close design/content reference.
* The user likes the reference site's waterfall/masonry-style visual presentation.
* Current brand direction is temporary: warm, authentic, documentary-leaning.
* The current repository has Trellis/project meta files only and does not yet contain an app scaffold.

## Assumptions (temporary)

* This is a new greenfield marketing website rather than a rebuild of an existing production site.
* Initial scope is architecture and stack selection, not implementation yet.
* A lightweight CMS or content workflow may be needed because portfolio content will likely change over time.

## Open Questions

* None currently blocking for architecture discussion.

## Requirements (evolving)

* Recommend an architecture that runs entirely on Cloudflare.
* Keep the frontend centered on React + TypeScript.
* Cover content pages, portfolio showcase, booking entry, and contact methods.
* Explain trade-offs between feasible stack options.
* Booking for MVP is lead capture only; customers submit intent and the studio follows up manually to confirm.
* Content should be manageable through a simple admin workflow rather than code-only editing.
* Launch scope is English-only.
* The MVP architecture should reserve room for future blog/content-marketing and SEO expansion.
* The codebase should use a monorepo structure with frontend, backend/runtime, and shared code maintained together.
* The MVP should keep admin functionality within the same deployable app.
* Form submissions should notify the studio by email in MVP without requiring an external CRM.
* The site should include an `About Us` section/page.
* The visual/content direction should take cues from the provided reference site, especially the masonry-style portfolio presentation.
* Initial brand direction should support a warm, authentic, documentary-leaning tone, while remaining easy to revise later.
* The homepage should use the currently approved narrative template with Hero, featured masonry portfolio, About preview, services, trust signals, and inquiry CTA.

## Acceptance Criteria (evolving)

* [ ] Architecture options are presented with Cloudflare-compatible deployment paths.
* [ ] The recommended stack matches the React + TypeScript preference.
* [ ] The proposal covers content, booking, contact, and operations concerns.
* [ ] Key scope boundaries and future extension points are identified.
* [ ] The MVP does not assume real-time slot inventory, self-service scheduling, or payments.
* [ ] The information architecture and content model work for a single-language English launch.
* [ ] The chosen architecture can grow into richer editorial/SEO content without a rewrite.
* [ ] The MVP contact and booking flow works without external CRM dependencies.

## Definition of Done (team quality bar)

* Requirements are clarified enough to produce a design recommendation.
* Trade-offs are documented clearly enough for implementation planning.
* Follow-up implementation can proceed with an approved architecture direction.

## Out of Scope (explicit)

* Building the production website in this step
* Final visual design decisions
* Copywriting and actual portfolio asset preparation
* Real-time calendar inventory and direct online payment for MVP

## Technical Notes

* Repo inspection: root currently contains Trellis/tasking metadata only, no existing React/TypeScript/Cloudflare app files.
* Deployment constraint: Cloudflare-first architecture is required.
* Cloudflare docs checked on 2026-03-26:
* React can be deployed either on Cloudflare Pages or as a full-stack app on Workers via the Cloudflare Vite plugin.
* Workers + React guide shows a React SPA with a Worker API and SPA asset routing via `not_found_handling = "single-page-application"`.
* Cloudflare Vite plugin officially supports static sites, SPAs, and full-stack apps, and also supports SSR stacks such as React Router v7 and TanStack Start.
* D1 is a serverless SQL database suited for app data accessed from Workers/Pages.
* R2 is the object storage option for large media and public assets.
* Images is Cloudflare's image storage/transformation product and is relevant for a photography portfolio.
* Turnstile is relevant for anti-spam protection on contact/booking forms.
* Queues is optional if we need asynchronous email/CRM/webhook processing after form submission.
* Email delivery note checked on 2026-03-26: Cloudflare Email Routing supports sending email notifications from Workers to verified addresses using `send_email` bindings, which fits the MVP operational requirement.
* Email platform boundary: Cloudflare Email Routing is not a general outbound SMTP platform; if the product later needs broader transactional or marketing email, an external provider may still be appropriate.
* Reference site reviewed on 2026-03-26: `https://lulanstudio.com/wedding-cn`.
* Reference-site patterns observed:
* Strong brand-positioning hero + immediate portfolio CTA.
* About/philosophy and founder-story content are integrated into the main narrative, not isolated only in footer pages.
* Trust-building sections include metrics, awards/publication logos, testimonials, and location coverage.
* Pricing/contact CTAs are repeated throughout the page.
* The user specifically likes the visual waterfall/masonry presentation used for portfolio imagery.

## Research Notes

### Constraints from the current project

* Greenfield project with no existing app scaffold.
* User preference strongly favors React + TypeScript.
* Entire deployment should live on Cloudflare where possible.
* Core product needs are brand site, portfolio, booking, and contact.
* Booking has now been clarified as lead capture with manual follow-up, not self-service transactional booking.
* Content operations should support occasional updates through a lightweight admin/editor workflow, not a heavy CMS.
* Launch language has now been clarified as English-only.
* Future evolution should favor blog/content-marketing and SEO expansion rather than a heavy internal operations backend.
* The architectural direction has now been narrowed to an SSR React app on Cloudflare Workers, organized as a monorepo.
* Operational notifications in MVP should go directly to the studio email.

### Feasible approaches here

**Approach A: React SPA + Worker API on Cloudflare Workers** (Recommended baseline)

* How it works: Use React + TypeScript with Vite for the frontend, serve static assets from Workers, and expose booking/contact endpoints from the same Worker project.
* Pros: Simple architecture, single deployment target, good DX with Cloudflare Vite plugin, easy to add D1/R2/Turnstile later.
* Cons: No SSR by default, so SEO/content strategy depends more on pre-rendering and careful metadata handling.

**Approach B: React with SSR on Cloudflare Workers**

* How it works: Use a React SSR-capable stack that Cloudflare supports through the Vite plugin, such as React Router v7 or TanStack Start.
* Pros: Better SEO/control for marketing pages, easier dynamic meta generation, keeps everything on Workers.
* Cons: Higher complexity, more runtime moving parts than a pure SPA, likely overkill if content is mostly static.

**Approach C: React site on Cloudflare Pages + serverless functions/data services**

* How it works: Deploy the front-end through Pages and attach functions/data integrations where needed.
* Pros: Straightforward static deployment and preview workflow.
* Cons: Splits mental model between Pages and backend services; if the site grows into custom booking logic, Workers-first is usually cleaner.

### Monorepo tooling direction

**Option 1: pnpm workspaces only**

* How it works: use `pnpm-workspace.yaml` with app/package folders and run scripts via pnpm filters.
* Pros: simplest setup, low ceremony, enough for a small repo.
* Cons: task orchestration and caching are more limited as the repo grows.

**Option 2: pnpm workspaces + Turborepo** (Recommended)

* How it works: pnpm handles workspace linking and a shared lockfile; Turborepo orchestrates `dev`, `build`, `lint`, and `typecheck` tasks across workspaces.
* Pros: keeps package management simple while giving fast task pipelines and monorepo-scale ergonomics.
* Cons: one extra tool to configure.

**Option 3: npm workspaces + custom scripts**

* How it works: use npm workspaces and hand-written root scripts.
* Pros: fewer tools.
* Cons: weaker workspace ergonomics and less attractive for a TypeScript-heavy monorepo.

### Provisional architecture decision

* Frontend/runtime model: React SSR on Cloudflare Workers.
* Repository model: monorepo with a single deployable primary app plus shared packages.
* Package management: pnpm workspaces.
* Task orchestration: Turborepo preferred.

### Information architecture implications from the reference direction

* `About Us` should exist both as a dedicated page and as a concise homepage section.
* The homepage should combine brand story, portfolio proof, trust signals, and conversion CTAs rather than separating them too rigidly.
* Masonry-style image presentation is a good fit for portfolio/gallery modules, but should be balanced with SEO-friendly editorial sections and performance constraints.
* Homepage should follow a narrative flow: brand introduction -> proof through imagery -> about/story -> services/value -> trust -> conversion.

### Approved homepage wireframe direction

* Header with primary nav and inquiry CTA.
* Hero section with brand statement, supporting copy, and primary CTAs.
* Featured portfolio preview using a masonry/waterfall-style image layout.
* About Us preview section on the homepage, plus a dedicated About page.
* Services snapshot section.
* Experience/approach section to explain the working process.
* Trust signals section for testimonials, locations, awards, or similar proof.
* Final inquiry/contact CTA near the bottom.
