-- Phase 1 pilot seed. It intentionally avoids detailed genealogical claims.

insert into public.sources
  (id, title, publisher, year, url, type, level, description, status)
values
  ('10000000-0000-0000-0000-000000000001',
   'Mengulik Data Suku di Indonesia',
   'Badan Pusat Statistik', 2015,
   'https://sumbawabaratkab.bps.go.id/id/news/2015/09/18/12/mengulik-data-suku-di-indonesia.html',
   'institutional', 'B',
   'Entry point institusional untuk klasifikasi data suku dan konteks analisis.',
   'published'),
  ('10000000-0000-0000-0000-000000000002',
   'Bahasa Batak — Peta Bahasa',
   'Badan Pengembangan dan Pembinaan Bahasa', null,
   'https://labbineka.kemendikdasmen.go.id/laman/bahasarinci/8/batak',
   'institutional', 'B',
   'Entry point untuk variasi bahasa/dialek Batak.',
   'published'),
  ('10000000-0000-0000-0000-000000000003',
   'Penetapan Warisan Budaya Takbenda Aceh dan Sumut untuk Indonesia',
   'Kementerian Pendidikan dan Kebudayaan', null,
   'https://kebudayaan.kemdikbud.go.id/bpnbaceh/penetapan-warisan-budaya-takbenda-aceh-dan-sumut-untuk-indonesia/',
   'institutional', 'B',
   'Entry point dokumentasi warisan budaya takbenda Sumatera Utara.',
   'published'),
  ('10000000-0000-0000-0000-000000000004',
   'Digitalisasi Naskah Kuno Batak',
   'Perpustakaan Nasional Republik Indonesia', 2026,
   'https://www.perpusnas.go.id/berita/melalui-digitalisasi-naskah-kuno-batak-perpusnas-dorong-kolaborasi-lintas-negara-dan-keilmuan',
   'archive', 'B',
   'Entry point untuk manuskrip Batak dan sumber primer.',
   'published')
on conflict (id) do nothing;

insert into public.entities (id, slug, type, title, summary, status)
values
  ('20000000-0000-0000-0000-000000000001','toba','cultural_group','Toba','Hub pengetahuan pilot untuk konten Toba.','published'),
  ('20000000-0000-0000-0000-000000000002','karo','cultural_group','Karo','Hub pengetahuan pilot untuk konten Karo.','published'),
  ('20000000-0000-0000-0000-000000000003','simalungun','cultural_group','Simalungun','Hub pengetahuan pilot untuk konten Simalungun.','published'),
  ('20000000-0000-0000-0000-000000000004','pakpak-dairi','cultural_group','Pakpak / Dairi','Hub pengetahuan pilot dengan ruang variasi penamaan.','published'),
  ('20000000-0000-0000-0000-000000000005','angkola','cultural_group','Angkola','Hub pengetahuan pilot untuk konten Angkola.','published'),
  ('20000000-0000-0000-0000-000000000006','mandailing','cultural_group','Mandailing','Hub pengetahuan pilot untuk konten Mandailing.','published'),

  ('30000000-0000-0000-0000-000000000001','munthe','clan','Munthe','Profil marga pilot; detail genealogis belum dipublikasikan.','published'),
  ('30000000-0000-0000-0000-000000000002','simanjuntak','clan','Simanjuntak','Entri marga pilot.','published'),
  ('30000000-0000-0000-0000-000000000003','siregar','clan','Siregar','Entri marga pilot.','published'),
  ('30000000-0000-0000-0000-000000000004','harahap','clan','Harahap','Entri marga pilot.','published'),
  ('30000000-0000-0000-0000-000000000005','ginting','clan','Ginting','Entri merga pilot.','published'),
  ('30000000-0000-0000-0000-000000000006','sembiring','clan','Sembiring','Entri merga pilot.','published'),
  ('30000000-0000-0000-0000-000000000007','purba','clan','Purba','Entri marga pilot.','published'),
  ('30000000-0000-0000-0000-000000000008','saragih','clan','Saragih','Entri marga pilot.','published'),
  ('30000000-0000-0000-0000-000000000009','berutu','clan','Berutu','Entri marga pilot.','published'),
  ('30000000-0000-0000-0000-000000000010','lubis','clan','Lubis','Entri marga pilot.','published'),

  ('40000000-0000-0000-0000-000000000001','mangulosi','tradition','Mangulosi','Entri tradisi pilot; detail ritual memerlukan konteks dan review.','published'),
  ('40000000-0000-0000-0000-000000000002','ulos','textile','Ulos','Entri tekstil pilot untuk struktur variasi dan sumber.','published'),
  ('40000000-0000-0000-0000-000000000003','samosir','region','Samosir','Entri wilayah pilot.','published')
on conflict (id) do nothing;

insert into public.cultural_groups (entity_id, preferred_label)
select id, title from public.entities
where type='cultural_group'
on conflict (entity_id) do nothing;

insert into public.clans (entity_id, local_term, editorial_scope_note)
select id,
       case when slug in ('ginting','sembiring') then 'Merga' else 'Marga' end,
       'Phase 1 pilot: genealogical claims require dedicated sources.'
from public.entities
where type='clan'
on conflict (entity_id) do nothing;

insert into public.traditions (entity_id, tradition_type, context_note)
values (
  '40000000-0000-0000-0000-000000000001',
  'ceremonial',
  'Do not publish universal ritual instructions without community context.'
)
on conflict (entity_id) do nothing;

insert into public.regions (entity_id, region_type)
values ('40000000-0000-0000-0000-000000000003','geographic')
on conflict (entity_id) do nothing;

insert into public.entity_aliases (entity_id, alias, note)
values ('30000000-0000-0000-0000-000000000001','Munte','Ejaan alternatif untuk pengujian search; perlu verifikasi konteks penggunaan.')
on conflict (entity_id, alias) do nothing;

-- Phase 2 seed: source-aware interactive culture features.
insert into public.sources (id,title,creator,publisher,year,url,type,level,description,status)
values
  ('10000000-0000-0000-0000-000000000005','Penetapan Warisan Budaya Takbenda Indonesia 2014',null,'Direktorat Warisan dan Diplomasi Budaya',2014,'https://kebudayaan.kemdikbud.go.id/ditwdb/penetapan-warisan-budaya-takbenda-indonesia-2014/','institutional','B','Daftar penetapan WBTB 2014 untuk provenance konten budaya Sumatera Utara.','published'),
  ('10000000-0000-0000-0000-000000000006','Kamus Bahasa Simalungun-Indonesia: ed.2','Zufri Hidayat dkk.','Badan Pengembangan dan Pembinaan Bahasa',2016,'https://repositori.kemendikdasmen.go.id/16214/','institutional','B','Sumber leksikografi Simalungun untuk dictionary Phase 2.','published'),
  ('10000000-0000-0000-0000-000000000007','Kamus Pelajar Bergambar Toba-Indonesia','Sriasrianti dkk.','Balai Bahasa Provinsi Sumatera Utara',2021,'https://repositori.kemendikdasmen.go.id/34717/','institutional','B','Sumber leksikografi Toba untuk perluasan dictionary berikutnya.','published'),
  ('10000000-0000-0000-0000-000000000008','Mari Mengenal Batak Toba','Ketut Wiradnyana','Balai Arkeologi Sumatera Utara',2020,'https://repositori.kemendikdasmen.go.id/19350/','institutional','B','Pengantar arkeologi dan budaya kawasan Danau Toba/Samosir.','published')
on conflict (id) do nothing;

insert into public.entities (id,slug,type,title,summary,status)
values
 ('50000000-0000-0000-0000-000000000001','bahasa-toba','language_variety','Bahasa Toba','Halaman bahasa untuk sumber linguistik, dictionary, dan hubungan wilayah tutur.','published'),
 ('50000000-0000-0000-0000-000000000002','bahasa-simalungun','language_variety','Bahasa Simalungun','Fondasi bahasa Simalungun untuk dictionary dan sumber leksikografi.','published'),
 ('50000000-0000-0000-0000-000000000003','bahasa-karo','language_variety','Bahasa Karo','Fondasi bahasa Karo untuk sumber linguistik dan dictionary terverifikasi.','published'),
 ('50000000-0000-0000-0000-000000000004','bahasa-pakpak-dairi','language_variety','Bahasa Pakpak / Dairi','Fondasi bahasa Pakpak/Dairi dengan ruang bagi variasi klasifikasi sumber.','published'),
 ('50000000-0000-0000-0000-000000000005','bahasa-mandailing','language_variety','Bahasa Mandailing','Fondasi bahasa Mandailing untuk sumber dan dictionary terverifikasi.','published'),
 ('50000000-0000-0000-0000-000000000006','merdang-merdem','tradition','Merdang-Merdem','Warisan budaya Sumatera Utara yang tercatat pada Penetapan WBTB Indonesia 2014.','published'),
 ('50000000-0000-0000-0000-000000000007','huda-huda','performance','Huda-Huda','Seni tradisi Sumatera Utara yang tercatat pada Penetapan WBTB Indonesia 2014.','published')
on conflict (id) do nothing;

insert into public.language_varieties(entity_id,classification_note)
values
 ('50000000-0000-0000-0000-000000000001','Bahasa dan kelompok budaya dipisahkan dalam model data.'),
 ('50000000-0000-0000-0000-000000000002','Bahasa dan kelompok budaya dipisahkan dalam model data.'),
 ('50000000-0000-0000-0000-000000000003','Bahasa dan kelompok budaya dipisahkan dalam model data.'),
 ('50000000-0000-0000-0000-000000000004','Bahasa dan kelompok budaya dipisahkan dalam model data.'),
 ('50000000-0000-0000-0000-000000000005','Bahasa dan kelompok budaya dipisahkan dalam model data.')
on conflict(entity_id) do nothing;

insert into public.traditions(entity_id,tradition_type,context_note)
values ('50000000-0000-0000-0000-000000000006','ritual/festival','Detail praktik memerlukan sumber khusus dan konteks komunitas.')
on conflict(entity_id) do nothing;

insert into public.entity_sources(entity_id,source_id,note)
values
 ('20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000002','Bahasa/varietas sebagai konteks, bukan identitas tunggal.'),
 ('20000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000002','Bahasa/varietas sebagai konteks.'),
 ('20000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000002','Bahasa/varietas sebagai konteks.'),
 ('20000000-0000-0000-0000-000000000004','10000000-0000-0000-0000-000000000002','Bahasa/varietas sebagai konteks.'),
 ('50000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000007','Kamus Toba source registry.'),
 ('50000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000006','Kamus Simalungun source registry.'),
 ('50000000-0000-0000-0000-000000000006','10000000-0000-0000-0000-000000000005','WBTB registry reference.'),
 ('50000000-0000-0000-0000-000000000007','10000000-0000-0000-0000-000000000005','WBTB registry reference.'),
 ('40000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000005','Ulos Batak Toba listed in WBTB 2014.')
on conflict do nothing;

insert into public.map_locations(id,entity_id,latitude,longitude,precision,note,status)
values
 ('60000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001',2.34,99.07,'representative','Titik navigasi representatif di kawasan Danau Toba; bukan batas budaya.','published'),
 ('60000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000002',3.10,98.49,'representative','Titik navigasi representatif di sekitar dataran tinggi Karo; bukan batas budaya.','published'),
 ('60000000-0000-0000-0000-000000000003','20000000-0000-0000-0000-000000000003',2.96,99.06,'representative','Titik navigasi representatif untuk Simalungun; bukan batas budaya.','published'),
 ('60000000-0000-0000-0000-000000000004','20000000-0000-0000-0000-000000000004',2.75,98.31,'representative','Titik navigasi representatif di sekitar Dairi; bukan batas budaya.','published'),
 ('60000000-0000-0000-0000-000000000005','20000000-0000-0000-0000-000000000005',1.39,99.27,'representative','Titik navigasi representatif di kawasan Tapanuli Selatan/Padangsidimpuan.','published'),
 ('60000000-0000-0000-0000-000000000006','20000000-0000-0000-0000-000000000006',0.86,99.56,'representative','Titik navigasi representatif di sekitar Mandailing Natal.','published'),
 ('60000000-0000-0000-0000-000000000007','40000000-0000-0000-0000-000000000003',2.58,98.82,'place','Titik referensi wilayah Samosir.','published')
on conflict(id) do nothing;

insert into public.dictionary_entries(id,language_entity_id,headword,definition_id,part_of_speech,status)
values
 ('70000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000002','toal','bijak','adjektiva','published'),
 ('70000000-0000-0000-0000-000000000002','50000000-0000-0000-0000-000000000002','tobal','tebal','adjektiva','published'),
 ('70000000-0000-0000-0000-000000000003','50000000-0000-0000-0000-000000000002','tobak','tikam','verba','published')
on conflict(id) do nothing;

insert into public.dictionary_entry_sources(dictionary_entry_id,source_id,note)
values
 ('70000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000006','Kamus Simalungun–Indonesia edisi kedua.'),
 ('70000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000006','Kamus Simalungun–Indonesia edisi kedua.'),
 ('70000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000006','Kamus Simalungun–Indonesia edisi kedua.')
on conflict do nothing;

insert into public.tradition_timeline_steps(id,tradition_entity_id,position,title,description,step_type,variation_note,status)
values
 ('80000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000001',1,'Tentukan konteks adat','Editor harus menentukan komunitas, jenis acara, wilayah, dan sumber sebelum urutan praktik ditampilkan.','context',null,'published'),
 ('80000000-0000-0000-0000-000000000002','40000000-0000-0000-0000-000000000001',2,'Hubungkan tahapan dengan sumber','Setiap tahapan praktik adat harus mempunyai provenance; perbedaan urutan dicatat sebagai variasi.','preparation',null,'published'),
 ('80000000-0000-0000-0000-000000000003','40000000-0000-0000-0000-000000000001',3,'Tampilkan variasi secara eksplisit','Jika praktik berbeda berdasarkan konteks keluarga atau wilayah, timeline menampilkan catatan variasi.','variation','Kerangka editorial sampai urutan ritual spesifik selesai ditinjau.','published')
on conflict(id) do nothing;

insert into public.media_assets(id,entity_id,storage_path,title,media_type,external_url,alt_text,caption,rights_holder,license,rights_status,source_id,usage_note,status)
values
 ('90000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000002',null,'Ulos Batak Toba — record media placeholder','image','https://kebudayaan.kemdikbud.go.id/ditwdb/penetapan-warisan-budaya-takbenda-indonesia-2014/','Placeholder metadata untuk aset visual Ulos Batak Toba','Gambar ditahan sampai hak penggunaan aset individual jelas.','Belum diverifikasi','Belum diverifikasi','metadata_only','10000000-0000-0000-0000-000000000005','Jangan embed/copy aset tanpa verifikasi hak.','published'),
 ('90000000-0000-0000-0000-000000000002','50000000-0000-0000-0000-000000000002',null,'Kamus Bahasa Simalungun–Indonesia','document','https://repositori.kemendikdasmen.go.id/16214/','Record dokumen Kamus Bahasa Simalungun–Indonesia','Referensi bahasa untuk contoh dictionary Phase 2.','Badan Pengembangan dan Pembinaan Bahasa','CC BY-NC 4.0 (sesuai metadata repositori)','licensed','10000000-0000-0000-0000-000000000006','Jangan merepublikasi isi kamus secara massal.','published')
on conflict(id) do nothing;

-- Additional verified Phase 2 content records.
insert into public.sources (id,title,creator,publisher,year,url,type,level,description,status)
values
 ('10000000-0000-0000-0000-000000000009','Merdang Merdem: Kerja Tahunan Suku Karo',null,'Balai Pelestarian Nilai Budaya Aceh',2017,'https://kebudayaan.kemdikbud.go.id/bpnbaceh/merdang-merdem-kerja-tahunan-suku-karo/','institutional','B','Dokumentasi institusional mengenai konteks dan rangkaian hari Merdang Merdem/Kerja Tahun.','published'),
 ('10000000-0000-0000-0000-000000000010','Kamus Bahasa Karo - Indonesia','Ahmad Samin Siregar dkk.','Balai Pustaka / Pusat Bahasa',2001,'https://repositori.kemendikdasmen.go.id/1967/','institutional','B','Sumber leksikografi Karo–Indonesia untuk contoh dictionary Phase 2.','published')
on conflict(id) do nothing;

insert into public.entity_sources(entity_id,source_id,note)
values
 ('50000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000010','Kamus Karo source registry.'),
 ('50000000-0000-0000-0000-000000000006','10000000-0000-0000-0000-000000000009','Dokumentasi rangkaian Merdang Merdem.')
on conflict do nothing;

insert into public.dictionary_entries(id,language_entity_id,headword,definition_id,part_of_speech,usage_note,status)
values
 ('70000000-0000-0000-0000-000000000004','50000000-0000-0000-0000-000000000003','merdang','menanam padi','verba',null,'published'),
 ('70000000-0000-0000-0000-000000000005','50000000-0000-0000-0000-000000000003','merga','marga','nomina','Kamus mencatat lebih dari satu sense; entri ini menggunakan sense yang relevan dengan marga.','published')
on conflict(id) do nothing;

insert into public.dictionary_entry_sources(dictionary_entry_id,source_id,locator,note)
values
 ('70000000-0000-0000-0000-000000000004','10000000-0000-0000-0000-000000000010','entry: merdang','Kamus Bahasa Karo–Indonesia 2001.'),
 ('70000000-0000-0000-0000-000000000005','10000000-0000-0000-0000-000000000010','entry: merga','Sense marga; dictionary also records another sense.')
on conflict do nothing;

insert into public.tradition_timeline_steps(id,tradition_entity_id,position,title,description,step_type,variation_note,status)
values
 ('81000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000006',1,'Cikor-kor','Hari awal persiapan; dokumentasi BPNB mencatat kegiatan mencari kor-kor di ladang sebagai bagian dari hidangan hari pertama.','preparation',null,'published'),
 ('81000000-0000-0000-0000-000000000002','50000000-0000-0000-0000-000000000006',2,'Cikurung','Hari kedua dalam rangkaian yang didokumentasikan, berkaitan dengan pencarian kurung di area ladang atau sawah.','preparation',null,'published'),
 ('81000000-0000-0000-0000-000000000003','50000000-0000-0000-0000-000000000006',3,'Ndurung','Hari ketiga didokumentasikan sebagai waktu mencari ikan di sawah atau sungai untuk kebutuhan hidangan bersama.','preparation',null,'published'),
 ('81000000-0000-0000-0000-000000000004','50000000-0000-0000-0000-000000000006',4,'Mantem / Motong','Sehari menjelang puncak, dokumentasi sumber mencatat persiapan lauk melalui penyembelihan hewan sesuai konteks komunitas.','preparation',null,'published'),
 ('81000000-0000-0000-0000-000000000005','50000000-0000-0000-0000-000000000006',5,'Matana','Hari puncak dalam versi yang didokumentasikan BPNB, ditandai kunjungan kerabat, jamuan, dan perayaan bersama.','core',null,'published'),
 ('81000000-0000-0000-0000-000000000006','50000000-0000-0000-0000-000000000006',6,'Nimpa','Hari berikutnya didokumentasikan dengan pembuatan cimpa; sumber juga mencatat bahwa di tempat lain dapat diganti dengan ngerires.','variation','Praktik dan penamaan dapat berbeda antarwilayah Karo.','published'),
 ('81000000-0000-0000-0000-000000000007','50000000-0000-0000-0000-000000000006',7,'Rebu','Hari penutup dalam rangkaian yang didokumentasikan, diposisikan sebagai masa tenang setelah hari-hari perayaan.','closing',null,'published')
on conflict(id) do nothing;

insert into public.timeline_step_sources(timeline_step_id,source_id,locator,note)
select id,'10000000-0000-0000-0000-000000000009','section: seven-day sequence','BPNB Aceh 2017 article'
from public.tradition_timeline_steps
where id::text like '81000000-0000-0000-0000-%'
on conflict do nothing;

-- Phase 3 seed: genealogy/kinship. Real genealogy remains unpublished until independently sourced.
insert into public.sources (id,title,publisher,year,url,type,level,description,status)
values
 ('10000000-0000-0000-0000-000000000011','Tata Kelakuan di Lingkungan Pergaulan Keluarga dan Masyarakat Setempat Daerah Sumatera Utara','Kementerian Pendidikan dan Kebudayaan',null,'https://repositori.kemendikdasmen.go.id/30261/1/TATA%20KELAKUAN%20DI%20LINGKUNGAN%20PERGAULAN%20KELUARGA%20DAN%20MASYARAKAT%20SETEMPAT%20DAERAH%20SUMUT.pdf','institutional','B','Dokumentasi institusional mengenai partuturan Batak Toba, Dalihan Na Tolu, dan istilah sapaan.','published'),
 ('10000000-0000-0000-0000-000000000012','Peranan Umpasa Dalam Masyarakat Batak Toba','Pusat Pembinaan dan Pengembangan Bahasa',1986,'https://repositori.kemendikdasmen.go.id/1734/1/Peranan%20Umpas%20Dalam%20Masyarakat%20Batak%20Toba%20%281986%29.pdf','institutional','B','Dokumentasi martutur/partuturan dan contoh istilah kekerabatan Batak Toba.','published'),
 ('10000000-0000-0000-0000-000000000013','Mengenal Permukiman Masyarakat Batak Karo Provinsi Sumatera Utara','Kementerian Pendidikan dan Kebudayaan',null,'https://repositori.kemendikdasmen.go.id/28806/1/MENGENAL%20PERMUKIMAN%20MASYARAKAT%20BATAK%20KARO%20PROVINSI%20SUMATERA%20UTARA.pdf','institutional','B','Dokumentasi Rakut Sitelu, ertutur, kalimbubu, anak beru, dan senina pada masyarakat Karo.','published')
on conflict(id) do nothing;

insert into public.entities(id,slug,type,title,summary,status)
values
 ('a2000000-0000-0000-0000-000000000001','dalihan-na-tolu','kinship_system','Dalihan Na Tolu','Sistem kekerabatan yang menjadi konteks penting dalam dokumentasi partuturan Batak Toba.','published'),
 ('a2000000-0000-0000-0000-000000000002','rakut-sitelu','kinship_system','Rakut Sitelu','Struktur kekerabatan Karo yang mendokumentasikan kalimbubu, anak beru, dan senina.','published'),
 ('a2000000-0000-0000-0000-000000000003','tulang','kinship_term','Tulang','Istilah kekerabatan Batak Toba yang pada sumber pilot dicontohkan untuk paman dari pihak ibu.','published'),
 ('a2000000-0000-0000-0000-000000000004','ito','kinship_term','Ito','Istilah sapaan Batak Toba yang pada sumber pilot dicontohkan untuk saudara lawan jenis.','published'),
 ('a2000000-0000-0000-0000-000000000005','senina','kinship_term','Senina','Role kekerabatan Karo dalam konteks Rakut Sitelu.','published'),
 ('a2000000-0000-0000-0000-000000000006','kalimbubu','kinship_term','Kalimbubu','Role pihak keluarga pemberi istri dalam dokumentasi Rakut Sitelu.','published'),
 ('a2000000-0000-0000-0000-000000000007','anak-beru','kinship_term','Anak Beru','Role pihak keluarga pengambil istri dalam dokumentasi Rakut Sitelu.','published')
on conflict(id) do nothing;

insert into public.kinship_systems(entity_id,context_note)
values
 ('a2000000-0000-0000-0000-000000000001','Toba context; do not generalize to every Batak community.'),
 ('a2000000-0000-0000-0000-000000000002','Karo context; role determination for people requires ertutur/family context.')
on conflict(entity_id) do nothing;

insert into public.kinship_terms(entity_id,term,usage_note)
values
 ('a2000000-0000-0000-0000-000000000003','tulang','Use only with documented kinship context.'),
 ('a2000000-0000-0000-0000-000000000004','ito','Use only with documented kinship context.'),
 ('a2000000-0000-0000-0000-000000000005','senina','Karo kinship role; not a proof of individual genealogy.'),
 ('a2000000-0000-0000-0000-000000000006','kalimbubu','Karo kinship role; requires family context.'),
 ('a2000000-0000-0000-0000-000000000007','anak beru','Karo kinship role; requires family context.')
on conflict(entity_id) do nothing;

insert into public.entity_sources(entity_id,source_id,note)
values
 ('a2000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000011','Partuturan/Dalihan Na Tolu context.'),
 ('a2000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000013','Rakut Sitelu context.'),
 ('a2000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000011','Kinship term example.'),
 ('a2000000-0000-0000-0000-000000000004','10000000-0000-0000-0000-000000000012','Kinship term example.'),
 ('a2000000-0000-0000-0000-000000000005','10000000-0000-0000-0000-000000000013','Karo kinship role.'),
 ('a2000000-0000-0000-0000-000000000006','10000000-0000-0000-0000-000000000013','Karo kinship role.'),
 ('a2000000-0000-0000-0000-000000000007','10000000-0000-0000-0000-000000000013','Karo kinship role.')
on conflict do nothing;

insert into public.relationships(id,source_entity_id,target_entity_id,relationship_type,status,context_note)
values
 ('b2000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002','a2000000-0000-0000-0000-000000000002','uses_kinship_system','supported','Rakut Sitelu documented in Karo context.'),
 ('b2000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000001','a2000000-0000-0000-0000-000000000001','uses_kinship_system','supported','Dalihan Na Tolu documented in Toba partuturan context.'),
 ('b2000000-0000-0000-0000-000000000003','a2000000-0000-0000-0000-000000000001','a2000000-0000-0000-0000-000000000003','contains_kinship_term','supported','Term documented within Toba partuturan context.'),
 ('b2000000-0000-0000-0000-000000000004','a2000000-0000-0000-0000-000000000002','a2000000-0000-0000-0000-000000000005','contains_role','supported','Senina is part of the documented Rakut Sitelu relationship.'),
 ('b2000000-0000-0000-0000-000000000005','a2000000-0000-0000-0000-000000000002','a2000000-0000-0000-0000-000000000006','contains_role','supported','Kalimbubu is part of the documented Rakut Sitelu relationship.'),
 ('b2000000-0000-0000-0000-000000000006','a2000000-0000-0000-0000-000000000002','a2000000-0000-0000-0000-000000000007','contains_role','supported','Anak beru is part of the documented Rakut Sitelu relationship.')
on conflict(id) do nothing;

insert into public.relationship_sources(relationship_id,source_id,locator,note)
values
 ('b2000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000013','section: Rakut Sitelu','Karo context.'),
 ('b2000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000011','section: partuturan','Toba context.'),
 ('b2000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000011','section: partuturan','Toba context.'),
 ('b2000000-0000-0000-0000-000000000004','10000000-0000-0000-0000-000000000013','section: Rakut Sitelu','Karo context.'),
 ('b2000000-0000-0000-0000-000000000005','10000000-0000-0000-0000-000000000013','section: Rakut Sitelu','Karo context.'),
 ('b2000000-0000-0000-0000-000000000006','10000000-0000-0000-0000-000000000013','section: Rakut Sitelu','Karo context.')
on conflict do nothing;

-- Deliberately fictional genealogy dataset: demonstrates system behavior without asserting real lineage.
insert into public.genealogy_datasets(id,slug,title,description,visibility,methodology_note,is_demo,status)
values ('c2000000-0000-0000-0000-000000000001','demo-metodologi','Tarombo demo metodologi','Dataset fiktif untuk menguji visualisasi, provenance, privasi, dan inferensi.','public','Semua nama fiktif; dataset ini bukan tarombo marga/keluarga nyata.',true,'published')
on conflict(id) do nothing;

insert into public.genealogy_nodes(id,dataset_id,label,generation,gender,living_status,privacy_level,status)
values
 ('d2000000-0000-0000-0000-000000000001','c2000000-0000-0000-0000-000000000001','Generasi I — A',0,'male','deceased','public','published'),
 ('d2000000-0000-0000-0000-000000000002','c2000000-0000-0000-0000-000000000001','Generasi II — B',1,'male','deceased','public','published'),
 ('d2000000-0000-0000-0000-000000000003','c2000000-0000-0000-0000-000000000001','Generasi II — C',1,'female','deceased','public','published'),
 ('d2000000-0000-0000-0000-000000000004','c2000000-0000-0000-0000-000000000001','Generasi III — D',2,'female','unknown','public','published'),
 ('d2000000-0000-0000-0000-000000000005','c2000000-0000-0000-0000-000000000001','Pasangan B — E',1,'female','deceased','public','published')
on conflict(id) do nothing;

insert into public.genealogy_edges(id,dataset_id,source_node_id,target_node_id,relation,status,context_note)
values
 ('e2000000-0000-0000-0000-000000000001','c2000000-0000-0000-0000-000000000001','d2000000-0000-0000-0000-000000000001','d2000000-0000-0000-0000-000000000002','parent','supported','Demo-only edge; not historical evidence.'),
 ('e2000000-0000-0000-0000-000000000002','c2000000-0000-0000-0000-000000000001','d2000000-0000-0000-0000-000000000001','d2000000-0000-0000-0000-000000000003','parent','supported','Demo-only edge; not historical evidence.'),
 ('e2000000-0000-0000-0000-000000000003','c2000000-0000-0000-0000-000000000001','d2000000-0000-0000-0000-000000000002','d2000000-0000-0000-0000-000000000004','parent','supported','Demo-only edge; not historical evidence.'),
 ('e2000000-0000-0000-0000-000000000004','c2000000-0000-0000-0000-000000000001','d2000000-0000-0000-0000-000000000002','d2000000-0000-0000-0000-000000000005','spouse','supported','Demo-only edge; not historical evidence.')
on conflict(id) do nothing;

insert into public.kinship_rules(id,cultural_context,relation_code,relation_label_id,term,explanation,caution,status,publication_status)
values
 ('f2000000-0000-0000-0000-000000000001','toba','mothers_brother','saudara laki-laki ibu','tulang','Sumber pilot mendokumentasikan tulang sebagai sapaan untuk paman dari pihak ibu.','Pemakaian nyata tetap bergantung pada posisi generasi, perkawinan, dan konteks martutur.','supported','published'),
 ('f2000000-0000-0000-0000-000000000002','toba','opposite_sex_sibling','saudara kandung lawan jenis','ito','Sumber pilot mendokumentasikan ito sebagai sapaan untuk saudara lawan jenis.','Rule pilot tidak mencakup keseluruhan partuturan.','supported','published'),
 ('f2000000-0000-0000-0000-000000000003','karo','same_merga_social_role','kelompok satu merga dalam konteks Rakut Sitelu','senina','Dokumentasi Karo menjelaskan senina sebagai kelompok satu merga dalam struktur Rakut Sitelu.','Bukan bukti kedekatan genealogis individual.','supported','published'),
 ('f2000000-0000-0000-0000-000000000004','karo','wife_giver_group','pihak keluarga pemberi istri','kalimbubu','Dokumentasi Rakut Sitelu menjelaskan kalimbubu sebagai pihak pemberi istri.','Penentuan terhadap individu memerlukan ertutur dan data keluarga.','supported','published'),
 ('f2000000-0000-0000-0000-000000000005','karo','wife_taker_group','pihak keluarga pengambil istri','anak beru','Dokumentasi Rakut Sitelu menjelaskan anak beru sebagai pihak pengambil istri.','Penentuan terhadap individu memerlukan ertutur dan data keluarga.','supported','published')
on conflict(id) do nothing;

insert into public.kinship_rule_sources(rule_id,source_id,locator,note)
values
 ('f2000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000011','section: partuturan','Toba pilot rule.'),
 ('f2000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000012','kinship term examples','Toba pilot rule.'),
 ('f2000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000013','section: Rakut Sitelu','Karo pilot rule.'),
 ('f2000000-0000-0000-0000-000000000004','10000000-0000-0000-0000-000000000013','section: Rakut Sitelu','Karo pilot rule.'),
 ('f2000000-0000-0000-0000-000000000005','10000000-0000-0000-0000-000000000013','section: Rakut Sitelu','Karo pilot rule.')
on conflict do nothing;
