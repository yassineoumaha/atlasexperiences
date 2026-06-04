import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";
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

/**
 * Service-role client that TRULY bypasses RLS.
 *
 * It must NOT go through createServerClient/cookies: when a logged-in admin
 * makes the request, the SSR client attaches their auth cookie and Supabase
 * authorizes as that *user* (under RLS) instead of as service_role. That made
 * admin reads hide pending rows and admin deletes get silently denied. A bare
 * supabase-js client with no session and persistSession off always sends the
 * service-role key as the Authorization bearer, so RLS is bypassed as intended.
 */
export function createAdminClient(): Promise<TypedClient> {
  const client = createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
  return Promise.resolve(client);
}
