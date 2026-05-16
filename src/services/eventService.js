import { collection, doc, addDoc, updateDoc, deleteDoc, serverTimestamp, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * Create a new event (Club Rep only).
 */
export async function createEvent({ clubId, clubName, title, description, venue, hallId,
                                    date, time, category, isFeatured, poster, tags }) {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const docRef = await addDoc(collection(db, 'events'), {
    clubId, clubName,
    title, slug, description,
    venue, hallId: hallId || null,
    date,       // "YYYY-MM-DD"
    time,       // "HH:MM AM – HH:MM PM"
    category,
    isFeatured: Boolean(isFeatured),
    poster:     poster || '',
    tags:       tags || [],
    status:     'pending',
    statusMessage: '',
    createdAt:  serverTimestamp(),
    updatedAt:  serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Update an existing event.
 */
export async function updateEvent(eventId, data) {
  const allowed = ['title', 'description', 'venue', 'hallId', 'date', 'time',
                   'category', 'isFeatured', 'poster', 'tags', 'status', 'statusMessage',
                   'postEventImages', 'winners'];
  const sanitized = Object.fromEntries(
    Object.entries(data).filter(([k]) => allowed.includes(k))
  );
  await updateDoc(doc(db, 'events', eventId), {
    ...sanitized,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete an event.
 */
export async function deleteEvent(eventId) {
  await deleteDoc(doc(db, 'events', eventId));
}

/**
 * Add a review to an event.
 */
export async function addEventReview(eventId, { userId, userName, rating, comment }) {
  await addDoc(collection(db, 'events', eventId, 'reviews'), {
    userId,
    userName,
    rating,
    comment,
    createdAt: serverTimestamp(),
  });
}

/**
 * Get reviews for an event. (Mocked with Firebase query logic, adjust if needed)
 */
export async function getEventReviews(eventId) {
  const q = query(collection(db, 'events', eventId, 'reviews'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
