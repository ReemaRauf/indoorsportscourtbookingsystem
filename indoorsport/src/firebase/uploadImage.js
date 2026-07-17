/**
 * uploadImageToFirebase
 * Uploads a file to Firebase Storage and returns the permanent public download URL.
 * 
 * @param {File} file - The file to upload
 * @param {string} folder - Storage folder (e.g. "equipments", "coaches", "courts")
 * @returns {Promise<string>} - Permanent public URL
 */
import { storage } from './config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export async function uploadImageToFirebase(file, folder = 'uploads') {
  const timestamp = Date.now();
  const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${folder}/${timestamp}_${safeFileName}`;
  const storageRef = ref(storage, path);

  const snapshot = await uploadBytesResumable(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL; // e.g. https://firebasestorage.googleapis.com/...
}
