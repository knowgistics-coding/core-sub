import { User } from "firebase/auth";
import {
  addDoc,
  deleteDoc,
  DocumentData,
  DocumentReference,
  FieldValue,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  Unsubscribe,
  updateDoc,
  where,
} from "firebase/firestore";
import { StockDisplayProps } from "../StockDisplay";
import { VisibilityTabsValue } from "../VisibilityTabs";
import { MekClientCtl } from "./mek.clients";
import { Post } from "./post";

export type BookContentItem = {
  title: string,
  value: string,
  key: string
}
export type BookContent = {
  title: string
  type: "folder" | "post",
  items?: BookContentItem[]
  value?: string
  key: string
}

export type BookRawData = {
  title: string;
  feature: StockDisplayProps | null;
  visibility: VisibilityTabsValue;
  contents?: BookContent[]
};

export type BookData = NonNullable<BookRawData> & {
  id: string;
  datecreate: number;
  datemodified: number;
  user: string;
  type: "book";
  visibility: VisibilityTabsValue;
};

export type BookAddData = NonNullable<
  Omit<BookData, "id" | "feature" | "datecreate" | "datemodified">
> & {
  datecreate: FieldValue;
  datemodified: FieldValue;
};

export class MekBookCtl extends MekClientCtl {
  readonly get = {
    one: async (user: User, BookId: string): Promise<BookData | null> => {
      const doc = await getDoc(this.doc(user, "docs", BookId));
      return doc.exists() ? (doc.data() as BookData) : null;
    },
    postId: async (user: User, postId:string[]):Promise<Record<string, any>> => {
      const posts = postId.map(async id => ({ [id]: await Post.get(user, id) }))
      return Object.assign({}, ...(await Promise.all(posts)));
    } 
  };

  readonly watch = {
    many: (user: User, callback: (docs: BookData[]) => void): Unsubscribe => {
      return onSnapshot(
        query(
          this.collection(user, "docs"),
          where("type", "==", "book"),
          where("user", "==", user.uid)
        ),
        (snapshot) => {
          const docs = snapshot.docs.map((doc) => this.parseDoc<BookData>(doc));
          callback(docs);
        }
      );
    },
  };

  async add(
    user: User,
    title: string
  ): Promise<DocumentReference<DocumentData>> {
    const newDoc: BookAddData = {
      title,
      datecreate: serverTimestamp(),
      datemodified: serverTimestamp(),
      user: user.uid,
      type: "book",
      visibility: "private",
    };
    const result = await addDoc(this.collection(user, "docs"), newDoc).catch(
      (err) => {
        console.log(err);
        throw new Error(err.message);
      }
    );
    return result;
  }

  async updateField<Key extends keyof BookAddData>(
    user: User,
    bookId: string,
    field: Key,
    value: BookAddData[Key] | FieldValue
  ) {
    await updateDoc(this.doc(user, "docs", bookId), {
      [field]: value,
      datemodified: serverTimestamp(),
    });
  }

  async remove(user: User, bookId: string) {
    await deleteDoc(this.doc(user, "docs", bookId));
  }
}
