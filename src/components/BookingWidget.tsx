"use client";

import { useState } from "react";
import { Calendar, Users, MessageCircle, Phone, CheckCircle, Loader2, Shield, AlertTriangle } from "lucide-react";
import { PLATFORM_COMMISSION } from "@/lib/experiences-data";

interface BookingWidgetProps {
  experience: {
    id: string;
    title: string;
    price_per_person: number;
    price_group?: number;
    currency: string;
    max_group_size: number;
    min_age: number;
    duration_hours: number;
    cancellation: string;
    available_days: string[];
  };
  operator: {
    business_name: string;
    phone?: string;
    whatsapp?: string;
  } | null;
  locale: string;
}

export default function BookingWidget({ experience, operator, locale }: BookingWidgetProps) {
  const [date, setDate] = useState("");
  const [groupSize, setGroupSize] = useState(1);
  const [step, setStep] = useState<"select" | "details" | "done">("select");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", country: "", notes: "" });

  const total = experience.price_per_person * groupSize;
  const today = new Date().toISOString().split("T")[0];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experience_id:    experience.id,
          requested_date:   date,
          group_size:       groupSize,
          traveler_name:    form.name,
          traveler_email:   form.email,
          traveler_phone:   form.phone || null,
          traveler_country: form.country || null,
          special_requests: form.notes || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit booking. Please try again.");
      }

      setStep("done");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Booking failed. Please try again or contact us directly.");
    }

    setLoading(false);
  }

  if (step === "done") {
    return (
      <div className="sticky top-24 bg-card border border-border rounded-2xl shadow-lg p-6 text-center">
        <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
        <h3 className="text-xl font-black text-foreground mb-2">Booking Request Sent!</h3>
        <p className="text-muted-foreground text-sm mb-4">
          <strong>{operator?.business_name}</strong> will confirm your booking within 24 hours via
          email. No payment is collected until your booking is confirmed.
        </p>
        {operator?.whatsapp && (
          <a
            href={`https://wa.me/${operator.whatsapp.replace(/\D/g, "")}?text=Hi! I just submitted a booking request for ${encodeURIComponent(experience.title)} on Imourig.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 rounded-xl transition-colors text-sm"
          >
            <MessageCircle className="w-4 h-4" /> Follow up on WhatsApp
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="sticky top-24 bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
      {/* Price header */}
      <div className="bg-primary text-primary-foreground p-5">
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-3xl font-black">${experience.price_per_person}</span>
          <span className="text-primary-foreground/70">/ person</span>
        </div>
        {experience.price_group && (
          <p className="text-primary-foreground/70 text-xs">Private group from ${experience.price_group}</p>
        )}
        {experience.duration_hours && (
          <p className="text-primary-foreground/60 text-xs mt-1">
            {experience.duration_hours} hours &middot; Max {experience.max_group_size} people
          </p>
        )}
      </div>

      <div className="p-5">
        {step === "select" && (
          <>
            <div className="space-y-3 mb-4">
              <div>
                <label className="flex items-center gap-1 text-xs font-medium text-foreground/70 mb-1">
                  <Calendar className="w-3.5 h-3.5" /> Select Date *
                </label>
                <input
                  type="date"
                  value={date}
                  min={today}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border border-input rounded-xl px-3 min-h-[2.75rem] text-sm outline-none focus:border-primary bg-background"
                />
              </div>
              <div>
                <label className="flex items-center gap-1 text-xs font-medium text-foreground/70 mb-1">
                  <Users className="w-3.5 h-3.5" /> Number of People
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setGroupSize(Math.max(1, groupSize - 1))}
                    className="h-11 w-11 rounded-lg border border-input flex items-center justify-center font-bold text-foreground hover:bg-muted transition-colors"
                  >
                    &minus;
                  </button>
                  <span className="flex-1 text-center font-bold text-foreground text-lg">{groupSize}</span>
                  <button
                    type="button"
                    onClick={() => setGroupSize(Math.min(experience.max_group_size, groupSize + 1))}
                    className="h-11 w-11 rounded-lg border border-input flex items-center justify-center font-bold text-foreground hover:bg-muted transition-colors"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-1">Max {experience.max_group_size} people</p>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="bg-muted rounded-xl p-4 mb-4 space-y-2 text-sm">
              <div className="flex justify-between text-foreground/80">
                <span>${experience.price_per_person} &times; {groupSize} person{groupSize !== 1 ? "s" : ""}</span>
                <span>${total}</span>
              </div>
              <div className="flex justify-between font-black text-foreground border-t border-border pt-2">
                <span>Total</span>
                <span>${total}</span>
              </div>
              <p className="text-xs text-muted-foreground">No payment collected now &mdash; operator confirms first</p>
            </div>

            <button
              onClick={() => {
                if (!date) {
                  setError("Please select a date.");
                  return;
                }
                setError(null);
                setStep("details");
              }}
              className="w-full bg-accent hover:brightness-105 text-accent-foreground font-bold min-h-[3rem] rounded-xl transition-colors"
            >
              Request to Book
            </button>

            {error && (
              <div className="mt-3 flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-xl">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            {/* Direct contact */}
            {(operator?.whatsapp || operator?.phone) && (
              <div className="mt-4 pt-4 border-t border-border text-center">
                <p className="text-xs text-muted-foreground mb-2">Or contact directly:</p>
                <div className="flex gap-2">
                  {operator.whatsapp && (
                    <a
                      href={`https://wa.me/${operator.whatsapp.replace(/\D/g, "")}?text=Hi! I'm interested in: ${encodeURIComponent(experience.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold py-2 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                  )}
                  {operator.phone && (
                    <a
                      href={`tel:${operator.phone}`}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-muted border border-border text-foreground text-xs font-semibold py-2 rounded-lg hover:bg-muted/70 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call
                    </a>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {step === "details" && (
          <form onSubmit={handleSubmit} className="space-y-3">
            <h3 className="font-black text-foreground mb-3">Your Details</h3>
            <div>
              <label className="block text-xs font-medium text-foreground/70 mb-1">Full Name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full border border-input rounded-xl px-3 min-h-[2.75rem] text-sm outline-none focus:border-primary bg-background"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground/70 mb-1">Email *</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full border border-input rounded-xl px-3 min-h-[2.75rem] text-sm outline-none focus:border-primary bg-background"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-foreground/70 mb-1">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+1..."
                  className="w-full border border-input rounded-xl px-3 py-2 text-sm outline-none focus:border-primary bg-background"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground/70 mb-1">Country</label>
                <input
                  value={form.country}
                  onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                  placeholder="USA, UK..."
                  className="w-full border border-input rounded-xl px-3 py-2 text-sm outline-none focus:border-primary bg-background"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground/70 mb-1">
                Special requests / questions
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                rows={2}
                className="w-full border border-input rounded-xl px-3 py-2 text-sm outline-none focus:border-primary resize-none bg-background"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-xl">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-2 text-xs text-blue-700">
              <Shield className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              No payment now. The operator confirms availability first. You&apos;ll receive a
              confirmation email within 24 hours.
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setError(null); setStep("select"); }}
                className="flex-1 border border-input text-foreground/70 min-h-[2.75rem] rounded-xl text-sm font-medium hover:bg-muted transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-accent hover:brightness-105 disabled:opacity-60 text-accent-foreground font-bold min-h-[2.75rem] rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Sending..." : "Confirm Request"}
              </button>
            </div>
          </form>
        )}

        {/* Trust badges */}
        <div className="mt-4 pt-4 border-t border-border space-y-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Free cancellation up to 24h before
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-blue-500" /> Secure booking &mdash; no payment until confirmed
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Verified local operator
          </div>
        </div>
      </div>
    </div>
  );
}
