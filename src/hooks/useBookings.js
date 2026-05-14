import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * useMyBookings(repId) — live subscription to a club rep's booking requests.
 */
export function useMyBookings(repId) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!repId) { setLoading(false); return; }
    // Remove orderBy to prevent composite index errors, sort client-side
    const q = query(collection(db, 'bookingRequests'), where('repId', '==', repId));
    const unsub = onSnapshot(q, (snap) => {
      let data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => {
        const tA = a.createdAt?.toMillis?.() || 0;
        const tB = b.createdAt?.toMillis?.() || 0;
        return tB - tA;
      });
      setBookings(data);
      setLoading(false);
    });
    return unsub;
  }, [repId]);

  return { bookings, loading };
}

/**
 * useAllBookings() — live subscription to ALL booking requests (Authority).
 */
export function useAllBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    // Single field orderBy is fine without composite index
    const q = query(collection(db, 'bookingRequests'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  return { bookings, loading };
}

/**
 * useHallBookings(hallId?) — for calendar view.
 * Returns approved+pending bookings, optionally filtered by hall.
 */
export function useHallBookings(hallId = null) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    let q;
    if (hallId) {
      // Remove orderBy to prevent composite index errors
      q = query(
        collection(db, 'bookingRequests'),
        where('hallId', '==', hallId),
        where('status', 'in', ['approved', 'pending'])
      );
    } else {
      q = query(
        collection(db, 'bookingRequests'),
        where('status', 'in', ['approved', 'pending'])
      );
    }
    
    const unsub = onSnapshot(q, (snap) => {
      let data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // Sort client-side by date
      data.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
      setBookings(data);
      setLoading(false);
    });
    return unsub;
  }, [hallId]);

  return { bookings, loading };
}
