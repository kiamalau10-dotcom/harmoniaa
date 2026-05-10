import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { LogIn, User, Lock, AlertCircle, ArrowRight, Eye, EyeOff, UserCircle } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login gagal. Cek username dan password anda.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      // Small trick: we can have a guest account or just a shared one
      // For this app, let's just use 'guest' / '123456'
      await login('guest', '123456');
      navigate(from, { replace: true });
    } catch (err) {
      // If guest doesn't exist, try to login as 'admin' / '123456' as fallback for demo
      try {
        await login('admin', '123456');
        navigate(from, { replace: true });
      } catch (e) {
        setError('Maaf, login guest belum tersedia. Silakan daftar akun baru.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 pt-12 bg-white rounded-[3rem] border-4 border-sidebar-border shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-baby-blue via-soft-pink to-lilac" />
      
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-baby-blue rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg text-4xl">
          🦊
        </div>
        <h2 className="text-3xl font-black text-text-primary tracking-tight">Selamat Datang!</h2>
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">Masuk ke Socio Learning Hub</p>
      </div>

      {from !== "/" && (
        <div className="mb-6 p-4 bg-blue-50 text-blue-600 rounded-2xl flex items-center gap-3 border-2 border-blue-100 italic">
          <LogIn size={20} />
          <p className="text-xs font-bold">Silakan login untuk mengakses halaman yang kamu tuju.</p>
        </div>
      )}

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

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Username</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username anda"
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
              placeholder="••••••"
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
          className="w-full py-4 bg-[#553C9A] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {loading ? 'Processing...' : (
            <>Masuk Sekarang <ArrowRight size={18} /></>
          )}
        </button>

        <button 
          type="button"
          onClick={handleGuestLogin}
          disabled={loading}
          className="w-full py-4 bg-white text-slate-600 rounded-2xl font-black text-sm uppercase tracking-widest border-2 border-slate-100 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
        >
          <UserCircle size={18} /> Masuk sebagai Tamu
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-slate-400 font-bold text-xs">Belum punya akun?</p>
        <Link to="/register" className="text-baby-blue font-black text-sm hover:underline mt-1 inline-block">
          Daftar Akun Baru
        </Link>
      </div>
    </div>
  );
}
