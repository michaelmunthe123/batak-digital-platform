"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCommunityState } from "@/lib/auth/community";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function normalizeSlug(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

export async function activateContributorAccount(formData: FormData) {
  const state = await getCommunityState();
  if (state.state !== "invited" && state.state !== "active") {
    throw new Error("Contributor invitation required.");
  }
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase belum dikonfigurasi.");

  const displayName = String(formData.get("display_name") ?? "").trim();
  const slug = normalizeSlug(String(formData.get("slug") ?? ""));
  const password = String(formData.get("password") ?? "");
  if (displayName.length < 2 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error("Nama atau slug profil tidak valid.");
  }
  if (state.state === "invited" && password.length < 8) {
    throw new Error("Password minimal 8 karakter.");
  }

  if (password) {
    const { error: passwordError } = await supabase.auth.updateUser({ password });
    if (passwordError) throw new Error(passwordError.message);
  }

  const { error } = await supabase.rpc("activate_contributor_account", {
    profile_slug: slug,
    profile_display_name: displayName,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/account");
  redirect("/account?activated=1");
}

export async function updateContributorProfile(formData: FormData) {
  const state = await getCommunityState();
  if (state.state !== "active") throw new Error("Active contributor account required.");
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase belum dikonfigurasi.");

  const displayName = String(formData.get("display_name") ?? "").trim();
  const slug = normalizeSlug(String(formData.get("slug") ?? ""));
  const bio = String(formData.get("bio") ?? "").trim();
  const interests = String(formData.get("interests") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 12);
  const isPublic = formData.get("is_public") === "on";

  if (displayName.length < 2 || bio.length > 1000 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error("Profile form tidak valid.");
  }

  const { error } = await supabase
    .from("contributor_profiles")
    .update({ display_name: displayName, slug, bio, interests, is_public: isPublic })
    .eq("user_id", state.userId);
  if (error) throw new Error(error.message);

  revalidatePath("/account");
  revalidatePath("/account/profile");
  revalidatePath(`/contributors/${slug}`);
  redirect("/account/profile?saved=1");
}

export async function markNotificationRead(formData: FormData) {
  const state = await getCommunityState();
  if (state.state !== "active") throw new Error("Authentication required.");
  const id = String(formData.get("id") ?? "");
  const supabase = await createSupabaseServerClient();
  if (!supabase || !id) return;
  const { error } = await supabase
    .from("community_notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", state.userId);
  if (error) throw new Error(error.message);
  revalidatePath("/account/notifications");
}
