"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function signInContributor(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/account/login?error=supabase-unconfigured");

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect("/account/login?error=invalid-credentials");
  redirect("/account");
}

export async function signOutContributor() {
  const supabase = await createSupabaseServerClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/");
}
