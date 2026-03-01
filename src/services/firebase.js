import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  onSnapshot,
  updateDoc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Auth helpers
export const signIn = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const signOut = () => fbSignOut(auth);

export const onAuthChanged = (cb) => onAuthStateChanged(auth, cb);

// Helper to subscribe to words collection in real-time
export const subscribeToWords = (callback) => {
  const q = query(collection(db, 'words'));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const wordsList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(wordsList);
  });
  return unsubscribe;
};

// Add a word to Firestore
export const addWordToFirestore = async (main, lang2, lang3, description) => {
  const docRef = await addDoc(collection(db, 'words'), {
    main,
    lang2,
    lang3,
    description,
    createdAt: Date.now(),
    likes: 0,
  });
  return docRef.id;
};

// Remove a word from Firestore
export const removeWordFromFirestore = async (id) => {
  await deleteDoc(doc(db, 'words', id));
};

// Update a word in Firestore
export const updateWordInFirestore = async (id, main, lang2, lang3, description) => {
  await updateDoc(doc(db, 'words', id), {
    main,
    lang2,
    lang3,
    description,
  });
};

// Like a word
export const likeWordInFirestore = async (wordId) => {
  const wordDocRef = doc(db, 'words', wordId);
  const wordSnap = await getDoc(wordDocRef);
  if (wordSnap.exists()) {
    const currentLikes = wordSnap.data().likes || 0;
    await updateDoc(wordDocRef, { likes: currentLikes + 1 });
  }
};

// Get or create user's data
const getUserDocRef = (userId) => doc(db, 'userMetadata', userId);

export const getUserPreferences = async (userId) => {
  const userDoc = await getDoc(getUserDocRef(userId));
  if (userDoc.exists()) {
    return userDoc.data();
  }
  return { liked: [], saved: [] };
};

// Save user preference (liked/saved)
export const setUserPreference = async (userId, key, value) => {
  const userDocRef = getUserDocRef(userId);
  await setDoc(
    userDocRef,
    { [key]: value },
    { merge: true }
  );
};

// Generate or get a device ID (stored in localStorage)
export const getDeviceId = () => {
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = 'device_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
};

// admin credentials stored in Firestore so multiple users share
const adminDocRef = () => doc(db, 'admins', 'primary');

export const getAdminCreds = async () => {
  const snap = await getDoc(adminDocRef());
  return snap.exists() ? snap.data() : null;
};

export const setAdminCreds = async (id, hash) => {
  await setDoc(adminDocRef(), { id, hash });
};

export const resetAdminCreds = async () => {
  await deleteDoc(adminDocRef());
};
