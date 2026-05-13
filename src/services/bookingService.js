import { collection, doc, addDoc, updateDoc, query, where, getDocs, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

const BOOKINGS = 'bookingRequests';

/**
 * Parse "HH:MM" time string to minutes since midnight.
 */
function timeToMins(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Check if a proposed booking conflicts with any existing approved/pending booking.
 * Returns { conflict: bool, conflictingBooking: doc | null }
 */
export async function checkConflict(hallId, dateStr, startTime, endTime) {
  const q = query(
    collection(db, BOOKINGS),
    where('hallId', '==', hallId),
    where('date', '==', dateStr),
    where('status', 'in', ['pending', 'approved'])
  );
  const snap = await getDocs(q);

  const newStart = timeToMins(startTime);
  const newEnd   = timeToMins(endTime);

  for (const d of snap.docs) {
    const { startTime: es, endTime: ee } = d.data();
    const existStart = timeToMins(es);
    const existEnd   = timeToMins(ee);
    // Overlap: new starts before existing ends AND new ends after existing starts
    if (newStart < existEnd && newEnd > existStart) {
      return { conflict: true, conflictingBooking: { id: d.id, ...d.data() } };
    }
  }
  return { conflict: false, conflictingBooking: null };
}

/**
 * Validate booking date rules.
 * - Must be a future date (not today, not past)
 */
export function validateDate(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selected = new Date(dateStr);
  selected.setHours(0, 0, 0, 0);
  if (selected <= today) {
    return { valid: false, error: 'Booking date must be at least tomorrow. Same-day and past bookings are not allowed.' };
  }
  return { valid: true, error: null };
}

/**
 * Create a new hall booking request.
 */
export async function createBookingRequest({ hallId, hallName, clubId, clubName, repId, repName, eventName, date, startTime, endTime, attendees, notes }) {
  // Date validation
  const dateValidation = validateDate(date);
  if (!dateValidation.valid) throw new Error(dateValidation.error);

  // Conflict check
  const { conflict, conflictingBooking } = await checkConflict(hallId, date, startTime, endTime);
  if (conflict) {
    throw new Error(
      `Time conflict: "${conflictingBooking.eventName}" by ${conflictingBooking.clubName} is already booked from ${conflictingBooking.startTime}–${conflictingBooking.endTime} on this date.`
    );
  }

  const docRef = await addDoc(collection(db, BOOKINGS), {
    hallId, hallName, clubId, clubName,
    repId, repName, eventName,
    date,        // stored as "YYYY-MM-DD" string for easy querying
    startTime,   // "HH:MM"
    endTime,     // "HH:MM"
    attendees:   Number(attendees) || 0,
    notes:       notes || '',
    status:      'pending',
    createdAt:   serverTimestamp(),
    reviewedBy:  null,
    reviewedAt:  null,
    reviewNote:  '',
  });

  return docRef.id;
}

/**
 * Approve or reject a booking request (Authority only).
 */
export async function updateBookingStatus(requestId, status, reviewNote = '', reviewerId) {
  await updateDoc(doc(db, BOOKINGS, requestId), {
    status,
    reviewNote,
    reviewedBy: reviewerId,
    reviewedAt: serverTimestamp(),
  });
}

/**
 * Cancel a booking request (Club Rep — only own pending requests).
 */
export async function cancelBookingRequest(requestId) {
  await updateDoc(doc(db, BOOKINGS, requestId), {
    status: 'cancelled',
    reviewedAt: serverTimestamp(),
  });
}
