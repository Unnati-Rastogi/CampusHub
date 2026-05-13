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
    const q = query(
      collection(db, 'bookingRequests'),
      where('repId', '==', repId),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() })));
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
    let q = query(
      collection(db, 'bookingRequests'),
      where('status', 'in', ['approved', 'pending']),
      orderBy('date')
    );
    if (hallId) {
      q = query(
        collection(db, 'bookingRequests'),
        where('hallId', '==', hallId),
        where('status', 'in', ['approved', 'pending']),
        orderBy('date')
      );
    }
    const unsub = onSnapshot(q, (snap) => {
      setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, [hallId]);

  return { bookings, loading };
}
