import { motion } from 'motion/react';
import { CheckCircle, Camera, Award, Calendar, ArrowRight, Heart, Users, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { useState } from 'react';

export default function Challenge() {
  const { profile, claimChallenge } = useAuth();
  const [claiming, setClaiming] = useState<string | null>(null);

  const challenges = [
    {
      id: '1',
      title: 'Ajak Makan Teman Baru',
      desc: 'Cari teman yang sedang duduk sendirian saat istirahat dan ajak dia makan bersama.',
      xp: '+100 XP',
      xpVal: 100,
      reward: 200,
      badge: 'Social Connector',
      icon: Users,
      color: 'bg-baby-blue'
    },
    {
      id: '2',
      title: 'Apresiasi Petugas Sekolah',
      desc: 'Berikan apresiasi kecil (kata-kata atau snack) kepada petugas kebersihan atau satpam sekolah.',
      xp: '+150 XP',
      xpVal: 150,
      reward: 300,
      badge: 'Kindness Hero',
      icon: Heart,
      color: 'bg-soft-pink'
    },
    {
      id: '3',
      title: 'Diskusi Sehat Tanpa Debat',
      desc: 'Selesaikan diskusi di Circle Discussion tanpa menggunakan kata-kata kasar meskipun berbeda pendapat.',
      xp: '+200 XP',
      xpVal: 200,
      reward: 400,
      badge: 'Harmony Master',
      icon: Award,
      color: 'bg-lilac'
    }
  ];

  const handleClaim = async (id: string, reward: number, exp: number) => {
    if (!profile || claiming) return;
    setClaiming(id);
    try {
      await claimChallenge(id, reward, exp);
    } finally {
      setClaiming(null);
    }
  };

  return (
    <div className="space-y-10 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sage mb-1">
            <CheckCircle size={20} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Aksi Nyata</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Harmoni Challenge</h1>
          <p className="text-slate-500">Tantangan mingguan untuk membangun harmoni di dunia nyata.</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-50 flex items-center gap-4">
           <div className="text-center">
              <p className="text-xl font-bold text-slate-700">12</p>
              <p className="text-[10px] font-bold uppercase text-slate-400">Day Streak</p>
           </div>
           <div className="w-px h-8 bg-slate-100" />
           <Calendar size={24} className="text-soft-pink" />
        </div>
      </header>

      {/* Hero Challenge */}
      <section className="bg-pastel-gradient p-8 md:p-12 rounded-[3rem] text-white overflow-hidden relative shadow-2xl">
         <div className="relative z-10 max-w-xl space-y-6">
            <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest">Tantangan Utama Minggu Ini</span>
            <h2 className="text-4xl font-bold font-display">Seminggu Tanpa Body Shaming!</h2>
            <p className="text-white/80 leading-relaxed text-lg">
               Saling menghargai bentuk fisik dan penampilan teman adalah langkah awal harmoni di lingkungan sekolah. 
               Dapatkan Badge Eksklusif "Mirror of Kindness".
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
               <button className="px-8 py-4 bg-white text-soft-pink font-bold rounded-2xl flex items-center gap-2 hover:scale-105 transition-transform">
                  Ikuti Tantangan <ArrowRight size={20} />
               </button>
               <button className="px-8 py-4 bg-white/20 backdrop-blur-md text-white font-bold rounded-2xl flex items-center gap-2">
                  <Camera size={20} /> Upload Bukti
               </button>
            </div>
         </div>
         {/* Decoration */}
         <div className="absolute top-1/2 -right-20 -translate-y-1/2 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
      </section>

      {/* Challenge List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {challenges.map((challenge, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm space-y-6 flex flex-col"
          >
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 ${challenge.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                <challenge.icon size={24} />
              </div>
              <span className="text-xs font-bold text-green-500 bg-green-50 px-3 py-1 rounded-full">{challenge.xp}</span>
            </div>
            
            <div className="space-y-2 flex-1">
              <h3 className="text-lg font-bold text-slate-800 leading-tight">{challenge.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{challenge.desc}</p>
            </div>

            <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-[8px] text-white">★</div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{challenge.badge}</p>
               </div>
               
               {profile?.completedChallenges?.includes(challenge.id) ? (
                 <div className="bg-sage text-white p-2 rounded-full shadow-lg" title="Selesai">
                    <CheckCircle2 size={16} />
                 </div>
               ) : (
                 <button 
                  onClick={() => handleClaim(challenge.id, challenge.reward, challenge.xpVal)}
                  disabled={!!claiming}
                  className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 hover:bg-soft-pink hover:text-white transition-all shadow-sm"
                  title="Claim Challenge"
                >
                  {claiming === challenge.id ? <Loader2 size={16} className="animate-spin" /> : <Camera size={18} />}
                </button>
               )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Guide/Rules */}
      <section className="bg-sage/5 p-8 rounded-[2.5rem] border border-dashed border-sage/30 space-y-4">
         <h4 className="font-bold text-slate-700 flex items-center gap-2">
            <Award size={18} className="text-sage" /> Cara Melakukan Claim?
         </h4>
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
                { step: '01', text: 'Pilih tantangan yang ingin kamu lakukan.' },
                { step: '02', text: 'Lakukan aksi nyata sesuai deskripsi.' },
                { step: '03', text: 'Ambil foto/video sebagai bukti aksi.' },
                { step: '04', text: 'Upload dan tunggu verifikasi Admin.' },
            ].map((s, i) => (
                <div key={i} className="space-y-2">
                    <p className="text-xs font-bold text-sage">{s.step}</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed">{s.text}</p>
                </div>
            ))}
         </div>
      </section>
    </div>
  );
}
