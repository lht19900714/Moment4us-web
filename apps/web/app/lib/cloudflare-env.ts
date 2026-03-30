import type { D1DatabaseLike } from "@moment4us/data";

export interface CloudflareEnv {
  DB?: D1DatabaseLike;
  CLOUDFLARE_IMAGES_ACCOUNT_HASH?: string;
  CLOUDFLARE_IMAGES_VARIANT?: string;
  TURNSTILE_SITE_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  STUDIO_EMAIL?: string;
  ADMIN_PASSWORD_HASH?: string;
  IMAGES_BUCKET?: unknown;
}

export interface CloudflareContext {
  cloudflare?: {
    env?: CloudflareEnv;
    ctx?: { waitUntil(p: Promise<unknown>): void };
  };
}
