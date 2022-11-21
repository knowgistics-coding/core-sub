import { User } from "firebase/auth";
import {
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  FieldValue,
  getDoc,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  Timestamp,
  Unsubscribe,
  updateDoc,
  where,
} from "firebase/firestore";
import { StockDisplayProps } from "../StockDisplay";
import { VisibilityTabsValue } from "../VisibilityTabs";
import { ExcludeMethods } from "./map";
import { genKey } from "draft-js";
import update from "react-addons-update";
import { arrayMoveImmutable } from "array-move";
import { MainStatic } from "./main.static";
import { Post } from "./post";
import { db } from "./firebase";

export type BookContentItem = {
  title: string;
  value: string;
  uid: string;
  key: string;
};
export type BookContent = {
  title: string;
  type: "folder" | "item";
  items?: BookContentItem[];
  value?: string;
  uid?: string;
  key: string;
};

export class Book {
  id: string;
  title: string;
  feature: StockDisplayProps | null;
  visibility: VisibilityTabsValue;
  user: string;
  type: "book" = "book";
  datecreate: number;
  datemodified: number;
  contents: BookContent[];
  view: number;
  posts?: Record<string, Post>;

  displayName?: string;

  constructor(data: Partial<Book> & Required<{ user: string }>) {
    this.id = data.id ?? Book.genId();

    this.title = data.title ?? "";
    this.feature = data.feature ?? null;
    this.contents = data.contents ?? [];

    this.visibility = data.visibility ?? "private";
    this.user = data.user;

    this.datecreate = this.dateToNumber(data?.datecreate);
    this.datemodified = this.dateToNumber(data?.datemodified);
    this.view = data.view ?? 0;
  }

  private dateToNumber(date?: Timestamp | Date | number): number {
    if (date instanceof Date) {
      return date.getTime();
    } else if (date instanceof Timestamp) {
      return date.toMillis();
    } else if (typeof date === "number") {
      return date;
    } else {
      return Date.now();
    }
  }

  toJSON(): ExcludeMethods<Book> {
    return Object.assign(
      {},
      ...Object.entries(this)
        .filter(
          ([key, value]) =>
            typeof value !== "function" &&
            ["id", "displayName"].includes(key) === false
        )
        .map(([key, value]) => ({ [key]: value ?? null }))
    );
  }

  set<T extends keyof this>(field: T, value: this[T]) {
    this[field] = value;
    return this;
  }

  setContent<T extends keyof BookContent>(
    index: number,
    field: T,
    value: BookContent[T]
  ): this {
    if (this.contents?.[index]) {
      this.contents[index][field] = value;
    }
    return this;
  }

  setContentItem<T extends keyof BookContentItem>(
    folderIndex: number,
    itemIndex: number,
    field: T,
    value: BookContentItem[T]
  ): this {
    if (this.contents?.[folderIndex]) {
      this.contents[folderIndex] = update(this.contents[folderIndex], {
        items: { [itemIndex]: { [field]: { $set: value } } },
      });
    }
    return this;
  }

  removeContent(key: string): this {
    this.contents = this.contents.filter((content) => content.key !== key);
    return this;
  }

  removeContentItem(folderIndex: number, itemIndex: number): this {
    if (this.contents?.[folderIndex].items) {
      this.contents[folderIndex].items?.splice(itemIndex, 1);
    }
    return this;
  }

  addFolder(title: string): this {
    this.contents.push({ key: genKey(), title, type: "folder" });
    return this;
  }

  addPost(post: Post): this {
    this.contents.push({
      key: genKey(),
      title: post.title,
      value: post.id,
      uid: post.user,
      type: "item",
    });
    return this;
  }

  pushToFolder(folderIndex: number, postIndex: number): this {
    if (this.contents?.[postIndex]) {
      const { title, value, uid } = this.contents[postIndex];
      if (value && uid) {
        const newItem: BookContentItem = { key: genKey(), title, value, uid };
        const pushed = update(this.contents, {
          [folderIndex]: {
            items: {
              $apply: (items?: BookContentItem[]) =>
                (items || []).concat(newItem),
            },
          },
        });
        this.contents = update(pushed, { $splice: [[postIndex, 1]] });
        return this;
      }
    }
    return this;
  }

  pullFromFolder(folderIndex: number, itemIndex: number): this {
    if (this.contents?.[folderIndex]?.items?.[itemIndex]) {
      const { title, value } = this.contents[folderIndex].items![itemIndex];
      const newItem: BookContent = {
        title,
        value,
        key: genKey(),
        type: "item",
      };
      this.contents = update(this.contents, {
        [folderIndex]: { items: { $splice: [[itemIndex, 1]] } },
        $apply: (contents) => contents.concat(newItem),
      });
    }
    return this;
  }

  moveContent(oldIndex: number, newIndex: number): this {
    this.contents = arrayMoveImmutable(this.contents, oldIndex, newIndex);
    return this;
  }
  moveContentItem(
    folderIndex: number,
    oldIndex: number,
    newIndex: number
  ): this {
    if (this.contents?.[folderIndex].items) {
      this.contents[folderIndex].items = arrayMoveImmutable(
        this.contents[folderIndex].items!,
        oldIndex,
        newIndex
      );
    }
    return this;
  }

  async getPosts(): Promise<Record<string, Post>> {
    const lists = this.contents
      .reduce((lists, content) => {
        const newLists = (
          content.type
            ? content.items?.map(({ uid, value }) => ({ uid, value })) ?? []
            : [{ uid: content.uid, value: content.value }]
        ).filter(
          (item): item is { uid: string; value: string } =>
            !!item.uid && !!item.value
        );
        return lists.concat(...newLists);
      }, [] as { uid: string; value: string }[])
      .filter(
        (item, index, items) =>
          items.findIndex(
            (i) => i.uid === item.uid && i.value === item.value
          ) === index
      );
    const posts = Object.assign(
      {},
      ...(
        await Promise.all(
          lists.map(async (item) => await Post.getOne(item.uid, item.value))
        )
      )
        .filter((post): post is Post => !!post)
        .map((post) => ({ [post.id]: post }))
    );
    return posts;
  }

  async getFull(user: User): Promise<this> {
    const result = await MainStatic.get<{ displayName: string }>(
      user,
      `${MainStatic.baseUrl()}/user/displayname/${this.user}`,
      "GET"
    );
    if (result.displayName) {
      this.displayName = result.displayName;
    }
    this.posts = await this.getPosts();
    return this;
  }

  async update<T extends keyof this>(
    field: T,
    value: this[T] | FieldValue
  ): Promise<void> {
    if (this.user) {
      await updateDoc(Book.doc(this.user, this.id), {
        [field]: value,
        datemodified: serverTimestamp(),
      });
    }
  }

  async save(user?: string) {
    if (this.user || user) {
      const data = this.toJSON();
      const ref = Book.doc(this.user || user!, this.id);
      await runTransaction(db, async (transaction) => {
        const docRef = await transaction.get(ref);
        if (docRef.exists()) {
          await transaction.update(ref, {
            ...data,
            datemodified: new Date(),
          });
        } else {
          const date = new Date();
          await transaction.set(ref, {
            ...data,
            datecreate: date,
            datemodified: date,
            user: this.user || user,
          });
        }
      });
    }
  }

  async remove() {
    await deleteDoc(Book.doc(this.user, this.id));
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

  private static genId(): string {
    return doc(collection(db, "document")).id;
  }
  private static collection(user: string): CollectionReference<DocumentData> {
    return collection(db, "users", user, "docs");
  }
  private static doc(
    user: string,
    id: string
  ): DocumentReference<DocumentData> {
    return doc(db, "users", user, "docs", id);
  }
  static watch(user: User, callback: (docs: Book[]) => void): Unsubscribe {
    return onSnapshot(
      query(
        this.collection(user.uid),
        where("user", "==", user.uid),
        where("type", "==", "book")
      ),
      (snapshot) => {
        const docs = snapshot.docs
          .map((doc) => {
            const data = { ...doc.data(), id: doc.id } as Partial<Book>;
            return data.user ? new Book(data as Book) : null;
          })
          .filter((a): a is Book => !!a);
        callback(docs);
      }
    );
  }
  static async add(user: User, title: string): Promise<Book> {
    const doc = new Book({ user: user.uid, title });
    await doc.save(user.uid);
    return doc;
  }
  static async getOne(user: User, id: string, full?: boolean): Promise<Book> {
    return new Promise(async (resolve, reject) => {
      const snapshot = await getDoc(this.doc(user.uid, id));
      if (snapshot.exists() || snapshot.data()?.user !== user.uid) {
        let doc = new Book({ ...snapshot.data(), id: snapshot.id } as Book);
        if (full) {
          doc = await doc.getFull(user);
        }
        resolve(doc);
      } else {
        reject(Error("Access denied"));
      }
    });
  }
}
