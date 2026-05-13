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
  { id: 'cat', name: 'Si Polos', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix', price: 0 },
  { id: 'dog', name: 'Si Cool', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Buddy', price: 50 },
  { id: 'rabbit', name: 'Si Energik', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Bunny', price: 150 },
  { id: 'panda', name: 'Si Nyentrik', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Panda', price: 250 },
  { id: 'fox', name: 'Si Anggun', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Foxy', price: 500 },
  { id: 'bear', name: 'Si Kalem', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Bear', price: 750 },
  { id: 'koala', name: 'Si Jenius', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Koala', price: 1000 },
  { id: 'tiger', name: 'Si Berani', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Tiger', price: 2000 },
];

export const DAILY_REWARDS = [50, 100, 150, 200, 250, 300, 500];

export const INITIAL_PROGRESS = {
  xp: 1250,
  score: 85,
  level: 5,
  quizLevel: 1,
  coins: 500,
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
  { id: 'harmoni-sosial', title: 'Hakikat Harmoni Sosial', category: 'Sosiologi', type: 'Dasar' },
  { id: 'toleransi', title: 'Toleransi & Kebinekaan', category: 'Sosiologi', type: 'Proses' },
  { id: 'integrasi', title: 'Integrasi Sosial', category: 'Sosiologi', type: 'Metode' },
  { id: 'konflik', title: 'Manajemen Konflik', category: 'Sosiologi', type: 'Inklusi' },
  { id: 'inklusi', title: 'Inklusi & Ekuitas', category: 'Sosiologi', type: 'Aksi' }
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
    text: "Kamu segera lari ke ruang Guru BK. Bu Sarah merespons cepat and mendatangi lokasi. Para pem-bully diberikan sanksi, dan Budi merasa terlindungi. Namun, kelompok tersebut menyimpan dendam padamu. Apa yang kamu lakukan?",
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

export const HARMONI_QUIZ_DATA = [
  // LEVEL 1: HAKIKAT & DASAR HARMONI
  {
    level: 1,
    title: "Hakikat Harmoni Sosial",
    questions: [
      {
        question: "Apa yang dimaksud dengan 'thinking error' dalam memahami harmoni sosial?",
        options: ["Menganggap harmoni sebagai kerja sama", "Mendefinisikan harmoni harus seragam/sama", "Menerima perbedaan latar belakang", "Menjalankan tugas sesuai tupoksi"],
        correctAnswer: 1,
        explanation: "Kesalahan berpikir yang sering terjadi adalah menganggap harmoni harus seragam, padahal harmoni muncul dari penerimaan perbedaan."
      },
      {
        question: "Siapa ahli sosiologi yang mengartikan harmoni sebagai hasil integrasi kuat dari nilai dan norma yang sama?",
        options: ["Max Weber", "Herbert Spencer", "Emile Durkheim", "Robert Putnam"],
        correctAnswer: 2,
        explanation: "Emile Durkheim menekankan bahwa ikatan nilai dan norma menciptakan keteraturan di tengah masyarakat."
      },
      {
        question: "Menurut Max Weber, harmoni sosial diberatkan pada kemampuan individu dalam...",
        options: ["Menghilangkan perbedaan status", "Memahami dan menghargai perbedaan", "Menciptakan jaringan modal sosial", "Membagi kerja secara paksa"],
        correctAnswer: 1,
        explanation: "Max Weber menekankan pada penghargaan terhadap perbedaan status, kekuasaan, dan kebudayaan."
      },
      {
        question: "Harmoni sosial menurut Talcott Parsons tercipta apabila...",
        options: ["Sistem sosial berfungsi dengan baik", "Masyarakat pra-industri bersatu", "Terjadi konflik yang terkendali", "Ada pembagian kerja mekanik"],
        correctAnswer: 0,
        explanation: "Parsons melihat harmoni saat setiap bagian masyarakat berperan aktif dalam menjaga stabilitas sistem."
      },
      {
        question: "Apa definisi solidaritas secara etimologis?",
        options: ["Persaingan individu", "Kekompakan atau kesetiakawanan", "Kepatuhan pada hukum", "Perbedaan peran"],
        correctAnswer: 1,
        explanation: "Solidaritas berasal dari rasa moral dan kepercayaan bersama yang menciptakan kesetiakawanan."
      },
      {
        question: "Solidaritas mekanik biasanya ditemukan pada masyarakat...",
        options: ["Modern", "Industri", "Pra-industri/Adat", "Perkotaan besar"],
        correctAnswer: 2,
        explanation: "Solidaritas mekanik muncul saat pembagian kerja masih minimal dan peran individu cenderung sama."
      },
      {
        question: "Ciri utama solidaritas organik adalah adanya...",
        options: ["Kesamaan nilai mutlak", "Diferensiasi (perbedaan) peran", "Kesadaran kolektif kuat", "Tanpa pembagian kerja"],
        correctAnswer: 1,
        explanation: "Solidaritas organik muncul di masyarakat kompleks yang bersatu karena saling ketergantungan antar peran berbeda."
      },
      {
        question: "Apa itu integrasi sosial menurut Michael Banton?",
        options: ["Pola hubungan tanpa makna pada perbedaan ras", "Proses peleburan paksa", "Pemisahan kelompok minoritas", "Penghapusan hukum formal"],
        correctAnswer: 0,
        explanation: "Banton melihat integrasi saat ras diakui berbeda tapi tidak mempengaruhi hak dan kewajiban penting."
      },
      {
        question: "Syarat integrasi menurut Ogburn & Nimkoff adalah anggota masyarakat berhasil...",
        options: ["Menghapus budaya lama", "Mengisi keperluan/kebutuhan mereka", "Pindah ke wilayah baru", "Membentuk kelompok kecil"],
        correctAnswer: 1,
        explanation: "Jika kebutuhan terpenuhi, masyarakat cenderung menjaga keterikatan sistem sosialnya."
      },
      {
        question: "Integrasi sosial akan lebih mudah tercapai jika kelompok bersifat...",
        options: ["Heterogen", "Homogen", "Besar", "Mobilitas tinggi"],
        correctAnswer: 1,
        explanation: "Kelompok homogen (memiliki banyak kesamaan) lebih mudah mencapai kesepakatan dibanding kelompok majemuk."
      }
    ]
  },
  // LEVEL 2: PROSES INTEGRASI & ASIMILASI
  {
    level: 2,
    title: "Proses & Faktor Integrasi",
    questions: [
      {
        question: "Penyatuan dua kebudayaan tanpa menghilangkan ciri khas masing-masing disebut...",
        options: ["Asimilasi", "Akulturasi", "Akomodasi", "Eliminasi"],
        correctAnswer: 1,
        explanation: "Akulturasi memadukan budaya luar tapi identitas budaya asli tetap ada."
      },
      {
        question: "Asimilasi berbeda dengan akulturasi karena asimilasi bertujuan...",
        options: ["Mempertegas perbedaan", "Menghilangkan batas perbedaan (melebur)", "Menolak budaya asing", "Memisahkan diri"],
        correctAnswer: 1,
        explanation: "Asimilasi adalah peleburan dua budaya menjadi satu budaya baru yang tunggal."
      },
      {
        question: "Semboyan 'Bhinneka Tunggal Ika' merupakan contoh bentuk integrasi...",
        options: ["Fungsional", "Koersif", "Normatif", "Asimilatif"],
        correctAnswer: 2,
        explanation: "Integrasi normatif terjadi karena adanya norma atau semboyan yang mempersatukan masyarakat."
      },
      {
        question: "Hubungan kerja sama antara daerah penghasil kopi dengan perusahaan pengolah merupakan contoh integrasi...",
        options: ["Normatif", "Fungsional", "Koersif", "Akulturatif"],
        correctAnswer: 1,
        explanation: "Integrasi fungsional terbentuk karena adanya ketergantungan fungsi antar bagian masyarakat."
      },
      {
        question: "Integrasi koersif ditandai dengan adanya...",
        options: ["Kesadaran bersama", "Kekuasaan dan paksaan", "Nilai budaya sama", "Sikap toleransi"],
        correctAnswer: 1,
        explanation: "Koersif menggunakan tekanan atau kekerasan, biasanya oleh penguasa (contoh: penggusuran)."
      },
      {
        question: "Apa dampak mobilitas geografis yang tinggi terhadap integrasi?",
        options: ["Mempercepat integrasi", "Menghambat integrasi", "Menciptakan homogenitas", "Mengurangi konflik"],
        correctAnswer: 1,
        explanation: "Orang yang sering pindah sulit membangun ikatan (sense of belonging) dengan nilai lokal."
      },
      {
        question: "Amalgamasi (perkawinan campur) merupakan faktor pendorong integrasi karena...",
        options: ["Menghapus hukum", "Menyatukan dua keluarga besar", "Menciptakan diskriminasi", "Menolak unsur baru"],
        correctAnswer: 1,
        explanation: "Perkawinan campur menyatukan perbedaan latar belakang melalui ikatan keluarga."
      },
      {
        question: "Adanya 'musuh bersama dari luar' dapat mendorong integrasi karena...",
        options: ["Menciptakan ketakutan", "Kelompok memilih bersatu untuk kekuatan", "Memperlemah pertahanan", "Meningkatkan ego kelompok"],
        correctAnswer: 1,
        explanation: "Ancaman luar memaksa kelompok mengabaikan perbedaan internal demi tujuan bersama."
      },
      {
        question: "Syarat asimilasi berjalan baik adalah budaya baru harus...",
        options: ["Sulit dipelajari", "Memberikan manfaat", "Bertolak belakang dengan budaya lama", "Hanya untuk penguasa"],
        correctAnswer: 1,
        explanation: "Kebudayaan baru lebih mudah diterima jika terbukti memberikan dampak positif/manfaat."
      },
      {
        question: "Efektivitas komunikasi mempercepat integrasi karena...",
        options: ["Menghilangkan bahasa daerah", "Mempercepat kesepakatan", "Mengurangi jumlah anggota", "Menciptakan kelompok tertutup"],
        correctAnswer: 1,
        explanation: "Pertukaran informasi yang cepat mempermudah anggota mencapai konsensus bersama."
      }
    ]
  },
  // LEVEL 3: BENTUK-BENTUK AKOMODASI
  {
    level: 3,
    title: "Akomodasi: Meredakan Konflik",
    questions: [
      {
        question: "Menurut Soerjono Soekanto, akomodasi bertujuan untuk...",
        options: ["Menghancurkan lawan", "Mencapai keadaan stabil", "Memperlama konflik", "Menciptakan kasta baru"],
        correctAnswer: 1,
        explanation: "Akomodasi adalah proses meredakan pertentangan tanpa menghancurkan pihak lawan."
      },
      {
        question: "Penyelesaian masalah lewat pengadilan disebut...",
        options: ["Arbitrase", "Mediasi", "Adjudikasi", "Konsiliasi"],
        correctAnswer: 2,
        explanation: "Adjudikasi adalah penyelesaian konflik melalui jalur hukum/pengadilan."
      },
      {
        question: "Apa perbedaan Mediasi dengan Arbitrase?",
        options: ["Mediasi bersifat memaksa", "Mediator hanya sebagai penasihat", "Arbitrase tidak punya keputusan", "Keduanya sama saja"],
        correctAnswer: 1,
        explanation: "Dalam mediasi pihak ketiga hanya menasihati, sedangkan arbitrase pihak ketiga mengambil keputusan."
      },
      {
        question: "Bentuk akomodasi di mana kedua pihak memiliki kekuatan seimbang sehingga konflik berhenti di jalan buntu adalah...",
        options: ["Eliminasi", "Stalemate", "Segregasi", "Konversi"],
        correctAnswer: 1,
        explanation: "Stalemate terjadi saat kekuatan seimbang membuat pertikaian berhenti dengan sendirinya."
      },
      {
        question: "Segregasi sebagai bentuk akomodasi dilakukan dengan cara...",
        options: ["Menyatukan paksa", "Memisahkan diri", "Melakukan voting", "Mengalah total"],
        correctAnswer: 1,
        explanation: "Segregasi (segregate) berarti memisahkan diri guna mengurangi ketegangan."
      },
      {
        question: "Jika salah satu pihak bersedia mengalah dan menerima pendirian pihak lain, disebut...",
        options: ["Konversi", "Subjugation", "Koersi", "Kompromi"],
        correctAnswer: 0,
        explanation: "Konversi terjadi saat satu pihak bersedia mengalah dan mengikuti paham pihak lawan."
      },
      {
        question: "Apa itu 'Minority Consent'?",
        options: ["Minoritas dipaksa patuh", "Minoritas menerima keputusan mayoritas dengan senang hati", "Mayoritas mengalah pada minoritas", "Penghapusan hak minoritas"],
        correctAnswer: 1,
        explanation: "Minority consent terjadi saat kelompok minoritas bisa menerima hasil voting tanpa merasa dikalahkan."
      },
      {
        question: "Gencatan senjata adalah bentuk akomodasi yang bersifat...",
        options: ["Permanen", "Menangguhkan peperangan sementara", "Menghancurkan senjata", "Menolak damai"],
        correctAnswer: 1,
        explanation: "Gencatan senjata hanya menunda konflik bersenjata dalam jangka waktu tertentu."
      },
      {
        question: "Kompromi terjadi ketika pihak-pihak yang terlibat...",
        options: ["Meningkatkan tuntutan", "Mengurangi tuntutan/mengubah pendapat", "Melakukan kekerasan fisik", "Menunggu pihak ketiga"],
        correctAnswer: 1,
        explanation: "Kompromi mendahulukan kesepakatan dengan cara saling mengurangi tuntutan."
      },
      {
        question: "Bentuk akomodasi paksaan terhadap pihak yang lemah disebut...",
        options: ["Konsiliasi", "Koersi", "Mediasi", "Toleransi"],
        correctAnswer: 1,
        explanation: "Koersi melibatkan paksaan fisik atau psikologis karena adanya ketimpangan posisi."
      }
    ]
  },
  // LEVEL 4: KESETARAAN SOSIAL
  {
    level: 4,
    title: "Prinsip Kesetaraan Sosial",
    questions: [
      {
        question: "Apa arti 'Setara bukan berarti Sama' dalam konteks sosiologi?",
        options: ["Semua orang harus punya wajah sama", "Hak dan kesempatan sama meski karakteristik berbeda", "Penghapusan ciri khas ras", "Wajib memiliki harta yang sama"],
        correctAnswer: 1,
        explanation: "Kesetaraan berarti mendapatkan perlakuan adil tanpa harus menghilangkan identitas unik individu."
      },
      {
        question: "Kesetaraan hukum (Universal) berarti semua warga negara...",
        options: ["Bebas dari hukum", "Subjek hukum yang tidak memihak", "Boleh membuat hukum sendiri", "Hanya untuk orang kaya"],
        correctAnswer: 1,
        explanation: "Kesetaraan hukum menjamin hukum diberlakukan secara adil tanpa memandang status."
      },
      {
        question: "Konsep 'Kesetaraan sejak awal' mengandaikan kompetisi yang adil jika...",
        options: ["Ada yang mendapat keuntungan awal", "Peserta mulai dari garis start yang sama", "Pemenang sudah ditentukan", "Tidak ada aturan main"],
        correctAnswer: 1,
        explanation: "Kompetisi adil hanya terjadi jika tidak ada pihak yang menikmati keuntungan khusus sebelum lomba dimulai."
      },
      {
        question: "Pasal 27 ayat (1) UUD 1945 mengatur tentang kesetaraan di bidang...",
        options: ["Ekonomi", "Hukum dan Pemerintahan", "Pertahanan Negara", "Pendidikan"],
        correctAnswer: 1,
        explanation: "Pasal ini menyatakan segala warga negara bersamaan kedudukannya dalam hukum dan pemerintahan."
      },
      {
        question: "Kesetaraan ekonomi bertujuan untuk mencegah...",
        options: ["Pertumbuhan pasar", "Kesenjangan ekonomi yang timpang", "Adanya mata uang", "Persaingan usaha"],
        correctAnswer: 1,
        explanation: "Tujuannya adalah pembagian sumber daya yang adil agar tidak terjadi jurang kemiskinan yang ekstrem."
      },
      {
        question: "Prinsip kesetaraan moral mengharuskan lembaga pemerintahan untuk...",
        options: ["Memperlakukan kepentingan moral setiap anggota secara setara", "Hanya mengikuti satu agama", "Mengabaikan nilai etika", "Memaksa moralitas tertentu"],
        correctAnswer: 0,
        explanation: "Kesetaraan moral mengakui bahwa setiap individu memiliki martabat dan nilai yang harus dihormati sama."
      },
      {
        question: "Apa itu 'Tindakan Afirmatif' (Affirmative Action)?",
        options: ["Tindakan menghukum minoritas", "Tindakan menguatkan golongan tertentu demi kesempatan setara", "Penghapusan hak pilih", "Pelarangan budaya asing"],
        correctAnswer: 1,
        explanation: "Negara berhak memberi dukungan ekstra bagi golongan tertinggal agar bisa bersaing secara setara."
      },
      {
        question: "Kesenjangan sosial terjadi karena adanya hubungan sosial yang buruk yang menyebabkan...",
        options: ["Semua orang kaya", "Satu kelompok punya keuntungan lebih di atas penderitaan lain", "Teknologi maju", "Harmoni meningkat"],
        correctAnswer: 1,
        explanation: "Kesenjangan muncul saat sistem sosial membuat sekelompok orang terpinggirkan secara sistematis."
      },
      {
        question: "Apa ciri masyarakat yang menerapkan kesetaraan radikal?",
        options: ["Hanya setara di hukum", "Bebas dari prasangka dan diskriminasi", "Tidak ada pemimpin", "Semua gaji sama"],
        correctAnswer: 1,
        explanation: "Kesetaraan radikal mencakup kebebasan mental dari prasangka, bukan sekadar aturan tertulis."
      },
      {
        question: "Tanpa penerapan prinsip kesetaraan, masyarakat akan rentan terhadap...",
        options: ["Kemakmuran", "Konflik dan perpecahan", "Kerjasama internasional", "Integrasi kuat"],
        correctAnswer: 1,
        explanation: "Diskriminasi dan ketidaksetaraan adalah akar utama pemicu kecemburuan dan konflik sosial."
      }
    ]
  },
  // LEVEL 5: INKLUSI SOSIAL & PENERAPAN
  {
    level: 5,
    title: "Inklusi Sosial & Masyarakat Terbuka",
    questions: [
      {
        question: "Apa definisi Inklusi Sosial menurut PBB?",
        options: ["Pemisahan kelompok etnis", "Meningkatkan partisipasi masyarakat yang kurang beruntung", "Pengeluaran orang miskin dari kota", "Penyeragaman agama"],
        correctAnswer: 1,
        explanation: "Inklusi sosial adalah proses membuka akses dan partisipasi bagi mereka yang selama ini terpinggirkan."
      },
      {
        question: "Eksklusi sosial adalah situasi di mana individu...",
        options: ["Diberikan bantuan modal", "Dikeluarkan atau dipinggirkan dari kehidupan masyarakat", "Menjadi pemimpin", "Aktif berorganisasi"],
        correctAnswer: 1,
        explanation: "Eksklusi adalah lawan dari inklusi, yaitu peminggiran sosial."
      },
      {
        question: "Masyarakat marginal adalah mereka yang berjuang karena...",
        options: ["Terlalu banyak kekuasaan", "Keterbatasan akses ruang publik dan hak", "Tidak mau bekerja", "Memiliki banyak lahan"],
        correctAnswer: 1,
        explanation: "Marginal berarti berada di pinggiran sistem karena akses ekonomi dan sosialnya dibatasi."
      },
      {
        question: "Contoh inklusi sosial di lingkungan sekolah adalah...",
        options: ["Siswa difabel mendapat perlakuan dan akses yang sama", "Memisahkan kelas berdasarkan kekayaan", "Hanya juara kelas yang boleh bicara", "Melarang bahasa daerah"],
        correctAnswer: 0,
        explanation: "Sekolah inklusif menerima semua siswa tanpa membedakan kondisi fisik atau latar belakang."
      },
      {
        question: "Kesadaran bahwa 'kemajemukan tidak bisa dihindari' adalah syarat mewujudkan...",
        options: ["Eksklusi", "Masyarakat Inklusif", "Masyarakat Homogen", "Konflik"],
        correctAnswer: 1,
        explanation: "Menerima keberagaman sebagai takdir adalah langkah awal menuju sikap inklusif."
      },
      {
        question: "Apa hambatan inklusi terkait kelompok difabel?",
        options: ["Terlalu banyak bantuan", "Terbatasnya sarana prasarana pendukung (aksesibilitas)", "Keinginan mereka untuk menyendiri", "Aturan pemerintah yang terlalu bebas"],
        correctAnswer: 1,
        explanation: "Banyak fasilitas umum belum ramah difabel, sehingga menghambat inklusi mereka."
      },
      {
        question: "Inklusi dalam bidang politik ditandai dengan...",
        options: ["Hanya satu partai", "Jaminan hak memilih dan dipilih bagi seluruh warga", "Pembatasan usia yang ekstrem", "Voting tertutup"],
        correctAnswer: 1,
        explanation: "Setiap warga negara punya hak yang sama untuk berpartisipasi dalam demokrasi."
      },
      {
        question: "Mengapa inklusi ekonomi penting bagi kesejahteraan?",
        options: ["Agar satu perusahaan monopoli", "Mendorong pertumbuhan yang merata bagi kaum marginal", "Meningkatkan pajak pribadi", "Menurunkan harga barang"],
        correctAnswer: 1,
        explanation: "Dengan memberi akses ekonomi ke semua lapisan, kesenjangan berkurang dan pembangunan merata."
      },
      {
        question: "Stigma terhadap kelompok tertentu merupakan hambatan inklusi karena...",
        options: ["Menciptakan persatuan", "Mendorong prasangka negatif dan peminggiran", "Membantu identifikasi", "Meningkatkan rasa percaya diri"],
        correctAnswer: 1,
        explanation: "Stigma membuat masyarakat takut atau enggan berinteraksi dengan kelompok yang diberi label negatif."
      },
      {
        question: "Pendekatan inklusi sosial sejatinya sangat sejalan dengan ideologi...",
        options: ["Liberalisme", "Pancasila", "Kapitalisme", "Sosialisme radikal"],
        correctAnswer: 1,
        explanation: "Pancasila menekankan keadilan sosial bagi seluruh rakyat Indonesia tanpa terkecuali."
      }
    ]
  }
];
const HARMONI_QUIZ_51_100 = [
  // LEVEL 6: KOHESI SOSIAL & IKATAN KELOMPOK
  {
    level: 6,
    title: "Kohesi Sosial & Dinamika Kelompok",
    questions: [
      {
        question: "Menurut Trudy Harpham dkk, kohesi sosial tidak hanya soal aturan, tetapi juga tentang...",
        options: ["Keseragaman fisik anggota", "Persaingan antar kelompok", "Perasaan kebersamaan dan kepercayaan sosial", "Kepatuhan karena rasa takut"],
        correctAnswer: 2, // C
        explanation: "Kohesi sosial melibatkan dimensi emosional seperti rasa kebersamaan dan saling percaya antar anggota kelompok."
      },
      {
        question: "Apa yang menjadi pendorong anggota kelompok untuk lebih mudah taat terhadap norma-norma kelompok?",
        options: ["Adanya hukuman fisik yang berat", "Tingginya kohesivitas atau ikatan kelompok", "Jumlah anggota yang sangat banyak", "Adanya pemimpin yang otoriter"],
        correctAnswer: 1, // B
        explanation: "Ikatan atau kohesivitas yang kuat mendorong anggota untuk sukarela menaati norma kelompok demi solidaritas."
      },
      {
        question: "Faktor yang mempengaruhi kohesivitas menurut Cartwright dan Zander adalah...",
        options: ["Lokasi geografis kelompok", "Motif yang menjadi dasar keanggotaan", "Jenis kelamin anggota kelompok", "Warna seragam kelompok"],
        correctAnswer: 1, // B
        explanation: "Motif atau alasan seseorang bergabung sangat menentukan seberapa kuat keterikatan mereka pada kelompok tersebut."
      },
      {
        question: "Kohesi sosial dalam pandangan Emile Durkheim didasarkan pada...",
        options: ["Kekuatan militer", "Kesamaan hobi semata", "Harapan dan kepercayaan pada kesempatan yang setara", "Aturan hukum yang kaku"],
        correctAnswer: 2, // C
        explanation: "Durkheim percaya kohesi muncul dari nilai, tantangan, dan kesempatan yang adil bagi setiap individu."
      },
      {
        question: "Contoh nyata dari kohesi sosial yang disebutkan dalam materi adalah...",
        options: ["Persatuan Pedagang Bakso se-Jabodetabek", "Kelompok eksklusif yang menutup diri", "Masyarakat yang terpecah karena hoaks", "Individu yang hidup sendirian"],
        correctAnswer: 0, // A
        explanation: "Kelompok profesi seperti ini memiliki kesamaan nasib dan tantangan yang mengikat mereka menjadi kohesif."
      },
      {
        question: "Apa akibat utama jika sebuah kelompok tidak kohesif?",
        options: ["Anggota menjadi lebih mandiri", "Norma tidak dipatuhi dan anggota menjadi terpecah", "Kerjasama timbal balik meningkat", "Kelompok menjadi lebih kuat"],
        correctAnswer: 1, // B
        explanation: "Tanpa kohesivitas, norma kelompok kehilangan kekuatannya dan perpecahan mudah terjadi."
      },
      {
        question: "Kohesi sosial disimpulkan berdasar pada tiga hal utama, yaitu...",
        options: ["Uang, Kekuasaan, dan Jabatan", "Perbedaan, Persaingan, dan Konflik", "Keeratan hubungan, saling ketergantungan, dan perasaan berkelompok", "Diskriminasi, Segregasi, dan Eksklusi"],
        correctAnswer: 2, // C
        explanation: "Tiga hal tersebut merupakan elemen inti yang membentuk rasa saling memiliki dalam kelompok."
      },
      {
        question: "Anggota kelompok yang kohesif cenderung menolak...",
        options: ["Sikap dan subjek yang menyimpang", "Anggota baru yang berbakat", "Bantuan dari luar", "Perubahan ke arah yang lebih baik"],
        correctAnswer: 0, // A
        explanation: "Kelompok yang erat biasanya memiliki standar moral yang kuat dan menjaga keselarasan dari penyimpangan."
      },
      {
        question: "Penilaian individu terhadap hasil yang didapat dalam kelompok merupakan faktor...",
        options: ["Pendorong konflik", "Penentu kohesivitas", "Pendorong urbanisasi", "Penentu stratifikasi"],
        correctAnswer: 1, // B
        explanation: "Jika individu merasa hasil yang didapat dari kelompok itu baik, maka ia akan semakin terikat pada kelompok tersebut."
      },
      {
        question: "Persatuan Pelajar Indonesia (PPI) di luar negeri mencerminkan kohesi sosial karena...",
        options: ["Mereka tinggal di negara yang sama", "Adanya tantangan dan perasaan berkelompok di tanah rantau", "Mereka dibayar oleh pemerintah", "Mereka memiliki bahasa yang berbeda-beda"],
        correctAnswer: 1, // B
        explanation: "Tantangan hidup di luar negeri menyatukan para pelajar untuk saling bergantung dan membantu."
      }
    ]
  },
  // LEVEL 7: SIKAP MENTAL MEMBANGUN HARMONI
  {
    level: 7,
    title: "Sikap Mental & Empati",
    questions: [
      {
        question: "Mengapa harmoni sosial dimulai dari persiapan 'Sikap Mental'?",
        options: ["Agar terlihat lebih kuat", "Karena mempengaruhi cara menghadapi masalah dan memandang sesuatu", "Hanya untuk memenuhi teori sosiologi", "Supaya bisa menang saat berdebat"],
        correctAnswer: 1, // B
        explanation: "Sikap mental menentukan perspektif kita terhadap perbedaan dan konflik di masyarakat."
      },
      {
        question: "Menyadari bahwa perbedaan suku/agama adalah kekayaan sosial disebut sikap...",
        options: ["Eksklusif", "Akomodatif", "Menyikapi perbedaan secara positif", "Etnosentrisme"],
        correctAnswer: 2, // C
        explanation: "Melihat perbedaan sebagai aset/kekayaan adalah bentuk cara pandang positif terhadap diferensiasi sosial."
      },
      {
        question: "Sikap akomodatif sangat utama dalam masyarakat heterogen karena bertujuan untuk...",
        options: ["Menciptakan ketegangan baru", "Menerima perbedaan dan mengurangi ketegangan", "Memaksakan kehendak mayoritas", "Menghapus identitas budaya asli"],
        correctAnswer: 1, // B
        explanation: "Akomodatif berarti bersedia menampung perbedaan demi menjaga stabilitas."
      },
      {
        question: "Masyarakat harus memiliki komitmen terhadap kesepakatan agar...",
        options: ["Dapat melaksanakan aturan tanpa paksaan", "Hanya kelompok tertentu yang untung", "Konflik bisa terus berlanjut", "Bisa mengganti aturan setiap hari"],
        correctAnswer: 0, // A
        explanation: "Komitmen memastikan harmoni tercipta dari kesadaran bersama menjalankan aturan."
      },
      {
        question: "Apa perbedaan antara Empati dan Peduli menurut materi?",
        options: ["Empati adalah perasaan, Peduli adalah bentuk aksinya", "Peduli adalah perasaan, Empati adalah aksinya", "Keduanya tidak ada perbedaan", "Empati untuk keluarga, Peduli untuk orang asing"],
        correctAnswer: 0, // A
        explanation: "Empati adalah memposisikan diri di perasaan orang lain, sedangkan Peduli adalah tindakan nyata menolong."
      },
      {
        question: "Bagaimana lingkungan hidup yang rusak mempengaruhi harmoni sosial?",
        options: ["Meningkatkan kerjasama warga", "Mempengaruhi kenyamanan dan memicu gangguan kondisi masyarakat", "Hanya berdampak pada kesehatan", "Tidak ada pengaruhnya"],
        correctAnswer: 1, // B
        explanation: "Lingkungan yang rusak mengganggu kelangsungan hidup dan stabilitas interaksi sosial."
      },
      {
        question: "Apa risiko jika pelanggaran aturan tidak dihukum dengan tegas?",
        options: ["Masyarakat menjadi lebih disiplin", "Memicu terjadinya ketidakharmonisan sosial", "Hukum menjadi lebih fleksibel", "Keamanan negara meningkat"],
        correctAnswer: 1, // B
        explanation: "Ketidaktegasan hukum menciptakan ketidakadilan yang merusak kepercayaan antar warga."
      },
      {
        question: "Sikap mental 'Berjiwa Heterogen' berarti kita harus...",
        options: ["Menolak segala perbedaan", "Memperkuat hubungan meski ada perbedaan", "Mengucilkan kelompok kecil", "Menginginkan keseragaman"],
        correctAnswer: 1, // B
        explanation: "Jiwa heterogen mengakui keragaman sebagai kenyataan hidup yang harus dirangkul."
      },
      {
        question: "Transparansi dalam sistem birokrasi bertujuan untuk...",
        options: ["Menciptakan kecurigaan", "Membangun kepercayaan masyarakat", "Menyembunyikan informasi penting", "Memperumit pelayanan umum"],
        correctAnswer: 1, // B
        explanation: "Kepercayaan yang lahir dari keterbukaan informasi mempererat hubungan sosial."
      },
      {
        question: "Empati mendorong seseorang untuk 'berbuat benar' karena...",
        options: ["Takut dihukum", "Mampu membayangkan dirinya dalam posisi orang lain", "Ingin dipuji", "Hanya mengikuti perintah"],
        correctAnswer: 1, // B
        explanation: "Dengan membayangkan diri di posisi orang lain, kita akan enggan melakukan kejahatan kepada mereka."
      }
    ]
  },
  // LEVEL 8: TINDAKAN PRIBADI & KELOMPOK
  {
    level: 8,
    title: "Upaya Tingkat Pribadi & Kelompok",
    questions: [
      {
        question: "Kelompok persahabatan terbentuk karena adanya...",
        options: ["Perbedaan status ekonomi", "Kesamaan tujuan dan hubungan kuat yang timbal balik", "Paksaan dari sekolah", "Kebutuhan untuk saling menjatuhkan"],
        correctAnswer: 1, // B
        explanation: "Persahabatan menyatukan individu melalui sosialisasi yang sehat dan tujuan bersama."
      },
      {
        question: "Prinsip 'Saling Menguatkan' antarindividu didasarkan pada kenyataan bahwa...",
        options: ["Setiap orang sudah sempurna", "Setiap individu memiliki kekurangan yang harus dilengkapi orang lain", "Manusia harus hidup sendirian", "Persaingan adalah segalanya"],
        correctAnswer: 1, // B
        explanation: "Kekurangan individu ditutupi oleh keahlian individu lain, menciptakan kekuatan kolektif."
      },
      {
        question: "Dalam keluarga, harmoni sosial dapat diwujudkan dengan cara...",
        options: ["Membagi tugas berdasarkan gender secara kaku", "Kerjasama tanpa memandang gender dan menyadari peran masing-masing", "Anak tidak boleh membantu orang tua", "Keputusan hanya diambil oleh ayah"],
        correctAnswer: 1, // B
        explanation: "Kesetaraan peran dan kerjasama tanpa sekat gender adalah kunci harmoni keluarga."
      },
      {
        question: "Apa tindakan organisasi untuk mencapai harmoni dengan masyarakat sekitar?",
        options: ["Menutup akses jalan warga", "Menyelaraskan aktivitas organisasi agar tidak mengganggu warga", "Memaksa warga bergabung", "Menaikkan iuran keamanan"],
        correctAnswer: 1, // B
        explanation: "Organisasi harus berintegrasi dengan nilai lokal agar kehadirannya diterima positif."
      },
      {
        question: "Di tingkat negara, pemenuhan Hak Asasi Manusia (HAM) bertujuan agar...",
        options: ["Masyarakat merasa takut", "Masyarakat merasa aman dalam hidup bernegara", "Negara bisa mengontrol pikiran rakyat", "Pajak bisa dinaikkan"],
        correctAnswer: 1, // B
        explanation: "HAM yang terlindungi memberikan rasa keadilan yang mendasari harmoni nasional."
      },
      {
        question: "Toleransi dalam masyarakat heterogen mencakup...",
        options: ["Menghormati hak dan kebebasan antar individu/kelompok", "Menyamakan semua keyakinan", "Membiarkan konflik terus terjadi", "Mengabaikan orang lain"],
        correctAnswer: 0, // A
        explanation: "Toleransi adalah jembatan untuk menutup kesenjangan akibat perbedaan paham."
      },
      {
        question: "Apa fungsi pemberian insentif yang sesuai dalam sebuah organisasi?",
        options: ["Memanjakan anggota", "Memaksimalkan pekerjaan demi mencapai tujuan bersama", "Menciptakan kecemburuan", "Hanya sebagai formalitas"],
        correctAnswer: 1, // B
        explanation: "Keadilan penghargaan (insentif) mendorong iklim kerja yang harmonis dan produktif."
      },
      {
        question: "Membangun 'Persekutuan' mendorong kelompok-kelompok kecil untuk...",
        options: ["Saling berperang", "Bersatu agar kebutuhan mereka terpenuhi", "Membubarkan diri", "Hanya mementingkan kelompoknya"],
        correctAnswer: 1, // B
        explanation: "Persekutuan menciptakan lingkungan sosial sehat yang mendukung pertumbuhan bersama."
      },
      {
        question: "Di tingkat masyarakat, memahami permasalahan yang dihadapi bersama berguna untuk...",
        options: ["Saling menyalahkan", "Saling menolong dalam mencarikan penyelesaiannya", "Bahan perdebatan", "Menutup diri"],
        correctAnswer: 1, // B
        explanation: "Kerjasama dalam memecahkan masalah memperkuat ikatan sosial masyarakat."
      },
      {
        question: "Hak dan kewajiban di bidang politik berarti...",
        options: ["Hanya warga kaya yang boleh memilih", "Setiap warga bebas dan berhak masuk ke dunia politik", "Politik hanya urusan penguasa", "Wajib memilih calon yang sudah ditentukan"],
        correctAnswer: 1, // B
        explanation: "Kesetaraan hak politik adalah ciri negara demokrasi yang harmonis."
      }
    ]
  },
  // LEVEL 9: KAMPANYE & PENYEBARAN INFORMASI
  {
    level: 9,
    title: "Informasi & Dialog Publik",
    questions: [
      {
        question: "Mengapa penyebaran informasi secara tidak langsung melalui media sosial dianggap efektif?",
        options: ["Karena biayanya sangat mahal", "Karena jangkauan lebih luas dan mudah dilakukan", "Karena informasi media sosial selalu benar", "Karena tidak butuh koneksi internet"],
        correctAnswer: 1, // B
        explanation: "Jangkauan luas media sosial mempermudah agen perubahan menyebarkan ide harmoni."
      },
      {
        question: "Gagasan harmoni sosial harus disusun dengan baik dan menarik agar...",
        options: ["Hanya dimengerti oleh akademisi", "Menarik masyarakat untuk melihat dan mendengarnya", "Menyembunyikan maksud asli", "Bisa dijual dengan harga tinggi"],
        correctAnswer: 1, // B
        explanation: "Kemasan informasi yang menarik menentukan efektivitas pesan yang disampaikan."
      },
      {
        question: "Definisi Kampanye menurut KBBI yang tepat adalah...",
        options: ["Berteriak di jalanan tanpa tujuan", "Gerakan serentak untuk mengadakan aksi atau menyampaikan gagasan", "Hanya dilakukan saat pemilu", "Tindakan memaksa orang lain"],
        correctAnswer: 1, // B
        explanation: "Kampanye adalah instrumen untuk mengajak publik bersimpati pada gagasan tertentu."
      },
      {
        question: "Apa risiko penyalahgunaan informasi (hoaks) dalam upaya harmoni?",
        options: ["Masyarakat jadi lebih cerdas", "Menghambat pergerakan kelompok mencapai harmoni", "Mempercepat asimilasi", "Meningkatkan rasa aman"],
        correctAnswer: 1, // B
        explanation: "Hoaks menyesatkan masyarakat dan memicu ketidakharmonisan sosial."
      },
      {
        question: "Kelemahan komunikasi satu arah dalam penyebaran informasi adalah...",
        options: ["Terlalu banyak yang bertanya", "Adanya penerima informasi yang tidak mengerti tapi tidak bisa bertanya", "Sangat melelahkan", "Tidak ada yang mendengarkan"],
        correctAnswer: 1, // B
        explanation: "Komunikasi satu arah menutup ruang diskusi yang diperlukan untuk pemahaman mendalam."
      },
      {
        question: "Dialog atau diskusi membuka peluang terjadinya komunikasi...",
        options: ["Tanpa arah", "Dua arah antara pemberi dan penerima informasi", "Hanya satu arah", "Rahasia"],
        correctAnswer: 1, // B
        explanation: "Komunikasi dua arah memungkinkan klarifikasi dan kesepahaman bersama."
      },
      {
        question: "Apa itu 'Public Hearing' (Dengar Pendapat)?",
        options: ["Konser musik gratis", "Pertemuan mendengarkan penjelasan/pendapat ahli atau masyarakat terdampak", "Sidang tertutup pemerintah", "Demo anarkis"],
        correctAnswer: 1, // B
        explanation: "Public hearing adalah wadah formal untuk menampung aspirasi masyarakat."
      },
      {
        question: "Mengapa dalam menyusun rencana pembangunan perlu ada dengar pendapat?",
        options: ["Agar proyek selesai lebih cepat", "Agar tidak terjadi kesalahpahaman dan sesuai kebutuhan masyarakat", "Hanya formalitas administratif", "Untuk menakut-nakuti warga"],
        correctAnswer: 1, // B
        explanation: "Melibatkan warga terdampak memastikan rencana pembangunan diterima dan harmonis."
      },
      {
        question: "Kampanye gerakan literasi di sekolah merupakan contoh upaya...",
        options: ["Eksklusi pendidikan", "Menyebarkan ide atau gagasan melalui aksi nyata", "Persaingan antar kelas", "Pemberian hukuman"],
        correctAnswer: 1, // B
        explanation: "Kampanye literasi mengajak publik sekolah untuk peduli pada kemajuan pengetahuan."
      },
      {
        question: "Melalui forum dengar pendapat, masyarakat dapat menyalurkan...",
        options: ["Uang mereka", "Aspirasi dan saran pembentukan harmoni sosial", "Barang-barang bekas", "Kekuasaan politik"],
        correctAnswer: 1, // B
        explanation: "Forum ini adalah saluran demokrasi untuk memberikan masukan kepada pihak berwenang."
      }
    ]
  },
  // LEVEL 10: KERJASAMA & FILANTROPI
  {
    level: 10,
    title: "Filantropi & Kolaborasi Sosial",
    questions: [
      {
        question: "Filantropi didefinisikan sebagai bentuk...",
        options: ["Pencarian keuntungan materi", "Cinta kasih atau kedermawanan kepada sesama", "Kewajiban pajak", "Kepatuhan militer"],
        correctAnswer: 1, // B
        explanation: "Filantropi berakar dari nilai kemanusiaan untuk membantu tanpa pamrih."
      },
      {
        question: "Siapa saja yang bisa melakukan kegiatan filantropi?",
        options: ["Hanya orang kaya", "Perorangan, kelompok, negara, hingga organisasi internasional", "Hanya lembaga pemerintah", "Hanya warga negara asing"],
        correctAnswer: 1, // B
        explanation: "Filantropi bersifat universal dan dapat dilakukan oleh siapa saja yang peduli."
      },
      {
        question: "Kegiatan filantropi tidak hanya terbatas pada uang, tetapi juga mencakup...",
        options: ["Waktu, tenaga, ide, dan gagasan", "Hanya barang mewah", "Penjualan aset negara", "Hanya doa"],
        correctAnswer: 0, // A
        explanation: "Sumbangsih tenaga dan pikiran juga merupakan bentuk kedermawanan sosial."
      },
      {
        question: "Apa manfaat filantropi dalam bentuk pelatihan UMKM berbasis digital?",
        options: ["Meningkatkan pajak negara", "Meningkatkan kemandirian ekonomi para anggota", "Menghapus UMKM lama", "Membuat anggota jadi malas"],
        correctAnswer: 1, // B
        explanation: "Filantropi pemberdayaan membantu masyarakat marginal untuk berdikari secara ekonomi."
      },
      {
        question: "Kegiatan pendampingan dan perawatan sosial biasanya ditujukan untuk...",
        options: ["Kelompok yang sangat kaya", "Kelompok difabel, lansia, dan korban bencana", "Hanya untuk anak sekolah", "Masyarakat yang tinggal di kota besar"],
        correctAnswer: 1, // B
        explanation: "Pendampingan difokuskan pada mereka yang membutuhkan dukungan ekstra untuk hidup layak."
      },
      {
        question: "Seseorang melakukan filantropi didorong oleh...",
        options: ["Kecintaan terhadap sesama dan nilai kemanusiaan", "Keinginan untuk populer", "Takut akan hukum", "Perintah atasan"],
        correctAnswer: 0, // A
        explanation: "Motivasi utama filantropi adalah nilai moral dan kasih sayang sesama."
      },
      {
        question: "Memberi bantuan kepada korban bencana alam merupakan aksi nyata dari sikap...",
        options: ["Etnosentrisme", "Empati dan peduli pada orang lain", "Eksklusivisme", "Persaingan sosial"],
        correctAnswer: 1, // B
        explanation: "Aksi amal adalah wujud kepedulian yang lahir dari rasa empati terhadap penderitaan sesama."
      },
      {
        question: "Filantropi berfungsi memberikan akses terhadap sumber daya guna meningkatkan...",
        options: ["Ketergantungan masyarakat", "Kemandirian dalam memenuhi hidup", "Angka kemiskinan", "Jumlah utang"],
        correctAnswer: 1, // B
        explanation: "Bantuan filantropi yang baik harus memampukan masyarakat untuk bangkit sendiri."
      },
      {
        question: "Pendampingan sosial bagi masyarakat marginal dapat dilakukan oleh...",
        options: ["Hanya negara lain", "Pemerintah maupun masyarakat", "Hanya pihak kepolisian", "Satu orang saja"],
        correctAnswer: 1, // B
        explanation: "Kolaborasi antara negara dan warga memperkuat jaring pengaman sosial bagi yang marginal."
      },
      {
        question: "Apa tujuan akhir dari seluruh upaya kolaborasi, kampanye, dan filantropi ini?",
        options: ["Meningkatkan konflik", "Mendorong terbentuknya harmoni sosial yang berkelanjutan", "Menyeragamkan seluruh penduduk", "Mencari keuntungan pribadi"],
        correctAnswer: 1, // B
        explanation: "Semua aksi sosial ini bertujuan menciptakan kehidupan masyarakat yang damai dan selaras."
      }
    ]
  }
];
const HARMONI_QUIZ_101_150 = [
  // LEVEL 11: UPAYA INDIVIDU & PERSAHABATAN
  {
    level: 11,
    title: "Upaya Harmoni Tingkat Pribadi",
    questions: [
      {
        question: "Mengapa membangun kelompok persahabatan penting dalam harmoni sosial?",
        options: [
          "Untuk membedakan mana kawan dan mana lawan",
          "Membentuk sosialisasi kuat dan hubungan erat timbal balik",
          "Hanya agar memiliki teman saat sedang kesulitan ekonomi",
          "Untuk menjatuhkan kelompok lain yang tidak sejalan"
        ],
        correctAnswer: 1,
        explanation: "Persahabatan berdasarkan kesamaan tujuan menciptakan hubungan yang kuat dan sehat di masyarakat."
      },
      {
        question: "Apa yang harus dilakukan seseorang saat menilai perbuatan benar atau salah orang lain menurut Manisha Sharma?",
        options: [
          "Langsung memberikan hukuman sosial",
          "Mengabaikan perasaan orang tersebut",
          "Membayangkan dirinya dalam posisi orang tersebut (Empati)",
          "Melaporkannya ke pihak berwajib tanpa diskusi"
        ],
        correctAnswer: 2,
        explanation: "Memahami posisi orang lain mencegah tindakan kejahatan dan kesenjangan sosial."
      },
      {
        question: "Individu memiliki bakat yang berbeda-beda, maka sikap yang tepat adalah 'Saling Menguatkan' yang berarti...",
        options: [
          "Menonjolkan bakat sendiri agar dipuji",
          "Mencari kekurangan orang lain",
          "Menggunakan bakat masing-masing untuk menutupi kekurangan sesama",
          "Bersaing untuk menjadi yang paling unggul"
        ],
        correctAnswer: 2,
        explanation: "Kerjasama antar-individu dengan bakat berbeda menciptakan kekuatan yang hebat dan berkelanjutan."
      },
      {
        question: "Menurut materi, 'Persekutuan' yang sehat terbentuk jika anggota kelompok...",
        options: [
          "Saling curiga satu sama lain",
          "Selalu percaya, mendukung, dan menguatkan",
          "Memiliki latar belakang suku yang sama saja",
          "Hanya berkumpul saat ada pembagian bantuan"
        ],
        correctAnswer: 1,
        explanation: "Kepercayaan dan saling dukung menciptakan lingkungan yang harmoni dan produktif."
      },
      {
        question: "Bagaimana cara 'Menjembatani Kesenjangan' dalam masyarakat heterogen?",
        options: [
          "Melalui sikap toleransi dan menghormati hak individu",
          "Dengan memaksa semua orang menjadi seragam",
          "Membatasi akses ekonomi bagi kelompok tertentu",
          "Meningkatkan prasangka antar kelompok"
        ],
        correctAnswer: 0,
        explanation: "Toleransi menjadikan perbedaan sebagai kekuatan, bukan kelemahan atau jarak sosial."
      },
      {
        question: "Kondisi mental yang merasa atau mengidentifikasi diri dalam perasaan orang lain disebut...",
        options: ["Simpati", "Apatis", "Empati", "Eksklusivisme"],
        correctAnswer: 2,
        explanation: "Empati adalah kunci utama untuk memahami penderitaan dan kebutuhan orang lain."
      },
      {
        question: "Apa manfaat dari lingkungan sosial yang sudah bertumbuh dan berkembang dengan baik?",
        options: [
          "Mendorong kelompok-kelompok kecil untuk bersatu",
          "Memicu persaingan antar wilayah",
          "Membuat masyarakat malas bekerja",
          "Hanya menguntungkan pihak pemerintah"
        ],
        correctAnswer: 0,
        explanation: "Lingkungan yang stabil memudahkan berbagai kelompok untuk berkolaborasi memenuhi kebutuhan."
      },
      {
        question: "Upaya menciptakan harmoni sosial dapat dilakukan pada dua tingkat, yaitu...",
        options: [
          "Tingkat Desa dan Tingkat Kota",
          "Tingkat Pribadi dan Lembaga Sosial",
          "Tingkat Sekolah dan Tingkat Kuliah",
          "Tingkat Ekonomi dan Tingkat Politik"
        ],
        correctAnswer: 1,
        explanation: "Perubahan harus dimulai dari individu (pribadi) dan diperkuat oleh struktur organisasi (lembaga)."
      },
      {
        question: "Apa tujuan utama dari membangun kelompok pertemanan bagi seorang individu?",
        options: [
          "Mencari keuntungan materi semata",
          "Membentuk hubungan kuat karena kesamaan tujuan",
          "Menghindari tugas-tugas sosial",
          "Mendapatkan perlindungan dari hukum"
        ],
        correctAnswer: 1,
        explanation: "Persahabatan mempererat ikatan sosial melalui interaksi yang intens dan positif."
      },
      {
        question: "Sikap saling melengkapi antarindividu sangat diperlukan karena...",
        options: [
          "Setiap orang bisa hidup sendiri",
          "Setiap individu memiliki kekurangan yang tidak bisa ditutupi sendiri",
          "Agar tidak perlu belajar hal baru",
          "Untuk menunjukkan siapa yang paling berkuasa"
        ],
        correctAnswer: 1,
        explanation: "Interaksi sosial ada karena manusia adalah makhluk sosial yang tidak bisa memenuhi kebutuhannya sendiri."
      }
    ]
  },
  // LEVEL 12: HARMONI DI KELUARGA & ORGANISASI
  {
    level: 12,
    title: "Aksi Nyata Tingkat Lembaga",
    questions: [
      {
        question: "Dalam keluarga, setiap anggota harus menyadari peran masing-masing dan bekerja sama tanpa memandang...",
        options: ["Usia", "Gender", "Pendidikan", "Hobi"],
        correctAnswer: 1,
        explanation: "Kerjasama tanpa sekat gender adalah fondasi kesetaraan dan harmoni di lingkup terkecil (keluarga)."
      },
      {
        question: "Apa yang dimaksud dengan 'integrasi antara organisasi dan masyarakat'?",
        options: [
          "Organisasi harus menguasai lahan masyarakat",
          "Pemaduan nilai dan norma antara organisasi dengan lingkungan warga",
          "Masyarakat harus bekerja gratis untuk organisasi",
          "Organisasi tidak perlu peduli dengan warga sekitar"
        ],
        correctAnswer: 1,
        explanation: "Organisasi harus menyelaraskan aktivitasnya agar tidak berbenturan dengan kepentingan warga."
      },
      {
        question: "Mengapa pemberian insentif yang sesuai penting dalam sebuah organisasi?",
        options: [
          "Agar anggota bisa cepat kaya",
          "Agar anggota maksimal bekerja demi mencapai tujuan bersama",
          "Untuk membedakan kasta antar anggota",
          "Hanya sebagai formalitas administratif"
        ],
        correctAnswer: 1,
        explanation: "Keadilan dalam penghargaan (insentif) memicu iklim kerja yang sehat dan harmonis."
      },
      {
        question: "Di tingkat masyarakat, apa fungsi dari memahami peraturan perundang-undangan?",
        options: [
          "Agar bisa mencari celah hukum",
          "Agar masyarakat bertindak sesuai aturan yang mengontrol perilaku",
          "Untuk menakuti tetangga",
          "Hanya sebagai pengetahuan tambahan"
        ],
        correctAnswer: 1,
        explanation: "Hukum adalah alat pengontrol agar interaksi warga tetap stabil dan tidak merugikan satu sama lain."
      },
      {
        question: "Apa contoh tindakan harmoni di tingkat negara menurut materi?",
        options: [
          "Pembangunan mal di setiap kota",
          "Perlindungan Hak Asasi Manusia (HAM)",
          "Mewajibkan satu budaya untuk semua",
          "Menghapus seluruh pajak warga"
        ],
        correctAnswer: 1,
        explanation: "Pemenuhan HAM oleh negara menjamin keamanan dan rasa adil bagi seluruh rakyat."
      },
      {
        question: "Kesetaraan warga negara dalam menggunakan fasilitas umum adalah wujud dari...",
        options: ["Diskriminasi sosial", "Prinsip kesetaraan antarwarga", "Eksklusi ekonomi", "Kekuasaan otoriter"],
        correctAnswer: 1,
        explanation: "Fasilitas yang bisa diakses siapa saja mencerminkan keadilan sosial bagi seluruh rakyat."
      },
      {
        question: "Dalam keluarga, menanamkan sifat empati bertujuan agar anggota keluarga...",
        options: [
          "Saling bersaing mendapatkan warisan",
          "Saling menjaga dan melindungi satu sama lain",
          "Hanya peduli pada diri sendiri",
          "Saling menyembunyikan masalah"
        ],
        correctAnswer: 1,
        explanation: "Empati membuat anggota keluarga peka terhadap kesulitan anggota lainnya."
      },
      {
        question: "Di tingkat masyarakat, jika menghadapi masalah, warga sebaiknya...",
        options: [
          "Saling menyalahkan",
          "Saling menolong dalam mencarikan penyelesaian",
          "Membiarkan masalah tersebut hilang sendiri",
          "Pindah ke wilayah lain"
        ],
        correctAnswer: 1,
        explanation: "Solidaritas dalam memecahkan masalah memperkuat kohesi sosial di lingkungan tersebut."
      },
      {
        question: "Penerapan prinsip kesetaraan dalam sendi kehidupan bertujuan untuk menghindari...",
        options: ["Kemakmuran bersama", "Perselisihan dan perpecahan", "Kerjasama antar ras", "Kesejahteraan masyarakat"],
        correctAnswer: 1,
        explanation: "Tanpa kesetaraan, diskriminasi akan muncul dan memicu konflik sosial."
      },
      {
        question: "Sebagai negara demokrasi, semua warga Indonesia berhak sama dan bebas untuk...",
        options: ["Melanggar aturan", "Masuk ke dunia politik", "Tidak membayar pajak", "Menghapus Pancasila"],
        correctAnswer: 1,
        explanation: "Kebebasan berpolitik adalah hak asasi warga dalam sistem demokrasi yang harmonis."
      }
    ]
  },
  // LEVEL 13: KAMPANYE & MEDIA SOSIAL
  {
    level: 13,
    title: "Penyebaran Informasi Harmoni",
    questions: [
      {
        question: "Apa tujuan utama penyebaran informasi tentang harmoni sosial?",
        options: [
          "Mencari pengikut di media sosial",
          "Agar masyarakat tahu pentingnya harmoni dan cara mencapainya",
          "Memaksa masyarakat setuju dengan satu pendapat",
          "Mencari keuntungan finansial dari iklan"
        ],
        correctAnswer: 1,
        explanation: "Informasi yang tepat memberikan edukasi bagi masyarakat untuk bertindak selaras."
      },
      {
        question: "Penyebaran informasi harmoni secara tidak langsung melalui media sosial efektif karena...",
        options: [
          "Biayanya sangat mahal",
          "Jangkauan lebih luas dan mudah dilakukan",
          "Informasi media sosial selalu benar",
          "Hanya bisa dibaca oleh anak muda"
        ],
        correctAnswer: 1,
        explanation: "Media sosial memungkinkan pesan menjangkau banyak orang tanpa batasan fisik wilayah."
      },
      {
        question: "Apa peran 'Agent of Change' (Agen Perubahan) dalam harmoni sosial?",
        options: [
          "Menciptakan kekacauan",
          "Melakukan penyebaran informasi secara kreatif melalui media sosial",
          "Mengambil keputusan politik secara sepihak",
          "Menolak segala bentuk inovasi"
        ],
        correctAnswer: 1,
        explanation: "Agen perubahan adalah penggerak masyarakat untuk menerima ide-ide baru yang positif."
      },
      {
        question: "Ide atau gagasan harmoni sosial harus dikemas dengan menarik agar...",
        options: [
          "Sulit dibajak orang lain",
          "Mudah dimengerti dan diterima oleh publik",
          "Bisa dijual dengan harga tinggi",
          "Terlihat sangat teknis dan rumit"
        ],
        correctAnswer: 1,
        explanation: "Kemasan informasi yang menarik meningkatkan simpati dan kepedulian masyarakat."
      },
      {
        question: "Menurut KBBI, Kampanye adalah gerakan serentak untuk...",
        options: ["Berteriak di jalanan", "Mengadakan aksi atau menyampaikan gagasan", "Hanya berkumpul tanpa tujuan", "Menyerang pihak lawan"],
        correctAnswer: 1,
        explanation: "Kampanye bertujuan untuk menyampaikan inovasi agar masyarakat tertarik dan mau menerima gagasan tersebut."
      },
      {
        question: "Apa dampak buruk menyebarkan berita hoaks terhadap harmoni sosial?",
        options: [
          "Masyarakat menjadi lebih cerdas",
          "Menghambat pergerakan kelompok untuk mencapai harmoni",
          "Mempercepat proses asimilasi",
          "Meningkatkan rasa percaya diri warga"
        ],
        correctAnswer: 1,
        explanation: "Hoaks menyesatkan masyarakat dan merusak kepercayaan antar kelompok."
      },
      {
        question: "Materi kampanye harus disusun secara berurutan agar...",
        options: ["Sama dengan buku sekolah", "Tujuan penyebaran informasi tercapai dengan baik", "Tidak bisa ditiru", "Hanya untuk syarat administratif"],
        correctAnswer: 1,
        explanation: "Struktur informasi yang baik memudahkan publik memahami pesan yang disampaikan."
      },
      {
        question: "Penyebaran informasi secara langsung dapat dilakukan melalui...",
        options: ["Media sosial", "Percakapan dengan teman dan keluarga", "Televisi", "Baliho di jalan raya"],
        correctAnswer: 1,
        explanation: "Komunikasi interpersonal (langsung) sangat efektif untuk meyakinkan orang terdekat."
      },
      {
        question: "Apa contoh kampanye yang disebutkan dalam materi?",
        options: ["Kampanye produk kecantikan", "Kampanye pengelolaan sampah dan hemat energi", "Kampanye pelarangan budaya", "Kampanye perpindahan ibukota"],
        correctAnswer: 1,
        explanation: "Kampanye sosial bertujuan untuk perubahan perilaku masyarakat ke arah yang lebih baik."
      },
      {
        question: "Masyarakat harus bijak menerima informasi karena hoaks dapat menyebabkan...",
        options: ["Kesalahpahaman dan kegagalan inovasi", "Peningkatan ekonomi", "Kerjasama yang lebih erat", "Kebebasan berpendapat"],
        correctAnswer: 0,
        explanation: "Informasi yang salah (hoaks) memicu konflik dan menghambat kemajuan harmoni."
      }
    ]
  },
  // LEVEL 14: DISKUSI & DENGAR PENDAPAT (PUBLIC HEARING)
  {
    level: 14,
    title: "Dialog & Aspirasi Publik",
    questions: [
      {
        question: "Mengapa diskusi atau dialog dianggap lebih efektif dibanding komunikasi satu arah?",
        options: [
          "Karena lebih banyak orang yang bicara",
          "Membuka komunikasi dua arah agar pemahaman bersama tercapai",
          "Karena biayanya lebih murah",
          "Agar bisa saling berdebat dengan keras"
        ],
        correctAnswer: 1,
        explanation: "Diskusi memungkinkan adanya tanya jawab untuk meluruskan informasi yang tidak dimengerti."
      },
      {
        question: "Apa itu 'Public Hearing' (Dengar Pendapat) menurut KBBI?",
        options: [
          "Mendengarkan keluhan warga secara rahasia",
          "Pertemuan mendengarkan penjelasan/pendapat dari yang berwenang atau masyarakat",
          "Pemberian bantuan uang kepada masyarakat",
          "Demonstrasi untuk menuntut hak"
        ],
        correctAnswer: 1,
        explanation: "Dengar pendapat adalah forum resmi untuk mendengarkan aspirasi publik."
      },
      {
        question: "Dalam 'Public Hearing', instansi biasanya mengundang siapa saja?",
        options: [
          "Hanya pihak keluarga instansi",
          "Akademisi dan masyarakat yang akan terdampak",
          "Hanya orang kaya",
          "Masyarakat dari negara lain"
        ],
        correctAnswer: 1,
        explanation: "Melibatkan ahli dan warga terdampak memastikan kebijakan yang dibuat tepat sasaran."
      },
      {
        question: "Apa manfaat dari kegiatan dengar pendapat dalam pembangunan?",
        options: [
          "Mempercepat pembangunan tanpa aturan",
          "Mencegah kesalahpahaman dan sesuai kebutuhan masyarakat",
          "Menghabiskan anggaran tahunan",
          "Hanya sebagai formalitas politik"
        ],
        correctAnswer: 1,
        explanation: "Aspirasi warga dalam forum ini menjadi dasar pembangunan yang inklusif."
      },
      {
        question: "Dialog atau diskusi harmoni sosial sering dilakukan di tingkat...",
        options: ["Hanya di lingkungan rumah", "Personal, kenegaraan, hingga internasional", "Hanya saat ada konflik besar", "Hanya di lingkungan sekolah"],
        correctAnswer: 1,
        explanation: "Dialog adalah instrumen universal untuk mencapai perdamaian di semua level."
      },
      {
        question: "Melalui dengar pendapat, masyarakat mendapatkan pengetahuan tentang harmoni sosial dan dapat...",
        options: ["Membatalkan seluruh aturan", "Menyalurkan aspirasinya", "Mencari kesalahan orang lain", "Minta uang saku"],
        correctAnswer: 1,
        explanation: "Forum ini memberikan kesempatan rakyat untuk berkontribusi ide pada negara."
      },
      {
        question: "Public Hearing biasanya dilakukan di forum...",
        options: ["Informal seperti di warung", "Resmi seperti lembaga negara atau instansi formal", "Hanya di media sosial", "Pasar tradisional"],
        correctAnswer: 1,
        explanation: "Dengar pendapat adalah bagian dari proses birokrasi yang transparan."
      },
      {
        question: "Apa fungsi komunikasi dua arah dalam penyebaran informasi?",
        options: [
          "Membuat informasi jadi simpang siur",
          "Memastikan pertanyaan dan penjelasan tersampaikan secara langsung",
          "Agar pemberi informasi terlihat hebat",
          "Mengurangi waktu istirahat"
        ],
        correctAnswer: 1,
        explanation: "Interaksi langsung mencegah salah tafsir terhadap sebuah gagasan."
      },
      {
        question: "Salah satu contoh Public Hearing adalah diskusi untuk...",
        options: ["Mencari pemenang lomba", "Penyusunan suatu peraturan atau rencana pembangunan", "Membagi hadiah", "Menghukum pelanggar lalu lintas"],
        correctAnswer: 1,
        explanation: "Kebijakan publik yang baik harus didahului dengan mendengarkan suara publik."
      },
      {
        question: "Masyarakat dapat memberi tanggapan dan saran mengenai cara membentuk harmoni sosial melalui...",
        options: ["Berita hoaks", "Forum dengar pendapat", "Mengabaikan aturan", "Diskusi satu arah"],
        correctAnswer: 1,
        explanation: "Tanggapan warga sangat berharga untuk menciptakan strategi harmoni yang realistis."
      }
    ]
  },
  // LEVEL 15: FILANTROPI & AKSI SOSIAL
  {
    level: 15,
    title: "Filantropi & Kerjasama Sosial",
    questions: [
      {
        question: "Filantropi didefinisikan sebagai bentuk kedermawanan yang didorong oleh...",
        options: ["Keinginan untuk pamer kekayaan", "Kecintaan terhadap sesama dan nilai kemanusiaan", "Kewajiban dari perusahaan", "Pencarian pengikut politik"],
        correctAnswer: 1,
        explanation: "Filantropi murni didasari oleh rasa kasih sayang antar-manusia."
      },
      {
        question: "Kegiatan filantropi tidak terbatas pada uang, tapi juga termasuk...",
        options: ["Hanya barang elektronik", "Waktu, tenaga, ide, dan gagasan", "Menunggu instruksi pemerintah", "Barang mewah bermerek"],
        correctAnswer: 1,
        explanation: "Segala bentuk sumbangsih (materi/non-materi) yang membantu orang lain disebut filantropi."
      },
      {
        question: "Manfaat filantropi salah satunya adalah memberi akses terhadap sumber daya guna meningkatkan...",
        options: ["Ketergantungan anggota", "Kemandirian anggota dalam memenuhi hidup", "Jumlah hutang masyarakat", "Kekuasaan pemberi dana"],
        correctAnswer: 1,
        explanation: "Filantropi yang baik memberdayakan masyarakat agar bisa bangkit mandiri."
      },
      {
        question: "Siapa saja yang dapat melakukan kegiatan filantropi?",
        options: [
          "Hanya orang kaya dan konglomerat",
          "Perorangan, kelompok, negara, maupun organisasi internasional",
          "Hanya warga negara asing",
          "Hanya pemerintah pusat"
        ],
        correctAnswer: 1,
        explanation: "Kedermawanan bisa dilakukan oleh siapapun yang memiliki kepedulian."
      },
      {
        question: "Contoh filantropi dalam bentuk pemberdayaan ekonomi adalah...",
        options: ["Memberi uang saku harian", "Pelatihan UMKM berbasis digital", "Membelikan barang elektronik", "Memberi sembako selamanya"],
        correctAnswer: 1,
        explanation: "Pelatihan memberikan 'kail' (keahlian) bukan sekadar 'ikan' (bantuan sekali habis)."
      },
      {
        question: "Kegiatan pendampingan dan perawatan sosial umumnya dilakukan untuk...",
        options: ["Masyarakat yang sangat kaya", "Kelompok berkebutuhan khusus dan kelompok marginal", "Hanya untuk siswa sekolah", "Pejabat pemerintahan"],
        correctAnswer: 1,
        explanation: "Difabel, lansia, dan korban bencana adalah sasaran utama pendampingan sosial."
      },
      {
        question: "Apa tujuan utama dari kegiatan amal (filantropi) seperti mengumpulkan dana bencana?",
        options: [
          "Mendapatkan piagam penghargaan",
          "Berbuat kebaikan terhadap masyarakat atau sesama manusia",
          "Menghabiskan sisa uang di dompet",
          "Hanya karena disuruh oleh sekolah"
        ],
        correctAnswer: 1,
        explanation: "Filantropi adalah aksi nyata dari rasa empati dan cinta kasih."
      },
      {
        question: "Pendampingan sosial bagi korban bencana dapat dilakukan oleh...",
        options: ["Hanya tentara", "Pemerintah maupun masyarakat", "Hanya tenaga medis luar negeri", "Satu orang pemberani saja"],
        correctAnswer: 1,
        explanation: "Kolaborasi antara negara dan warga mempercepat pemulihan kondisi sosial."
      },
      {
        question: "Filantropi membantu masyarakat marginal agar tidak lagi mengalami...",
        options: ["Kesamaan hak", "Keterbatasan akses dan pengucilan (eksklusi)", "Peningkatan pendidikan", "Kemandirian ekonomi"],
        correctAnswer: 1,
        explanation: "Bantuan filantropi membuka 'pintu' akses yang selama ini tertutup bagi warga marginal."
      },
      {
        question: "Aksi filantropi mendukung terciptanya harmoni sosial karena...",
        options: [
          "Memaksa orang miskin untuk patuh",
          "Membangun rasa peduli dan solidaritas nyata di tengah perbedaan",
          "Menghilangkan kasta kaya dan miskin secara paksa",
          "Hanya menguntungkan pihak yayasan"
        ],
        correctAnswer: 1,
        explanation: "Kepedulian nyata melalui bantuan mempererat hubungan sosial antar lapisan masyarakat."
      }
    ]
  }
];

const ALL_QUIZ_DATA = [...HARMONI_QUIZ_DATA, ...HARMONI_QUIZ_51_100, ...HARMONI_QUIZ_101_150];

export const QUIZ_LEVELS: Record<number, { title: string, questions: any[] }> = ALL_QUIZ_DATA.reduce((acc, item) => {
  acc[item.level] = { title: item.title, questions: item.questions };
  return acc;
}, {} as any);