import { getDictionary, hasLocale, type Locale } from "@/lib/dictionaries";
import { notFound } from "next/navigation";
import OperatorRegisterClient from "./OperatorRegisterClient";

export default async function OperatorRegisterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);
  return <OperatorRegisterClient locale={locale} dict={dict} />;
}
