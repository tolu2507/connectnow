// lib/supabase/server-client.ts
import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createServerClient() {
  const cookieStore = await cookies(); // Await cookies() to get the async cookie store
  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          return await cookieStore.getAll(); // Await getAll()
        },
        async setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            await cookieStore.set(name, value, options); // Await set() for each cookie
          }
        },
      },
    }
  );
}
