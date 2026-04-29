import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, MessageCircle, Star, Video, Mic, Share2, Search, Plus, Send, X, Shield, Sparkles, Loader2 } from 'lucide-react';
import { DISCUSSION_ROOMS, ONLINE_USERS } from '../constants';
import { DiscussionRoom, UserPresence, AIQuestion } from '../types';
import { generateDynamicQuestion } from '../services/geminiService';

export default function StudyRoom() {
  const [selectedRoom, setSelectedRoom] = useState<DiscussionRoom | null>(null);
  const [messages, setMessages] = useState<{ id: string; user: string; text: string; time: string }[]>([]);
  const [inputText, setInputText] = useState('');
  
  const [aiQuestion, setAiQuestion] = useState<AIQuestion | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchAIQuestion = async () => {
    setIsGenerating(true);
    const topic = selectedRoom?.category || "Harmoni Sosial";
    const question = await generateDynamicQuestion(topic);
    setAiQuestion(question);
    setIsGenerating(false);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMessage = {
      id: Date.now().toString(),
      user: 'Jane Doe',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
    setInputText('');
    
    // Simulate response
    setTimeout(() => {
      const response = {
         id: (Date.now() + 1).toString(),
         user: 'Budi Santoso',
         text: 'Setuju banget! Di materi bab 2 juga dijelasin soal asimilasi yang mirip kayak gitu.',
         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, response]);
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-text-primary underline decoration-sage decoration-8 underline-offset-4 tracking-tight">Social Study Room</h1>
          <p className="text-slate-500 font-medium mt-2">Belajar lebih asyik bareng sobat harmoni lainnya.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-3xl border-4 border-sidebar-border shadow-sm">
           <div className="flex -space-x-2">
             {ONLINE_USERS.slice(0, 3).map(u => (
               <img key={u.id} src={u.avatar} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100" />
             ))}
           </div>
           <span className="text-xs font-black text-text-primary uppercase tracking-widest pl-2">{ONLINE_USERS.length}+ Online</span>
        </div>
      </header>

      {/* Online Now Presence Bar */}
      <section className="bg-white p-6 rounded-4xl border-4 border-baby-blue card-shadow overflow-x-auto hide-scrollbar flex gap-6">
        {ONLINE_USERS.map((user) => (
          <div key={user.id} className="flex flex-col items-center gap-2 min-w-[80px]">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-slate-100 border-4 border-white shadow-sm overflow-hidden p-1" style={{ backgroundColor: user.color + '44' }}>
                 <img src={user.avatar} className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
            </div>
            <span className="text-[10px] font-black text-text-primary uppercase tracking-tight text-center">{user.name.split(' ')[0]}</span>
          </div>
        ))}
        <button className="flex flex-col items-center gap-2 min-w-[80px] p-0 group">
           <div className="w-16 h-16 rounded-full border-4 border-dashed border-slate-200 flex items-center justify-center text-slate-300 group-hover:border-baby-blue group-hover:text-baby-blue transition-all">
             <Plus size={24} />
           </div>
           <span className="text-[10px] font-black text-slate-300 uppercase tracking-tight">Cari Teman</span>
        </button>
      </section>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {DISCUSSION_ROOMS.map((room) => (
          <motion.div
            key={room.id}
            whileHover={{ y: -5 }}
            onClick={() => setSelectedRoom(room)}
            className="group cursor-pointer bg-white p-6 rounded-4xl border-4 border-sidebar-border card-shadow flex flex-col gap-4 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform">
               <MessageCircle size={48} />
            </div>
            <div className="flex justify-between items-start">
               <span className="px-3 py-1 bg-baby-blue/20 rounded-full text-[10px] font-black text-[#2B6CB0] uppercase tracking-widest">{room.category}</span>
               <div className="flex items-center gap-1 text-[10px] font-bold text-green-500">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  {room.activeNow} Aktif
               </div>
            </div>
            <div>
              <h3 className="font-display font-black text-text-primary text-lg leading-tight">{room.name}</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">{room.description}</p>
            </div>
            <div className="mt-auto pt-4 border-t-2 border-dashed border-slate-100 flex items-center justify-between">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{room.memberCount} Members</span>
               <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-baby-blue group-hover:text-[#2B6CB0] transition-all">
                 <Shield size={16} />
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Live Collaboration Area Simulation */}
      <section className="bg-white rounded-4xl border-4 border-soft-pink card-shadow overflow-hidden h-[500px] flex flex-col md:flex-row">
         {/* Live Preview Side (Simulated Whiteboard/Content) */}
         <div className="flex-1 bg-cream/50 relative p-8 flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
               <h3 className="font-display font-black text-text-primary flex items-center gap-2 tracking-tight">
                  <Video size={20} className="text-soft-pink" /> Live Study Room: {selectedRoom?.name || 'Pilih Room'}
               </h3>
               <div className="flex gap-2">
                  <button className="p-2 bg-white rounded-xl shadow-sm border border-slate-100"><Mic size={18} className="text-slate-400" /></button>
                  <button className="p-2 bg-white rounded-xl shadow-sm border border-slate-100"><Share2 size={18} className="text-slate-400" /></button>
               </div>
            </div>
            
            <div className="flex-1 bg-white rounded-3xl border-4 border-white shadow-inner p-6 overflow-hidden relative group">
               <div className="absolute inset-0 bg-slate-50 opacity-50 pattern-grid" />
               <div className="relative z-10 space-y-4">
                  <div className="bg-baby-blue/10 p-4 rounded-2xl border-2 border-baby-blue/20">
                     <h4 className="text-xs font-black text-[#2B6CB0] uppercase mb-1">Materi Sedang Dibahas</h4>
                     <p className="text-sm font-bold text-text-primary">Bab 2: Solidaritas Sosial Emile Durkheim</p>
                  </div>
                  <div className="aspect-video bg-slate-900 rounded-2xl flex items-center justify-center text-white/20">
                     <Users size={64} />
                  </div>
               </div>
               <button className="absolute bottom-4 right-4 bg-[#553C9A] text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-xl opacity-0 group-hover:opacity-100 transition-all">Join Live Session</button>
            </div>
         </div>

         {/* Chat Side */}
         <div className="w-full md:w-80 border-l-4 border-soft-pink flex flex-col bg-white">
            <div className="p-4 border-b-2 border-slate-100 bg-slate-50/50">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Discussion Live</p>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4 hide-scrollbar">
               {messages.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                    <MessageCircle size={48} className="mb-2" />
                    <p className="text-xs font-bold">Mulai diskusi hangatmu di sini!</p>
                 </div>
               ) : (
                 messages.map(msg => (
                   <div key={msg.id} className={`flex flex-col gap-1 ${msg.user === 'Jane Doe' ? 'items-end' : 'items-start'}`}>
                     <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase">{msg.user}</span>
                        <span className="text-[8px] text-slate-300">{msg.time}</span>
                     </div>
                     <div className={`p-3 rounded-2xl text-xs font-medium max-w-[90%] ${
                       msg.user === 'Jane Doe' ? 'bg-baby-blue text-[#2B6CB0] rounded-tr-none' : 'bg-cream text-text-primary rounded-tl-none'
                     }`}>
                       {msg.text}
                     </div>
                   </div>
                 ))
               )}
            </div>
            <div className="p-4 border-t-2 border-slate-100 flex gap-2">
               <input 
                 value={inputText}
                 onChange={(e) => setInputText(e.target.value)}
                 onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                 placeholder="Tulis pesan..." 
                 className="flex-1 bg-slate-50 border-2 border-transparent focus:border-baby-blue rounded-xl px-4 py-2 text-xs font-medium outline-none transition-all"
               />
               <button 
                 onClick={handleSendMessage}
                 className="p-2 bg-[#553C9A] text-white rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all"
               >
                 <Send size={18} />
               </button>
            </div>
         </div>
      </section>

      {/* Dynamic Question Section (Soci-AI) */}
      <section className="bg-gradient-to-r from-lilac to-soft-pink p-8 rounded-4xl border-4 border-white card-shadow relative overflow-hidden">
         <div className="absolute right-0 top-0 p-8 opacity-20 rotate-12">
            <Sparkles size={120} className="text-white" />
         </div>
         <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1 space-y-4">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Soci-AI Active</span>
               </div>
               <h2 className="text-4xl font-display font-black text-white leading-tight">Soci-AI Question Engine</h2>
               <p className="text-white/80 font-medium">Bosan dengan soal yang itu-itu saja? AI akan membuatkan soal kasus sosiologi real-time untukmu.</p>
               <button 
                 disabled={isGenerating}
                 onClick={fetchAIQuestion}
                 className="px-8 py-4 bg-white text-[#553C9A] rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50"
               >
                  {isGenerating ? <Loader2 className="animate-spin" /> : <Plus size={18} />}
                  Generated AI Challenge
               </button>
            </div>
            
            <AnimatePresence mode="wait">
               {aiQuestion ? (
                 <motion.div 
                   key={aiQuestion.id}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="w-full lg:w-[450px] bg-white p-6 rounded-3xl shadow-xl space-y-4 border-4 border-soft-pink"
                 >
                    <div>
                       <span className="text-[10px] font-black text-soft-pink uppercase mb-1 block">Dynamic Case Study</span>
                       <p className="text-xs font-bold text-slate-700 italic">"{aiQuestion.context}"</p>
                    </div>
                    <div className="space-y-2">
                       <h4 className="text-sm font-black text-text-primary">{aiQuestion.question}</h4>
                       <div className="grid grid-cols-1 gap-2">
                          {aiQuestion.options.map(opt => (
                            <button key={opt} className="p-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-[10px] font-bold text-left hover:border-soft-pink transition-all">
                               {opt}
                            </button>
                          ))}
                       </div>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                       <p className="text-[8px] font-bold text-slate-400">Powered by Gemini AI</p>
                       <button onClick={() => setAiQuestion(null)} className="text-[8px] font-black text-soft-pink uppercase">Reset Soal</button>
                    </div>
                 </motion.div>
               ) : (
                 <div className="w-full lg:w-[450px] h-64 bg-white/10 backdrop-blur-md p-6 rounded-3xl border-2 border-white/20 border-dashed flex items-center justify-center text-white/40 text-center">
                    <div>
                       <Sparkles size={48} className="mx-auto mb-2" />
                       <p className="text-xs font-black uppercase">Klik tombol untuk <br/>memulai sihir AI</p>
                    </div>
                 </div>
               )}
            </AnimatePresence>
         </div>
      </section>
    </div>
  );
}
