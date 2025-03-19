import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// Initialize Firestore
const firestore = getFirestore();

/**
 * Save or Update User Data in Firestore
 * @param {string} uid - The user ID.
 * @param {object} data - The data to be saved.
 * @returns {Promise<object>} - Success or error message.
 */
export const saveUserData = async (uid: string, data: object) => {
  if (!uid) throw new Error('UID is required');
  if (!data || typeof data !== 'object') throw new Error('Valid data object is required');

  try {
    await setDoc(doc(firestore, 'users', uid), data, { merge: true });
    return { success: true, message: 'User data saved successfully' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

/**
 * Fetch User Data by UID
 * @param {string} uid - The user ID.
 * @returns {Promise<object>} - The user data or a message.
 */
export const fetchUserDataByUID = async (uid: string) => {
  if (!uid) throw new Error('UID is required');

  try {
    const userDoc = await getDoc(doc(firestore, 'users', uid));
    if (userDoc.exists()) {
      return { success: true, data: { id: userDoc.id, ...userDoc.data() } };
    } else {
      return { success: false, message: 'No user found with the given UID' };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
