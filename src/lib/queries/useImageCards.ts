import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  listImageCards, 
  createImageCardStub, 
  setImageCardImageOnce 
} from "../firestore/imageCards";
import { uploadImageForCard, getImageUrl } from "../firebase/storage";
import { User } from "firebase/auth";

export const IMAGE_CARDS_QUERY_KEY = ["imageCards"];

export const useImageCardsList = () => {
  return useQuery({
    queryKey: IMAGE_CARDS_QUERY_KEY,
    queryFn: listImageCards,
  });
};

export const useCreateImageCardStub = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: User) => createImageCardStub(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: IMAGE_CARDS_QUERY_KEY });
    },
  });
};

export const useUploadImageForCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      cardId,
      file,
      user,
      onProgress,
    }: {
      cardId: string;
      file: File;
      user: User;
      onProgress?: (progress: number) => void;
    }) => {
      // 1. Upload to Storage
      const { storagePath } = await uploadImageForCard({ cardId, file, user, onProgress });
      
      // 2. Update Firestore
      await setImageCardImageOnce(cardId, user, storagePath);
      
      return storagePath;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: IMAGE_CARDS_QUERY_KEY });
    },
  });
};

export const useImageCardImageUrl = (storagePath: string | null) => {
  return useQuery({
    queryKey: ["imageCardUrl", storagePath],
    queryFn: () => (storagePath ? getImageUrl(storagePath) : null),
    enabled: !!storagePath,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
