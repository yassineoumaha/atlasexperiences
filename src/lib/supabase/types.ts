export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      // ── Core ──────────────────────────────────────────────────────────────
      destinations: {
        Row: {
          id: string; name: string; slug: string; description: string;
          hero_image: string | null; weather: string; avg_stay: number;
          region: string; filters: string[]; featured: boolean;
          lat: number; lng: number; created_at: string; updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["destinations"]["Row"], "id"|"created_at"|"updated_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["destinations"]["Insert"]>;
      };
      properties: {
        Row: {
          id: string; destination_slug: string; name: string; type: string;
          rating: number; review_count: number; price_from: number; currency: string;
          image: string | null; amenities: string[]; booking_url: string;
          agoda_url: string | null; tripadvisor_url: string | null; description: string;
          featured: boolean; created_at: string; updated_at: string;
          submitted_by: string | null; approved: boolean;
        };
        Insert: Omit<Database["public"]["Tables"]["properties"]["Row"], "id"|"created_at"|"updated_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["properties"]["Insert"]>;
      };
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
      property_submissions: {
        Row: {
          id: string; property_name: string; city: string; property_type: string;
          booking_url: string; contact_email: string; contact_name: string;
          description: string | null; status: "pending"|"approved"|"rejected"; created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["property_submissions"]["Row"], "id"|"created_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["property_submissions"]["Insert"]>;
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
          stripe_account_id: string | null; commission_rate: number;
          avg_rating: number | null; review_count: number; ranking_score: number;
          created_at: string; updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["operators"]["Row"], "created_at"|"updated_at">;
        Update: Partial<Database["public"]["Tables"]["operators"]["Insert"]>;
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
        Insert: Omit<Database["public"]["Tables"]["experiences"]["Row"], "id"|"created_at"|"updated_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["experiences"]["Insert"]>;
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
        Insert: Omit<Database["public"]["Tables"]["bookings"]["Row"], "id"|"created_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["bookings"]["Insert"]>;
      };
      experience_reviews: {
        Row: {
          id: string; experience_id: string; booking_id: string | null;
          user_id: string | null; display_name: string; rating: number;
          title: string | null; body: string; approved: boolean; created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["experience_reviews"]["Row"], "id"|"created_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["experience_reviews"]["Insert"]>;
      };
      // ── Messaging ──────────────────────────────────────────────────────────
      messages: {
        Row: {
          id: string; booking_id: string; sender_id: string; sender_name: string;
          sender_role: "traveler"|"operator"; body: string; read: boolean; created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["messages"]["Row"], "id"|"created_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
      };
      // ── Features 2 ─────────────────────────────────────────────────────────
      announcements: {
        Row: {
          id: string; message: string; type: "info"|"warning"|"success"|"promo";
          link_url: string | null; link_label: string | null;
          active: boolean; created_at: string; expires_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["announcements"]["Row"], "id"|"created_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["announcements"]["Insert"]>;
      };
      suggestions: {
        Row: {
          id: string; sender_name: string | null; sender_email: string | null;
          type: "feature"|"bug"|"content"|"operator"|"other";
          message: string; status: "new"|"reviewed"|"planned"|"done"|"declined";
          admin_note: string | null; created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["suggestions"]["Row"], "id"|"created_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["suggestions"]["Insert"]>;
      };
      operator_areas: {
        Row: {
          id: string; operator_id: string; city: string; area_name: string;
          description: string; best_for: string[]; best_months: string[];
          tips: string[]; images: string[]; published: boolean; created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["operator_areas"]["Row"], "id"|"created_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["operator_areas"]["Insert"]>;
      };
      // ── Taxi ───────────────────────────────────────────────────────────────
      taxi_drivers: {
        Row: {
          id: string; driver_name: string; phone: string; whatsapp: string | null;
          city: string; languages: string[];
          vehicle_type: "petit-taxi"|"grand-taxi"|"minibus"|"4x4"|"vip";
          seats: number; verified: boolean; photo_url: string | null;
          description: string | null; active: boolean;
          verification_status: "pending"|"under_review"|"approved"|"rejected";
          licence_number: string | null; licence_image_url: string | null;
          rejection_reason: string | null; reviewed_by: string | null;
          reviewed_at: string | null; created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["taxi_drivers"]["Row"], "id"|"created_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["taxi_drivers"]["Insert"]>;
      };
      taxi_routes: {
        Row: {
          id: string; driver_id: string; from_city: string; to_city: string;
          price_mad: number; price_usd: number | null; duration_mins: number | null;
          transport_mode: "private"|"shared"|"both"; notes: string | null; created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["taxi_routes"]["Row"], "id"|"created_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["taxi_routes"]["Insert"]>;
      };
      taxi_reports: {
        Row: {
          id: string; driver_id: string | null; reported_driver_name: string | null;
          reported_phone: string | null; incident_city: string; incident_date: string;
          incident_type: "overcharging"|"scam"|"route_deviation"|"harassment"|"unsafe_driving"|"no_show"|"wrong_info"|"other";
          description: string; reporter_name: string; reporter_contact: string;
          wants_follow_up: boolean;
          status: "open"|"under_review"|"resolved"|"dismissed";
          admin_notes: string | null; resolved_at: string | null; created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["taxi_reports"]["Row"], "id"|"created_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["taxi_reports"]["Insert"]>;
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
        Insert: Omit<Database["public"]["Tables"]["user_profiles"]["Row"], "created_at"|"updated_at">;
        Update: Partial<Database["public"]["Tables"]["user_profiles"]["Insert"]>;
      };
      destination_photos: {
        Row: {
          id: string; destination_slug: string; storage_path: string; url: string;
          caption: string | null; display_order: number; uploaded_by: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["destination_photos"]["Row"], "id"|"created_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["destination_photos"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_driver_open_report_count: {
        Args: { driver_uuid: string };
        Returns: number;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

// ── Convenience aliases ────────────────────────────────────────────────────────
export type DestinationRow        = Database["public"]["Tables"]["destinations"]["Row"];
export type PropertyRow           = Database["public"]["Tables"]["properties"]["Row"];
export type BlogPostRow           = Database["public"]["Tables"]["blog_posts"]["Row"];
export type PropertySubmissionRow = Database["public"]["Tables"]["property_submissions"]["Row"];
export type SavedTripRow          = Database["public"]["Tables"]["saved_trips"]["Row"];
export type OperatorRow           = Database["public"]["Tables"]["operators"]["Row"];
export type ExperienceRow         = Database["public"]["Tables"]["experiences"]["Row"];
export type BookingRow            = Database["public"]["Tables"]["bookings"]["Row"];
export type ExperienceReviewRow   = Database["public"]["Tables"]["experience_reviews"]["Row"];
export type MessageRow            = Database["public"]["Tables"]["messages"]["Row"];
export type AnnouncementRow       = Database["public"]["Tables"]["announcements"]["Row"];
export type SuggestionRow         = Database["public"]["Tables"]["suggestions"]["Row"];
export type OperatorAreaRow       = Database["public"]["Tables"]["operator_areas"]["Row"];
export type TaxiDriverRow         = Database["public"]["Tables"]["taxi_drivers"]["Row"];
export type TaxiRouteRow          = Database["public"]["Tables"]["taxi_routes"]["Row"];
export type TaxiReportRow         = Database["public"]["Tables"]["taxi_reports"]["Row"];
export type UserProfileRow        = Database["public"]["Tables"]["user_profiles"]["Row"];
export type DestinationPhotoRow   = Database["public"]["Tables"]["destination_photos"]["Row"];
