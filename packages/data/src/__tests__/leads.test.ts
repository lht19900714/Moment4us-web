import { expect, test } from "vitest";

import { createFakeD1Database } from "./helpers/fake-d1";
import { createLeadsRepository } from "../repositories/leads";

test("createLead persists a new booking inquiry with default status", async () => {
  const fakeDb = createFakeD1Database();
  const repo = createLeadsRepository(fakeDb, {
    createId: () => "lead_1234",
    now: () => "2026-03-26T10:00:00Z",
  });

  const lead = await repo.createLead({
    type: "booking",
    name: "Taylor Chen",
    email: "taylor@example.com",
    phone: "123-456-7890",
    serviceType: "Wedding",
    eventDate: "2026-09-12",
    message: "We would love full-day coverage.",
  });

  expect(lead).toMatchObject({
    id: "lead_1234",
    status: "new",
    createdAt: "2026-03-26T10:00:00Z",
  });
  expect(fakeDb.table("leads")).toEqual([
    {
      id: "lead_1234",
      type: "booking",
      name: "Taylor Chen",
      email: "taylor@example.com",
      phone: "123-456-7890",
      service_type: "Wedding",
      event_date: "2026-09-12",
      message: "We would love full-day coverage.",
      status: "new",
      created_at: "2026-03-26T10:00:00Z",
      updated_at: "2026-03-26T10:00:00Z",
    },
  ]);
});

test("createLead surfaces duplicate lead id collisions", async () => {
  const fakeDb = createFakeD1Database();
  const repo = createLeadsRepository(fakeDb, {
    createId: () => "lead_duplicate",
    now: () => "2026-03-26T10:00:00Z",
  });

  await repo.createLead({
    type: "contact",
    name: "First Person",
    email: "first@example.com",
    serviceType: "Portrait",
    message: "First inquiry.",
  });

  await expect(
    repo.createLead({
      type: "contact",
      name: "Second Person",
      email: "second@example.com",
      serviceType: "Portrait",
      message: "Second inquiry.",
    }),
  ).rejects.toThrow(/unique constraint failed: leads.id/i);
});
