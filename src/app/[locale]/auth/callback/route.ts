import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  const locale = request.nextUrl.pathname.split("/")[1] || "en";

  const VALID_LOCALES = ["en", "fr", "es", "ar"];
  const safeLocale = VALID_LOCALES.includes(locale) ? locale : "en";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      const errorUrl = new URL(`/${safeLocale}/auth/login`, origin);
      errorUrl.searchParams.set("error", "Could not verify email. Please try again.");
      return NextResponse.redirect(errorUrl.toString());
    }
  }

  // Redirect to `next` param if it's a relative, safe path; otherwise go home
  if (next && next.startsWith("/") && !next.startsWith("//")) {
    return NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(`${origin}/${safeLocale}`);
}
