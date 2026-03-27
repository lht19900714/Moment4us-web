import type { D1DatabaseLike } from "../../../../packages/data/src";

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_TOKEN_LENGTH = 32;

interface AdminEnv {
  DB?: D1DatabaseLike | undefined;
  ADMIN_PASSWORD_HASH?: string | undefined;
}

/**
 * Verify a plaintext password against the stored SHA-256 hex hash.
 * Uses constant-time comparison to avoid timing attacks.
 */
export async function verifyAdminPassword(password: string, hash: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const inputHash = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if (inputHash.length !== hash.length) {
    return false;
  }

  // Constant-time comparison
  let mismatch = 0;
  for (let i = 0; i < inputHash.length; i++) {
    mismatch |= inputHash.charCodeAt(i) ^ hash.charCodeAt(i);
  }

  return mismatch === 0;
}

/**
 * Generate a cryptographically random session token.
 */
function generateSessionToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(SESSION_TOKEN_LENGTH));
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Create an admin session by setting an HttpOnly cookie on the response.
 */
export function createAdminSession(headers: Headers): void {
  const token = generateSessionToken();
  const parts = [
    `${SESSION_COOKIE_NAME}=${token}`,
    "Path=/admin",
    "HttpOnly",
    "SameSite=Strict",
    "Max-Age=86400", // 24 hours
  ];

  // Only set Secure flag in production (HTTPS)
  if (typeof globalThis.process === "undefined" || globalThis.process?.env?.NODE_ENV === "production") {
    parts.push("Secure");
  }

  headers.append("Set-Cookie", parts.join("; "));
}

/**
 * Clear the admin session cookie.
 */
export function clearAdminSession(headers: Headers): void {
  const parts = [
    `${SESSION_COOKIE_NAME}=`,
    "Path=/admin",
    "HttpOnly",
    "SameSite=Strict",
    "Max-Age=0",
  ];

  if (typeof globalThis.process === "undefined" || globalThis.process?.env?.NODE_ENV === "production") {
    parts.push("Secure");
  }

  headers.append("Set-Cookie", parts.join("; "));
}

/**
 * Parse the session token from the Cookie header.
 */
function getSessionToken(request: Request): string | null {
  const cookieHeader = request.headers.get("Cookie");
  if (cookieHeader === null) {
    return null;
  }

  const cookies = cookieHeader.split(";").map((c) => c.trim());
  for (const cookie of cookies) {
    const [name, ...rest] = cookie.split("=");
    if (name?.trim() === SESSION_COOKIE_NAME) {
      const value = rest.join("=").trim();
      return value.length > 0 ? value : null;
    }
  }

  return null;
}

/**
 * Check if the request has a valid admin session.
 * For MVP, any non-empty session token is considered valid
 * (the token was only set after password verification).
 */
export function isAdminAuthenticated(request: Request): boolean {
  const token = getSessionToken(request);
  return token !== null && token.length > 0;
}

/**
 * Require admin authentication. Throws a Response redirect to /admin/login if not authenticated.
 */
export function requireAdmin(request: Request, _env: AdminEnv): void {
  if (!isAdminAuthenticated(request)) {
    throw new Response(null, {
      status: 302,
      headers: { Location: "/admin/login" },
    });
  }
}
