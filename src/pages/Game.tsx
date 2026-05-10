import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, RotateCcw, Heart, Star, Sparkles, 
  MessageSquare, ShieldAlert, Users, Info, 
  ChevronRight, ChevronLeft, BrainCircuit, Flag, Lock, Home, BookOpen, Globe
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { Link } from 'react-router-dom';

// --- 1. DAFTAR MENU CERITA ---
const AVAILABLE_STORIES = [
  { id: 's1', title: "Krisis Festival Seni", env: "Sekolah", icon: <BookOpen />, desc: "Harmoni OSIS terancam karena ego sektoral antar ekstrakurikuler." },
  { id: 's2', title: "Sengketa Warisan", env: "Keluarga", icon: <Home />, desc: "Keluarga besar bersitegang karena pembagian harta warisan kakek." },
  { id: 's3', title: "Hoaks Pemilu Desa", env: "Masyarakat", icon: <Globe />, desc: "Grup WA warga memanas akibat penyebaran disinformasi provokatif." },
  { id: 's4', title: "Anak Emas Guru", env: "Sekolah", icon: <BookOpen />, desc: "Kecemburuan sosial di kelas karena perlakuan tidak adil dari wali kelas." },
  { id: 's5', title: "Pabrik vs Lingkungan", env: "Masyarakat", icon: <Globe />, desc: "Konflik antara buruh pabrik dan aktivis lingkungan desa." }
];

// --- 2. DATA 20 SOAL UNTUK SETIAP CERITA ---
// (Tahap: 1-5 Orientasi, 6-15 Konflik, 16-20 Resolusi)

const S1_DATA = [
  { text: "Sekolahmu akan mengadakan Festival Seni. Tim teater dan band mulai berebut jam latihan di aula.", concept: "Interaksi Sosial", choices: [{ text: "Bebaskan mereka", karma: -5 }, { text: "Ajak diskusi bersama", karma: 10 }] },
  { text: "Ketua band merasa ekskulnya lebih penting karena mengundang banyak penonton.", concept: "Egosentrisme", choices: [{ text: "Tegur keras di depan umum", karma: -10 }, { text: "Jelaskan peran penting keduanya", karma: 10 }] },
  { text: "Kamu mengusulkan jadwal bergilir, tapi alat band berat untuk dipindah.", concept: "Akomodasi", choices: [{ text: "Paksa mereka memindahkannya", karma: -5 }, { text: "Beri area simpan khusus", karma: 10 }] },
  { text: "Tim teater melebihi jam latihannya selama 30 menit di hari pertama.", concept: "Pelanggaran Norma", choices: [{ text: "Beri peringatan tegas", karma: 10 }, { text: "Biarkan karena sedang fokus", karma: -10 }] },
  { text: "Anggota band marah dan menuduhmu pilih kasih pada teater.", concept: "Prasangka", choices: [{ text: "Minta maaf & perbaiki sistem", karma: 10 }, { text: "Marah balik", karma: -50, isBad: true }] },
  { text: "Kabel sound system putus. Band langsung menuduh teater yang menyabotase.", concept: "Konflik Manifes", choices: [{ text: "Ajak cek CCTV dengan tenang", karma: 15 }, { text: "Bela teater tanpa bukti", karma: -10 }] },
  { text: "CCTV rusak. Kedua kubu saling sindir di media sosial sekolah.", concept: "Polarisasi", choices: [{ text: "Ikut membalas di medsos", karma: -20 }, { text: "Larang keras sindiran medsos", karma: 10 }] },
  { text: "Muncul rumor Kepala Sekolah akan membatalkan festival akibat ribut-ribut ini.", concept: "Disinformasi", choices: [{ text: "Biarkan agar mereka takut", karma: -10 }, { text: "Klarifikasi rumor tersebut", karma: 10 }] },
  { text: "Pembina OSIS memanggil dan menuntutmu mendamaikan mereka hari ini juga.", concept: "Tekanan Otoritas", choices: [{ text: "Memohon waktu untuk mediasi", karma: 10 }, { text: "Menyerah dan mundur", karma: -50, isBad: true }] },
  { text: "Saat dimediasi, ketua teater dan band masih saling menyalahkan.", concept: "Etnosentrisme Kelompok", choices: [{ text: "Biarkan berdebat sampai lelah", karma: -5 }, { text: "Jadi penengah yang objektif", karma: 10 }] },
  { text: "Ketua teater menangis merasa ekskulnya selalu dianaktirikan sekolah.", concept: "Inklusi Sosial", choices: [{ text: "Validasi perasaannya", karma: 15 }, { text: "Suruh diam karena cengeng", karma: -20 }] },
  { text: "Ketua band mulai terdiam menyadari arogansinya selama ini.", concept: "Empati", choices: [{ text: "Ajak dia menanggapi dengan baik", karma: 10 }, { text: "Pojokkan ketua band", karma: -10 }] },
  { text: "Ketua band minta maaf, tapi anggotanya di luar masih berteriak marah.", concept: "Tekanan Peer Group", choices: [{ text: "Minta ketua band menenangkan", karma: 10 }, { text: "Marahi anggota di luar", karma: -10 }] },
  { text: "Anggota band menuntut ganti rugi kabel sebelum mau berdamai.", concept: "Keadilan Restoratif", choices: [{ text: "Gunakan dana darurat panitia", karma: 10 }, { text: "Tolak mentah-mentah", karma: -10 }] },
  { text: "Kabel diganti, suasana reda, tapi mereka masih canggung dan kaku.", concept: "Segregasi Emosional", choices: [{ text: "Biarkan saja", karma: 0 }, { text: "Buat ice breaking dadakan", karma: 15 }] },
  { text: "Kamu mengusulkan kolaborasi: Teater musikal dengan iringan band langsung.", concept: "Superordinate Goal", choices: [{ text: "Tawarkan sebagai win-win", karma: 15 }, { text: "Paksa mereka ikut", karma: -10 }] },
  { text: "Mereka setuju untuk mencoba latihan gabungan pertama kali.", concept: "Asimilasi Awal", choices: [{ text: "Tinggalkan mereka sendiri", karma: -5 }, { text: "Pantau latihan dengan ramah", karma: 10 }] },
  { text: "Saat latihan, mereka mulai saling memuji karya satu sama lain.", concept: "Integrasi Sosial", choices: [{ text: "Beri apresiasi terbuka", karma: 10 }, { text: "Diam saja", karma: 0 }] },
  { text: "Festival sukses besar! Penonton takjub melihat kolaborasi tersebut.", concept: "Solidaritas Organik", choices: [{ text: "Ambil semua pujian", karma: -20 }, { text: "Beri panggung untuk mereka", karma: 15 }] },
  { text: "Kedua ekskul berterima kasih atas kepemimpinanmu yang adil.", concept: "Harmoni Sosial", choices: [{ text: "Selesaikan Misi", karma: 0 }] }
];

const S2_DATA = [
  { text: "Keluargamu berkumpul di kampung tangga untuk membaca wasiat kakek.", concept: "Interaksi Keluarga", choices: [{ text: "Sapa semua paman & bibi", karma: 10 }, { text: "Main HP di pojokan", karma: -5 }] },
  { text: "Wasiat dibacakan, namun Paman Tiar merasa pembagian tanah tidak adil.", concept: "Kecemburuan Sosial", choices: [{ text: "Dengarkan keluhannya", karma: 10 }, { text: "Potong omongannya", karma: -10 }] },
  { text: "Bibi Susi membela wasiat kakek dan menyebut Paman Tiar serakah.", concept: "Konflik Terbuka", choices: [{ text: "Ikut memarahi Paman Tiar", karma: -10 }, { text: "Tenangkan Bibi Susi", karma: 10 }] },
  { text: "Paman Tiar mengancam akan membawa masalah ini ke pengadilan.", concept: "Ancaman Koersif", choices: [{ text: "Biarkan dia pergi", karma: -10 }, { text: "Bujuk diselesaikan kekeluargaan", karma: 15 }] },
  { text: "Sertifikat tanah asli tiba-tiba hilang dari lemari kakek.", concept: "Miskomunikasi", choices: [{ text: "Tuduh Paman Tiar mencurinya", karma: -50, isBad: true }, { text: "Ajak semua mencari bersama", karma: 10 }] },
  { text: "Suasana memanas, sepupumu mulai berkelahi di halaman depan.", concept: "Eskalasi Konflik", choices: [{ text: "Pisahkan dengan tegas", karma: 15 }, { text: "Ikut memukul", karma: -20 }] },
  { text: "Grup WA Keluarga dipenuhi sindiran, beberapa anggota keluar grup.", concept: "Polarisasi", choices: [{ text: "Larang keras sindir-menyindir", karma: 10 }, { text: "Ikut keluar grup", karma: -15 }] },
  { text: "Ada rumor bahwa ibumu yang menyembunyikan sertifikat tersebut.", concept: "Disinformasi", choices: [{ text: "Klarifikasi dengan tenang", karma: 10 }, { text: "Marah dan mengamuk", karma: -15 }] },
  { text: "Ayahmu meminta saranmu, apakah harus mengalah atau melawan di pengadilan?", concept: "Role Taking", choices: [{ text: "Sarankan jalur hukum (Lawan)", karma: -10 }, { text: "Sarankan mediasi tetua adat", karma: 15 }] },
  { text: "Tetua adat diundang. Beliau meminta semua menahan ego masing-masing.", concept: "Arbitrase Adat", choices: [{ text: "Hormati dan dengarkan tetua", karma: 10 }, { text: "Interupsi tetua adat", karma: -20 }] },
  { text: "Dalam mediasi, Paman Tiar menangis mengaku ia sedang terlilit hutang besar.", concept: "Empati", choices: [{ text: "Validasi kesulitannya", karma: 15 }, { text: "Ejek dia karena hutang", karma: -50, isBad: true }] },
  { text: "Keluarga akhirnya mengerti alasan di balik sikap emosional Paman Tiar.", concept: "Resolusi Konflik", choices: [{ text: "Ajak urunan membantu paman", karma: 20 }, { text: "Itu urusan paman sendiri", karma: -10 }] },
  { text: "Sertifikat tanah ternyata terselip di dalam buku tua kakek, bukan dicuri.", concept: "Klarifikasi Fakta", choices: [{ text: "Tunjukkan ke semua dengan baik", karma: 10 }, { text: "Ejek mereka yang sempat menuduh", karma: -10 }] },
  { text: "Ibumu dan Paman Tiar akhirnya saling meminta maaf atas tuduhan kemarin.", concept: "Akomodasi", choices: [{ text: "Saksikan dengan haru", karma: 10 }, { text: "Ungkit lagi kesalahan mereka", karma: -15 }] },
  { text: "Tanah dibagi sesuai wasiat, tapi keluarga setuju menyisihkan sedikit untuk Paman.", concept: "Keadilan Restoratif", choices: [{ text: "Dukung keputusan mulia ini", karma: 15 }, { text: "Protes karena tidak sesuai hukum", karma: -10 }] },
  { text: "Kamu mengusulkan makan malam bersama untuk mencairkan suasana kaku.", concept: "Kohesi Sosial", choices: [{ text: "Bantu masak di dapur", karma: 10 }, { text: "Beli makanan instan saja", karma: 0 }] },
  { text: "Sambil makan, tetua adat menceritakan perjuangan kakek membangun rumah itu.", concept: "Transmisi Nilai", choices: [{ text: "Dengarkan dengan saksama", karma: 10 }, { text: "Sibuk main game", karma: -5 }] },
  { text: "Paman Tiar berterima kasih karena keluarga tidak membuangnya saat ia susah.", concept: "Inklusi", choices: [{ text: "Peluk paman sebagai keluarga", karma: 15 }, { text: "Cukup tersenyum", karma: 5 }] },
  { text: "Grup WA keluarga kembali ramai dengan candaan dan doa bersama.", concept: "Integrasi Normatif", choices: [{ text: "Kirim stiker positif", karma: 10 }, { text: "Diam saja", karma: 0 }] },
  { text: "Sengketa selesai, harta terjaga, namun keluarga tetap menjadi yang utama.", concept: "Harmoni Sosial", choices: [{ text: "Selesaikan Misi", karma: 0 }] }
];

const S3_DATA = [
  { text: "Menjelang Pemilu Kepala Desa, suhu politik di desamu mulai memanas.", concept: "Kompetisi Politik", choices: [{ text: "Jaga netralitas di pergaulan", karma: 10 }, { text: "Ikut fanatik dukung satu calon", karma: -10 }] },
  { text: "Ada pamflet gelap menyebarkan fitnah tentang Calon Kades A di pos ronda.", concept: "Propaganda", choices: [{ text: "Cabut dan buang pamflet itu", karma: 15 }, { text: "Sebarkan foto pamflet ke warga", karma: -15 }] },
  { text: "Di Grup WA Desa, pendukung Calon A menuduh pendukung Calon B yang membuat pamflet.", concept: "Prasangka", choices: [{ text: "Ingatkan agar jangan menuduh", karma: 10 }, { text: "Ikut memanasi suasana", karma: -15 }] },
  { text: "Perdebatan WA memburuk, beberapa warga saling ancam akan adu fisik malam ini.", concept: "Eskalasi Konflik", choices: [{ text: "Lapor ke Babinsa / Polisi", karma: 15 }, { text: "Biarkan saja, bukan urusanmu", karma: -10 }] },
  { text: "Kamu berpapasan dengan dua pemuda dari kubu B yang membawa kayu.", concept: "Konflik Manifes", choices: [{ text: "Tegur dan tenangkan mereka", karma: 15 }, { text: "Ikut bawa senjata", karma: -50, isBad: true }] },
  { text: "Polisi datang melerai, namun rasa saling curiga antar tetangga menjadi sangat kental.", concept: "Segregasi Sosial", choices: [{ text: "Sapa tetangga seperti biasa", karma: 10 }, { text: "Ikut bermusuhan dengan tetangga", karma: -20 }] },
  { text: "Warung Bu Siti diboikot oleh kubu A hanya karena ia memilih calon B.", concept: "Eksklusi Sosial", choices: [{ text: "Tetap belanja di warung Bu Siti", karma: 15 }, { text: "Ikut memboikot warungnya", karma: -15 }] },
  { text: "Kades petahana memintamu membuat poster 'Pemilu Damai' untuk dipasang di desa.", concept: "Integrasi Normatif", choices: [{ text: "Buat dengan desain merangkul", karma: 15 }, { text: "Tolak dengan alasan sibuk", karma: -10 }] },
  { text: "Saat menempel poster, seorang bapak mencopotnya karena menganggap itu pencitraan.", concept: "Resistensi", choices: [{ text: "Ajak bapak itu berdialog", karma: 10 }, { text: "Marah dan bentak si bapak", karma: -15 }] },
  { text: "Ternyata bapak itu kecewa karena desanya tidak pernah maju siapapun kadesnya.", concept: "Deprivasi Relatif", choices: [{ text: "Pahami kekecewaannya", karma: 10 }, { text: "Sebut dia pesimis dan bodoh", karma: -50, isBad: true }] },
  { text: "Kamu mengadakan dialog terbuka di balai desa, mengundang kedua calon kades.", concept: "Mediasi Publik", choices: [{ text: "Fasilitasi debat yang santun", karma: 15 }, { text: "Adu domba kedua calon", karma: -20 }] },
  { text: "Dalam dialog, disepakati bahwa pamflet gelap dibuat oleh provokator luar desa.", concept: "Klarifikasi Fakta", choices: [{ text: "Sebarkan kebenaran ini ke warga", karma: 15 }, { text: "Simpan infonya sendiri", karma: -5 }] },
  { text: "Warga menyadari mereka hampir hancur karena diadu domba orang luar.", concept: "Kesadaran Kolektif", choices: [{ text: "Ajak warga bersatu kembali", karma: 15 }, { text: "Ejek warga karena mudah ditipu", karma: -15 }] },
  { text: "Kedua calon Kades bersalaman dan berjanji siapapun yang menang akan membangun desa.", concept: "Kompromi Elite", choices: [{ text: "Tepuk tangan beri dukungan", karma: 10 }, { text: "Soraki mereka pencitraan", karma: -10 }] },
  { text: "Untuk memulihkan suasana, diadakan siskamling gabungan pendukung A dan B.", concept: "Superordinate Goal", choices: [{ text: "Ikut jadwal siskamling", karma: 10 }, { text: "Tolak karena malas begadang", karma: -5 }] },
  { text: "Saat siskamling, warga memakan ubi rebus bersama dan tertawa melupakan politik.", concept: "Kohesi Sosial", choices: [{ text: "Ikut bercanda dan membaur", karma: 10 }, { text: "Main HP sendirian di pos", karma: 0 }] },
  { text: "Hari pencoblosan tiba. Warga antre dengan rapi tanpa ada atribut kampanye.", concept: "Ketertiban Sosial", choices: [{ text: "Bantu arahkan lansia mencoblos", karma: 15 }, { text: "Menyerobot antrean", karma: -20 }] },
  { text: "Calon A menang tipis. Pendukung Calon B legowo dan mengucapkan selamat.", concept: "Toleransi & Sportivitas", choices: [{ text: "Apresiasi kedewasaan politik warga", karma: 10 }, { text: "Provokasi agar B protes", karma: -20 }] },
  { text: "Warung Bu Siti kembali ramai dibeli oleh warga dari semua kubu.", concept: "Reintegrasi Ekonomi", choices: [{ text: "Syukuri kembalinya harmoni", karma: 10 }, { text: "Diam saja", karma: 0 }] },
  { text: "Desa kembali damai. Perbedaan pilihan tidak merusak persaudaraan warga.", concept: "Harmoni Sosial", choices: [{ text: "Selesaikan Misi", karma: 0 }] }
];

const S4_DATA = [
  { text: "Wali kelasmu sangat menyukai Budi karena pintar, selalu memujinya dan mengabaikan siswa lain.", concept: "Favoritisme", choices: [{ text: "Tetap hormati Budi", karma: 10 }, { text: "Mulai benci pada Budi", karma: -10 }] },
  { text: "Saat pembagian kelompok, guru langsung menunjuk Budi sebagai ketua utama tanpa voting.", concept: "Otoriter", choices: [{ text: "Beri usul agar divoting adil", karma: 10 }, { text: "Protes keras dan walk out", karma: -10 }] },
  { text: "Siswa lain merasa dianaktirikan dan mulai membentuk grup obrolan tanpa Budi.", concept: "Eksklusi Sosial", choices: [{ text: "Ikut menjelekkan Budi di grup", karma: -15 }, { text: "Nasihati agar tidak menjauhi Budi", karma: 15 }] },
  { text: "Suatu hari, tas Budi disembunyikan oleh teman sekelas sebagai bentuk protes.", concept: "Bullying", choices: [{ text: "Bantu Budi mencari tasnya", karma: 15 }, { text: "Tertawakan Budi", karma: -50, isBad: true }] },
  { text: "Budi menangis dan merasa bersalah padahal dia tidak minta dianakemaskan.", concept: "Tekanan Mental", choices: [{ text: "Hibur Budi", karma: 10 }, { text: "Suruh Budi pindah sekolah", karma: -15 }] },
  { text: "Kamu memberanikan diri berbicara empat mata dengan wali kelas mengenai hal ini.", concept: "Advokasi Sosial", choices: [{ text: "Bicara sopan dan pakai fakta", karma: 15 }, { text: "Bentak guru tersebut", karma: -20 }] },
  { text: "Awalnya wali kelas marah karena merasa otoritasnya dicampuri siswa.", concept: "Resistensi Otoritas", choices: [{ text: "Minta maaf tapi tetap teguh", karma: 10 }, { text: "Mundur ketakutan", karma: -10 }] },
  { text: "Kamu menjelaskan bahwa pilih kasih merusak kekompakan dan mental belajar kelas.", concept: "Dampak Struktural", choices: [{ text: "Beri contoh potensi siswa lain", karma: 15 }, { text: "Hanya fokus menyalahkan guru", karma: -10 }] },
  { text: "Wali kelas akhirnya merenung dan menyadari kesalahannya dalam mendidik.", concept: "Refleksi Sosial", choices: [{ text: "Beri guru waktu berpikir", karma: 10 }, { text: "Desak guru minta maaf sekarang", karma: -15 }] },
  { text: "Keesokan harinya, wali kelas meminta maaf secara terbuka di depan kelas.", concept: "Keadilan Restoratif", choices: [{ text: "Apresiasi kebesaran hati guru", karma: 15 }, { text: "Soraki guru tersebut", karma: -50, isBad: true }] },
  { text: "Guru juga memberikan apresiasi merata untuk bakat-bakat siswa selain akademik.", concept: "Kesetaraan", choices: [{ text: "Tepuk tangan bangga", karma: 10 }, { text: "Merasa itu belum cukup", karma: -5 }] },
  { text: "Teman-teman sekelas yang menyembunyikan tas Budi akhirnya mengaku dan minta maaf.", concept: "Rekonsiliasi", choices: [{ text: "Fasilitasi permintaan maaf mereka", karma: 15 }, { text: "Adu domba mereka", karma: -20 }] },
  { text: "Budi memaafkan mereka dan mengakui dia juga butuh bantuan teman lain.", concept: "Empati", choices: [{ text: "Rangkul Budi kembali ke circle", karma: 15 }, { text: "Abaikan saja", karma: 0 }] },
  { text: "Kamu mengusulkan belajar kelompok di mana Budi mengajari Matematika, dan Anton mengajari Musik.", concept: "Integrasi Fungsional", choices: [{ text: "Bagi tugas sesuai minat", karma: 15 }, { text: "Biar Budi saja yang mengajar", karma: -10 }] },
  { text: "Kelas menjadi sangat kompak. Tidak ada lagi kubu-kubuan.", concept: "Kohesi Kelompok", choices: [{ text: "Jaga kekompakan ini", karma: 10 }, { text: "Bikin kubu baru", karma: -15 }] },
  { text: "Saat ujian, Budi tidak pelit ilmu dan membantu teman-temannya belajar.", concept: "Solidaritas", choices: [{ text: "Belajar sungguh-sungguh bersamanya", karma: 10 }, { text: "Minta jawaban ujiannya (menyontek)", karma: -20 }] },
  { text: "Nilai rata-rata kelas meningkat drastis, guru sangat bangga pada kerja sama kalian.", concept: "Hasil Kolektif", choices: [{ text: "Rayakan bersama kelas", karma: 10 }, { text: "Pamer ke kelas lain", karma: -5 }] },
  { text: "Wali kelas menjadikan sistem kolaborasi ini sebagai contoh untuk kelas lain.", concept: "Inovasi Sosial", choices: [{ text: "Bantu sosialisasikan ke kelas lain", karma: 15 }, { text: "Tolak berbagi sistem", karma: -10 }] },
  { text: "Grup chat kelas dipenuhi canda tawa dan saling support.", concept: "Interaksi Positif", choices: [{ text: "Kirim pesan penyemangat", karma: 10 }, { text: "Keluar grup", karma: -5 }] },
  { text: "Kecemburuan hancur oleh keadilan, melahirkan kelas yang harmonis.", concept: "Harmoni Sosial", choices: [{ text: "Selesaikan Misi", karma: 0 }] }
];

const S5_DATA = [
  { text: "Pabrik kimia baru beroperasi di desamu. Warga mulai mencium bau menyengat dari sungai.", concept: "Dampak Eksternalitas", choices: [{ text: "Ajak warga periksa sumber bau", karma: 15 }, { text: "Biarkan saja baunya hilang sendiri", karma: -10 }] },
  { text: "Sungai terbukti tercemar. Pemuda desa marah dan bersiap demo merusak pabrik.", concept: "Collective Behavior", choices: [{ text: "Bujuk demo damai, jangan anarkis", karma: 15 }, { text: "Bakar ban dan pimpin pengrusakan", karma: -50, isBad: true }] },
  { text: "Pabrik merespons dengan menyewa preman untuk menjaga gerbang.", concept: "Intimidasi", choices: [{ text: "Tahan warga agar tidak bentrok fisik", karma: 15 }, { text: "Lawan preman dengan batu", karma: -20 }] },
  { text: "Kades mencoba menengahi, tapi manajer pabrik menolak bertemu.", concept: "Jalan Buntu (Deadlock)", choices: [{ text: "Kirim surat resmi via dinas", karma: 15 }, { text: "Maki-maki kades karena lemah", karma: -10 }] },
  { text: "Terjadi perpecahan. Sebagian warga membela pabrik karena keluarga mereka bekerja di sana.", concept: "Konflik Kepentingan", choices: [{ text: "Hargai dilema ekonomi mereka", karma: 10 }, { text: "Sebut mereka pengkhianat desa", karma: -15 }] },
  { text: "Kamu mengusulkan mediasi resmi yang mengundang perwakilan pabrik, warga, dan dinas LH.", concept: "Ajudikasi Awal", choices: [{ text: "Siapkan data bukti pencemaran", karma: 15 }, { text: "Datang tanpa persiapan", karma: -5 }] },
  { text: "Saat mediasi, pihak pabrik membantah membuang limbah sembarangan.", concept: "Penyangkalan", choices: [{ text: "Buktikan dengan foto & sampel air", karma: 15 }, { text: "Lempar botol ke manajer", karma: -50, isBad: true }] },
  { text: "Dinas Lingkungan Hidup menguji sampel dan membenarkan klaim warga.", concept: "Fakta Objektif", choices: [{ text: "Tuntut solusi, bukan sekadar denda", karma: 15 }, { text: "Tuntut pabrik ditutup selamanya", karma: -10 }] },
  { text: "Manajer pabrik akhirnya mengaku sistem filter mereka rusak dan berjanji memperbaikinya.", concept: "Pengakuan", choices: [{ text: "Beri tenggat waktu perbaikan", karma: 15 }, { text: "Tidak percaya dan usir manajer", karma: -15 }] },
  { text: "Sebagai bentuk tanggung jawab, pabrik setuju memberikan CSR alat penjernih air untuk desa.", concept: "Kompensasi Sosial", choices: [{ text: "Kawal penyaluran CSR agar transparan", karma: 15 }, { text: "Korupsi dana CSR tersebut", karma: -50, isBad: true }] },
  { text: "Warga yang bekerja di pabrik dan aktivis lingkungan desa akhirnya berdamai.", concept: "Rekonsiliasi", choices: [{ text: "Fasilitasi jabat tangan mereka", karma: 10 }, { text: "Adu domba lagi", karma: -20 }] },
  { text: "Pabrik memperbaiki filter limbahnya, sungai berangsur pulih.", concept: "Pemulihan Lingkungan", choices: [{ text: "Ajak warga kerja bakti bersihkan sungai", karma: 15 }, { text: "Tonton saja pekerjanya", karma: -5 }] },
  { text: "Pabrik juga membuka lowongan khusus untuk pemuda desa sebagai tim pengawas limbah.", concept: "Pemberdayaan", choices: [{ text: "Dukung pemuda desa mendaftar", karma: 15 }, { text: "Halangi mereka mendaftar", karma: -10 }] },
  { text: "Desa kini mendapat manfaat ekonomi sekaligus jaminan kelestarian alam.", concept: "Sustainable Development", choices: [{ text: "Syukuri keseimbangan ini", karma: 10 }, { text: "Minta uang lebih ke pabrik", karma: -15 }] },
  { text: "Kades memujimu sebagai pahlawan diplomasi lingkungan desa.", concept: "Apresiasi Publik", choices: [{ text: "Rendah hati, ini kerja bersama", karma: 15 }, { text: "Sombongkan diri ke semua orang", karma: -10 }] },
  { text: "Sungai desa kembali jernih, anak-anak bisa berenang lagi di sana.", concept: "Kualitas Hidup", choices: [{ text: "Ikut bermain air bersama", karma: 10 }, { text: "Larangan anak-anak main", karma: -5 }] },
  { text: "Manajer pabrik rutin berkunjung ke balai desa untuk ngopi bareng warga.", concept: "Interaksi Asosiatif", choices: [{ text: "Sambut manajer dengan hangat", karma: 10 }, { text: "Abaikan manajer tersebut", karma: 0 }] },
  { text: "Warga sepakat membuat aturan desa ketat tentang perlindungan lingkungan.", concept: "Institusionalisasi Norma", choices: [{ text: "Bantu susun draf aturannya", karma: 15 }, { text: "Melanggar aturan itu", karma: -15 }] },
  { text: "Harmoni antara industri, warga, dan alam terjalin dengan indah.", concept: "Integrasi Fungsional", choices: [{ text: "Jaga terus kerukunan ini", karma: 10 }, { text: "Pindah ke desa lain", karma: 0 }] },
  { text: "Konflik membuahkan sistem yang saling menjaga satu sama lain.", concept: "Harmoni Sosial", choices: [{ text: "Selesaikan Misi", karma: 0 }] }
];


// --- 3. FUNGSI GENERATOR OTOMATIS NODES CERITA ---
const buildStoryNodes = (prefix: string, dataArray: any[]) => {
  const nodes: Record<string, any> = {};
  
  dataArray.forEach((data, index) => {
    const stepNum = index + 1;
    // Pembagian 20 soal: 1-5 Orientasi, 6-15 Konflik, 16-20 Resolusi
    const phase = stepNum <= 5 ? 'Orientasi' : stepNum <= 15 ? 'Konflik' : 'Resolusi';
    const nodeId = `${prefix}_${stepNum}`;
    const defaultNextId = stepNum === 20 ? `${prefix}_check` : `${prefix}_${stepNum + 1}`;

    nodes[nodeId] = {
      phase,
      step: stepNum,
      text: data.text,
      concept: data.concept,
      choices: data.choices.map((c: any) => ({
        text: c.text,
        karma: c.karma,
        nextNodeId: c.isBad ? `${prefix}_bad` : defaultNextId
      }))
    };
  });

  nodes[`${prefix}_bad`] = { endingType: 'Bad' };
  nodes[`${prefix}_good`] = { endingType: 'Good' };
  nodes[`${prefix}_check`] = { isLogicNode: true };

  return nodes;
};

// Gabungkan kelima cerita ke dalam satu objek besar
const STORY_NODES = {
  ...buildStoryNodes('s1', S1_DATA),
  ...buildStoryNodes('s2', S2_DATA),
  ...buildStoryNodes('s3', S3_DATA),
  ...buildStoryNodes('s4', S4_DATA),
  ...buildStoryNodes('s5', S5_DATA),
};


// --- 4. KOMPONEN UTAMA GAME ---
export default function Game() {
  const { user } = useAuth(); // Pastikan Anda menyesuaikan hooks autentikasi Anda
  
  const [currentView, setCurrentView] = useState<'menu' | 'playing' | 'bad_ending'>('menu');
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState<string>('');
  const [karma, setKarma] = useState(50);
  const [showConcept, setShowConcept] = useState(false);

  const currentNode = STORY_NODES[currentNodeId];
  const progressRatio = currentNode?.step ? (currentNode.step / 20) * 100 : 0;
  const isGoodEnding = currentNode?.endingType === 'Good';

  // Handler Mulai Cerita
  const startGame = (storyId: string) => {
    setSelectedStoryId(storyId);
    setCurrentNodeId(`${storyId}_1`);
    setKarma(50);
    setCurrentView('playing');
  };

  // Handler Pilihan
  const handleChoice = (nextNodeId: string, karmaChange: number = 0) => {
    const newKarma = Math.min(Math.max(karma + (karmaChange || 0), 0), 100);
    setKarma(newKarma);
    
    // BAD ENDING TRIGGER (Jika karma habis atau trigger fatal)
    if (nextNodeId.includes('bad') || newKarma < 20) {
      setCurrentView('bad_ending');
      return;
    }

    // CHECK NODE (Evaluasi skor di akhir soal ke-20)
    if (STORY_NODES[nextNodeId]?.isLogicNode) {
      if (newKarma >= 65) {
        setCurrentNodeId(`${selectedStoryId}_good`); // Menang
      } else {
        setCurrentView('bad_ending'); // Karma pas-pasan = Gagal
      }
      return;
    }

    setCurrentNodeId(nextNodeId);
    setShowConcept(true);
    setTimeout(() => setShowConcept(false), 3000);
  };

  // Handler Reset
  const resetToMenu = () => {
    setCurrentView('menu');
    setSelectedStoryId(null);
    setCurrentNodeId('');
    setKarma(50);
  };

  // STATE: BELUM LOGIN
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-8">
        <div className="w-24 h-24 bg-white rounded-4xl flex items-center justify-center mx-auto shadow-2xl border-4 border-slate-100">
          <Lock size={48} className="text-slate-300" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-display font-black text-slate-800 tracking-tight">Eits, Belum Login!</h1>
          <p className="text-slate-500 font-medium max-w-md mx-auto">
            Kamu harus login terlebih dahulu untuk bisa memainkan Social Story Game.
          </p>
        </div>
        <Link to="/login" className="inline-flex items-center gap-2 px-10 py-5 bg-[#2B6CB0] text-white rounded-3xl font-black uppercase tracking-widest shadow-[0_10px_0_0_#1A365D] hover:translate-y-1 hover:shadow-[0_5px_0_0_#1A365D] transition-all">
          Login Sekarang
        </Link>
      </div>
    );
  }

  // STATE: MENU PILIH CERITA
  if (currentView === 'menu') {
    return (
      <div className="max-w-5xl mx-auto space-y-12 pb-12 p-4 font-sans text-slate-800">
        <header className="text-center space-y-4">
          <div className="inline-flex p-4 bg-blue-100 text-blue-600 rounded-full shadow-sm mb-2">
            <Gamepad2 size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#2D5A9E] tracking-tight uppercase">Simulasi Harmoni</h1>
          <p className="text-slate-500 font-medium text-lg">Pilih skenario lingkungan untuk menguji nalar sosiologimu.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AVAILABLE_STORIES.map((story) => (
            <div key={story.id} className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200 border-4 border-slate-50 flex flex-col hover:-translate-y-2 transition-transform duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[#FFEFB5] text-[#B08900] rounded-xl">
                  {story.icon}
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                  {story.env}
                </span>
              </div>
              <h3 className="text-2xl font-black text-[#2D5A9E] mb-3">{story.title}</h3>
              <p className="text-slate-500 font-medium mb-8 flex-grow">{story.desc}</p>
              
              <button onClick={() => startGame(story.id)} className="w-full py-4 bg-[#2D5A9E] text-white rounded-2xl font-black tracking-widest uppercase text-sm hover:bg-blue-800 transition-colors shadow-lg active:scale-95">
                Mulai Skenario
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // STATE: BAD ENDING (GAGAL)
  if (currentView === 'bad_ending') {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center space-y-10">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-40 h-40 bg-red-100 text-red-500 rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl border-8 border-red-50">
          <ShieldAlert size={64} />
        </motion.div>
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 uppercase tracking-tight">Yah, Kamu Gagal Membangun Harmoni Sosial</h1>
          <p className="text-xl text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
            Keputusan yang kamu ambil justru memperburuk konflik dan merusak tatanan sosial. Lingkungan menjadi tidak harmonis akibat keegoisan dan prasangka.
          </p>
        </div>
        <button onClick={resetToMenu} className="inline-flex items-center gap-2 px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-colors active:scale-95 shadow-xl">
          <RotateCcw size={20} /> Coba Skenario Lain
        </button>
      </div>
    );
  }

  // STATE: PLAYING (SEDANG MAIN ATAU GOOD ENDING)
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 p-4 font-sans">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <button onClick={resetToMenu} className="p-2 bg-slate-200 text-slate-600 rounded-full hover:bg-slate-300 transition-colors"><ChevronLeft size={20}/></button>
            <h1 className="text-2xl font-black text-[#2D5A9E] uppercase tracking-tight">
              {AVAILABLE_STORIES.find(s => s.id === selectedStoryId)?.title}
            </h1>
            <div className="bg-[#FFEFB5] text-[#B08900] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
              {AVAILABLE_STORIES.find(s => s.id === selectedStoryId)?.env}
            </div>
          </div>
        </div>
        
        {!isGoodEnding && currentNode && (
          <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl shadow-sm border-2 border-slate-100">
            <div className="flex items-center gap-2 text-rose-500 font-black">
              <Heart size={18} fill="currentColor" /> {karma} Karma
            </div>
            <div className="h-8 w-[2px] bg-slate-200" />
            <div className="text-sm font-black text-slate-700">
              Tahap {currentNode.step} <span className="text-slate-300">/ 20</span>
            </div>
          </div>
        )}
      </header>

      {/* Progress Bar (Hanya tampil jika belum tamat) */}
      {!isGoodEnding && currentNode && (
        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">
           <motion.div initial={{ width: 0 }} animate={{ width: `${progressRatio}%` }} className={`h-full transition-all duration-500 
             ${currentNode.phase === 'Orientasi' ? 'bg-blue-400' : currentNode.phase === 'Konflik' ? 'bg-amber-400' : 'bg-emerald-400'}`} 
           />
        </div>
      )}

      {/* Area Cerita */}
      <section className="relative min-h-[550px] bg-slate-900 rounded-[3rem] overflow-hidden group shadow-2xl flex flex-col justify-end">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        
        {/* Notifikasi Konsep Sosiologi */}
        <AnimatePresence>
          {showConcept && currentNode?.concept && !isGoodEnding && (
            <motion.div 
              initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}
              className="absolute top-8 right-8 z-50 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-3 shadow-2xl max-w-xs"
            >
              <div className="p-2 bg-yellow-400 rounded-xl">
                 <BrainCircuit size={20} className="text-slate-900" />
              </div>
              <div>
                <p className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">Konsep Diuji</p>
                <p className="text-xs font-bold text-white">{currentNode.concept}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Visualisasi Latar (Icon besar di tengah) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className={`p-8 rounded-full border-4 border-white/10 backdrop-blur-md shadow-2xl transition-all duration-700
             ${isGoodEnding ? 'bg-emerald-500/20 text-emerald-400' : 
               currentNode?.phase === 'Orientasi' ? 'bg-blue-500/20 text-blue-300' :
               currentNode?.phase === 'Konflik' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}
           `}>
             {isGoodEnding ? <Sparkles size={80} /> : currentNode?.phase === 'Konflik' ? <ShieldAlert size={80} /> : <Users size={80} />}
           </div>
        </div>

        {/* Kotak Teks dan Pilihan */}
        <div className="relative z-10 w-full p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentNodeId} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className={`p-8 md:p-10 rounded-[2.5rem] shadow-2xl space-y-8 backdrop-blur-xl border-t border-white/20
                ${isGoodEnding ? 'bg-emerald-900/90 text-white' : 'bg-white/95 text-slate-800'}
              `}
            >
              {isGoodEnding ? (
                <div className="text-center space-y-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-300">Skenario Selesai</p>
                  <h2 className="text-4xl font-black text-white">Harmoni Sosial Tercipta!</h2>
                  <p className="text-emerald-100 font-medium max-w-lg mx-auto">
                    Kerja bagus! Kamu berhasil meredam konflik dan menyatukan kembali kelompok yang terpecah dengan nalar sosiologi yang sangat bijak.
                  </p>
                  <button onClick={resetToMenu} className="mt-8 px-10 py-5 bg-white text-emerald-700 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-emerald-50 active:scale-95 transition-all">
                    Pilih Skenario Lain
                  </button>
                </div>
              ) : currentNode ? (
                <>
                  <div className="flex items-center gap-2">
                     <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                       <MessageSquare size={14} className="text-blue-600" />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                       Tahap: <span className="text-blue-600">{currentNode.phase}</span>
                     </span>
                  </div>

                  <p className="text-xl md:text-2xl leading-relaxed font-black text-slate-800">
                    “{currentNode.text}”
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentNode.choices.map((choice: any, i: number) => (
                      <button
                        key={i}
                        onClick={() => handleChoice(choice.nextNodeId, choice.karma)}
                        className="p-5 md:p-6 rounded-[1.5rem] border-2 border-slate-100 text-left bg-white transition-all group flex items-center justify-between hover:border-blue-400 hover:shadow-lg active:scale-95"
                      >
                        <span className="text-sm font-black text-slate-700 leading-tight group-hover:text-blue-700 transition-colors pr-4">{choice.text}</span>
                        <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all shrink-0" />
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-10">
                  <p>Memuat skenario...</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}