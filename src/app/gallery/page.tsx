"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UserNav } from "@/components/auth/UserNav";
import { useAuth } from "@/components/auth/AuthProvider";
import { useImageCardsList, useCreateImageCardStub } from "@/lib/queries/useImageCards";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ImageIcon, Plus, Search, Clock, MessageSquare, AlertCircle } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

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
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCards = cards?.filter(card => 
    (card.notesText || "No notes yet").toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleCreateStub = () => {
    if (user) {
      createStubMutation.mutate(user);
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
                <span className="h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
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
          <CardContent className="pt-6 flex items-center gap-3 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p>Failed to load images. Please check your connection.</p>
          </CardContent>
        </Card>
      )}

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
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Card className="group overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white">
                  <div className="aspect-video bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors relative">
                    <ImageIcon className="h-10 w-10 text-indigo-200 group-hover:text-indigo-300 transition-colors" />
                    <div className="absolute top-2 right-2 px-2 py-1 bg-white/80 backdrop-blur-sm rounded text-[10px] font-medium text-indigo-600 border border-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity">
                      STUB
                    </div>
                  </div>
                  <CardHeader className="p-4">
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
