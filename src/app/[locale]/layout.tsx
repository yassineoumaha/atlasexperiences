import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { getDictionary, hasLocale, rtlLocales, type Locale } from "@/lib/dictionaries";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SchemaScript from "@/components/SchemaScript";
import CookieConsent from "@/components/CookieConsent";
import LegalConsentGate from "@/components/LegalConsentGate";
import LocaleAttributes from "@/components/LocaleAttributes";
import WhatsAppButton from "@/components/WhatsAppButton";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import { createClient } from "@/lib/supabase/server";

export async function generateStaticParams() {
  return [
    { locale: "en" },
    { locale: "fr" },
    { locale: "es" },
    { locale: "ar" },
  ];
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://imourig.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: {
      absolute: "Imourig — Book Local Morocco Experiences",
      template: "%s | Imourig",
    },
    description:
      "Morocco's local experience marketplace. Book surf lessons, Sahara tours, cooking classes, hammams and more from verified local operators.",
    keywords: ["Morocco experiences", "Morocco activities", "surf lessons Morocco", "Sahara tour", "Morocco cooking class", "Imourig"],
    metadataBase: new URL(SITE_URL),
    openGraph: {
      type: "website",
      locale: locale,
      siteName: "Imourig",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Imourig" }],
    },
    twitter: { card: "summary_large_image" },
    alternates: {
      // No canonical here — a layout-level canonical would make every child
      // page (experiences, about, blog…) claim to be the homepage. Each page
      // sets its own; pages that don't self-canonicalize to their own URL.
      languages: {
        "en": `${SITE_URL}/en`,
        "fr": `${SITE_URL}/fr`,
        "es": `${SITE_URL}/es`,
        "ar": `${SITE_URL}/ar`,
        "x-default": `${SITE_URL}/en`,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);
  const isRTL = rtlLocales.includes(locale as Locale);

  // /admin and /portal render their own full-screen shells (sidebar, own logo).
  // Skip the public navbar/footer/banner there so they don't overlap.
  const pathname = (await headers()).get("x-pathname") || "";
  const pathWithoutLocale = "/" + pathname.split("/").slice(2).join("/");
  const bareChrome =
    pathWithoutLocale === "/admin" || pathWithoutLocale.startsWith("/admin/") ||
    pathWithoutLocale === "/portal" || pathWithoutLocale.startsWith("/portal/");

  const supabase = await createClient();
  const { data: announcements } = await supabase
    .from("announcements")
    .select("id,message,type,link_url,link_label")
    .eq("active", true)
    .or("expires_at.is.null,expires_at.gt." + new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(3);

  if (bareChrome) {
    return (
      <>
        <LocaleAttributes locale={locale} isRTL={isRTL} />
        {children}
        <LegalConsentGate locale={locale} />
      </>
    );
  }

  return (
    <>
      <LocaleAttributes locale={locale} isRTL={isRTL} />
      <SchemaScript schema={{ "@context": "https://schema.org", "@type": "WebSite", name: "Imourig", url: SITE_URL }} />
      <AnnouncementBanner announcements={announcements ?? []} />
      <Navbar dict={dict} locale={locale as Locale} />
      <main className="flex-1">{children}</main>
      <Footer dict={dict} locale={locale as Locale} />
      <CookieConsent />
      <LegalConsentGate locale={locale} />
      <WhatsAppButton />
    </>
  );
}
