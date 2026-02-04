"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UserNav } from "@/components/auth/UserNav";
import { useAuth } from "@/components/auth/AuthProvider";
import { 
  useImageCardsList, 
  useCreateImageCardStub, 
  useUploadImageForCard, 
  useImageCardImageUrl 
} from "@/lib/queries/useImageCards";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  ImageIcon, 
  Plus, 
  Search, 
  Clock, 
  MessageSquare, 
  AlertCircle,
  Upload,
  Loader2
} from "lucide-react";
import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { SmartImage } from "@/components/ui/SmartImage";
import { ImageCard } from "@/lib/firestore/imageCards";

export default function GalleryPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Million Chances
              </h1>
            </Link>
            <UserNav />
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <GalleryContent />
        </main>
      </div>
    </ProtectedRoute>
  );
}

function GalleryContent() {
  const { user } = useAuth();
  const { data: cards, isLoading, isError } = useImageCardsList();
  const createStubMutation = useCreateImageCardStub();
  const uploadMutation = useUploadImageForCard();
  const [searchQuery, setSearchQuery] = useState("");
  
  // ROBUST PATTERN: Single file input at page level
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadCardId, setActiveUploadCardId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<{ cardId: string; message: string } | null>(null);

  const filteredCards = cards?.filter(card => 
    (card.notesText || "No notes yet").toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleCreateStub = () => {
    if (user) {
      createStubMutation.mutate(user);
    }
  };

  // Trigger file picker for a specific card
  const handleUploadClick = useCallback((cardId: string) => {
    setActiveUploadCardId(cardId);
    setUploadError(null);
    // Small delay to ensure state is set before click
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 0);
  }, []);

  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    // Reset input value so same file can be selected again
    e.target.value = "";
    
    if (!file || !activeUploadCardId || !user) {
      setActiveUploadCardId(null);
      return;
    }

    const cardId = activeUploadCardId;
    
    try {
      setUploadProgress(0);
      
      await uploadMutation.mutateAsync({
        cardId,
        file,
        user,
        onProgress: (progress) => setUploadProgress(progress),
      });
      
      setUploadProgress(null);
      setActiveUploadCardId(null);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Upload failed";
      setUploadError({ cardId, message });
      setUploadProgress(null);
      setActiveUploadCardId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gallery</h2>
          <p className="text-muted-foreground">
            Manage your image-clustered work memories
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search notes..." 
              className="pl-9 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleCreateStub} 
            disabled={createStubMutation.isPending}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {createStubMutation.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Card (Stub)
              </span>
            )}
          </Button>
        </div>
      </div>

      {isError && (
        <Card className="border-destructive bg-destructive/5">
          <div className="pt-6 px-6 pb-6 flex items-center gap-3 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p>Failed to load images. Please check your connection.</p>
          </div>
        </Card>
      )}

      {/* SINGLE FILE INPUT - Always mounted at page level */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden border-none shadow-sm">
              <Skeleton className="aspect-video w-full" />
              <CardHeader className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
            </Card>
          ))
        ) : filteredCards.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {filteredCards.map((card, index) => (
              <GalleryCard 
                key={card.id} 
                card={card} 
                index={index}
                onUploadClick={handleUploadClick}
                isUploading={activeUploadCardId === card.id && uploadProgress !== null}
                uploadProgress={activeUploadCardId === card.id ? uploadProgress : null}
                uploadError={uploadError?.cardId === card.id ? uploadError.message : null}
                onClearError={() => setUploadError(null)}
              />
            ))}
          </AnimatePresence>
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 bg-indigo-50 rounded-full">
              <ImageIcon className="h-12 w-12 text-indigo-200" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-semibold">No memories yet</h3>
              <p className="text-muted-foreground">
                Create your first image card stub to get started
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleCreateStub}
              disabled={createStubMutation.isPending}
            >
              Start Clustering
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

interface GalleryCardProps {
  card: ImageCard;
  index: number;
  onUploadClick: (cardId: string) => void;
  isUploading: boolean;
  uploadProgress: number | null;
  uploadError: string | null;
  onClearError: () => void;
}

function GalleryCard({ 
  card, 
  index, 
  onUploadClick, 
  isUploading, 
  uploadProgress, 
  uploadError,
  onClearError 
}: GalleryCardProps) {
  const router = useRouter();
  const { data: imageUrl, isLoading: isImageLoading } = useImageCardImageUrl(card.storagePath);

  const handleCardClick = () => {
    router.push(`/cards/${card.id}`);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      onClick={handleCardClick}
      className="cursor-pointer"
    >
      <Card 
        className="group overflow-hidden border-none shadow-sm hover:shadow-md transition-all bg-white flex flex-col h-full active:scale-[0.98]"
      >
        <div className="aspect-video bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors relative overflow-hidden">
          {card.storagePath ? (
            <>
              {isImageLoading || !imageUrl ? (
                <Skeleton className="w-full h-full" />
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative w-full h-full"
                >
                  <SmartImage
                    src={imageUrl}
                    alt={card.notesText || "Image card"}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </motion.div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 p-4 w-full h-full justify-center">
              {isUploading && uploadProgress !== null ? (
                <div className="w-full px-4 space-y-2">
                  <Progress value={uploadProgress} className="h-2 w-full bg-indigo-100" />
                  <p className="text-[10px] text-center font-medium text-indigo-600 animate-pulse">
                    Uploading... {Math.round(uploadProgress)}%
                  </p>
                </div>
              ) : uploadError ? (
                <div className="flex flex-col items-center gap-2 p-4 text-center">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                  <p className="text-[10px] font-medium text-destructive">
                    {uploadError}
                  </p>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="h-auto p-0 text-[10px]"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClearError();
                      onUploadClick(card.id);
                    }}
                  >
                    Try again
                  </Button>
                </div>
              ) : (
                <>
                  <ImageIcon className="h-10 w-10 text-indigo-200 group-hover:text-indigo-300 transition-colors" />
                  <Button 
                    type="button"
                    variant="secondary" 
                    size="sm"
                    className="bg-white/90 hover:bg-white text-indigo-600 border border-indigo-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      onUploadClick(card.id);
                    }}
                  >
                    <Upload className="h-3.5 w-3.5 mr-2" />
                    Upload Image
                  </Button>
                </>
              )}
            </div>
          )}
          
          <div className="absolute top-2 right-2 px-2 py-1 bg-white/80 backdrop-blur-sm rounded text-[10px] font-medium text-indigo-600 border border-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity">
            {card.storagePath ? "IMAGE" : "STUB"}
          </div>
        </div>
        <CardHeader className="p-4 grow">
          <div className="space-y-1">
            <p className="font-medium line-clamp-1">
              {card.notesText || "No notes yet"}
            </p>
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                <span>
                  {card.lastMessageAt?.toDate()?.toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <MessageSquare className="h-3 w-3" />
                <span>{card.messageCount}</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  );
}
