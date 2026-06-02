import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ChatWidget from "@/components/ChatWidget";
import { CheckCircle, Clock, Calendar, Users, DollarSign, MessageCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type { BookingRow } from "@/lib/supabase/types";

type BookingWithJoins = BookingRow & {
  experiences: { title: string; slug: string; city: string; category: string; duration_hours: number } | null;
  operators: { business_name: string; phone: string | null; whatsapp: string | null } | null;
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: LucideIcon }> = {
  pending:   { label: "Awaiting confirmation",  color: "bg-orange-100 text-orange-700 border-orange-200", icon: Clock },
  confirmed: { label: "Confirmed",              color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle },
  completed: { label: "Completed",              color: "bg-blue-100 text-blue-700 border-blue-200",    icon: CheckCircle },
  cancelled: { label: "Cancelled",              color: "bg-red-100 text-red-600 border-red-200",      icon: Clock },
};

export default async function BookingPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/auth/login`);

  const db = supabase;
  const { data: booking } = await db
    .from("bookings")
    .select("*, experiences(title, slug, city, category, duration_hours), operators(business_name, phone, whatsapp)")
    .eq("id", id)
    .single() as { data: BookingWithJoins | null; error: unknown };

  if (!booking) notFound();

  // Only the traveler or operator can view this booking
  const isTraveler = booking.traveler_id === user.id;
  const isOperator = booking.operator_id === user.id;
  if (!isTraveler && !isOperator) notFound();

  const status = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.pending;
  const StatusIcon = status.icon;

  const currentUserName = isTraveler ? booking.traveler_name : booking.operators?.business_name;
  const otherPartyName  = isTraveler ? booking.operators?.business_name : booking.traveler_name;

  return (
    <div className="pt-20 min-h-screen bg-muted/40">
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Status banner */}
        <div className={`border rounded-2xl p-5 mb-6 flex items-center gap-3 ${status.color}`}>
          <StatusIcon className="w-6 h-6 shrink-0" />
          <div>
            <div className="font-black text-lg">{status.label}</div>
            {booking.status === "pending" && (
              <p className="text-sm opacity-80">
                {isTraveler
                  ? `${otherPartyName} will confirm within 24 hours via email.`
                  : `Reply to ${booking.traveler_email} to confirm this booking.`}
              </p>
            )}
          </div>
        </div>

        {/* Booking details */}
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="bg-stone-900 text-white px-5 py-4">
            <h1 className="font-black text-lg">{booking.experiences?.title}</h1>
            <p className="text-white/60 text-sm">{booking.experiences?.city} · Booking #{id.slice(0, 8).toUpperCase()}</p>
          </div>
          <div className="p-5 space-y-3">
            {[
              { icon: Calendar, label: "Date", value: new Date(booking.requested_date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) },
              { icon: Users, label: "Group size", value: `${booking.group_size} person${booking.group_size !== 1 ? "s" : ""}` },
              { icon: DollarSign, label: "Total", value: `$${booking.total_price} USD` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 text-sm">
                <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground w-24">{label}</span>
                <span className="font-medium text-foreground">{value}</span>
              </div>
            ))}
            {booking.special_requests && (
              <div className="mt-2 bg-muted/40 rounded-xl p-3 text-sm text-foreground/80">
                <span className="font-medium text-foreground/80">Special requests: </span>
                {booking.special_requests}
              </div>
            )}
          </div>
        </div>

        {/* Operator contact card (for traveler) */}
        {isTraveler && booking.operators && (
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm mb-6">
            <h2 className="font-bold text-foreground mb-3">Your Operator</h2>
            <p className="font-black text-foreground text-lg mb-2">{booking.operators.business_name}</p>
            <div className="flex gap-2">
              {booking.operators.whatsapp && (
                <a href={`https://wa.me/${booking.operators.whatsapp.replace(/\D/g, "")}?text=Hi! Booking reference: ${id.slice(0, 8).toUpperCase()}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              )}
              {booking.operators.phone && (
                <a href={`tel:${booking.operators.phone}`}
                  className="flex items-center gap-1.5 border border-input text-foreground/80 text-sm font-bold px-4 py-2 rounded-xl hover:bg-muted/40 transition-colors">
                  Call
                </a>
              )}
            </div>
          </div>
        )}

        {/* Traveler contact (for operator) */}
        {isOperator && (
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm mb-6">
            <h2 className="font-bold text-foreground mb-3">Traveler</h2>
            <p className="font-black text-foreground text-lg">{booking.traveler_name}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <a href={`mailto:${booking.traveler_email}?subject=Your booking — ${booking.experiences?.title}`}
                className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">
                Email Traveler
              </a>
              {booking.traveler_phone && (
                <a href={`tel:${booking.traveler_phone}`}
                  className="flex items-center gap-1.5 border border-input text-foreground/80 text-sm font-bold px-4 py-2 rounded-xl hover:bg-muted/40 transition-colors">
                  Call
                </a>
              )}
            </div>
            <div className="mt-3 bg-accent/10 border border-amber-100 rounded-xl p-3 text-xs text-amber-700">
              Platform fee: <strong>${booking.platform_fee}</strong> · Your payout: <strong>${booking.operator_payout}</strong> — invoiced monthly
            </div>
          </div>
        )}

        <Link href={isTraveler ? `/${locale}/experiences` : `/${locale}/portal`}
          className="text-primary text-sm font-medium hover:underline">
          ← {isTraveler ? "Browse more experiences" : "Back to dashboard"}
        </Link>
      </div>

      {/* Floating chat widget — only shown when both parties have accounts */}
      {booking.traveler_id && booking.operator_id && (
        <ChatWidget
          bookingId={id}
          currentUserId={user.id}
          currentUserName={currentUserName ?? ""}
          currentUserRole={isTraveler ? "traveler" : "operator"}
          otherPartyName={otherPartyName ?? ""}
        />
      )}
    </div>
  );
}
