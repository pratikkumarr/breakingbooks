import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/utils/supabase/server";

// This client uses the Service Role key to bypass Row Level Security.
// It should ONLY be used in server-side admin routes and server actions.
export async function createAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceKey) {
    console.warn("⚠️ SUPABASE_SERVICE_ROLE_KEY is missing. Falling back to scoped client. RLS will hide other users' profiles.");
    return createServerClient();
  }

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
