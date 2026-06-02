import { listAllBookings } from "@/lib/db";
import { markBookingCompletedAction, markBookingCancelledAction, markBookingInvoicedAction, markBookingPaidAction } from "@/app/actions/admin";
import { CheckCircle, XCircle, DollarSign, FileText } from "lucide-react";

const STATUS_STYLE: Record<string, string> = {
  pending:   "bg-orange-100 text-orange-700",
  confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-600",
};

export default async function AdminBookingsPage() {
  const bookings = await listAllBookings();

  const pending    = bookings.filter((b) => b.status === "pending");
  const uninvoiced = bookings.filter((b) => b.status === "completed" && !b.operator_invoiced);
  const totalFees  = bookings.filter((b) => b.status === "completed").reduce((s, b) => s + (b.platform_fee ?? 0), 0);
  const unpaidFees = uninvoiced.reduce((s, b) => s + (b.platform_fee ?? 0), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-foreground">Bookings</h1>
        <div className="flex gap-2 text-sm flex-wrap">
          <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-medium">{pending.length} pending</span>
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">${totalFees} earned</span>
          {unpaidFees > 0 && <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-medium">${unpaidFees} uninvoiced</span>}
        </div>
      </div>

      <div className="space-y-3">
        {bookings.map((b) => (
          <div key={b.id} className={`bg-card border rounded-2xl p-5 shadow-sm ${b.status === "pending" ? "border-orange-200" : "border-border"}`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-bold text-foreground">{b.traveler_name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLE[b.status] ?? "bg-muted text-muted-foreground"}`}>{b.status}</span>
                  {b.operator_invoiced && <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">invoiced</span>}
                  {b.operator_paid && <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">paid</span>}
                </div>
                <p className="text-foreground/80 text-sm">{b.experiences?.title}</p>
                <p className="text-muted-foreground text-xs">by {b.operators?.business_name}</p>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-1">
                  <span>📅 {new Date(b.requested_date).toLocaleDateString()}</span>
                  <span>👥 {b.group_size} person{b.group_size !== 1 ? "s" : ""}</span>
                  <span>📧 {b.traveler_email}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-lg font-black text-foreground">${b.total_price}</div>
                <div className="text-xs text-muted-foreground">Platform fee: <strong className="text-primary">${b.platform_fee}</strong></div>
                <div className="text-xs text-muted-foreground">Operator payout: ${b.operator_payout}</div>
                <div className="flex gap-1.5 mt-2 justify-end flex-wrap">
                  {b.status === "pending" && (
                    <form action={markBookingCompletedAction.bind(null, b.id)}>
                      <button type="submit" className="flex items-center gap-1 text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-2.5 py-1.5 rounded-lg font-medium transition-colors">
                        <CheckCircle className="w-3 h-3" /> Complete
                      </button>
                    </form>
                  )}
                  {b.status === "pending" && (
                    <form action={markBookingCancelledAction.bind(null, b.id)}>
                      <button type="submit" className="flex items-center gap-1 text-xs border border-red-200 text-red-500 px-2.5 py-1.5 rounded-lg font-medium hover:bg-red-50 transition-colors">
                        <XCircle className="w-3 h-3" /> Cancel
                      </button>
                    </form>
                  )}
                  {b.status === "completed" && !b.operator_invoiced && (
                    <form action={markBookingInvoicedAction.bind(null, b.id)}>
                      <button type="submit" className="flex items-center gap-1 text-xs bg-blue-500 hover:bg-blue-600 text-white px-2.5 py-1.5 rounded-lg font-medium transition-colors">
                        <FileText className="w-3 h-3" /> Mark Invoiced
                      </button>
                    </form>
                  )}
                  {b.operator_invoiced && !b.operator_paid && (
                    <form action={markBookingPaidAction.bind(null, b.id)}>
                      <button type="submit" className="flex items-center gap-1 text-xs bg-purple-500 hover:bg-purple-600 text-white px-2.5 py-1.5 rounded-lg font-medium transition-colors">
                        <DollarSign className="w-3 h-3" /> Mark Paid
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {bookings.length === 0 && (
          <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground">No bookings yet.</div>
        )}
      </div>
    </div>
  );
}
