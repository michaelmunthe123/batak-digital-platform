import Link from "next/link";

export const metadata = {
  title: "Panduan Kontribusi | Batak Digital",
  description: "Aturan evidence, privasi, hak cipta, dan etika kontribusi untuk Batak Digital.",
};

const rules = [
  ["Gunakan sumber yang dapat ditelusuri", "Cantumkan URL, judul, penulis/lembaga, tahun, dan locator seperti halaman atau bagian bila tersedia. Tradisi lisan harus diberi konteks narasumber dan izin publikasi."],
  ["Jangan mengubah perbedaan menjadi satu versi paksa", "Jika sumber atau komunitas mencatat versi yang berbeda, ajukan variasinya beserta konteks wilayah, kelompok, atau sumber. Jangan menghapus versi lain hanya karena berbeda."],
  ["Lindungi orang yang masih hidup", "Jangan mengirim alamat, nomor telepon, data identitas, atau detail genealogis sensitif orang hidup tanpa dasar izin yang jelas. Data pribadi bukan syarat untuk membuktikan pengetahuan budaya."],
  ["Hormati hak cipta", "Jangan mengunggah atau menyalin penuh buku, foto, manuskrip, atau media berhak cipta. Ajukan metadata dan tautan sumber; media hanya dipublikasikan jika status hak penggunaannya jelas."],
  ["Tidak ada otoritas berdasarkan voting", "Jumlah kontribusi, reputasi, atau popularitas tidak menentukan kebenaran adat. Keputusan editorial harus kembali pada evidence, konteks, dan review."],
  ["Gunakan bahasa yang menghormati komunitas", "Hindari penghinaan, stereotip, klaim superioritas, atau serangan terhadap kelompok, keluarga, marga, maupun narasumber."],
] as const;

export default function ContributionGuidelinesPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-14 md:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Community governance</p>
      <h1 className="mt-2 font-serif text-5xl font-semibold leading-tight">Panduan kontribusi</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-600">
        Kontribusi membantu memperluas pengetahuan, tetapi tidak langsung menjadi fakta publik. Semua proposal tetap melewati evidence dan review editorial.
      </p>

      <section className="mt-10 space-y-4">
        {rules.map(([title, body], index) => (
          <article key={title} className="rounded-2xl border border-stone-200 bg-white p-6">
            <p className="text-xs font-semibold tracking-[0.16em] text-stone-400">{String(index + 1).padStart(2, "0")}</p>
            <h2 className="mt-2 font-serif text-2xl font-semibold">{title}</h2>
            <p className="mt-3 leading-7 text-stone-600">{body}</p>
          </article>
        ))}
      </section>

      <section className="mt-10 rounded-3xl bg-stone-950 p-7 text-stone-100">
        <h2 className="font-serif text-3xl font-semibold">Untuk klaim sensitif</h2>
        <p className="mt-3 leading-7 text-stone-300">
          Koreksi genealogi, hubungan antarmarga, bahasa, dan klaim asal-usul wajib membawa evidence source sebelum dapat disubmit. Jika evidence belum cukup, simpan sebagai draft atau minta review sebagai variasi yang belum terverifikasi.
        </p>
      </section>

      <div className="mt-9 flex flex-wrap gap-3">
        <Link href="/contribute" className="rounded-xl bg-stone-950 px-4 py-2.5 text-sm font-semibold text-white">Kembali ke kontribusi</Link>
        <Link href="/about/methodology" className="rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-semibold">Baca metodologi sumber</Link>
      </div>
    </main>
  );
}
