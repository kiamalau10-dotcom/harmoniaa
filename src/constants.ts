import { Badge, Materi, StoryNode, DailyTip, DiscussionRoom, UserPresence } from './types';

export const INITIAL_PROGRESS = {
  level: 1,
  xp: 150,
  score: 0,
  badges: [
    { id: '1', name: 'Siswa Teladan', icon: 'Award', description: 'Menyelesaikan login pertama' }
  ],
  unlockedEndings: [],
  materiOpened: ['m1']
};

export const DISCUSSION_ROOMS: DiscussionRoom[] = [
  { id: '1', name: 'Solidaritas 101', description: 'Diskusi santai tentang mekanik & organik.', memberCount: 120, activeNow: 15, category: 'Dasar' },
  { id: '2', name: 'Lab Konflik', description: 'Bedah kasus konflik di sekolah.', memberCount: 85, activeNow: 4, category: 'Lanjut' },
  { id: '3', name: 'Amalgamasi Corner', description: 'Tentang asimilasi dan akulturasi.', memberCount: 45, activeNow: 2, category: 'Tantangan' },
  { id: '4', name: 'Open Mic Harmoni', description: 'Ruang curhat & solusi sosial.', memberCount: 200, activeNow: 24, category: 'Sosial' },
];

export const ONLINE_USERS: UserPresence[] = [
  { id: 'u1', name: 'Budi Santoso', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Budi', status: 'study', color: '#BEE3F8' },
  { id: 'u2', name: 'Siti Aminah', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Siti', status: 'online', color: '#FED7E2' },
  { id: 'u3', name: 'Andi Wijaya', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Andi', status: 'battle', color: '#E9D8FD' },
  { id: 'u4', name: 'Rina Kartika', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Rina', status: 'study', color: '#C6F6D5' },
];

export const MATERI_LIST: Materi[] = [
  {
    id: 'm1',
    title: 'Apa itu Harmoni Sosial?',
    category: 'Dasar',
    content: 'Harmoni sosial adalah kondisi di mana anggota masyarakat hidup berdampingan secara damai. Bukan berarti seragam, tapi saling melengkapi.',
    type: 'artikel',
    duration: '3m'
  },
  {
    id: 'm2',
    title: 'Solidaritas Mekanik vs Organik',
    category: 'Dasar',
    content: 'Memahami perbedaan mendasar antara solidaritas di masyarakat tradisional (kesamaan) dan modern (spesialisasi).',
    type: 'slide',
    duration: '5m',
    slides: [
      { title: 'Solidaritas Mekanik', content: 'Didasarkan pada kesamaan peran dan norma kolektif. Contoh: Masyarakat adat dan pedesaan.', imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800' },
      { title: 'Solidaritas Organik', content: 'Didasarkan pada spesialisasi dan saling ketergantungan antar profesi. Contoh: Masyarakat industri.', imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=800' }
    ]
  },
  {
    id: 'm3',
    title: 'Integrasi dan Akulturasi',
    category: 'Lanjut',
    content: 'Bagaimana budaya-budaya berbeda bisa menyatu tanpa menghilangkan identitasnya melalui proses akulturasi.',
    type: 'video',
    duration: '8m',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 'm4',
    title: 'Konflik dan Konsensus',
    category: 'Lanjut',
    content: 'Dua perspektif besar dalam melihat masyarakat: Sebagai sistem yang stabil atau arena pertarungan kepentingan.',
    type: 'artikel',
    duration: '4m'
  },
  {
    id: 'm5',
    title: 'Amalgamasi: Peleburan Budaya',
    category: 'Tantangan',
    content: 'Analisis mendalam tentang pernikahan antar-etnis sebagai katalisator integrasi nasional.',
    type: 'slide',
    duration: '6m',
    slides: [
      { title: 'Definisi Amalgamasi', content: 'Proses penyatuan dua atau lebih ras/etnis yang menghasilkan kelompok baru.', imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800' },
      { title: 'Studi Kasus', content: 'Menganalisis asimilasi biologis di masyarakat urban Indonesia.', imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800' }
    ]
  },
  {
    id: 'm6',
    title: 'Inklusi Sosial vs Eksklusi',
    category: 'Tantangan',
    content: 'Materi tingkat lanjut tentang cara sistem sosial membuang atau merangkul kelompok marginal.',
    type: 'video',
    duration: '10m',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 'm7',
    title: 'Diferensiasi Sosial',
    category: 'Dasar',
    content: 'Pemilahan masyarakat secara horizontal berdasarkan ciri fisik, sosial, dan budaya.',
    type: 'artikel',
    duration: '3m'
  },
  {
    id: 'm8',
    title: 'Stratifikasi Sosial',
    category: 'Dasar',
    content: 'Pelapisan masyarakat secara vertikal: Kasta, kelas, dan kekuasaan.',
    type: 'slide',
    duration: '5m',
    slides: [
      { title: 'Stratifikasi Terbuka', content: 'Memungkinkan mobilitas sosial naik atau turun berdasarkan prestasi.', imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800' },
      { title: 'Stratifikasi Tertutup', content: 'Membatasi kemungkinan pindah lapisan. Contoh: Sistem Kasta.', imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800' }
    ]
  }
];

export const STORY_NODES: Record<string, StoryNode> = {
  start: {
    id: 'start',
    text: 'Kamu sedang berjalan di koridor sekolah dan melihat seorang teman baru sedang duduk sendirian sambil menangis karena diejek oleh siswa lain. Apa yang kamu lakukan?',
    choices: [
      { text: 'Menanyakan keadaannya dan menawarkan bantuan', nextNodeId: 'baik' },
      { text: 'Diam saja dan pura-pura tidak melihat', nextNodeId: 'ignored' },
      { text: 'Ikut menertawakan agar terlihat keren', nextNodeId: 'jahat' }
    ]
  },
  baik: {
    id: 'baik',
    text: 'Dia merasa sangat terbantu dengan kehadiranmu. Ternyata dia baru saja kehilangan barang berharganya. Kamu membantunya mencari barang tersebut.',
    choices: [
      { text: 'Mencarinya bersama-sama', nextNodeId: 'good_ending' },
      { text: 'Melapor ke guru piket', nextNodeId: 'hero_ending' }
    ]
  },
  ignored: {
    id: 'ignored',
    text: 'Kamu berlalu begitu saja. Besoknya kamu mendengar dia pindah sekolah karena merasa tidak punya teman.',
    choices: [
      { text: 'Lihat ending...', nextNodeId: 'sad_ending' }
    ]
  },
  jahat: {
    id: 'jahat',
    text: 'Tindakanmu direkam oleh CCTV sekolah dan kamu dipanggil ke ruang BK.',
    choices: [
      { text: 'Lihat ending...', nextNodeId: 'bad_ending' }
    ]
  },
  good_ending: {
    id: 'good_ending',
    text: 'KAMU BERHASIL! Dia sekarang menjadi sahabat terbaikmu dan kalian membangun klub anti-bullying di sekolah.',
    choices: [
      { text: 'Main Lagi', nextNodeId: 'start', endingType: 'Good' }
    ]
  },
  hero_ending: {
    id: 'hero_ending',
    text: 'PLOT TWIST! Ternyata guru piket adalah ayahnya yang sedang menyamar untuk menguji kepedulian siswa.',
    choices: [
      { text: 'Main Lagi', nextNodeId: 'start', endingType: 'Plot Twist' }
    ]
  },
  sad_ending: {
    id: 'sad_ending',
    text: 'PENYESALAN TERLAMBAT. Kamu menyadari bahwa harmoni sosial dimulai dari kepedulian kecil yang kamu abaikan.',
    choices: [
      { text: 'Main Lagi', nextNodeId: 'start', endingType: 'Sad' }
    ]
  },
  bad_ending: {
    id: 'bad_ending',
    text: 'BURUK! Kamu mendapatkan skorsing dan dijauhi teman-teman karena perilaku tidak harmonismu.',
    choices: [
      { text: 'Main Lagi', nextNodeId: 'start', endingType: 'Bad' }
    ]
  }
};

export const DAILY_TIPS: DailyTip[] = [
  { title: 'Toleransi', content: 'Coba dengarkan pendapat temanmu sampai selesai sebelum memotong pembicaraan.', icon: 'Ear' },
  { title: 'Empati', content: 'Bayangkan dirimu di posisi orang lain sebelum memberikan kritik.', icon: 'Heart' },
  { title: 'Komunikasi', content: 'Gunakan kata "Maaf", "Tolong", dan "Terima Kasih" lebih sering hari ini.', icon: 'MessageCircle' }
];
