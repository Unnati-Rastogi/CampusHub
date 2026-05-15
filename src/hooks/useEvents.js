import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * useEvents({ clubId?, allStatuses? }) — live subscription to all events (or by club).
 * By default, only returns events with status === 'approved'.
 */
export function useEvents({ clubId, allStatuses } = {}) {
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
        let docs = snap.docs.map(d => {
          const data = d.data();
          return {
            ...data,
            id: d.id,
            isToday: data.date === today,
            isFeatured: data.isFeatured ?? false,
          };
        });
        
        // Filter out non-approved events unless allStatuses is explicitly true
        if (!allStatuses) {
          docs = docs.filter(e => e.status === 'approved' || e.status === undefined); // fallback for existing events
        }
        
        setEvents(docs);
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
