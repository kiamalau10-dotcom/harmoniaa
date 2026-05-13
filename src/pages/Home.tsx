import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, Play, Star, Users, Heart, BookOpen, Trophy, 
  LayoutDashboard, Gamepad2, Info, Lock, Activity, Image as ImageIcon,
  MessageCircle, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { SociIcon, HarmoIcon } from '../components/Mascots';
import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SharedWork } from '../types';

export default function Home() {
  const { profile } = useAuth();
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [recentWorks, setRecentWorks] = useState<SharedWork[]>([]);

  useEffect(() => {
    // Recent Activities
    const qAct = query(collection(db, 'activities'), orderBy('timestamp', 'desc'), limit(5));
    const unsubAct = onSnapshot(qAct, (snap) => {
      setRecentActivities(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Recent Works
    const qWork = query(collection(db, 'sharedWorks'), orderBy('timestamp', 'desc'), limit(3));
    const unsubWork = onSnapshot(qWork, (snap) => {
      setRecentWorks(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as SharedWork)));
    });

    return () => {
      unsubAct();
      unsubWork();
    };
  }, []);
  
  const features = [
    { icon: LayoutDashboard, title: 'Dashboard', desc: 'Pantau progress belajar dan badge pencapaianmu.', color: 'bg-baby-blue', border: 'border-baby-blue', to: '/dashboard', private: true },
    { icon: BookOpen, title: 'Materi', desc: 'Belajar lewat infografis, animasi, dan slide mini.', color: 'bg-soft-pink', border: 'border-soft-pink', to: '/materi', private: false },
    { icon: Gamepad2, title: 'Story Game', desc: 'Tentukan pilihanmu dan lihat ending ceritanya.', color: 'bg-lilac', border: 'border-lilac', to: '/game', private: true },
    { icon: Heart, title: 'Challenge', desc: 'Tantangan mingguan untuk aksi sosial nyata.', color: 'bg-sage', border: 'border-sage', to: '/challenge', private: true },
    { icon: Trophy, title: 'Leaderboard', desc: 'Uji kemampuanmu dan kumpulkan skor tertinggi.', color: 'bg-yellow-tint', border: 'border-sidebar-border', to: '/quiz', private: true },
    { icon: Info, title: 'About Us', desc: 'Kenali visi, misi, dan anggota kelompok kami.', color: 'bg-baby-blue', border: 'border-baby-blue', to: '/about', private: false },
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section - Hidden because it's now in Layout Header */}
      
      {/* Slogan & Intro */}
      <section className="bg-white rounded-5xl p-8 md:p-12 border-4 border-baby-blue card-shadow relative overflow-hidden group">
        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-baby-blue rounded-4xl flex items-center justify-center text-4xl md:text-5xl border-4 border-white shadow-xl flex-shrink-0 transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
            🕊️
          </div>
          <div className="space-y-6 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl text-text-primary font-display font-black leading-tight italic">
              "Belajar Sosiologi Jadi Lebih Hidup."
            </h2>
            <div className="p-1 px-4 bg-soft-pink/10 rounded-full inline-block border border-soft-pink/20">
               <p className="text-[10px] font-black text-soft-pink uppercase tracking-[0.2em]">Platform Edukasi Pelajar</p>
            </div>
            <p className="text-slate-600 font-medium text-lg leading-relaxed max-w-3xl">
              <span className="font-black text-[#553C9A]">Harmoni Sosial</span> adalah platform edukasi interaktif yang dirancang khusus untuk pelajar. Kami percaya bahwa memahami sosiologi bukan sekadar menghafal teori, melainkan cara kita mempraktikkan empati, menghargai keberagaman, dan menciptakan aksi sosial yang bermakna di kehidupan sehari-hari.
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-lilac/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-baby-blue/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
      </section>

      {/* Feature Grids */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feat, i) => (
          <Link key={i} to={feat.to} className="block group">
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-8 bg-white h-full rounded-4xl card-shadow border-4 ${feat.border} space-y-4 transition-all group-hover:shadow-2xl group-hover:bg-slate-50/50 relative overflow-hidden`}
            >
              {feat.private && !profile && (
                <div className="absolute top-4 right-4 bg-slate-100 p-1.5 rounded-lg text-slate-400">
                  <Lock size={14} />
                </div>
              )}
              <div className={`w-12 h-12 ${feat.color} rounded-2xl flex items-center justify-center text-text-primary shadow-sm border-2 border-white`}>
                <feat.icon size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                  {feat.title}
                  <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{feat.desc}</p>
                {feat.private && !profile && (
                  <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mt-2 flex items-center gap-1">
                    Login Required
                  </p>
                )}
              </div>
            </motion.div>
          </Link>
        ))}
      </section>

      {/* Mascot Corner */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Mascot & Call to Action */}
        <div className="lg:col-span-2 bg-lilac/10 rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 border border-lilac/20">
          <div className="flex -space-x-4">
            <div className="w-24 h-24 bg-baby-blue rounded-full border-4 border-white flex items-center justify-center shadow-lg overflow-hidden p-2">
              <SociIcon />
            </div>
            <div className="w-24 h-24 bg-soft-pink rounded-full border-4 border-white flex items-center justify-center shadow-lg overflow-hidden p-2">
              <HarmoIcon />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left space-y-2">
            <h3 className="text-2xl font-bold text-slate-800">Kenalin Teman Belajarmu!</h3>
            <p className="text-slate-500 font-medium">Soci & Harmo akan menemanimu menjelajahi tantangan sosiologi di setiap level.</p>
          </div>
          <Link to="/about" className="px-6 py-3 bg-white text-[#553C9A] font-black rounded-2xl shadow-sm hover:shadow-md transition-all border-2 border-slate-100 uppercase tracking-widest text-xs">
            Kenalan Yuk!
          </Link>
        </div>

        {/* Right: Real-time Activity Feed */}
        <div className="bg-white rounded-[2.5rem] p-8 border-4 border-slate-50 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-slate-800 flex items-center gap-2">
              <Activity size={18} className="text-soft-pink" />
              Aktivitas Terbaru
            </h3>
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          </div>
          <div className="space-y-4 flex-1">
            <AnimatePresence mode="popLayout">
              {recentActivities.map((act) => (
                <motion.div 
                  key={act.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex gap-3 items-start"
                >
                  <div className={`mt-1 p-1.5 rounded-lg shrink-0 ${
                    act.type === 'login' ? 'bg-blue-50 text-blue-500' :
                    act.type === 'action' ? 'bg-amber-50 text-amber-500' :
                    'bg-slate-50 text-slate-400'
                  }`}>
                    {act.type === 'login' ? <Zap size={10} /> : 
                     act.type === 'action' ? <Star size={10} /> : <Activity size={10} />}
                  </div>
                  <div className="space-y-0.5 overflow-hidden">
                    <p className="text-xs font-bold text-slate-800 truncate">{act.description}</p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {act.timestamp?.toDate?.().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'Baru saja'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {recentActivities.length === 0 && (
              <p className="text-xs text-slate-300 italic text-center py-4">Belum ada aktivitas baru...</p>
            )}
          </div>
        </div>
      </section>

      {/* Recent Works Gallery Snippet */}
      {recentWorks.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-text-primary flex items-center gap-3">
               <ImageIcon size={28} className="text-baby-blue" />
               Karya Terbaru
            </h3>
            <Link to="/share-yours" className="text-xs font-black text-baby-blue uppercase tracking-widest hover:underline">
              Lihat Semua Galeri
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentWorks.map((work) => (
              <Link key={work.id} to="/share-yours" className="block group">
                <div className="bg-white rounded-[2rem] border-4 border-white shadow-xl overflow-hidden hover:-translate-y-1 transition-all">
                  <div className="h-40 bg-slate-50 relative overflow-hidden flex items-center justify-center">
                    {work.files && work.files[0] ? (
                      work.files[0].type.startsWith('image/') ? (
                        <img src={work.files[0].url} className="w-full h-full object-cover" alt="work" referrerPolicy="no-referrer" />
                      ) : (
                        <Zap size={32} className="text-slate-200" />
                      )
                    ) : (
                      <MessageCircle size={32} className="text-slate-200" />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>
                  <div className="p-6">
                    <h4 className="font-black text-slate-800 truncate group-hover:text-baby-blue transition-colors">{work.title}</h4>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Oleh {work.authorName}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

const PlayCircle = ({ size }: { size: number }) => <Play size={size} />;
