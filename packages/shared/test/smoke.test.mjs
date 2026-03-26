import test from "node:test";
import assert from "node:assert/strict";
import {
  adminRoutes,
  leadStatuses,
  routePath,
  routes,
  siteName,
  toPortfolioProjectRoute,
} from "../dist/index.js";

test("shared package build exports stable route/constants contracts", () => {
  assert.equal(siteName, "Moment4us");
  assert.deepEqual(leadStatuses, ["new", "contacted", "qualified", "closed"]);

  assert.equal(routePath("home"), routes.home);
  assert.equal(routePath("portfolio"), "/portfolio");
  assert.equal(adminRoutes.pages, "/admin/pages");
  assert.equal(toPortfolioProjectRoute(" /engagement-session/ "), "/portfolio/engagement-session");
  assert.throws(() => toPortfolioProjectRoute("///"), /single path segment/i);
  assert.throws(() => toPortfolioProjectRoute("stories/city-elopement"), /single path segment/i);
});
