import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc, onSnapshot, collection, addDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './firebase';

interface UserProfile {
  uid: string;
  username: string;
  email: string;
  avatar: string;
  role: 'user' | 'admin';
  isOnline: boolean;
  currentRoomId: string | null;
  lastActive: any;
  coins: number;
  exp: number;
  level: number;
  totalQuizScore: number;
  quizLevel: number;
  ownedAvatars: string[];
  lastRewardClaimed?: any;
  loginStreak: number;
  badges: string[];
  completedChallenges: string[];
}

interface ActivityData {
  type: 'page_view' | 'action' | 'login' | 'logout';
  path?: string;
  description?: string;
  metadata?: any;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  isOffline: boolean;
  login: (username: string, pass: string) => Promise<void>;
  register: (username: string, email: string, pass: string, avatar: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logActivity: (data: ActivityData) => Promise<void>;
  claimChallenge: (challengeId: string, reward: number, exp: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!window.navigator.onLine);

  const logActivity = async (data: ActivityData) => {
    if (!auth.currentUser) return;
    try {
      await addDoc(collection(db, 'activities'), {
        userId: auth.currentUser.uid,
        timestamp: serverTimestamp(),
        ...data
      });
    } catch (error) {
      console.error("Failed to log activity:", error);
    }
  };

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeUnload = async () => {
      if (auth.currentUser) {
        // We use synchronous update if possible or navigator.sendBeacon, 
        // but for Firestore we just attempt a quick update.
        // Note: This is not 100% reliable but better than nothing.
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
          isOnline: false,
          currentRoomId: null,
          lastActive: serverTimestamp()
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser);
      if (authUser) {
        setLoading(true);
        const userDocRef = doc(db, 'users', authUser.uid);
        
        const unsubscribeProfile = onSnapshot(userDocRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as UserProfile;
            setProfile(data);
          }
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${authUser.uid}`);
        });

        // Online status & Reward Check (One-time on startup/auth)
        if (window.navigator.onLine) {
          try {
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              const data = userDoc.data() as UserProfile;
              const updatePayload: any = {
                isOnline: true,
                lastActive: serverTimestamp()
              };

              const now = new Date();
              const lastClaimed = data.lastRewardClaimed?.toDate?.() || (data.lastRewardClaimed ? new Date(data.lastRewardClaimed) : null);
              
              let canClaim = false;
              if (!lastClaimed) {
                canClaim = true;
              } else {
                const diffDays = Math.floor((now.getTime() - lastClaimed.getTime()) / (1000 * 60 * 60 * 24));
                if (diffDays >= 1) canClaim = true;
              }

              if (canClaim) {
                let streak = data.loginStreak || 0;
                if (lastClaimed) {
                  const diffDays = Math.floor((now.getTime() - lastClaimed.getTime()) / (1000 * 60 * 60 * 24));
                  if (diffDays === 1) streak = (streak % 7) + 1;
                  else if (diffDays > 1) streak = 1;
                } else streak = 1;

                const rewards = [50, 100, 150, 200, 250, 300, 500];
                const reward = rewards[(streak - 1) % 7];
                updatePayload.coins = (data.coins || 0) + reward;
                updatePayload.exp = (data.exp || 0) + Math.floor(reward / 2);
                updatePayload.loginStreak = streak;
                updatePayload.lastRewardClaimed = serverTimestamp();
              }
              await updateDoc(userDocRef, updatePayload);
            }
          } catch (error) {
            // Silently fail reward check if offline, it will retry on next login
            console.debug("Background profile sync deferred: ", error);
          }
        }
        
        setLoading(false);
        return () => unsubscribeProfile();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (username: string, pass: string) => {
    const isAdminUser = username.toLowerCase() === 'admin';
    const email = isAdminUser ? 'admin@socio.com' : `${username.toLowerCase().replace(/\s/g, '')}@socio.app`;
    
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      
      // If it's the specific admin user, ensure they are in the admins collection
      if (isAdminUser) {
        try {
          const adminDocRef = doc(db, 'admins', cred.user.uid);
          const adminDoc = await getDoc(adminDocRef);
          if (!adminDoc.exists()) {
            await setDoc(adminDocRef, { uid: cred.user.uid, updated: serverTimestamp() });
          }
        } catch (e) {
          console.warn("Failed to ensure admin collection state:", e);
        }
      }

      // Log successful login
      await addDoc(collection(db, 'activities'), {
        userId: cred.user.uid,
        timestamp: serverTimestamp(),
        type: 'login',
        description: `User ${username} logged in`
      });
    } catch (error: any) {
      console.error("Login Error:", error.code, error.message);
      
      const isNewAdminPassword = isAdminUser && pass === '123456';
      
      // Auto-create admin if specifically logged in with 123456 and it doesn't exist
      if (isNewAdminPassword && (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-email')) {
        try {
          const cred = await createUserWithEmailAndPassword(auth, email, pass);
          const newProfile: UserProfile = {
            uid: cred.user.uid,
            username: 'Admin',
            email: email,
            avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin',
            role: 'admin',
            isOnline: true,
            currentRoomId: null,
            lastActive: serverTimestamp(),
            coins: 1000000,
            exp: 10000,
            level: 100,
            totalQuizScore: 10000,
            quizLevel: 50,
            ownedAvatars: ['cat', 'dog', 'rabbit', 'panda'],
            loginStreak: 1,
            lastRewardClaimed: serverTimestamp(),
            badges: ['Pioneer', 'SuperAdmin'],
            completedChallenges: []
          };
          await setDoc(doc(db, 'users', cred.user.uid), newProfile);
          await setDoc(doc(db, 'admins', cred.user.uid), { uid: cred.user.uid });
          setProfile(newProfile);
          return;
        } catch (createErr: any) {
          if (createErr.code === 'auth/email-already-in-use') {
            throw new Error('Akun Admin sudah ada tapi Password salah! Silakan gunakan password yang benar atau hubungi sistem.');
          }
          if (createErr.code === 'auth/operation-not-allowed') {
            throw new Error('Fitur Login Belum Aktif! Silakan aktifkan "Email/Password" di Firebase Console Anda.');
          }
          throw createErr;
        }
      }
      
      let friendlyMsg = 'Username atau Password salah.';
      if (error.code === 'auth/operation-not-allowed') {
        friendlyMsg = 'Fitur Login Belum Aktif! Silakan aktifkan "Email/Password" di Firebase Console Anda.';
      } else if (error.code === 'auth/network-request-failed') {
        friendlyMsg = 'Koneksi internet bermasalah.';
      } else if (error.code === 'auth/too-many-requests') {
        friendlyMsg = 'Terlalu banyak percobaan login. Silakan coba lagi nanti.';
      }
      throw new Error(friendlyMsg);
    }
  };

  const register = async (username: string, email: string, pass: string, avatar: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const newProfile: UserProfile = {
        uid: cred.user.uid,
        username,
        email,
        avatar: avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`,
        role: 'user',
        isOnline: true,
        currentRoomId: null,
        lastActive: serverTimestamp(),
        coins: 100, // Starting coins
        exp: 0,
        level: 1,
        totalQuizScore: 0,
        quizLevel: 1,
        ownedAvatars: ['cat', 'dog'], // Starting free avatars
        loginStreak: 1,
        lastRewardClaimed: serverTimestamp(),
        badges: [],
        completedChallenges: []
      };
      await setDoc(doc(db, 'users', cred.user.uid), newProfile);
      setProfile(newProfile);
      await addDoc(collection(db, 'activities'), {
        userId: cred.user.uid,
        timestamp: serverTimestamp(),
        type: 'login',
        description: `User ${username} registered and logged in`
      });
    } catch (error: any) {
      console.error("Register detail error:", error);
      let friendlyMsg = error.message;
      if (error.code === 'auth/email-already-in-use') {
        friendlyMsg = 'Username ini sudah terdaftar.';
      } else if (error.code === 'auth/operation-not-allowed') {
        friendlyMsg = 'Pendaftaran dengan Email/Password belum diaktifkan di Firebase Console. Silakan aktifkan di tab Authentication -> Sign-in method.';
      } else if (error.code === 'auth/weak-password') {
        friendlyMsg = 'Password terlalu lemah (min. 6 karakter).';
      }
      throw new Error(friendlyMsg);
    }
  };

  const logout = async () => {
    if (user) {
      try {
        await logActivity({
          type: 'logout',
          description: `User ${profile?.username || user.uid} logged out`
        });
        await updateDoc(doc(db, 'users', user.uid), {
          isOnline: false,
          currentRoomId: null,
          lastActive: serverTimestamp()
        });
      } catch (e) {}
    }
    await signOut(auth);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const cred = await signInWithPopup(auth, provider);
      const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
      if (!userDoc.exists()) {
        const newProfile: UserProfile = {
          uid: cred.user.uid,
          username: cred.user.displayName || 'User',
          email: cred.user.email || '',
          avatar: cred.user.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${cred.user.uid}`,
          role: 'user',
          isOnline: true,
          currentRoomId: null,
          lastActive: serverTimestamp(),
          coins: 100,
          exp: 0,
          level: 1,
          totalQuizScore: 0,
          quizLevel: 1,
          ownedAvatars: ['cat', 'dog'],
          loginStreak: 1,
          lastRewardClaimed: serverTimestamp(),
          badges: [],
          completedChallenges: []
        };
        await setDoc(doc(db, 'users', cred.user.uid), newProfile);
        setProfile(newProfile);
      }
      await addDoc(collection(db, 'activities'), {
        userId: cred.user.uid,
        timestamp: serverTimestamp(),
        type: 'login',
        description: `User ${cred.user.displayName} logged in via Google`
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, isOffline, login, register, logout, loginWithGoogle, logActivity }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
