import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { User } from "firebase/auth";
import { sendMessage } from "@/lib/firestore/messages";

interface ChatComposerProps {
  cardId: string;
  user: User;
}

export function ChatComposer({ cardId, user }: ChatComposerProps) {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    if (!text.trim() || isSending) return;

    setIsSending(true);
    try {
      await sendMessage({ cardId, user, text: text.trim() });
      setText("");
      // Reset height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  return (
    <div className="p-4 bg-white border-t border-indigo-100 flex items-end gap-3">
      <div className="relative grow">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a message..."
          className="w-full bg-indigo-50/50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none max-h-32 transition-all border border-transparent focus:border-indigo-100"
          rows={1}
        />
      </div>
      <Button
        onClick={handleSend}
        disabled={!text.trim() || isSending}
        size="icon"
        className="h-10 w-10 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shrink-0 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
      >
        {isSending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Send className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
}
