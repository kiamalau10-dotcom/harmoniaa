/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home as HomeIcon, 
  LayoutDashboard, 
  BookOpen, 
  Gamepad2, 
  Users, 
  Search, 
  Trophy, 
  CheckCircle,
  PlayCircle,
  Lightbulb,
  Info,
  Menu,
  X,
  Bell,
  Heart,
  LayoutGrid,
  Send,
  ShieldCheck
} from 'lucide-react';

// Components (We will create these)
import HomePage from './pages/Home';
import DashboardPage from './pages/Dashboard';
import MateriPage from './pages/Materi';
import GamePage from './pages/Game';
import DiscussionPage from './pages/Discussion';
import QuizPage from './pages/Quiz';
import MazeGamePage from './pages/MazeLabLGame';
import StudyRoomPage from './pages/StudyRoom';
import ShareYoursPage from './pages/ShareYours';
import AvatarStorePage from './pages/AvatarStore';
import AboutPage from './pages/About';
import ChallengePage from './pages/Challenge';
import EduCasePage from './pages/EduCase';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { DAILY_TIPS, SOCI_AVATAR, HARMO_AVATAR } from './constants';
import { LogOut, LogIn } from 'lucide-react';
import { SociIcon, HarmoIcon } from './components/Mascots';

const AvatarRenderer = ({ url, className = "w-full h-full object-cover" }: { url: string, className?: string }) => {
  if (url === SOCI_AVATAR) return <div className={`bg-cream p-1 ${className}`}><SociIcon /></div>;
  if (url === HARMO_AVATAR) return <div className={`bg-cream p-1 ${className}`}><HarmoIcon /></div>;
  return <img src={url} alt="avatar" className={className} />;
};

const NavItem = ({ to, icon: Icon, label, active, onClick }: any) => (
  <Link 
    to={to} 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-bold ${
      active 
        ? 'bg-baby-blue text-[#2B6CB0] shadow-sm' 
        : 'text-text-primary hover:bg-soft-pink/30 hover:shadow-sm'
    }`}
  >
    <Icon size={20} />
    <span className="text-sm">{label}</span>
  </Link>
);

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [dailyTip, setDailyTip] = useState(DAILY_TIPS[0]);
  const { profile, logout, isOffline, user } = useAuth();

  useEffect(() => {
    const randomTip = DAILY_TIPS[Math.floor(Math.random() * DAILY_TIPS.length)];
    setDailyTip(randomTip);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-cream font-sans p-6 gap-6 flex-col">
      {/* Offline Banner */}
      <AnimatePresence>
        {isOffline && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="w-full bg-red-500 text-white py-2 px-4 rounded-2xl flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest shadow-lg z-[100]"
          >
            <Bell size={18} className="animate-bounce" />
            Mode Offline: Koneksi Terputus. Beberapa fitur mungkin tidak sinkron.
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-1 gap-6 w-full relative">
        {/* Mobile Toggle */}
      <button 
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-md lg:hidden border-2 border-sidebar-border"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-6 z-40 w-64 bg-sidebar-bg rounded-4xl p-6 flex flex-col border-4 border-sidebar-border card-shadow transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-[calc(100%+24px)]'}
      `}>
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-baby-blue rounded-full flex items-center justify-center border-2 border-white text-xl shadow-sm">
            🕊️
          </div>
          <h1 className="text-xl font-display font-bold text-text-primary leading-tight">
            Harmoni<br />Sosial
          </h1>
        </div>

        <nav className="flex flex-col gap-2 flex-grow">
          <NavItem to="/" icon={HomeIcon} label="Home" active={location.pathname === '/'} onClick={() => setSidebarOpen(false)} />
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/dashboard'} onClick={() => setSidebarOpen(false)} />
          <NavItem to="/materi" icon={BookOpen} label="Materi" active={location.pathname === '/materi'} onClick={() => setSidebarOpen(false)} />
          <NavItem to="/game" icon={Gamepad2} label="Story Game" active={location.pathname === '/game'} onClick={() => setSidebarOpen(false)} />
          <NavItem to="/maze" icon={LayoutGrid} label="Maze Labirin" active={location.pathname === '/maze'} onClick={() => setSidebarOpen(false)} />
          <NavItem to="/study-room" icon={Users} label="Study Room" active={location.pathname === '/study-room'} onClick={() => setSidebarOpen(false)} />
          <NavItem to="/quiz" icon={Trophy} label="Quiz Battle" active={location.pathname === '/quiz'} onClick={() => setSidebarOpen(false)} />
          <NavItem to="/avatars" icon={Users} label="Avatar Store" active={location.pathname === '/avatars'} onClick={() => setSidebarOpen(false)} />
          <NavItem to="/share-yours" icon={Send} label="Share Yours" active={location.pathname === '/share-yours'} onClick={() => setSidebarOpen(false)} />
          {profile?.role === 'admin' && (
            <NavItem to="/admin" icon={ShieldCheck} label="Admin Panel" active={location.pathname === '/admin'} onClick={() => setSidebarOpen(false)} />
          )}
        </nav>

        <div className="mt-6 p-4 rounded-3xl bg-white border-2 border-sidebar-border group relative">
          {(user || profile) ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-xl overflow-hidden border-2 border-slate-100 flex items-center justify-center shadow-sm">
                  {profile ? (
                    <AvatarRenderer url={profile.avatar} />
                  ) : (
                    <Users size={20} className="text-slate-300" />
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  {profile ? (
                    <>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Level {profile.level || 1}</p>
                      <p className="text-sm font-black text-text-primary leading-none truncate">{profile.username}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1 bg-yellow-100 px-1.5 py-0.5 rounded-lg border border-yellow-200">
                          <span className="text-[10px] font-black text-yellow-700">💰 {profile.coins || 0}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-orange-100 px-1.5 py-0.5 rounded-lg border border-orange-200">
                          <span className="text-[10px] font-black text-orange-700">🔥 {profile.loginStreak || 0}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-black text-text-primary leading-none truncate">Setting up...</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1">Please wait</p>
                    </>
                  )}
                </div>
              </div>
              <button 
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 py-2 bg-red-50 text-red-500 rounded-xl font-bold text-xs hover:bg-red-100 transition-all"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/login"
              className="w-full flex items-center justify-center gap-2 py-3 bg-baby-blue text-blue-700 rounded-2xl font-bold text-sm hover:brightness-105 transition-all shadow-sm"
              onClick={() => setSidebarOpen(false)}
            >
              <LogIn size={18} /> Login to Start
            </Link>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-6 lg:max-w-[calc(100vw-16rem-48px)] min-h-full">
        <header className="h-44 bg-gradient-to-r from-baby-blue to-lilac rounded-4xl p-8 flex items-center justify-between relative overflow-hidden border-4 border-white card-shadow">
          <div className="z-10">
            <h2 className="text-4xl font-display font-black text-[#2D3748] mb-1">Soci & Harmo Hub</h2>
            <p className="text-[#4A5568] font-medium">Harmoni Sosial dimulai dari pilihan cerdasmu hari ini!</p>
            <Link to="/materi" className="inline-block mt-4 bg-white text-[#553C9A] px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest shadow-lg hover:scale-105 transition-transform">
              Mulai Belajar
            </Link>
          </div>
          
          <div className="absolute right-10 bottom-0 flex items-end gap-3 z-20">
            <motion.div 
               whileHover={{ y: -10 }}
               className="bg-white p-2 pb-0 rounded-t-3xl border-x-4 border-t-4 border-baby-blue text-center transform translate-y-1 shadow-xl hover:z-30 transition-all"
            >
              <div className="w-16 h-20 bg-cream rounded-t-2xl overflow-hidden border-b-2 border-slate-100 p-1">
                <SociIcon />
              </div>
              <p className="text-[10px] font-black text-baby-blue py-1 uppercase">Soci</p>
            </motion.div>
            <motion.div 
               whileHover={{ y: -10 }}
               className="bg-white p-3 pb-0 rounded-t-4xl border-x-4 border-t-4 border-soft-pink text-center shadow-2xl hover:z-30 transition-all"
            >
              <div className="w-20 h-24 bg-cream rounded-t-3xl overflow-hidden border-b-2 border-slate-100 p-1">
                <HarmoIcon />
              </div>
              <p className="text-[10px] font-black text-soft-pink py-1 uppercase">Harmo</p>
            </motion.div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto pr-2 hide-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      </div>
    </div>
  );
};

import { ProtectedRoute } from './components/ProtectedRoute';
import AdminPage from './pages/Admin';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/materi" element={<MateriPage />} />
            <Route path="/about" element={<AboutPage />} />

            {/* User Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/game" element={<ProtectedRoute><GamePage /></ProtectedRoute>} />
            <Route path="/maze" element={<ProtectedRoute><MazeGamePage /></ProtectedRoute>} />
            <Route path="/study-room" element={<ProtectedRoute><StudyRoomPage /></ProtectedRoute>} />
            <Route path="/quiz" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
            <Route path="/avatars" element={<ProtectedRoute><AvatarStorePage /></ProtectedRoute>} />
            <Route path="/share-yours" element={<ProtectedRoute><ShareYoursPage /></ProtectedRoute>} />
            <Route path="/challenge" element={<ProtectedRoute><ChallengePage /></ProtectedRoute>} />
            <Route path="/edu-case" element={<ProtectedRoute><EduCasePage /></ProtectedRoute>} />
            <Route path="/discussion" element={<ProtectedRoute><DiscussionPage /></ProtectedRoute>} />

            {/* Admin only Route */}
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}
