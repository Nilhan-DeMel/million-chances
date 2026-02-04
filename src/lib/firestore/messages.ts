import {
  collection,
  CollectionReference,
  DocumentData,
  query,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  getFirestore,
  serverTimestamp,
  doc,
  runTransaction,
} from "firebase/firestore";
import { app } from "../firebase/client";
import { User } from "firebase/auth";

const db = getFirestore(app);

export interface Message {
  id: string;
  text: string;
  createdAt: Timestamp;
  author: {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string | null;
  };
}

// Helper type for writing to Firestore (omitting ID)
type MessageData = Omit<Message, "id">;

export const messagesCollectionRef = (cardId: string) =>
  collection(db, "imageCards", cardId, "messages") as CollectionReference<
    MessageData,
    DocumentData
  >;

export const listenMessages = (
  cardId: string,
  onUpdate: (messages: Message[]) => void,
  maxMessages: number = 200
) => {
  const q = query(
    messagesCollectionRef(cardId),
    orderBy("createdAt", "asc"),
    limit(maxMessages)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Message[];
      onUpdate(messages);
    },
    (error) => {
      console.error("Error listening to messages:", error);
    }
  );
};

export const sendMessage = async ({
  cardId,
  user,
  text,
}: {
  cardId: string;
  user: User;
  text: string;
}): Promise<void> => {
  if (!text.trim()) return;

  const cardDocRef = doc(db, "imageCards", cardId);
  const messagesColRef = messagesCollectionRef(cardId);

  await runTransaction(db, async (transaction) => {
    const cardDoc = await transaction.get(cardDocRef);
    if (!cardDoc.exists()) {
      throw new Error("Card does not exist");
    }

    const currentCount = cardDoc.data().messageCount || 0;

    // 1. Add message to subcollection using transaction.set
    const messageDocRef = doc(messagesColRef);

    transaction.set(messageDocRef, {
      text,
      createdAt: serverTimestamp(),
      author: {
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || user.email || "Anonymous",
        photoURL: user.photoURL || null,
      },
    } as MessageData);

    // 2. Update parent imageCard
    transaction.update(cardDocRef, {
      lastMessageAt: serverTimestamp(),
      messageCount: currentCount + 1,
    });
  });
};
