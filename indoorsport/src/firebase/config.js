import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "indoorsport1.firebaseapp.com",
  projectId: "indoorsport1",
  storageBucket: "indoorsport1.firebasestorage.app",
  messagingSenderId: "673134433998",
  appId: "1:673134433998:web:b8a3449dfcd83e2b24e29f",
  measurementId: "G-YHZZYEDJT3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);