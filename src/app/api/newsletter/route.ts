import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";

const VALID_LOCALES = ["en", "fr", "es", "ar"] as const;

const NewsletterSchema = z.object({
  email: z.string().email().trim().toLowerCase().max(254),
  locale: z.enum(VALID_LOCALES).default("en"),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = NewsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid email address" },
      { status: 422 }
    );
  }

  const { email, locale } = parsed.data;

  const admin = await createAdminClient();
  const { error } = await admin
    .from("newsletter_subscribers")
    .insert({ email, locale });

  if (error) {
    // 23505 = unique_violation — already subscribed
    if (error.code === "23505") {
      return NextResponse.json({ message: "Already subscribed" }, { status: 200 });
    }
    console.error("[newsletter API] insert error", error);
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }

  return NextResponse.json({ message: "Subscribed" }, { status: 201 });
}
