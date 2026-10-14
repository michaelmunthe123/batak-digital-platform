# Validasi lanjutan dan deployment pilot

Tanggal: 14 Oktober 2026. Ini adalah laporan deployment pilot, bukan pernyataan bahwa seluruh Phase 1–5 siap produksi.

## Hasil deployment

- Situs publik: https://batak-digital-platform.vercel.app
- Vercel project: `mike13s-projects-59122bde/batak-digital-platform`.
- Deployment awal: `dpl_6965xymtK6x6yXC8JdoMZsBsMA6W`, status `READY`, target `production`.
- Homepage berhasil diakses anonim dengan HTTP 200, tanpa bypass deployment protection.
- Vercel tidak memiliki environment variable production ketika deployment dilakukan. Situs menggunakan data pilot; login, database, kontribusi, Storage, dan AI belum terhubung. Banner menjelaskan keterbatasan tersebut.
- Tarombo demo tetap ditandai fiktif. Tidak ada data keluarga nyata yang dimigrasikan atau dipublikasikan.

## Perubahan yang diterapkan

1. Perbaikan lint: tipe row community, inferensi callback, navigasi internal memakai Link, dan export PostCSS bernama.
2. Tes pencarian kosong mengikuti perilaku directory browsing; dataset kosong tetap menghasilkan hasil kosong.
3. Vitest diperbarui dari 3.2.7 ke 4.1.11 beserta lockfile, menghapus rantai dependency test yang terkena advisori critical/moderate.
4. Baseline Node minimal 22 sesuai dependency Supabase; build Vercel memakai Node 24.
5. Build dan development memakai Webpack. Turbopack gagal pada worker CSS, baik dalam maupun di luar sandbox; Webpack berhasil. Penyebab internal Turbopack belum dipastikan.
6. Server-only guard untuk client admin Supabase dan pemanggil OpenAI. Permintaan OpenAI memiliki timeout 30 detik dan error tidak menyalin body respons vendor.
7. AI hanya aktif jika `AI_ENABLED=true`; contoh konfigurasi default false. Fitur tetap tersedia sebagai halaman, tetapi layanan belum diaktifkan sebelum keamanan/biaya tervalidasi.
8. Role editorial harus tepat admin/editor/reviewer. Layout genealogy dan kinship admin menolak anonim; reviewer tidak mendapat formulir pembuatan draft. Server action tetap melakukan otorisasi sendiri.
9. `.gitignore` melindungi seluruh varian env kecuali `.env.example`, metadata Vercel, hasil build/test, dan cache. `.vercelignore` mengecualikan credential dan file lokal dari upload.
10. CI memakai `npm ci` dan seluruh verifier Phase 1–5. Playwright lokal memakai port 3100 dan credential layanan kosong; URL remote dapat diberikan lewat `PLAYWRIGHT_BASE_URL`.
11. Metadata/sitemap/robots menggunakan domain production Vercel bila site URL belum disetel. README berisi URL yang benar-benar diverifikasi serta status pilot.

## Bukti verifikasi

| Pemeriksaan | Hasil dan batas |
|---|---|
| `verify:all` | Lolos Phase 1–5. Hanya struktur/source; tidak menjalankan SQL. |
| ESLint | Lolos setelah perbaikan. |
| TypeScript | Lolos setelah perbaikan. |
| Unit test Vitest 4.1.11 | 21/21 lolos pada 9 berkas. Sandbox sempat gagal menulis cache; pengulangan dengan izin berhasil. |
| Build lokal Webpack | Berhasil, termasuk TypeScript dan 50 halaman statis. |
| Build Vercel | `npm ci` dan `npm run build` berhasil pada Linux/Node 24. |
| E2E production | 24/24 lolos, 12 skenario masing-masing desktop Chromium dan Pixel 7. |
| E2E lokal final | 24/24 lolos terhadap `next build` + `next start`, tanpa retry. Startup build dan suite selesai dalam sekitar 57 detik. |
| E2E lokal sebelum koreksi selector | 20/22 lolos. Dua kegagalan Phase 3 berasal dari selector ambigu lalu ekspektasi bahasa yang tidak cocok, bukan absennya jalur relasi. Suite production kemudian lolos setelah koreksi. |

Percobaan berikutnya dengan development server sempat 23/24 karena navigasi terputus saat Fast Refresh. Konfigurasi final menggunakan server hasil build produksi untuk menghilangkan gangguan Hot Reload; suite lokal kemudian lolos seluruhnya.
| SEO smoke | Robots dan sitemap HTTP 200, tidak merujuk localhost. |
| AI nonaktif | POST assistant HTTP 503 terkontrol, confidence insufficient, retrieval unavailable, sumber kosong. Tidak ada generasi berbayar. |
| Public smoke | Homepage/explore/adat/sources/profil marga memiliki heading/title; tidak ada browser exception pada skenario tersebut. |
| Visual homepage production | Screenshot desktop dan Pixel 7 diperiksa; tidak ada overflow horizontal maupun error console pada kunjungan tersebut. |
| Pemeriksaan credential | 206 file calon repository dan 78 asset JavaScript client diperiksa dengan pola credential umum; tidak ada kecocokan. Ini bukan audit secret menyeluruh atau bukti bahwa semua jenis secret pasti tidak ada. |
| Akses anonim | Form genealogy dan kinship mengarah ke login; halaman tidak dikenal memberi 404. Belum membuktikan RLS atau sesi pengguna nyata. |
| npm audit runtime | 0 advisori dependency produksi saat diperiksa. |
| npm audit keseluruhan | Tersisa 5 high dalam rantai lint: eslint-config-next → plugin Next → fast-glob → micromatch → braces. Bukan 5 bug aplikasi independen. |

Jangan memakai `npm audit fix --force`: saran downgrade konfigurasi lint ke Next 14 tidak sesuai baseline Next 16. Advisori braces masih mencakup versi 3.0.3 yang tersedia saat diperiksa. Jangan mengekspos tooling development ke publik atau menerima pola glob arbitrer dari pengguna.

## Integrasi yang masih terblokir

### Supabase

CLI dapat membaca daftar proyek, tetapi proyek tertaut `rtnjphtttfhcqnhabvkd` tetap dilaporkan `INACTIVE`. Pemeriksaan `migration list --linked` gagal dengan `Failed to create login role: Connection terminated due to connection timeout`. Setelah pengguna menyatakan proyek dipulihkan, pemeriksaan ulang masih menunjukkan kondisi yang sama.

Tidak ada migrasi, seed, reset, indexing AI, atau perubahan privilege database yang dijalankan. Jangan mengaktifkan database production sebelum temuan P0 dalam audit awal ditangani: privasi view genealogy, bypass workflow publication, suspensi contributor melalui RPC, serta kandidat masalah SQL dataset_id/operator vector. Semua masih temuan source-level yang perlu reproduksi pada database uji.

### GitHub dan Vercel

Login Vercel berhasil melalui persetujuan perangkat. CLI membuat proyek dan melakukan deployment manual. Percobaan `vercel git connect` gagal; pembacaan API proyek setelah pengguna mencoba dashboard masih menghasilkan koneksi Git kosong. Karena itu push main/preview PR belum dapat diklaim memicu deployment otomatis.

CLI link memperbarui `.env.local` dengan token lokal Vercel. Isi secret tidak dibaca atau ditampilkan oleh agent; file tetap diabaikan Git dan upload deployment.

### AI, Auth, Storage

Belum ada pengujian model terhadap akun OpenAI, hybrid retrieval, embedding/indexing, login/logout pengguna nyata, invitation, penyimpanan media, atau matrix RLS. AI harus tetap nonaktif sampai grounding, invalidasi index, rate limit dan batas biaya tervalidasi. Temuan dalam audit awal tetap menjadi pekerjaan terbuka.

## Urutan perbaikan berikutnya

1. Pastikan dashboard Supabase untuk project ref di atas benar-benar selesai Resume/Restore. Jika API tetap INACTIVE, periksa status pemulihan di dashboard/support; jangan reset.
2. Perbaiki kandidat SQL dan celah privilege pada branch terpisah, uji migrasi berurutan pada database disposable serta RLS anon/contributor/suspended/editor/reviewer/admin. Baru susun migration production non-destruktif berdasarkan history nyata.
3. Verifikasi alur login, kontribusi, editorial dan provenance dengan data uji. Jangan menyamarkan error database sebagai data pilot ketika layanan nyata diaktifkan.
4. Hubungkan aplikasi GitHub Vercel ke repository yang tepat pada project yang sama. Verifikasi satu commit main membuat deployment Ready dan satu PR membuat preview sebelum menyebut CD aktif.
5. Simpan credential production di dashboard Vercel, set site URL/Auth callback, redeploy, lalu ulangi QA integrasi. Jangan menempelkan secret di chat atau memasukkannya ke repository.
6. Tangani grounding/citation/index invalidation/abuse AI dan batas biaya, kemudian validasi model serta index published knowledge sebelum mengaktifkan AI.

Untuk menjalankan pilot lokal: `npm ci`, `npm run dev`; biarkan credential Supabase kosong. Untuk build lokal: `npm run build` lalu `npm start`. Untuk browser test: `npx playwright install chromium` lalu `npm run test:e2e`.
