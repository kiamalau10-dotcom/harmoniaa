import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, MessageCircle, Star, Video, Mic, Share2, Search, Plus, Send, X, Shield, Sparkles, Loader2, 
  MoreVertical, Reply, Forward, Pin, Ghost, Heart, Image as ImageIcon, Copy, Trash2, Camera,
  ArrowRight, Zap, BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  collection, query, where, onSnapshot, addDoc, serverTimestamp, 
  orderBy, limit, doc, updateDoc, arrayUnion, arrayRemove, getDocs,
  Timestamp
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { DISCUSSION_ROOMS, SOCI_AVATAR, HARMO_AVATAR, MATERI_LIST } from '../constants';
import { MODULE_SESSIONS, Session } from '../content/moduleData';
import { DiscussionRoom, ChatMessage, AIQuestion } from '../types';
import { generateDynamicQuestion } from '../services/geminiService';
import { SociIcon, HarmoIcon } from '../components/Mascots';

const AvatarRenderer = ({ url, className = "w-full h-full object-cover" }: { url: string, className?: string }) => {
  if (url === SOCI_AVATAR) return <div className={`bg-cream p-1 ${className}`}><SociIcon /></div>;
  if (url === HARMO_AVATAR) return <div className={`bg-cream p-1 ${className}`}><HarmoIcon /></div>;
  return <img src={url} alt="avatar" className={className} />;
};

export default function StudyRoom() {
  const { profile } = useAuth();
  const [selectedRoom, setSelectedRoom] = useState<DiscussionRoom | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [roomStats, setRoomStats] = useState<Record<string, { active: number, memberList: any[] }>>({});
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [isLiveActive, setIsLiveActive] = useState(false);
  
  const [aiQuestion, setAiQuestion] = useState<AIQuestion | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Link selected room to a session for live study content
  const currentSession = MODULE_SESSIONS.find(s => s.id === selectedRoom?.id) || MODULE_SESSIONS[0];
  const relatedMateri = MATERI_LIST.find(m => m.id === selectedRoom?.materiId);

  // Fetch Online Users & Room Stats
  useEffect(() => {
    const q = query(collection(db, 'users'), where('isOnline', '==', true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOnlineUsers(users);
      
      // Calculate room stats based on online users' currentRoomId
      const stats: Record<string, { active: number, memberList: any[] }> = {};
      DISCUSSION_ROOMS.forEach(room => {
        const usersInRoom = users.filter((u: any) => u.currentRoomId === room.id);
        stats[room.id] = { 
          active: usersInRoom.length,
          memberList: usersInRoom
        };
      });
      setRoomStats(stats);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'users'));

    return () => unsubscribe();
  }, []);

  // Update User Presence in Room
  useEffect(() => {
    if (!profile) return;
    
    const updateRoomPresence = async () => {
      try {
        await updateDoc(doc(db, 'users', profile.uid), {
          currentRoomId: selectedRoom?.id || null,
          lastActive: serverTimestamp()
        });
      } catch (error) {
        console.error("Presence update failed:", error);
      }
    };

    updateRoomPresence();
  }, [selectedRoom, profile?.uid]);

  // Fetch Messages for Selected Room
  useEffect(() => {
    if (!selectedRoom) {
      setMessages([]);
      return;
    }

    const q = query(
      collection(db, 'chatRooms', selectedRoom.id, 'messages'),
      orderBy('timestamp', 'asc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage));
      setMessages(msgs);
      setTimeout(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }, 100);
    }, (error) => handleFirestoreError(error, OperationType.GET, `chatRooms/${selectedRoom.id}/messages`));

    return () => unsubscribe();
  }, [selectedRoom]);

  const handleSendMessage = async (type: 'text' | 'voice' | 'image' | 'video' = 'text', mediaUrl?: string) => {
    if (!profile || (!inputText.trim() && type === 'text')) return;

    try {
      const messageData: Partial<ChatMessage> = {
        senderId: profile.uid,
        senderName: profile.username,
        senderAvatar: profile.avatar,
        text: inputText,
        type,
        mediaUrl,
        timestamp: serverTimestamp(),
        replyTo: replyTo?.id,
        favorites: []
      };

      await addDoc(collection(db, 'chatRooms', selectedRoom!.id, 'messages'), messageData);
      setInputText('');
      setReplyTo(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `chatRooms/${selectedRoom!.id}/messages`);
    }
  };

  const handleAction = async (msgId: string, action: 'pin' | 'favorite' | 'copy' | 'forward') => {
    if (!selectedRoom || !profile) return;

    const msgRef = doc(db, 'chatRooms', selectedRoom.id, 'messages', msgId);
    const msg = messages.find(m => m.id === msgId);

    switch (action) {
      case 'pin':
        await updateDoc(msgRef, { isPinned: !msg?.isPinned });
        break;
      case 'favorite':
        const isFav = msg?.favorites?.includes(profile.uid);
        await updateDoc(msgRef, { 
          favorites: isFav ? arrayRemove(profile.uid) : arrayUnion(profile.uid) 
        });
        break;
      case 'copy':
        if (msg?.text) {
          navigator.clipboard.writeText(msg.text);
          // Optional: toast notification
        }
        break;
      case 'forward':
        // Simplified: Forward just adds to current room for now
        await addDoc(collection(db, 'chatRooms', selectedRoom.id, 'messages'), {
          ...msg,
          id: undefined,
          timestamp: serverTimestamp(),
          senderId: profile.uid,
          senderName: `${profile.username} (Diteruskan)`,
        });
        break;
    }
  };

  const fetchAIQuestion = async () => {
    setIsGenerating(true);
    const topic = selectedRoom?.category || "Harmoni Sosial";
    try {
      const question = await generateDynamicQuestion(topic);
      setAiQuestion(question);
    } catch (e) {
      console.error(e);
    }
    setIsGenerating(false);
  };

  const PlayCircle = ({ size, fill, stroke, className }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
    </svg>
  );

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-text-primary underline decoration-sage decoration-8 underline-offset-4 tracking-tight">Study Room</h1>
          <p className="text-slate-500 font-medium mt-2">Pilih ruangan dan mulailah berkolaborasi secara real-time.</p>
        </div>
        
        <AnimatePresence>
          {(selectedRoom ? (roomStats[selectedRoom.id]?.memberList || []) : onlineUsers).length > 0 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-3xl border-4 border-sidebar-border shadow-sm"
            >
               <div className="flex -space-x-2">
                 {(selectedRoom ? (roomStats[selectedRoom.id]?.memberList || []) : onlineUsers).slice(0, 5).map(u => (
                   <img key={u.id} src={u.avatar} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100" />
                 ))}
               </div>
               <span className="text-xs font-black text-text-primary uppercase tracking-widest pl-2">
                 {(selectedRoom ? (roomStats[selectedRoom.id]?.memberList || []) : onlineUsers).length} {selectedRoom ? 'Di Ruangan' : 'Online'}
               </span>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ONLINE PRESENCE HORIZONTAL BAR */}
      <AnimatePresence>
        {onlineUsers.length > 0 && (
          <motion.section 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="bg-white p-6 rounded-4xl border-4 border-baby-blue card-shadow overflow-x-auto hide-scrollbar flex gap-6"
          >
            {onlineUsers.map((user) => (
              <motion.div 
                key={user.id} 
                whileHover={{ scale: 1.1 }}
                className="flex flex-col items-center gap-2 min-w-[80px] group"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-slate-50 border-4 border-white shadow-sm overflow-hidden p-1">
                     <img src={user.avatar} className="w-full h-full object-cover rounded-full" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse" />
                </div>
                <span className="text-[10px] font-black text-text-primary uppercase tracking-tight text-center">{user.username?.split(' ')[0] || 'User'}</span>
              </motion.div>
            ))}
          </motion.section>
        )}
      </AnimatePresence>

      {/* ROOMS GRID */}
      {!selectedRoom ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DISCUSSION_ROOMS.map((room) => (
            <motion.div
              key={room.id}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => setSelectedRoom(room)}
              className="group cursor-pointer bg-white p-6 rounded-[2.5rem] border-4 border-sidebar-border card-shadow flex flex-col gap-4 relative overflow-hidden transition-all duration-300"
            >
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-baby-blue/5 rounded-full flex items-center justify-center group-hover:bg-baby-blue/10 transition-colors">
                 <MessageCircle size={40} className="text-baby-blue opacity-20" />
              </div>
              <div className="flex justify-between items-start">
                 <span className="px-4 py-1.5 bg-baby-blue/20 rounded-full text-[10px] font-black text-[#2B6CB0] uppercase tracking-widest">{room.category}</span>
                 <div className="flex items-center gap-1.5 text-[10px] font-black text-green-500 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                    {roomStats[room.id]?.active || 0} Aktif
                 </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-black text-text-primary text-xl leading-tight group-hover:text-[#2B6CB0] transition-colors">{room.name}</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{room.description}</p>
              </div>
              <div className="mt-auto pt-6 border-t-2 border-dashed border-slate-100 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <Users size={14} className="text-slate-400" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{roomStats[room.id]?.active || 0} Members Aktif</span>
                 </div>
                 <button className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-[#553C9A] group-hover:text-white transition-all shadow-sm group-hover:shadow-md">
                   <ArrowRight size={18} />
                 </button>
              </div>
            </motion.div>
          ))}
          
          <motion.button 
            whileHover={{ scale: 0.98 }}
            className="p-6 rounded-[2.5rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 text-slate-300 hover:border-baby-blue hover:text-baby-blue transition-all bg-white/50"
          >
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-2">
              <Plus size={32} />
            </div>
            <p className="font-black uppercase tracking-widest text-xs font-display">Create New Room</p>
          </motion.button>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[3rem] border-4 border-baby-blue card-shadow flex flex-col h-[700px] overflow-hidden relative"
        >
          {/* ROOM HEADER */}
          <header className="p-6 border-b-4 border-sidebar-border bg-sidebar-bg/30 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <button onClick={() => setSelectedRoom(null)} className="p-2 hover:bg-white rounded-xl transition-colors">
                  <X size={20} />
               </button>
               <div>
                 <h2 className="font-display font-black text-text-primary text-xl tracking-tight">{selectedRoom.name}</h2>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedRoom.category} • {roomStats[selectedRoom.id]?.active || 0} Online</p>
               </div>
            </div>
            <div className="flex items-center gap-2">
               <button onClick={() => setIsLiveActive(!isLiveActive)} className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${isLiveActive ? 'bg-red-500 text-white shadow-lg' : 'bg-white text-slate-900 border-2 border-sidebar-border hover:bg-slate-50'}`}>
                  <Video size={16} /> {isLiveActive ? 'Live Now' : 'Start Live'}
               </button>
               <button className="p-3 bg-white rounded-2xl border-2 border-sidebar-border text-slate-400">
                  <MoreVertical size={20} />
               </button>
            </div>
          </header>

          <div className="flex-1 flex overflow-hidden">
            {/* MAIN CHAT AREA */}
            <div className="flex-1 flex flex-col bg-slate-50/30">
              <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-6 hide-scrollbar flex flex-col">
                <div className="mt-auto" /> {/* Pushes messages down */}
                <div className="flex flex-col items-center py-8 text-center space-y-2 opacity-30">
                   <div className="w-16 h-16 bg-white rounded-3xl border-4 border-sidebar-border flex items-center justify-center">
                      <Shield size={32} />
                   </div>
                   <p className="text-xs font-black uppercase tracking-widest">End-to-End Encrypted</p>
                   <p className="text-[10px] max-w-[200px]">Pesan dalam ruangan ini aman dan hanya dapat dilihat oleh anggota.</p>
                </div>

                {messages.map((msg, i) => {
                  const isMe = msg.senderId === profile?.uid;
                  const showAvatar = i === 0 || messages[i-1].senderId !== msg.senderId;
                  const timestamp = msg.timestamp instanceof Timestamp ? msg.timestamp.toDate() : (msg.timestamp ? new Date(msg.timestamp as any) : new Date());
                  
                  return (
                    <div key={msg.id} className={`flex gap-3 group ${isMe ? 'flex-row-reverse' : ''}`}>
                       {!isMe && (
                         <div className="w-10 flex-shrink-0">
                           {showAvatar && (
                             <div className="w-10 h-10 rounded-2xl border-2 border-white shadow-sm overflow-hidden bg-white">
                                <AvatarRenderer url={msg.senderAvatar} />
                             </div>
                           )}
                         </div>
                       )}
                       
                       <div className={`flex flex-col max-w-[75%] gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
                          {showAvatar && (
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 px-1">{msg.senderName}</span>
                          )}
                          
                          <div className="relative group">
                            <motion.div 
                              layout
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className={`p-4 rounded-3xl shadow-sm text-sm font-medium relative ${
                                isMe 
                                ? 'bg-gradient-to-br from-[#553C9A] to-[#6B46C1] text-white rounded-tr-none' 
                                : 'bg-white text-slate-900 border-2 border-sidebar-border rounded-tl-none'
                              } ${msg.isPinned ? 'ring-2 ring-yellow-400' : ''}`}
                            >
                               {msg.replyTo && (
                                 <div className={`mb-2 p-2 rounded-xl bg-black/10 text-[10px] border-l-4 border-white/30 truncate max-w-full italic flex items-center gap-2`}>
                                    <Reply size={10} /> {messages.find(m => m.id === msg.replyTo)?.text || 'Pesan Dihapus'}
                                 </div>
                               )}
                               
                               {msg.type === 'text' && <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>}
                               {msg.type === 'voice' && (
                                 <div className="flex items-center gap-3 w-48 py-1">
                                    <button className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isMe ? 'bg-white/20 hover:bg-white/30' : 'bg-slate-100 hover:bg-slate-200'}`}>
                                       <PlayCircle size={18} fill="currentColor" stroke="none" />
                                    </button>
                                    <div className="flex-1 space-y-1">
                                       <div className="flex items-end gap-0.5 h-6">
                                          {[0.3, 0.7, 0.5, 0.9, 0.4, 0.8, 0.6, 0.3, 0.5, 0.7, 0.4, 0.6].map((h, j) => (
                                            <div key={j} className={`flex-1 rounded-full ${isMe ? 'bg-white/40' : 'bg-slate-200'}`} style={{ height: `${h * 100}%` }} />
                                          ))}
                                       </div>
                                       <div className="flex justify-between items-center text-[8px] font-black opacity-60">
                                          <span>0:24</span>
                                          <span>2.4 MB</span>
                                       </div>
                                    </div>
                                 </div>
                               )}
                               {msg.type === 'video' && (
                                 <div className="aspect-video w-64 bg-slate-200 rounded-2xl flex items-center justify-center bg-cover bg-center overflow-hidden border-2 border-white/20 relative" style={{ backgroundImage: `url(${msg.mediaUrl || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800'})` }}>
                                    <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center">
                                       <Video size={24} className="text-white fill-current" />
                                    </div>
                                    <div className="absolute bottom-2 right-2 bg-black/50 px-2 py-0.5 rounded text-[8px] font-bold text-white uppercase tracking-widest">VIDEO</div>
                                 </div>
                               )}
 
                                {msg.isPinned && (
                                  <div className="absolute -top-2 -right-2 bg-yellow-400 p-1.5 rounded-lg shadow-md border-2 border-white">
                                    <Pin size={10} className="text-white fill-current rotate-45" />
                                  </div>
                                )}
                            </motion.div>
 
                            {/* HOVER ACTIONS - EXPANDED */}
                            <div className={`absolute top-0 opacity-0 group-hover:opacity-100 transition-all flex gap-1 z-20 ${isMe ? 'right-full mr-3' : 'left-full ml-3'}`}>
                               <button title="Reply" onClick={() => setReplyTo(msg)} className="p-2.5 bg-white rounded-xl shadow-lg border-2 border-slate-50 hover:border-blue-400 hover:text-blue-500 scale-90 hover:scale-100 transition-all"><Reply size={14} /></button>
                               <button title="Forward" onClick={() => handleAction(msg.id, 'forward')} className="p-2.5 bg-white rounded-xl shadow-lg border-2 border-slate-50 hover:border-indigo-400 hover:text-indigo-500 scale-90 hover:scale-100 transition-all"><Forward size={14} /></button>
                               <button title="Favorite" onClick={() => handleAction(msg.id, 'favorite')} className={`p-2.5 bg-white rounded-xl shadow-lg border-2 border-slate-50 hover:border-rose-400 hover:text-rose-500 scale-90 hover:scale-100 transition-all ${msg.favorites?.includes(profile?.uid || '') ? 'text-rose-500' : ''}`}><Heart size={14} fill={msg.favorites?.includes(profile?.uid || '') ? "currentColor" : "none"} /></button>
                               <button title="Pin" onClick={() => handleAction(msg.id, 'pin')} className={`p-2.5 bg-white rounded-xl shadow-lg border-2 border-slate-50 hover:border-yellow-400 hover:text-yellow-500 scale-90 hover:scale-100 transition-all ${msg.isPinned ? 'text-yellow-500' : ''}`}><Pin size={14} fill={msg.isPinned ? "currentColor" : "none"} /></button>
                               <button title="Copy" onClick={() => handleAction(msg.id, 'copy')} className="p-2.5 bg-white rounded-xl shadow-lg border-2 border-slate-50 hover:border-emerald-400 hover:text-emerald-500 scale-90 hover:scale-100 transition-all"><Copy size={14} /></button>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 px-1">
                             <span className="text-[8px] text-slate-400 uppercase font-bold">
                                {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </span>
                             {msg.favorites && msg.favorites.length > 0 && (
                                <div className="flex items-center gap-1 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100 shadow-sm animate-in fade-in zoom-in duration-300">
                                   <Heart size={8} className="text-rose-500 fill-current" />
                                   <span className="text-[8px] font-black text-rose-600">{msg.favorites.length}</span>
                                </div>
                             )}
                          </div>
                       </div>
                    </div>
                  );
                })}
              </div>

              {/* REPLY PREVIEW */}
              <AnimatePresence>
                {replyTo && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 py-3 bg-blue-50 border-t-2 border-baby-blue flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                       <Reply size={14} className="text-blue-500 shrink-0" />
                       <div className="text-xs truncate">
                          <span className="font-black text-blue-600">Replying to {replyTo.senderName}: </span>
                          <span className="text-slate-500">{replyTo.text}</span>
                       </div>
                    </div>
                    <button onClick={() => setReplyTo(null)} className="text-slate-400 hover:text-slate-600">
                       <X size={16} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* INPUT AREA */}
              <div className="p-6 bg-white border-t-4 border-sidebar-border flex flex-col gap-4">
                 <div className="flex items-center gap-2">
                    <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100"><ImageIcon size={18} /></button>
                    <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100"><Mic size={18} /></button>
                    <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100"><Camera size={18} /></button>
                    <div className="flex-1 relative">
                       <input 
                         value={inputText}
                         onChange={(e) => setInputText(e.target.value)}
                         onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                         placeholder="Tulis pesan harmoni..." 
                         className="w-full bg-slate-50 border-2 border-transparent focus:border-baby-blue rounded-2xl px-5 py-3 text-sm font-medium outline-none transition-all"
                       />
                       <button 
                        onClick={() => handleSendMessage()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-[#553C9A] text-white rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all"
                       >
                         <Send size={18} />
                       </button>
                    </div>
                 </div>
              </div>
            </div>

            {/* LIVE STREAM / SIDE BAR - ENHANCED */}
            <AnimatePresence>
               {isLiveActive && (
                 <motion.div 
                   initial={{ width: 0, opacity: 0 }}
                   animate={{ width: 380, opacity: 1 }}
                   exit={{ width: 0, opacity: 0 }}
                   className="border-l-4 border-sidebar-border bg-white flex flex-col overflow-hidden"
                 >
                    <div className="flex-1 overflow-y-auto flex flex-col">
                       {/* Real Stream Aspect */}
                       <div className="aspect-video bg-slate-900 relative group overflow-hidden">
                          <iframe 
                            className="absolute inset-0 w-full h-full"
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1" 
                            title="Live Stream"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                          <div className="absolute top-4 left-4 flex gap-2">
                             <div className="bg-red-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest animate-pulse flex items-center gap-2">
                                <div className="w-2 h-2 bg-white rounded-full animate-ping" /> LIVE
                             </div>
                             <div className="bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
                                <Users size={12} /> {124 + onlineUsers.length}
                             </div>
                          </div>
                          <div className="absolute bottom-4 left-4 truncate max-w-[80%]">
                             <p className="text-white font-black text-sm tracking-tight drop-shadow-md">LIVE: {currentSession.title}</p>
                          </div>
                       </div>
                       
                       <div className="p-6 space-y-6 flex-1">
                          <div className="flex items-center justify-between">
                             <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Sesi Berlanjut</h4>
                             <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-1 rounded-lg">Terintegrasi Materi</span>
                          </div>
                          
                          <div className="space-y-4">
                             <div className="p-5 bg-gradient-to-br from-baby-blue/20 to-white rounded-3xl border-2 border-baby-blue/10 relative overflow-hidden group/card shadow-sm">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/card:scale-110 transition-transform">
                                   <AvatarRenderer url={SOCI_AVATAR} className="w-16 h-16" />
                                </div>
                                <h5 className="text-[10px] font-black text-blue-600 uppercase mb-2 flex items-center gap-2">
                                   <Sparkles size={12} /> Soci Insight
                                </h5>
                                <p className="text-sm font-bold text-slate-700 leading-relaxed italic">"{currentSession.content.substring(0, 200)}..."</p>
                                <Link to="/materi" className="inline-flex items-center gap-2 mt-4 text-[10px] font-black text-blue-600 hover:gap-3 transition-all uppercase tracking-widest">
                                   Pelajari Bab Selengkapnya <ArrowRight size={12} />
                                </Link>
                             </div>

                             {relatedMateri && (
                               <div className="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                  <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                                        <BookOpen size={20} />
                                     </div>
                                     <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Materi Relevan</p>
                                        <p className="text-xs font-black text-slate-700">{relatedMateri.title}</p>
                                     </div>
                                  </div>
                               </div>
                             )}
                          </div>
                          
                          <div className="space-y-4 pt-4 border-t border-slate-50">
                             <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Presenters</h4>
                             <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-center gap-3 p-3 bg-white border-2 border-sidebar-border rounded-2xl hover:border-soft-pink transition-colors">
                                   <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm">
                                      <AvatarRenderer url={SOCI_AVATAR} />
                                   </div>
                                   <div>
                                      <p className="text-xs font-black">Soci</p>
                                      <p className="text-[8px] text-slate-400 font-bold uppercase">Expert</p>
                                   </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white border-2 border-sidebar-border rounded-2xl hover:border-baby-blue transition-colors">
                                   <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm">
                                      <AvatarRenderer url={HARMO_AVATAR} />
                                   </div>
                                   <div>
                                      <p className="text-xs font-black">Harmo</p>
                                      <p className="text-[8px] text-slate-400 font-bold uppercase">Mentor</p>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </div>

                       {/* MINI LIVE CHAT */}
                       <div className="p-4 bg-slate-50/50 border-t border-slate-100 h-48 overflow-y-auto hide-scrollbar space-y-3">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-center sticky top-0 bg-slate-50/50 py-1">Live Interaction</p>
                          {messages.slice(-5).map(m => (
                            <div key={m.id} className="flex gap-2 animate-in slide-in-from-bottom-2 duration-300">
                               <div className="w-6 h-6 rounded-lg overflow-hidden bg-white shrink-0 shadow-sm border border-slate-100">
                                  <AvatarRenderer url={m.senderAvatar} />
                               </div>
                               <div className="text-[10px]">
                                  <span className="font-black text-slate-600">{m.senderName}: </span>
                                  <span className="text-slate-500 font-medium">{m.text}</span>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                    <div className="p-4 bg-white border-t-4 border-sidebar-border">
                       <button 
                         onClick={() => setIsLiveActive(false)}
                         className="w-full py-4 bg-white border-2 border-slate-200 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                       >
                         Tinggalkan Live <X size={12} />
                       </button>
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* GEMINI AI CHALLENGE SECTION */}
      <section className="bg-gradient-to-br from-[#553C9A] via-[#B794F4] to-[#F687B3] p-12 rounded-[4rem] border-4 border-white card-shadow relative overflow-hidden group">
         {/* Animated background shapes */}
         <motion.div 
           animate={{ rotate: 360 }}
           transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
           className="absolute -right-20 -top-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" 
         />
         
         <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
               <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/20 backdrop-blur-xl rounded-full border border-white/30">
                  <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Soci-AI Intelligent Hub</span>
               </div>
               <h2 className="text-5xl font-display font-black text-white leading-tight tracking-tight">Challenge Pikiranmu <br/>Dengan <span className="text-white underline decoration-baby-blue decoration-8">Gemini AI</span></h2>
               <p className="text-white/80 font-medium text-lg leading-relaxed max-w-xl">Soci-AI hadir untuk memberikan studi kasus sosiologi yang paling relevan dan terupdate secara real-time. Siap untuk level up?</p>
               
               <button 
                 disabled={isGenerating}
                 onClick={fetchAIQuestion}
                 className="group/btn relative px-10 py-5 bg-white text-[#553C9A] rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 overflow-hidden"
               >
                  <div className="absolute inset-0 bg-baby-blue/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                  {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles size={20} className="text-blue-500" />}
                  <span className="relative z-10">{isGenerating ? 'Menganalisis Case...' : 'Generated AI Challenge'}</span>
               </button>
            </div>
            
            <AnimatePresence mode="wait">
               {aiQuestion ? (
                 <motion.div 
                   key={aiQuestion.id}
                   initial={{ opacity: 0, y: 30, scale: 0.9 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.9 }}
                   className="w-full lg:w-[500px] bg-white rounded-[3.5rem] shadow-2xl p-8 space-y-6 border-4 border-white relative"
                 >
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-yellow-400 rounded-2xl rotate-12 flex items-center justify-center shadow-lg border-4 border-white">
                       <Zap size={20} className="text-white" />
                    </div>
                    
                    <div className="space-y-4">
                       <div className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-100 italic relative">
                          <Ghost size={40} className="absolute -top-4 -right-4 text-slate-100 opacity-50" />
                          <p className="text-sm font-bold text-slate-600 leading-relaxed">"{aiQuestion.context}"</p>
                       </div>
                       
                       <div className="space-y-4">
                          <h4 className="text-lg font-black text-text-primary leading-snug">{aiQuestion.question}</h4>
                          <div className="grid grid-cols-1 gap-3">
                             {aiQuestion.options.map((opt, i) => (
                               <motion.button 
                                 key={opt} 
                                 whileHover={{ x: 10, backgroundColor: '#EDF2F7' }}
                                 className="group/opt flex items-center gap-4 p-4 bg-white border-2 border-slate-100 rounded-[1.5rem] text-sm font-black text-left transition-all"
                               >
                                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover/opt:bg-[#553C9A] group-hover/opt:text-white transition-colors">{String.fromCharCode(65 + i)}</div>
                                  <span className="flex-1">{opt}</span>
                               </motion.button>
                             ))}
                          </div>
                       </div>
                    </div>
                    
                    <div className="pt-6 border-t-2 border-slate-50 flex justify-between items-center">
                       <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Real-time Analysis</p>
                       </div>
                       <button onClick={() => setAiQuestion(null)} className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline">Reset Case</button>
                    </div>
                 </motion.div>
               ) : (
                 <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="w-full lg:w-[500px] h-80 bg-white/5 backdrop-blur-md rounded-[3.5rem] border-4 border-white/20 border-dashed flex flex-col items-center justify-center text-white/50 text-center p-12 group-hover:border-white/40 transition-colors"
                 >
                    <div className="p-8 bg-white/10 rounded-[3rem] mb-4">
                       <Sparkles size={64} className="text-white opacity-40 animate-pulse" />
                    </div>
                    <p className="text-sm font-black uppercase tracking-[0.2em]">Ready for your daily <br/>intellectual boost?</p>
                 </motion.div>
               )}
            </AnimatePresence>
         </div>
      </section>
    </div>
  );
}
