import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "@/lib/dictionaries";
import OperatorLoginClient from "./OperatorLoginClient";

export const metadata: Metadata = {
  title: "Operator Sign In — Imourig Partner Portal",
  description: "Sign in to your Imourig operator account to manage experiences, bookings and your profile. Not a partner yet? Join the team.",
};

export default async function OperatorLoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  return <OperatorLoginClient locale={locale as Locale} />;
}
