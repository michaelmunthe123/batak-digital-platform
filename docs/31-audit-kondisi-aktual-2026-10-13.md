# Audit kondisi aktual dan rencana perbaikan

> Snapshot audit awal. Sebagian temuan tooling telah diperbaiki pada 14 Oktober 2026. Untuk hasil terbaru dan batas deployment pilot, lihat [laporan lanjutan](32-validasi-dan-deployment-pilot-2026-10-14.md). Temuan database dan AI yang belum diuji tetap berlaku.

Tanggal: 13 Oktober 2026. Lingkungan: Windows/PowerShell, Node 24.21.0, npm 11.19.0. Versi aplikasi: 0.5.0.

## Kesimpulan

Source Phase 1–5 tersedia dan **build produksi berhasil**, tetapi proyek **belum lolos seluruh quality gate dan belum siap deployment**. Implementasi saat ini adalah fondasi aplikasi dengan data pilot, alur editorial/community, dan integrasi AI yang masih membutuhkan validasi nyata.

Label “Complete” dalam handoff berarti deliverable source tersedia, bukan bukti bahwa migrasi, RLS, login, undangan, Storage, dan AI sudah berjalan end-to-end. Tidak perlu membangun ulang proyek.

Audit ini memetakan seluruh struktur, membaca dokumentasi dan enam migrasi, serta menelaah jalur data, autentikasi, server actions, AI, komponen utama, seed, konfigurasi, dan cakupan test. Ini bukan sertifikasi keamanan, pengujian seluruh kombinasi UI, ataupun verifikasi kebenaran sumber budaya.

Tidak dilakukan reset/migrasi database, indexing AI, pengiriman undangan, commit, push GitHub, atau deployment. Nilai konfigurasi lokal tidak dibaca atau ditampilkan. Next.js memuat konfigurasi lokal secara normal saat build dan startup test; hasil tersebut tidak memvalidasi kelengkapan konfigurasi.

## 1. Peta implementasi

| Bagian | Fungsi dan kondisi |
|---|---|
| [app](../app/) | App Router: halaman publik, akun contributor, admin, callback Auth, dan lima endpoint AI. |
| [components](../components/) | UI eksplorasi, peta skematik, tarombo per generasi, partuturan, gallery metadata, dan client AI. |
| [lib](../lib/) | Repository Supabase/pilot, auth, domain engine, workflow community, retrieval/generation AI. |
| [supabase/migrations](../supabase/migrations/) | Enam migrasi kumulatif: schema awal, editorial, Phase 2, Phase 3, Phase 4, Phase 5. Belum dieksekusi dalam audit. |
| [seed](../supabase/seed.sql) | Data pilot, sumber, contoh kamus/timeline, lima rule kekerabatan, dan genealogy fiktif. Bukan dataset budaya final. |
| [docs](./) dan handoff | 30 dokumen awal dan lima handoff; sebagian checklist merupakan catatan historis source-level. |
| [scripts](../scripts/) | Lima verifier struktural dan indexer AI yang menulis database serta memanggil API berbayar. |
| [tests](../tests/) | 9 berkas unit test, 5 berkas E2E; 9 skenario E2E dijalankan untuk dua viewport/proyek browser. |
| [CI](../.github/workflows/ci.yml) | Lint/typecheck/unit/build dan E2E tersedia; verifier Phase 4–5 belum masuk CI. |

Pemisahan knowledge graph, genealogy graph, dan kinship rules sudah terlihat pada model dan kode. Public AI index tidak memasukkan tabel genealogy node/edge secara langsung. Tidak ditemukan jalur AI yang otomatis memublikasikan pengetahuan atau menggabungkan kontribusi.

## 2. Hasil pemeriksaan yang benar-benar dijalankan

| Pemeriksaan | Hasil aktual | Batas kesimpulan |
|---|---|---|
| `npm ls --depth=0` | Lolos; dependency langsung terpasang tanpa laporan missing/invalid | Belum membuktikan instalasi bersih dari lockfile pada mesin baru. |
| `npm run verify:all` | **Lolos Phase 1–5** | Pemeriksaan file/string/config; bukan eksekusi SQL atau integrasi fitur. |
| `npm run lint` | **Gagal: 24 error, 1 warning** | 23 penggunaan explicit `any`, 1 link internal memakai anchor, 1 warning default export PostCSS. |
| `npm run typecheck` | **Lolos** | Pemeriksaan TypeScript dengan dependency nyata; tidak menguji schema database. |
| `npm run test` | **20 lolos, 1 gagal**, dari 21 test | Vitest pertama terhalang akses sandbox; rerun dengan izin di luar sandbox berhasil menjalankan suite. |
| `npm run build` | **Lolos** | Kompilasi Next.js, TypeScript, dan generasi static pages berhasil; route dinamis belum membuktikan koneksi database. |
| `npm run test:e2e -- --workers=2 --reporter=line` | **Terblokir: 18 kasus gagal meluncurkan browser** | Chromium headless shell versi yang diminta Playwright tidak tersedia. Tidak ada assertion halaman yang berhasil dijalankan. Proses dihentikan setelah semua kegagalan launch tercatat karena teardown masih menunggu. |
| `npm audit --json` | **8 paket terdampak: 2 critical, 5 high, 1 moderate** | Hitungan paket termasuk propagasi dependency, bukan delapan kerentanan aplikasi independen. |
| `npm audit --omit=dev --json` | **0 advisori dependency produksi** | Hasil registry pada saat audit, bukan jaminan bebas kerentanan. |
| Pemeriksaan file tracked dan pola credential | Tidak ada kecocokan pola credential umum pada file tracked saat ini | Scan heuristik terbatas; belum audit seluruh isi history Git dengan secret scanner khusus. |
| Migrasi, seed, RLS, login/undangan, Storage, OpenAI/indexing | **Belum diuji langsung** | Tidak dilakukan perubahan database atau panggilan AI. |

Perintah npm dijalankan sebagai `npm.cmd` di PowerShell. Dependency penting yang ditemukan: Next 16.3.8, React/React DOM 19.2.0, TypeScript 5.9.3, Supabase JS 2.117.2, SSR 0.8.0, Playwright 1.63.0, Vitest 3.2.7.

## 3. Kondisi per fase

| Fase | Yang tersedia | Yang belum dapat diklaim selesai |
|---|---|---|
| Phase 1 | Navigasi knowledge/marga/sumber/search, schema provenance, SSR auth, draft dan transition editorial | Query database nyata, pembacaan claim di halaman publik, enforcement workflow publikasi, CRUD editorial lengkap. |
| Phase 2 | Peta skematik interaktif, timeline, kamus, gallery metadata, filter dan completeness | Citation per item pada UI, media preview/upload Storage, pengujian query database dan filter join. |
| Phase 3 | Demo genealogy fiktif, visualizer, engine path dan rule partuturan, form draft | Publikasi node melalui UI, privasi view SQL, provenance end-to-end, integrasi path finder ke UI. |
| Phase 4 | Undangan, aktivasi, proposal/evidence, diskusi, moderasi, laporan, notifikasi | Seluruh alur Auth/RLS live; status `merged` baru menandai keputusan, tidak menerapkan perubahan ke knowledge canonical. |
| Phase 5 | Endpoint assistant/search/learning/review, indexer, view export, hybrid RPC, log/feedback | Migrasi pgvector, retrieval nyata, model/API availability, evaluasi grounding, invalidasi index, batas abuse dan kegagalan layanan. |

## 4. Temuan prioritas

P0 = perlu ditangani sebelum database digunakan untuk data sensitif atau AI publik. P1 = perlu ditangani untuk alur lokal lengkap. P2 = kualitas/reproducibility/dokumentasi. Temuan SQL di bawah berasal dari pembacaan source; dampak pada instance nyata belum direproduksi.

### P0 — Privasi view genealogy tidak mengikuti pola RLS aman

Pada [migrasi Phase 3](../supabase/migrations/20261007170000_phase3_genealogy_kinship.sql), `genealogy_dataset_completeness` adalah view biasa tanpa `security_invoker`, tanpa filter role editorial, dan diberi `SELECT` untuk `authenticated`. View merangkum semua dataset, termasuk judul, visibility dan jumlah living nodes.

Pada deployment lazim dengan owner view yang melewati RLS, akun contributor dapat membaca metadata dataset private melalui view tersebut. Perbaikan: view dengan security invoker dan pembatasan editorial yang eksplisit, lalu uji anon, contributor, owner, dan editorial melalui API database langsung. Jangan menyimpulkan UI admin saja cukup membatasi akses.

### P0 — Suspensi contributor dapat dilewati melalui RPC

Dalam [migrasi Phase 4](../supabase/migrations/20261007193000_phase4_community_contribution.sql), `transition_contribution_status` memakai `security definer` dan memeriksa identitas author, tetapi tidak memeriksa `is_active_contributor()` pada cabang author. Author yang disuspend masih dapat mencoba submit/withdraw proposal miliknya langsung melalui RPC meskipun server action menolaknya.

Policy delete evidence juga belum mensyaratkan membership aktif. Tambahkan guard database dan test negatif langsung; pertahankan role editorial secara terpisah.

### P0 — Pembatasan publikasi editorial belum dipaksa pada semua jalur database

[Schema awal](../supabase/migrations/20261006090000_initial_schema.sql) memberi policy `FOR ALL` kepada `can_edit()` untuk entities, sources, claims dan tabel lain. Sementara [RPC editorial](../supabase/migrations/20261006093000_editorial_workflow.sql) melarang editor memublikasikan entities/sources atau mengklasifikasi claim.

Policy tabel tidak melarang editor menulis status secara langsung; source juga belum menyediakan pembatasan kolom yang setara dengan Phase 4 untuk jalur ini. Apabila grant tabel standar Supabase berlaku, RPC dan audit status dapat dilewati. Perlu verifikasi privilege nyata, pembatasan mutation status pada database, dan test editor via REST/RPC. Publikasi claim/edge/rule juga belum memaksa keberadaan evidence published pada RPC.

### P0 — Dua kandidat penghambat migrasi SQL

1. [Policy genealogy edges Phase 3](../supabase/migrations/20261007170000_phase3_genealogy_kinship.sql): subquery menggunakan `where d.id=dataset_id` sementara alias node `s` dan `t` masing-masing punya kolom `dataset_id`. Referensi tanpa qualifier ini ambigu; perlu mengikat ke tabel edge secara eksplisit dan menguji migrasi.
2. [Hybrid search Phase 5](../supabase/migrations/20261007223000_phase5_ai_mature_platform.sql): vector dibuat pada schema `extensions`, fungsi memakai `set search_path = ''`, tetapi operator `<=>` tidak diberi schema. Gunakan resolusi operator yang eksplisit, misalnya `OPERATOR(extensions.<=>)`, lalu uji pembuatan dan pemanggilan fungsi.

Keduanya berbeda dari timeout koneksi yang dilaporkan pengguna. Timeout belum didiagnosis ulang; jangan menganggap salah satu temuan SQL ini penyebab timeout.

### P0 — Grounding AI masih dapat memberi kesan bukti yang tidak memadai

- [View index](../supabase/migrations/20261007223000_phase5_ai_mature_platform.sql) memasukkan relasi evidence `contradicts` dan `context`; support type disimpan di metadata tetapi tidak diteruskan oleh hybrid RPC/[repository AI](../lib/ai-repository.ts) ke konteks model. Sumber yang menyangkal klaim bisa disajikan seolah mendukungnya.
- [Validasi jawaban](../lib/ai-grounding.ts) hanya membatasi source key yang dikenal. Jawaban tanpa source key dapat tetap keluar sebagai `partial`; [route assistant](../app/api/assistant/route.ts) bahkan memilih tiga dokumen sebagai fallback source cards. Ini belum membuktikan bahwa isi jawaban didukung sumber.
- [Learning plan](../app/api/learning-plan/route.ts) mencatat `grounded` walau source keys setiap langkah mungkin kosong setelah filtering.

Perbaikan: bawa support type/status/context sampai UI dan prompt, tolak klaim/step yang tidak mempunyai evidence memadai, dan uji pertanyaan di luar corpus, konflik sumber, citation palsu, serta prompt injection. Keberadaan citation bukan verifikasi kebenaran budaya.

### P1 — AI index bisa menyajikan status atau konten lama

[Indexer](../scripts/index-ai.mjs) hanya membandingkan hash judul + 12.000 karakter awal isi, model, dan status index. Perubahan `claim_status`, locator, metadata, atau isi setelah batas itu bisa terlewat. Pembacaan existing `ai_documents` tidak dipaginasi, meskipun [konfigurasi API](../supabase/config.toml) membatasi 1.000 baris; archival dapat melewatkan dokumen di luar halaman pertama. Pagination source rows juga belum memiliki ordering stabil.

[Hybrid RPC](../supabase/migrations/20261007223000_phase5_ai_mature_platform.sql) memeriksa status index dan sumber, tetapi tidak menguji ulang kelayakan entity/claim asal. Konten yang ditarik dari publikasi dapat tetap tersedia sampai index diperbarui. Buat sinkronisasi metadata terpisah dari embedding, pagination deterministik, dan pengujian pencabutan publikasi.

### P1 — Fallback pilot menyamarkan kegagalan integrasi

[Repository utama](../lib/repository.ts), [Phase 2](../lib/phase2-repository.ts), dan [Phase 3](../lib/phase3-repository.ts) memakai pilot saat query gagal atau kosong. Entity yang tidak ditemukan/diarsipkan dapat muncul kembali dari pilot jika slug cocok. Beberapa metadata entity database juga digabung dengan data pilot.

Pisahkan mode demo yang eksplisit dari mode database. Dalam mode database, hasil kosong harus tetap kosong; error harus dapat dibedakan dari konten demo. Ini penting sebelum menilai hasil E2E atau keberhasilan migrasi.

### P1 — Beberapa alur fitur belum lengkap

- [Draft genealogy node](../app/admin/actions.ts) selalu berstatus draft; [dashboard admin](../app/admin/page.tsx) tidak menyediakan queue/transisi publikasi node. Dataset yang dipublikasikan tidak otomatis membuat node draft terlihat publik. Lengkapi review node dengan privacy/evidence guard.
- [Repository utama](../lib/repository.ts) memakai claim untuk mencari source links, tetapi body/status claim belum dimuat dan dirender sebagai klaim di halaman knowledge/marga. Publikasi claim belum berarti pembaca melihat klaim itu di UI.
- [Repository Phase 2](../lib/phase2-repository.ts) mengembalikan `sourceIds: []` untuk dictionary database dan tidak memuat evidence links map/timeline. [Halaman bahasa](../app/language/page.tsx) dan [timeline](../components/tradition-timeline.tsx) belum menyediakan citation/locator per item.
- [Gallery](../components/media-gallery.tsx) merender kartu metadata, tidak merender `previewUrl` bahkan untuk media berizin. Belum ditemukan jalur upload Storage, pembuatan signed URL, ataupun bucket/policy Storage aplikasi dalam migrasi.
- [Community transition](../supabase/migrations/20261007193000_phase4_community_contribution.sql) menandai `merged` dan membuat audit/revision proposal; tidak mengubah canonical knowledge. Ini boleh menjadi merge manual, tetapi perlu prosedur dan tautan hasil editorial yang nyata. Jangan menambahkan auto-merge.
- [Genealogy engine](../lib/genealogy-engine.ts) dan SQL path helper tersedia, tetapi belum dipanggil oleh UI aplikasi. Visualizer sekarang berupa kelompok generasi + inspector/ledger, bukan explorer path lengkap.

### P1 — Quality gate dan dependency perlu diperbaiki

- [Test pencarian](../tests/unit/search.test.ts) mengharapkan query kosong menghasilkan `[]`; [implementasi](../lib/search-core.ts) mendukung browse kosong seperti scope Phase 2. Selaraskan kontrak/test tanpa menghapus fitur browse.
- Error lint terutama di [community repository](../lib/community-repository.ts), halaman community/contribution/report, dan [actions moderasi](../app/admin/community/actions.ts). Gunakan tipe row/form yang jelas; jangan mematikan aturan lint untuk membuat gate hijau.
- [Package](../package.json) menyatakan Node >=20.9, tetapi Supabase JS terpasang mensyaratkan >=22. CI sudah memakai Node 22; mesin audit Node 24. Selaraskan minimum dan panduan dengan dependency aktual.
- Advisori development mencakup Vitest/mocker/tinypool serta rantai ESLint Next → fast-glob → micromatch → braces. Lihat [Vitest](https://github.com/advisories/GHSA-82fw-gwwq-j7x9), [tinypool](https://github.com/advisories/GHSA-85c8-ppgw-ccpr), dan [braces](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm). Evaluasi pembaruan kompatibel. Jangan menjalankan `npm audit fix --force`: rekomendasi otomatis saat audit termasuk downgrade eslint-config-next ke 14.2.35, tidak selaras dengan Next 16.3.8.

### P1/P2 — Ketahanan API dan audit operasional

- [Feedback AI](../app/api/assistant/feedback/route.ts) menerima request ID tanpa pengikatan pemilik atau rate limit, lalu menulis memakai admin client. Actor selalu null pada jalur ini; unique `(request_id,actor_id)` tidak mendeduplikasi null seperti identitas nyata. Risiko spam/duplikasi perlu ditangani.
- [Rate-limit RPC](../supabase/migrations/20261007223000_phase5_ai_mature_platform.sql) membuat hitungan 1 lalu menaikkannya lagi pada request pertama; jendela awal kehilangan satu kuota.
- Error rate-limit terjadi di luar blok try pada beberapa route. [REST client](../lib/openai-rest.ts) belum memakai timeout eksplisit; kegagalan moderation dilaporkan sebagai unavailable tetapi request dapat tetap dilanjutkan. Perlu perilaku fallback/error dan observabilitas yang terdokumentasi.
- [Audit writer](../lib/ai-repository.ts) mengabaikan error penyimpanan log. Retensi/pembersihan rate windows dan log belum ada. Metadata learning menyimpan topics meskipun raw prompt logging dimatikan; perlu kebijakan privasi yang tepat.
- [Membership](../supabase/migrations/20261007193000_phase4_community_contribution.sql) memberi owner select baris sendiri termasuk `internal_note`, walaupun UI tidak menampilkannya. Bila catatan memang hanya untuk admin, batasi di database.

## 5. Kesiapan GitHub publik dan README

Repository Git lokal dan remote bernama `origin` sudah ada. Audit tidak memeriksa atau mengubah visibilitas repository remote, dan tidak melakukan push. Working tree awal bersih; perubahan pada [AGENTS.md](../AGENTS.md) terlihat selama audit dan tidak disentuh oleh auditor.

[Gitignore](../.gitignore) sudah mengabaikan konfigurasi lokal, node_modules, build, laporan Playwright, dan cache Supabase. File konfigurasi lokal tidak tercatat sebagai tracked. Pemeriksaan nama file sensitif dalam history menemukan template environment saja. Scan pola pada file tracked saat ini tidak menemukan OpenAI/Supabase secret, GitHub token, JWT, private key, atau connection string berpassword yang cocok dengan pola pemeriksaan. Ini belum menjadi persetujuan bahwa seluruh history aman dipublikasikan.

Perbaikan sebelum push:

1. Tambahkan ignore untuk semua variasi environment selain template, misalnya `.env*` dengan pengecualian `!.env.example`; `.env.production` saat audit belum diabaikan. Tambahkan `*.tsbuildinfo`, metadata hosting bila dipakai, dan pola credential khusus yang relevan. Typecheck menghasilkan cache TypeScript untracked pada audit ini; jangan commit.
2. Scan seluruh history dengan secret scanner yang meredaksi hasil. Periksa remote tanpa mencetak token; jika pernah ada credential committed, rotasi dahulu dan rencanakan pembersihan history secara terpisah.
3. Ubah README agar membedakan “source tersedia”, “test lokal lolos”, dan “integrasi belum diuji”. Jangan memasang badge CI hijau sebelum benar-benar berjalan di GitHub.
4. CI memakai `npm ci` dan `verify:all`, bukan hanya Phase 1–3. Pisahkan preview E2E tanpa secret dari integrasi database; jangan berikan secret ke workflow PR yang tidak dipercaya.
5. Tetapkan lisensi kode secara sadar bersama pemilik. Repository publik tidak otomatis memberi izin penggunaan ulang. Hak sumber budaya dan media harus terpisah dari lisensi kode.
6. Setelah diff, file staged, scan secret, dan README ditinjau, baru minta persetujuan push. Tidak perlu deployment untuk memublikasikan source sebagai proyek eksperimental dengan batasan yang jelas.

Susunan README yang disarankan:

| Bagian | Isi |
|---|---|
| Ringkasan | Tujuan, prinsip budaya, status experimental/local validation. |
| Status fitur | Matriks Phase 1–5, pilot vs live, fungsi yang belum selesai. |
| Quick start Windows | Versi Node yang sesuai; gunakan dependency lockfile; jangan menimpa konfigurasi lokal yang sudah ada. |
| Mode operasi | Preview pilot, Supabase development, AI opsional. |
| Verifikasi | Perintah quality gate dan tautan laporan aktual ini. |
| Arsitektur/data | Provenance, varian budaya, tiga domain relasi, privasi genealogy. |
| Kontribusi/keamanan | Propose → editorial review; larangan secret, aturan pelaporan kerentanan. |
| Lisensi/batasan | Lisensi belum dipilih; data/media punya hak tersendiri. |

[README sekarang](../README.md) cukup jelas menjelaskan visi, tetapi tabel “Complete” perlu diberi makna source-level, diagram struktur mencantumkan direktori public yang belum ada, dan bagian setup belum menjelaskan risiko fallback. [Panduan Windows](../RUN_IN_VSCODE_WINDOWS.md) memakai `Copy-Item` tanpa guard keberadaan file; jangan jalankan langkah itu pada konfigurasi lokal yang sudah terisi. Instruksi `db reset` pada dokumen historis bukan langkah yang disarankan untuk kondisi pengguna saat ini.

## 6. Rencana tindakan bertahap

| Urutan | Pekerjaan | Kriteria selesai |
|---|---|---|
| 1 — GitHub aman | Perbaiki ignore/README/CI; audit secret seluruh history; tentukan lisensi | Diff hanya file yang dimaksud, tidak ada secret/artifact runtime staged; status README jujur. Push tetap menunggu persetujuan. |
| 2 — Baseline lokal | Rapikan tipe community dan link, selaraskan test search, minimum Node, evaluasi advisori dependency | Install bersih teruji; verify/lint/typecheck/unit/build lolos tanpa melemahkan pemeriksaan. |
| 3 — Preview UI | Pisahkan mode pilot, pasang Chromium, jalankan E2E desktop/mobile dan cek keyboard | E2E berjalan sungguhan; dependency pada data pilot eksplisit; laporan kegagalan UI diperbaiki. |
| 4 — Database development | Diagnosis timeout, inventaris migration remote secara read-only, siapkan koreksi SQL dan backup | Koneksi berhasil, enam migrasi + koreksi teruji pada database development; tidak ada reset destruktif. |
| 5 — Governance | Uji role anon/contributor A/B/suspended/editor/reviewer/admin; tutup bypass/view privacy; lengkapi node publish dan evidence | Percobaan akses ilegal ditolak database, bukan hanya UI; audit keputusan tersimpan. |
| 6 — Integrasi produk | Login/undangan/aktivasi/proposal/moderasi/merge manual/notifikasi; provenance UI dan Storage bila dibutuhkan | Satu perjalanan pengguna lengkap terbukti dengan data development dan hasil dapat ditelusuri. |
| 7 — AI opsional | Validasi model yang tersedia, perbaiki index freshness/grounding/rate limit, buat index dari konten yang disetujui | Retrieval dan generation nyata teruji; unsupported/conflicting/private evidence ditangani dengan benar. |
| 8 — Kandidat deployment | Ulang quality gate, observabilitas, backup/restore, security/content review | Baru menilai staging/deployment; belum menjadi target audit ini. |

### Diagnosis timeout Supabase berikutnya

Supabase CLI login membuktikan sesi Management API, bukan konektivitas PostgreSQL. Jangan mengulang push/reset tanpa mengetahui tahap yang timeout. Kumpulkan pesan error yang sudah disensor, periksa status project, DNS/jangkauan port, jalur IPv4/IPv6 atau pooler yang sesuai, firewall/VPN, lalu cek riwayat migrasi secara read-only. Jangan menaruh password pada command yang akan tersimpan dalam history/log. Docker dan psql tidak ditemukan pada PATH audit; ini tidak membuktikan keduanya sama sekali tidak terpasang.

### Langkah sederhana saat melanjutkan

Mulai dari tahap 1 dan 2. Jangan salin ulang template environment di atas konfigurasi yang sudah ada. Untuk memeriksa versi di terminal VS Code:

```powershell
node --version
npm.cmd --version
git status --short
```

Setelah perbaikan baseline diselesaikan, jalankan seluruh quality gate. Untuk membuka blokir E2E, pasang browser sekali dengan `npx playwright install chromium`, kemudian ulang test. Audit ini belum mengunduh browser. Tidak perlu mengaktifkan AI atau menjalankan migrasi untuk memperbaiki lint dan unit test.

## 7. Batas hasil audit dan perubahan berkas

- Hasil build/typecheck nyata menggantikan ketidakpastian handoff lama untuk mesin ini saja.
- Tidak ada klaim bahwa database sudah dimigrasikan, Auth/Storage sudah bekerja, atau AI menghasilkan jawaban yang benar.
- E2E belum memeriksa perilaku halaman. Source test Phase 3 juga mengharapkan label Inggris `uses kinship system`, sementara pilot memakai label Indonesia; ini perlu diselaraskan saat mode data ditetapkan, belum merupakan failure assertion yang diamati.
- Tidak ada audit manual semua URL sumber, lisensi aset individual, aksesibilitas menyeluruh, atau performa/load test.
- Hanya laporan ini ditambahkan oleh auditor. Kode aplikasi, migrasi, dependency, README, dan konfigurasi lokal tidak direfactor. Build/test menghasilkan artifact lokal yang sebagian besar sudah di-ignore; cache TypeScript perlu di-ignore pada tahap 1.
