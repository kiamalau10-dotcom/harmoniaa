import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../lib/AuthContext';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ANIMALS } from '../constants';
import { ShoppingBag, CheckCircle2, Lock, Coins } from 'lucide-react';

const AvatarStorePage: React.FC = () => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  if (!profile) return null;

  const handleBuyOrSet = async (animal: typeof ANIMALS[0]) => {
    if (loading) return;
    
    const isOwned = profile.ownedAvatars?.includes(animal.id);
    
    if (isOwned) {
      // Just set as current avatar
      setLoading(animal.id);
      try {
        await updateDoc(doc(db, 'users', profile.uid), {
          avatar: animal.url
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(null);
      }
    } else {
      // Buy and set
      if (profile.coins < animal.price) {
        alert('Koin tidak cukup! Selesaikan kuis untuk dapat koin.');
        return;
      }

      setLoading(animal.id);
      try {
        await updateDoc(doc(db, 'users', profile.uid), {
          coins: profile.coins - animal.price,
          ownedAvatars: arrayUnion(animal.id),
          avatar: animal.url
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(null);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <header className="mb-10 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-block p-4 bg-yellow-100 rounded-3xl mb-4 border-2 border-yellow-200"
        >
          <ShoppingBag size={48} className="text-yellow-600" />
        </motion.div>
        <h1 className="text-4xl font-display font-black text-text-primary mb-2">Toko Avatar Hewan</h1>
        <p className="text-slate-500 font-medium">Beli hewan lucu dengan koinmu dan jadikan profilmu makin keren!</p>
        
        <div className="mt-6 flex justify-center">
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border-2 border-sidebar-border flex items-center gap-3">
            <Coins className="text-yellow-500" size={24} />
            <span className="text-2xl font-black text-text-primary">{profile.coins}</span>
            <span className="text-sm font-bold text-slate-400">Koin Tersedia</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {ANIMALS.map((animal, idx) => {
          const isOwned = profile.ownedAvatars?.includes(animal.id);
          const isCurrent = profile.avatar === animal.url;
          
          return (
            <motion.div
              key={animal.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`relative bg-white rounded-[2.5rem] p-6 border-4 transition-all ${
                isCurrent ? 'border-baby-blue shadow-lg scale-105 z-10' : 'border-sidebar-border shadow-sm'
              }`}
            >
              <div className="aspect-square bg-slate-50 rounded-3xl mb-4 flex items-center justify-center overflow-hidden border-2 border-slate-100 relative group">
                <img 
                  src={animal.url} 
                  alt={animal.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
                {!isOwned && (
                  <div className="absolute top-2 right-2 p-1.5 bg-black/10 backdrop-blur-sm rounded-full">
                    <Lock size={14} className="text-black/40" />
                  </div>
                )}
              </div>
              
              <h3 className="font-black text-center text-text-primary leading-tight mb-2">{animal.name}</h3>
              
              <div className="mt-auto">
                {isCurrent ? (
                  <div className="flex items-center justify-center gap-2 py-3 bg-baby-blue/20 text-baby-blue rounded-2xl">
                    <CheckCircle2 size={16} />
                    <span className="text-sm font-black uppercase tracking-wider">Dipakai</span>
                  </div>
                ) : isOwned ? (
                  <button
                    onClick={() => handleBuyOrSet(animal)}
                    disabled={loading === animal.id}
                    className="w-full py-3 bg-baby-blue text-white rounded-2xl font-black text-sm uppercase tracking-wider hover:brightness-105 shadow-md active:scale-95 transition-all"
                  >
                    {loading === animal.id ? 'Mengubah...' : 'Gunakan'}
                  </button>
                ) : (
                  <button
                    onClick={() => handleBuyOrSet(animal)}
                    disabled={loading === animal.id}
                    className={`w-full py-3 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${
                      profile.coins >= animal.price 
                        ? 'bg-yellow-400 text-yellow-900 hover:brightness-105' 
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed grayscale'
                    }`}
                  >
                    {loading === animal.id ? (
                      'Membeli...'
                    ) : (
                      <>
                        <Coins size={16} />
                        {animal.price}
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AvatarStorePage;
