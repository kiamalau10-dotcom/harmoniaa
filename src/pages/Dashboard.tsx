import { motion } from 'motion/react';
import { Trophy, Award, BookOpen, Star, Target, ArrowRight, Zap, Flame, Layout } from 'lucide-react';
import { INITIAL_PROGRESS, MATERI_LIST } from '../constants';
import { useAuth } from '../lib/AuthContext';

export default function Dashboard() {
  const { profile } = useAuth();
  
  if (!profile) return null;

  const stats = [
    { label: 'XP', value: profile.exp || 0, icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { label: 'Score', value: profile.totalQuizScore || 0, icon: Trophy, color: 'text-baby-blue', bg: 'bg-blue-50' },
    { label: 'Level', value: profile.level || 1, icon: Target, color: 'text-soft-pink', bg: 'bg-pink-50' },
    { label: 'Streak', value: profile.loginStreak || 1, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  const BADGE_MAP: Record<string, { name: string, description: string, icon: string }> = {
    'Pioneer': { name: 'Pioneer', description: 'Warga pertama di Lab Sosial.', icon: '🚀' },
    'SuperAdmin': { name: 'Super Admin', description: 'Memiliki akses kendali penuh.', icon: '⚡' },
    'Quiz Master': { name: 'Quiz Master', description: 'Menyelesaikan 10 Level Kuis.', icon: '🎓' },
    'Maze Runner': { name: 'Maze Runner', description: 'Menyelesaikan Labirin Harmoni.', icon: '🏃' },
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-soft-pink/20 text-soft-pink text-[10px] font-black uppercase tracking-widest rounded-full border border-soft-pink/30">
              {profile.role}
            </span>
          </div>
          <h1 className="text-4xl font-display font-black text-text-primary">
            Halo, <span className="text-[#553C9A]">{profile.username}</span>! 👋
          </h1>
          <p className="text-slate-500 font-medium mt-1">Siap untuk petualangan sosial hari ini?</p>
        </div>
        <div className="w-20 h-20 rounded-3xl overflow-hidden border-4 border-white card-shadow bg-baby-blue shrink-0">
          <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" />
        </div>
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
              {profile.badges && profile.badges.length > 0 ? (
                profile.badges.map((badgeKey) => {
                  const b = BADGE_MAP[badgeKey] || { name: badgeKey, description: 'Pencapaian spesial.', icon: '🌟' };
                  return (
                    <div key={badgeKey} className="p-4 rounded-3xl bg-cream border-2 border-sidebar-border flex flex-col items-center text-center gap-2 transition-all hover:scale-105">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-inner border-4 border-soft-pink/20 text-2xl">
                        {b.icon}
                      </div>
                      <p className="text-xs font-black text-text-primary uppercase tracking-tight">{b.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium leading-tight">{b.description}</p>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full p-8 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                  <p className="text-sm font-bold text-slate-400">Belum ada badge. Selesaikan kuis atau labirin untuk mendapatkannya!</p>
                </div>
              )}
              {(!profile.badges || profile.badges.length < 3) && (
                <div className="p-4 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center gap-2 grayscale opacity-50">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <Star size={32} className="text-slate-200" />
                  </div>
                  <p className="text-[10px] text-slate-300 font-bold">Terus Bermain!</p>
                </div>
              )}
            </div>
          </section>

          <section className="bg-white p-8 rounded-4xl border-4 border-baby-blue card-shadow space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-display font-black text-text-primary flex items-center gap-2">
                <BookOpen className="text-baby-blue" /> Materi Terbuka
              </h3>
            </div>
            <div className="space-y-4">
              {MATERI_LIST.map((materi) => (
                <div key={materi.id} className="flex items-center gap-4 p-4 rounded-3xl bg-baby-blue/10 border-2 border-white">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-baby-blue shadow-sm border-2 border-baby-blue/20">
                    <BookOpen size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-black text-text-primary">{materi.title}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{materi.category} • {materi.type}</p>
                  </div>
                  <div className="text-[10px] font-black text-green-600 bg-green-100 px-3 py-1 rounded-full border-2 border-white uppercase tracking-widest">
                    Terbuka
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Collection */}
        <div className="space-y-8">
          <section className="bg-sage p-10 rounded-4xl border-4 border-white card-shadow flex flex-col items-center text-center text-[#276749] h-full justify-center">
            <div className="text-5xl mb-4">🤝</div>
            <h4 className="font-black text-lg uppercase tracking-widest">Koleksi Harmoni</h4>
            <div className="mt-4 flex flex-col items-center gap-3 w-full">
               <div className="bg-white/40 px-6 py-2 rounded-full text-sm font-black w-full border-2 border-white">
                 Explorer: {profile.level}
               </div>
               <p className="text-xs font-bold text-[#2F855A] leading-relaxed">
                 Kamu telah berkontribusi besar dalam menjaga kedamaian di Desa Meat.
               </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
