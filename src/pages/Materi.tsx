import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Lightbulb, ChevronRight, ArrowRight, 
  FileText, Layout, Users, Target, Zap, Layers, RefreshCcw, ShieldCheck, Scale, Gavel,
  HelpCircle, Check, BookOpen, HeartHandshake, Sparkles, Filter, Clock, GraduationCap
} from 'lucide-react';

// --- DATA MATERI ---
const MATERI_LIST = [
  {
    id: 'pengertian-harmoni',
    title: 'Hakikat Harmoni Sosial',
    category: 'Dasar',
    duration: '15m',
    icon: <Users size={28} />,
    color: 'bg-blue-500',
    content: 'Harmoni adalah keselarasan atau keserasian. Harmoni sosial adalah kondisi di mana individu dalam masyarakat hidup seiring dan sejalan.',
    theory: 'Herbert Spencer membagi dua jenis solidaritas: Mekanik (masyarakat pra-industri, homogen) dan Organik (masyarakat modern, heterogen, saling ketergantungan).',
    indicators: ['Adanya solidaritas dan kekompakan', 'Integrasi nilai & norma yang kuat', 'Tercapainya konsensus kolektif']
  },
  {
    id: 'integrasi-sosial',
    title: 'Integrasi Sosial',
    category: 'Proses',
    duration: '30m',
    icon: <Target size={28} />,
    color: 'bg-indigo-500',
    content: 'Proses penyesuaian unsur-unsur yang berbeda dalam masyarakat sehingga menjadi satu kesatuan yang utuh.',
    types: [
      { t: "Normatif", d: "Berdasarkan norma-norma yang berlaku (contoh: Bhinneka Tunggal Ika)." },
      { t: "Fungsional", d: "Berdasarkan fungsi-fungsi tertentu dalam masyarakat yang saling melengkapi." },
      { t: "Koersif", d: "Dilakukan dengan kekuasaan atau paksaan oleh pihak berwenang." }
    ],
    accommodation: ["Koersi (Paksaan)", "Kompromi", "Mediasi", "Konsiliasi", "Adjudikasi"]
  },
  {
    id: 'kesetaraan-sosial',
    title: 'Kesetaraan Sosial',
    category: 'Prinsip',
    duration: '20m',
    icon: <Scale size={28} />,
    color: 'bg-emerald-500',
    content: 'Prinsip persamaan martabat sebagai manusia yang memiliki hak-hak yang sama.',
    types: [
      { t: "Kesempatan", d: "Setiap orang memiliki akses yang sama terhadap posisi sosial." },
      { t: "Sejak Awal", d: "Kompetisi yang adil dimulai dari titik start yang sama bagi setiap individu." },
      { t: "Hasil", d: "Upaya agar setiap orang menikmati standar hidup yang memadai." }
    ],
    law: [
      { no: "Ayat (1)", isi: "Segala warga negara bersamaan kedudukannya di dalam hukum dan pemerintahan." },
      { no: "Ayat (2)", isi: "Tiap-tiap warga negara berhak atas pekerjaan dan penghidupan yang layak bagi kemanusiaan." },
      { no: "Ayat (3)", isi: "Setiap warga negara berhak dan wajib ikut serta dalam upaya pembelaan negara." }
    ],
    closingNote: "Penerapan prinsip kesetaraan sangat krusial untuk menghindari diskriminasi, meminimalisir konflik, dan menciptakan harmoni dalam kehidupan bernegara."
  },
  {
    id: 'inklusi-sosial',
    title: 'Inklusi Sosial',
    category: 'Prinsip',
    duration: '25m',
    icon: <Zap size={28} />,
    color: 'bg-amber-500',
    content: 'Upaya menempatkan martabat dan kemandirian individu sebagai pusat untuk menciptakan lingkungan yang terbuka bagi siapa saja.',
    characteristics: [
      { t: "Menciptakan Tatanan", d: "Proses bagi semua orang agar tidak ada lagi yang terpinggirkan." },
      { t: "Peningkatan Partisipasi", d: "Memberdayakan masyarakat yang kurang beruntung." },
      { t: "Akses Kesempatan", d: "Menjamin setiap orang memiliki hak dan sumber daya yang sama." }
    ],
    inclusiveMindset: ["Kesadaran akan kemajemukan", "Sikap jujur & akal sehat", "Kerja sama antar warga", "Kedewasaan bermasyarakat"]
  },
  {
    id: 'kohesi-sosial',
    title: 'Kohesi Sosial',
    category: 'Relasi',
    duration: '20m',
    icon: <Layers size={28} />,
    color: 'bg-rose-500',
    content: 'Kekuatan pengikat masyarakat sehingga mereka memiliki rasa kepemilikan dan saling percaya.',
    components: [
      { label: "Potensi Kelompok", desc: "Besarnya pengaruh kelompok terhadap perilaku individu." },
      { label: "Motif Keanggotaan", desc: "Besar kecilnya keinginan seseorang untuk bergabung dalam kelompok." }
    ],
    urgensi: "Semua pihak perlu menuangkan ide dan tindakan nyata untuk menciptakan kepuasan kolektif.",
    contoh: ["PPI Luar Negeri", "Arisan Warga"],
    kesimpulan: "Kohesi sosial terbentuk oleh kesamaan nilai, tantangan, dan kesempatan yang setara."
  },
  {
    id: 'sikap-mental',
    title: 'Sikap Mental Utama',
    category: 'Mindset',
    duration: '25m',
    icon: <ShieldCheck size={28} />,
    color: 'bg-cyan-500',
    content: '9 Sikap mental sebagai dasar utama membangun harmoni dalam masyarakat heterogen.',
    poin: [
      { t: "1. Menyikapi perbedaan secara positif", d: "Perbedaan adalah kekayaan sosial yang meningkatkan solidaritas." },
      { t: "2. Memiliki sikap akomodatif", d: "Sikap menerima perbedaan dan mengurangi ketegangan." },
      { t: "3. Berjiwa heterogen", d: "Mempersatukan hubungan meskipun ada perbedaan." }
    ]
  },
  {
    id: 'apa-yang-dilakukan',
    title: 'Aksi Nyata Individu',
    category: 'Upaya',
    duration: '30m',
    icon: <Lightbulb size={28} />,
    color: 'bg-violet-500',
    content: 'Upaya nyata menciptakan harmoni sosial pada tingkat individu dan institusi.',
    individu: {
      intro: 'Upaya menciptakan harmoni sosial dapat dilakukan pada tingkat pribadi dan lembaga sosial.',
      poin: [
        { t: "Empati", d: "Memahami perasaan orang lain." },
        { t: "Persahabatan", d: "Membentuk kelompok positif." }
      ]
    }
  },
  {
    id: 'peran-membangun',
    title: 'Agen Perubahan',
    category: 'Peran',
    duration: '35m',
    icon: <GraduationCap size={28} />,
    color: 'bg-orange-600',
    content: 'Menyebarkan informasi, diskusi, dan kolaborasi nyata sebagai agen perubahan.',
    sections: [
      { title: "Informasi", content: "Melalui penyebaran informasi secara langsung maupun media sosial." },
      { title: "Dialog", content: "Membuka komunikasi dua arah agar pemahaman bersama tercapai." }
    ]
  },
  {
    id: 'membangun-aksi',
    title: 'Membangun Aksi',
    category: 'Siklus',
    duration: '45m',
    icon: <Sparkles size={28} />,
    color: 'bg-slate-900',
    content: 'Langkah-langkah mendesain kegiatan atau aksi untuk membangun harmoni sosial.',
    tahapan: [
      { title: "Perencanaan", content: "Identifikasi masalah melalui studi kepustakaan atau observasi." },
      { title: "Pelaksanaan", content: "Realisasi koordinasi dan dokumentasi." }
    ]
  }
];

export default function Materi() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');
  const selectedMateri = MATERI_LIST.find(m => m.id === selectedId);

  const categories = useMemo(() => ['All', ...new Set(MATERI_LIST.map(m => m.category))], []);

  const filteredMateri = useMemo(() => {
    return filter === 'All' 
      ? MATERI_LIST 
      : MATERI_LIST.filter(m => m.category === filter);
  }, [filter]);

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-sans pb-32">
      {/* SOPHISTICATED HERO */}
      <header className="relative pt-24 md:pt-32 pb-16 md:pb-24 px-6 overflow-hidden bg-white">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
           <div className="absolute top-20 right-20 w-96 h-96 bg-blue-100 rounded-full blur-[100px]" />
           <div className="absolute -bottom-40 -left-20 w-[600px] h-[600px] bg-soft-pink/30 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="px-6 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-6 md:mb-10 shadow-xl"
          >
            Socio Learning Hub
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-9xl font-display font-black text-slate-950 tracking-[-0.05em] mb-6 md:mb-8 text-center leading-[0.95]"
          >
            Pustaka <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Harmoni</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2 }}
            className="text-slate-400 font-bold text-lg md:text-xl max-w-2xl text-center leading-relaxed"
          >
            Jelajahi materi sosiologi dengan pendekatan yang lebih dalam, interaktif, dan visual.
          </motion.p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        {/* INTERACTIVE FILTER BAR */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
           <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2 w-full md:w-auto">
             {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`whitespace-nowrap px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                    filter === cat 
                      ? 'bg-blue-600 text-white shadow-xl scale-105' 
                      : 'bg-white text-slate-400 border border-slate-100 hover:border-blue-200'
                  }`}
                >
                  {cat}
                </button>
             ))}
           </div>
           
           <div className="hidden lg:flex items-center gap-3 text-slate-400">
             <Filter size={18} />
             <span className="text-xs font-bold uppercase tracking-widest">Urutkan Berdasarkan Kategori</span>
           </div>
        </div>

        {/* BENTO GRID GALLERY */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 md:auto-rows-[280px]">
          {filteredMateri.map((materi, idx) => {
            const isWide = materi.id === 'membangun-aksi' || materi.id === 'sikap-mental';
            const isTall = idx === 1 || idx === 3;
            const isHero = materi.id === 'pengertian-harmoni';

            return (
              <motion.div
                layoutId={materi.id}
                key={materi.id}
                onClick={() => setSelectedId(materi.id)}
                className={`
                  group cursor-pointer bg-white rounded-[3rem] p-3 border-2 border-slate-50 card-shadow transition-all hover:border-blue-200 overflow-hidden relative flex flex-col
                  ${isWide ? 'md:col-span-2' : 'md:col-span-2 lg:col-span-2'}
                  ${isTall ? 'md:row-span-2' : ''}
                  ${isHero ? 'md:col-span-4 lg:col-span-4 md:row-span-1' : ''}
                `}
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <div className={`w-full h-full rounded-[2.5rem] p-8 flex flex-col bg-white relative z-10 transition-colors group-hover:bg-blue-50/20`}>
                  <div className="flex justify-between items-start mb-8">
                     <div className={`p-4 rounded-2xl text-white shadow-lg ${materi.color || 'bg-blue-600'}`}>
                       {materi.icon}
                     </div>
                     <div className="px-4 py-1.5 bg-slate-100 rounded-full flex items-center gap-2">
                        <Clock size={12} className="text-slate-400" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{materi.duration}</span>
                     </div>
                  </div>

                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">{materi.category}</span>
                    <h3 className={`font-black text-slate-900 leading-[0.95] tracking-tighter ${isHero ? 'text-3xl md:text-5xl' : 'text-2xl md:text-3xl'}`}>
                      {materi.title}
                    </h3>
                  </div>

                  <p className={`text-slate-400 font-medium text-sm mt-6 leading-relaxed ${isTall ? 'line-clamp-10' : 'line-clamp-2'}`}>
                    {materi.content}
                  </p>

                  <div className="mt-auto pt-8 flex items-center gap-3">
                     <span className="text-xs font-black uppercase text-slate-900">Explore Module</span>
                     <div className="h-0.5 flex-1 bg-slate-50 group-hover:bg-blue-200 transition-colors" />
                     <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-2 transition-transform text-blue-600" />
                  </div>
                </div>

                <div className="absolute top-0 right-0 w-40 h-40 opacity-0 group-hover:opacity-10 transition-opacity">
                   <Sparkles className="w-full h-full text-blue-600" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* BOTTOM CALL TO ACTION */}
        <section className="mt-24 text-center">
           <div className="bg-slate-950 p-16 rounded-[4rem] text-white relative overflow-hidden group">
              <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                <BookOpen size={48} className="mx-auto text-blue-400" />
                <h2 className="text-5xl font-display font-black leading-tight italic">
                  "Sosiologi Adalah Seni Memahami Kita."
                </h2>
                <p className="text-slate-400 font-bold opacity-80">Siap untuk mempraktikkan apa yang kamu pelajari di dunia nyata?</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                   <button 
                    onClick={() => navigate('/quiz')}
                    className="px-12 py-5 bg-blue-600 text-white rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-xl hover:scale-105 transition-transform"
                   >
                      Mulai Aksi Sekarang
                   </button>
                </div>
              </div>
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/30 via-transparent to-transparent" />
           </div>
        </section>
      </main>

      {/* DETAIL MODAL OVERLAY */}
      <AnimatePresence>
        {selectedMateri && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-3xl z-[80]"
            />
            <motion.div
              layoutId={selectedId!}
              className="fixed inset-4 md:inset-12 bg-white z-[90] rounded-[2.5rem] md:rounded-[4rem] shadow-2xl flex flex-col overflow-hidden border-[1px] border-white/10"
            >
              <div className="flex-1 overflow-y-auto hide-scrollbar bg-white">
                <div className="relative h-64 md:h-96 overflow-hidden bg-slate-950">
                   <div className={`absolute inset-0 opacity-40 ${selectedMateri.color || 'bg-blue-600'}`} />
                   <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                   
                   <div className="absolute bottom-8 md:bottom-16 left-8 md:left-16 right-8 md:right-16">
                      <div className="flex items-center gap-4 mb-4 md:mb-8">
                         <div className="p-3 md:p-4 bg-white/10 backdrop-blur-xl rounded-2xl md:rounded-3xl text-white border border-white/20">
                           {selectedMateri.icon}
                         </div>
                         <div className="px-4 md:px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-[8px] md:text-[10px] font-black text-white uppercase tracking-[0.3em] border border-white/30">
                           {selectedMateri.category}
                         </div>
                      </div>
                      <h2 className="text-3xl md:text-6xl lg:text-8xl font-display font-black text-slate-950 tracking-tighter leading-none mb-4">
                        {selectedMateri.title}
                      </h2>
                   </div>

                   <button 
                    onClick={() => setSelectedId(null)} 
                    className="absolute top-6 md:top-10 right-6 md:right-10 p-3 md:p-5 bg-white/10 backdrop-blur-md text-white rounded-2xl md:rounded-3xl hover:bg-white/20 transition-all border border-white/10"
                  >
                    <X size={24} md:size={32} />
                  </button>
                </div>

                <div className="p-8 md:p-16 max-w-5xl mx-auto space-y-12 md:space-y-24">
                   <div className="prose prose-lg md:prose-2xl">
                     <p className="text-xl md:text-3xl text-slate-500 font-display italic leading-relaxed border-l-4 md:border-l-8 border-blue-600 pl-6 md:pl-12 py-2">
                        {selectedMateri.content}
                     </p>
                   </div>

                   {selectedMateri.theory && (
                     <section className="p-8 md:p-16 bg-slate-50 rounded-[2.5rem] md:rounded-[4rem] border-2 border-slate-100">
                        <h4 className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-blue-600 mb-6 md:mb-8 border-b-2 border-blue-100 pb-4 inline-block">Landasan Teori</h4>
                        <div className="space-y-8 md:space-y-12">
                           <p className="text-lg md:text-2xl font-black text-slate-900 leading-snug">{selectedMateri.theory}</p>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                              {selectedMateri.indicators?.map((ind, i) => (
                                 <div key={i} className="bg-white p-4 md:p-6 rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-blue-600 transition-all">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                       <Check size={16} md:size={20} />
                                    </div>
                                    <span className="font-bold text-sm md:text-base text-slate-700">{ind}</span>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </section>
                   )}

                   {selectedMateri.types && (
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {(selectedMateri.types as any[]).map((type: any, i: number) => (
                          <div key={i} className="p-10 bg-white border-2 border-slate-50 rounded-[3.5rem] card-shadow flex flex-col group hover:bg-blue-600 transition-all">
                             <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center font-black text-2xl mb-8 group-hover:bg-white transition-colors">{i+1}</div>
                             <h5 className="text-2xl font-black text-slate-900 mb-6 group-hover:text-white">{type.t}</h5>
                             <p className="text-sm font-medium text-slate-400 leading-relaxed group-hover:text-blue-100">{type.d}</p>
                          </div>
                        ))}
                     </div>
                   )}

                   {selectedMateri.characteristics && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                         {(selectedMateri.characteristics as any[]).map((c: any, i: number) => (
                           <div key={i} className="p-10 bg-slate-900 rounded-[3.5rem] text-white">
                              <h5 className="text-xl font-black text-blue-400 mb-4">{c.t}</h5>
                              <p className="text-sm font-medium text-slate-400 leading-relaxed">{c.d}</p>
                           </div>
                         ))}
                      </div>
                   )}

                   {selectedMateri.tahapan && (
                      <div className="space-y-12">
                         {(selectedMateri.tahapan as any[]).map((t: any, i: number) => (
                           <div key={i} className="bg-slate-50 p-12 rounded-[4rem] border-2 border-slate-100 relative group overflow-hidden">
                              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                              <div className="relative z-10">
                                 <h5 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-4">Phase 0{i+1}</h5>
                                 <h4 className="text-4xl font-black text-slate-900 mb-6">{t.title}</h4>
                                 <p className="text-xl font-bold text-slate-500">{t.content}</p>
                              </div>
                           </div>
                         ))}
                      </div>
                   )}

                   <div className="pt-20 border-t-2 border-slate-100 text-center space-y-8 pb-10">
                       <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">Socio Learning Module Completed</p>
                       <button 
                        onClick={() => setSelectedId(null)}
                        className="px-16 py-6 bg-slate-900 text-white rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl"
                       >
                         Kembali Ke Pustaka
                       </button>
                   </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
