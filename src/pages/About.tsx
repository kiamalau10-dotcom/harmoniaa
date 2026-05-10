import { motion } from 'motion/react';
import { Target, Heart, Users, Mail, Globe, MapPin } from 'lucide-react';

export default function About() {
  const team = [
    { 
      name: 'Astrid Bago', 
      role: 'Guru Pembimbing', 
      color: 'bg-slate-800',
      image: 'https://images.unsplash.com/photo-1544717297-fa154daaf544?w=400&h=400&fit=crop'
    },
    { 
      name: 'Hizkia Malau', 
      role: 'Anggota 1', 
      color: 'bg-baby-blue',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop'
    },
    { 
      name: 'Kayla Bangun', 
      role: 'Anggota 2', 
      color: 'bg-soft-pink',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
    },
    { 
      name: 'Larissa Siahaan', 
      role: 'Anggota 3', 
      color: 'bg-lilac',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
    },
    { 
      name: 'Livie Sinaga', 
      role: 'Anggota 4', 
      color: 'bg-sage',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop'
    },
    { 
      name: 'Paulus Sitorus', 
      role: 'Anggota 5', 
      color: 'bg-yellow-400',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop'
    },
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="bg-white p-8 md:p-16 rounded-[3rem] border border-slate-50 shadow-sm text-center space-y-6 max-w-4xl mx-auto">
         <div className="w-20 h-20 bg-pastel-gradient rounded-3xl flex items-center justify-center text-white font-bold text-3xl shadow-xl mx-auto mb-8">
            H
         </div>
         <h1 className="text-4xl md:text-5xl font-bold text-slate-800">Tentang Harmoni Sosial</h1>
         <p className="text-lg text-slate-500 leading-relaxed">
            Harmoni Sosial adalah platform edukasi interaktif yang dirancang khusus untuk pelajar. Kami percaya bahwa memahami sosiologi bukan sekadar menghafal teori, melainkan cara kita mempraktikkan empati, menghargai keberagaman, dan menciptakan aksi sosial yang bermakna di kehidupan sehari-hari.
         </p>
      </section>

      {/* Stats/Goals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {[
            { icon: Target, title: 'Visi Kami', desc: 'Menjadi platform edukasi sosiologi nomor satu yang mengubah teori menjadi aksi nyata.', color: 'text-baby-blue', bg: 'bg-baby-blue/10' },
            { icon: Heart, title: 'Misi Kami', desc: 'Menanamkan empati dan kesadaran sosial kepada generasi muda melalui teknologi interaktif.', color: 'text-soft-pink', bg: 'bg-soft-pink/10' },
            { icon: Users, title: 'Alasan Memilih Tema', desc: 'Melihat tingginya konflik sosial di sekolah, kami ingin memberikan solusi edukatif.', color: 'text-lilac', bg: 'bg-lilac/10' },
         ].map((goal, i) => (
            <motion.div 
               key={i}
               whileHover={{ y: -5 }}
               className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm space-y-4 text-center"
            >
               <div className={`w-14 h-14 ${goal.bg} ${goal.color} rounded-2xl flex items-center justify-center mx-auto`}>
                  <goal.icon size={28} />
               </div>
               <h3 className="text-xl font-bold text-slate-800">{goal.title}</h3>
               <h4 className="text-sm text-slate-500 leading-relaxed font-medium">{goal.desc}</h4>
            </motion.div>
         ))}
      </div>

      {/* Team Section */}
      <section className="space-y-10">
         <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-slate-800">Anggota Kelompok Kami</h2>
            <p className="text-slate-500 italic">Dikerjakan dengan sepenuh hati demi harmoni negeri.</p>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, i) => (
               <motion.div 
                  key={i} 
                  whileHover={{ y: -10 }}
                  className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm flex flex-col items-center text-center space-y-5 transition-all group"
               >
                  <div className={`relative w-32 h-32 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl group-hover:shadow-2xl transition-all duration-500`}>
                     {member.image ? (
                        <img 
                           src={member.image} 
                           alt={member.name} 
                           className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                           referrerPolicy="no-referrer"
                        />
                     ) : (
                        <div className={`w-full h-full ${member.color} flex items-center justify-center text-white font-bold text-4xl`}>
                           {member.name[0]}
                        </div>
                     )}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div>
                     <h4 className="text-xl font-bold text-slate-800 group-hover:text-baby-blue transition-colors">{member.name}</h4>
                     <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">{member.role}</p>
                  </div>
               </motion.div>
            ))}
         </div>
      </section>

    </div>
  );
}
