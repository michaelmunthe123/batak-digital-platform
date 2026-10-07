import Link from "next/link";
import { signIn } from "@/app/admin/login/actions";
import { hasSupabaseEnv } from "@/lib/env";

export default async function AdminLogin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const configured = hasSupabaseEnv();

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Link href="/" className="text-sm underline underline-offset-4">
        ← Kembali ke situs
      </Link>
      <h1 className="mt-8 font-serif text-4xl font-bold">Editorial sign in</h1>
      <p className="mt-3 text-sm leading-6 text-stone-600">
        Hanya akun dengan role admin, editor, atau reviewer pada tabel profiles
        yang dapat mengakses workflow editorial.
      </p>

      {!configured ? (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
          Supabase belum dikonfigurasi. Salin .env.example menjadi .env.local
          lalu isi Project URL dan Publishable Key.
        </div>
      ) : null}

      {error ? (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
          Login gagal atau konfigurasi belum lengkap.
        </div>
      ) : null}

      <form action={signIn} className="mt-7 space-y-5">
        <div>
          <label htmlFor="email" className="text-sm font-semibold">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
          />
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-semibold">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
          />
        </div>
        <button
          disabled={!configured}
          className="w-full rounded-xl bg-stone-950 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Masuk
        </button>
      </form>
    </div>
  );
}
