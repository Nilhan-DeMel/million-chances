"use client";

import { useState, use, useRef, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useImageCard, useImageCardImageUrl } from "@/lib/queries/useImageCards";
import { useMessages } from "@/lib/queries/useMessages";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { NotesPanel } from "@/components/cards/NotesPanel";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  Info, 
  Loader2, 
  AlertCircle,
  Clock,
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import { SmartImage } from "@/components/ui/SmartImage";
import { motion, AnimatePresence } from "motion/react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CardThreadPage({ params }: { params: Promise<{ cardId: string }> }) {
  const { cardId } = use(params);
  const { user } = useAuth();
  const [showNotes, setShowNotes] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: card, isLoading: isLoadingCard, isError: isCardError } = useImageCard(cardId);
  const { messages, loading: isLoadingMessages } = useMessages(cardId);
  const { data: imageUrl } = useImageCardImageUrl(card?.storagePath || null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoadingMessages]);

  if (isLoadingCard || !user) {
    return (
      <div className="h-screen flex items-center justify-center bg-indigo-50/30">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (isCardError || !card) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-indigo-50/30 p-4 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h1 className="text-xl font-bold mb-2">Memory not found</h1>
        <p className="text-muted-foreground mb-6">This image card might have been removed or you don&apos;t have access.</p>
        <Button asChild variant="outline">
          <Link href="/gallery">Back to Gallery</Link>
        </Button>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="h-screen flex flex-col bg-slate-50 relative overflow-hidden">
        {/* Header / Top Image Bar */}
        <header className="bg-white border-b border-indigo-100 shadow-sm z-20 shrink-0">
          <div className="flex items-center justify-between p-3 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-indigo-50">
                <Link href="/gallery">
                  <ChevronLeft className="h-5 w-5 text-indigo-600" />
                </Link>
              </Button>
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-indigo-100 bg-indigo-50 shrink-0">
                  {imageUrl ? (
                    <SmartImage src={imageUrl} alt="Card preview" fill className="object-cover" />
                  ) : (
                    <Skeleton className="w-full h-full" />
                  )}
                </div>
                <div>
                  <h1 className="text-sm font-semibold truncate max-w-[150px] sm:max-w-[300px]">
                    {card.notesText || "Untitled Memory"}
                  </h1>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {card.createdAt?.toDate()?.toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {card.messageCount} messages
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={() => setShowNotes(!showNotes)} 
              variant={showNotes ? "secondary" : "ghost"}
              size="sm"
              className={`h-9 px-3 rounded-full transition-all ${showNotes ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200" : "text-indigo-600 hover:bg-indigo-50"}`}
            >
              <Info className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Context</span>
            </Button>
          </div>
        </header>

        <div className="flex grow overflow-hidden relative">
          {/* Chat Main Area */}
          <main className="grow flex flex-col min-w-0 relative bg-gray-50">
            <div 
              ref={scrollRef}
              className="grow overflow-y-auto scroll-smooth"
            >
              <div className="max-w-4xl mx-auto w-full min-h-full">
                {isLoadingMessages ? (
                  <div className="flex items-center justify-center p-20">
                    <Loader2 className="h-6 w-6 animate-spin text-indigo-200" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-20 text-center opacity-40">
                    <MessageSquare className="h-10 w-10 mb-4 text-indigo-300" />
                    <p className="text-sm font-medium">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  <ChatMessages messages={messages} currentUser={user} />
                )}
              </div>
            </div>

            {/* Composer */}
            <div className="max-w-4xl mx-auto w-full sticky bottom-0 z-10">
              <ChatComposer cardId={cardId} user={user} />
            </div>
          </main>

          {/* Notes Sidebar Overlay for mobile / Sidepanel for desktop */}
          <AnimatePresence>
            {showNotes && (
              <motion.aside
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute inset-y-0 right-0 w-full sm:w-80 sm:relative shrink-0 z-30 shadow-2xl sm:shadow-none border-l border-indigo-100"
              >
                {/* Mobile Close Button for Notes */}
                <div className="sm:hidden absolute top-4 left-[-48px]">
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="rounded-full shadow-lg bg-white"
                    onClick={() => setShowNotes(false)}
                  >
                    <ChevronLeft className="h-5 w-5 rotate-180" />
                  </Button>
                </div>
                
                <NotesPanel 
                  cardId={cardId} 
                  notesText={card.notesText} 
                  ownerId={card.createdBy.uid} 
                  user={user} 
                />
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ProtectedRoute>
  );
}
