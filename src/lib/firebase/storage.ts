import { 
  getStorage, 
  ref, 
  uploadBytesResumable, 
  getDownloadURL 
} from "firebase/storage";
import { app } from "./client";
import { User } from "firebase/auth";

export const storage = getStorage(app);

export interface UploadImageResult {
  storagePath: string;
}

export const uploadImageForCard = async ({
  cardId,
  file,
  user,
  onProgress
}: {
  cardId: string;
  file: File;
  user: User;
  onProgress?: (progress: number) => void;
}): Promise<UploadImageResult> => {
  // Validate file type
  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image");
  }

  // Enforce max size (5MB)
  const MAX_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new Error("File size must be less than 5MB");
  }

  const extension = file.name.split(".").pop() || "jpg";
  const fileName = `${crypto.randomUUID()}.${extension}`;
  const storagePath = `imageCards/${cardId}/original/${fileName}`;
  const storageRef = ref(storage, storagePath);

  const uploadTask = uploadBytesResumable(storageRef, file, {
    contentType: file.type,
    customMetadata: {
      uploadedBy: user.uid,
      cardId: cardId
    }
  });

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(progress);
      },
      (error) => {
        console.error("Upload failed:", error);
        reject(error);
      },
      () => {
        // Return only the storage path as requested
        resolve({ storagePath });
      }
    );
  });
};

export const getImageUrl = async (storagePath: string): Promise<string> => {
  const storageRef = ref(storage, storagePath);
  return await getDownloadURL(storageRef);
};
