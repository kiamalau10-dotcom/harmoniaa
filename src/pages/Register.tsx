import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { User, Mail, Lock, AlertCircle, ArrowRight, Check, Eye, EyeOff } from 'lucide-react';

const AVATARS = [
  { id: 'Bunny', emoji: '🐰' },
  { id: 'Cat', emoji: '🐱' },
  { id: 'Dog', emoji: '🐶' },
  { id: 'Fox', emoji: '🦊' },
  { id: 'Panda', emoji: '🐼' },
  { id: 'Koala', emoji: '🐨' },
  { id: 'Tiger', emoji: '🐯' },
  { id: 'Lion', emoji: '🦁' },
];

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0].id);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${selectedAvatar}`;
    // Generate internal email from username
    const internalEmail = `${username.toLowerCase().replace(/\s/g, '')}@socio.app`;
    
    try {
      await register(username, internalEmail, password, avatarUrl);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Pendaftaran gagal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 mb-10 p-8 pt-12 bg-white rounded-[3rem] border-4 border-sidebar-border shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-baby-blue via-soft-pink to-lilac" />
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-text-primary tracking-tight">Daftar Akun</h2>
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">Bergabung dengan Komunitas Kami</p>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 border-2 border-red-100"
        >
          <AlertCircle size={20} />
          <p className="text-xs font-bold">{error}</p>
        </motion.div>
      )}

      <form onSubmit={handleRegister} className="space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Pilih Avatar Hewan Lucu</label>
          <div className="grid grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
            {AVATARS.map((av) => (
              <button
                key={av.id}
                type="button"
                onClick={() => setSelectedAvatar(av.id)}
                className={`relative aspect-square flex items-center justify-center text-2xl rounded-xl transition-all ${
                  selectedAvatar === av.id ? 'bg-white shadow-md scale-110 border-2 border-baby-blue' : 'hover:bg-white/50'
                }`}
              >
                {av.emoji}
                {selectedAvatar === av.id && (
                  <div className="absolute -top-1 -right-1 bg-baby-blue text-white rounded-full p-0.5 shadow-sm">
                    <Check size={8} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Username</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username kamu"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-baby-blue focus:bg-white outline-none transition-all font-bold text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 karakter"
              className="w-full pl-12 pr-12 py-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-baby-blue focus:bg-white outline-none transition-all font-bold text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-baby-blue transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full py-4 bg-baby-blue text-blue-700 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
        >
          {loading ? 'Mendaftarkan...' : (
            <>Buat Akun Sekarang <ArrowRight size={18} /></>
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-slate-400 font-bold text-xs">Sudah punya akun?</p>
        <Link to="/login" className="text-[#553C9A] font-black text-sm hover:underline mt-1 inline-block">
          Masuk ke Akun
        </Link>
      </div>
    </div>
  );
}
