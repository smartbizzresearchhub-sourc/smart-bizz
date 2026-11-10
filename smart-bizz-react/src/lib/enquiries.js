import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./db";

const COLLECTION = "enquiries";

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => {
        const err = new Error("Request timed out");
        err.name = "TimeoutError";
        reject(err);
      }, ms),
    ),
  ]);
}

/** Called by the public contact form. */
export function saveEnquiry(data) {
  return withTimeout(
    addDoc(collection(db, COLLECTION), { ...data, status: "new", createdAt: serverTimestamp() }),
    20000,
  );
}

/** Admin: live list of enquiries, newest first. */
export function watchEnquiries(onData, onError) {
  const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError,
  );
}

export function setEnquiryStatus(id, status) {
  return updateDoc(doc(db, COLLECTION, id), { status, updatedAt: serverTimestamp() });
}

export function deleteEnquiry(id) {
  return deleteDoc(doc(db, COLLECTION, id));
}
