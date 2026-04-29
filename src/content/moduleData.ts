export interface Session {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  analogy?: {
    concept: string;
    description: string;
  };
  quiz: {
    question: string;
    options?: string[];
    answer: string;
    type: 'true-false' | 'multiple-choice' | 'fill-in';
  };
}

export const MODULE_SESSIONS: Session[] = [
  {
    id: '1',
    title: 'Sesi 1: Hakikat Harmoni & Solidaritas',
    subtitle: 'Kenapa Kita Nggak Bisa Hidup Sendirian?',
    content: `Hai! Pernah terpikir nggak kenapa di orkestra, suara biola, trompet, dan piano yang beda banget malah bisa jadi musik yang enak didengar? Itulah Harmoni.\n\nHarmoni sosial bukan berarti kita harus jadi sama (seragam). Bayangin kalau satu orkestra cuma bunyi biola semua, pasti ngebosenin kan? Harmoni itu seni menyusun perbedaan jadi keindahan.\n\nSolidaritas terbagi dua menurut Durkheim:\n1. Mekanik: Kayak sapu lidi. Kuat karena semuanya sama (masyarakat tradisional).\n2. Organik: Kayak mesin mobil. Kuat karena komponennya beda tapi saling butuh (masyarakat modern).`,
    quiz: {
      question: 'Harmoni akan tercipta jika kita menghapus semua perbedaan agar tercipta keseragaman.',
      answer: 'false',
      type: 'true-false'
    }
  },
  {
    id: '2',
    title: 'Sesi 2: Integrasi Sosial',
    subtitle: 'Gimana Cara Kita Bisa Menyatu?',
    content: `Integrasi itu kayak bikin Es Buah. Ada semangka, melon, dan susu. Mereka beda, tapi saat disatukan, rasanya pecah banget!\n\nAda 3 bentuk integrasi:\n1. Normatif: Disatukan norma (Bhinneka Tunggal Ika).\n2. Fungsional: Disatukan karena saling butuh fungsi (Aceh kopi, Jakarta jual).\n3. Koersif: Disatukan paksaan (Pengusuran PKL demi ketertiban).`,
    quiz: {
      question: 'Proses peleburan dua budaya hingga ciri khas aslinya hilang disebut...',
      options: ['Akulturasi', 'Asimilasi', 'Akomodasi', 'Amalgamasi'],
      answer: 'Asimilasi',
      type: 'multiple-choice'
    }
  },
  {
    id: '3',
    title: 'Sesi 3: Akomodasi & Kesetaraan',
    subtitle: 'Toolbox Untuk Mengatasi Konflik',
    content: `Kalau lagi berantem sama teman, jangan langsung ghosting! Pakai "Akomodasi".\n\nBeberapa tool-nya:\n- Mediasi: Pihak ketiga cuma jadi penasihat.\n- Arbitrase: Pihak ketiga yang mutusin.\n- Kompromi: Sama-sama ngalah dikit.\n- Stalemate: Kekuatan seimbang, jadi berhenti berantem sendiri.\n\nKesetaraan: Bukan berarti semua orang punya tinggi badan yang sama, tapi semua orang punya hak yang sama buat main basket!`,
    quiz: {
      question: 'Pihak ketiga dalam "Mediasi" berhak mengambil keputusan final.',
      answer: 'false',
      type: 'true-false'
    }
  },
  {
    id: '4',
    title: 'Sesi 4: Inklusi & Kohesi Sosial',
    subtitle: 'No One Left Behind!',
    content: `Inklusi sosial itu proses ngajak semua orang ikut serta, terutama yang sering "terpinggirkan" (Marginal). Contohnya teman difabel dapet akses kursi roda di sekolah.\n\nKohesi sosial itu "lem" masyarakat. Bahannya: Kepercayaan, Rasa Memiliki, dan Kerjasama.`,
    quiz: {
      question: 'Inklusi sosial sejalan dengan ideologi Pancasila.',
      answer: 'true',
      type: 'true-false'
    }
  },
  {
    id: '5',
    title: 'Sesi 5: Aksi Nyata (Agent of Change)',
    subtitle: 'Waktunya Bikin Perubahan!',
    content: `Gimana cara bangun harmoni? \n1. Kampanye: Sebar info positif.\n2. Dialog: Ngobrol dua arah.\n3. Kolaborasi: Bakti sosial atau filantropi (kedermawanan).\n\nIngat alurnya: Perencanaan (SWOT) -> Pelaksanaan -> Evaluasi.`,
    quiz: {
      question: 'Apa kepanjangan dari SWOT dalam perencanaan?',
      options: ['Strength, Weakness, Oppt, Threat', 'Social, Work, Out, Time'],
      answer: 'Strength, Weakness, Oppt, Threat',
      type: 'multiple-choice'
    }
  }
];
