import { User } from "firebase/auth";
import {
  collection,
  CollectionReference,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../controllers/firebase";
import { VisibilityTabsValue } from "../VisibilityTabs";
import { PageDate, PageDoc } from "./page";

export class Post extends PageDoc {
  id: string;

  constructor(
    data?: Partial<
      Omit<Post, "datecreate" | "datemodified"> & {
        datecreate?: PageDate;
        datemodified?: PageDate;
      }
    >
  ) {
    super(data);

    this.id = data?.id ?? "";
    this.visibility = data?.visibility ?? "private";
  }

  async save(uid: string): Promise<void> {
    await updateDoc(Post.doc(uid, this.id), {
      ...this.toJSON(),
      datemodified: serverTimestamp(),
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
  private static doc(uid: string, id: string): DocumentReference<DocumentData> {
    return doc(db, "users", uid, "docs", id);
  }
  private static collection(uid: string): CollectionReference<DocumentData> {
    return collection(db, "users", uid, "docs");
  }
  static watchMy(user: User, callback: (docs: Post[]) => void): Unsubscribe {
    return onSnapshot(this.collection(user.uid), (snapshot) => {
      const docs = snapshot.docs.map(
        (doc) => new Post({ ...doc.data(), id: doc.id })
      );
      callback(docs);
    });
  }
  static async getOne(uid: string, id: string): Promise<Post> {
    const snapshot = await getDoc(this.doc(uid, id));
    return new Post({ ...snapshot.data(), id });
  }

  static filter(docs: Post[], visibility: VisibilityTabsValue): Post[] {
    return docs.filter((doc) => doc.visibility === visibility);
  }
}
