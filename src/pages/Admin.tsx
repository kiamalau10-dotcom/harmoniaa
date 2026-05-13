import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, getDocs, limit } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from '../lib/firebase';
import { Users, Shield, Circle, Clock, Activity, ExternalLink, Database, Trash2, CheckCircle } from 'lucide-react';

interface ActivityRecord {
  id: string;
  userId: string;
  username?: string;
  type: string;
  path?: string;
  description: string;
  timestamp: any;
}

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
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.currentUser) return;

    // Users stream
    const qUsers = query(collection(db, 'users'));
    const unsubscribeUsers = onSnapshot(qUsers, (snapshot) => {
      const userList = snapshot.docs.map(doc => doc.data() as UserProfile);
      const sortedList = [...userList].sort((a, b) => {
        const timeA = a.lastActive?.toMillis?.() || 0;
        const timeB = b.lastActive?.toMillis?.() || 0;
        return timeB - timeA;
      });
      setUsers(sortedList);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
    });

    // Activities stream
    const qActivities = query(collection(db, 'activities'), orderBy('timestamp', 'desc'));
    const unsubscribeActivities = onSnapshot(qActivities, (snapshot) => {
      const activityList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ActivityRecord[];
      setActivities(activityList.slice(0, 50)); // Only show last 50
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'activities');
    });

    return () => {
      unsubscribeUsers();
      unsubscribeActivities();
    };
  }, []);

  const seedInitialPoll = async () => {
    setStatus('Sedang mengecek Poll...');
    try {
      const pollsSnap = await getDocs(query(collection(db, 'polls'), limit(1)));
      if (pollsSnap.empty) {
        await addDoc(collection(db, 'polls'), {
          question: "Kalau kamu melihat diskriminasi di kelas, apa yang akan kamu lakukan?",
          options: [
            { label: 'Menegur langsung secara baik-baik', votes: 120 },
            { label: 'Melaporkan ke guru atau wali kelas', votes: 85 },
            { label: 'Mengajak teman lain untuk membela korban', votes: 45 },
            { label: 'Diam dan mengamati situasi dulu', votes: 12 },
          ],
          voters: [],
          totalVotes: 262,
          isActive: true
        });
        setStatus('Poll Berhasil Diinisialisasi!');
      } else {
        setStatus('Poll Sudah Ada.');
      }
    } catch (error) {
      console.error(error);
      setStatus('Gagal Menginisialisasi Poll.');
    }
    setTimeout(() => setStatus(null), 3000);
  };

  const onlineCount = users.filter(u => u.isOnline).length;

  const getUserDetails = (uid: string) => {
    return users.find(u => u.uid === uid);
  };

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

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-8 bg-slate-900 border-4 border-slate-800 rounded-[2.5rem] shadow-xl md:col-span-3 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-lilac rounded-2xl flex items-center justify-center text-white border-2 border-lilac/30">
               <Database size={24} />
             </div>
             <div>
                <h3 className="text-xl font-black text-white">Inisialisasi Database</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Siapkan data default untuk Circle & Polling</p>
             </div>
          </div>
          <div className="flex items-center gap-4">
            {status && (
              <span className="text-xs font-bold text-emerald-400 animate-pulse">{status}</span>
            )}
            <button 
              onClick={seedInitialPoll}
              className="px-6 py-3 bg-lilac hover:bg-lilac/80 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2"
            >
              Seed Polling Data
            </button>
          </div>
        </motion.div>
      </div>

      {/* ACTIVITY LOG SECTION */}
      <div className="bg-white rounded-[3rem] border-4 border-sidebar-border shadow-xl overflow-hidden mt-8">
        <div className="p-8 border-b-2 border-slate-50 flex justify-between items-center bg-lilac/10">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-lilac border-2 border-lilac/20 shadow-sm">
                <Activity size={20} />
             </div>
             <h2 className="text-xl font-black text-text-primary">Logs Aktivitas Terkini</h2>
          </div>
          <span className="px-4 py-2 bg-white/50 rounded-full text-[10px] font-black text-lilac uppercase tracking-widest border border-lilac/10">Global Audit</span>
        </div>

        <div className="max-h-[500px] overflow-y-auto pr-2 hide-scrollbar">
          <div className="divide-y-2 divide-slate-50">
            {activities.length === 0 ? (
              <div className="p-20 text-center text-slate-400 font-bold italic">
                Belum ada aktivitas yang tercatat.
              </div>
            ) : (
              activities.map((item) => {
                const userDetail = getUserDetails(item.userId);
                return (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-6 hover:bg-slate-50/50 transition-colors flex items-start gap-6"
                  >
                    <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white shadow-sm shrink-0 bg-slate-100">
                      {userDetail?.avatar ? (
                        <img src={userDetail.avatar} className="w-full h-full object-cover" />
                      ) : (
                        <Users size={20} className="m-auto mt-2 text-slate-300" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-black text-text-primary">{userDetail?.username || 'System/Guest'}</span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          item.type === 'login' ? 'bg-emerald-100 text-emerald-600' :
                          item.type === 'logout' ? 'bg-red-100 text-red-600' :
                          item.type === 'page_view' ? 'bg-blue-100 text-blue-600' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {item.type.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">{item.description}</p>
                      {item.path && (
                        <div className="flex items-center gap-1 mt-2 text-[10px] font-black text-baby-blue uppercase tracking-widest">
                          <ExternalLink size={10} /> {item.path}
                        </div>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-[10px] font-black text-slate-400 mb-1">{item.timestamp?.toDate?.().toLocaleTimeString() || '...'}</p>
                      <p className="text-[10px] font-bold text-slate-300">{item.timestamp?.toDate?.().toLocaleDateString() || '...'}</p>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
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
