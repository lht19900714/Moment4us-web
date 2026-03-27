import { redirect, useActionData, useNavigation, type ActionFunctionArgs, type MetaFunction } from "react-router";

import {
  clearAdminSession,
  createAdminSession,
  isAdminAuthenticated,
  verifyAdminPassword,
} from "../lib/admin-auth.server";

interface LoginActionError {
  ok: false;
  error: string;
}

interface CloudflareContext {
  cloudflare?: {
    env?: {
      ADMIN_PASSWORD_HASH?: string;
    };
  };
}

export async function loader({ request }: { request: Request }) {
  if (isAdminAuthenticated(request)) {
    return redirect("/admin");
  }
  return null;
}

export async function action({ request, context }: ActionFunctionArgs) {
  const url = new URL(request.url);
  const cfContext = context as CloudflareContext;

  // Handle logout
  if (url.searchParams.has("logout")) {
    const headers = new Headers();
    clearAdminSession(headers);
    return redirect("/admin/login", { headers });
  }

  const hash = cfContext?.cloudflare?.env?.ADMIN_PASSWORD_HASH;

  if (!hash) {
    return { ok: false, error: "Admin login is not configured. Set ADMIN_PASSWORD_HASH in .dev.vars or wrangler secrets." } satisfies LoginActionError;
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return { ok: false, error: "Unable to process the form." } satisfies LoginActionError;
  }

  const password = formData.get("password");
  if (typeof password !== "string" || password.length === 0) {
    return { ok: false, error: "Password is required." } satisfies LoginActionError;
  }

  const valid = await verifyAdminPassword(password, hash);
  if (!valid) {
    return { ok: false, error: "Invalid password." } satisfies LoginActionError;
  }

  const headers = new Headers();
  createAdminSession(headers);

  return redirect("/admin", { headers });
}

export const meta: MetaFunction = () => [{ title: "Admin Login | Moment4us" }];

export default function AdminLoginRoute() {
  const actionData = useActionData<LoginActionError | undefined>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting" || navigation.state === "loading";
  const error = actionData?.error;

  return (
    <main className="admin-login">
      <div className="admin-login__card">
        <h1 className="admin-login__title">Admin</h1>
        <p className="admin-login__subtitle">Sign in to manage your studio</p>

        {error && (
          <p className="admin-login__error" role="alert">
            {error}
          </p>
        )}

        {/* Native form — full page POST ensures cookie is set before redirect */}
        <form method="post" className="admin-login__form">
          <div className="contact-form__field">
            <label className="contact-form__label" htmlFor="admin-password">
              Password
            </label>
            <input
              autoComplete="current-password"
              className="contact-form__input"
              id="admin-password"
              name="password"
              required
              type="password"
            />
          </div>

          <button
            className="btn-ghost btn-ghost--filled admin-login__submit"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? (
              <>
                <span className="admin-spinner" aria-hidden="true" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
