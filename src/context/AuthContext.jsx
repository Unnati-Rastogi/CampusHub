import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { ensureUserProfile } from '../services/userService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);  // Firebase Auth user
  const [profile, setProfile] = useState(null);  // Firestore user doc
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Automatically ensure Firestore profile exists
          const userData = await ensureUserProfile(firebaseUser);
          // Set both at the same time to prevent race conditions in routes
          setProfile(userData);
          setUser(firebaseUser);
        } catch (err) {
          console.error("AuthContext sync error:", err);
          // Fallback if Firestore fails but Auth is active
          setProfile({ uid: firebaseUser.uid, role: null, clubId: null });
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const logout = () => signOut(auth);

  /** Refresh profile from Firestore (call after role/club assignment) */
  const refreshProfile = async () => {
    if (!user) return;
    const snap = await getDoc(doc(db, 'users', user.uid));
    if (snap.exists()) setProfile({ uid: user.uid, ...snap.data() });
  };

  /** Sync profile with a specific role and update state immediately */
  const syncProfileWithRole = async (targetRole, targetUser = null) => {
    const activeUser = targetUser || user;
    if (!activeUser) return;
    const userData = await ensureUserProfile(activeUser, { role: targetRole });
    setProfile(userData);
    return userData;
  };

  const role   = profile?.role   ?? null;   // 'club_rep' | 'authority' | null
  const clubId = profile?.clubId ?? null;

  return (
    <AuthContext.Provider value={{ user, profile, role, clubId, loading, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
