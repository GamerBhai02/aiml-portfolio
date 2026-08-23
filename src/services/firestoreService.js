import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

export const COLLECTIONS = {
  profile: 'profile',
  education: 'education',
  skills: 'skills',
  projects: 'projects',
  patents: 'patents',
  papers: 'papers',
  certifications: 'certifications',
  achievements: 'achievements',
  blog: 'blog',
};

function assertDb() {
  if (!db) throw new Error('Firebase is not configured. Check your .env file.');
}

export async function getProfile() {
  assertDb();
  const snap = await getDoc(doc(db, COLLECTIONS.profile, 'main'));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function saveProfile(partial) {
  assertDb();
  await setDoc(doc(db, COLLECTIONS.profile, 'main'), partial, { merge: true });
}

// Fetch without an orderBy clause so documents missing `createdAt` are not
// silently excluded; callers sort with sortByOrder (utils/format).
export async function getItems(collectionName) {
  assertDb();
  const snap = await getDocs(collection(db, collectionName));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getItem(collectionName, id) {
  assertDb();
  const snap = await getDoc(doc(db, collectionName, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function addItem(collectionName, data) {
  assertDb();
  const ref = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateItem(collectionName, id, data) {
  assertDb();
  await updateDoc(doc(db, collectionName, id), data);
}

export async function removeItem(collectionName, id) {
  assertDb();
  await deleteDoc(doc(db, collectionName, id));
}
