import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
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
  });

  describe("messages", () => {
    it("should allow create if author.uid matches", async () => {
      const authedDb = testEnv.authenticatedContext("user1").firestore();
      const msgRef = doc(authedDb, "imageCards/card1/messages/msg1");
      await assertSucceeds(
        setDoc(msgRef, { author: { uid: "user1" }, text: "hello" }),
      );
    });

    it("should deny create if author.uid mismatches", async () => {
      const authedDb = testEnv.authenticatedContext("user1").firestore();
      const msgRef = doc(authedDb, "imageCards/card1/messages/msg1");
      await assertFails(
        setDoc(msgRef, { author: { uid: "user2" }, text: "hello" }),
      );
    });

    it("should deny update or delete even for author", async () => {
      const authedDb = testEnv.authenticatedContext("user1").firestore();
      const msgRef = doc(authedDb, "imageCards/card1/messages/msg1");
      await assertSucceeds(
        setDoc(msgRef, { author: { uid: "user1" }, text: "hello" }),
      );

      await assertFails(
        setDoc(msgRef, { author: { uid: "user1" }, text: "updated" }),
      );
      await assertFails(deleteDoc(msgRef));
    });
  });
});

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
