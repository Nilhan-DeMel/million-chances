import { useState, useEffect } from "react";
import { listenMessages, Message } from "../firestore/messages";

export function useMessages(cardId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cardId) return;

    const unsubscribe = listenMessages(cardId, (newMessages) => {
      setMessages(newMessages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [cardId]);

  return { messages, loading };
}
