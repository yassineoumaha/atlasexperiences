import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const LOCALES = ["en", "fr", "es", "ar"] as const;
const DEFAULT_LOCALE = "en";

const PROTECTED_PATHS = ["/portal", "/bookings"];
const ADMIN_PATHS = ["/admin"];

function detectLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language") || "";
  const preferred = acceptLanguage
    .split(",")
    .map((s) => s.split(";")[0].trim().slice(0, 2).toLowerCase());
  for (const lang of preferred) {
    if ((LOCALES as readonly string[]).includes(lang)) return lang;
  }
  return DEFAULT_LOCALE;
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  const h = response.headers;
  h.set("X-Content-Type-Options", "nosniff");
  h.set("X-Frame-Options", "SAMEORIGIN");
  h.set("X-XSS-Protection", "1; mode=block");
  h.set("Referrer-Policy", "strict-origin-when-cross-origin");
  h.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  h.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  h.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://images.pexels.com https://cf.bstatic.com https://q-xx.bstatic.com https://*.supabase.co",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.mapbox.com https://tiles.openfreemap.org https://*.maptiler.com",
      "worker-src blob:",
      "child-src blob:",
      "frame-ancestors 'none'",
    ].join("; ")
  );
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return addSecurityHeaders(NextResponse.next());
  }

  // Locale redirect: / → /en (or detected locale)
  const pathnameHasLocale = LOCALES.some(
    (loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`)
  );

  if (!pathnameHasLocale) {
    const locale = detectLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(url);
  }

  // Extract locale and path without locale prefix
  const locale = pathname.split("/")[1] as string;
  const pathWithoutLocale = "/" + pathname.split("/").slice(2).join("/");

  // Auth guard
  const needsAuth = PROTECTED_PATHS.some(
    (p) => pathWithoutLocale === p || pathWithoutLocale.startsWith(p + "/")
  );
  const needsAdmin = ADMIN_PATHS.some(
    (p) => pathWithoutLocale === p || pathWithoutLocale.startsWith(p + "/")
  );

  if (needsAuth || needsAdmin) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll() {},
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const loginUrl = request.nextUrl.clone();
      // The portal is the operator workspace — send logged-out visitors to the
      // operator-branded sign-in (with its "Join the team" path). Other
      // protected paths (e.g. /bookings) use the general traveler login.
      if (pathWithoutLocale === "/portal" || pathWithoutLocale.startsWith("/portal/")) {
        loginUrl.pathname = `/${locale}/operators/login`;
        loginUrl.search = "";
      } else {
        loginUrl.pathname = `/${locale}/auth/login`;
        loginUrl.searchParams.set("next", pathname);
      }
      return NextResponse.redirect(loginUrl);
    }

    if (needsAdmin) {
      const adminEmails = (process.env.ADMIN_EMAILS || "")
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);
      if (!adminEmails.includes(user.email || "")) {
        const homeUrl = request.nextUrl.clone();
        homeUrl.pathname = `/${locale}`;
        homeUrl.search = "";
        return NextResponse.redirect(homeUrl);
      }
    }
  }

  return addSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|images|.*\\..*).*)"],
};
