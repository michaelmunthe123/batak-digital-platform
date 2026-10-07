import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnv, hasSupabaseEnv } from "@/lib/env";

export async function createSupabaseServerClient() {
  if (!hasSupabaseEnv()) return null;

  const { url, publishableKey } = getSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Components cannot always write cookies.
          // The root proxy refreshes auth sessions when needed.
        }
      },
    },
  });
}
