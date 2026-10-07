"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect("/admin/login?error=supabase-unconfigured");
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/admin/login?error=invalid-credentials");
  }

  redirect("/admin");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/");
}
