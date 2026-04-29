import { motion } from 'motion/react';
import { Play, Flame, Clock, Heart, Share2, Search } from 'lucide-react';

export default function VideoZone() {
  const videos = [
    { title: 'Harmoni di Sekolah: Tips Sederhana', duration: '03:45', views: '2.4K', color: 'bg-baby-blue/20' },
    { title: 'Kenali Konflik Sosial Sejak Dini', duration: '05:12', views: '1.8K', color: 'bg-soft-pink/20' },
    { title: 'Animasi: Kisah Harmo & Soci', duration: '02:30', views: '4.5K', color: 'bg-lilac/20' },
    { title: 'Podcast: Menghadapi Toxic Friendship', duration: '12:00', views: '950', color: 'bg-sage/20' },
  ];

  return (
    <div className="space-y-10 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-2 text-baby-blue mb-1">
             <Play size={20} fill="currentColor" />
             <span className="text-[10px] font-bold uppercase tracking-widest">YouTube Corner</span>
           </div>
           <h1 className="text-3xl font-bold text-slate-800">Video Zone</h1>
           <p className="text-slate-500">Penjelasan sosiologi melalui animasi dan video menarik.</p>
        </div>
        <div className="relative flex-1 max-w-sm">
           <input 
             type="text" 
             placeholder="Cari video..." 
             className="w-full pl-12 pr-6 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm focus:ring-2 focus:ring-baby-blue/20 transition-all outline-none text-sm"
           />
           <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
        </div>
      </header>

      {/* Featured Video */}
      <section className="bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl group flex flex-col md:flex-row min-h-[400px]">
         <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-pastel-gradient group-hover:scale-105 transition-transform duration-700">
            <div className="absolute inset-0 bg-slate-900/20" />
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl relative z-10 cursor-pointer hover:scale-110 active:scale-95 transition-all">
               <Play size={32} fill="currentColor" className="text-soft-pink ml-1" />
            </div>
            <div className="absolute bottom-6 left-6 text-white text-xs font-bold uppercase tracking-widest bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg">
               04:20
            </div>
         </div>
         <div className="md:w-1/3 p-8 md:p-12 flex flex-col justify-center space-y-6 bg-slate-950">
            <div className="flex items-center gap-4">
               <span className="px-3 py-1 bg-soft-pink text-white text-[10px] font-bold uppercase tracking-widest rounded-full">New</span>
               <div className="flex items-center gap-1 text-slate-500 text-[10px]"><Flame size={10} className="text-orange-400" /> Trending</div>
            </div>
            <h2 className="text-2xl font-bold text-white leading-tight">
               Integrasi Sosial di Tengah Keberagaman Gen-Z
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
               Bagaimana Gen-Z memaknai perbedaan sebagai kekuatan harmoni? Tonton selengkapnya di sini.
            </p>
            <div className="flex items-center gap-6 pt-4">
               <button className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors">
                  <Heart size={18} />
                  <span className="text-xs font-bold">1.2K</span>
               </button>
               <button className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors">
                  <Share2 size={18} />
                  <span className="text-xs font-bold">Bagikan</span>
               </button>
            </div>
         </div>
      </section>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {videos.map((vid, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="flex flex-col gap-4 cursor-pointer group"
          >
            <div className={`aspect-video ${vid.color} rounded-2xl relative overflow-hidden`}>
               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                     <Play size={20} fill="currentColor" className="text-slate-800 ml-1" />
                  </div>
               </div>
               <div className="absolute bottom-2 right-2 text-[10px] font-bold text-white bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                  {vid.duration}
               </div>
            </div>
            <div className="space-y-1">
               <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-baby-blue transition-colors">
                 {vid.title}
               </h3>
               <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1"><Clock size={10} /> {vid.views} views</span>
                  <span>•</span>
                  <span>1 pekan lalu</span>
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
