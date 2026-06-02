import { createServerClient } from "@supabase/ssr";
import { type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "./types";

export type TypedClient = SupabaseClient<Database>;

async function makeClient(key: string): Promise<TypedClient> {
  const store = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key,
    {
      cookies: {
        getAll() { return store.getAll(); },
        setAll(list) {
          try { list.forEach(({ name, value, options }) => store.set(name, value, options)); }
          catch {}
        },
      },
    }
  );
}

export function createClient(): Promise<TypedClient> {
  return makeClient(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
}

export function createAdminClient(): Promise<TypedClient> {
  return makeClient(process.env.SUPABASE_SERVICE_ROLE_KEY!);
}
