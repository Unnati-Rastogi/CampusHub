import { doc, updateDoc, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * Update a club's profile fields.
 * Only fields present in `data` are updated (partial update).
 */
export async function updateClub(clubId, data) {
  const allowed = ['name', 'tagline', 'description', 'logo', 'banner', 'tags',
                   'contactEmail', 'memberCount', 'socialLinks', 'recentActivities',
                   'president', 'facultyCoordinator', 'foundedYear'];
  const sanitized = Object.fromEntries(
    Object.entries(data).filter(([k]) => allowed.includes(k))
  );
  await updateDoc(doc(db, 'clubs', clubId), {
    ...sanitized,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Add an activity to a club's recentActivities array.
 */
export async function addClubActivity(clubId, activity) {
  await updateDoc(doc(db, 'clubs', clubId), {
    recentActivities: arrayUnion({
      id: Date.now().toString(),
      ...activity,
    }),
    updatedAt: serverTimestamp(),
  });
}
