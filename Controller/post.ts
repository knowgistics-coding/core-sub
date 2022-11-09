import { User } from "firebase/auth";
import {
  collection,
  CollectionReference,
  doc,
  DocumentData,
  DocumentReference,
  FieldValue,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  Unsubscribe,
  runTransaction,
  where,
} from "firebase/firestore";
import { cleanObject } from "../func";
import { VisibilityTabsValue } from "../VisibilityTabs";
import { db } from "./firebase";
import { PageDate, PageDoc } from "./page";

export class Post extends PageDoc {
  id: string;
  user: string;

  constructor(
    data: Partial<
      Omit<Post, "datecreate" | "datemodified" | "user"> & {
        datecreate?: PageDate;
        datemodified?: PageDate;
      }
    > & { user: string }
  ) {
    super(data);

    this.id = data?.id ?? Post.genId(data.user);
    this.visibility = data?.visibility ?? "private";
    this.user = data.user;
  }

  async update<T extends keyof this>(
    field: T,
    value: this[T] | FieldValue
  ): Promise<void> {
    const ref = Post.doc(this.user, this.id);
    await runTransaction(db, async (transaction) => {
      const doc = await transaction.get(ref);
      if (doc.exists()) {
        await transaction.update(ref, {
          [field]: value,
          datemodified: serverTimestamp(),
        });
      }
    });
  }

  async save(): Promise<void> {
    const ref = Post.doc(this.user, this.id);
    runTransaction(db, async (transaction) => {
      const doc = await transaction.get(ref);
      if (doc.exists()) {
        await transaction.update(ref, {
          ...cleanObject(this.toJSON()),
          datemodified: serverTimestamp(),
        });
      } else {
        await transaction.set(ref, {
          ...cleanObject(this.toJSON()),
          datecreate: new Date(),
          datemodified: new Date(),
          type: "post",
        });
      }
    });
  }

  async remove() {
    const ref = Post.doc(this.user, this.id);
    await runTransaction(db, async (transaction) => {
      const doc = await transaction.get(ref);
      if (doc.exists()) {
        await transaction.delete(ref);
      }
    });
  }
  /**
   * ========================================
   *   ____   _          _    _
   *  / ___| | |_  __ _ | |_ (_)  ___
   *  \___ \ | __|/ _` || __|| | / __|
   *   ___) || |_| (_| || |_ | || (__
   *  |____/  \__|\__,_| \__||_| \___|
   *
   * ========================================
   */
  private static genId(uid: string): string {
    return doc(this.collection(uid)).id;
  }
  private static doc(uid: string, id: string): DocumentReference<DocumentData> {
    return doc(db, "users", uid, "docs", id);
  }
  private static collection(uid: string): CollectionReference<DocumentData> {
    return collection(db, "users", uid, "docs");
  }
  static watchMy(user: User, callback: (docs: Post[]) => void): Unsubscribe {
    return onSnapshot(
      query(this.collection(user.uid), where("type", "==", "post")),
      (snapshot) => {
        const docs = snapshot.docs.map(
          (doc) => new Post({ ...doc.data(), id: doc.id, user: user.uid })
        );
        callback(docs);
      }
    );
  }
  static async getOne(uid: string, id: string): Promise<Post | null> {
    const snapshot = await getDoc(this.doc(uid, id));
    return snapshot.exists()
      ? new Post({ ...snapshot.data(), id, user: uid })
      : null;
  }

  static filter(docs: Post[], visibility: VisibilityTabsValue): Post[] {
    return docs.filter((doc) => doc.visibility === visibility);
  }

  static async add(user: string, title: string): Promise<Post> {
    const doc = new Post({ user, title });
    await doc.save();
    return doc;
  }
}
