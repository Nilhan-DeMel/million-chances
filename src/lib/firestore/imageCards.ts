import {
  collection,
  CollectionReference,
  DocumentData,
  getDocs,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  Timestamp,
  getFirestore,
} from "firebase/firestore";
import { app } from "../firebase/client";
import { User } from "firebase/auth";

const db = getFirestore(app);

export interface ImageCard {
  id: string;
  storagePath?: string | null;
  notesText: string;
  createdAt: Timestamp;
  createdBy: {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string | null;
  };
  lastMessageAt: Timestamp;
  messageCount: number;
}

export const imageCardsCollectionRef = () =>
  collection(db, "imageCards") as CollectionReference<ImageCard, DocumentData>;

export const listImageCards = async (): Promise<ImageCard[]> => {
  const q = query(imageCardsCollectionRef(), orderBy("lastMessageAt", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
};

export const createImageCardStub = async (user: User): Promise<string> => {
  const colRef = imageCardsCollectionRef();
  const docRef = await addDoc(colRef, {
    notesText: "",
    messageCount: 0,
    createdAt: serverTimestamp(),
    lastMessageAt: serverTimestamp(),
    createdBy: {
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || user.email || "Anonymous",
      photoURL: user.photoURL || null,
    },
  } as Omit<ImageCard, "id">);
  return docRef.id;
};
