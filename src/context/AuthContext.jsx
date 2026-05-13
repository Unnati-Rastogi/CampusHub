import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);  // Firebase Auth user
  const [profile, setProfile] = useState(null);  // Firestore user doc
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (snap.exists()) {
            setProfile({ uid: firebaseUser.uid, ...snap.data() });
          } else {
            // Profile not yet created (new signup mid-flight)
            setProfile({ uid: firebaseUser.uid, role: null, clubId: null });
          }
        } catch {
          setProfile({ uid: firebaseUser.uid, role: null, clubId: null });
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

  const role   = profile?.role   ?? null;   // 'club_rep' | 'authority' | null
  const clubId = profile?.clubId ?? null;

  return (
    <AuthContext.Provider value={{ user, profile, role, clubId, loading, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
