# Moment4us Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Moment4us photography studio website as a Cloudflare-first monorepo with a React SSR public site, lightweight admin, portfolio/gallery support, and inquiry lead capture.

**Architecture:** Implement a single deployable React Router v7 SSR app on Cloudflare Workers inside a `pnpm` monorepo. Keep public pages, admin routes, form actions, and Cloudflare bindings in `apps/web`, while shared UI, content schemas, and data access live in `packages/*`.

**Tech Stack:** React, TypeScript, React Router v7, Vite, Cloudflare Workers, Cloudflare D1, Cloudflare Images, Cloudflare Turnstile, Cloudflare Email Routing, pnpm workspaces, Turborepo, Tailwind CSS, Vitest

---

## File Structure

### Repository Root

- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `turbo.json`
- Create: `tsconfig.base.json`
- Create: `.gitignore`
- Create: `.npmrc`
- Create: `README.md`

Responsibilities:

- workspace management
- shared scripts
- shared TypeScript defaults
- Turborepo task orchestration

### App Workspace

- Create: `apps/web/package.json`
- Create: `apps/web/react-router.config.ts`
- Create: `apps/web/vite.config.ts`
- Create: `apps/web/wrangler.jsonc`
- Create: `apps/web/worker-configuration.d.ts`
- Create: `apps/web/app/root.tsx`
- Create: `apps/web/app/routes.ts`
- Create: `apps/web/app/entry.client.tsx`
- Create: `apps/web/app/styles/global.css`
- Create: `apps/web/app/lib/env.server.ts`
- Create: `apps/web/app/lib/seo.ts`
- Create: `apps/web/app/lib/turnstile.server.ts`
- Create: `apps/web/app/lib/email.server.ts`
- Create: `apps/web/app/lib/session.server.ts`
- Create: `apps/web/app/routes/home.tsx`
- Create: `apps/web/app/routes/portfolio.tsx`
- Create: `apps/web/app/routes/portfolio.$slug.tsx`
- Create: `apps/web/app/routes/about.tsx`
- Create: `apps/web/app/routes/services.tsx`
- Create: `apps/web/app/routes/contact.tsx`
- Create: `apps/web/app/routes/admin/index.tsx`
- Create: `apps/web/app/routes/admin/pages.tsx`
- Create: `apps/web/app/routes/admin/portfolio.tsx`
- Create: `apps/web/app/routes/admin/leads.tsx`
- Create: `apps/web/app/components/site-header.tsx`
- Create: `apps/web/app/components/site-footer.tsx`
- Create: `apps/web/app/components/hero-section.tsx`
- Create: `apps/web/app/components/masonry-gallery.tsx`
- Create: `apps/web/app/components/inquiry-form.tsx`
- Create: `apps/web/app/components/admin/protected-layout.tsx`
- Create: `apps/web/app/components/admin/content-form.tsx`
- Create: `apps/web/app/components/admin/lead-table.tsx`
- Create: `apps/web/app/loaders/home.server.ts`
- Create: `apps/web/app/loaders/portfolio.server.ts`
- Create: `apps/web/app/actions/inquiry.server.ts`
- Create: `apps/web/migrations/0001_initial.sql`
- Create: `apps/web/migrations/0002_seed_core_pages.sql`
- Create: `apps/web/public/favicon.svg`

Responsibilities:

- app runtime and routing
- public page rendering
- admin UI
- form actions
- Cloudflare bindings
- D1 migrations

### Shared Packages

- Create: `packages/ui/package.json`
- Create: `packages/ui/src/index.ts`
- Create: `packages/ui/src/button.tsx`
- Create: `packages/ui/src/section-heading.tsx`
- Create: `packages/ui/src/card.tsx`
- Create: `packages/content/package.json`
- Create: `packages/content/src/index.ts`
- Create: `packages/content/src/site-page.ts`
- Create: `packages/content/src/portfolio-project.ts`
- Create: `packages/content/src/blog-post.ts`
- Create: `packages/content/src/lead.ts`
- Create: `packages/content/src/homepage-layout.ts`
- Create: `packages/data/package.json`
- Create: `packages/data/src/index.ts`
- Create: `packages/data/src/d1/client.ts`
- Create: `packages/data/src/repositories/site-pages.ts`
- Create: `packages/data/src/repositories/portfolio-projects.ts`
- Create: `packages/data/src/repositories/leads.ts`
- Create: `packages/data/src/repositories/blog-posts.ts`
- Create: `packages/data/src/images/transform.ts`
- Create: `packages/shared/package.json`
- Create: `packages/shared/src/index.ts`
- Create: `packages/shared/src/constants.ts`
- Create: `packages/shared/src/routes.ts`
- Create: `packages/shared/src/types.ts`
- Create: `packages/config/package.json`
- Create: `packages/config/tsconfig/react-library.json`
- Create: `packages/config/eslint/base.cjs`

Responsibilities:

- schema/type reuse
- data access reuse
- UI primitives
- shared route and app constants

### Tests

- Create: `apps/web/app/routes/__tests__/home.route.test.tsx`
- Create: `apps/web/app/routes/__tests__/portfolio.route.test.tsx`
- Create: `apps/web/app/routes/__tests__/contact.action.test.tsx`
- Create: `apps/web/app/routes/__tests__/admin.route.test.tsx`
- Create: `apps/web/app/lib/__tests__/seo.test.ts`
- Create: `apps/web/app/lib/__tests__/turnstile.server.test.ts`
- Create: `packages/content/src/__tests__/homepage-layout.test.ts`
- Create: `packages/data/src/__tests__/site-pages.test.ts`
- Create: `packages/data/src/__tests__/portfolio-projects.test.ts`
- Create: `packages/data/src/__tests__/leads.test.ts`

Responsibilities:

- route rendering checks
- action validation checks
- SEO helper coverage
- repository behavior coverage

## Task 1: Bootstrap The Monorepo

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `turbo.json`
- Create: `tsconfig.base.json`
- Create: `.gitignore`
- Create: `.npmrc`
- Create: `README.md`
- Create: `apps/web/package.json`
- Create: `packages/ui/package.json`
- Create: `packages/content/package.json`
- Create: `packages/data/package.json`
- Create: `packages/shared/package.json`
- Create: `packages/config/package.json`

- [ ] **Step 1: Define root workspace scripts and package boundaries**

Add root scripts for `dev`, `build`, `test`, `lint`, `typecheck`, and `format:check`.

- [ ] **Step 2: Add workspace and Turborepo configuration**

Create `pnpm-workspace.yaml` and `turbo.json` so `apps/*` and `packages/*` participate in shared tasks.

- [ ] **Step 3: Add base TypeScript configuration**

Create `tsconfig.base.json` with strict settings and path aliases for `@moment4us/ui`, `@moment4us/content`, `@moment4us/data`, and `@moment4us/shared`.

- [ ] **Step 4: Add package manifests for each workspace**

Define internal package names:

```txt
@moment4us/web
@moment4us/ui
@moment4us/content
@moment4us/data
@moment4us/shared
@moment4us/config
```

- [ ] **Step 5: Install dependencies**

Run: `pnpm install`

Expected: lockfile created and all workspaces resolved.

- [ ] **Step 6: Verify workspace wiring**

Run: `pnpm -r exec pwd`

Expected: one path printed per workspace without resolution errors.

## Task 2: Scaffold The Cloudflare React SSR App

**Files:**
- Create: `apps/web/react-router.config.ts`
- Create: `apps/web/vite.config.ts`
- Create: `apps/web/wrangler.jsonc`
- Create: `apps/web/worker-configuration.d.ts`
- Create: `apps/web/app/root.tsx`
- Create: `apps/web/app/routes.ts`
- Create: `apps/web/app/entry.client.tsx`
- Create: `apps/web/app/styles/global.css`
- Test: `apps/web/app/routes/__tests__/home.route.test.tsx`

- [ ] **Step 1: Write a failing home route smoke test**

```tsx
import { renderToString } from "react-dom/server";
import { createRoutesStub } from "react-router";
import HomeRoute from "../home";

test("home route renders the Moment4us heading", () => {
  const Stub = createRoutesStub([{ path: "/", Component: HomeRoute }]);
  const html = renderToString(<Stub initialEntries={["/"]} />);
  expect(html).toContain("Moment4us");
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `pnpm --filter @moment4us/web test -- run app/routes/__tests__/home.route.test.tsx`

Expected: fail because route files and test setup do not exist yet.

- [ ] **Step 3: Create the SSR shell**

Implement:

- `react-router.config.ts`
- `vite.config.ts`
- `wrangler.jsonc`
- `app/root.tsx`
- `app/routes.ts`
- `app/entry.client.tsx`

The first route should render a minimal `Moment4us` homepage placeholder and include the global stylesheet.

- [ ] **Step 4: Add the minimum CSS and app layout**

Create `app/styles/global.css` with baseline tokens, font stack placeholder, body defaults, and link/button resets.

- [ ] **Step 5: Re-run the home smoke test**

Run: `pnpm --filter @moment4us/web test -- run app/routes/__tests__/home.route.test.tsx`

Expected: PASS

- [ ] **Step 6: Verify dev and build scripts**

Run: `pnpm --filter @moment4us/web build`

Expected: React Router/Vite build completes without unresolved workspace imports.

## Task 3: Create Shared Domain Packages

**Files:**
- Create: `packages/content/src/site-page.ts`
- Create: `packages/content/src/portfolio-project.ts`
- Create: `packages/content/src/blog-post.ts`
- Create: `packages/content/src/lead.ts`
- Create: `packages/content/src/homepage-layout.ts`
- Create: `packages/content/src/index.ts`
- Create: `packages/shared/src/constants.ts`
- Create: `packages/shared/src/routes.ts`
- Create: `packages/shared/src/types.ts`
- Create: `packages/shared/src/index.ts`
- Test: `packages/content/src/__tests__/homepage-layout.test.ts`

- [ ] **Step 1: Write a failing homepage layout validation test**

```ts
import { parseHomepageSections } from "../homepage-layout";

test("homepage layout requires the approved section order", () => {
  expect(() =>
    parseHomepageSections(["hero", "about", "cta"])
  ).toThrow(/featured-portfolio/);
});
```

- [ ] **Step 2: Run the package test and verify it fails**

Run: `pnpm --filter @moment4us/content test -- run src/__tests__/homepage-layout.test.ts`

Expected: FAIL because the parser does not exist yet.

- [ ] **Step 3: Implement core content schemas**

Create type-safe schema modules for:

- site pages
- portfolio projects
- blog posts
- leads
- homepage section ordering

- [ ] **Step 4: Export route constants and shared app constants**

Add stable route helpers such as:

```ts
export const routes = {
  home: "/",
  portfolio: "/portfolio",
  about: "/about",
  services: "/services",
  contact: "/contact",
  admin: "/admin",
} as const;
```

- [ ] **Step 5: Re-run the content package test**

Run: `pnpm --filter @moment4us/content test -- run src/__tests__/homepage-layout.test.ts`

Expected: PASS

## Task 4: Add D1 Access And Initial Schema

**Files:**
- Create: `packages/data/src/d1/client.ts`
- Create: `packages/data/src/repositories/site-pages.ts`
- Create: `packages/data/src/repositories/portfolio-projects.ts`
- Create: `packages/data/src/repositories/leads.ts`
- Create: `packages/data/src/repositories/blog-posts.ts`
- Create: `packages/data/src/images/transform.ts`
- Create: `packages/data/src/index.ts`
- Create: `apps/web/migrations/0001_initial.sql`
- Create: `apps/web/migrations/0002_seed_core_pages.sql`
- Test: `packages/data/src/__tests__/site-pages.test.ts`
- Test: `packages/data/src/__tests__/portfolio-projects.test.ts`
- Test: `packages/data/src/__tests__/leads.test.ts`

- [ ] **Step 1: Write a failing repository test for site pages**

```ts
test("getPageBySlug returns homepage content", async () => {
  const repo = createSitePagesRepository(fakeDb);
  await repo.seedHomepage();
  const page = await repo.getPageBySlug("home");
  expect(page?.slug).toBe("home");
});
```

- [ ] **Step 2: Run repository tests and verify failure**

Run: `pnpm --filter @moment4us/data test -- run src/__tests__/site-pages.test.ts`

Expected: FAIL because repository code and fake DB helpers do not exist.

- [ ] **Step 3: Create SQL migrations**

`0001_initial.sql` should define:

- `site_pages`
- `portfolio_projects`
- `portfolio_images`
- `blog_posts`
- `leads`
- `admin_users`

`0002_seed_core_pages.sql` should seed homepage/about/services/contact starter entries.

- [ ] **Step 4: Implement typed repositories**

Build repository modules that accept a D1 client wrapper and expose focused methods such as:

- `getPageBySlug`
- `listFeaturedProjects`
- `getProjectBySlug`
- `createLead`

- [ ] **Step 5: Add image URL transform helpers**

Expose a helper that converts stored image IDs into Cloudflare Images URLs with width/quality variants.

- [ ] **Step 6: Re-run repository tests**

Run: `pnpm --filter @moment4us/data test`

Expected: PASS

## Task 5: Build Public Shell Routes

**Files:**
- Create: `apps/web/app/components/site-header.tsx`
- Create: `apps/web/app/components/site-footer.tsx`
- Create: `apps/web/app/routes/about.tsx`
- Create: `apps/web/app/routes/services.tsx`
- Create: `apps/web/app/routes/contact.tsx`
- Modify: `apps/web/app/root.tsx`
- Modify: `apps/web/app/routes.ts`
- Test: `apps/web/app/routes/__tests__/home.route.test.tsx`

- [ ] **Step 1: Expand the home route test to assert core nav links**

Add expectations for:

- `Portfolio`
- `About`
- `Services`
- `Contact`

- [ ] **Step 2: Run the test and verify failure**

Run: `pnpm --filter @moment4us/web test -- run app/routes/__tests__/home.route.test.tsx`

Expected: FAIL because header/footer navigation has not been added yet.

- [ ] **Step 3: Implement root layout chrome**

Add shared header/footer components and wire them through `app/root.tsx`.

- [ ] **Step 4: Add placeholder content routes**

Create minimal route modules for:

- `/about`
- `/services`
- `/contact`

Each route should load starter content from the page repository or fixtures.

- [ ] **Step 5: Re-run web route tests**

Run: `pnpm --filter @moment4us/web test -- run app/routes/__tests__/home.route.test.tsx`

Expected: PASS

## Task 6: Implement The Homepage Narrative And Masonry Preview

**Files:**
- Create: `apps/web/app/components/hero-section.tsx`
- Create: `apps/web/app/components/masonry-gallery.tsx`
- Create: `apps/web/app/loaders/home.server.ts`
- Modify: `apps/web/app/routes/home.tsx`
- Test: `apps/web/app/routes/__tests__/home.route.test.tsx`
- Test: `apps/web/app/lib/__tests__/seo.test.ts`

- [ ] **Step 1: Extend the home route test with approved section copy**

Assert that the rendered homepage contains:

- `Warm, authentic photography`
- `Selected Stories`
- `About Moment4us`
- `What We Photograph`
- `Let’s Tell Your Story`

- [ ] **Step 2: Run the home test and verify failure**

Run: `pnpm --filter @moment4us/web test -- run app/routes/__tests__/home.route.test.tsx`

Expected: FAIL because the narrative sections are not implemented.

- [ ] **Step 3: Build the homepage loader**

Load:

- homepage page content
- featured portfolio records
- homepage SEO metadata

- [ ] **Step 4: Implement the homepage sections**

Build:

- hero
- featured masonry preview
- about preview
- services snapshot
- approach/process section
- trust signals block
- inquiry CTA

- [ ] **Step 5: Add a masonry gallery component with stable aspect handling**

The component should:

- accept image items with explicit width/height
- render responsive column counts
- lazy-load non-critical images

- [ ] **Step 6: Add SEO helper coverage**

Create `app/lib/seo.ts` and test metadata generation for homepage and portfolio pages.

- [ ] **Step 7: Re-run homepage and SEO tests**

Run: `pnpm --filter @moment4us/web test -- run app/routes/__tests__/home.route.test.tsx app/lib/__tests__/seo.test.ts`

Expected: PASS

## Task 7: Build Portfolio Listing And Project Pages

**Files:**
- Create: `apps/web/app/loaders/portfolio.server.ts`
- Create: `apps/web/app/routes/portfolio.tsx`
- Create: `apps/web/app/routes/portfolio.$slug.tsx`
- Modify: `apps/web/app/routes.ts`
- Test: `apps/web/app/routes/__tests__/portfolio.route.test.tsx`

- [ ] **Step 1: Write a failing portfolio route test**

```tsx
test("portfolio route renders featured project cards", async () => {
  const html = await renderPortfolioPage();
  expect(html).toContain("Selected Stories");
  expect(html).toContain("View Story");
});
```

- [ ] **Step 2: Run the portfolio test and verify failure**

Run: `pnpm --filter @moment4us/web test -- run app/routes/__tests__/portfolio.route.test.tsx`

Expected: FAIL because portfolio route modules do not exist.

- [ ] **Step 3: Implement the portfolio listing route**

Render a masonry-style gallery that links to project detail pages.

- [ ] **Step 4: Implement the project detail route**

Render:

- hero image
- story summary
- editorial image sequence
- next-step CTA
- page-specific SEO metadata

- [ ] **Step 5: Re-run the portfolio route tests**

Run: `pnpm --filter @moment4us/web test -- run app/routes/__tests__/portfolio.route.test.tsx`

Expected: PASS

## Task 8: Add Inquiry Form, Turnstile, Lead Storage, And Email Notification

**Files:**
- Create: `apps/web/app/components/inquiry-form.tsx`
- Create: `apps/web/app/actions/inquiry.server.ts`
- Create: `apps/web/app/lib/turnstile.server.ts`
- Create: `apps/web/app/lib/email.server.ts`
- Modify: `apps/web/app/routes/contact.tsx`
- Test: `apps/web/app/routes/__tests__/contact.action.test.tsx`
- Test: `apps/web/app/lib/__tests__/turnstile.server.test.ts`

- [ ] **Step 1: Write a failing inquiry action test**

```ts
test("contact inquiry stores a lead and returns success", async () => {
  const response = await submitInquiry(validPayload);
  expect(response.status).toBe(200);
  expect(await response.json()).toMatchObject({ ok: true });
});
```

- [ ] **Step 2: Run the inquiry action test and verify failure**

Run: `pnpm --filter @moment4us/web test -- run app/routes/__tests__/contact.action.test.tsx`

Expected: FAIL because the action does not exist.

- [ ] **Step 3: Implement Turnstile verification wrapper**

`turnstile.server.ts` should isolate Cloudflare verification logic so it can be mocked cleanly in tests.

- [ ] **Step 4: Implement inquiry action**

Behavior:

- validate form fields
- verify Turnstile token
- write lead row via `@moment4us/data`
- send email notification
- return structured success/error payload

- [ ] **Step 5: Add the inquiry form component**

The contact page should render a server-connected form with clear pending, success, and failure states.

- [ ] **Step 6: Add unit tests for Turnstile wrapper and action edge cases**

Cover:

- missing token
- invalid email
- D1 write failure
- email send failure

- [ ] **Step 7: Re-run inquiry tests**

Run: `pnpm --filter @moment4us/web test -- run app/routes/__tests__/contact.action.test.tsx app/lib/__tests__/turnstile.server.test.ts`

Expected: PASS

## Task 9: Build The MVP Admin Area

**Files:**
- Create: `apps/web/app/components/admin/protected-layout.tsx`
- Create: `apps/web/app/components/admin/content-form.tsx`
- Create: `apps/web/app/components/admin/lead-table.tsx`
- Create: `apps/web/app/lib/session.server.ts`
- Create: `apps/web/app/routes/admin/index.tsx`
- Create: `apps/web/app/routes/admin/pages.tsx`
- Create: `apps/web/app/routes/admin/portfolio.tsx`
- Create: `apps/web/app/routes/admin/leads.tsx`
- Test: `apps/web/app/routes/__tests__/admin.route.test.tsx`

- [ ] **Step 1: Write a failing admin protection test**

```tsx
test("admin routes redirect unauthenticated users", async () => {
  const response = await requestAdminRoute();
  expect(response.status).toBe(302);
});
```

- [ ] **Step 2: Run the admin route test and verify failure**

Run: `pnpm --filter @moment4us/web test -- run app/routes/__tests__/admin.route.test.tsx`

Expected: FAIL because admin routes and session handling do not exist.

- [ ] **Step 3: Implement minimal session/auth guard**

Use a simple password-protected admin session for MVP. Do not introduce roles or granular ACLs yet.

- [ ] **Step 4: Implement admin dashboard and CRUD screens**

Screens:

- admin overview
- manage pages
- manage portfolio entries
- view leads

- [ ] **Step 5: Re-run the admin tests**

Run: `pnpm --filter @moment4us/web test -- run app/routes/__tests__/admin.route.test.tsx`

Expected: PASS

## Task 10: Add SEO Foundations And Blog-Ready Structure

**Files:**
- Modify: `apps/web/app/lib/seo.ts`
- Modify: `apps/web/app/root.tsx`
- Create: `apps/web/app/routes/blog.tsx`
- Create: `apps/web/app/routes/sitemap[.]xml.ts`
- Create: `apps/web/app/routes/robots[.]txt.ts`
- Test: `apps/web/app/lib/__tests__/seo.test.ts`

- [ ] **Step 1: Add a failing SEO helper test for canonical and OG tags**

```ts
test("buildSeo returns canonical and og image values", () => {
  const seo = buildSeo({ title: "Portfolio", pathname: "/portfolio" });
  expect(seo.canonical).toBe("https://moment4us.com/portfolio");
  expect(seo.openGraph).toBeDefined();
});
```

- [ ] **Step 2: Run the SEO test and verify failure**

Run: `pnpm --filter @moment4us/web test -- run app/lib/__tests__/seo.test.ts`

Expected: FAIL until canonical and OG support are implemented.

- [ ] **Step 3: Implement SEO helpers and route exports**

Support:

- title
- description
- canonical
- Open Graph
- Twitter card

- [ ] **Step 4: Add sitemap and robots routes**

Generate route output from the same content repositories used by public pages.

- [ ] **Step 5: Add a placeholder blog index route**

The route may show an editorial-coming-soon message, but it should already use the blog content schema and SEO helper.

- [ ] **Step 6: Re-run the SEO test suite**

Run: `pnpm --filter @moment4us/web test -- run app/lib/__tests__/seo.test.ts`

Expected: PASS

## Task 11: Verification, Seed Data, And Deployment Readiness

**Files:**
- Modify: `README.md`
- Modify: `apps/web/wrangler.jsonc`
- Modify: `apps/web/worker-configuration.d.ts`
- Modify: `apps/web/package.json`
- Create: `apps/web/.dev.vars.example`

- [ ] **Step 1: Add environment variable documentation**

Document:

- D1 binding
- Images account/hash settings
- Turnstile keys
- email sender/recipient bindings
- admin password/session secret

- [ ] **Step 2: Add local dev and deploy scripts**

Ensure `apps/web/package.json` exposes:

- `dev`
- `build`
- `preview`
- `test`
- `lint`
- `typecheck`
- `cf-typegen`

- [ ] **Step 3: Run full repo verification**

Run:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm --filter @moment4us/web build
```

Expected: all commands pass.

- [ ] **Step 4: Verify local Cloudflare worker startup**

Run: `pnpm --filter @moment4us/web dev`

Expected: local Worker starts with React SSR routes and no missing binding type errors.

- [ ] **Step 5: Prepare a content seed checklist**

Document the minimum data required before production deploy:

- homepage copy
- about page copy
- services copy
- first 6 to 12 portfolio images
- first 3 featured portfolio stories
- contact email destination

## Notes For Implementation

- Keep one deployable app for MVP. Do not split admin or API into separate Workers.
- Use repository modules in `packages/data` rather than scattering SQL in route files.
- Keep masonry usage limited to homepage preview and portfolio listing.
- Do not add real-time scheduling or payment support.
- Prefer content stored in D1 over hard-coded page strings once the content layer exists.
- Use TDD for route actions, loaders, repository functions, and SEO helpers.

## Suggested Commit Boundaries

1. `chore(repo): scaffold pnpm monorepo and shared config`
2. `feat(web): add cloudflare react router app shell`
3. `feat(domain): add content schemas and d1 repositories`
4. `feat(site): add public marketing pages and homepage sections`
5. `feat(portfolio): add gallery and project detail pages`
6. `feat(contact): add inquiry workflow with turnstile and email`
7. `feat(admin): add lightweight content and leads admin`
8. `feat(seo): add sitemap robots and blog-ready structure`
