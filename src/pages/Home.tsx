import { motion } from 'motion/react';
import { ArrowRight, Play, Star, Users, Heart, BookOpen, Trophy, LayoutDashboard, Gamepad2, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section - Hidden because it's now in Layout Header */}
      
      {/* Slogan & Intro */}
      <section className="text-center space-y-4 px-4 bg-white rounded-4xl p-10 border-4 border-baby-blue card-shadow">
        <h2 className="text-3xl md:text-4xl text-text-primary font-display font-black line-clamp-2">“Belajar Sosiologi Tidak Harus Membosankan.”</h2>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium">
          Harmoni Sosial bukan sekadar teori, melainkan praktik keseharian yang kita bangun bersama melalui pilihan kecil yang kita ambil setiap hari.
        </p>
      </section>

      {/* Feature Grids */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { icon: LayoutDashboard, title: 'Dashboard', desc: 'Pantau progress belajar dan badge pencapaianmu.', color: 'bg-baby-blue', border: 'border-baby-blue' },
          { icon: BookOpen, title: 'Materi', desc: 'Belajar lewat infografis, animasi, dan slide mini.', color: 'bg-soft-pink', border: 'border-soft-pink' },
          { icon: Gamepad2, title: 'Story Game', desc: 'Tentukan pilihanmu dan lihat ending ceritanya.', color: 'bg-lilac', border: 'border-lilac' },
          { icon: Heart, title: 'Challenge', desc: 'Tantangan mingguan untuk aksi sosial nyata.', color: 'bg-sage', border: 'border-sage' },
          { icon: Trophy, title: 'Leaderboard', desc: 'Uji kemampuanmu dan kumpulkan skor tertinggi.', color: 'bg-yellow-tint', border: 'border-sidebar-border' },
          { icon: Info, title: 'About Us', desc: 'Kenali visi, misi, dan anggota kelompok kami.', color: 'bg-baby-blue', border: 'border-baby-blue' },
        ].map((feat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className={`p-8 bg-white rounded-4xl card-shadow border-4 ${feat.border} space-y-4`}
          >
            <div className={`w-12 h-12 ${feat.color} rounded-2xl flex items-center justify-center text-text-primary shadow-sm border-2 border-white`}>
              <feat.icon size={24} />
            </div>
            <h3 className="text-xl font-bold text-text-primary">{feat.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">{feat.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Mascot Corner */}
      <section className="bg-lilac/10 rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 border border-lilac/20">
        <div className="flex -space-x-4">
          <div className="w-24 h-24 bg-baby-blue rounded-full border-4 border-white flex items-center justify-center text-white font-bold text-2xl shadow-md">
            Harmo
          </div>
          <div className="w-24 h-24 bg-soft-pink rounded-full border-4 border-white flex items-center justify-center text-white font-bold text-2xl shadow-md">
            Soci
          </div>
        </div>
        <div className="flex-1 text-center md:text-left space-y-2">
          <h3 className="text-2xl font-bold text-slate-800">Kenalin Teman Belajarmu!</h3>
          <p className="text-slate-500">Harmo & Soci akan menemanimu menjelajahi tantangan sosial di setiap level.</p>
        </div>
        <Link to="/about" className="px-6 py-3 bg-white text-lilac font-bold rounded-xl shadow-sm hover:shadow-md transition-all">
          Kenalan Yuk!
        </Link>
      </section>
    </div>
  );
}

const PlayCircle = ({ size }: { size: number }) => <Play size={size} />;
