import React, { useState, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, User, Plus, FileText, FolderOpen, 
  X, ChevronLeft, ChevronRight, Maximize2,
  Heart, Trash2, Video, Music, Image as ImageIcon, Download, AlertTriangle, LayoutGrid
} from 'lucide-react';

interface PostFile {
  name: string;
  type: string;
  size: string;
  url: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  time: string;
  likes: number;
  isLiked: boolean;
  files: PostFile[];
}

export default function ShareYours() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  
  // State untuk Fullscreen Viewer
  const [fullscreenPost, setFullscreenPost] = useState<Post | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState<{ [key: number]: number }>({});

  // State untuk Modal Konfirmasi Hapus
  const [postToDelete, setPostToDelete] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    const validFiles = files.filter(file => file.size <= 50 * 1024 * 1024); // Max 50MB
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const handlePost = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Judul dan deskripsi wajib diisi!");
      return;
    }

    try {
      setIsPosting(true);
      await new Promise(resolve => setTimeout(resolve, 800));

      const newPost: Post = {
        id: Date.now(),
        title: title.trim(),
        content: content.trim(),
        author: "Siswa Kreatif",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        likes: 0,
        isLiked: false,
        files: selectedFiles.map(file => ({
          name: file.name,
          type: file.type,
          size: formatFileSize(file.size),
          url: URL.createObjectURL(file) 
        }))
      };

      setPosts(prev => [newPost, ...prev]);
      setTitle(''); setContent(''); setSelectedFiles([]); 
    } catch (error) {
      console.error("Gagal memposting:", error);
    } finally {
      setIsPosting(false);
    }
  };

  // --- FITUR HAPUS YANG SUDAH DIAKTIFKAN (CUSTOM MODAL) ---
  const confirmDelete = (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); // Mencegah modal fullscreen terbuka saat klik icon hapus
    setPostToDelete(id);
  };

  const executeDelete = () => {
    if (postToDelete !== null) {
      setPosts(currentPosts => currentPosts.filter(post => post.id !== postToDelete));
      
      // Jika yang dihapus sedang dibuka di Fullscreen, tutup juga
      if (fullscreenPost?.id === postToDelete) {
        setFullscreenPost(null);
      }
      
      // Bersihkan index media dari memory
      setActiveMediaIndex(prev => {
        const newState = { ...prev };
        delete newState[postToDelete];
        return newState;
      });

      setPostToDelete(null); // Tutup modal konfirmasi
    }
  };

  const handleLike = (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    setPosts(prev => prev.map(post => {
      if (post.id === id) {
        return { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked };
      }
      return post;
    }));
    
    if (fullscreenPost && fullscreenPost.id === id) {
      setFullscreenPost(prev => prev ? { ...prev, likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1, isLiked: !prev.isLiked } : null);
    }
  };

  const nextMedia = (postId: number, max: number) => {
    setActiveMediaIndex(prev => ({ ...prev, [postId]: ((prev[postId] || 0) + 1) % max }));
  };

  const prevMedia = (postId: number, max: number) => {
    setActiveMediaIndex(prev => ({ ...prev, [postId]: ((prev[postId] || 0) - 1 + max) % max }));
  };

  // --- RENDER MEDIA CONTENT ---
  const renderMediaContent = (file: PostFile, isFullscreen = false) => {
    if (file.type.startsWith('image/')) {
      return <img src={file.url} alt={file.name} className="w-full h-full object-contain bg-black/5" />;
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
        <h1 className="text-4xl md:text-5xl font-black text-[#2D5A9E] tracking-tight uppercase">Humanity and Diversity</h1>
        <p className="text-slate-500 font-medium italic">Bagikan perspektifmu tentang keberagaman dan kemanusiaan.</p>
      </header>

      {/* INPUT SECTION */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-100 border-4 border-[#FFEFB5] p-6 md:p-10 space-y-6">
        <input 
          type="text" placeholder="Apa judul karyamu?" value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-6 py-4 bg-[#FDFCF0] rounded-2xl border-2 border-transparent focus:border-[#FFEFB5] outline-none font-bold text-lg"
        />
        <textarea 
          placeholder="Tuliskan cerita singkat atau pesanmu..." value={content}
          onChange={(e) => setContent(e.target.value)} rows={3}
          className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#B5D8FF] outline-none font-medium resize-none shadow-inner"
        />

        <div className="space-y-4">
          <div onClick={() => fileInputRef.current?.click()} className="border-4 border-dashed border-[#B5D8FF] rounded-3xl p-8 text-center bg-[#F8FBFF] hover:bg-[#F0F7FF] cursor-pointer transition-all group">
            <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/*,audio/*,.pdf,.doc,.docx" />
            <Plus className="mx-auto mb-2 text-[#2D5A9E] group-hover:rotate-90 transition-transform" />
            <p className="font-black text-[#2D5A9E]">Upload Foto, Video, Musik, atau Dokumen</p>
          </div>

          {selectedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedFiles.map((file, i) => (
                <div key={i} className="flex items-center gap-2 bg-[#FFEFB5] px-4 py-2 rounded-xl border border-[#FFE485]">
                  {file.type.startsWith('image/') ? <ImageIcon size={14} className="text-[#B08900]"/> : 
                   file.type.startsWith('video/') ? <Video size={14} className="text-[#B08900]"/> : 
                   file.type.startsWith('audio/') ? <Music size={14} className="text-[#B08900]"/> : 
                   <FileText size={14} className="text-[#B08900]"/>}
                  <span className="text-xs font-bold truncate max-w-[150px]">{file.name}</span>
                  <button onClick={() => setSelectedFiles(prev => prev.filter((_, idx) => idx !== i))} className="text-red-500 hover:scale-125 transition-transform"><X size={14}/></button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button 
          type="button"
          onClick={handlePost} 
          disabled={isPosting || isFormIncomplete} 
          className="w-full py-5 bg-[#2D5A9E] text-white rounded-2xl font-black text-lg shadow-lg hover:shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 hover:-translate-y-1"
        >
          {isPosting ? 'Sedang Diproses...' : isFormIncomplete ? 'Isi Judul & Cerita untuk Memposting' : 'Post Sekarang!'}
        </button>
      </div>

      {/* GRID POSTINGAN */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {posts.map((post) => {
            const currentIdx = activeMediaIndex[post.id] || 0;
            const hasFiles = post.files.length > 0;

            return (
              <motion.div
                key={post.id} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.5 }}
                className="bg-white rounded-[2.5rem] border-4 border-white shadow-xl shadow-blue-100 overflow-hidden flex flex-col group cursor-pointer hover:-translate-y-2 transition-transform duration-300"
                onClick={() => setFullscreenPost(post)}
              >
                {/* Preview Thumbnail Area */}
                <div className="relative h-64 bg-[#F8FBFF] overflow-hidden group/img">
                  {hasFiles ? (
                    <>
                      {renderMediaContent(post.files[0], false)}
                      {post.files.length > 1 && (
                        <div className="absolute top-4 right-4 bg-black/60 text-white text-[10px] font-black px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm flex items-center gap-1">
                          <LayoutGrid size={12} /> 1/{post.files.length}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-blue-200 bg-gradient-to-b from-[#F0F7FF] to-white">
                      <FileText size={48} />
                      <p className="mt-2 text-xs font-bold text-blue-300">Teks Saja</p>
                    </div>
                  )}
                </div>

                {/* Content Area */}
                <div className="p-6 space-y-3 flex-grow border-t border-slate-50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-[#FFEFB5] flex items-center justify-center text-[#B08900]"><User size={12}/></div>
                    <span className="text-xs font-black text-slate-700 truncate">{post.author}</span>
                  </div>
                  <h3 className="text-xl font-black text-[#2D5A9E] leading-tight">{post.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">"{post.content}"</p>
                </div>

                {/* Bottom Bar */}
                <div className="px-6 py-4 bg-[#F8FBFF] flex items-center justify-between border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400">{post.time}</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => confirmDelete(post.id, e)} 
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button 
                      onClick={(e) => handleLike(post.id, e)}
                      className="flex items-center gap-1 text-red-500 font-black text-sm bg-red-50 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors"
                    >
                      <Heart size={14} fill={post.isLiked ? "currentColor" : "none"} /> {post.likes}
                    </button>
                  </div>
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
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
            onClick={() => setFullscreenPost(null)} 
          >
            <button 
              onClick={() => setFullscreenPost(null)} 
              className="absolute top-4 right-4 md:top-8 md:right-8 z-50 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur transition-colors"
              title="Tutup"
            >
              <X size={24}/>
            </button>

            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl overflow-hidden w-full max-w-6xl max-h-[90vh] flex flex-col md:flex-row shadow-2xl relative"
            >
              {/* KIRI: Area Media (60%) */}
              <div className="w-full md:w-[60%] lg:w-[65%] bg-black relative flex items-center justify-center min-h-[40vh] md:min-h-0">
                {fullscreenPost.files.length > 0 ? (
                  <>
                    {renderMediaContent(fullscreenPost.files[activeMediaIndex[fullscreenPost.id] || 0], true)}

                    {fullscreenPost.files.length > 1 && (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); prevMedia(fullscreenPost.id, fullscreenPost.files.length); }} className="absolute left-4 p-2 bg-white/80 hover:bg-white text-black rounded-full shadow-lg transition-all"><ChevronLeft size={24}/></button>
                        <button onClick={(e) => { e.stopPropagation(); nextMedia(fullscreenPost.id, fullscreenPost.files.length); }} className="absolute right-4 p-2 bg-white/80 hover:bg-white text-black rounded-full shadow-lg transition-all"><ChevronRight size={24}/></button>
                        
                        <div className="absolute bottom-4 flex gap-1.5 justify-center w-full">
                          {fullscreenPost.files.map((_, idx) => (
                            <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === (activeMediaIndex[fullscreenPost.id] || 0) ? 'w-4 bg-white shadow-md' : 'w-1.5 bg-white/50'}`} />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                   <div className="flex flex-col items-center justify-center text-slate-500 bg-slate-50 w-full h-full">
                     <FileText size={64} className="text-slate-300 mb-4" />
                     <p className="font-bold">Tidak ada lampiran media</p>
                   </div>
                )}
              </div>

              {/* KANAN: Detail & Interaksi (40%) */}
              <div className="w-full md:w-[40%] lg:w-[35%] flex flex-col bg-white h-auto md:h-[90vh] max-h-[50vh] md:max-h-full">
                
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FFEFB5] to-[#B5D8FF] flex items-center justify-center border-2 border-white shadow-sm">
                      <User size={18} className="text-[#2D5A9E]" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 text-sm leading-tight">{fullscreenPost.author}</h4>
                      <p className="text-[10px] font-bold text-slate-400">{fullscreenPost.time}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => confirmDelete(fullscreenPost.id)} 
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors flex items-center gap-1 px-3" 
                    title="Hapus Karya"
                  >
                    <Trash2 size={16} />
                    <span className="text-xs font-bold hidden sm:inline">Hapus</span>
                  </button>
                </div>

                <div className="p-6 flex-grow overflow-y-auto custom-scrollbar">
                  <h2 className="text-2xl font-black text-[#2D5A9E] mb-4">{fullscreenPost.title}</h2>
                  <p className="text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
                    {fullscreenPost.content}
                  </p>
                  
                  {fullscreenPost.files.length > 0 && (
                    <div className="mt-8 space-y-2">
                      <p className="text-[10px] font-black uppercase text-slate-400">Daftar Lampiran ({fullscreenPost.files.length})</p>
                      {fullscreenPost.files.map((f, i) => (
                        <div key={i} onClick={() => setActiveMediaIndex(prev => ({...prev, [fullscreenPost.id]: i}))} className={`p-2 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${i === (activeMediaIndex[fullscreenPost.id] || 0) ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-100 hover:bg-slate-50'}`}>
                           <div className="p-2 bg-white rounded-lg shadow-sm text-slate-500">
                             {f.type.startsWith('image') ? <ImageIcon size={14}/> : f.type.startsWith('video') ? <Video size={14}/> : f.type.startsWith('audio') ? <Music size={14}/> : <FileText size={14}/>}
                           </div>
                           <div className="overflow-hidden">
                             <p className={`text-xs font-bold truncate ${i === (activeMediaIndex[fullscreenPost.id] || 0) ? 'text-blue-700' : 'text-slate-600'}`}>{f.name}</p>
                             <p className="text-[9px] font-bold text-slate-400">{f.size}</p>
                           </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-slate-100 bg-white">
                  <button 
                    onClick={() => handleLike(fullscreenPost.id)} 
                    className={`w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-95 ${
                      fullscreenPost.isLiked ? 'bg-red-500 text-white shadow-lg shadow-red-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    <Heart size={24} className={fullscreenPost.isLiked ? "fill-white" : ""} /> 
                    {fullscreenPost.likes} {fullscreenPost.likes === 1 ? 'Suka' : 'Suka'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL KONFIRMASI HAPUS (CUSTOM MODAL) */}
      <AnimatePresence>
        {postToDelete !== null && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setPostToDelete(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl text-center space-y-6"
            >
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-500">
                <AlertTriangle size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800">Hapus Karya?</h3>
                <p className="text-slate-500 font-medium mt-2 leading-relaxed">
                  Karya ini akan dihapus secara permanen dan tidak dapat dikembalikan lagi.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setPostToDelete(null)} 
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Batal
                </button>
                <button 
                  onClick={executeDelete} 
                  className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black shadow-lg shadow-red-200 hover:bg-red-600 active:scale-95 transition-all"
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
        <div className="py-32 text-center bg-white/50 rounded-[4rem] border-4 border-dashed border-blue-100">
           <div className="bg-white w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-50">
              <FolderOpen size={48} className="text-[#B5D8FF]" />
           </div>
           <p className="text-[#2D5A9E] font-black text-2xl">Belum ada karya yang dibagikan</p>
           <p className="text-slate-400 font-medium mt-2">Jadilah yang pertama untuk berbagi perspektifmu!</p>
        </div>
      )}
    </div>
  );
}