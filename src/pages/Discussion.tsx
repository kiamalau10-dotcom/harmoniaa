import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Heart, Share2, Send, Filter, Users, ShieldAlert, Vote } from 'lucide-react';

export default function Discussion() {
  const [posts] = useState([
    {
      id: '1',
      author: 'Anonim • XI IPS 2',
      content: 'Gimana ya cara ngajak temen yang pendiam buat gabung kelompok tanpa bikin dia ngerasa tertekan?',
      votes: 24,
      replies: 12,
      category: 'Tips Sosial',
      timestamp: '2 jam yang lalu'
    },
    {
      id: '2',
      author: 'Sobat Harmoni',
      content: 'Kemarin aku lihat ada bullying di kantin, terus aku lapor ke guru. Awalnya takut dibilang tukang ngadu, tapi ternyata itu langkah terbaik buat harmoni kelas.',
      votes: 56,
      replies: 8,
      category: 'Cerita Sosial',
      timestamp: '5 jam yang lalu'
    }
  ]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Circle Discussion</h1>
          <p className="text-slate-500">Berbagi pengalaman dan cari solusi sosial bersama.</p>
        </div>
        <button className="px-6 py-3 bg-soft-pink text-white font-bold rounded-2xl shadow-lg shadow-soft-pink/20 hover:scale-105 transition-transform">
          Buat Postingan Baru
        </button>
      </header>

      {/* Voting Section / Poll */}
      <section className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-lilac">
            <Vote size={20} />
            <h3 className="font-bold uppercase tracking-widest text-xs">VOTING MINGGU INI</h3>
        </div>
        <div className="space-y-4">
            <p className="text-lg font-medium text-slate-700">Kalau kamu melihat diskriminasi di kelas, apa yang akan kamu lakukan?</p>
            <div className="space-y-3">
                {[
                    { label: 'Menegur langsung secara baik-baik', percent: 45 },
                    { label: 'Melaporkan ke guru atau wali kelas', percent: 30 },
                    { label: 'Mengajak teman lain untuk membela korban', percent: 20 },
                    { label: 'Diam dan mengamati situasi dulu', percent: 5 },
                ].map((opt, i) => (
                    <div key={i} className="relative group cursor-pointer">
                        <div className="absolute inset-0 bg-cream/50 rounded-xl" />
                        <div className="absolute inset-y-0 left-0 bg-lilac/20 rounded-xl transition-all duration-1000" style={{ width: `${opt.percent}%` }} />
                        <div className="relative p-4 flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700">{opt.label}</span>
                            <span className="text-xs font-bold text-lilac">{opt.percent}%</span>
                        </div>
                    </div>
                ))}
            </div>
            <p className="text-[10px] text-slate-400 text-center italic">1,240 Siswa telah memberikan suara.</p>
        </div>
      </section>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
        {['Semua Circle', 'Tips Sosial', 'Cerita Anonim', 'Diskusi Kasus', 'Sharing Pengalaman'].map((cat, i) => (
          <button 
            key={i} 
            className={`whitespace-nowrap px-6 py-2 rounded-full text-xs font-bold border transition-all ${
              i === 0 ? 'bg-baby-blue border-baby-blue text-white' : 'bg-white border-slate-100 text-slate-400 hover:border-baby-blue hover:text-baby-blue'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <motion.article 
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                  <Users size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-700">{post.author}</h4>
                  <p className="text-[10px] text-slate-400">{post.timestamp} • <span className="text-soft-pink font-bold">{post.category}</span></p>
                </div>
              </div>
              <button className="p-2 text-slate-300 hover:text-red-400 transition-colors">
                <ShieldAlert size={18} />
              </button>
            </div>
            
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              {post.content}
            </p>

            <div className="pt-4 border-t border-slate-50 flex items-center gap-6">
              <button className="flex items-center gap-2 text-slate-400 hover:text-soft-pink transition-colors">
                <Heart size={18} />
                <span className="text-xs font-bold">{post.votes}</span>
              </button>
              <button className="flex items-center gap-2 text-slate-400 hover:text-baby-blue transition-colors">
                <MessageCircle size={18} />
                <span className="text-xs font-bold">{post.replies}</span>
              </button>
              <button className="flex items-center gap-2 text-slate-400 hover:text-lilac transition-colors ml-auto">
                <Share2 size={18} />
              </button>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Comment Input Simulation */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-40">
        <div className="bg-white/80 backdrop-blur-xl p-3 rounded-full shadow-2xl border border-white/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-lilac flex items-center justify-center text-white text-xs font-bold">JD</div>
          <input 
            type="text" 
            placeholder="Bagikan ceritamu secara anonim..." 
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm placeholder:text-slate-400"
          />
          <button className="p-3 bg-baby-blue text-white rounded-full shadow-md hover:scale-105 transition-transform">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
