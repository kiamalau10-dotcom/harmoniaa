import { motion } from 'motion/react';
import { Trophy, Award, BookOpen, Star, Target, ArrowRight, Zap, Flame } from 'lucide-react';
import { INITIAL_PROGRESS, MATERI_LIST } from '../constants';

export default function Dashboard() {
  const stats = [
    { label: 'XP', value: INITIAL_PROGRESS.xp, icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { label: 'Score', value: INITIAL_PROGRESS.score, icon: Trophy, color: 'text-baby-blue', bg: 'bg-blue-50' },
    { label: 'Level', value: INITIAL_PROGRESS.level, icon: Target, color: 'text-soft-pink', bg: 'bg-pink-50' },
    { label: 'Streak', value: 3, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h1 className="text-3xl font-display font-black text-text-primary underline decoration-soft-pink decoration-8 underline-offset-4">Dashboard Personal</h1>
        <p className="text-slate-500 font-medium mt-2">Lihat sejauh mana kemampuan sosialmu berkembang!</p>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-4xl bg-white border-4 border-sidebar-border card-shadow flex flex-col items-center text-center gap-2"
          >
            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center ${stat.color} border-2 border-white shadow-sm`}>
              <stat.icon size={24} />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <p className="text-2xl font-black text-text-primary">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress & Badges */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-4xl border-4 border-soft-pink card-shadow space-y-6">
            <h3 className="text-xl font-display font-black text-text-primary flex items-center gap-2">
              <Award className="text-soft-pink" /> Badge Pencapaian
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {INITIAL_PROGRESS.badges.map((badge) => (
                <div key={badge.id} className="p-4 rounded-3xl bg-cream border-2 border-sidebar-border flex flex-col items-center text-center gap-2 transition-all hover:scale-105">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-inner border-4 border-soft-pink/20">
                    <Star size={32} className="text-soft-pink fill-soft-pink/20" />
                  </div>
                  <p className="text-xs font-black text-text-primary uppercase tracking-tight">{badge.name}</p>
                  <p className="text-[10px] text-slate-400 font-medium leading-tight">{badge.description}</p>
                </div>
              ))}
              <div className="p-4 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center gap-2 grayscale opacity-50">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <Star size={32} className="text-slate-200" />
                </div>
                <p className="text-[10px] text-slate-300 font-bold">Unlock di Level 10</p>
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-4xl border-4 border-baby-blue card-shadow space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-display font-black text-text-primary flex items-center gap-2">
                <BookOpen className="text-baby-blue" /> Materi Terbuka
              </h3>
              <button className="text-xs font-black text-[#2B6CB0] flex items-center gap-1 uppercase tracking-widest">
                Semua Materi <ArrowRight size={12} />
              </button>
            </div>
            <div className="space-y-4">
              {MATERI_LIST.filter(m => INITIAL_PROGRESS.materiOpened.includes(m.id)).map((materi) => (
                <div key={materi.id} className="flex items-center gap-4 p-4 rounded-3xl bg-baby-blue/10 border-2 border-white">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-baby-blue shadow-sm border-2 border-baby-blue/20">
                    <BookOpen size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-black text-text-primary">{materi.title}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{materi.category} • {materi.type}</p>
                  </div>
                  <div className="text-[10px] font-black text-green-600 bg-green-100 px-3 py-1 rounded-full border-2 border-white uppercase tracking-widest">
                    Selesai
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Recommendations */}
        <div className="space-y-8">
          <section className="bg-lilac rounded-4xl p-8 border-4 border-white card-shadow h-full space-y-6">
            <h3 className="text-xl font-display font-black text-[#553C9A]">Tantangan Berikutnya 🧁</h3>
            <div className="space-y-4">
              <div className="bg-white/50 backdrop-blur-md p-4 rounded-3xl border-2 border-white">
                 <p className="text-[11px] font-black text-[#553C9A] uppercase tracking-widest mb-1">MANISNYA BERBAGI</p>
                 <p className="text-[10px] text-[#6B46C1] font-medium leading-relaxed mb-4">Bantu 1 teman hari ini untuk mendapatkan +50 XP!</p>
                 <div className="w-full h-3 bg-white/30 rounded-full overflow-hidden">
                    <div className="h-full bg-lilac/80 rounded-full" style={{ width: '45%' }} />
                 </div>
              </div>
              <button className="w-full py-3 bg-[#553C9A] text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-transform">
                Lanjut Belajar
              </button>
            </div>
          </section>

          <section className="bg-sage p-6 rounded-4xl border-4 border-white card-shadow flex flex-col items-center text-center text-[#276749]">
            <div className="text-3xl mb-2">🤝</div>
            <h4 className="font-black text-sm uppercase tracking-widest">Ending Koleksi</h4>
            <div className="mt-2 flex items-center gap-2">
               <span className="bg-white/40 px-3 py-1 rounded-full text-xs font-black">Good Ending</span>
               <span className="text-xs font-bold text-[#2F855A]">1x Selesai</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
