import { createLeadsRepository, type CreateLeadInput } from "@moment4us/data";

import type { CloudflareContext } from "../lib/cloudflare-env";
import { formatLeadNotificationText } from "../lib/email.server";
import { verifyTurnstileToken } from "../lib/turnstile.server";

export interface ContactActionSuccess {
  ok: true;
}

export interface ContactActionValidationError {
  ok: false;
  errors: Record<string, string>;
}

export interface ContactActionServerError {
  ok: false;
  error: string;
}

export type ContactActionResult = ContactActionSuccess | ContactActionValidationError | ContactActionServerError;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function handleContactAction(
  request: Request,
  context?: CloudflareContext,
): Promise<ContactActionResult> {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return { ok: false, error: "Unable to process the form submission." };
  }

  const name = getString(formData, "name");
  const email = getString(formData, "email");
  const phone = getString(formData, "phone");
  const serviceType = getString(formData, "serviceType");
  const eventDate = getString(formData, "eventDate");
  const message = getString(formData, "message");
  const turnstileToken = getString(formData, "cf-turnstile-response");

  const errors: Record<string, string> = {};

  if (!name) {
    errors.name = "Name is required.";
  }

  if (!email) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!serviceType) {
    errors.serviceType = "Please select a service type.";
  }

  if (!message) {
    errors.message = "Message is required.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  const secretKey = context?.cloudflare?.env?.TURNSTILE_SECRET_KEY;

  if (secretKey && turnstileToken) {
    const verified = await verifyTurnstileToken(turnstileToken, secretKey);

    if (!verified) {
      return { ok: false, errors: { turnstile: "Anti-spam verification failed. Please try again." } };
    }
  }

  const db = context?.cloudflare?.env?.DB;

  if (db !== undefined) {
    try {
      const leadInput = buildLeadInput(name!, email!, serviceType!, message!, phone, eventDate);
      await createLeadsRepository(db).createLead(leadInput);
    } catch {
      return { ok: false, error: "Something went wrong saving your inquiry. Please try again." };
    }
  }

  const studioEmail = context?.cloudflare?.env?.STUDIO_EMAIL;
  const ctx = context?.cloudflare?.ctx;

  if (studioEmail && ctx) {
    ctx.waitUntil(
      Promise.resolve().then(() => {
        const body = formatLeadNotificationText(
          buildNotificationInput(name!, email!, serviceType!, message!, phone, eventDate),
        );

        console.log(`[contact] notification for ${studioEmail}:\n${body}`);
      }),
    );
  }

  return { ok: true };
}

function getString(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function buildLeadInput(
  name: string,
  email: string,
  serviceType: string,
  message: string,
  phone?: string,
  eventDate?: string,
): CreateLeadInput {
  const input: CreateLeadInput = { type: "contact", name, email, serviceType, message };

  if (phone) {
    input.phone = phone;
  }

  if (eventDate) {
    input.eventDate = eventDate;
  }

  return input;
}

interface NotificationInput {
  name: string;
  email: string;
  phone?: string;
  serviceType: string;
  eventDate?: string;
  message: string;
}

function buildNotificationInput(
  name: string,
  email: string,
  serviceType: string,
  message: string,
  phone?: string,
  eventDate?: string,
): NotificationInput {
  const input: NotificationInput = { name, email, serviceType, message };

  if (phone) {
    input.phone = phone;
  }

  if (eventDate) {
    input.eventDate = eventDate;
  }

  return input;
}
