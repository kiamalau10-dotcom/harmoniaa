import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, User, Plus, FileText, FolderOpen, 
  X, ChevronLeft, ChevronRight, Maximize2,
  Heart, Trash2, Video, Music, Image as ImageIcon, Download, AlertTriangle, LayoutGrid, Loader2
} from 'lucide-react';
import { collection, query, onSnapshot, orderBy, addDoc, serverTimestamp, doc, updateDoc, arrayUnion, arrayRemove, increment, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { SharedWork, MediaFile } from '../types';

export default function ShareYours() {
  const { profile, logActivity } = useAuth();
  const [posts, setPosts] = useState<SharedWork[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  
  // State untuk Fullscreen Viewer
  const [fullscreenPost, setFullscreenPost] = useState<SharedWork | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState<{ [key: string]: number }>({});

  // State untuk Modal Konfirmasi Hapus
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch real-time posts
  useEffect(() => {
    const q = query(collection(db, 'sharedWorks'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const workList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SharedWork));
      setPosts(workList);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'sharedWorks'));
    return () => unsubscribe();
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024); // Limit 10MB for this demo URL approach
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const handlePost = async () => {
    if (!profile || !title.trim() || !content.trim()) return;

    setIsPosting(true);
    try {
      // Note: In a real app, we would upload to Firebase Storage. 
      // Here we use blob URLs for the current session demo or small assets.
      // For persistence across sessions, real storage is needed.
      const filesData: MediaFile[] = selectedFiles.map(file => ({
        name: file.name,
        type: file.type,
        size: formatFileSize(file.size),
        url: URL.createObjectURL(file) // temporary URL
      }));

      await addDoc(collection(db, 'sharedWorks'), {
        authorId: profile.uid,
        authorName: profile.username,
        authorAvatar: profile.avatar,
        title: title.trim(),
        content: content.trim(),
        files: filesData,
        likes: 0,
        likedBy: [],
        timestamp: serverTimestamp()
      });

      logActivity?.({
        type: 'action',
        path: '/share-yours',
        description: `Membagikan karya: ${title.trim()}`
      });

      setTitle(''); 
      setContent(''); 
      setSelectedFiles([]); 
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'sharedWorks');
    } finally {
      setIsPosting(false);
    }
  };

  const executeDelete = async () => {
    if (postToDelete && profile) {
      try {
        await deleteDoc(doc(db, 'sharedWorks', postToDelete));
        if (fullscreenPost?.id === postToDelete) setFullscreenPost(null);
        setPostToDelete(null);
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `sharedWorks/${postToDelete}`);
      }
    }
  };

  const handleLike = async (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!profile) return;
    
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const hasLiked = post.likedBy?.includes(profile.uid);
    try {
      await updateDoc(doc(db, 'sharedWorks', postId), {
        likedBy: hasLiked ? arrayRemove(profile.uid) : arrayUnion(profile.uid),
        likes: increment(hasLiked ? -1 : 1)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `sharedWorks/${postId}`);
    }
  };

  const nextMedia = (postId: string, max: number) => {
    setActiveMediaIndex(prev => ({ ...prev, [postId]: ((prev[postId] || 0) + 1) % max }));
  };

  const prevMedia = (postId: string, max: number) => {
    setActiveMediaIndex(prev => ({ ...prev, [postId]: ((prev[postId] || 0) - 1 + max) % max }));
  };

  const renderMediaContent = (file: MediaFile, isFullscreen = false) => {
    if (file.type.startsWith('image/')) {
      return <img src={file.url} alt={file.name} className="w-full h-full object-contain bg-black/5" referrerPolicy="no-referrer" />;
    } 
    if (file.type.startsWith('video/')) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-black">
          {isFullscreen ? (
            <video src={file.url} controls className="max-w-full max-h-full" />
          ) : (
            <>
              <Video size={48} className="text-white/50 mb-2" />
              <span className="text-white/50 text-xs font-bold px-4 text-center truncate w-full">{file.name}</span>
            </>
          )}
        </div>
      );
    }
    if (file.type.startsWith('audio/')) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 p-6">
          <Music size={64} className="text-indigo-400 mb-6 drop-shadow-md" />
          {isFullscreen ? (
            <audio src={file.url} controls className="w-full max-w-sm" />
          ) : (
            <p className="text-indigo-600 font-bold text-xs truncate max-w-full">{file.name}</p>
          )}
        </div>
      );
    }
    
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-500 p-6 text-center">
        <FileText size={72} className={`mb-4 ${file.type === 'application/pdf' ? 'text-red-400' : 'text-blue-400'}`} />
        <span className="text-lg font-black text-slate-700 truncate w-full max-w-md mb-1">{file.name}</span>
        <span className="text-sm font-bold text-slate-400 mb-6">{file.size}</span>
        
        {isFullscreen && (
          <a 
            href={file.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            download={file.name} 
            className={`px-8 py-4 text-white rounded-2xl font-black flex items-center gap-3 transition-transform active:scale-95 shadow-lg
              ${file.type === 'application/pdf' ? 'bg-red-500 hover:bg-red-600' : 'bg-[#2D5A9E] hover:bg-blue-700'}
            `}
          >
            <Download size={20} /> Download / Buka File
          </a>
        )}
      </div>
    );
  };

  const isFormIncomplete = !title.trim() || !content.trim();

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-12 bg-[#F0F7FF] min-h-screen font-sans text-slate-800">
      
      {/* HEADER UTAMA */}
      <header className="text-center space-y-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-block p-4 bg-[#FFEFB5] rounded-full text-[#B08900] shadow-sm">
          <Send size={32} />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-black text-[#2D5A9E] tracking-tight uppercase underline decoration-yellow-400 decoration-8 underline-offset-8">Berbagi Karya</h1>
        <p className="text-slate-500 font-bold mt-4">Tunjukkan kreativitasmu dalam membangun dunia yang lebih inklusif!</p>
      </header>

      {/* INPUT SECTION */}
      <div className="bg-white rounded-[3rem] shadow-2xl border-4 border-white p-6 md:p-10 space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 space-y-6">
          <input 
            type="text" placeholder="Apa judul karyamu?" value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-8 py-5 bg-slate-50 rounded-3xl border-4 border-transparent focus:border-baby-blue/30 outline-none font-black text-xl placeholder:text-slate-300 transition-all"
          />
          <textarea 
            placeholder="Tuliskan cerita singkat atau pesan di balik karyamu..." value={content}
            onChange={(e) => setContent(e.target.value)} rows={4}
            className="w-full px-8 py-5 bg-slate-50 rounded-3xl border-4 border-transparent focus:border-baby-blue/30 outline-none font-medium resize-none shadow-inner transition-all placeholder:text-slate-300"
          />

          <div className="space-y-4">
            <div onClick={() => fileInputRef.current?.click()} className="group border-4 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center bg-slate-50/50 hover:bg-baby-blue/5 hover:border-baby-blue/30 cursor-pointer transition-all">
              <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/*,audio/*,.pdf,.doc,.docx" />
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-slate-100 group-hover:scale-110 transition-transform">
                <Plus className="text-baby-blue" size={32} />
              </div>
              <p className="font-black text-slate-500 text-lg">Lampirkan Karya (Foto, Video, Musik, PDF)</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Maksimum 10MB per file</p>
            </div>

            {selectedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {selectedFiles.map((file, i) => (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    key={i} 
                    className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-full border-2 border-slate-100 shadow-sm"
                  >
                    {file.type.startsWith('image/') ? <ImageIcon size={14} className="text-blue-500"/> : 
                    file.type.startsWith('video/') ? <Video size={14} className="text-purple-500"/> : 
                    file.type.startsWith('audio/') ? <Music size={14} className="text-rose-500"/> : 
                    <FileText size={14} className="text-emerald-500"/>}
                    <span className="text-[10px] font-black text-slate-600 truncate max-w-[150px]">{file.name}</span>
                    <button onClick={() => setSelectedFiles(prev => prev.filter((_, idx) => idx !== i))} className="text-slate-300 hover:text-red-500 transition-colors"><X size={14}/></button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <button 
            type="button"
            onClick={handlePost} 
            disabled={isPosting || isFormIncomplete} 
            className="w-full py-6 bg-gradient-to-r from-baby-blue to-lilac text-white rounded-[2rem] font-black text-xl shadow-xl hover:shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isPosting ? <Loader2 className="animate-spin" /> : <Send size={24} />}
            <span>{isPosting ? 'Mengunggah Karya...' : isFormIncomplete ? 'Lengkapi Judul & Cerita' : 'Bagikan Karya Sekarang!'}</span>
          </button>
        </div>
      </div>

      {/* GRID POSTINGAN */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <AnimatePresence mode="popLayout">
          {posts.map((post) => {
            const hasFiles = post.files && post.files.length > 0;

            return (
              <motion.div
                key={post.id} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.5 }}
                className="bg-white rounded-[3rem] border-4 border-white shadow-2xl overflow-hidden flex flex-col group cursor-pointer hover:-translate-y-2 transition-all duration-500"
                onClick={() => setFullscreenPost(post)}
              >
                {/* Preview Thumbnail Area */}
                <div className="relative h-72 bg-slate-50 overflow-hidden group/img">
                  {hasFiles ? (
                    <>
                      {renderMediaContent(post.files[0], false)}
                      {post.files.length > 1 && (
                        <div className="absolute top-4 right-4 bg-black/60 text-white text-[10px] font-black px-4 py-2 rounded-full backdrop-blur-md shadow-lg flex items-center gap-2 border border-white/20">
                          <LayoutGrid size={12} /> +{post.files.length - 1} Koleksi
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover/img:opacity-100">
                         <div className="p-4 bg-white rounded-2xl shadow-2xl text-slate-800 scale-90 group-hover/img:scale-100 transition-transform">
                            <Maximize2 size={24} />
                         </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-200 bg-gradient-to-b from-slate-50 to-white">
                      <FileText size={48} />
                      <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-slate-300">Tulisan Kreatif</p>
                    </div>
                  )}
                </div>

                {/* Content Area */}
                <div className="p-8 space-y-4 flex-grow border-t-2 border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-2xl overflow-hidden border-2 border-white shadow-sm shrink-0">
                       <img src={post.authorAvatar} alt="avatar" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-black text-slate-500 truncate">{post.authorName}</span>
                    <span className="h-1 w-1 bg-slate-300 rounded-full" />
                    <span className="text-[10px] font-bold text-slate-300">{post.timestamp?.toDate?.().toLocaleDateString() || 'Baru'}</span>
                  </div>
                  <h3 className="text-2xl font-black text-text-primary leading-tight group-hover:text-baby-blue transition-colors">{post.title}</h3>
                  <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed font-medium italic">"{post.content}"</p>
                </div>

                {/* Bottom Bar */}
                <div className="px-8 py-5 bg-slate-50/50 flex items-center justify-between border-t border-slate-100">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={(e) => handleLike(post.id, e)}
                      className={`flex items-center gap-2 font-black text-xs px-4 py-2 rounded-2xl transition-all shadow-sm ${post.likedBy?.includes(profile?.uid || '') ? 'bg-red-500 text-white shadow-red-200' : 'bg-white text-slate-400 hover:text-red-500 hover:border-red-100'}`}
                    >
                      <Heart size={16} fill={post.likedBy?.includes(profile?.uid || '') ? "currentColor" : "none"} /> {post.likes || 0}
                    </button>
                  </div>
                  {profile && (profile.uid === post.authorId || profile.role === 'admin') && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setPostToDelete(post.id); }} 
                      className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                      title="Hapus"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* FULLSCREEN / FLOATING CARD VIEWER */}
      <AnimatePresence>
        {fullscreenPost && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-3xl flex items-center justify-center p-4 md:p-10"
            onClick={() => setFullscreenPost(null)} 
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[3.5rem] overflow-hidden w-full max-w-7xl h-[90vh] flex flex-col md:flex-row shadow-2xl relative border-4 border-white"
            >
              {/* KIRI: Area Media (65%) */}
              <div className="w-full md:w-[65%] bg-slate-900 relative flex items-center justify-center h-[50vh] md:h-full">
                {fullscreenPost.files && fullscreenPost.files.length > 0 ? (
                  <>
                    {renderMediaContent(fullscreenPost.files[activeMediaIndex[fullscreenPost.id] || 0], true)}

                    {fullscreenPost.files.length > 1 && (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); prevMedia(fullscreenPost.id, fullscreenPost.files.length); }} className="absolute left-6 p-4 bg-white/10 hover:bg-white/20 text-white rounded-3xl backdrop-blur-md transition-all border border-white/20"><ChevronLeft size={32}/></button>
                        <button onClick={(e) => { e.stopPropagation(); nextMedia(fullscreenPost.id, fullscreenPost.files.length); }} className="absolute right-6 p-4 bg-white/10 hover:bg-white/20 text-white rounded-3xl backdrop-blur-md transition-all border border-white/20"><ChevronRight size={32}/></button>
                        
                        <div className="absolute bottom-8 flex gap-2 justify-center w-full">
                          {fullscreenPost.files.map((_, idx) => (
                            <div key={idx} className={`h-2 rounded-full transition-all duration-300 ${idx === (activeMediaIndex[fullscreenPost.id] || 0) ? 'w-8 bg-baby-blue shadow-lg' : 'w-2 bg-white/30'}`} />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                   <div className="flex flex-col items-center justify-center text-slate-500 bg-slate-950 w-full h-full">
                     <FileText size={80} className="text-slate-800 mb-6" />
                     <p className="font-black text-xl tracking-widest uppercase opacity-20">No Media Files</p>
                   </div>
                )}

                 <button 
                  onClick={() => setFullscreenPost(null)} 
                  className="absolute top-6 right-6 p-4 bg-white/10 hover:bg-white/20 text-white rounded-3xl backdrop-blur-md transition-all border border-white/20"
                >
                  <X size={32}/>
                </button>
              </div>

              {/* KANAN: Detail & Interaksi (35%) */}
              <div className="w-full md:w-[35%] flex flex-col bg-white h-auto md:h-full overflow-y-auto hide-scrollbar">
                
                <div className="p-8 border-b-2 border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10 backdrop-blur-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white shadow-xl ring-4 ring-baby-blue/10">
                       <img src={fullscreenPost.authorAvatar} alt="avatar" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-black text-text-primary text-base leading-tight">{fullscreenPost.authorName}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{fullscreenPost.timestamp?.toDate?.().toLocaleString() || 'Baru'}</p>
                    </div>
                  </div>
                </div>

                <div className="p-10 space-y-10 flex-grow">
                  <div>
                    <h2 className="text-4xl font-black text-text-primary leading-tight mb-6 underline decoration-baby-blue decoration-6 underline-offset-4">{fullscreenPost.title}</h2>
                    <p className="text-lg text-slate-600 font-medium leading-relaxed italic border-l-4 border-slate-100 pl-6 py-2 whitespace-pre-wrap">
                      "{fullscreenPost.content}"
                    </p>
                  </div>
                  
                  {fullscreenPost.files && fullscreenPost.files.length > 0 && (
                    <div className="space-y-4 pt-10 border-t-2 border-slate-50">
                      <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em]">Module Assets ({fullscreenPost.files.length})</p>
                      <div className="grid grid-cols-1 gap-3">
                        {fullscreenPost.files.map((f, i) => (
                          <div key={i} onClick={() => setActiveMediaIndex(prev => ({...prev, [fullscreenPost.id]: i}))} className={`p-4 rounded-3xl border-2 flex items-center gap-4 cursor-pointer transition-all ${i === (activeMediaIndex[fullscreenPost.id] || 0) ? 'bg-baby-blue border-baby-blue text-white shadow-xl translate-x-2' : 'bg-white border-slate-50 hover:bg-slate-50'}`}>
                             <div className={`p-3 rounded-2xl shadow-sm ${i === (activeMediaIndex[fullscreenPost.id] || 0) ? 'bg-white/20' : 'bg-slate-50 text-slate-400'}`}>
                               {f.type.startsWith('image') ? <ImageIcon size={18}/> : f.type.startsWith('video') ? <Video size={18}/> : f.type.startsWith('audio') ? <Music size={18}/> : <FileText size={18}/>}
                             </div>
                             <div className="overflow-hidden">
                               <p className="text-xs font-black truncate">{f.name}</p>
                               <p className={`text-[10px] font-bold ${i === (activeMediaIndex[fullscreenPost.id] || 0) ? 'text-white/70' : 'text-slate-400'}`}>{f.size}</p>
                             </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-10 border-t-2 border-slate-50 bg-white sticky bottom-0">
                  <button 
                    onClick={() => handleLike(fullscreenPost.id)} 
                    className={`w-full py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-4 transition-all active:scale-95 shadow-2xl ${
                      fullscreenPost.likedBy?.includes(profile?.uid || '') ? 'bg-red-500 text-white shadow-red-200' : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    <Heart size={28} fill={fullscreenPost.likedBy?.includes(profile?.uid || '') ? "currentColor" : "none"} /> 
                    <span>{fullscreenPost.likes || 0} Likes</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL KONFIRMASI HAPUS */}
      <AnimatePresence>
        {postToDelete !== null && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[200] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setPostToDelete(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[3.5rem] p-10 max-w-sm w-full shadow-2xl text-center space-y-8 border-4 border-white"
            >
              <div className="w-24 h-24 bg-red-50 rounded-3xl flex items-center justify-center mx-auto text-red-500 shadow-xl shadow-red-100/50">
                <Trash2 size={48} />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-text-primary underline decoration-red-500 decoration-4 underline-offset-4">Hapus Karya?</h3>
                <p className="text-slate-400 font-bold text-sm leading-relaxed px-4">
                  Karya ini akan dihapus permanen dari galeri Socio-AI Hub.
                </p>
              </div>
              <div className="flex gap-4">
                <button 
                   onClick={() => setPostToDelete(null)} 
                   className="flex-1 py-5 bg-slate-50 text-slate-500 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button 
                  onClick={executeDelete} 
                  className="flex-1 py-5 bg-red-500 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-200 hover:bg-red-600 transition-all active:scale-95"
                >
                  Ya, Hapus
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STATE KOSONG */}
      {posts.length === 0 && (
        <div className="py-40 text-center bg-white rounded-[4rem] border-8 border-dashed border-white shadow-2xl">
           <div className="bg-slate-50 w-32 h-32 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-inner group">
              <FolderOpen size={64} className="text-slate-200 group-hover:text-baby-blue transition-colors duration-500" />
           </div>
           <p className="text-text-primary font-black text-3xl tracking-tight">Galeri Karya Masih Kosong</p>
           <p className="text-slate-400 font-bold mt-2 uppercase tracking-widest text-[10px]">Jadilah inspirasi pertama bagi yang lain!</p>
           <motion.button 
             whileHover={{ scale: 1.05 }}
             animate={{ y: [0, -10, 0] }}
             transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
             onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
             className="mt-10 px-10 py-5 bg-baby-blue text-white rounded-full font-black text-xs uppercase tracking-widest shadow-xl"
           >
              Mulai Berkarya <Plus size={16} className="inline ml-1" />
           </motion.button>
        </div>
      )}
    </div>
  );
}
