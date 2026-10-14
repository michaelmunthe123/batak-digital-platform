import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/env";

export type EditorialState =
  | { state: "unconfigured" }
  | { state: "anonymous" }
  | { state: "forbidden"; email?: string }
  | {
      state: "authorized";
      userId: string;
      email?: string;
      role: "admin" | "editor" | "reviewer";
    };

export async function getEditorialState(): Promise<EditorialState> {
  if (!hasSupabaseEnv()) return { state: "unconfigured" };

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { state: "unconfigured" };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { state: "anonymous" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = profile?.role;
  if (role !== "admin" && role !== "editor" && role !== "reviewer") {
    return { state: "forbidden", email: user.email };
  }

  return {
    state: "authorized",
    userId: user.id,
    email: user.email,
    role,
  };
}
