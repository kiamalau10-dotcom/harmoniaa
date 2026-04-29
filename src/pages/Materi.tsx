import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Search, Filter, Play, ArrowRight, X, Layers, Lightbulb, ChevronRight, ChevronLeft, Sparkles, CheckCircle2, Mic, Volume2, Video, FileText, Layout, Headphones } from 'lucide-react';
import { MATERI_LIST } from '../constants';
import { Materi as MateriType, Slide } from '../types';

export default function Materi() {
  const [selectedMateri, setSelectedMateri] = useState<MateriType | null>(null);
  const [filter, setFilter] = useState('Semua');
  const [activeSlide, setActiveSlide] = useState(0);
  const [audioMode, setAudioMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const categories = ['Semua', 'Dasar', 'Lanjut', 'Tantangan'];

  const handleOpenMateri = (materi: MateriType) => {
    setSelectedMateri(materi);
    setActiveSlide(0);
    setAudioMode(false);
    setIsPlaying(false);
  };

  const handleNextSlide = () => {
    if (selectedMateri?.slides && activeSlide < selectedMateri.slides.length - 1) {
      setActiveSlide(prev => prev + 1);
    }
  };

  const handlePrevSlide = () => {
    if (activeSlide > 0) {
      setActiveSlide(prev => prev - 1);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-text-primary underline decoration-soft-pink decoration-8 underline-offset-4 tracking-tight">Mini Learning Hub</h1>
          <p className="text-slate-500 font-medium mt-2">Materi 3-5 menit untuk kamu yang super sibuk!</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-100 divide-x divide-slate-50">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-xl text-sm font-black transition-all uppercase tracking-widest ${
                filter === cat ? 'bg-baby-blue text-[#2B6CB0] shadow-md border-2 border-white' : 'text-slate-400 hover:text-baby-blue'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Grid Materi Bite-sized */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MATERI_LIST.filter(m => filter === 'Semua' || m.category === filter).map((materi, i) => (
          <motion.div
            key={materi.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5 }}
            onClick={() => handleOpenMateri(materi)}
            className="group cursor-pointer bg-white rounded-4xl border-4 border-sidebar-border card-shadow overflow-hidden flex flex-col h-full relative"
          >
            <div className={`h-40 relative group-hover:scale-105 transition-transform duration-500 flex items-center justify-center bg-slate-50 border-b-4 border-sidebar-border`}>
              {materi.type === 'video' && <Video className="text-soft-pink" size={48} />}
              {materi.type === 'slide' && <Layout className="text-baby-blue" size={48} />}
              {materi.type === 'artikel' && <FileText className="text-lilac" size={48} />}
              
              <div className="absolute top-4 left-4 flex gap-2">
                 <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-slate-500 shadow-sm">
                   {materi.duration || '5m'}
                 </span>
              </div>
            </div>
            <div className="p-8 space-y-4 flex-1 flex flex-col">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{materi.category}</p>
                <h3 className="text-xl font-display font-black text-text-primary leading-tight line-clamp-2">{materi.title}</h3>
              </div>
              <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed flex-grow">
                {materi.content}
              </p>
              <div className="pt-4 border-t-2 border-dashed border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="w-6 h-6 rounded-full bg-cream border border-slate-100 flex items-center justify-center">
                      <Headphones size={12} className="text-[#553C9A]" />
                   </div>
                   <span className="text-[10px] font-black text-[#553C9A] uppercase tracking-widest">Audio Available</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 border-2 border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-baby-blue group-hover:text-white transition-all">
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Module Viewer Modal */}
      <AnimatePresence>
        {selectedMateri && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-cream flex flex-col"
          >
            {/* Header Viewer */}
            <header className="px-8 py-4 bg-white border-b-4 border-sidebar-border flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <button onClick={() => setSelectedMateri(null)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                     <X size={24} className="text-slate-400" />
                  </button>
                  <div>
                    <h2 className="font-display font-black text-text-primary text-xl leading-tight">{selectedMateri.title}</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedMateri.category} • {selectedMateri.type}</p>
                  </div>
               </div>
               <div className="flex gap-2">
                  <button 
                    onClick={() => setAudioMode(!audioMode)}
                    className={`px-4 py-2 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all ${
                      audioMode ? 'bg-[#553C9A] text-white border-[#553C9A]' : 'bg-white text-slate-400 border-slate-100'
                    }`}
                  >
                     <Volume2 size={16} /> {audioMode ? 'Audio ON' : 'Audio Mode'}
                  </button>
               </div>
            </header>

            <main className="flex-1 overflow-y-auto px-6 py-10 hide-scrollbar relative">
               <div className="max-w-3xl mx-auto space-y-8">
                  {audioMode && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="bg-[#553C9A] p-6 rounded-4xl border-4 border-white shadow-xl flex items-center gap-6"
                    >
                       <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                          <Mic size={32} className="text-white" />
                       </div>
                       <div className="flex-1">
                          <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-1">Mendengarkan Narrasi AI</p>
                          <div className="flex items-end gap-1 h-8">
                             {[...Array(20)].map((_, i) => (
                               <motion.div 
                                 key={i} 
                                 animate={{ height: isPlaying ? [10, 30, 15, 25, 10] : 10 }}
                                 transition={{ delay: i * 0.05, repeat: Infinity }}
                                 className="w-1 bg-white/80 rounded-full" 
                               />
                             ))}
                          </div>
                       </div>
                       <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#553C9A] shadow-lg hover:scale-110"
                       >
                          {isPlaying ? <X size={20} /> : <Play size={20} fill="currentColor" />}
                       </button>
                    </motion.div>
                  )}

                  {selectedMateri.type === 'slide' && selectedMateri.slides && (
                    <div className="space-y-8">
                       <AnimatePresence mode="wait">
                          <motion.div
                            key={activeSlide}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white p-10 rounded-[3rem] border-4 border-baby-blue card-shadow space-y-6 relative overflow-hidden"
                          >
                             <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Layers size={150} />
                             </div>
                             {selectedMateri.slides[activeSlide].imageUrl && (
                               <img src={selectedMateri.slides[activeSlide].imageUrl} className="w-full h-64 object-cover rounded-3xl mb-8 border-4 border-cream shadow-inner" />
                             )}
                             <h3 className="text-3xl font-display font-black text-text-primary leading-tight">{selectedMateri.slides[activeSlide].title}</h3>
                             <p className="text-lg text-slate-600 font-medium leading-relaxed italic border-l-8 border-baby-blue pl-6 py-2">
                                "{selectedMateri.slides[activeSlide].content}"
                             </p>
                             <div className="pt-8 border-t-2 border-dashed border-slate-100 flex items-center justify-between">
                                <div className="flex gap-1">
                                   {selectedMateri.slides.map((_, i) => (
                                     <div key={i} className={`h-2 rounded-full transition-all ${i === activeSlide ? 'bg-baby-blue w-8' : 'bg-slate-100 w-2'}`} />
                                   ))}
                                </div>
                                <div className="flex gap-2">
                                   <button onClick={handlePrevSlide} disabled={activeSlide === 0} className="p-3 bg-slate-50 rounded-2xl disabled:opacity-30"><ChevronLeft /></button>
                                   <button onClick={handleNextSlide} disabled={activeSlide === selectedMateri.slides.length - 1} className="p-3 bg-baby-blue text-[#2B6CB0] rounded-2xl disabled:opacity-30"><ChevronRight /></button>
                                </div>
                             </div>
                          </motion.div>
                       </AnimatePresence>
                    </div>
                  )}

                  {selectedMateri.type === 'video' && (
                    <div className="space-y-8">
                       <div className="aspect-video bg-black rounded-[3rem] border-8 border-sidebar-border card-shadow overflow-hidden shadow-2xl relative group">
                          <iframe 
                            src={selectedMateri.videoUrl} 
                            className="w-full h-full" 
                            title={selectedMateri.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                          />
                       </div>
                       <div className="bg-white p-8 rounded-4xl border-4 border-sidebar-border card-shadow">
                          <h4 className="font-display font-black text-text-primary text-xl mb-4">Ringkasan Video</h4>
                          <p className="text-slate-500 font-medium leading-relaxed">{selectedMateri.content}</p>
                       </div>
                    </div>
                  )}

                  {selectedMateri.type === 'artikel' && (
                    <article className="prose prose-slate max-w-none text-center py-8">
                       <h1 className="text-4xl md:text-5xl font-display font-black text-text-primary mb-8 leading-tight">{selectedMateri.title}</h1>
                       <div className="bg-white p-12 rounded-[4rem] border-4 border-lilac card-shadow text-left">
                          <p className="text-xl text-slate-600 font-medium leading-loose whitespace-pre-wrap">
                             {selectedMateri.content}
                          </p>
                          <div className="mt-12 p-8 bg-lilac/10 rounded-3xl border-2 border-lilac/20 flex items-start gap-4">
                             <Lightbulb className="text-lilac shrink-0" size={32} />
                             <div>
                                <h4 className="font-black text-lilac uppercase text-xs tracking-widest mb-2">Poin Penting</h4>
                                <ul className="space-y-2 text-sm font-bold text-slate-600">
                                   <li>• Harmoni bukan sekadar ketiadaan konflik.</li>
                                   <li>• Toleransi adalah fondasi utama integrasi.</li>
                                   <li>• Kerja sama fungsional memperkuat persatuan.</li>
                                </ul>
                             </div>
                          </div>
                       </div>
                    </article>
                  )}
               </div>
            </main>

            <footer className="px-8 py-6 bg-white border-t-4 border-sidebar-border flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-tint rounded-full border-4 border-white shadow-sm flex items-center justify-center text-2xl">💡</div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Selesaikan modul ini untuk +30 XP</p>
               </div>
               <button 
                onClick={() => setSelectedMateri(null)}
                className="px-10 py-5 bg-[#553C9A] text-white font-black rounded-3xl text-sm uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
               >
                  Tandai Selesai & Lanjut
               </button>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
