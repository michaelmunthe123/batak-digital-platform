import type { KnowledgeEntity, SourceRecord } from "@/lib/types";

export const pilotSources: SourceRecord[] = [
  {
    id: "bps-ethnicity",
    title: "Mengulik Data Suku di Indonesia",
    publisher: "Badan Pusat Statistik",
    year: 2015,
    url: "https://sumbawabaratkab.bps.go.id/id/news/2015/09/18/12/mengulik-data-suku-di-indonesia.html",
    level: "B",
    type: "institutional",
    description:
      "Entry point institusional untuk memahami pengelompokan data suku dan prinsip bahwa kategori dapat disesuaikan dengan kebutuhan analisis.",
    status: "published",
  },
  {
    id: "badan-bahasa-batak",
    title: "Bahasa Batak — Peta Bahasa",
    publisher: "Badan Pengembangan dan Pembinaan Bahasa",
    url: "https://labbineka.kemendikdasmen.go.id/laman/bahasarinci/8/batak",
    level: "B",
    type: "institutional",
    description:
      "Entry point untuk variasi bahasa/dialek Batak; dipisahkan dari klasifikasi kelompok budaya dalam model data.",
    status: "published",
  },
  {
    id: "bpk-wbtb",
    title: "Penetapan Warisan Budaya Takbenda Aceh dan Sumut untuk Indonesia",
    publisher: "Kementerian Pendidikan dan Kebudayaan",
    url: "https://kebudayaan.kemdikbud.go.id/bpnbaceh/penetapan-warisan-budaya-takbenda-aceh-dan-sumut-untuk-indonesia/",
    level: "B",
    type: "institutional",
    description:
      "Entry point dokumentasi budaya takbenda dari berbagai komunitas di Sumatera Utara.",
    status: "published",
  },
  {
    id: "perpusnas-manuskrip",
    title: "Digitalisasi Naskah Kuno Batak",
    publisher: "Perpustakaan Nasional Republik Indonesia",
    year: 2026,
    url: "https://www.perpusnas.go.id/berita/melalui-digitalisasi-naskah-kuno-batak-perpusnas-dorong-kolaborasi-lintas-negara-dan-keilmuan",
    level: "B",
    type: "archive",
    description:
      "Entry point untuk manuskrip Batak dan sumber primer yang dapat ditelusuri melalui koleksi Perpusnas/Khastara.",
    status: "published",
  },
  {
    id: "wbtb-2014",
    title: "Penetapan Warisan Budaya Takbenda Indonesia 2014",
    publisher: "Direktorat Warisan dan Diplomasi Budaya",
    year: 2014,
    url: "https://kebudayaan.kemdikbud.go.id/ditwdb/penetapan-warisan-budaya-takbenda-indonesia-2014/",
    level: "B",
    type: "institutional",
    description:
      "Daftar resmi penetapan WBTB 2014 yang mencakup antara lain Merdang-Merdem dan Ulos Batak Toba dari Sumatera Utara.",
    status: "published",
  },
  {
    id: "kamus-simalungun-2016",
    title: "Kamus Bahasa Simalungun-Indonesia: ed.2",
    creator: "Zufri Hidayat dkk.",
    publisher: "Badan Pengembangan dan Pembinaan Bahasa",
    year: 2016,
    url: "https://repositori.kemendikdasmen.go.id/16214/",
    level: "B",
    type: "institutional",
    description:
      "Kamus institusional Simalungun–Indonesia yang menjadi sumber contoh entri dictionary pada Phase 2.",
    status: "published",
  },
  {
    id: "kamus-toba-2021",
    title: "Kamus Pelajar Bergambar Toba-Indonesia",
    creator: "Sriasrianti dkk.",
    publisher: "Balai Bahasa Provinsi Sumatera Utara",
    year: 2021,
    url: "https://repositori.kemendikdasmen.go.id/34717/",
    level: "B",
    type: "institutional",
    description:
      "Kamus pelajar Toba–Indonesia untuk pengembangan dictionary setelah entri individual diverifikasi dan dicatat locators-nya.",
    status: "published",
  },
  {
    id: "merdang-merdem-bpnb-2017",
    title: "Merdang Merdem: Kerja Tahunan Suku Karo",
    publisher: "Balai Pelestarian Nilai Budaya Aceh",
    year: 2017,
    url: "https://kebudayaan.kemdikbud.go.id/bpnbaceh/merdang-merdem-kerja-tahunan-suku-karo/",
    level: "B",
    type: "institutional",
    description:
      "Dokumentasi institusional mengenai konteks dan rangkaian hari Merdang Merdem/Kerja Tahun, sekaligus mencatat variasi waktu antarwilayah Karo.",
    status: "published",
  },
  {
    id: "kamus-karo-2001",
    title: "Kamus Bahasa Karo - Indonesia",
    creator: "Ahmad Samin Siregar dkk.",
    publisher: "Balai Pustaka / Pusat Bahasa",
    year: 2001,
    url: "https://repositori.kemendikdasmen.go.id/1967/",
    level: "B",
    type: "institutional",
    description:
      "Sumber leksikografi Karo–Indonesia untuk entri dictionary Phase 2 yang dipilih secara terbatas dan diberi provenance.",
    status: "published",
  },
  {
    id: "mari-mengenal-batak-toba",
    title: "Mari Mengenal Batak Toba",
    creator: "Ketut Wiradnyana",
    publisher: "Balai Arkeologi Sumatera Utara",
    year: 2020,
    url: "https://repositori.kemendikdasmen.go.id/19350/",
    level: "B",
    type: "institutional",
    description:
      "Sumber pengantar arkeologi dan budaya untuk konteks kawasan Danau Toba dan Samosir.",
    status: "published",
  },
  {
    id: "tata-kelakuan-sumut",
    title: "Tata Kelakuan di Lingkungan Pergaulan Keluarga dan Masyarakat Setempat Daerah Sumatera Utara",
    publisher: "Kementerian Pendidikan dan Kebudayaan",
    url: "https://repositori.kemendikdasmen.go.id/30261/1/TATA%20KELAKUAN%20DI%20LINGKUNGAN%20PERGAULAN%20KELUARGA%20DAN%20MASYARAKAT%20SETEMPAT%20DAERAH%20SUMUT.pdf",
    level: "B",
    type: "institutional",
    description:
      "Dokumentasi institusional mengenai partuturan Batak Toba, Dalihan Na Tolu, dan contoh istilah sapaan kekerabatan.",
    status: "published",
  },
  {
    id: "peranan-umpasa-1986",
    title: "Peranan Umpasa Dalam Masyarakat Batak Toba",
    publisher: "Pusat Pembinaan dan Pengembangan Bahasa",
    year: 1986,
    url: "https://repositori.kemendikdasmen.go.id/1734/1/Peranan%20Umpas%20Dalam%20Masyarakat%20Batak%20Toba%20%281986%29.pdf",
    level: "B",
    type: "institutional",
    description:
      "Sumber institusional yang mendokumentasikan martutur/partuturan dan contoh istilah kekerabatan Batak Toba.",
    status: "published",
  },
  {
    id: "permukiman-karo",
    title: "Mengenal Permukiman Masyarakat Batak Karo Provinsi Sumatera Utara",
    publisher: "Kementerian Pendidikan dan Kebudayaan",
    url: "https://repositori.kemendikdasmen.go.id/28806/1/MENGENAL%20PERMUKIMAN%20MASYARAKAT%20BATAK%20KARO%20PROVINSI%20SUMATERA%20UTARA.pdf",
    level: "B",
    type: "institutional",
    description:
      "Dokumentasi institusional mengenai Rakut Sitelu, ertutur, kalimbubu, anak beru, dan senina pada masyarakat Karo.",
    status: "published",
  },

];

const pilotNotice =
  "Entri pilot yang dimulai pada Phase 1 dan diperluas sampai Phase 3. Konten sejarah, tarombo, dan hubungan genealogis sengaja belum dipublikasikan sampai sumber khusus entri tersebut tervalidasi.";

export const pilotEntities: KnowledgeEntity[] = [
  {
    slug: "toba",
    type: "cultural_group",
    title: "Toba",
    summary:
      "Halaman navigasi awal untuk konten budaya yang berkaitan dengan komunitas Toba.",
    sourceIds: ["bps-ethnicity", "badan-bahasa-batak"],
    relatedSlugs: ["simanjuntak", "samosir"],
    editorialNote: pilotNotice,
    sections: [
      {
        heading: "Tentang halaman ini",
        body: "Phase 1 memisahkan kelompok budaya, bahasa, wilayah, dan marga sebagai entitas berbeda. Halaman ini berfungsi sebagai hub, bukan klaim klasifikasi tunggal.",
      },
    ],
  },
  {
    slug: "karo",
    type: "cultural_group",
    title: "Karo",
    summary:
      "Halaman navigasi awal untuk menjelajahi marga, wilayah, bahasa, dan tradisi terkait Karo.",
    sourceIds: ["bps-ethnicity", "badan-bahasa-batak", "bpk-wbtb"],
    relatedSlugs: ["ginting", "sembiring"],
    editorialNote: pilotNotice,
  },
  {
    slug: "simalungun",
    type: "cultural_group",
    title: "Simalungun",
    summary:
      "Hub pengetahuan pilot untuk konten yang berkaitan dengan komunitas Simalungun.",
    sourceIds: ["bps-ethnicity", "badan-bahasa-batak", "bpk-wbtb"],
    relatedSlugs: ["purba", "saragih"],
    editorialNote: pilotNotice,
  },
  {
    slug: "pakpak-dairi",
    type: "cultural_group",
    title: "Pakpak / Dairi",
    summary:
      "Hub pengetahuan pilot untuk konten Pakpak/Dairi dengan ruang bagi variasi penamaan antar-sumber.",
    sourceIds: ["bps-ethnicity", "badan-bahasa-batak", "bpk-wbtb"],
    relatedSlugs: ["berutu"],
    editorialNote: pilotNotice,
  },
  {
    slug: "angkola",
    type: "cultural_group",
    title: "Angkola",
    summary:
      "Hub pengetahuan pilot untuk konten Angkola tanpa menyamakan kategori budaya dengan kategori bahasa.",
    sourceIds: ["bps-ethnicity", "badan-bahasa-batak"],
    relatedSlugs: ["harahap"],
    editorialNote: pilotNotice,
  },
  {
    slug: "mandailing",
    type: "cultural_group",
    title: "Mandailing",
    summary:
      "Hub pengetahuan pilot untuk konten Mandailing dan sumber-sumber yang mendokumentasikan variasinya.",
    sourceIds: ["bps-ethnicity", "badan-bahasa-batak", "bpk-wbtb"],
    relatedSlugs: ["lubis", "siregar"],
    editorialNote: pilotNotice,
  },

  {
    slug: "munthe",
    type: "clan",
    title: "Munthe",
    localTerm: "Marga/Merga — konteks lokal perlu diverifikasi per entri",
    summary:
      "Profil marga pilot untuk menguji struktur pencarian, profil, sumber, variasi, dan related content.",
    aliases: ["Munte"],
    sourceIds: [],
    relatedSlugs: ["toba", "karo"],
    editorialNote: pilotNotice,
  },
  {
    slug: "simanjuntak",
    type: "clan",
    title: "Simanjuntak",
    culturalGroup: "Toba",
    summary:
      "Entri pilot marga; detail asal-usul dan tarombo belum diterbitkan pada Phase 1.",
    sourceIds: [],
    relatedSlugs: ["toba"],
    editorialNote: pilotNotice,
  },
  {
    slug: "siregar",
    type: "clan",
    title: "Siregar",
    summary:
      "Entri pilot marga untuk validasi UI dan model data source-aware.",
    sourceIds: [],
    relatedSlugs: ["mandailing", "angkola"],
    editorialNote: pilotNotice,
  },
  {
    slug: "harahap",
    type: "clan",
    title: "Harahap",
    summary:
      "Entri pilot marga; klaim genealogis hanya akan ditambahkan setelah proses editorial.",
    sourceIds: [],
    relatedSlugs: ["angkola"],
    editorialNote: pilotNotice,
  },
  {
    slug: "ginting",
    type: "clan",
    title: "Ginting",
    localTerm: "Merga",
    culturalGroup: "Karo",
    summary:
      "Entri pilot merga untuk menguji label istilah lokal tanpa mengubah tipe internal Clan.",
    sourceIds: [],
    relatedSlugs: ["karo"],
    editorialNote: pilotNotice,
  },
  {
    slug: "sembiring",
    type: "clan",
    title: "Sembiring",
    localTerm: "Merga",
    culturalGroup: "Karo",
    summary:
      "Entri pilot merga; struktur data mendukung alias, variasi, dan sumber per klaim.",
    sourceIds: [],
    relatedSlugs: ["karo"],
    editorialNote: pilotNotice,
  },
  {
    slug: "purba",
    type: "clan",
    title: "Purba",
    summary:
      "Entri pilot marga untuk demonstrasi direktori lintas kelompok budaya.",
    sourceIds: [],
    relatedSlugs: ["simalungun"],
    editorialNote: pilotNotice,
  },
  {
    slug: "saragih",
    type: "clan",
    title: "Saragih",
    summary:
      "Entri pilot marga; konten faktual mendalam menunggu source registry khusus.",
    sourceIds: [],
    relatedSlugs: ["simalungun"],
    editorialNote: pilotNotice,
  },
  {
    slug: "berutu",
    type: "clan",
    title: "Berutu",
    summary:
      "Entri pilot marga untuk menguji pencarian dan related content.",
    sourceIds: [],
    relatedSlugs: ["pakpak-dairi"],
    editorialNote: pilotNotice,
  },
  {
    slug: "lubis",
    type: "clan",
    title: "Lubis",
    summary:
      "Entri pilot marga; hubungan genealogis belum dipublikasikan di Phase 1.",
    sourceIds: [],
    relatedSlugs: ["mandailing"],
    editorialNote: pilotNotice,
  },

  {
    slug: "mangulosi",
    type: "tradition",
    title: "Mangulosi",
    summary:
      "Entri tradisi pilot untuk menguji pola halaman adat dan kebutuhan sumber kontekstual.",
    sourceIds: ["bpk-wbtb"],
    relatedSlugs: ["toba"],
    editorialNote:
      "Deskripsi ritual spesifik harus ditinjau sumber dan konteks komunitas sebelum dipublikasikan.",
  },
  {
    slug: "ulos",
    type: "textile",
    title: "Ulos",
    summary:
      "Entri tekstil pilot yang disiapkan untuk struktur konteks penggunaan, variasi, dan sumber.",
    sourceIds: ["bpk-wbtb"],
    relatedSlugs: ["toba"],
    editorialNote: pilotNotice,
  },
  {
    slug: "samosir",
    type: "region",
    title: "Samosir",
    summary:
      "Entri wilayah pilot yang memungkinkan relasi dengan kelompok budaya, marga, tradisi, dan sumber tanpa menyamakan wilayah dengan identitas.",
    sourceIds: [],
    relatedSlugs: ["toba"],
    editorialNote: pilotNotice,
  },
  {
    slug: "bahasa-toba",
    type: "language_variety",
    title: "Bahasa Toba",
    summary:
      "Halaman bahasa untuk menghubungkan dokumentasi kebahasaan, kamus, wilayah tutur, dan sumber tanpa menyamakan bahasa dengan identitas budaya.",
    sourceIds: ["badan-bahasa-batak", "kamus-toba-2021"],
    relatedSlugs: ["toba", "samosir"],
    editorialNote: "Entri kamus individual harus memiliki sumber dan locator sebelum diterbitkan.",
  },
  {
    slug: "bahasa-simalungun",
    type: "language_variety",
    title: "Bahasa Simalungun",
    summary:
      "Fondasi bahasa Simalungun untuk dictionary, sumber leksikografi, dan hubungan dengan konten budaya terkait.",
    sourceIds: ["badan-bahasa-batak", "kamus-simalungun-2016"],
    relatedSlugs: ["simalungun"],
    editorialNote: "Phase 2 menampilkan contoh entri terpilih, bukan menyalin kamus secara massal.",
  },
  {
    slug: "bahasa-karo",
    type: "language_variety",
    title: "Bahasa Karo",
    summary:
      "Halaman bahasa Karo untuk menghubungkan sumber linguistik, wilayah tutur, dan entri kamus yang diverifikasi.",
    sourceIds: ["badan-bahasa-batak", "kamus-karo-2001"],
    relatedSlugs: ["karo"],
    editorialNote: "Phase 2 menampilkan entri dictionary terpilih dengan provenance; perluasan tetap membutuhkan locator/sumber per entri.",
  },
  {
    slug: "bahasa-pakpak-dairi",
    type: "language_variety",
    title: "Bahasa Pakpak / Dairi",
    summary:
      "Halaman bahasa untuk dokumentasi Pakpak/Dairi dengan ruang bagi variasi klasifikasi dan penamaan sumber.",
    sourceIds: ["badan-bahasa-batak"],
    relatedSlugs: ["pakpak-dairi"],
    editorialNote: "Belum ada entri dictionary publik sampai source locator per kata tersedia.",
  },
  {
    slug: "bahasa-mandailing",
    type: "language_variety",
    title: "Bahasa Mandailing",
    summary:
      "Halaman bahasa Mandailing sebagai fondasi pengembangan sumber dan dictionary terverifikasi.",
    sourceIds: ["badan-bahasa-batak"],
    relatedSlugs: ["mandailing", "angkola"],
    editorialNote: "Klasifikasi bahasa dan kelompok budaya disimpan sebagai relasi, bukan disamakan.",
  },
  {
    slug: "merdang-merdem",
    type: "tradition",
    title: "Merdang-Merdem",
    summary:
      "Warisan budaya dari Sumatera Utara yang tercatat dalam daftar Penetapan WBTB Indonesia 2014; detail praktik memerlukan sumber khusus dan konteks komunitas.",
    sourceIds: ["wbtb-2014", "merdang-merdem-bpnb-2017"],
    relatedSlugs: ["karo"],
    editorialNote: "Jangan mengubah status WBTB menjadi klaim bahwa praktik seragam di semua komunitas Karo.",
  },
  {
    slug: "huda-huda",
    type: "performance",
    title: "Huda-Huda",
    summary:
      "Seni tradisi dari Sumatera Utara yang tercantum dalam daftar Penetapan WBTB Indonesia 2014.",
    sourceIds: ["wbtb-2014"],
    relatedSlugs: ["simalungun"],
    editorialNote: "Konteks komunitas, fungsi, dan variasi pertunjukan memerlukan sumber khusus sebelum diperluas.",
  },
  {
    slug: "dalihan-na-tolu",
    type: "kinship_system",
    title: "Dalihan Na Tolu",
    summary:
      "Sistem kekerabatan yang menjadi konteks penting dalam dokumentasi partuturan Batak Toba; platform menyimpan role dan istilahnya sebagai data source-aware.",
    sourceIds: ["tata-kelakuan-sumut"],
    relatedSlugs: ["toba", "tulang", "ito"],
    editorialNote:
      "Halaman ini tidak mengasumsikan bahwa seluruh komunitas Batak memakai terminologi yang sama; konteks budaya harus selalu ditampilkan.",
  },
  {
    slug: "rakut-sitelu",
    type: "kinship_system",
    title: "Rakut Sitelu",
    summary:
      "Struktur kekerabatan Karo yang mendokumentasikan hubungan kalimbubu, anak beru, dan senina dalam konteks adat dan sosial.",
    sourceIds: ["permukiman-karo"],
    relatedSlugs: ["karo", "senina", "kalimbubu", "anak-beru"],
    editorialNote:
      "Role terhadap individu nyata memerlukan informasi keluarga dan proses ertutur; sistem tidak menebaknya hanya dari merga.",
  },
  {
    slug: "tulang",
    type: "kinship_term",
    title: "Tulang",
    summary:
      "Istilah kekerabatan Batak Toba yang dalam sumber pilot dicontohkan untuk paman dari pihak ibu.",
    sourceIds: ["tata-kelakuan-sumut"],
    relatedSlugs: ["dalihan-na-tolu", "toba"],
    editorialNote: "Gunakan bersama konteks generasi dan hubungan keluarga; bukan label otomatis berdasarkan marga.",
  },
  {
    slug: "ito",
    type: "kinship_term",
    title: "Ito",
    summary:
      "Istilah sapaan kekerabatan Batak Toba yang sumber pilot dokumentasikan untuk saudara lawan jenis.",
    sourceIds: ["peranan-umpasa-1986"],
    relatedSlugs: ["dalihan-na-tolu", "toba"],
    editorialNote: "Pemakaian nyata perlu mempertimbangkan posisi dan konteks martutur.",
  },
  {
    slug: "senina",
    type: "kinship_term",
    title: "Senina",
    summary:
      "Role kekerabatan Karo yang dalam dokumentasi pilot terkait kelompok satu merga dalam struktur Rakut Sitelu.",
    sourceIds: ["permukiman-karo"],
    relatedSlugs: ["rakut-sitelu", "karo"],
    editorialNote: "Role sosial-kekerabatan tidak sama dengan bukti kedekatan genealogis individual.",
  },
  {
    slug: "kalimbubu",
    type: "kinship_term",
    title: "Kalimbubu",
    summary:
      "Role pihak keluarga pemberi istri dalam dokumentasi Rakut Sitelu Karo.",
    sourceIds: ["permukiman-karo"],
    relatedSlugs: ["rakut-sitelu", "karo"],
    editorialNote: "Penentuan terhadap individu nyata memerlukan konteks keluarga dan ertutur.",
  },
  {
    slug: "anak-beru",
    type: "kinship_term",
    title: "Anak Beru",
    summary:
      "Role pihak keluarga pengambil istri dalam dokumentasi Rakut Sitelu Karo.",
    sourceIds: ["permukiman-karo"],
    relatedSlugs: ["rakut-sitelu", "karo"],
    editorialNote: "Penentuan terhadap individu nyata memerlukan konteks keluarga dan ertutur.",
  },

];

export const culturalGroups = pilotEntities.filter(
  (entity) => entity.type === "cultural_group",
);

export const pilotClans = pilotEntities.filter(
  (entity) => entity.type === "clan",
);

export function getPilotEntity(slug: string) {
  return pilotEntities.find((entity) => entity.slug === slug);
}

export function getPilotSource(id: string) {
  return pilotSources.find((source) => source.id === id);
}
