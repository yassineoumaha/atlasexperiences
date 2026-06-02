import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { PLATFORM_COMMISSION } from "@/lib/experiences-data";

const BookingSchema = z.object({
  experience_id: z.string().uuid(),
  requested_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  group_size: z.number().int().min(1).max(50),
  traveler_name: z.string().min(2).max(120).trim(),
  traveler_email: z.string().email().trim().toLowerCase(),
  traveler_phone: z.string().max(30).trim().optional().nullable(),
  traveler_country: z.string().max(80).trim().optional().nullable(),
  special_requests: z.string().max(1000).trim().optional().nullable(),
});

export async function POST(request: NextRequest) {
  // Parse body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Validate input
  const parsed = BookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid booking data", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const input = parsed.data;

  // Validate date is in the future
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const bookingDate = new Date(input.requested_date);
  if (bookingDate < today) {
    return NextResponse.json({ error: "Booking date must be in the future" }, { status: 422 });
  }

  // Fetch experience from DB — prices must come from DB, never from client
  const supabase = await createClient();
  const { data: experience, error: expError } = await supabase
    .from("experiences")
    .select("id, title, price_per_person, currency, max_group_size, operator_id, published, approved")
    .eq("id", input.experience_id)
    .single();

  if (expError || !experience) {
    return NextResponse.json({ error: "Experience not found" }, { status: 404 });
  }

  if (!experience.published || !experience.approved) {
    return NextResponse.json({ error: "Experience is not available for booking" }, { status: 400 });
  }

  if (input.group_size > experience.max_group_size) {
    return NextResponse.json(
      { error: `Maximum group size is ${experience.max_group_size}` },
      { status: 422 }
    );
  }

  // Calculate pricing server-side — client cannot manipulate these
  const total_price = experience.price_per_person * input.group_size;
  const platform_fee = Math.round(total_price * PLATFORM_COMMISSION);
  const operator_payout = total_price - platform_fee;

  // Get optional authenticated user
  const { data: { user } } = await supabase.auth.getUser();

  // Insert booking with admin client (bypasses RLS for insert)
  const admin = await createAdminClient();
  const { data: booking, error: insertError } = await admin
    .from("bookings")
    .insert({
      experience_id:    input.experience_id,
      operator_id:      experience.operator_id,
      traveler_id:      user?.id ?? null,
      traveler_name:    input.traveler_name,
      traveler_email:   input.traveler_email,
      traveler_phone:   input.traveler_phone ?? null,
      traveler_country: input.traveler_country ?? null,
      requested_date:   input.requested_date,
      group_size:       input.group_size,
      special_requests: input.special_requests ?? null,
      price_per_person: experience.price_per_person,
      total_price,
      platform_fee,
      operator_payout,
      currency:         experience.currency,
      status:           "pending",
      payment_status:   "unpaid",
    })
    .select("id")
    .single();

  if (insertError || !booking) {
    console.error("[booking API] insert error", insertError);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }

  return NextResponse.json({ booking_id: booking.id }, { status: 201 });
}
