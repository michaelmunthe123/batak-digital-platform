import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type") as EmailOtpType | null;
  const requestedNext = request.nextUrl.searchParams.get("next") ?? "/account/welcome";
  const safeNext = requestedNext.startsWith("/") && !requestedNext.startsWith("//")
    ? requestedNext
    : "/account/welcome";

  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = safeNext;
  redirectTo.search = "";

  if (tokenHash && type) {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
      if (!error) return NextResponse.redirect(redirectTo);
    }
  }

  redirectTo.pathname = "/account/login";
  redirectTo.searchParams.set("error", "invite-confirmation-failed");
  return NextResponse.redirect(redirectTo);
}
