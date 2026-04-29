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
  LayoutGrid
} from 'lucide-react';

// Components (We will create these)
import HomePage from './pages/Home';
import DashboardPage from './pages/Dashboard';
import MateriPage from './pages/Materi';
import GamePage from './pages/Game';
import DiscussionPage from './pages/Discussion';
import QuizPage from './pages/Quiz';
import MazeGamePage from './pages/MazeGame';
import StudyRoomPage from './pages/StudyRoom';
import { DAILY_TIPS } from './constants';

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

  useEffect(() => {
    const randomTip = DAILY_TIPS[Math.floor(Math.random() * DAILY_TIPS.length)];
    setDailyTip(randomTip);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-cream font-sans p-6 gap-6">
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
        </nav>

        <div className="mt-6 p-4 rounded-3xl bg-white border-2 border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-soft-pink rounded-xl overflow-hidden border-2 border-white flex items-center justify-center text-xl">
              🐱
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Student</p>
              <p className="text-sm font-black text-text-primary leading-none">Jane Doe</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-6 lg:max-w-[calc(100vw-16rem-48px)] min-h-full">
        <header className="h-40 bg-gradient-to-r from-baby-blue to-lilac rounded-4xl p-8 flex items-center justify-between relative overflow-hidden border-4 border-white card-shadow">
          <div className="z-10">
            <h2 className="text-4xl font-display font-black text-[#2D3748] mb-1">Choose Your Social Story.</h2>
            <p className="text-[#4A5568] font-medium">Harmoni Sosial dimulai dari pilihan cerdasmu hari ini!</p>
            <Link to="/materi" className="inline-block mt-4 bg-white text-[#553C9A] px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest shadow-lg hover:scale-105 transition-transform">
              Mulai Belajar
            </Link>
          </div>
          
          <div className="absolute right-10 bottom-0 flex items-end gap-2">
            <div className="bg-white px-4 py-2 rounded-t-3xl border-x-4 border-t-4 border-baby-blue text-center transform translate-y-2">
              <span className="text-4xl">🐱</span>
              <p className="text-[10px] font-black text-baby-blue">SOCI</p>
            </div>
            <div className="bg-white px-5 py-3 rounded-t-4xl border-x-4 border-t-4 border-soft-pink text-center">
              <span className="text-5xl">🐤</span>
              <p className="text-[10px] font-black text-soft-pink">HARMO</p>
            </div>
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
  );
};

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/materi" element={<MateriPage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/maze" element={<MazeGamePage />} />
          <Route path="/study-room" element={<StudyRoomPage />} />
          <Route path="/quiz" element={<QuizPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}
