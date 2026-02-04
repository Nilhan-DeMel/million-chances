import {
  collection,
  CollectionReference,
  DocumentData,
  getDocs,
  getDoc,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  Timestamp,
  getFirestore,
  doc,
  runTransaction,
  onSnapshot,
} from "firebase/firestore";
import { app } from "../firebase/client";
import { User } from "firebase/auth";

const db = getFirestore(app);

export interface ImageCard {
  id: string;
  storagePath: string | null;
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

export const getImageCard = async (cardId: string): Promise<ImageCard | null> => {
  const docRef = doc(db, "imageCards", cardId);
  const snapshot = await getDoc(docRef);
  
  if (!snapshot.exists()) return null;
  
  return {
    ...snapshot.data(),
    id: snapshot.id,
  } as ImageCard;
};

export const listenImageCard = (
  cardId: string,
  onUpdate: (card: ImageCard | null) => void
) => {
  const docRef = doc(db, "imageCards", cardId);
  return onSnapshot(docRef, (snapshot) => {
    if (!snapshot.exists()) {
      onUpdate(null);
    } else {
      onUpdate({
        ...snapshot.data(),
        id: snapshot.id,
      } as ImageCard);
    }
  });
};

export const listImageCards = async (): Promise<ImageCard[]> => {
  const q = query(imageCardsCollectionRef(), orderBy("lastMessageAt", "desc"));
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
    storagePath: null,
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

export const setImageCardImageOnce = async (
  cardId: string,
  user: User,
  storagePath: string
): Promise<void> => {
  const cardDocRef = doc(db, "imageCards", cardId);

  await runTransaction(db, async (transaction) => {
    const cardDoc = await transaction.get(cardDocRef);
    if (!cardDoc.exists()) {
      throw new Error("Card does not exist");
    }

    const cardData = cardDoc.data() as ImageCard;

    // Verify owner
    if (cardData.createdBy.uid !== user.uid) {
      throw new Error("Unauthorized: You do not own this card");
    }

    // Verify storagePath is not already set
    if (cardData.storagePath) {
      throw new Error("Image already set for this card");
    }

    transaction.update(cardDocRef, {
      storagePath,
      lastMessageAt: serverTimestamp(),
    });
  });
};

export const updateImageCardNotes = async (
  cardId: string,
  user: User,
  notesText: string
): Promise<void> => {
  const cardDocRef = doc(db, "imageCards", cardId);

  await runTransaction(db, async (transaction) => {
    const cardDoc = await transaction.get(cardDocRef);
    if (!cardDoc.exists()) {
      throw new Error("Card does not exist");
    }

    const cardData = cardDoc.data() as ImageCard;

    // OWNER-ONLY edit for notesText
    if (cardData.createdBy.uid !== user.uid) {
      throw new Error("Unauthorized: Only the owner can edit notes");
    }

    transaction.update(cardDocRef, {
      notesText,
    });
  });
};
