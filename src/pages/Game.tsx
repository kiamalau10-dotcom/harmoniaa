import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad2, RotateCcw, Heart, Star, Sparkles, MessageSquare } from 'lucide-react';
import { STORY_NODES } from '../constants';

export default function Game() {
  const [currentNodeId, setCurrentNodeId] = useState('start');
  const [history, setHistory] = useState<string[]>([]);
  
  const currentNode = STORY_NODES[currentNodeId];

  const handleChoice = (nextNodeId: string) => {
    setHistory([...history, currentNodeId]);
    setCurrentNodeId(nextNodeId);
  };

  const resetGame = () => {
    setCurrentNodeId('start');
    setHistory([]);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-black text-text-primary underline decoration-baby-blue decoration-8 underline-offset-4 tracking-tight">Social Story Game</h1>
          <p className="text-slate-500 font-medium mt-2">“Pilih Jalan Ceritamu” dan bangun harmoni sosial.</p>
        </div>
        <div className="flex items-center gap-2 px-6 py-3 bg-white rounded-3xl shadow-sm border-4 border-sidebar-border">
          <Gamepad2 size={24} className="text-[#2B6CB0]" />
          <span className="text-sm font-black text-[#2B6CB0] uppercase tracking-widest">Story Mode</span>
        </div>
      </header>

      <section className="relative aspect-video md:aspect-[21/9] bg-slate-900 rounded-4xl overflow-hidden group shadow-2xl border-4 border-white">
        {/* Background Visual Placeholder */}
        <div className="absolute inset-0 bg-pastel-gradient opacity-40 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
           <div className="text-white text-center space-y-4">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto border border-white/30 animate-bounce">
                <Users className="w-12 h-12 text-white" />
              </div>
              <p className="text-sm font-medium tracking-widest uppercase">Visual Scene</p>
           </div>
        </div>

        {/* Narrative Box */}
        <div className="absolute inset-x-8 bottom-8 z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentNodeId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-8 rounded-4xl border-4 border-soft-pink card-shadow space-y-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                   <MessageSquare size={16} className="text-soft-pink" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-[#9B2C2C]">EPISODE 1: KASUS BULLYING 🏫</span>
                </div>
                <span className="bg-soft-pink text-[#9B2C2C] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">CHAPTER 1</span>
              </div>
              <p className="text-lg md:text-xl text-text-primary leading-relaxed font-display font-black">
                “{currentNode.text}”
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentNode.choices.map((choice, i) => (
                  <button
                    key={i}
                    onClick={() => handleChoice(choice.nextNodeId)}
                    className="p-5 rounded-2xl border-4 border-slate-50 text-left bg-cream transition-all group flex items-center justify-between hover:border-lilac hover:bg-lilac/30"
                  >
                    <span className="text-sm font-black text-slate-700">{choice.text}</span>
                    <Sparkles size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#553C9A]" />
                  </button>
                ))}
              </div>

              {currentNode.choices.length === 1 && currentNode.choices[0].endingType && (
                <div className="pt-4 border-t-2 border-dashed border-slate-200 flex items-center justify-between">
                   <div className={`px-4 py-2 rounded-full text-white text-[10px] font-black uppercase tracking-widest border-2 border-white shadow-sm
                     ${currentNode.choices[0].endingType === 'Good' ? 'bg-green-400' : ''}
                     ${currentNode.choices[0].endingType === 'Bad' ? 'bg-red-400' : ''}
                     ${currentNode.choices[0].endingType === 'Sad' ? 'bg-orange-400' : ''}
                     ${currentNode.choices[0].endingType === 'Plot Twist' ? 'bg-[#553C9A]' : ''}
                   `}>
                     🏆 {currentNode.choices[0].endingType} Ending Unlocked
                   </div>
                   <button 
                     onClick={resetGame}
                     className="flex items-center gap-2 text-slate-400 hover:text-[#2B6CB0] transition-colors text-xs font-black uppercase tracking-widest"
                   >
                     <RotateCcw size={16} /> Main Lagi
                   </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Game Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-soft-pink">
                <Heart size={18} fill="currentColor" />
                <span className="text-sm font-bold uppercase tracking-widest">Karma Points</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-soft-pink w-3/4" />
            </div>
            <p className="text-[10px] text-slate-400">Kamu dikenal sebagai siswa yang peduli.</p>
        </div>
        <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-baby-blue">
                <Star size={18} fill="currentColor" />
                <span className="text-sm font-bold uppercase tracking-widest">Ending Koleksi</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">1 / 5</p>
            <p className="text-[10px] text-slate-400">Ayo temukan plot twist ending!</p>
        </div>
        <div className="p-6 bg-cream rounded-3xl border border-beige space-y-2">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-widest">Misi Aktif</h4>
            <ul className="space-y-2">
                <li className="text-[10px] text-slate-500 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-soft-pink" /> 
                    Temukan Secret Ending (Underground)
                </li>
            </ul>
        </div>
      </div>
    </div>
  );
}

const Users = ({ className }: { className: string }) => <div className={className}><Heart /></div>;
