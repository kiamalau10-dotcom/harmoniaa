import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutGrid, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ShieldAlert, CheckCircle2, XCircle, Lock, PlayCircle, Brain, Heart, Gift } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { useAuth } from '../lib/AuthContext';

// --- 1. DESAIN PETA LABIRIN NYATA (15x15) ---
const MAZE_GRID = [
  [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
  [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// --- 2. TIPE DATA ---
type Question = { q: string; options: string[]; correct: string; discussion: string; hintHarmo: string; hintSoci: string; };
type MazePost = { id: number; x: number; y: number; title: string; questions: Question[]; };
type Trap = { x: number; y: number; q: string; isTrue: boolean; discussion: string; };

// --- 3. BANK SOAL HARMONI SOSIAL ---
const MEDIUM_QUESTIONS: Question[] = [
  { q: "Siswa SMA Unggul Del dan warga Desa Meat membagi tugas secara spesifik dalam penyelenggaraan Bagas Nauli Fest. Pembagian peran ini menciptakan...", options: ["Integrasi fungsional", "Integrasi koersif", "Asimilasi", "Eksklusi sosial"], correct: "Integrasi fungsional", discussion: "Keharmonisan lahir dari fungsi yang saling bergantung.", hintHarmo: "Fokus pada pembagian tugas yang terstruktur.", hintSoci: "Perbedaan tugas menyatukan mereka sebagai satu keluarga." },
  { q: "Dalam rapat persiapan, usulan dari orang tua siswa dan usulan dari pemuda digabungkan tanpa menghilangkan esensi dari masing-masing usulan. Proses ini disebut...", options: ["Akulturasi", "Dominasi", "Asimilasi", "Segregasi"], correct: "Akulturasi", discussion: "Penyatuan ide tanpa menghilangkan identitas asli gagasan tersebut.", hintHarmo: "Rumusnya A + B = AB, bukan C.", hintSoci: "Semua pihak merasa dihargai karena idenya terpakai." },
  { q: "Panitia Bagas Nauli Fest secara khusus membuat jalur landai agar warga lansia dan pengguna kursi roda bisa mengakses area festival. Tindakan ini merupakan wujud nyata dari...", options: ["Inklusi sosial", "Eksklusi sosial", "Stratifikasi sosial", "Diferensiasi sosial"], correct: "Inklusi sosial", discussion: "Membuka akses agar kelompok rentan dapat berpartisipasi penuh.", hintHarmo: "Ini upaya membongkar hambatan struktural fisik.", hintSoci: "Bayangkan betapa senangnya lansia bisa ikut merayakan." },
  { q: "Ketika terjadi perbedaan pendapat mengenai jadwal acara, kedua belah pihak memutuskan untuk saling mengurangi tuntutan agar festival tetap berjalan. Bentuk resolusi ini adalah...", options: ["Kompromi", "Mediasi", "Arbitrase", "Konsiliasi"], correct: "Kompromi", discussion: "Kedua belah pihak saling mengalah demi kesepakatan.", hintHarmo: "Penyelesaian dengan cara menurunkan tuntutan masing-masing.", hintSoci: "Mengalah bukan berarti kalah, tapi demi kebersamaan." },
  { q: "Pengguna aplikasi outbubble seringkali hanya melihat informasi yang sesuai dengan pandangannya, memicu miskomunikasi antar kelompok. Fenomena penghalang integrasi ini disebut...", options: ["Filter bubble", "Kohesi digital", "Inklusi informasi", "Solidaritas mekanik"], correct: "Filter bubble", discussion: "Algoritma mengurung pengguna dalam informasi yang sepaham saja.", hintHarmo: "Gelembung algoritma menyaring data luar.", hintSoci: "Ini membuat kita buta terhadap perasaan kelompok lain." },
  { q: "Untuk memecah echo chamber di komunitas digital, Harmo menyarankan sistem diskusi di mana opini minoritas selalu ditampilkan. Upaya ini bertujuan menciptakan...", options: ["Kesetaraan diskursus (komunikasi)", "Monopoli informasi", "Stratifikasi digital", "Integrasi koersif"], correct: "Kesetaraan diskursus (komunikasi)", discussion: "Memberikan ruang yang sama bagi semua pihak untuk didengar.", hintHarmo: "Memastikan keseimbangan sistem penyampaian pesan.", hintSoci: "Agar suara yang paling kecil sekalipun berharga." },
  { q: "Orang tua siswa rela meluangkan waktu lembur membuat dekorasi karena merasa festival ini adalah tanggung jawab moral bersama. Ikatan ini merupakan contoh...", options: ["Solidaritas organik", "Patembayan", "Kerumunan", "Solidaritas mekanik"], correct: "Solidaritas organik", discussion: "Mereka bersatu karena kesadaran dan saling melengkapi (fungsional).", hintHarmo: "Kerja sama fungsional masyarakat kompleks.", hintSoci: "Rasa tanggung jawab yang mengikat hati mereka." },
  { q: "Konflik ringan antara panitia dan warga diselesaikan dengan bantuan kepala dusun yang netral. Tindakan kepala dusun yang hanya memberi nasihat disebut...", options: ["Mediasi", "Arbitrase", "Ajudikasi", "Koersi"], correct: "Mediasi", discussion: "Pihak ketiga netral yang keputusannya tidak mengikat.", hintHarmo: "Fasilitator tanpa wewenang pengambilan keputusan.", hintSoci: "Sosok penengah yang mendinginkan kepala semua pihak." },
  { q: "Desa Meat memiliki adat 'Martarombo' untuk merajut persaudaraan. Praktik ini secara langsung memperkuat...", options: ["Kohesi sosial", "Stratifikasi sosial", "Disintegrasi", "Eksklusi sosial"], correct: "Kohesi sosial", discussion: "Adat tersebut merekatkan hubungan antaranggota masyarakat.", hintHarmo: "Mekanisme kultural penahan integrasi kelompok.", hintSoci: "Tali persaudaraan yang membuat warga merasa aman." },
  { q: "Panitia Bagas Nauli Fest memberikan akses informasi keuangan yang transparan kepada seluruh warga dan donatur. Transparansi ini mendorong terciptanya...", options: ["Kepercayaan sosial (Social Trust)", "Konflik kelas", "Cultural lag", "Hegemoni"], correct: "Kepercayaan sosial (Social Trust)", discussion: "Kejujuran membangun rasa aman dan kepercayaan kolektif.", hintHarmo: "Keterbukaan informasi adalah fondasi organisasi.", hintSoci: "Warga merasa dihargai dan tidak dicurangi." },
  { q: "Seorang siswa yang sebelumnya pasif di sekolah menjadi aktif dan peduli lingkungan setelah berbaur dengan masyarakat Desa Meat. Ini adalah wujud dari fungsi...", options: ["Sosialisasi partisipatoris", "Sosialisasi represif", "Isolasi sosial", "Penyimpangan primer"], correct: "Sosialisasi partisipatoris", discussion: "Belajar nilai sosial melalui keterlibatan langsung dan setara.", hintHarmo: "Pembelajaran melalui interaksi struktur langsung.", hintSoci: "Siswa menemukan maknanya setelah berbuat nyata." },
  { q: "Pemberian peran yang sama besarnya antara laki-laki dan perempuan dalam menyusun tata ruang panggung festival mencerminkan nilai...", options: ["Kesetaraan gender", "Patriarki", "Marginalisasi", "Eksploitasi"], correct: "Kesetaraan gender", discussion: "Memberikan hak dan kewajiban yang seimbang tanpa memandang jenis kelamin.", hintHarmo: "Distribusi peran berbasis kompetensi murni.", hintSoci: "Semua orang berhak berkontribusi untuk desa." },
  { q: "Meskipun berasal dari kota yang berbeda, para donatur saling percaya untuk menyumbang ke acara desa karena mereka merasa menjadi bagian dari gerakan sosial yang sama. Ini menunjukkan pentingnya...", options: ["Identitas kolektif", "Etnosentrisme", "Ketimpangan sosial", "Integrasi koersif"], correct: "Identitas kolektif", discussion: "Rasa kebersamaan yang melebihi batas wilayah fisik.", hintHarmo: "Jaringan nilai bersama melampaui geografi.", hintSoci: "Hati yang terpanggil oleh tujuan mulia yang sama." },
  { q: "Soci menjelaskan bahwa harmoni sosial tidak menuntut semua orang untuk sama, melainkan menuntut masyarakat untuk...", options: ["Menghargai diferensiasi (perbedaan)", "Menghapus stratifikasi", "Melakukan asimilasi mutlak", "Menghindari segala bentuk konflik"], correct: "Menghargai diferensiasi (perbedaan)", discussion: "Harmoni lahir dari penerimaan terhadap perbedaan yang ada.", hintHarmo: "Perbedaan adalah elemen sistem yang alami.", hintSoci: "Perbedaan itu indah jika kita saling menghargai." },
  { q: "Ketika panitia menyusun acara, mereka memastikan tidak ada pertunjukan yang menyinggung kepercayaan agama tertentu. Sikap ini merupakan wujud dari...", options: ["Toleransi aktif", "Sekularisasi", "Fanatisme", "Akomodasi koersif"], correct: "Toleransi aktif", discussion: "Mencegah gesekan dengan menghormati batas-batas nilai kelompok lain.", hintHarmo: "Tindakan preventif menghormati batas norma lain.", hintSoci: "Empati yang diwujudkan dalam tindakan nyata." },
  { q: "Setelah sukses di acara pertama, ikatan antar warga desa dan siswa menjadi sangat kuat sehingga mereka menganggap diri mereka sebagai satu keluarga besar. Hubungan ini telah berevolusi menjadi...", options: ["In-group (kelompok dalam)", "Out-group (kelompok luar)", "Kelompok sekunder", "Kerumunan"], correct: "In-group (kelompok dalam)", discussion: "Munculnya rasa 'kami' dan ikatan batin yang mendalam.", hintHarmo: "Terbentuknya batas sosial afektif 'we-feeling'.", hintSoci: "Rasa persaudaraan yang tak akan mudah luntur." },
  { q: "Adanya peraturan tertulis yang disepakati bersama oleh panitia dan orang tua siswa untuk menghindari miskomunikasi adalah contoh upaya menciptakan harmoni melalui...", options: ["Integrasi normatif", "Integrasi fungsional", "Pengendalian represif", "Akomodasi ajudikasi"], correct: "Integrasi normatif", discussion: "Penyatuan berdasarkan norma (aturan tertulis) yang disepakati.", hintHarmo: "Konsensus aturan sebagai perekat sosial.", hintSoci: "Janji tertulis menjaga kepercayaan bersama." },
  { q: "Seorang siswa belajar untuk tidak memaksakan pendapatnya kepada tokoh adat setelah memahami bahwa ada hierarki budaya yang harus dihormati. Proses penyesuaian diri ini dinamakan...", options: ["Adaptasi sosial", "Mobilitas sosial", "Intervensi", "Penyimpangan"], correct: "Adaptasi sosial", discussion: "Menyesuaikan perilaku dengan norma lingkungan setempat untuk bertahan/diterima.", hintHarmo: "Penyesuaian perilaku individu terhadap norma mayoritas.", hintSoci: "Menghargai mereka yang lebih tua dan berilmu." },
  { q: "Bagas Nauli Fest berhasil menaikkan pendapatan ekonomi desa secara merata tanpa memonopoli keuntungan untuk satu golongan saja. Secara sosiologis, ini mencerminkan prinsip...", options: ["Keadilan distributif", "Eksploitasi kelas", "Stratifikasi tertutup", "Hegemoni kapital"], correct: "Keadilan distributif", discussion: "Pembagian hasil ekonomi yang merata dan proporsional.", hintHarmo: "Distribusi sumber daya yang adil dan merata.", hintSoci: "Semua orang berhak merasakan kebahagiaan hasil keringat mereka." },
  { q: "Meskipun terdapat perbedaan cara pandang mengenai modernisasi, warga desa sepakat bahwa menjaga alam adalah prioritas absolut. Kesepakatan pada nilai dasar ini berfungsi sebagai...", options: ["Konsensus", "Disorganisasi", "Arbitrase", "Konflik laten"], correct: "Konsensus", discussion: "Kesepakatan umum mengenai nilai-nilai mendasar di tengah perbedaan.", hintHarmo: "Persetujuan universal atas norma fundamental.", hintSoci: "Titik temu yang mempersatukan segala perbedaan pandangan." },
  { q: "Dalam sosiologi pendidikan, orang tua siswa yang membekali anaknya dengan kebanggaan akan tradisi lokal sedang mentransfer...", options: ["Modal budaya (Cultural Capital)", "Modal ekonomi", "Alienasi", "Kekerasan simbolik"], correct: "Modal budaya (Cultural Capital)", discussion: "Nilai tradisi adalah wawasan kultural yang memperkuat identitas anak.", hintHarmo: "Transfer pengetahuan kultural lintas generasi.", hintSoci: "Warisan nilai agar anak tahu dari mana ia berasal." },
  { q: "Ketika pemuda desa yang merantau kembali untuk membantu festival, mereka membawa ide-ide baru yang diterima dengan baik karena disampaikan secara persuasif. Masuknya ide secara damai ini disebut...", options: ["Penetrasi pasifique", "Penetrasi violente", "Invasi", "Isolasi"], correct: "Penetrasi pasifique", discussion: "Pemasukan budaya atau ide baru ke masyarakat dengan cara damai.", hintHarmo: "Difusi budaya tanpa paksaan atau resistensi.", hintSoci: "Dialog yang hangat membuka hati warga desa." },
  { q: "Beberapa warga awalnya pesimis terhadap panitia luar, namun sikap ini berubah menjadi dukungan penuh setelah melihat kerja keras siswa. Perubahan sikap prasangka ini membuktikan efektivitas dari...", options: ["Hipotesis Kontak (Contact Hypothesis)", "Stereotyping", "Diskriminasi", "Evolusi linear"], correct: "Hipotesis Kontak (Contact Hypothesis)", discussion: "Interaksi positif langsung antar kelompok dapat menurunkan prasangka.", hintHarmo: "Interaksi intensif meruntuhkan bias kognitif.", hintSoci: "Kerja keras membuktikan ketulusan niat siswa." },
  { q: "Jika panitia secara tidak sadar selalu memberikan peran pemimpin kelompok kepada laki-laki dan peran konsumsi pada perempuan, ini mencerminkan hambatan harmoni berupa...", options: ["Ketidaksetaraan Gender (Bias Peran)", "Diferensiasi umur", "Integrasi fungsional", "Mobilitas vertikal"], correct: "Ketidaksetaraan Gender (Bias Peran)", discussion: "Terdapat pembagian kerja yang didasarkan pada stereotip jenis kelamin, bukan kompetensi.", hintHarmo: "Pembagian peran hierarkis berbasis gender.", hintSoci: "Ini tidak adil bagi potensi besar yang dimiliki perempuan." },
  { q: "Sosiolog mengamati bahwa festival ini sukses karena adanya pemimpin lokal yang sangat karismatik dan dihormati semua pihak. Otoritas pemimpin ini tergolong...", options: ["Otoritas Karismatik", "Otoritas Legal-Rasional", "Otoritas Tradisional", "Otoritas Koersif"], correct: "Otoritas Karismatik", discussion: "Kepatuhan didasarkan pada pesona dan daya tarik personal individu.", hintHarmo: "Kepatuhan bersumber pada kualitas personal (Max Weber).", hintSoci: "Warga mengikutinya karena ia sangat menginspirasi." },
  { q: "Munculnya rumor palsu yang menyudutkan salah satu kelompok warga di aplikasi outbubble adalah contoh ancaman kohesi sosial yang disebut...", options: ["Disinformasi", "Cultural lag", "Akomodasi digital", "Inovasi sosial"], correct: "Disinformasi", discussion: "Penyebaran informasi palsu dengan niat sengaja memecah belah masyarakat.", hintHarmo: "Gangguan informasi yang mengancam stabilitas.", hintSoci: "Hoaks sangat menyakiti hati kelompok yang difitnah." },
  { q: "Sikap etnosentrisme dapat mengancam Bagas Nauli Fest jika...", options: ["Warga lokal merasa kebudayaan mereka lebih superior dari tamu pendatang", "Warga lokal menyerap budaya tamu tanpa menyaring", "Pemuda mematuhi tokoh adat sepenuhnya", "Orang tua siswa menjaga warisan kuliner"], correct: "Warga lokal merasa kebudayaan mereka lebih superior dari tamu pendatang", discussion: "Etnosentrisme adalah memandang rendah budaya lain, yang akan merusak keramahan pariwisata.", hintHarmo: "Bias superioritas kultural mengancam interaksi.", hintSoci: "Sombong budaya akan mengusir niat baik pendatang." },
  { q: "Dalam menyelesaikan masalah anggaran yang memicu ketegangan, bendahara menggunakan data Excel yang rasional, mengesampingkan emosi pribadi. Tindakan ini mencerminkan...", options: ["Tindakan rasional instrumental", "Tindakan afektif", "Tindakan tradisional", "Tindakan irasional"], correct: "Tindakan rasional instrumental", discussion: "Tindakan berdasarkan kalkulasi logika dan alat (data) untuk mencapai tujuan efisiensi.", hintHarmo: "Penggunaan instrumen rasional (Weber).", hintSoci: "Profesionalitas dibutuhkan agar tidak ada yang merasa dicurangi." },
  { q: "Upaya sekolah di Desa Meat untuk memasukkan kurikulum pembuatan ulos adalah strategi untuk mempertahankan harmoni melalui...", options: ["Preservasi kebudayaan", "Asimilasi paksa", "Alienasi budaya", "Stratifikasi pendidikan"], correct: "Preservasi kebudayaan", discussion: "Menjaga agar warisan nilai lokal tidak punah tergerus zaman.", hintHarmo: "Langkah institusional melestarikan nilai.", hintSoci: "Agar generasi muda tetap bangga menjadi diri mereka." },
  { q: "Adanya forum diskusi terbuka di balai desa setiap bulan memungkinkan keluhan warga ditampung sebelum menjadi kemarahan massal. Secara sosiologis, forum ini berfungsi sebagai...", options: ["Katup penyelamat (Safety valve)", "Pengadilan ajudikasi", "Inovasi disrupsi", "Alat represi"], correct: "Katup penyelamat (Safety valve)", discussion: "Lembaga atau mekanisme yang menyalurkan rasa tidak puas tanpa merusak sistem.", hintHarmo: "Mekanisme pelepasan tekanan institusional.", hintSoci: "Wadah aman agar amarah tidak meledak jadi kebencian." },
  { q: "Kecenderungan orang tua siswa bergaul hanya dengan sesama pedagang, sementara kaum pemuda hanya bergaul dengan sesama panitia muda, merupakan bentuk...", options: ["Homofili", "Xenofobia", "Eksploitasi", "Mobilitas horizontal"], correct: "Homofili", discussion: "Kecenderungan manusia untuk bergaul dengan pihak yang memiliki kesamaan.", hintHarmo: "Pengelompokan berbasis kesamaan atribut.", hintSoci: "Itu wajar, manusia mencari teman yang paling mengerti dirinya." },
  { q: "Untuk menghindari homofili yang ekstrem, panitia mengacak kelompok kerja sehingga pemuda dan lansia harus bekerjasama mengecat gapura. Kebijakan ini menciptakan...", options: ["Interseksi sosial", "Konsolidasi identitas", "Primordialisme", "Anomie kelompok"], correct: "Interseksi sosial", discussion: "Persilangan keanggotaan kelompok yang menurunkan potensi konflik identitas.", hintHarmo: "Penyilangan batas sosial untuk mencegah polarisasi.", hintSoci: "Mengecat bersama meruntuhkan canggung antargenerasi." },
  { q: "Sikap seorang turis yang menghargai adat minum tuak bersama di Desa Meat tanpa harus ikut meminumnya karena alasan agama, merupakan bentuk...", options: ["Relativisme kultural", "Asimilasi", "Akomodasi paksa", "Etnosentrisme"], correct: "Relativisme kultural", discussion: "Memahami dan menghargai budaya orang lain dari sudut pandang budaya tersebut tanpa harus ikut serta.", hintHarmo: "Pemahaman objektif tanpa harus konformis.", hintSoci: "Menghormati keyakinan orang lain dan keyakinan sendiri." },
  { q: "Ketika proyek festival selesai, para siswa kembali ke rutinitas sekolah dan intensitas komunikasi dengan desa menurun. Dalam siklus kelompok sosial, fase ini dikenal sebagai...", options: ["Adjourning (Pembubaran)", "Storming (Konflik)", "Norming (Normalisasi)", "Performing (Pelaksanaan)"], correct: "Adjourning (Pembubaran)", discussion: "Tahap akhir pembubaran kelompok setelah tujuan atau proyek bersama tercapai.", hintHarmo: "Fase terminasi kelompok kerja (Tuckman).", hintSoci: "Perpisahan yang wajar setelah tugas mulia selesai." },
  { q: "Di dalam aplikasi outbubble, kelompok pemuda mendirikan komunitas digital untuk menjaga lingkungan desa tanpa batasan fisik tempat tinggal. Komunitas ini disebut...", options: ["Masyarakat jejaring (Network society)", "Masyarakat agraris", "Kelompok primer fisik", "Solidaritas mekanik"], correct: "Masyarakat jejaring (Network society)", discussion: "Struktur sosial yang diorganisasikan di sekitar jaringan informasi teknologi.", hintHarmo: "Organisasi sosial berbasis IT.", hintSoci: "Internet menyatukan niat baik dari mana saja." },
  { q: "Pengaruh globalisasi melalui turisme masuk ke Desa Meat dengan sangat cepat, namun nilai gotong royong lokal tetap tidak tergoyahkan. Fenomena kemampuan menyaring budaya ini menunjukkan kekuatan...", options: ["Kearifan lokal (Local genius)", "Xenofobia", "Cultural lag", "Isolasi geografis"], correct: "Kearifan lokal (Local genius)", discussion: "Kemampuan budaya setempat menyerap pengaruh asing tanpa kehilangan jati diri.", hintHarmo: "Resiliensi kultural menghadapi difusi.", hintSoci: "Akar mereka terlalu kuat untuk dicabut zaman." },
  { q: "Untuk mengurangi kecemburuan sosial, panitia mempublikasikan rincian donatur dan alokasi dana secara real-time di mading desa. Langkah ini memitigasi konflik yang berakar dari...", options: ["Deprivasi relatif", "Diferensiasi agama", "Mobilitas horizontal", "Solidaritas organik"], correct: "Deprivasi relatif", discussion: "Rasa tidak puas karena membandingkan kondisi (merasa tidak adil) dengan kelompok lain.", hintHarmo: "Mencegah perbandingan kesejahteraan subjektif.", hintSoci: "Keterbukaan menghalau prasangka buruk." },
  { q: "Pembagian tugas yang terlalu kaku di mana panitia laki-laki hanya mengangkat barang berat dan panitia perempuan hanya mengurus konsumsi dapat berdampak pada...", options: ["Reproduksi stereotip gender", "Peningkatan kesetaraan", "Mobilitas vertikal naik", "Integrasi normatif absolut"], correct: "Reproduksi stereotip gender", discussion: "Mengulang dan memperkuat bias peran gender tradisional di masyarakat.", hintHarmo: "Pelestarian sistem peran tradisional.", hintSoci: "Perempuan dan laki-laki bisa melakukan apa saja, jangan batasi." },
  { q: "Adanya pergeseran nilai di mana keberhasilan festival kini diukur dari 'berapa banyak likes' ketimbang 'kepuasan batin warga lokal' merupakan efek dari...", options: ["Komersialisasi dan budaya populer", "Evolusi budaya agraris", "Solidaritas mekanik", "Penetrasi isolatif"], correct: "Komersialisasi dan budaya populer", discussion: "Nilai intrinsik bergeser menjadi nilai ekstrinsik (angka statistik) demi validasi massal.", hintHarmo: "Perubahan matriks penilaian keberhasilan sosial.", hintSoci: "Hati-hati, kebahagiaan asli tak bisa diukur dengan tombol like." },
  { q: "Jika orang tua siswa memaksakan tata cara lamanya dan pemuda memaksakan inovasi teknologinya tanpa ada dialog, sosiolog akan mengidentifikasi kondisi ini sebagai...", options: ["Polarisasi sosial", "Asimilasi dua arah", "Kohesi mekanik", "Stratifikasi terbuka"], correct: "Polarisasi sosial", discussion: "Terbelahnya masyarakat ke dalam dua kutub ekstrem yang saling bertolak belakang.", hintHarmo: "Pembelahan struktural ekstrem antargenerasi.", hintSoci: "Dinding ego menghalangi mereka untuk saling mendengar." },
  { q: "Ketika pemuda menyadari bahwa tanpa izin dari tetua adat festival tidak akan direstui desa, mereka akhirnya memilih untuk sowan (berkunjung hormat). Tindakan ini didasarkan pada kesadaran akan...", options: ["Struktur kekuasaan lokal", "Kekerasan simbolik", "Eksklusi digital", "Penyimpangan primer"], correct: "Struktur kekuasaan lokal", discussion: "Pemahaman rasional bahwa tokoh adat memegang kunci legitimasi di desa tersebut.", hintHarmo: "Membaca peta distribusi kekuasaan.", hintSoci: "Sopan santun membuka pintu restu orang tua." },
  { q: "Sikap saling curiga antara penduduk lokal dan pendatang dapat dihilangkan jika mereka ditempatkan pada satu tujuan yang sama, yaitu mensukseskan festival. Tujuan bersama ini dalam sosiologi disebut...", options: ["Superordinate goal", "Subordinate status", "Cultural lag", "Hegemoni politik"], correct: "Superordinate goal", discussion: "Tujuan besar yang mendesak yang hanya bisa dicapai jika kelompok bermusuhan bekerja sama.", hintHarmo: "Sasaran hierarki atas penyatu friksi.", hintSoci: "Fokus pada apa yang bisa dibangun bersama, bukan perbedaan masa lalu." },
  { q: "Dalam konteks harmoni sosial, konsep 'Kesetaraan Kesempatan' (Equality of Opportunity) dalam panitia festival paling baik digambarkan dengan...", options: ["Semua warga berhak mencalonkan diri menjadi ketua panitia tanpa memandang status ekonomi", "Semua panitia harus digaji dengan jumlah yang sama", "Hanya keluarga pendiri desa yang boleh memegang posisi", "Mengharuskan pemuda desa lulusan luar negeri menjadi penasihat"], correct: "Semua warga berhak mencalonkan diri menjadi ketua panitia tanpa memandang status ekonomi", discussion: "Memastikan tidak ada diskriminasi awal dalam mengakses peran publik.", hintHarmo: "Penyediaan akses yang sama di titik mulai (baseline).", hintSoci: "Siapapun, sekecil apapun dia, berhak bermimpi memimpin desanya." },
  { q: "Pola asuh di mana orang tua siswa selalu mengajak anak berdiskusi saat mengambil keputusan keluarga akan membentuk karakter anak yang demokratis. Ini disebut sosialisasi...", options: ["Partisipatoris", "Represif", "Formal", "Sekunder"], correct: "Partisipatoris", discussion: "Pola asuh yang memberikan anak suara dan kebebasan berekspresi (dua arah).", hintHarmo: "Proses sosialisasi berbasis dialog setara.", hintSoci: "Anak yang didengar akan tumbuh menjadi pendengar yang baik." },
  { q: "Masyarakat Desa Meat tidak menolak teknologi, namun mereka membatasinya agar tidak merusak ekosistem danau. Pemilahan teknologi mana yang boleh masuk ini disebut...", options: ["Adaptasi selektif", "Asimilasi total", "Tradisionalisme buta", "Alienasi ekologis"], correct: "Adaptasi selektif", discussion: "Menerima perubahan dengan menyaringnya sesuai kebutuhan lokal.", hintHarmo: "Penyaringan elemen difusi secara rasional.", hintSoci: "Bumi adalah rumah, teknologi jangan sampai merusaknya." },
  { q: "Ketika pemuda marah karena merasa dibebani tugas terlalu banyak, Harmo menyarankan untuk melakukan pemetaan ulang beban kerja agar adil. Saran ini berlandaskan pada teori...", options: ["Keadilan prosedural", "Mobilitas horizontal", "Penyimpangan primer", "Asimilasi"], correct: "Keadilan prosedural", discussion: "Fokus pada perbaikan tata cara atau prosedur pembagian kerja agar dirasa adil oleh semua pihak.", hintHarmo: "Keadilan proses sama pentingnya dengan keadilan hasil.", hintSoci: "Kelelahan bisa membuat orang paling baik pun jadi marah." }
];

const HARD_QUESTIONS: Question[] = [
  { q: "Dominasi calo tiket di Bagas Nauli Fest memicu pedagang kecil melawan. Transformasi dari pasrah menjadi melawan (Marx) disebut pergeseran...", options: ["Anomie ke Konformitas", "Class in itself ke Class for itself", "Paguyuban ke Patembayan", "Akomodasi ke Toleransi"], correct: "Class in itself ke Class for itself", discussion: "Berubah dari sekadar bernasib sama menjadi kelompok yang sadar politik untuk melawan eksploitasi.", hintHarmo: "Transformasi kesadaran kelas struktural.", hintSoci: "Mereka sadar tak bisa terus-menerus ditindas." },
  { q: "Panitia mewajibkan e-wallet di festival. Pedagang tua gagap teknologi dan omset turun. Kondisi ketertinggalan ini disebut...", options: ["Cultural Lag", "Cultural Shock", "Penetrasi Budaya", "Evolusi Unilinear"], correct: "Cultural Lag", discussion: "Teknologi materi (e-wallet) mendahului kesiapan non-materi (keterampilan warga).", hintHarmo: "Kesenjangan antara inovasi material dan adaptasi immaterial.", hintSoci: "Mereka tidak salah, hanya butuh waktu untuk belajar." },
  { q: "Bagas Nauli Fest berfungsi secara laten sebagai 'Katup Penyelamat' (Safety Valve). Artinya acara ini...", options: ["Menyalurkan frustrasi sosial tanpa merusak struktur", "Menghukum pihak menyimpang", "Mengisolasi budaya luar", "Memaksa mobilitas vertikal"], correct: "Menyalurkan frustrasi sosial tanpa merusak struktur", discussion: "Festival memfasilitasi pelampiasan emosi warga secara legal dan aman (Teori Coser).", hintHarmo: "Fungsi pelepasan tensi institusional.", hintSoci: "Hiburan adalah obat stres paling ampuh bagi warga." },
  { q: "Voting online kepanitiaan desa dianggap demokratis, padahal orang tua tak dilibatkan karena tak punya smartphone. Kebijakan ini cacat karena bias...", options: ["Eksklusi Digital / Kesenjangan Struktural", "Mobilitas Intra-generasi", "Hedonisme", "Etnosentrisme"], correct: "Eksklusi Digital / Kesenjangan Struktural", discussion: "Infrastruktur yang tak merata menyingkirkan kelompok rentan dari partisipasi sosial.", hintHarmo: "Ilusi kesetaraan tanpa dukungan material merata.", hintSoci: "Suara mereka terbungkam karena tidak punya alat." },
  { q: "Analis menyebut festival di Desa Meat akan rusak jika hanya diukur dari logika efisiensi kapitalis (McDonaldization). Analis mengkritik...", options: ["Rasionalisasi berlebihan (Iron Cage)", "Dekadensi moral pemuda", "Kurangnya asimilasi", "Penyimpangan primer"], correct: "Rasionalisasi berlebihan (Iron Cage)", discussion: "Kritik Max Weber: obsesi pada kalkulasi birokrasi mematikan jiwa dan kebebasan kultural.", hintHarmo: "Birokratisasi yang menghancurkan esensi organik.", hintSoci: "Tradisi tidak melulu soal uang dan efisiensi." },
  { q: "Sekolah lokal mendoktrin anak Meat bahwa budaya mereka 'kuno', membuat mereka malu ikut festival. Sistem sekolah ini adalah alat...", options: ["Kekerasan Simbolik (Hegemoni)", "Sosialisasi Partisipatoris", "Mobilitas Antargenerasi", "Asimilasi ganda"], correct: "Kekerasan Simbolik (Hegemoni)", discussion: "Sekolah menanamkan rasa rendah diri agar siswa membenarkan penindasan kultural (Bourdieu).", hintHarmo: "Penindasan ideologis melalui institusi resmi.", hintSoci: "Mereka dijajah pikirannya tanpa mereka sadari." },
  { q: "Wisatawan kota berekspektasi fasilitas di Meat setara hotel bintang lima dan marah saat kecewa. Kegagalan harmoni ini berakar dari kegagalan proses...", options: ["Role taking (Pengambilan peran)", "Enkulturasi pariwisata", "Mobilitas sosial", "Difusi budaya"], correct: "Role taking (Pengambilan peran)", discussion: "Gagal menempatkan diri secara imajinatif pada kondisi sosial-ekonomi lokal (G.H. Mead).", hintHarmo: "Kegagalan empati struktural dalam interaksi simbolik.", hintSoci: "Mereka gagal memposisikan diri sebagai warga desa." },
  { q: "Pendekatan panitia memberdayakan kelompok disabilitas desa pembuat suvenir adalah pergeseran dari 'amal' (charity) menjadi...", options: ["Keadilan Struktural (Rights-based)", "Filantropi elit", "Evolusi sosial", "Solidaritas mekanik"], correct: "Keadilan Struktural (Rights-based)", discussion: "Menggeser disabilitas dari sekadar objek kasihan menjadi subjek otonom produktif.", hintHarmo: "Penyelesaian akar ketimpangan melalui pemberdayaan.", hintSoci: "Berikan mereka kemandirian, bukan belas kasihan sementara." },
  { q: "Dalam interaksionisme simbolik, 'Looking-glass self' (Charles Cooley) berarti identitas kita dibentuk oleh...", options: ["Bagaimana kita membayangkan orang lain menilai kita", "Genetik bawaan", "Aturan hukum negara", "Evolusi biologi"], correct: "Bagaimana kita membayangkan orang lain menilai kita", discussion: "Kita adalah cerminan dari persepsi masyarakat terhadap kita.", hintHarmo: "Identitas adalah konstruksi reflektif sosial.", hintSoci: "Cibiran atau pujian orang lain membentuk jiwa kita." },
  { q: "Konflik kelompok mayoritas dan minoritas akibat kebijakan negara diskriminatif paling tepat dianalisis menggunakan...", options: ["Teori Konflik Ralf Dahrendorf", "Teori Fungsional", "Teori Konstruksi Sosial", "Teori Evolusi"], correct: "Teori Konflik Ralf Dahrendorf", discussion: "Dahrendorf melihat konflik bermuara pada perebutan otoritas/kekuasaan dalam struktur.", hintHarmo: "Fokus pada struktur dominasi penguasa vs bawahan.", hintSoci: "Ketidakadilan penguasa selalu memicu perlawanan." },
  { q: "Masyarakat lebih percaya hoaks yang sesuai keyakinannya di medsos karena mereka terjebak dalam...", options: ["Echo Chamber / Filter Bubble", "Asimilasi informasi", "Akomodasi digital", "Interseksi kognitif"], correct: "Echo Chamber / Filter Bubble", discussion: "Algoritma mengurung orang dalam gelembung informasi yang mengonfirmasi bias mereka sendiri.", hintHarmo: "Gema informasi yang repetitif menutup data luar.", hintSoci: "Mereka hanya mendengar suara mereka sendiri." },
  { q: "Menurut Jurgen Habermas, harmoni sosial demokratis hanya bisa dicapai melalui...", options: ["Tindakan Komunikatif (Konsensus Bebas)", "Dominasi kelas penguasa", "Kembali ke tradisi murni", "Hukuman represif massal"], correct: "Tindakan Komunikatif (Konsensus Bebas)", discussion: "Diskusi rasional tanpa paksaan untuk mencapai kesepakatan.", hintHarmo: "Dialog bebas represi untuk konsensus rasional.", hintSoci: "Bicara dari hati ke hati, tanpa ada yang menekan." },
  { q: "Orang kaya sengaja membeli barang mewah untuk memamerkan status sosialnya (Veblen). Ini disebut...", options: ["Conspicuous Consumption", "Mobilitas horizontal", "Integrasi koersif", "Penyimpangan primer"], correct: "Conspicuous Consumption", discussion: "Konsumsi mencolok dilakukan untuk menegaskan batas stratifikasi kelas atas.", hintHarmo: "Konsumsi sebagai simbol pembeda kelas.", hintSoci: "Mereka membeli barang mahal untuk membeli penghormatan." },
  { q: "Penolakan masyarakat terhadap ideologi baru karena takut kenyamanannya rusak berakar pada...", options: ["Vested Interests (Kepentingan tertanam)", "Cultural Shock", "Inovasi sosial", "Asimilasi buta"], correct: "Vested Interests (Kepentingan tertanam)", discussion: "Kelompok status quo menolak perubahan karena takut kehilangan previlese.", hintHarmo: "Pertahanan status quo demi keuntungan struktural.", hintSoci: "Rasa takut kehilangan tahta dan zona nyaman." },
  { q: "Segregasi pemukiman antara kawasan kumuh dan real-estate mewah merupakan contoh analisis...", options: ["Sosiologi Ruang (Spasial) yang melanggengkan kelas", "Diferensiasi pekerjaan", "Toleransi pasif", "Integrasi normatif"], correct: "Sosiologi Ruang (Spasial) yang melanggengkan kelas", discussion: "Tata ruang fisik didesain kapitalisme untuk memisahkan dan mengontrol kelas pekerja.", hintHarmo: "Geografi sebagai instrumen segregasi kelas ekonomi.", hintSoci: "Tembok tinggi perumahan adalah tembok pemisah hati manusia." },
  { q: "Ketika pemuda menolak diadu domba oleh isu karena sadar nasib miskin mereka sama, kesadaran ini disebut Marx sebagai...", options: ["Kesadaran Kelas (Class Consciousness)", "Kesadaran Palsu (False Consciousness)", "Hegemoni", "Anomie"], correct: "Kesadaran Kelas (Class Consciousness)", discussion: "Pemahaman akan posisi bersama untuk melawan eksploitasi.", hintHarmo: "Kognisi kolektif kelas pekerja yang terbangun.", hintSoci: "Mereka sadar bahwa musuh sesungguhnya adalah kemiskinan." },
  { q: "Sosiolog menolak ide bahwa 'kearifan lokal Meat luntur alami karena turisme'. Ia percaya warga bisa melawan (resistensi). Perspektif ini adalah...", options: ["Teori Tindakan Sosial (Agensi)", "Fungsionalisme Struktural", "Evolusi Linear", "Positivisme"], correct: "Teori Tindakan Sosial (Agensi)", discussion: "Individu diposisikan sebagai agen aktif yang tindakannya memiliki makna rasional melawan narasi.", hintHarmo: "Menekankan agensi individu atas determinasi struktur.", hintSoci: "Warga bukanlah robot yang pasrah pada zaman." },
  { q: "Panitia memasukkan unsur musik elektronik ke dalam tarian tortor secara permanen tanpa menghilangkan ciri asli tari. Ini disebut...", options: ["Akulturasi", "Asimilasi", "Sinkretisme", "Dominasi"], correct: "Akulturasi", discussion: "Penyatuan budaya asing dengan asli di mana ciri khas asli tidak hilang.", hintHarmo: "Peleburan kultural non-destruktif.", hintSoci: "Cara cantik memeluk modernitas tanpa melepas warisan." },
  { q: "Orang tua menolak tiket online karena hilangnya interaksi langsung tatap muka. Hambatan perubahan sosial ini berbasis...", options: ["Ideologis / Nilai Kultural", "Vested interests", "Prasangka hal baru", "Tradisionalistis mutlak"], correct: "Ideologis / Nilai Kultural", discussion: "Penolakan didasarkan ketakutan hilangnya makna sakral silaturahmi.", hintHarmo: "Hambatan berbasis pertahanan sistem nilai lama.", hintSoci: "Bagi mereka, nilai senyuman jauh lebih mahal dari efisiensi." },
  { q: "Pemuda desa jadi manajer festival lalu sombong menjauhi teman lamanya. Ini efek negatif mobilitas vertikal yang disebut...", options: ["Alienasi / Keterasingan", "Akomodasi sosial", "Penyimpangan primer", "Interseksi"], correct: "Alienasi / Keterasingan", discussion: "Kenaikan status menyebabkan gegar peran dan keterasingan dari in-group lama.", hintHarmo: "Dampak psikologis pasca-mobilitas kelas.", hintSoci: "Sukses membuatnya lupa pada akar persahabatannya." },
  { q: "Panitia memastikan tidak sekadar 'memberi tahu' tapi 'mendengarkan' orang tua secara dialektis. Komunikasi rasional (Habermas) ini mencerminkan...", options: ["Tindakan Komunikatif", "Tindakan Afektif", "Tindakan Tradisional", "Represi Hegemonik"], correct: "Tindakan Komunikatif", discussion: "Tindakan berorientasi pada pencapaian konsensus argumen tanpa dominasi.", hintHarmo: "Rasionalitas diskursif demi konsensus.", hintSoci: "Mendengarkan adalah wujud tertinggi dari penghormatan." },
  { q: "Indikator absolut bahwa Bagas Nauli Fest mencapai 'Harmoni' bukanlah ketiadaan protes, melainkan ketika...", options: ["Terdapat mekanisme resolusi konflik yang dipercaya", "Peserta patuh 100% pada hukum negara", "Masyarakat kembali pada adat absolut", "Wisatawan ambil alih panitia"], correct: "Terdapat mekanisme resolusi konflik yang dipercaya", discussion: "Harmoni wujud jika ada wadah demokrasi sehat untuk mendamaikan sengketa tanpa kekerasan.", hintHarmo: "Harmoni adalah pengelolaan konflik yang terinstitusionalisasi.", hintSoci: "Marah itu wajar, asalkan ada tempat adil untuk menyelesaikannya." },
  { q: "Siswa SMA mendokumentasikan festival dan memviralkannya, menarik relawan luar pulau. Fungsi internet ini adalah...", options: ["Akselerator modal sosial (bridging)", "Pencipta anomie", "Hambatan integrasi", "Alat represi digital"], correct: "Akselerator modal sosial (bridging)", discussion: "Teknologi menjembatani solidaritas melampaui batas geografis (bridging capital).", hintHarmo: "Perluasan jaringan ikatan sosial struktural.", hintSoci: "Kebaikan di satu tempat bisa menginspirasi dunia." },
  { q: "Keadilan tidak berarti semua mendapat bagian persis sama, melainkan sesuai kontribusi dan kebutuhannya. Ini disebut prinsip kesetaraan...", options: ["Ekuitas (Equity)", "Egalitarian absolut (Equality)", "Oligarki", "Stratifikasi terbuka"], correct: "Ekuitas (Equity)", discussion: "Keadilan proporsional yang mempertimbangkan perbedaan kapasitas individu.", hintHarmo: "Distribusi keadilan proporsional substantif.", hintSoci: "Adil itu bukan sama rata, tapi sesuai takarannya." },
  { q: "Panitia meresmikan 'Hari Gotong Royong' di desa sebagai peringatan selesainya konflik. Penetapan ini bertujuan untuk...", options: ["Institusionalisasi nilai", "Penyimpangan sekunder", "Represi kultural", "Alienasi sejarah"], correct: "Institusionalisasi nilai", discussion: "Melembagakan ingatan perdamaian menjadi tradisi resmi agar diwariskan.", hintHarmo: "Pembentukan pranata sosial baru.", hintSoci: "Agar cucu mereka kelak ingat indahnya perdamaian." },
  { q: "Saat turis mengeluh di outbubble, warga tidak marah, tapi membalas dengan penjelasan historis kondisi desa (Goffman). Warga melakukan...", options: ["Manajemen kesan (Impression Management)", "Penetrasi budaya paksa", "Konflik destruktif", "Isolasi digital"], correct: "Manajemen kesan (Impression Management)", discussion: "Tindakan rasional mengatur citra dan mengedukasi panggung depan (front stage).", hintHarmo: "Pengaturan dramaturgi citra komunitas.", hintSoci: "Menjaga harga diri desa dengan argumen cerdas." },
  { q: "Bagas Nauli Fest memperkenalkan 'Bank Sampah' menukar botol dengan tiket. Sistem ini menggabungkan ekologi dan...", options: ["Insentif ekonomi sosial", "Hukuman represif", "Eksploitasi buruh", "Stratifikasi tertutup"], correct: "Insentif ekonomi sosial", discussion: "Mendorong perilaku baik (ekologi) menggunakan penghargaan bernilai ekonomi.", hintHarmo: "Mekanisme reward rasional dalam aksi sosial.", hintSoci: "Berbuat baik dihargai dengan imbalan yang pantas." },
  { q: "Perdebatan keras panitia dianggap wajar karena konflik fungsional berguna untuk mencegah...", options: ["Stagnasi dan kelumpuhan ide", "Mobilitas sosial pemuda", "Asimilasi kebudayaan asing", "Solidaritas mekanik"], correct: "Stagnasi dan kelumpuhan ide", discussion: "Konflik (perdebatan sehat) mencegah pemikiran kelompok (groupthink) dan memunculkan inovasi.", hintHarmo: "Konflik mikro sebagai pemicu dinamika sistem.", hintSoci: "Kelompok yang terlalu diam biasanya menyimpan racun." },
  { q: "Orang tua mendidik anak bahwa kerja keras desa sama mulianya dengan kerja kantoran kota. Ini melawan prasangka...", options: ["Hierarki pekerjaan (Bias Kelas)", "Gender normatif", "Xenosentrisme", "Konformitas massal"], correct: "Hierarki pekerjaan (Bias Kelas)", discussion: "Membongkar stigma bahwa pekerja kasar lebih rendah dari kelas pekerja kota.", hintHarmo: "Dekonstruksi stratifikasi status profesi.", hintSoci: "Setiap tetes keringat pencari nafkah itu suci." },
  { q: "Algoritma aplikasi yang mengumpulkan pembenci tradisi dalam satu grup dituduh memfasilitasi...", options: ["Radikalisasi melalui Echo Chamber", "Integrasi normatif digital", "Akomodasi kultural", "Difusi inovasi"], correct: "Radikalisasi melalui Echo Chamber", discussion: "Mengisolasi ide dan memantulkan kebenaran tunggal melahirkan ekstremisme pandangan.", hintHarmo: "Eskalasi konflik akibat polarisasi digital.", hintSoci: "Kebencian yang dipupuk bersama akan meledak." },
  { q: "Larangan diskusi isu politik praktis selama acara budaya adalah bentuk...", options: ["Pengendalian preventif", "Mediasi ajudikasi", "Segregasi spasial", "Asimilasi politik"], correct: "Pengendalian preventif", discussion: "Larangan dibuat sebelum masalah pecah untuk mencegah terjadinya ketegangan.", hintHarmo: "Mitigasi risiko sosial sistematis.", hintSoci: "Jangan biarkan perbedaan politik merusak pesta warga." },
  { q: "Pemberian porsi keuntungan lebih besar untuk pemilik modal tanah dibanding pekerja tenda disebut kelaziman...", options: ["Struktur Kapitalisme Eksploitatif", "Solidaritas mekanik", "Keadilan komutatif", "Tindakan tradisional"], correct: "Struktur Kapitalisme Eksploitatif", discussion: "Sistem di mana pemilik modal menekan nilai lebih dari pekerja secara struktural.", hintHarmo: "Ketimpangan distribusi nilai tambah (Marx).", hintSoci: "Yang berkeringat justru sering dapat yang paling sedikit." },
  { q: "Pemuda desa berbahasa Indonesia baku di festival, namun berbahasa Batak di rumah. Ini menunjukkan...", options: ["Bilingualisme fungsional (Adaptasi Peran)", "Erosi budaya mutlak", "Disorganisasi identitas", "Konflik laten"], correct: "Bilingualisme fungsional (Adaptasi Peran)", discussion: "Menyesuaikan kode bahasa (peran sosial) berdasarkan setting formal vs informal.", hintHarmo: "Manajemen identitas dalam interaksi simbolik.", hintSoci: "Tahu tempat dan tahu bagaimana menghargai audiens." },
  { q: "Siswa SMA dihormati bukan karena kekayaan orang tua, melainkan kerja keras mereka. Sistem ini berbasis...", options: ["Achieved status (Prestasi)", "Ascribed status (Keturunan)", "Assigned status (Pemberian)", "Kekuatan koersif"], correct: "Achieved status (Prestasi)", discussion: "Status sosial yang diraih melalui usaha keras dan perilaku baik.", hintHarmo: "Penghargaan status berbasis kompetensi/usaha.", hintSoci: "Mereka membuktikan diri dengan kerja, bukan warisan." },
  { q: "Panitia hanya memberi akses rapat pada warga asli Meat dan melarang warga luar desa. Batas ini disebut...", options: ["Batas In-group/Out-group", "Integrasi regional", "Asimilasi spasial", "Solidaritas organik"], correct: "Batas In-group/Out-group", discussion: "Menciptakan garis demarkasi jelas antara 'kami' dan 'mereka'.", hintHarmo: "Pembentukan eksklusivitas keanggotaan institusi.", hintSoci: "Terkadang pintu harus ditutup untuk menjaga privasi rumah." },
  { q: "Sikap turis remaja yang mengenakan ulos sembarangan untuk konten lucu-lucuan disebut fenomena...", options: ["Cultural Appropriation (Apropriasi tanpa respek)", "Akulturasi digital", "Asimilasi visual", "Solidaritas lintas generasi"], correct: "Cultural Appropriation (Apropriasi tanpa respek)", discussion: "Mengambil elemen budaya sakral sebagai komoditas lelucon tanpa menghormatinya.", hintHarmo: "Eksploitasi identitas budaya minoritas.", hintSoci: "Yang sakral bagi warga, bukan mainan bagi pendatang." },
  { q: "Orang tua sepakat di rapat, tapi diam-diam menyabotase keputusan panitia pemuda di belakang. Konflik ini bersifat...", options: ["Laten (Tersembunyi)", "Manifes (Terbuka)", "Arbitratif", "Integratif fungsional"], correct: "Laten (Tersembunyi)", discussion: "Bentuk penentangan yang tidak diekspresikan secara terbuka melainkan sabotase halus.", hintHarmo: "Resistensi struktural di bawah permukaan.", hintSoci: "Api dalam sekam yang sangat berbahaya jika dibiarkan." },
  { q: "Aturan 'Satu User, Satu Suara' dalam voting desain maskot outbubble tanpa memandang status ekonomi menegakkan prinsip...", options: ["Egalitarianisme demokratis", "Oligarki kapital", "Diskriminasi positif", "Mobilitas struktural"], correct: "Egalitarianisme demokratis", discussion: "Setiap individu memiliki bobot politik setara tanpa dipengaruhi status ekonomi.", hintHarmo: "Distribusi kekuasaan politik absolut merata.", hintSoci: "Suara orang kaya dan orang miskin sama-sama satu." },
  { q: "Orang tua akhirnya mengakui kehebatan pemuda setelah melihat panggung modern menarik ribuan turis. Pengakuan ini dinamakan...", options: ["Akomodasi (penerimaan konsensus)", "Etnosentrisme struktural", "Alienasi komunal", "Anomie fungsional"], correct: "Akomodasi (penerimaan konsensus)", discussion: "Penerimaan atas inovasi setelah terbukti sukses secara empiris.", hintHarmo: "Perubahan konformitas berbasis bukti keberhasilan.", hintSoci: "Hati yang keras luluh oleh bukti nyata." },
  { q: "Pemuda agama minoritas diangkat jadi ketua keamanan karena kemampuan negosiasinya (bukan asalnya). Ini cerminan sistem...", options: ["Meritokrasi", "Nepotisme fungsional", "Stereotip institusional", "Kekerasan simbolik"], correct: "Meritokrasi", discussion: "Penempatan jabatan murni didasarkan pada kecakapan kompetensi, bukan identitas suku/agama.", hintHarmo: "Sistem rekrutmen berbasis kapabilitas logis.", hintSoci: "Keadilan yang melihat otak, bukan warna kulit." },
  { q: "Notifikasi aplikasi 'Komentar Anda berpotensi menyakiti hati' berfungsi sebagai pengendalian sosial secara...", options: ["Preventif dan Persuasif", "Represif dan Koersif", "Kuratif asimilatif", "Ajudikasi digital"], correct: "Preventif dan Persuasif", discussion: "Mencegah sebelum tayang secara halus (persuasif).", hintHarmo: "Modifikasi perilaku melalui nudging digital.", hintSoci: "Peringatan kecil yang menyelamatkan perasaan orang lain." },
  { q: "Panitia melarang turis memfoto dapur tradisional warga tanpa izin demi privasi. Kebijakan ini menjunjung...", options: ["Otonomi subjek kebudayaan", "Isolasi spasial absolut", "Eksklusi finansial", "Hegemoni teknologi"], correct: "Otonomi subjek kebudayaan", discussion: "Menghormati hak warga untuk tidak dijadikan sekadar objek tontonan.", hintHarmo: "Perlindungan privasi ranah domestik kultural.", hintSoci: "Kemiskinan warga bukan objek foto eksotis turis." },
  { q: "Anak muda desa lebih fasih K-Pop ketimbang menari Tortor akibat proses...", options: ["Globalisasi & Difusi Budaya Massa", "Asimilasi genetika", "Solidaritas organis", "Isolasi etnosentris"], correct: "Globalisasi & Difusi Budaya Massa", discussion: "Penyebaran budaya populer lintas negara dengan cepat mengubah selera lokal.", hintHarmo: "Arus informasi transnasional tanpa batas.", hintSoci: "Tren dunia mengalahkan tradisi warisan leluhur mereka." },
  { q: "Sosiolog menyarankan forum 'Curhat Warga' pasca festival agar sisa kekesalan tak jadi dendam. Ini adalah fungsi...", options: ["Katarsis (Pembersihan emosi)", "Represi laten", "Mobilisasi vertikal", "Konflik inter-generasional"], correct: "Katarsis (Pembersihan emosi)", discussion: "Pelampiasan aman untuk menguras emosi negatif dan menyeimbangkan psikologis.", hintHarmo: "Mekanisme pelepasan tekanan institusional terstruktur.", hintSoci: "Luka yang diungkapkan akan lebih cepat sembuh." },
  { q: "Tidak menggunakan kontraktor kota melainkan tenaga bambu lokal dalam festival mewujudkan...", options: ["Pembangunan inklusif & pemberdayaan", "Disorganisasi struktural modern", "Stratifikasi kasta pedesaan", "Alienasi pekerja bambu"], correct: "Pembangunan inklusif & pemberdayaan", discussion: "Melibatkan warga lokal agar ekonomi dinikmati langsung akar rumput.", hintHarmo: "Sirkulasi kapital ekonomi pada ranah mikro.", hintSoci: "Memberdayakan tangan-tangan terampil pemuda desa sendiri." },
  { q: "Resolusi konflik sejati saat kedua pihak merasa kepentingannya terlindungi (bukan ada yang kalah). Ini definisi dari...", options: ["Harmoni Sosial Organik", "Integrasi Koersif absolut", "Asimilasi peleburan total", "Solidaritas mekanik"], correct: "Harmoni Sosial Organik", discussion: "Integrasi di mana perbedaan diakui namun diikat oleh rasa saling butuh.", hintHarmo: "Ekuilibrium sosial hasil kompromi dialektis.", hintSoci: "Win-win solution yang membawa kedamaian hakiki." }
];

const TRAP_QUESTIONS: Trap[] = [
  { x: -1, y: -1, q: "Konsep Harmoni Sosial berarti masyarakat sama sekali tidak pernah mengalami konflik sedikitpun.", isTrue: false, discussion: "Konflik adalah hal wajar dalam masyarakat yang dinamis. Harmoni sosial adalah kemampuan mengelola dan menyelesaikan konflik tersebut secara damai, bukan ketiadaannya." },
  { x: -1, y: -1, q: "Toleransi aktif sangat penting untuk mencegah disintegrasi di masyarakat multikultural.", isTrue: true, discussion: "Toleransi aktif memungkinkan perbedaan eksis berdampingan secara fungsional tanpa saling menghancurkan." },
  { x: -1, y: -1, q: "Solidaritas organik biasanya terbentuk pada masyarakat pedesaan yang homogen dan sangat tradisional.", isTrue: false, discussion: "Solidaritas pada masyarakat pedesaan homogen adalah Solidaritas Mekanik. Solidaritas Organik justru ada di masyarakat perkotaan yang heterogen akibat pembagian kerja." },
  { x: -1, y: -1, q: "Inklusi sosial berarti memastikan kelompok marginal atau rentan memiliki akses yang sama terhadap sumber daya publik.", isTrue: true, discussion: "Inklusi adalah kebalikan dari eksklusi (penyingkiran), tujuannya adalah merangkul semua pihak agar setara dalam sistem sosial." },
  { x: -1, y: -1, q: "Sikap etnosentrisme yang tinggi sangat membantu memperkuat integrasi nasional di negara multikultural.", isTrue: false, discussion: "Etnosentrisme (merasa budayanya paling superior) justru memicu perpecahan dan konflik antarsuku di negara multikultural." },
  { x: -1, y: -1, q: "Prinsip Kesetaraan (Equity) selalu berarti memberikan jumlah bantuan material yang persis sama rata kepada semua orang tanpa terkecuali.", isTrue: false, discussion: "Kesetaraan substantif (Equity) berarti memberikan porsi sesuai dengan *kebutuhan* individu untuk mencapai titik adil, bukan sekadar memukul rata (Equality)." },
  { x: -1, y: -1, q: "Dalam proses mediasi, pihak ketiga yang menjadi penengah memiliki wewenang mutlak untuk memaksa kedua belah pihak menerima keputusannya.", isTrue: false, discussion: "Pihak ketiga dalam Mediasi HANYA sebagai fasilitator/penasihat. Jika pihak ketiga berhak memaksa keputusan, itu disebut Arbitrase." },
  { x: -1, y: -1, q: "Asimilasi terjadi ketika dua kebudayaan bercampur menghasilkan kebudayaan baru, dan identitas kebudayaan aslinya perlahan menghilang.", isTrue: true, discussion: "Berbeda dengan Akulturasi (di mana budaya asli tetap bertahan), Asimilasi meleburkan identitas hingga menghasilkan sesuatu yang sepenuhnya baru." },
  { x: -1, y: -1, q: "Tingkat kohesi sosial (kerekatan hubungan) yang tinggi di suatu desa menjamin desa tersebut tidak akan pernah mengalami perubahan sosial.", isTrue: false, discussion: "Kohesi sosial yang kuat justru dapat memfasilitasi warga desa untuk bergotong-royong menghadapi dan menyukseskan perubahan sosial bersama-sama." },
  { x: -1, y: -1, q: "Segregasi spasial (pemisahan tempat tinggal berdasarkan kelas/ras) terbukti dapat mempercepat proses asimilasi budaya.", isTrue: false, discussion: "Segregasi justru memperlambat atau menghalangi integrasi/asimilasi karena meminimalkan ruang interaksi langsung antar kelompok." },
  { x: -1, y: -1, q: "Interseksi sosial, yaitu persilangan keanggotaan individu dalam berbagai kelompok berbeda, berpotensi mengurangi ketegangan identitas yang kaku.", isTrue: true, discussion: "Interseksi membuat individu menyadari kesamaan dengan orang lain dari kelompok berbeda, sehingga melemahkan fanatisme sempit." },
  { x: -1, y: -1, q: "Kebijakan afirmasi (diskriminasi positif) dibuat dengan tujuan untuk menindas kelompok mayoritas di ruang publik.", isTrue: false, discussion: "Afirmasi bertujuan untuk mendongkrak kelompok minoritas atau tertinggal agar bisa bersaing sejajar, BUKAN untuk menindas kelompok yang sudah maju." },
  { x: -1, y: -1, q: "Konsensus (kesepakatan) nilai-nilai dasar adalah syarat fundamental bagi terciptanya integrasi normatif di masyarakat.", isTrue: true, discussion: "Integrasi normatif hanya bisa berdiri kokoh jika mayoritas masyarakat menyepakati pedoman (norma) yang sama." },
  { x: -1, y: -1, q: "Dalam sosiologi, konflik selalu dipandang bersifat destruktif dan tidak pernah membawa manfaat bagi kelompok yang bertikai.", isTrue: false, discussion: "Terdapat konflik fungsional (konstruktif) yang justru dapat memperjelas batas-batas kelompok, memperbaiki sistem, atau memperkuat solidaritas internal." },
  { x: -1, y: -1, q: "Sistem stratifikasi sosial tertutup, seperti sistem kasta, membuat laju mobilitas sosial vertikal (naik/turun kelas) menjadi sangat sulit terjadi.", isTrue: true, discussion: "Sistem tertutup membatasi akses perubahan status, sehingga kedudukan individu sangat ditentukan oleh keturunan (ascribed status)." },
  { x: -1, y: -1, q: "Sikap primordialisme yang berlebihan (loyalitas buta pada suku/agama sendiri) sangat membahayakan semangat persatuan bangsa.", isTrue: true, discussion: "Primordialisme berlebih melahirkan chauvinisme atau separatisme yang dapat merobek ikatan kohesi sosial makro sebuah negara." },
  { x: -1, y: -1, q: "Akomodasi adalah proses penyesuaian diri antara dua belah pihak yang bersengketa untuk meredakan pertentangan tanpa menghancurkan pihak lawan.", isTrue: true, discussion: "Akomodasi berfokus pada ekuilibrium (keseimbangan) dan perdamaian sementara, seperti melalui kompromi atau gencatan senjata." },
  { x: -1, y: -1, q: "Cultural Lag (ketertinggalan budaya) terjadi ketika perkembangan pola pikir dan adat istiadat berubah lebih cepat daripada perkembangan teknologi mesin.", isTrue: false, discussion: "Sebaliknya! Cultural Lag terjadi ketika teknologi material (mesin/internet) berkembang sangat cepat, namun kesiapan mental/budaya non-material tertinggal." }
];

// --- 4. ENGINE GENERATOR LABIRIN ---
const shuffleArray = (array: any[]) => array.sort(() => 0.5 - Math.random());

const generateMazeData = () => {
  const posts: MazePost[] = [];
  const traps: Trap[] = [];
  let postId = 1;

  let availableMedium = shuffleArray([...MEDIUM_QUESTIONS]);
  let availableHard = shuffleArray([...HARD_QUESTIONS]);

  for (let y = 0; y < MAZE_GRID.length; y++) {
    for (let x = 0; x < MAZE_GRID[y].length; x++) {
      if (MAZE_GRID[y][x] === 1 && !(x === 0 && y === 0)) {
        const top = (y > 0 && MAZE_GRID[y-1][x] === 1) ? 1 : 0;
        const bottom = (y < MAZE_GRID.length - 1 && MAZE_GRID[y+1][x] === 1) ? 1 : 0;
        const left = (x > 0 && MAZE_GRID[y][x-1] === 1) ? 1 : 0;
        const right = (x < MAZE_GRID[y].length - 1 && MAZE_GRID[y][x+1] === 1) ? 1 : 0;
        const isStraightLine = (top && bottom && !left && !right) || (!top && !bottom && left && right);

        if (!isStraightLine && postId <= 46) {
          let qPair: Question[] = [];
          if (postId <= 23) {
            if (availableMedium.length < 2) availableMedium = shuffleArray([...MEDIUM_QUESTIONS]);
            qPair = availableMedium.splice(0, 2);
          } else {
            if (availableHard.length < 2) availableHard = shuffleArray([...HARD_QUESTIONS]);
            qPair = availableHard.splice(0, 2);
          }
          // Acak opsi jawaban di dalam soal
          qPair = qPair.map(q => ({ ...q, options: shuffleArray([...q.options]) }));
          
          posts.push({ id: postId, x, y, title: `Pos ${postId}`, questions: qPair });
          postId++;
        } else if (isStraightLine && Math.random() > 0.8) {
          // Buat Jebakan di jalur lurus secara acak
          const randomTrap = TRAP_QUESTIONS[Math.floor(Math.random() * TRAP_QUESTIONS.length)];
          traps.push({ x, y, q: randomTrap.q, isTrue: randomTrap.isTrue, discussion: randomTrap.discussion });
        }
      }
    }
  }
  return { posts, traps };
};

// --- 5. MAIN COMPONENT ---
export default function SocialMaze() {
  const { profile } = useAuth();
  const { posts, traps } = useMemo(() => generateMazeData(), []);
  
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [completedPosts, setCompletedPosts] = useState<number[]>([]);
  
  const [activePost, setActivePost] = useState<MazePost | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0); 
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [postStatus, setPostStatus] = useState<'playing' | 'failed' | 'success'>('playing');
  const [activeHint, setActiveHint] = useState<'harmo' | 'soci' | null>(null);

  const [activeTrap, setActiveTrap] = useState<Trap | null>(null);
  const [trapFeedback, setTrapFeedback] = useState<{success: boolean, msg: string} | null>(null);
  
  // State untuk Penghargaan Kelipatan 5
  const [showReward, setShowReward] = useState(false);
  const [lastRewardedMilestone, setLastRewardedMilestone] = useState(0);

  useEffect(() => {
    const currentCount = completedPosts.length;
    if (currentCount > 0 && currentCount % 5 === 0 && currentCount !== lastRewardedMilestone) {
      setShowReward(true);
      setLastRewardedMilestone(currentCount);
    }
  }, [completedPosts.length, lastRewardedMilestone]);

  const currentPostAtPlayer = posts.find(p => p.x === playerPos.x && p.y === playerPos.y);
  const isCurrentPostCompleted = currentPostAtPlayer ? completedPosts.includes(currentPostAtPlayer.id) : false;

  const movePlayer = (dx: number, dy: number) => {
    if (activePost || activeTrap || showReward) return; 

    const nextX = playerPos.x + dx;
    const nextY = playerPos.y + dy;

    if (
      nextY >= 0 && nextY < MAZE_GRID.length &&
      nextX >= 0 && nextX < MAZE_GRID[0].length &&
      MAZE_GRID[nextY][nextX] === 1
    ) {
      setPlayerPos({ x: nextX, y: nextY });

      const trapOnSpot = traps.find(t => t.x === nextX && t.y === nextY);
      if (trapOnSpot) {
        setActiveTrap(trapOnSpot);
        setTrapFeedback(null);
      }
    }
  };

  const handleStartPost = () => {
    if (currentPostAtPlayer && !isCurrentPostCompleted) {
      setActivePost(currentPostAtPlayer);
      setCurrentQIndex(0);
      setShowFeedback(false);
      setSelectedOption(null);
      setActiveHint(null);
      setPostStatus('playing');
    }
  };

  const handleAnswer = (option: string) => {
    if (!activePost) return;
    const isCorrect = option === activePost.questions[currentQIndex].correct;
    setSelectedOption(option);
    setShowFeedback(true);

    if (!isCorrect) {
      setPostStatus('failed');
    } else if (currentQIndex === 1) {
      setPostStatus('success');
    }
  };

  const handleNextStep = async () => {
    if (postStatus === 'failed') {
      setActivePost(null);
    } else if (postStatus === 'success') {
      if (activePost && !completedPosts.includes(activePost.id)) {
        const newCompletedPosts = [...completedPosts, activePost.id];
        setCompletedPosts(newCompletedPosts);
        
        // SYNC TO FIREBASE
        if (profile) {
          try {
            const updatePayload: any = {
              exp: increment(25), // Hadiah EXP per pos
              coins: increment(10), // Hadiah koin per pos
            };

            // Achievement: Maze Runner (if all posts finished)
            if (newCompletedPosts.length === posts.length) {
              const newBadges = [...(profile.badges || [])];
              if (!newBadges.includes('Maze Runner')) {
                newBadges.push('Maze Runner');
                updatePayload.badges = newBadges;
              }
            }

            await updateDoc(doc(db, 'users', profile.uid), updatePayload);
          } catch (error) {
            handleFirestoreError(error, OperationType.UPDATE, `users/${profile.uid}`);
          }
        }
      }
      setActivePost(null);
    } else {
      setCurrentQIndex(1);
      setShowFeedback(false);
      setSelectedOption(null);
      setActiveHint(null);
    }
  };

  const handleTrapAnswer = (answer: boolean) => {
    if (!activeTrap) return;
    const isCorrect = answer === activeTrap.isTrue;
    
    if (isCorrect) {
      setTrapFeedback({ success: true, msg: activeTrap.discussion });
    } else {
      setTrapFeedback({ success: false, msg: activeTrap.discussion });
      setTimeout(() => { setPlayerPos({ x: 0, y: 0 }); }, 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 p-4 font-sans">
      <header className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-[#1A202C] tracking-tighter">Social Maze <span className="text-[#2D3748]">Labirin</span></h1>
          <p className="text-slate-500 font-medium italic">Temukan pos tersembunyi di sudut-sudut labirin!</p>
        </div>
        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border-4 border-slate-100 shadow-sm">
          <div className="text-center"><p className="text-[10px] font-black text-slate-400 uppercase">Progress</p><p className="text-xl font-black text-indigo-600">{completedPosts.length} / {posts.length}</p></div>
          <LayoutGrid size={32} className="text-indigo-600" />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AREA PETA */}
        <div className="lg:col-span-2 bg-white p-4 rounded-[2rem] border-4 border-slate-200 shadow-xl overflow-x-auto">
          <div className="grid gap-0 border-2 border-slate-800 min-w-[500px]" style={{ gridTemplateColumns: `repeat(${MAZE_GRID[0].length}, minmax(0, 1fr))`, backgroundColor: '#1e293b' }}>
            {MAZE_GRID.map((row, y) => (
              row.map((cell, x) => {
                const isWall = cell === 0;
                const isPlayer = playerPos.x === x && playerPos.y === y;
                const postHere = posts.find(p => p.x === x && p.y === y);
                const trapHere = traps.find(t => t.x === x && t.y === y);
                const isCompleted = postHere ? completedPosts.includes(postHere.id) : false;

                return (
                  <div key={`${x}-${y}`} className={`aspect-square relative flex items-center justify-center transition-all ${isWall ? 'bg-slate-800' : 'bg-slate-50 border border-slate-200'} ${isCompleted ? 'bg-green-100' : ''}`}>
                    {!isWall && (
                      <>
                        {postHere && !isPlayer && !isCompleted && (
                          <div className="flex flex-col items-center">
                             <span className="text-[8px] font-black text-indigo-600">{postHere.id}</span>
                             <Lock size={10} className="text-indigo-300" />
                          </div>
                        )}
                        {trapHere && !isPlayer && !postHere && <ShieldAlert size={10} className="text-red-200 opacity-30" />}
                        {isCompleted && !isPlayer && <CheckCircle2 size={16} className="text-green-500" />}
                      </>
                    )}
                    {isPlayer && <motion.div layoutId="player" className="absolute z-10 text-xl md:text-2xl drop-shadow-md">🦁</motion.div>}
                  </div>
                );
              })
            ))}
          </div>
        </div>

        {/* SIDEBAR & KONTROL */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border-4 border-slate-100 shadow-lg text-center">
            <h3 className="text-xs font-black text-slate-400 uppercase mb-4 tracking-widest italic underline">Gunakan Panah Untuk Bergerak</h3>
            <div className="grid grid-cols-3 gap-2 max-w-[140px] mx-auto">
              <div /><button onClick={() => movePlayer(0, -1)} className="p-3 bg-slate-100 rounded-lg hover:bg-indigo-100 active:scale-90 transition-all"><ArrowUp size={20}/></button><div />
              <button onClick={() => movePlayer(-1, 0)} className="p-3 bg-slate-100 rounded-lg hover:bg-indigo-100 active:scale-90 transition-all"><ArrowLeft size={20}/></button>
              <button onClick={() => movePlayer(0, 1)} className="p-3 bg-slate-100 rounded-lg hover:bg-indigo-100 active:scale-90 transition-all"><ArrowDown size={20}/></button>
              <button onClick={() => movePlayer(1, 0)} className="p-3 bg-slate-100 rounded-lg hover:bg-indigo-100 active:scale-90 transition-all"><ArrowRight size={20}/></button>
            </div>
          </div>

          <div className="bg-[#2D3748] p-6 rounded-2xl border-4 border-[#4A5568] text-white">
            <h4 className="text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-2 text-indigo-300"><ShieldAlert size={16} /> Game Rules</h4>
            <ul className="text-[12px] font-medium space-y-2 opacity-90">
              <li>• Pos 1-23 (Menengah), Pos 24-46 (Kritis/Sulit).</li>
              <li>• <strong>Strict Mode:</strong> Salah 1 soal, pos di-reset!</li>
              <li className="text-blue-300 flex items-center gap-1"><Brain size={12}/> <strong>Hint Harmo:</strong> Bantuan logika/struktural.</li>
              <li className="text-pink-300 flex items-center gap-1"><Heart size={12}/> <strong>Hint Soci:</strong> Bantuan empati/kultural.</li>
              <li className="text-red-300 font-bold mt-2 pt-2 border-t border-slate-600">⚠️ Awas Social Traps di jalan lurus!</li>
            </ul>
          </div>

          <div className={`p-6 rounded-2xl border-4 text-center transition-all shadow-lg ${currentPostAtPlayer && !isCurrentPostCompleted ? 'bg-indigo-600 border-indigo-400' : currentPostAtPlayer && isCurrentPostCompleted ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
            {currentPostAtPlayer && !isCurrentPostCompleted ? (
              <div className="space-y-3">
                <p className="text-sm font-bold text-white uppercase tracking-widest">Kamu berada di {currentPostAtPlayer.title}</p>
                <button onClick={handleStartPost} className="w-full py-3 bg-white text-indigo-700 rounded-xl font-black uppercase tracking-widest text-sm shadow-md hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2">
                  <PlayCircle size={20} /> Mulai Tantangan
                </button>
              </div>
            ) : currentPostAtPlayer && isCurrentPostCompleted ? (
              <div className="space-y-2 text-green-700">
                <CheckCircle2 size={24} className="mx-auto" />
                <p className="text-sm font-black uppercase tracking-widest">{currentPostAtPlayer.title} Selesai</p>
              </div>
            ) : (
              <div className="space-y-2 text-slate-400">
                <Lock size={24} className="mx-auto opacity-50" />
                <p className="text-xs font-bold uppercase tracking-widest">Temukan Pos Untuk Memulai</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL PERTANYAAN */}
      <AnimatePresence>
        {activePost && (
          <motion.div className="fixed inset-0 z-[60] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }} className={`bg-white rounded-[2rem] border-4 max-w-lg w-full shadow-2xl flex flex-col max-h-[90vh] ${postStatus === 'failed' ? 'border-red-500' : postStatus === 'success' ? 'border-green-500' : 'border-indigo-600'}`}>
              <div className="p-6 md:p-8 space-y-5 overflow-y-auto">
                <div className="flex justify-between items-center border-b pb-4">
                  <div>
                    <h3 className="font-black text-xl text-slate-800 uppercase">{activePost.title}</h3>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${activePost.id <= 23 ? 'text-blue-500' : 'text-red-500'}`}>
                      {activePost.id <= 23 ? 'SOAL MENENGAH' : 'SOAL KRITIS'} - {currentQIndex + 1}/2
                    </p>
                  </div>
                  {postStatus === 'playing' && (
                    <div className="flex gap-2">
                       <button onClick={() => setActiveHint('harmo')} className={`p-2 rounded-xl transition-all ${activeHint === 'harmo' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}`} title="Harmo (Logika)"><Brain size={20}/></button>
                       <button onClick={() => setActiveHint('soci')} className={`p-2 rounded-xl transition-all ${activeHint === 'soci' ? 'bg-pink-500 text-white' : 'bg-pink-100 text-pink-500'}`} title="Soci (Empati)"><Heart size={20}/></button>
                    </div>
                  )}
                </div>

                {activeHint && postStatus === 'playing' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className={`p-4 rounded-xl text-sm font-medium italic border-l-4 ${activeHint === 'harmo' ? 'bg-blue-50 border-blue-500 text-blue-800' : 'bg-pink-50 border-pink-500 text-pink-800'}`}>
                    <p>"{activeHint === 'harmo' ? activePost.questions[currentQIndex].hintHarmo : activePost.questions[currentQIndex].hintSoci}"</p>
                  </motion.div>
                )}

                {!showFeedback ? (
                  <div className="space-y-4">
                    <p className="font-bold text-slate-800 text-base md:text-lg leading-snug">"{activePost.questions[currentQIndex].q}"</p>
                    <div className="flex flex-col gap-2">
                      {activePost.questions[currentQIndex].options.map((opt) => (
                        <button key={opt} onClick={() => handleAnswer(opt)} className="p-4 rounded-xl bg-slate-50 border-2 border-slate-200 text-left text-sm font-bold text-slate-700 hover:border-indigo-400 transition-all active:scale-95">{opt}</button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                    <div className={`p-4 rounded-xl flex items-start gap-3 ${postStatus === 'failed' ? 'bg-red-50 text-red-800 border-red-200' : 'bg-green-50 text-green-800 border-green-200'}`}>
                      {postStatus === 'failed' ? <XCircle className="shrink-0 mt-1 text-red-500" /> : <CheckCircle2 className="shrink-0 mt-1 text-green-500" />}
                      <div>
                        <p className="font-black uppercase text-xs mb-1">{postStatus === 'failed' ? 'Jawaban Salah! Pos Gagal.' : 'Tepat Sekali!'}</p>
                        <p className="text-sm font-medium italic">"{activePost.questions[currentQIndex].discussion}"</p>
                      </div>
                    </div>
                    <button onClick={handleNextStep} className={`w-full py-4 text-white rounded-xl font-black uppercase tracking-widest text-sm shadow-lg active:scale-95 transition-transform ${postStatus === 'failed' ? 'bg-red-600' : 'bg-indigo-600'}`}>
                      {postStatus === 'failed' ? 'Tutup & Ulangi Nanti' : postStatus === 'success' ? 'Selesaikan Pos' : 'Lanjut ke Pertanyaan 2'}
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: SOCIAL TRAP */}
      <AnimatePresence>
        {activeTrap && (
          <motion.div className="fixed inset-0 z-[70] bg-red-900/90 backdrop-blur-md flex items-center justify-center p-4">
             <div className="bg-white p-8 md:p-10 rounded-[3rem] text-center space-y-6 max-w-md shadow-2xl border-8 border-red-500">
               <ShieldAlert size={64} className="mx-auto text-red-600 animate-bounce" />
               <h2 className="text-3xl font-black text-red-600 uppercase">Social Trap!</h2>
               {!trapFeedback ? (
                 <>
                  <p className="font-bold text-slate-800 text-lg">"{activeTrap.q}"</p>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <button onClick={() => handleTrapAnswer(true)} className="py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg">BENAR</button>
                    <button onClick={() => handleTrapAnswer(false)} className="py-4 bg-slate-800 text-white font-black rounded-2xl shadow-lg">SALAH</button>
                  </div>
                 </>
               ) : (
                 <div className="space-y-6">
                    <div className={`p-4 rounded-xl flex items-center justify-center gap-2 font-black uppercase ${trapFeedback.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                       {trapFeedback.success ? <CheckCircle2 /> : <XCircle />}
                       {trapFeedback.success ? 'Berhasil Lolos!' : 'Jebakan Terpicu!'}
                    </div>
                    <p className="text-sm font-medium italic text-slate-600">"{trapFeedback.msg}"</p>
                    <button onClick={() => setActiveTrap(null)} className={`w-full py-4 text-white font-black rounded-2xl ${trapFeedback.success ? 'bg-green-600' : 'bg-red-600'}`}>
                      {trapFeedback.success ? 'Lanjut Eksplorasi' : 'Kembali ke Start'}
                    </button>
                 </div>
               )}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: PENGHARGAAN KELIPATAN 5 POS */}
      <AnimatePresence>
        {showReward && (
          <motion.div className="fixed inset-0 z-[80] bg-indigo-900/90 backdrop-blur-md flex items-center justify-center p-4">
             <div className="bg-white p-8 md:p-10 rounded-[3rem] text-center space-y-6 max-w-md shadow-2xl border-8 border-yellow-400">
                <Gift size={64} className="mx-auto text-yellow-500 animate-pulse" />
                <div>
                   <h2 className="text-3xl font-black text-slate-800 uppercase">Pencapaian Terbuka!</h2>
                   <p className="font-bold text-indigo-600 mt-2">Kamu sudah menyelesaikan {completedPosts.length} Pos</p>
                </div>
                
                <div className="space-y-4 text-left bg-slate-50 p-6 rounded-2xl border-2 border-slate-100">
                  <div className="flex gap-4">
                    <div className="bg-blue-100 p-3 rounded-full h-fit"><Brain className="text-blue-600" size={24}/></div>
                    <div><p className="font-black text-sm text-blue-700">HARMO</p><p className="text-sm font-medium text-slate-600 leading-snug">"Analisis strukturalmu luar biasa! Tetap pertahankan nalar kritis ini di pos-pos berikutnya."</p></div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-pink-100 p-3 rounded-full h-fit"><Heart className="text-pink-500" size={24}/></div>
                    <div><p className="font-black text-sm text-pink-600">SOCI</p><p className="text-sm font-medium text-slate-600 leading-snug">"Kamu sangat hebat menjaga harmoni! Mari terus menyebarkan empati dan merangkul perbedaan."</p></div>
                  </div>
                </div>
                <button onClick={() => setShowReward(false)} className="w-full py-4 bg-yellow-500 hover:bg-yellow-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl active:scale-95 transition-transform">
                  Terima Kasih! Lanjut Main
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}