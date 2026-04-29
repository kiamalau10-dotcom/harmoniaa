import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutGrid, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Star, AlertCircle, Sparkles, X, Trophy } from 'lucide-react';

interface MazeCell {
  x: number;
  y: number;
}

export default function MazeGame() {
  const [playerPos, setPlayerPos] = useState<MazeCell>({ x: 0, y: 0 });
  const [goal, setGoal] = useState<MazeCell>({ x: 4, y: 4 });
  const [showQuestion, setShowQuestion] = useState(false);
  const [pendingMove, setPendingMove] = useState<MazeCell | null>(null);
  const [gameWon, setGameWon] = useState(false);

  const mazeGrid = Array.from({ length: 5 }, (_, y) => 
    Array.from({ length: 5 }, (_, x) => ({ x, y }))
  );

  const movePlayer = (dx: number, dy: number) => {
    const nextX = Math.max(0, Math.min(4, playerPos.x + dx));
    const nextY = Math.max(0, Math.min(4, playerPos.y + dy));
    
    if (nextX === playerPos.x && nextY === playerPos.y) return;
    
    // Every move triggers a "Challenge" question (simplified for demo)
    setPendingMove({ x: nextX, y: nextY });
    setShowQuestion(true);
  };

  const handleCorrectAnswer = () => {
    if (pendingMove) {
      setPlayerPos(pendingMove);
      if (pendingMove.x === goal.x && pendingMove.y === goal.y) {
        setGameWon(true);
      }
    }
    setShowQuestion(false);
    setPendingMove(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
       <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-black text-text-primary underline decoration-soft-pink decoration-8 underline-offset-4 tracking-tight">Social Maze Labirin</h1>
          <p className="text-slate-500 font-medium mt-2">Selesaikan labirin dengan menjawab pertanyaan sosiologi!</p>
        </div>
        <div className="flex items-center gap-2 px-6 py-3 bg-white rounded-3xl shadow-sm border-4 border-sidebar-border">
          <LayoutGrid size={24} className="text-[#9B2C2C]" />
          <span className="text-sm font-black text-[#9B2C2C] uppercase tracking-widest">Level 1</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
         {/* Maze Area */}
         <div className="aspect-square bg-white p-8 rounded-4xl border-4 border-baby-blue card-shadow flex items-center justify-center relative">
            <div className="grid grid-cols-5 gap-3 w-full h-full">
               {mazeGrid.flat().map((cell) => (
                 <div 
                   key={`${cell.x}-${cell.y}`}
                   className={`rounded-2xl border-4 transition-all duration-300 flex items-center justify-center text-2xl
                     ${cell.x === playerPos.x && cell.y === playerPos.y ? 'bg-soft-pink border-white shadow-lg scale-110' : 'bg-slate-50 border-white'}
                     ${cell.x === goal.x && cell.y === goal.y ? 'bg-yellow-tint border-white' : ''}
                   `}
                 >
                    {cell.x === playerPos.x && cell.y === playerPos.y && '🦁'}
                    {cell.x === goal.x && cell.y === goal.y && '🏁'}
                 </div>
               ))}
            </div>
         </div>

         {/* Controls & Mini Info */}
         <div className="space-y-6">
            <div className="bg-white p-8 rounded-4xl border-4 border-sidebar-border card-shadow text-center">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Gunakan Arah</h3>
               <div className="grid grid-cols-3 gap-3 max-w-[180px] mx-auto">
                  <div />
                  <button onClick={() => movePlayer(0, -1)} className="p-4 bg-cream rounded-2xl border-4 border-white shadow-sm hover:shadow-md active:scale-95 transition-all flex items-center justify-center"><ArrowUp /></button>
                  <div />
                  <button onClick={() => movePlayer(-1, 0)} className="p-4 bg-cream rounded-2xl border-4 border-white shadow-sm hover:shadow-md active:scale-95 transition-all flex items-center justify-center"><ArrowLeft /></button>
                  <button onClick={() => movePlayer(0, 1)} className="p-4 bg-cream rounded-2xl border-4 border-white shadow-sm hover:shadow-md active:scale-95 transition-all flex items-center justify-center"><ArrowDown /></button>
                  <button onClick={() => movePlayer(1, 0)} className="p-4 bg-cream rounded-2xl border-4 border-white shadow-sm hover:shadow-md active:scale-95 transition-all flex items-center justify-center"><ArrowRight /></button>
               </div>
            </div>

            <div className="bg-lilac p-8 rounded-4xl border-4 border-white card-shadow text-white">
               <h4 className="text-sm font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                 <Sparkles size={18} /> Game Rules
               </h4>
               <ul className="text-xs font-medium space-y-2 text-white/80">
                  <li>• Setiap langkah butuh jawaban yang benar.</li>
                  <li>• Capai garis finish untuk dapat 100 XP.</li>
                  <li>• Hati-hati dengan jebakan status sosial!</li>
               </ul>
            </div>
         </div>
      </div>

      {/* Modal - Question or Win */}
      <AnimatePresence>
        {showQuestion && (
           <motion.div 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }} 
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-6"
           >
              <div className="bg-white p-8 rounded-4xl border-4 border-baby-blue max-w-md w-full card-shadow space-y-6">
                 <div className="flex items-center gap-2 text-baby-blue">
                   <AlertCircle size={24} />
                   <h3 className="font-display font-black text-lg tracking-tight uppercase">Maze Challenge</h3>
                 </div>
                 <p className="font-bold text-text-primary text-lg">"Proses pergerakan individu dari satu wilayah ke wilayah lain disebut?"</p>
                 <div className="grid grid-cols-1 gap-3">
                    {['Mobilitas Geografis', 'Diferensiasi Sosial', 'Integrasi Koersif'].map((ans) => (
                      <button 
                        key={ans}
                        onClick={() => ans === 'Mobilitas Geografis' && handleCorrectAnswer()}
                        className="p-4 rounded-2xl bg-slate-50 border-4 border-white text-left font-bold text-slate-700 hover:border-baby-blue transition-all"
                      >
                        {ans}
                      </button>
                    ))}
                 </div>
                 <button 
                   onClick={() => setShowQuestion(false)}
                   className="w-full py-2 text-slate-400 font-bold uppercase tracking-widest text-[10px]"
                 >
                   Batal
                 </button>
              </div>
           </motion.div>
        )}

        {gameWon && (
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }} 
             animate={{ opacity: 1, scale: 1 }} 
             className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-cream/90"
           >
              <div className="text-center space-y-6 max-w-md bg-white p-10 rounded-[3rem] border-8 border-yellow-tint shadow-2xl">
                 <div className="text-8xl mb-4">🏆</div>
                 <h2 className="text-4xl font-display font-black text-text-primary">MAZE SETTLED!</h2>
                 <p className="text-slate-500 font-medium">Kamu berhasil melewati rintangan sosial dan mencapai keharmonisan!</p>
                 <div className="flex bg-yellow-tint/50 p-4 rounded-3xl items-center justify-center gap-4">
                    <Trophy className="text-[#744210]" />
                    <span className="text-2xl font-black text-[#744210]">+100 XP</span>
                 </div>
                 <button 
                   onClick={() => window.location.reload()}
                   className="w-full py-5 bg-[#553C9A] text-white font-black rounded-3xl text-sm uppercase tracking-widest shadow-xl"
                 >
                   Main Lagi
                 </button>
              </div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
