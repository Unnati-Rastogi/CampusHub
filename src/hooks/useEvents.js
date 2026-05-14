import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * useEvents({ clubId? }) — live subscription to all events (or by club).
 */
export function useEvents({ clubId } = {}) {
  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    // If clubId is explicitly null, don't fetch anything (rep has no club)
    if (clubId === null) {
      setEvents([]);
      setLoading(false);
      return;
    }

    let q = query(collection(db, 'events'), orderBy('date'));
    if (clubId) {
      q = query(collection(db, 'events'), where('clubId', '==', clubId), orderBy('date'));
    }

    const unsub = onSnapshot(q,
      (snap) => {
        const today = new Date().toISOString().split('T')[0];
        setEvents(snap.docs.map(d => {
          const data = d.data();
          return {
            ...data,
            id: d.id,
            isToday: data.date === today,
            isFeatured: data.isFeatured ?? false,
          };
        }));
        setLoading(false);
      },
      (err) => {
        console.error('useEvents error:', err);
        setError(err.message);
        setLoading(false);
      }
    );
    return unsub;
  }, [clubId]);

  return { events, loading, error };
}
