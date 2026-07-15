import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { readFileSync } from "fs";
import { describe, beforeAll, afterAll, it, beforeEach } from "vitest";

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "million-chances-rules-test",
    firestore: {
      rules: readFileSync("firestore.rules", "utf8"),
      host: "127.0.0.1",
      port: 8080,
    },
    storage: {
      rules: readFileSync("storage.rules", "utf8"),
      host: "127.0.0.1",
      port: 9199,
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

describe("Firestore Security Rules", () => {
  beforeEach(async () => {
    await testEnv.clearFirestore();
  });

  describe("imageCards", () => {
    it("should deny read/write for unauthenticated users", async () => {
      const unauthedDb = testEnv.unauthenticatedContext().firestore();
      const cardRef = doc(unauthedDb, "imageCards/card1");
      await assertFails(getDoc(cardRef));
      await assertFails(setDoc(cardRef, { createdBy: { uid: "user1" } }));
    });

    it("should allow authenticated users to read/list", async () => {
      const authedDb = testEnv.authenticatedContext("user1").firestore();
      const cardRef = doc(authedDb, "imageCards/card1");
      await assertSucceeds(getDoc(cardRef));
    });

    it("should allow create if createdBy.uid matches", async () => {
      const authedDb = testEnv.authenticatedContext("user1").firestore();
      const cardRef = doc(authedDb, "imageCards/card1");
      await assertSucceeds(setDoc(cardRef, { createdBy: { uid: "user1" } }));
    });

    it("should deny create if createdBy.uid mismatches", async () => {
      const authedDb = testEnv.authenticatedContext("user1").firestore();
      const cardRef = doc(authedDb, "imageCards/card1");
      await assertFails(setDoc(cardRef, { createdBy: { uid: "user2" } }));
    });

    it("should deny delete for owner", async () => {
      // First create it as admin context or owner
      const authedDb = testEnv.authenticatedContext("user1").firestore();
      const cardRef = doc(authedDb, "imageCards/card1");
      await assertSucceeds(setDoc(cardRef, { createdBy: { uid: "user1" } }));

      // Try to delete it
      await assertFails(deleteDoc(cardRef));
    });

    it("should allow non-owner to update only lastMessageAt and messageCount", async () => {
      // 1. Create card as user1
      const adminDb = testEnv.authenticatedContext("user1").firestore();
      const cardRefAdmin = doc(adminDb, "imageCards/card1");
      await setDoc(cardRefAdmin, {
        createdBy: { uid: "user1" },
        createdAt: "2026-02-04T00:00:00Z",
        messageCount: 0,
        storagePath: null,
        notesText: "initial notes",
      });

      // 2. Try to update as user2 (simulating message post)
      const user2Db = testEnv.authenticatedContext("user2").firestore();
      const cardRefUser2 = doc(user2Db, "imageCards/card1");
      
      // Should succeed with specific fields
      await assertSucceeds(
        transactionUpdate(user2Db, cardRefUser2, {
          lastMessageAt: new Date(),
          messageCount: 1,
        })
      );
    });

    it("should deny non-owner from updating notesText", async () => {
      const adminDb = testEnv.authenticatedContext("user1").firestore();
      const cardRefAdmin = doc(adminDb, "imageCards/card1");
      await setDoc(cardRefAdmin, {
        createdBy: { uid: "user1" },
        createdAt: "2026-02-04T00:00:00Z",
        messageCount: 0,
      });

      const user2Db = testEnv.authenticatedContext("user2").firestore();
      const cardRefUser2 = doc(user2Db, "imageCards/card1");
      await assertFails(
        setDoc(cardRefUser2, { messageCount: 1, notesText: "hacked" }, { merge: true }),
      );
    });
  });

  describe("messages", () => {
    it("should allow create if author.uid matches and createdAt is server time", async () => {
      const authedDb = testEnv.authenticatedContext("user1").firestore();
      const msgRef = doc(authedDb, "imageCards/card1/messages/msg1");
      await assertSucceeds(
        setDoc(msgRef, { 
          author: { uid: "user1" }, 
          text: "hello",
          createdAt: serverTimestamp()
        }),
      );
    });

    it("should deny create if createdAt is NOT server time (or missing)", async () => {
      const authedDb = testEnv.authenticatedContext("user1").firestore();
      const msgRef = doc(authedDb, "imageCards/card1/messages/msg2");
      await assertFails(
        setDoc(msgRef, { 
          author: { uid: "user1" }, 
          text: "hello"
        }),
      );
    });

    it("should deny update or delete even for author", async () => {
      const authedDb = testEnv.authenticatedContext("user1").firestore();
      const msgRef = doc(authedDb, "imageCards/card1/messages/msg1");
      await assertSucceeds(
        setDoc(msgRef, { 
          author: { uid: "user1" }, 
          text: "hello",
          createdAt: serverTimestamp()
        }),
      );

      await assertFails(
        setDoc(msgRef, { author: { uid: "user1" }, text: "updated", createdAt: new Date() }),
      );
      await assertFails(deleteDoc(msgRef));
    });
  });
});

// Helper for complex updates in tests if needed (simplified here)
async function transactionUpdate(db: unknown, ref: unknown, data: object) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return setDoc(ref as any, data, { merge: true });
}

describe("Storage Security Rules", () => {
  it("should deny upload for unauthenticated users", async () => {
    const unauthedStorage = testEnv.unauthenticatedContext().storage();
    const fileRef = ref(unauthedStorage, "imageCards/card1/original/test.jpg");
    await assertFails(uploadBytes(fileRef, Buffer.from("test")));
  });

  it("should allow upload/read for authenticated users", async () => {
    const authedStorage = testEnv.authenticatedContext("user1").storage();
    const fileRef = ref(authedStorage, "imageCards/card1/original/test.jpg");
    await assertSucceeds(uploadBytes(fileRef, Buffer.from("test")));
    await assertSucceeds(getDownloadURL(fileRef));
  });

  it("should deny delete even for owner", async () => {
    const authedStorage = testEnv.authenticatedContext("user1").storage();
    const fileRef = ref(authedStorage, "imageCards/card1/original/test.jpg");
    await assertSucceeds(uploadBytes(fileRef, Buffer.from("test")));
    await assertFails(deleteObject(fileRef));
  });
});
