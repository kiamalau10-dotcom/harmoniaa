import { motion } from 'motion/react';
import { Target, Heart, Users, Mail, Globe, MapPin, Instagram, Github } from 'lucide-react';

export default function About() {
  const team = [
    { name: 'Harmono', role: 'Lead Visionary', color: 'bg-baby-blue' },
    { name: 'Sociyanti', role: 'Social Designer', color: 'bg-soft-pink' },
    { name: 'Budi Harmoni', role: 'UX Sosiolog', color: 'bg-lilac' },
    { name: 'Siti Sosiologi', role: 'Content Creator', color: 'bg-sage' },
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
            Membangun masa depan yang damai melalui pemahaman sosiologi yang mendalam dan aksi sosial yang bermakna. 
            Kami percaya bahwa harmoni dimulai dari pendidikan dan kepedulian.
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
               <p className="text-sm text-slate-500 leading-relaxed">{goal.desc}</p>
            </motion.div>
         ))}
      </div>

      {/* Team Section */}
      <section className="space-y-8">
         <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-slate-800">Anggota Kelompok Kami</h2>
            <p className="text-slate-500 italic">Dikerjakan dengan sepenuh hati demi harmoni negeri.</p>
         </div>
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
               <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm flex flex-col items-center text-center space-y-4">
                  <div className={`w-24 h-24 ${member.color} rounded-full border-4 border-slate-50 shadow-inner flex items-center justify-center text-white font-bold text-2xl`}>
                     {member.name[0]}
                  </div>
                  <div>
                     <h4 className="font-bold text-slate-800">{member.name}</h4>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{member.role}</p>
                  </div>
                  <div className="flex gap-2">
                     <button className="p-2 text-slate-300 hover:text-baby-blue transition-colors">
                        <Instagram size={16} />
                     </button>
                     <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                        <Github size={16} />
                     </button>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* Contact Section */}
      <section className="bg-slate-900 p-8 md:p-12 rounded-[3.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl overflow-hidden relative">
         <div className="relative z-10 space-y-6 max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold font-display">Punya Ide Harmoni Lainnya?</h2>
            <p className="text-white/60">Kami sangat terbuka untuk kolaborasi dan masukan untuk pengembangan platform ini.</p>
            <div className="space-y-4 pt-4">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center"><Mail size={18} /></div>
                  <p className="text-sm">halo@harmonisosial.com</p>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center"><MapPin size={18} /></div>
                  <p className="text-sm">Gedung Sosiologi, Jakarta, Indonesia</p>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center"><Globe size={18} /></div>
                  <p className="text-sm">www.harmonisosial.site</p>
               </div>
            </div>
         </div>
         {/* Decoration */}
         <div className="absolute top-0 right-0 w-96 h-96 bg-pastel-gradient opacity-20 blur-[100px]" />
      </section>
    </div>
  );
}
