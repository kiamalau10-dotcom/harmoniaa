import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from '../lib/firebase';
import { Users, Shield, Circle, Clock } from 'lucide-react';

interface UserProfile {
  uid: string;
  username: string;
  email: string;
  avatar: string;
  role: string;
  isOnline: boolean;
  lastActive: any;
}

export default function AdminPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userList = snapshot.docs.map(doc => doc.data() as UserProfile);
      // Sort in memory for now to avoid Firebase index requirement
      const sortedList = [...userList].sort((a, b) => {
        const timeA = a.lastActive?.toMillis?.() || 0;
        const timeB = b.lastActive?.toMillis?.() || 0;
        return timeB - timeA;
      });
      setUsers(sortedList);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
    });

    return () => unsubscribe();
  }, []);

  const onlineCount = users.filter(u => u.isOnline).length;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 bg-white rounded-[2.5rem] border-4 border-sidebar-border shadow-xl space-y-4"
        >
          <div className="w-12 h-12 bg-baby-blue rounded-2xl flex items-center justify-center text-blue-600 border-2 border-white shadow-sm">
            <Users size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-text-primary">{users.length}</h3>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Pengguna</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-8 bg-white rounded-[2.5rem] border-4 border-sidebar-border shadow-xl space-y-4"
        >
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 border-2 border-white shadow-sm">
            <Circle size={20} fill="currentColor" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-text-primary">{onlineCount}</h3>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Sedang Online</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-8 bg-white rounded-[2.5rem] border-4 border-sidebar-border shadow-xl space-y-4"
        >
          <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 border-2 border-white shadow-sm">
            <Shield size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-text-primary">Admin</h3>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Akses Kontrol Aktif</p>
          </div>
        </motion.div>
      </div>

      <div className="bg-white rounded-[3rem] border-4 border-sidebar-border shadow-xl overflow-hidden">
        <div className="p-8 border-b-2 border-slate-50 flex justify-between items-center">
          <h2 className="text-xl font-black text-text-primary">Daftar Pengguna Aktif</h2>
          <span className="px-4 py-2 bg-slate-50 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time Sync</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pengguna</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Peran</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Terakhir Aktif</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-50">
              {users.map((u) => (
                <tr key={u.uid} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white shadow-sm shrink-0">
                        <img src={u.avatar} alt="avatar" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-text-primary">{u.username}</p>
                        <p className="text-[10px] font-bold text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${u.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                      <span className={`text-[10px] font-black uppercase tracking-tighter ${u.isOnline ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {u.isOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      u.role === 'admin' ? 'bg-amber-100 text-amber-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold text-slate-500">
                        {u.lastActive?.toDate?.().toLocaleString() || 'Baru saja'}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                        <Clock size={10} /> Active
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
