export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

/**
 * supabase-js v2.x derives its query types from a `GenericSchema`, which
 * requires every table to expose a `Relationships` array and the schema to
 * carry `Views`/`Functions` records. Hand-written table definitions omit the
 * boilerplate, so `WithRelationships<T>` injects an empty `Relationships: []`
 * into each table. Without it the client resolves every row to `never` —
 * which is exactly what forced the old `as any` casts.
 */
type WithRelationships<T> = {
  [K in keyof T]: T[K] & { Relationships: [] };
};

export interface Database {
  public: {
    Tables: WithRelationships<{
      // ── Core ──────────────────────────────────────────────────────────────
      blog_posts: {
        Row: {
          id: string; title: string; slug: string; excerpt: string; content: string;
          category: string; image: string | null; published_at: string | null;
          read_time: number; author: string; published: boolean;
          created_at: string; updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["blog_posts"]["Row"], "id"|"created_at"|"updated_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["blog_posts"]["Insert"]>;
      };
      newsletter_subscribers: {
        Row: { id: string; email: string; locale: string; created_at: string };
        Insert: Omit<Database["public"]["Tables"]["newsletter_subscribers"]["Row"], "id"|"created_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["newsletter_subscribers"]["Insert"]>;
      };
      saved_trips: {
        Row: { id: string; user_id: string; title: string; data: Json; created_at: string };
        Insert: Omit<Database["public"]["Tables"]["saved_trips"]["Row"], "id"|"created_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["saved_trips"]["Insert"]>;
      };
      // ── Experiences marketplace ────────────────────────────────────────────
      operators: {
        Row: {
          id: string; business_name: string; slug: string; bio: string | null;
          city: string; phone: string | null; whatsapp: string | null;
          languages: string[]; avatar_url: string | null; cover_url: string | null;
          years_experience: number | null; license_number: string | null;
          license_image_url: string | null; verified: boolean;
          verification_status: "pending" | "verified" | "rejected";
          founded_year: number | null; service_regions: string[];
          response_time: string | null; booking_success_rate: number | null;
          stripe_account_id: string | null; commission_rate: number;
          avg_rating: number | null; review_count: number; ranking_score: number;
          created_at: string; updated_at: string;
        };
        // Columns with DB defaults / nullable columns are optional on insert.
        Insert: Pick<OperatorRow, "id" | "business_name" | "slug" | "city">
          & Partial<Omit<OperatorRow, "id" | "business_name" | "slug" | "city" | "created_at" | "updated_at">>;
        Update: Partial<Omit<OperatorRow, "created_at">>;
      };
      experiences: {
        Row: {
          id: string; operator_id: string; title: string; slug: string;
          category: "surf"|"desert"|"culture"|"food"|"wellness"|"adventure"|"water"|"photography"|"transport"|"day-trip"|"other";
          subcategory: string | null; description: string;
          highlights: string[]; includes: string[]; excludes: string[]; what_to_bring: string[];
          city: string; meeting_point: string | null;
          duration_hours: number; max_group_size: number; min_age: number;
          price_per_person: number; price_group: number | null; currency: string;
          languages: string[]; images: string[]; cancellation: string;
          available_days: string[]; featured: boolean; published: boolean; approved: boolean;
          total_bookings: number; avg_rating: number | null; review_count: number;
          created_at: string; updated_at: string;
        };
        Insert: Pick<
          ExperienceRow,
          "operator_id" | "title" | "slug" | "category" | "description"
          | "city" | "duration_hours" | "max_group_size" | "price_per_person"
        > & Partial<Omit<ExperienceRow, "id" | "created_at" | "updated_at">> & { id?: string };
        Update: Partial<Omit<ExperienceRow, "id" | "created_at">>;
      };
      bookings: {
        Row: {
          id: string; experience_id: string; operator_id: string; traveler_id: string | null;
          traveler_name: string; traveler_email: string; traveler_phone: string | null;
          traveler_country: string | null; requested_date: string; group_size: number;
          special_requests: string | null; price_per_person: number; total_price: number;
          platform_fee: number; operator_payout: number; currency: string;
          status: "pending"|"confirmed"|"completed"|"cancelled"|"refunded";
          confirmed_at: string | null; completed_at: string | null;
          cancelled_at: string | null; cancellation_reason: string | null;
          payment_status: "unpaid"|"paid"|"refunded"; stripe_payment_id: string | null;
          operator_invoiced: boolean; operator_paid: boolean; notes: string | null;
          created_at: string;
        };
        // Status/payout/timestamp columns default server-side.
        Insert: Pick<
          BookingRow,
          "experience_id" | "operator_id" | "traveler_name" | "traveler_email"
          | "requested_date" | "group_size" | "price_per_person" | "total_price"
          | "platform_fee" | "operator_payout" | "currency"
        > & Partial<Omit<BookingRow, "created_at">>;
        Update: Partial<Database["public"]["Tables"]["bookings"]["Insert"]>;
      };
      experience_reviews: {
        Row: {
          id: string; experience_id: string; booking_id: string | null;
          user_id: string | null; display_name: string; rating: number;
          title: string | null; body: string; approved: boolean; created_at: string;
        };
        Insert: Pick<ExperienceReviewRow, "experience_id" | "display_name" | "rating" | "body">
          & Partial<Omit<ExperienceReviewRow, "experience_id" | "display_name" | "rating" | "body" | "created_at">>;
        Update: Partial<Database["public"]["Tables"]["experience_reviews"]["Insert"]>;
      };
      // ── Messaging ──────────────────────────────────────────────────────────
      messages: {
        Row: {
          id: string; booking_id: string; sender_id: string; sender_name: string;
          sender_role: "traveler"|"operator"; body: string; read: boolean; created_at: string;
        };
        Insert: Pick<MessageRow, "booking_id" | "sender_id" | "sender_name" | "sender_role" | "body">
          & Partial<Omit<MessageRow, "booking_id" | "sender_id" | "sender_name" | "sender_role" | "body" | "created_at">>;
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
      };
      // ── Features 2 ─────────────────────────────────────────────────────────
      announcements: {
        Row: {
          id: string; message: string; type: "info"|"warning"|"success"|"promo";
          link_url: string | null; link_label: string | null;
          active: boolean; created_at: string; expires_at: string | null;
        };
        Insert: Pick<AnnouncementRow, "message" | "type">
          & Partial<Omit<AnnouncementRow, "message" | "type" | "created_at">>;
        Update: Partial<Database["public"]["Tables"]["announcements"]["Insert"]>;
      };
      suggestions: {
        Row: {
          id: string; sender_name: string | null; sender_email: string | null;
          type: "feature"|"bug"|"content"|"operator"|"other";
          message: string; status: "new"|"reviewed"|"planned"|"done"|"declined";
          admin_note: string | null; created_at: string;
        };
        Insert: Pick<SuggestionRow, "type" | "message">
          & Partial<Omit<SuggestionRow, "type" | "message" | "created_at">>;
        Update: Partial<Database["public"]["Tables"]["suggestions"]["Insert"]>;
      };
      operator_areas: {
        Row: {
          id: string; operator_id: string; city: string; area_name: string;
          description: string; best_for: string[]; best_months: string[];
          tips: string[]; images: string[]; published: boolean; created_at: string;
        };
        Insert: Pick<OperatorAreaRow, "operator_id" | "city" | "area_name" | "description">
          & Partial<Omit<OperatorAreaRow, "operator_id" | "city" | "area_name" | "description" | "created_at">>;
        Update: Partial<Database["public"]["Tables"]["operator_areas"]["Insert"]>;
      };
      // ── User features ──────────────────────────────────────────────────────
      user_profiles: {
        Row: {
          id: string; display_name: string | null; bio: string | null;
          avatar_url: string | null;
          role: "traveler"|"blogger"|"lister"|"admin";
          website: string | null; social_instagram: string | null;
          social_twitter: string | null; verified: boolean;
          created_at: string; updated_at: string;
        };
        Insert: Pick<UserProfileRow, "id">
          & Partial<Omit<UserProfileRow, "id" | "created_at" | "updated_at">>;
        Update: Partial<Database["public"]["Tables"]["user_profiles"]["Insert"]>;
      };
      // ── Marketplace commission tracking (architecture only — no payments) ────
      commissions: {
        Row: {
          id: string; booking_id: string; operator_id: string;
          booking_value: number; commission_amount: number; rate: number;
          status: "pending" | "invoiced" | "paid" | "waived"; created_at: string;
        };
        Insert: Pick<CommissionRow, "booking_id" | "operator_id" | "booking_value" | "commission_amount" | "rate">
          & Partial<Omit<CommissionRow, "booking_id" | "operator_id" | "booking_value" | "commission_amount" | "rate" | "created_at">>;
        Update: Partial<Database["public"]["Tables"]["commissions"]["Insert"]>;
      };
      operator_payouts: {
        Row: {
          id: string; operator_id: string; period: string;
          total_earnings: number; total_commission: number;
          status: "pending" | "invoiced" | "paid"; created_at: string;
        };
        Insert: Pick<OperatorPayoutRow, "operator_id" | "period">
          & Partial<Omit<OperatorPayoutRow, "operator_id" | "period" | "created_at">>;
        Update: Partial<Database["public"]["Tables"]["operator_payouts"]["Insert"]>;
      };
    }>;
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
}

// ── Convenience aliases ────────────────────────────────────────────────────────
export type BlogPostRow           = Database["public"]["Tables"]["blog_posts"]["Row"];
export type SavedTripRow          = Database["public"]["Tables"]["saved_trips"]["Row"];
export type OperatorRow           = Database["public"]["Tables"]["operators"]["Row"];
export type CommissionRow         = Database["public"]["Tables"]["commissions"]["Row"];
export type OperatorPayoutRow     = Database["public"]["Tables"]["operator_payouts"]["Row"];
export type ExperienceRow         = Database["public"]["Tables"]["experiences"]["Row"];
export type BookingRow            = Database["public"]["Tables"]["bookings"]["Row"];
export type ExperienceReviewRow   = Database["public"]["Tables"]["experience_reviews"]["Row"];
export type MessageRow            = Database["public"]["Tables"]["messages"]["Row"];
export type AnnouncementRow       = Database["public"]["Tables"]["announcements"]["Row"];
export type SuggestionRow         = Database["public"]["Tables"]["suggestions"]["Row"];
export type OperatorAreaRow       = Database["public"]["Tables"]["operator_areas"]["Row"];
export type UserProfileRow        = Database["public"]["Tables"]["user_profiles"]["Row"];
