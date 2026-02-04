import { Message } from "@/lib/firestore/messages";
import { User } from "firebase/auth";
import { motion, AnimatePresence } from "motion/react";
import { formatDistanceToNow } from "date-fns";
import { User as UserIcon } from "lucide-react";
import Image from "next/image";

interface ChatMessagesProps {
  messages: Message[];
  currentUser: User;
}

export function ChatMessages({ messages, currentUser }: ChatMessagesProps) {
  return (
    <div className="flex flex-col gap-4 p-4 min-h-0 overflow-y-auto">
      <AnimatePresence initial={false}>
        {messages.map((msg) => {
          const isOwn = msg.author.uid === currentUser.uid;
          
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${isOwn ? "justify-end" : "justify-start"} items-end gap-2 max-w-[85%] ${isOwn ? "self-end" : "self-start"}`}
            >
              {!isOwn && (
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden shrink-0 border border-indigo-200">
                  {msg.author.photoURL ? (
                    <Image 
                      src={msg.author.photoURL} 
                      alt={msg.author.displayName} 
                      width={32} 
                      height={32} 
                    />
                  ) : (
                    <UserIcon className="h-4 w-4 text-indigo-400" />
                  )}
                </div>
              )}
              
              <div className="flex flex-col gap-1">
                {!isOwn && (
                  <span className="text-[10px] font-medium text-muted-foreground ml-1">
                    {msg.author.displayName}
                  </span>
                )}
                <div 
                  className={`px-4 py-2.5 rounded-2xl text-sm ${
                    isOwn 
                      ? "bg-indigo-600 text-white rounded-br-none shadow-sm shadow-indigo-100" 
                      : "bg-white text-gray-800 rounded-bl-none border border-indigo-50 shadow-sm shadow-gray-100"
                  }`}
                >
                  {msg.text}
                </div>
                <span className={`text-[9px] text-muted-foreground ${isOwn ? "text-right mr-1" : "ml-1"}`}>
                  {msg.createdAt?.toDate ? formatDistanceToNow(msg.createdAt.toDate(), { addSuffix: true }) : "just now"}
                </span>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
