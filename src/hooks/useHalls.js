import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * useHalls() — live Firestore subscription to all halls.
 */
export function useHalls() {
  const [halls, setHalls]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'halls'), orderBy('name'));
    const unsub = onSnapshot(q,
      (snap) => {
        setHalls(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error('useHalls error:', err);
        setError(err.message);
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  return { halls, loading, error };
}
