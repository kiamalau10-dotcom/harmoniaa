import { motion } from 'motion/react';
import { Search, Eye, AlertCircle, CheckCircle2, ArrowRight, MapPin } from 'lucide-react';

export default function EduCase() {
  const cases = [
    {
      id: '1',
      title: 'Kasus: Konflik Lahan Parkir di Perumahan Harmoni',
      status: 'Open',
      difficulty: 'Mudah',
      desc: 'Warga Blok A dan Blok B sering berselisih karena masalah parkir yang sempit. Bagaimana solusi integrasi sosialnya?'
    },
    {
      id: '2',
      title: 'Kasus: Diskriminasi Siswa Pindahan',
      status: 'In Progress',
      difficulty: 'Menengah',
      desc: 'Seorang siswa dari daerah terpencil mengalami kesulitan beradaptasi karena dialek bahasanya sering ditertawakan.'
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-soft-pink mb-1">
            <Search size={20} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Detektif Sosial</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800">EduCase Study</h1>
          <p className="text-slate-500">Menganalisis masalah nyata dan temukan solusi harmoni.</p>
        </div>
      </header>

      {/* Hero Case */}
      <section className="bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl relative min-h-[400px] flex items-end">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
        
        <div className="relative p-8 md:p-12 space-y-6 max-w-3xl">
          <div className="flex items-center gap-3">
             <span className="px-4 py-1 bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full animate-pulse">Hot Case</span>
             <span className="flex items-center gap-1 text-white/60 text-[10px] font-bold uppercase tracking-widest"><MapPin size={10} /> Jakarta Selatan</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            Tawuran Antar Pelajar: Membedah Akar Konflik & Integrasi
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Analisis mengapa solidaritas mekanik yang kuat justru bisa memicu konflik horizontal antar kelompok remaja.
          </p>
          <button className="px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl flex items-center gap-2 hover:scale-105 transition-transform">
             Mulai Analisis <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Case Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {cases.map((c) => (
          <motion.div 
            key={c.id}
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm space-y-6 flex flex-col"
          >
            <div className="flex items-center justify-between">
              <div className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                c.status === 'Open' ? 'bg-green-100 text-green-600' : 'bg-baby-blue/10 text-baby-blue'
              }`}>
                {c.status}
              </div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Difficulty: {c.difficulty}</span>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-800">{c.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{c.desc}</p>
            </div>

            <div className="pt-6 border-t border-slate-50 mt-auto flex items-center justify-between">
              <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">
                     S{i}
                   </div>
                 ))}
                 <div className="w-8 h-8 rounded-full bg-soft-pink/10 border-2 border-white flex items-center justify-center text-[10px] font-bold text-soft-pink">
                   +12
                 </div>
              </div>
              <button className="text-sm font-bold text-baby-blue flex items-center gap-1 hover:underline">
                 Lihat Detail <Eye size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* detective footer */}
      <section className="bg-baby-blue/10 p-8 rounded-[2.5rem] border border-baby-blue/20 flex flex-col md:flex-row items-center gap-8">
        <div className="w-20 h-20 bg-baby-blue rounded-3xl flex items-center justify-center text-white rotate-6 shadow-xl">
           <AlertCircle size={40} />
        </div>
        <div className="flex-1 space-y-2 text-center md:text-left">
           <h3 className="text-xl font-bold text-slate-800">Siap Menjadi Detektif Sosial?</h3>
           <p className="text-sm text-slate-500">Pecahkan 5 kasus untuk mendapatkan Badge "Sosiolog Muda".</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-center">
              <p className="text-2xl font-bold text-baby-blue">2</p>
              <p className="text-[10px] font-bold uppercase text-slate-400">Solved</p>
           </div>
           <div className="w-px h-10 bg-baby-blue/20" />
           <div className="text-center">
              <p className="text-2xl font-bold text-slate-300">3</p>
              <p className="text-[10px] font-bold uppercase text-slate-400">Remaining</p>
           </div>
        </div>
      </section>
    </div>
  );
}
