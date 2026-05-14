import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * Ensures that a user document exists in Firestore.
 * If it doesn't exist, it creates one with default values.
 * If it does exist, it ensures core fields (uid, email) are updated.
 * 
 * @param {Object} user - The Firebase Auth user object
 * @param {Object} additionalData - Optional additional data to merge (e.g. displayName)
 * @returns {Promise<Object>} The user profile data
 */
export async function ensureUserProfile(user, additionalData = {}) {
  if (!user) return null;

  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    // Create new profile
    const profileData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || additionalData.displayName || '',
      role: additionalData.role || 'club_rep', // Default role
      clubId: null,
      createdAt: serverTimestamp(),
      ...additionalData
    };
    await setDoc(userRef, profileData);
    return profileData;
  } else {
    // Update existing profile (only core fields and new additional data)
    // We use merge: true to avoid overwriting 'role' or 'clubId' if they already exist
    const updateData = {
      uid: user.uid,
      email: user.email,
      ...additionalData
    };
    await setDoc(userRef, updateData, { merge: true });
    
    // Return the latest data
    const updatedSnap = await getDoc(userRef);
    return { uid: user.uid, ...updatedSnap.data() };
  }
}
