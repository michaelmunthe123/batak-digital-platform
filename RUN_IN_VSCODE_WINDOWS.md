# Menjalankan Batak Digital di Laptop Windows + VS Code

Panduan ini ditulis untuk Windows, VS Code, dan PowerShell. Ada dua target:

1. **Preview cepat** — website publik berjalan tanpa Supabase/OpenAI.
2. **Full Phase 5** — Supabase + community/editorial + AI assistant + semantic search.

Untuk pertama kali, jalankan Preview Cepat lebih dulu. Setelah itu lanjut ke Full Phase 5.

---

## 1. Install kebutuhan dasar

Pastikan sudah ada:

- VS Code
- Node.js >= 20.9 (gunakan versi LTS terbaru jika baru menginstal)
- npm (ikut terpasang bersama Node.js)
- Git opsional tetapi disarankan

Buka **PowerShell** lalu cek:

```powershell
node -v
npm -v
```

Jika `node` tidak dikenali, tutup dan buka ulang VS Code setelah instalasi Node.js.

---

## 2. Extract project dan buka di VS Code

1. Extract ZIP Phase 5.
2. Masuk ke folder hasil extract.
3. Pastikan folder yang dibuka di VS Code adalah folder yang berisi `package.json`.
4. Di VS Code pilih **Terminal → New Terminal**.
5. Pastikan terminal menggunakan PowerShell.

Contoh struktur yang benar:

```text
batak-digital-platform/
├─ app/
├─ components/
├─ docs/
├─ lib/
├─ supabase/
├─ package.json
└─ README.md
```

---

## 3. Install dependency

Di terminal VS Code:

```powershell
npm install
```

Lalu buat environment file:

```powershell
Copy-Item .env.example .env.local
```

Jangan commit `.env.local` ke GitHub.

---

# A. PREVIEW CEPAT — tanpa Supabase dan OpenAI

Dengan `.env.local` masih kosong untuk Supabase/OpenAI:

```powershell
npm run verify:all
npm run dev
```

Buka:

```text
http://localhost:3000
```

Website publik akan memakai pilot/fallback data pada route yang mendukungnya.

AI, login, community workflow, dan database penuh belum aktif pada mode ini.

Hentikan server dengan:

```text
Ctrl + C
```

---

# B. FULL PHASE 5 — REKOMENDASI UNTUK DEVELOPMENT

Cara yang paling sederhana adalah menjalankan Next.js di laptop tetapi memakai **Supabase hosted project** untuk database/Auth.

## 4. Buat project Supabase

1. Masuk ke dashboard Supabase.
2. Buat project baru.
3. Setelah project siap, ambil:
   - Project URL
   - Publishable key
   - Secret key
4. Simpan hanya di `.env.local`.

Contoh:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
SUPABASE_SECRET_KEY=YOUR_SERVER_SECRET_KEY
```

**Penting:** `SUPABASE_SECRET_KEY` adalah server-only. Jangan pernah diberi prefix `NEXT_PUBLIC_`.

---

## 5. Login dan link Supabase CLI

Supabase CLI membutuhkan Node.js 20 atau lebih baru. Jika `npx` menanyakan izin untuk mengunduh paket `supabase`, pilih **Yes**. Alternatif yang lebih reproducible adalah memasangnya sebagai dev dependency terlebih dahulu:

```powershell
npm install supabase --save-dev
```

Dari terminal VS Code:

```powershell
npx supabase login
```

Kemudian link project:

```powershell
npx supabase link --project-ref YOUR_PROJECT_REF
```

`YOUR_PROJECT_REF` adalah bagian awal URL Supabase project-mu.

Contoh:

```text
https://abcdefghijk.supabase.co
        ^^^^^^^^^^^
        project ref
```

---

## 6. Apply seluruh migration Phase 1–5

Jalankan:

```powershell
npx supabase db push
```

Migration akan diterapkan berurutan sampai:

```text
20261007223000_phase5_ai_mature_platform.sql
```

Jika kamu ingin mengisi pilot seed pada project development:

```powershell
npx supabase db push --include-seed
```

Gunakan seed hanya pada project development yang memang boleh diisi pilot data.

---

## 7. Buat akun admin pertama

Di dashboard Supabase:

1. Buka **Authentication → Users**.
2. Buat user untuk dirimu.
3. Copy UUID user tersebut.
4. Buka **SQL Editor**.
5. Jalankan:

```sql
insert into public.profiles (id, display_name, role)
values ('USER_UUID_KAMU', 'Nama Kamu', 'admin')
on conflict (id)
do update set
  display_name = excluded.display_name,
  role = excluded.role;
```

Setelah server berjalan, login di:

```text
http://localhost:3000/admin/login
```

---

# C. KONFIGURASI OPENAI UNTUK PHASE 5

## 8. Buat OpenAI API key

Buat API key dari OpenAI API Platform dan simpan key tersebut hanya di `.env.local`.

**Catatan biaya:** penggunaan OpenAI API ditagihkan terpisah dari langganan ChatGPT. ChatGPT Plus/Pro tidak otomatis memberikan saldo API.

Tambahkan:

```env
AI_ENABLED=true
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
OPENAI_MODEL=gpt-5.6-terra
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
OPENAI_EMBEDDING_DIMENSIONS=512
AI_MAX_CONTEXT_DOCS=8
AI_RATE_LIMIT_PER_10_MIN=20
AI_STORE_PROMPTS=false
AI_SAFETY_HASH_SALT=YOUR_RANDOM_SECRET
```

Untuk membuat salt acak di PowerShell:

```powershell
([guid]::NewGuid().ToString("N") + [guid]::NewGuid().ToString("N"))
```

Copy hasilnya ke `AI_SAFETY_HASH_SALT`.

### Tentang model

`gpt-5.6-terra` adalah default project ini untuk keseimbangan kualitas dan biaya. Jika akun API-mu tidak memiliki akses ke model tersebut, ubah `OPENAI_MODEL` ke model Responses API yang tersedia pada akunmu. Jangan ubah kode ke Assistants API.

`OPENAI_EMBEDDING_DIMENSIONS` harus tetap `512` karena schema PostgreSQL saat ini menggunakan `vector(512)`.

---

## 9. Build AI index

Setelah:

- migration Phase 5 sudah aktif,
- pilot/published cultural data tersedia,
- OpenAI key sudah terisi,

jalankan:

```powershell
npm run ai:index
```

Output yang normal kira-kira:

```text
Source-backed rows available: ...
Embedded/upserted ...
AI indexing complete. changed=..., unchanged=..., archived=...
```

Index hanya mengambil knowledge yang:

- published,
- memiliki sumber published,
- termasuk tipe yang diizinkan Phase 5.

Genealogy nodes/edges tidak dimasukkan ke public AI index.

### Kapan harus menjalankan `ai:index` lagi?

Jalankan ulang setiap kali kamu:

- mempublikasikan claim baru,
- mengubah summary/content bersumber,
- menambah dictionary/timeline/kinship rule,
- mengubah source-backed relationship,
- mengarsipkan konten.

Script memakai content hash sehingga konten yang tidak berubah tidak perlu di-embed ulang.

---

## 10. Jalankan full platform

```powershell
npm run dev
```

Buka:

```text
http://localhost:3000
```

Route penting:

```text
/                    homepage
/assistant           AI Cultural Assistant
/semantic-search     hybrid retrieval tanpa generasi
/learn               personalized learning path
/about/ai            AI transparency
/admin/login         editorial login
/admin                editorial workspace
/admin/ai             AI editorial review
/contribute           community contribution
/tarombo              genealogy visualizer
/partuturan           kinship calculator
```

---

# D. DOUBLE-CHECK PROJECT SEBELUM DEVELOPMENT LANJUT

## 11. Jalankan seluruh verifier

```powershell
npm run verify:all
```

Harus PASS untuk Phase 1, 2, 3, 4, dan 5.

Lanjutkan:

```powershell
npm run lint
npm run typecheck
npm run test
npm run build
```

Kemudian E2E:

```powershell
npx playwright install
npm run test:e2e
```

Jika semuanya berhasil, fondasi source code sudah siap untuk development normal.

---

# E. TROUBLESHOOTING

## `npm` atau `node` tidak dikenali

Restart VS Code. Jika masih gagal, install ulang Node.js dan pastikan Node ditambahkan ke PATH.

## Port 3000 sudah dipakai

```powershell
npm run dev -- -p 3001
```

Lalu buka `http://localhost:3001`.

## Supabase error / tabel tidak ditemukan

Pastikan:

```powershell
npx supabase db push
```

sudah selesai tanpa migration error.

## Assistant mengatakan belum dikonfigurasi

Cek `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SECRET_KEY=
OPENAI_API_KEY=
AI_SAFETY_HASH_SALT=
AI_ENABLED=true
```

Pastikan `AI_SAFETY_HASH_SALT` juga berisi nilai acak yang panjang. Setelah mengubah `.env.local`, restart `npm run dev`.

## Assistant selalu mengatakan evidence tidak cukup

Kemungkinan AI index belum dibuat atau masih kosong:

```powershell
npm run ai:index
```

Pastikan database memiliki konten `published` + source yang `published`.

## Error vector dimension

Pastikan:

```env
OPENAI_EMBEDDING_DIMENSIONS=512
```

Jika pernah mengganti dimensi, kembalikan ke 512 dan jalankan ulang indexing.

## OpenAI model tidak tersedia

Ganti:

```env
OPENAI_MODEL=gpt-5.6-terra
```

ke model Responses API yang tersedia pada API project-mu, lalu restart server.

## API key terlihat di browser

Segera revoke key tersebut. `OPENAI_API_KEY`, `SUPABASE_SECRET_KEY`, dan `AI_SAFETY_HASH_SALT` tidak boleh memakai prefix `NEXT_PUBLIC_`.

---

# F. WORKFLOW HARIAN DI VS CODE

Biasanya cukup:

```powershell
npm run dev
```

Sebelum commit:

```powershell
npm run verify:all
npm run lint
npm run typecheck
npm run test
```

Setelah mengubah database:

```powershell
npx supabase db push
```

Setelah mempublikasikan knowledge baru:

```powershell
npm run ai:index
```

Sebelum release:

```powershell
npm run build
npm run test:e2e
```

---

## Recommended first run order

Ikuti urutan ini agar mudah menemukan error:

```text
1. npm install
2. Copy-Item .env.example .env.local
3. npm run verify:all
4. npm run dev                   ← cek UI public dulu
5. setup Supabase
6. npx supabase db push --include-seed
7. isi Supabase env
8. cek /admin/login
9. setup OpenAI API key
10. npm run ai:index
11. restart npm run dev
12. cek /semantic-search
13. cek /assistant
14. cek /learn
15. cek /admin/ai
16. lint + typecheck + test + build + E2E
```

Jika langkah 1–16 berhasil, Phase 5 berjalan lengkap di laptopmu.
