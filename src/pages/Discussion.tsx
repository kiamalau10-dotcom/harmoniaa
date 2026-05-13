import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Heart, Share2, Send, Filter, Users, ShieldAlert, Vote, X, Plus, Clock, Search, Trophy } from 'lucide-react';
import { 
  collection, query, onSnapshot, orderBy, addDoc, serverTimestamp, 
  doc, updateDoc, arrayUnion, arrayRemove, increment, limit, where 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { DiscussionPost, Poll } from '../types';

export default function Discussion() {
  const { profile } = useAuth();
  const [posts, setPosts] = useState<DiscussionPost[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [activeTab, setActiveTab] = useState('Semua Circle');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('Tips Sosial');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['Semua Circle', 'Tips Sosial', 'Cerita Anonim', 'Diskusi Kasus', 'Sharing Pengalaman'];

  // Fetch Posts
  useEffect(() => {
    let q = query(collection(db, 'discussionPosts'), orderBy('timestamp', 'desc'), limit(50));
    
    if (activeTab !== 'Semua Circle') {
      q = query(collection(db, 'discussionPosts'), where('category', '==', activeTab), orderBy('timestamp', 'desc'), limit(50));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DiscussionPost));
      setPosts(postList);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'discussionPosts'));

    return () => unsubscribe();
  }, [activeTab]);

  // Fetch Polls
  useEffect(() => {
    const q = query(collection(db, 'polls'), where('isActive', '==', true), limit(1));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const pollList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Poll));
      setPolls(pollList);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'polls'));

    return () => unsubscribe();
  }, []);

  const handleCreatePost = async () => {
    if (!profile || !newPostContent.trim()) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'discussionPosts'), {
        authorId: profile.uid,
        authorName: isAnonymous ? 'Sobat Harmoni' : profile.username,
        authorAvatar: isAnonymous ? '/images/anonymous-avatar.png' : profile.avatar,
        content: newPostContent.trim(),
        category: isAnonymous ? 'Cerita Anonim' : newPostCategory,
        votes: 0,
        votedBy: [],
        replyCount: 0,
        timestamp: serverTimestamp(),
        isAnonymous
      });
      setNewPostContent('');
      setShowCreateModal(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'discussionPosts');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (postId: string) => {
    if (!profile) return;
    const postRef = doc(db, 'discussionPosts', postId);
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const hasVoted = post.votedBy?.includes(profile.uid);
    try {
      await updateDoc(postRef, {
        votedBy: hasVoted ? arrayRemove(profile.uid) : arrayUnion(profile.uid),
        votes: increment(hasVoted ? -1 : 1)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `discussionPosts/${postId}`);
    }
  };

  const handlePollVote = async (pollId: string, optionIndex: number) => {
    if (!profile) return;
    const pollRef = doc(db, 'polls', pollId);
    const poll = polls.find(p => p.id === pollId);
    if (!poll || poll.voters.includes(profile.uid)) return;

    const newOptions = [...poll.options];
    newOptions[optionIndex].votes += 1;

    try {
      await updateDoc(pollRef, {
        options: newOptions,
        voters: arrayUnion(profile.uid),
        totalVotes: increment(1)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `polls/${pollId}`);
    }
  };

  const filteredPosts = posts.filter(p => 
    p.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.authorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-text-primary underline decoration-soft-pink decoration-8 underline-offset-4 tracking-tight">Circle Discussion</h1>
          <p className="text-slate-500 font-medium mt-2">Berbagi pengalaman dan cari solusi sosial bersama secara real-time.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="px-8 py-4 bg-soft-pink text-white font-black rounded-3xl shadow-xl shadow-soft-pink/20 hover:bg-[#D53F8C] transition-all flex items-center gap-2 text-sm uppercase tracking-widest"
        >
          <Plus size={20} /> Buat Postingan
        </motion.button>
      </header>

      {/* Poll Section */}
      <AnimatePresence>
        {polls.map(poll => (
          <motion.section 
            key={poll.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-[3rem] border-4 border-sidebar-border shadow-xl space-y-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-lilac/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3 text-lilac">
                <div className="p-2 bg-lilac/10 rounded-xl">
                  <Vote size={24} />
                </div>
                <h3 className="font-black uppercase tracking-[0.2em] text-xs">VOTING MINGGU INI</h3>
              </div>
              <div className="px-4 py-1.5 bg-emerald-50 text-emerald-500 rounded-full border border-emerald-100 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-tighter">Live Poll</span>
              </div>
            </div>

            <div className="space-y-6 relative z-10">
                <p className="text-xl md:text-2xl font-black text-text-primary leading-tight">{poll.question}</p>
                <div className="space-y-4">
                    {poll.options.map((opt, i) => {
                        const percent = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
                        const hasVoted = poll.voters.includes(profile?.uid || '');
                        
                        return (
                            <div 
                              key={i} 
                              onClick={() => !hasVoted && handlePollVote(poll.id, i)}
                              className={`relative group ${hasVoted ? 'cursor-default' : 'cursor-pointer'}`}
                            >
                                <div className="absolute inset-0 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem]" />
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percent}%` }}
                                  transition={{ duration: 1, ease: "easeOut" }}
                                  className="absolute inset-y-0 left-0 bg-lilac/10 border-2 border-lilac/20 rounded-[1.5rem]" 
                                />
                                <div className="relative p-5 flex items-center justify-between">
                                    <span className="text-sm md:text-base font-black text-slate-700 flex items-center gap-3">
                                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] ${hasVoted && i === poll.options.findIndex(o => o.label === opt.label) ? 'bg-lilac text-white' : 'bg-white border-2 border-slate-100 text-slate-400'}`}>
                                        {i + 1}
                                      </div>
                                      {opt.label}
                                    </span>
                                    <span className="text-sm font-black text-lilac bg-white px-3 py-1 rounded-xl shadow-sm">{percent}%</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic">{poll.totalVotes.toLocaleString()} Siswa telah memberikan suara.</p>
                  {profile && poll.voters.includes(profile.uid) && (
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                       Terima kasih atas suaramu! <Heart size={10} fill="currentColor" />
                    </span>
                  )}
                </div>
            </div>
          </motion.section>
        ))}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button 
              key={cat} 
              onClick={() => setActiveTab(cat)}
              className={`whitespace-nowrap px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border-4 transition-all ${
                activeTab === cat 
                ? 'bg-baby-blue border-white text-white shadow-lg' 
                : 'bg-white border-sidebar-border text-slate-400 hover:border-baby-blue/30 hover:text-baby-blue'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
           <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
           <input 
             type="text" 
             placeholder="Cari Postingan..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full bg-white border-4 border-sidebar-border rounded-full py-2.5 pl-12 pr-6 text-xs font-black placeholder:text-slate-300 focus:border-baby-blue outline-none transition-all"
           />
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-8 min-h-[400px]">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border-4 border-dashed border-slate-200">
            <Users size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold">Belum ada diskusi di kategori ini.</p>
            <p className="text-xs text-slate-300 mt-1">Jadilah yang pertama untuk memulai percakapan!</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <motion.article 
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-[3rem] border-4 border-sidebar-border shadow-xl space-y-6 relative group hover:border-soft-pink/20 transition-all card-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg overflow-hidden border-2 border-white ${post.isAnonymous ? 'bg-slate-300' : 'bg-baby-blue'}`}>
                    {post.isAnonymous ? <Users size={24} /> : <img src={post.authorAvatar} alt="avatar" className="w-full h-full object-cover" />}
                  </div>
                  <div>
                    <h4 className="text-base font-black text-text-primary tracking-tight">{post.authorName}</h4>
                    <div className="flex items-center gap-2">
                       <Clock size={10} className="text-slate-300" />
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                          {post.timestamp?.toDate?.().toLocaleString() || 'Baru saja'} • <span className={`${post.isAnonymous ? 'text-lilac' : 'text-soft-pink'} font-black`}>{post.category}</span>
                       </p>
                    </div>
                  </div>
                </div>
                <button className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                  <ShieldAlert size={20} />
                </button>
              </div>
              
              <div className="bg-slate-50/50 p-6 rounded-[2rem] border-2 border-slate-50 italic">
                <p className="text-slate-700 leading-relaxed text-base md:text-lg font-medium">
                  "{post.content}"
                </p>
              </div>

              <div className="pt-6 border-t-2 border-slate-50 flex items-center gap-8">
                <motion.button 
                   whileHover={{ scale: 1.1 }}
                   whileTap={{ scale: 0.9 }}
                   onClick={() => handleVote(post.id)}
                   className={`flex items-center gap-2.5 transition-all px-4 py-2 rounded-2xl ${post.votedBy?.includes(profile?.uid || '') ? 'bg-rose-50 text-rose-500 border-2 border-rose-100' : 'text-slate-400 hover:bg-slate-50'}`}
                >
                  <Heart size={20} fill={post.votedBy?.includes(profile?.uid || '') ? "currentColor" : "none"} />
                  <span className="text-sm font-black">{post.votes || 0}</span>
                </motion.button>
                <button className="flex items-center gap-2.5 text-slate-400 hover:text-baby-blue transition-all px-4 py-2 rounded-2xl hover:bg-slate-50">
                  <MessageCircle size={20} />
                  <span className="text-sm font-black">{post.replyCount || 0}</span>
                </button>
                <button className="flex items-center justify-center p-3 text-slate-300 hover:text-lilac transition-all hover:bg-slate-50 rounded-2xl ml-auto">
                  <Share2 size={20} />
                </button>
              </div>
            </motion.article>
          ))
        )}
      </div>

      {/* FLOAT ACTION BUTTON FOR MOBILE */}
      <div className="fixed bottom-10 right-10 z-50 md:hidden">
         <motion.button 
           whileHover={{ scale: 1.1 }}
           whileTap={{ scale: 0.9 }}
           onClick={() => setShowCreateModal(true)}
           className="w-16 h-16 bg-soft-pink text-white rounded-3xl shadow-2xl flex items-center justify-center"
         >
            <Plus size={32} />
         </motion.button>
      </div>

      {/* CREATE POST MODAL */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[3rem] w-full max-w-xl p-8 shadow-2xl relative z-10 border-4 border-white"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-text-primary underline decoration-soft-pink decoration-6 underline-offset-4">Bagikan Ceritamu</h3>
                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                   <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block">Kategori Circle</label>
                   <div className="grid grid-cols-2 gap-3">
                      {categories.filter(c => c !== 'Semua Circle').map(cat => (
                        <button 
                          key={cat}
                          onClick={() => setNewPostCategory(cat)}
                          className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${newPostCategory === cat ? 'bg-lilac border-lilac text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-lilac/30'}`}
                        >
                          {cat}
                        </button>
                      ))}
                   </div>
                </div>

                <div>
                   <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block">Apa yang ada di pikiranmu?</label>
                   <textarea 
                     rows={5}
                     value={newPostContent}
                     onChange={(e) => setNewPostContent(e.target.value)}
                     placeholder="Tuliskan pengalaman, pertanyaan, atau tips sosialmu di sini..."
                     className="w-full bg-slate-50 border-4 border-transparent focus:border-lilac/30 rounded-[2rem] p-6 text-sm font-medium outline-none transition-all placeholder:text-slate-300"
                   />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-xl text-lilac shadow-sm">
                        <Users size={16} />
                      </div>
                      <div>
                         <p className="text-xs font-black text-text-primary">Posting Secara Anonim</p>
                         <p className="text-[10px] text-slate-400 font-medium">Namamu akan disamarkan menjadi Sobat Harmoni.</p>
                      </div>
                   </div>
                   <button 
                     onClick={() => setIsAnonymous(!isAnonymous)}
                     className={`w-12 h-6 rounded-full transition-all relative ${isAnonymous ? 'bg-lilac' : 'bg-slate-200'}`}
                   >
                     <motion.div 
                       animate={{ x: isAnonymous ? 24 : 4 }}
                       className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                     />
                   </button>
                </div>

                <button 
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim() || isSubmitting}
                  className="w-full py-5 bg-gradient-to-r from-soft-pink to-[#553C9A] text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 mt-4 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? <Plus className="animate-spin" /> : <Send size={18} />}
                  <span>{isSubmitting ? 'Mengirim Postingan...' : 'Kirim Postingan'}</span>
                </button>
                <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-tighter">Soci-AI Hub: Ruang Aman untuk Berdiskusi</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
