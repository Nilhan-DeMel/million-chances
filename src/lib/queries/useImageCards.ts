import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listImageCards, createImageCardStub } from "../firestore/imageCards";
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
