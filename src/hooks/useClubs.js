import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * useClubs() — live Firestore subscription to all clubs.
 */
export function useClubs() {
  const [clubs, setClubs]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'clubs'), orderBy('name'));
    const unsub = onSnapshot(q,
      (snap) => {
        setClubs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error('useClubs error:', err);
        setError(err.message);
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  return { clubs, loading, error };
}

/**
 * useClub(slug) — fetch a single club by slug.
 */
export function useClub(slug) {
  const [club, setClub]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!slug) return;
    const unsub = onSnapshot(doc(db, 'clubs', slug),
      (snap) => {
        if (snap.exists()) {
          setClub({ id: snap.id, ...snap.data() });
        } else {
          setClub(null);
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return unsub;
  }, [slug]);

  return { club, loading, error };
}
