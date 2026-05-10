import { 
  Cat, 
  Dog, 
  Rabbit, 
  Panda, 
  Trophy,
  Flame,
  Coins,
  Star
} from 'lucide-react';

export const ANIMALS = [
  { id: 'cat', name: 'Kucing Lucu', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix', price: 0 },
  { id: 'dog', name: 'Anjing Setia', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Buddy', price: 0 },
  { id: 'rabbit', name: 'Kelinci Lincah', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Bunny', price: 100 },
  { id: 'panda', name: 'Panda Gemoy', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Panda', price: 250 },
  { id: 'fox', name: 'Rubah Pintar', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Foxy', price: 500 },
  { id: 'bear', name: 'Beruang Kuat', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Bear', price: 750 },
  { id: 'koala', name: 'Koala Santai', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Koala', price: 1000 },
  { id: 'tiger', name: 'Harimau Berani', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Tiger', price: 2000 },
];

export const DAILY_REWARDS = [50, 100, 150, 200, 250, 300, 500];

export const INITIAL_PROGRESS = {
  xp: 1250,
  score: 85,
  level: 5,
  badges: [
    { id: '1', name: 'Pembelajar Aktif', icon: '🌟', description: 'Menyelesaikan tantangan harian secara rutin.' },
    { id: '2', name: 'Komunikator Baik', icon: '💬', description: 'Berpartisipasi aktif dalam diskusi kelompok.' }
  ],
  materiOpened: ['harmoni-sosial']
};

export const DAILY_TIPS = [
  { title: "Saling Menghargai", content: "Menghargai perbedaan adalah kunci harmoni.", icon: "🤝" },
  { title: "Empati", content: "Coba bayangkan dirimu di posisi orang lain.", icon: "❤️" },
  { title: "Komunikasi", content: "Bicarakan masalah dengan kepala dingin.", icon: "🗣️" }
];

export const MATERI_LIST = [
  { id: 'harmoni-sosial', title: 'Hakikat Harmoni Sosial', category: 'Sosiologi', type: 'Dasar' }
];

export const STORY_NODES: Record<string, any> = {
  // CHAPTER 1: IDENTIFIKASI KONFLIK ( Hakikat Harmoni )
  start: {
    chapter: 1,
    concept: "Empati & Respons Sosial",
    text: "Pagi yang cerah di SMA Harapan. Kamu melihat Budi, siswa pendiam, sedang dipalak oleh sekelompok siswa populer di belakang sekolah. Apa tindakanmu?",
    choices: [
      { text: "Mendekat dan membela Budi secara langsung", nextNodeId: "direct_defend", karma: 10 },
      { text: "Melaporkan kejadian ini ke Guru BK", nextNodeId: "report_teacher", karma: 15 },
      { text: "Pura-pura tidak melihat dan pergi", nextNodeId: "ignore", karma: -20 }
    ]
  },
  direct_defend: {
    chapter: 1,
    concept: "Keberanian Moral",
    text: "Kamu mendatangi mereka. 'Hei, berhenti! Itu tidak benar!'. Kelompok tersebut tertegun, namun mereka mulai mengejekmu juga. Budi berhasil lari, tapi kamu sekarang jadi target. Bagaimana reaksimu?",
    choices: [
      { text: "Tetap tenang dan jelaskan bahwa bullying itu melanggar aturan", nextNodeId: "stay_calm", karma: 15 },
      { text: "Marah dan menantang mereka berkelahi", nextNodeId: "fight", karma: -5 }
    ]
  },
  report_teacher: {
    chapter: 1,
    concept: "Akomodasi (Mediasi)",
    text: "Kamu segera lari ke ruang Guru BK. Bu Sarah merespons cepat dan mendatangi lokasi. Para pem-bully diberikan sanksi, dan Budi merasa terlindungi. Namun, kelompok tersebut menyimpan dendam padamu. Apa yang kamu lakukan?",
    choices: [
      { text: "Ajak mereka bicara baik-baik untuk rekonsiliasi", nextNodeId: "reconciliation_attempt", karma: 20 },
      { text: "Abaikan saja, yang penting Budi aman", nextNodeId: "chapter2_start", karma: 0 }
    ]
  },
  reconciliation_attempt: {
    chapter: 1,
    concept: "Rekonsiliasi Sosial",
    text: "Kamu mendekati mereka saat jam istirahat. Kamu menjelaskan bahwa kamu tidak bermaksud memusuhi mereka, tapi hanya ingin sekolah yang nyaman untuk semua. Mereka mulai luluh. Suasana menjadi lebih tenang.",
    choices: [{ text: "Lanjut ke Chapter 2: Integrasi", nextNodeId: "chapter2_start" }]
  },
  stay_calm: {
    chapter: 1,
    concept: "Penyelesaian Konflik",
    text: "Ketegasanmu yang tenang membuat mereka merasa malu sendiri. Beberapa teman lain mulai datang mendukungmu. Kelompok tersebut akhirnya pergi. Hubungan pertemanan di kelas jadi lebih solid.",
    choices: [{ text: "Lanjut ke Chapter 2: Integrasi", nextNodeId: "chapter2_start" }]
  },
  ignore: {
    chapter: 1,
    concept: "Negasi Harmoni",
    endingType: "Bad",
    text: "Kamu memilih abai. Malamnya, kamu mendapat kabar bahwa Budi masuk rumah sakit karena dikeroyok kelompok tersebut. Rasa bersalah menghantuimu selamanya. Kamu gagal menjadi agen harmoni.",
    choices: [{ text: "Ulangi dari Awal (Reset)", nextNodeId: "start" }]
  },
  fight: {
    chapter: 1,
    concept: "Konflik Destruktif",
    endingType: "Sad",
    text: "Kamu terpancing emosi dan berkelahi. Meskipun kamu membela Budi, caramu menggunakan kekerasan membuatmu ikut diskors oleh sekolah. Niat baik yang dieksekusi dengan buruk tetaplah merugikan harmoni.",
    choices: [{ text: "Ulangi Pilihan (Reset)", nextNodeId: "start" }]
  },

  // CHAPTER 2: INTEGRASI SOSIAL ( Proyek Kelompok )
  chapter2_start: {
    chapter: 2,
    concept: "Integrasi Sosial",
    text: "Sebulan kemudian, ada proyek besar sosiologi. Guru memintamu membentuk kelompok dengan siswa dari latar belakang yang sangat berbeda: ada yang sangat kaya, ada penerima beasiswa, dan ada siswa pindahan. Dalam diskusi perdana, terjadi perdebatan sengit soal pembagian biaya proyek.",
    choices: [
      { text: "Mengusulkan biaya yang proporsional sesuai kemampuan", nextNodeId: "equity_strategy", karma: 15 },
      { text: "Meminta semua patungan sama rata tanpa mau tahu", nextNodeId: "equality_fail", karma: -10 },
      { text: "Mencari dana alternatif (sponsor atau jualan snack)", nextNodeId: "creative_integration", karma: 20 }
    ]
  },
  equity_strategy: {
    chapter: 2,
    concept: "Ekuitas & Keadilan Sosial",
    text: "Kamu mengajukan ide: 'Yang mampu berkontribusi lebih di dana, yang lain bisa lebih di tenaga atau riset'. Semua sepakat karena merasa dihargai. Integrasi mulai terbentuk.",
    choices: [{ text: "Lanjut ke Tahap Berikutnya", nextNodeId: "deliberation" }]
  },
  equality_fail: {
    chapter: 2,
    concept: "Ketimpangan Sosial",
    endingType: "Bad",
    text: "Sikapmu yang kaku membuat siswa penerima beasiswa merasa terbebani dan akhirnya mengundurkan diri dari kelompok. Kelompokmu bubar karena diskriminasi ekonomi yang tidak sengaja kau ciptakan.",
    choices: [{ text: "Ulangi Chapter 2", nextNodeId: "chapter2_start" }]
  },
  creative_integration: {
    chapter: 2,
    concept: "Solidaritas Organik",
    text: "Ide jualan snack membuat kelompokmu makin kompak karena sering bertemu untuk berjualan. Perbedaan latar belakang terlupakan karena tujuan ekonomi bersama. Integrasi tercapai secara sempurna!",
    choices: [{ text: "Lanjut ke Chapter 3: Inklusi", nextNodeId: "chapter3_start" }]
  },
  deliberation: {
    chapter: 2,
    concept: "Konsensus & Solidaritas",
    text: "Musyawarah berjalan lancar. Siswa pindahan memberikan ide brilian soal budaya lokal yang unik. Kelompokmu menjadi yang terbaik karena keberagaman idenya. Apa langkah selanjutnya?",
    choices: [
      { text: "Mengajak kelompok makan bareng untuk merayakan (Cohesion)", nextNodeId: "social_cohesion", karma: 10 },
      { text: "Langsung lanjut ke persiapan Festival Budaya", nextNodeId: "chapter3_start", karma: 0 }
    ]
  },
  social_cohesion: {
    chapter: 2,
    concept: "Kohesi Sosial",
    text: "Sambil makan es kelapa, kalian saling bercerita soal kesulitan hidup masing-masing. Jarak sosial runtuh. Kalian sekarang bukan sekadar teman sekelas, tapi sahabat sejati.",
    choices: [{ text: "Lanjut ke Chapter 3: Inklusi", nextNodeId: "chapter3_start" }]
  },

  // CHAPTER 3: INKLUSI & TOLERANSI ( Festival Budaya )
  chapter3_start: {
    chapter: 3,
    concept: "Inklusi Sosial",
    text: "Sekolah mengadakan Festival Budaya. Muncul desas-desus bahwa penampilan komunitas minoritas akan disabotase oleh pihak luar yang provokatif. Sebagai panitia keamanan, apa tindakanmu?",
    choices: [
      { text: "Bekerja sama dengan guru dan keamanan untuk proteksi ketat", nextNodeId: "security_win", karma: 15 },
      { text: "Membatalkan penampilan mereka demi keamanan bersama", nextNodeId: "exclusion_fail", karma: -20 },
      { text: "Mengajak seluruh siswa untuk menjadi pagar betis pelindung", nextNodeId: "inclusive_action", karma: 25 }
    ]
  },
  security_win: {
    chapter: 3,
    concept: "Proteksi Minoritas",
    text: "Acara berjalan aman. Meskipun ada sedikit gangguan, sistem keamanan yang kamu bangun terbukti efektif. Semua budaya bisa tampil dengan bebas.",
    choices: [{ text: "Lanjut ke Tantangan Akhir", nextNodeId: "chapter4_start" }]
  },
  exclusion_fail: {
    chapter: 3,
    concept: "Eksklusi Sosial",
    endingType: "Sad",
    text: "Kamu memilih jalan aman dengan membatalkan mereka. Keamanan terjaga, tapi kamu baru saja melegitimasi diskriminasi. Komunitas tersebut merasa dikhianati oleh sekolahnya sendiri.",
    choices: [{ text: "Ulangi Chapter 3", nextNodeId: "chapter3_start" }]
  },
  inclusive_action: {
    chapter: 3,
    concept: "Toleransi Aktif",
    text: "Luar biasa! Ribuan siswa bergandengan tangan melindungi panggung. Para provokator pergi karena malu melihat persatuan kalian. Inilah puncak dari harmoni sosial di sekolah!",
    choices: [{ text: "Lanjut ke Tantangan Akhir", nextNodeId: "chapter4_start" }]
  },

  // CHAPTER 4: DIGITAL HARMONY ( Melawan Hoax & Polarisasi )
  chapter4_start: {
    chapter: 4,
    concept: "Literasi Digital & Harmoni",
    text: "Menjelang pemilihan ketua OSIS, grup WhatsApp kelas ramai dengan berita hoax yang menyudutkan salah satu calon atas dasar agamanya. Polarisasi mulai terjadi di kelas. Apa yang kamu lakukan?",
    choices: [
      { text: "Kirim bukti fakta (fact-check) untuk meredam hoax", nextNodeId: "fact_check_win", karma: 20 },
      { text: "Keluar dari grup karena malas melihat pertengkaran", nextNodeId: "digital_apathy", karma: -10 },
      { text: "Melaporkan akun penyebar pertama ke admin dan guru", nextNodeId: "digital_regulation", karma: 15 }
    ]
  },
  fact_check_win: {
    chapter: 4,
    concept: "Rasio Komunikatif",
    text: "Data yang kamu berikan sangat valid. Teman-teman yang tadinya terprovokasi mulai sadar dan malu. Kelas kembali tenang dan fokus pada adu program, bukan adu fitnah.",
    choices: [{ text: "Lihat Hasil Akhir Perjalananmu", nextNodeId: "ending_good" }]
  },
  digital_apathy: {
    chapter: 4,
    concept: "Anomie Digital",
    endingType: "Sad",
    text: "Kamu memilih diam. Hoax tersebut menyebar luas hingga terjadi konflik fisik di sekolah saat hari pemilihan. Kamu sadar bahwa di era digital, diam bisa menjadi bensin bagi api konflik.",
    choices: [{ text: "Ulangi Chapter 4", nextNodeId: "chapter4_start" }]
  },
  digital_regulation: {
    chapter: 4,
    concept: "Pengendalian Sosial Digital",
    text: "Tindakanmu tepat. Penyebar hoax adalah provokator dari luar sekolah yang ingin memecah belah. Guru segera bertindak dan keharmonisan kelas terselamatkan.",
    choices: [{ text: "Lihat Hasil Akhir Perjalananmu", nextNodeId: "ending_good" }]
  },

  // FINAL ENDINGS
  ending_good: {
    chapter: 4,
    concept: "Agent of Harmony",
    endingType: "Good",
    text: "Selamat! Kamu telah menjadi Agent of Harmony sejati. Kamu paham bahwa harmoni bukan berarti tidak ada perbedaan, melainkan kemampuan untuk mengelola perbedaan menjadi kekuatan. Sosiologi bukan sekadar teori bagimu, tapi jalan hidup.",
    choices: [{ text: "Main Lagi (Pertahankan Skor!)", nextNodeId: "start" }]
  },
  ending_neutral: {
    chapter: 4,
    concept: "Observer Harmoni",
    endingType: "Sad",
    text: "Kamu berhasil menjaga ketertiban, tapi belum sepenuhnya aktif dalam menciptakan inklusi. Kamu masih cenderung memilih jalan aman. Teruslah asah pemahaman sosiologimu untuk menjadi lebih berani!",
    choices: [{ text: "Main Lagi", nextNodeId: "start" }]
  }
};

export const DISCUSSION_ROOMS = [
  { id: 'kelompok-sosial', name: 'Ruang Harmoni & Solidaritas', description: 'Diskusi tentang kenapa kita butuh satu sama lain.', memberCount: 245, activeNow: 12, category: 'Dasar', materiId: 'harmoni-sosial' },
  { id: 'integrasi', name: 'Integrasi & Es Buah', description: 'Cara menyatukan perbedaan agar menyegarkan.', memberCount: 189, activeNow: 8, category: 'Proses', materiId: 'harmoni-sosial' },
  { id: 'konflik', name: 'Akomodasi & Konflik', description: 'Belajar cara damai menyelesaikan masalah.', memberCount: 156, activeNow: 4, category: 'Metode', materiId: 'harmoni-sosial' },
  { id: 'kesetaraan', name: 'Inklusi Hub', description: 'No one left behind! Diskusi kesetaraan.', memberCount: 312, activeNow: 15, category: 'Inklusi', materiId: 'harmoni-sosial' },
  { id: 'perubahan', name: 'Agent of Change', description: 'Aksi nyata untuk harmoni sosial.', memberCount: 420, activeNow: 22, category: 'Aksi', materiId: 'harmoni-sosial' }
];

export const ONLINE_USERS = []; // Start empty, will be populated from DB

export const SOCI_AVATAR = "SOCI_BLUE";
export const HARMO_AVATAR = "HARMO_PINK";

export const QUIZ_QUESTIONS = [
  {
    q: "Apa ibukota Indonesia?",
    o: ["Jakarta", "Surabaya", "Bandung", "Medan"],
    a: "Jakarta"
  },
  {
    q: "Siapa presiden pertama Indonesia?",
    o: ["Soeharto", "Soekarno", "BJ Habibie", "Gus Dur"],
    a: "Soekarno"
  },
  {
    q: "Apa lambang negara Indonesia?",
    o: ["Gajah", "Garuda", "Harimau", "Banteng"],
    a: "Garuda"
  },
  {
    q: "Warna bendera Indonesia adalah...?",
    o: ["Merah Putih", "Biru Putih", "Merah Kuning", "Hijau Putih"],
    a: "Merah Putih"
  },
  {
    q: "Pulau terbesar di Indonesia adalah...?",
    o: ["Jawa", "Sumatera", "Kalimantan", "Sulawesi"],
    a: "Kalimantan"
  },
  {
    q: "Gunung tertinggi di Indonesia adalah...?",
    o: ["Semeru", "Rinjani", "Jayawijaya", "Kerinci"],
    a: "Jayawijaya"
  },
  {
    q: "Lagu kebangsaan Indonesia adalah...?",
    o: ["Indonesia Raya", "Garuda Pancasila", "Bagimu Negeri", "Satu Nusa"],
    a: "Indonesia Raya"
  },
  {
    q: "Hari Kemerdekaan Indonesia diperingati setiap tanggal...?",
    o: ["17 Agustus", "1 Mei", "1 Juni", "28 Oktober"],
    a: "17 Agustus"
  },
  {
    q: "Mata uang negara Indonesia adalah...?",
    o: ["Ringgit", "Dollar", "Rupiah", "Yen"],
    a: "Rupiah"
  },
  {
    q: "Benua tempat Indonesia berada adalah...?",
    o: ["Eropa", "Amerika", "Asia", "Afrika"],
    a: "Asia"
  }
];
