import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function PortalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/operators/login`);
  }

  // Verify operator record exists; if not, send to registration
  const { data: operator } = await supabase
    .from("operators")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!operator) {
    redirect(`/${locale}/operators/register`);
  }

  return <>{children}</>;
}
