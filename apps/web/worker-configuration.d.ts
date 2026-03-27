declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    IMAGES_BUCKET?: R2Bucket;
    TURNSTILE_SITE_KEY?: string;
    TURNSTILE_SECRET_KEY?: string;
    STUDIO_EMAIL?: string;
    ADMIN_PASSWORD_HASH?: string;
    CLOUDFLARE_IMAGES_ACCOUNT_HASH?: string;
    CLOUDFLARE_IMAGES_VARIANT?: string;
  }
}

interface Env extends Cloudflare.Env {}
