import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { useUpdateImageCardNotes } from "@/lib/queries/useImageCards";

interface NotesPanelProps {
  cardId: string;
  notesText: string;
  ownerId: string;
  user: User;
}

export function NotesPanel({ cardId, notesText, ownerId, user }: NotesPanelProps) {
  const [localNotes, setLocalNotes] = useState(notesText);
  const isOwner = user.uid === ownerId;
  const updateNotesMutation = useUpdateImageCardNotes();

  useEffect(() => {
    setLocalNotes(notesText);
  }, [notesText]);

  const handleSave = async () => {
    if (!isOwner || localNotes === notesText) return;

    try {
      await updateNotesMutation.mutateAsync({
        cardId,
        user,
        notesText: localNotes,
      });
    } catch (error) {
      console.error("Failed to update notes:", error);
    }
  };

  const hasChanges = localNotes !== notesText;

  return (
    <div className="flex flex-col h-full bg-white border-l border-indigo-100 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Context / Notes</h3>
        {isOwner && hasChanges && (
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 px-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
            onClick={handleSave}
            disabled={updateNotesMutation.isPending}
          >
            {updateNotesMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Save className="h-4 w-4 mr-1" />
                Save
              </>
            )}
          </Button>
        )}
      </div>
      <div className="grow">
        <textarea
          value={localNotes}
          onChange={(e) => setLocalNotes(e.target.value)}
          disabled={!isOwner}
          placeholder={isOwner ? "Add context about this memory..." : "No notes yet."}
          className="w-full h-full min-h-[200px] p-3 text-sm bg-indigo-50/30 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 border border-transparent disabled:bg-transparent disabled:text-gray-600"
        />
      </div>
      {!isOwner && (
        <p className="text-[10px] text-muted-foreground italic">
          Only the memory creator can edit these notes.
        </p>
      )}
    </div>
  );
}
