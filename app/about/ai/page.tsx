import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Transparency",
  description: "Cara Batak Digital menggunakan AI, retrieval, sumber, privasi, dan batasan inferensi.",
};

export default function AITransparencyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-800">AI transparency</p>
      <h1 className="mt-3 font-serif text-5xl font-semibold">AI bukan sumber kebenaran.</h1>
      <p className="mt-5 text-lg leading-8 text-stone-600">
        Phase 5 menggunakan AI sebagai lapisan navigasi dan penjelasan di atas knowledge base. Sumber, klaim, variasi, dan keputusan editorial tetap menjadi fondasi utama.
      </p>

      <div className="mt-10 space-y-5 text-sm leading-7 text-stone-700">
        <Section title="1. Retrieval before generation">
          Pertanyaan diubah menjadi embedding dan dicocokkan dengan indeks dokumen yang hanya berisi konten published serta memiliki sumber. Keyword search dan semantic similarity digabungkan sebelum konteks dikirim ke model.
        </Section>
        <Section title="2. Tidak ada web browsing otomatis">
          Assistant produksi tidak diberi tool web search. Ia hanya menerima potongan database Batak Digital yang sudah melalui proses editorial. Website eksternal tetap dapat dibuka pengguna melalui tautan sumber.
        </Section>
        <Section title="3. Genealogi diperlakukan lebih ketat">
          Data genealogy orang hidup tidak masuk indeks AI. Assistant juga diperintahkan tidak menyimpulkan hubungan marga, tarombo, atau partuturan apabila evidence yang tersedia tidak cukup.
        </Section>
        <Section title="4. Variasi tidak dihapus">
          Claim dengan status regional variation atau disputed harus dibawa bersama qualification-nya. AI tidak boleh memilih satu versi hanya agar jawabannya terlihat sederhana.
        </Section>
        <Section title="5. Privacy by default">
          Prompt publik tidak disimpan secara mentah secara default. Sistem dapat menyimpan hash prompt, metadata retrieval, token usage, dan feedback untuk observability. Penyimpanan prompt mentah hanya aktif jika operator sengaja mengaktifkan AI_STORE_PROMPTS=true.
        </Section>
        <Section title="6. Human editorial control">
          AI editorial review hanya memberi second-pass review dan pertanyaan verifikasi. Ia tidak mempunyai akses untuk mempublikasikan entity, claim, contribution, genealogy edge, atau source.
        </Section>
        <Section title="7. Fail closed on evidence">
          Jika retrieval tidak memberikan materi yang cukup, jawaban yang benar adalah “informasi belum cukup”, bukan membuat penjelasan dari pengetahuan umum model.
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-3xl border border-stone-200 bg-white p-6"><h2 className="font-serif text-2xl font-semibold text-stone-950">{title}</h2><p className="mt-3">{children}</p></section>;
}
