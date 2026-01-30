import { createServerClient } from "@supabase/ssr"; // SSR環境向けヘルパー
import type { SupabaseClient } from "@supabase/supabase-js"; // SupabaseのコアSDK
import { cookies } from "next/headers";
import { Database } from "@/types/database";

// asyncなのでPromise型
export async function createClient(): Promise<SupabaseClient<Database>> {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component からの呼び出し時は無視
          }
        },
      },
    }
  );
}
