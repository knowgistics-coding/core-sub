import { User } from "firebase/auth";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  Timestamp,
  Unsubscribe,
  updateDoc,
  where,
} from "firebase/firestore";
import { PickIconName } from "../PickIcon";
import { StockDisplayProps } from "../StockDisplay";
import { VisibilityTabsValue } from "../VisibilityTabs";
import { db } from "./firebase";
import { MainCtl } from "./main.static";
import { PageDate, PageDoc } from "./page";
import { User as MekUser } from "./user";

export class Social {
  followers: string[];
  followering: string[];
  user: User;

  constructor(user: User, data?: Partial<Social>) {
    this.followers = data?.followers ?? [];
    this.followering = data?.followering ?? [];
    this.user = user;
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
  static doc(uid: string) {
    return doc(db, "socials", uid);
  }
  static getInfo(user: User, callback: (data: Social) => void): Unsubscribe {
    return onSnapshot(this.doc(user.uid), (snapshot) => {
      callback(new Social(user, snapshot.data()));
    });
  }
}

export class Feeds {
  id: string;
  title: string;
  feature?: StockDisplayProps;
  datecreate: number;
  datemodified: number;
  type: "post" | "book";
  visibility: VisibilityTabsValue;
  user: string;
  userInfo?: MekUser;
  contents: PageDoc["contents"];

  constructor(data?: Partial<Feeds>) {
    this.id = data?.id ?? "";
    this.title = data?.title ?? "";
    this.feature = data?.feature;
    this.datecreate = this.dateToNumber(data?.datecreate);
    this.datemodified = this.dateToNumber(data?.datemodified);
    this.type = data?.type ?? "post";
    this.visibility = data?.visibility ?? "private";
    this.user = data?.user ?? "";
    this.contents = data?.contents ?? [];
    this.userInfo = data?.userInfo;
  }

  private dateToNumber(date?: PageDate): number {
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

  getIcon(): PickIconName {
    return this.type === "book" ? "book" : "file-alt";
  }

  getPreview(): string {
    const html = this.contents
      .filter(
        (content) =>
          ["heading", "paragraph"].includes(content.type) &&
          Boolean(content.paragraph?.value || content.heading?.value)
      )
      .reduce(
        (text, content) =>
          `${text}${content.paragraph?.value ?? content.heading?.value}`,
        ""
      );
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.innerText;
  }

  private static getDate(): [Date, Date] {
    const newDate = new Date(),
      start = new Date(),
      end = new Date();
    const year = newDate.getFullYear();
    const month = newDate.getMonth();
    const day = newDate.getDate();
    const timezone = newDate.getTimezoneOffset() * 60 * 1000;
    start.setTime(Date.UTC(year, month - 1, day, 0, 0, 0) + timezone);
    end.setTime(Date.UTC(year, month, day, 23, 59, 59) + timezone);
    return [start, end];
  }
  static getFeeds(user: User): Promise<Feeds[]> {
    return new Promise((resolve) => {
      const [start, end] = this.getDate();
      getDocs(
        query(
          collectionGroup(db, "docs"),
          where("type", "in", ["post", "book"]),
          where("datecreate", ">=", start),
          where("datecreate", "<=", end),
          where("visibility", "==", "private")
        )
      ).then(async (snapshot) => {
        const uids = snapshot.docs
          .map((doc) => doc.ref.path.split("/").splice(-3)[0])
          .filter((uid, index, uids) => uids.indexOf(uid) === index);
        const users: Record<string, MekUser> = Object.assign(
          {},
          ...(await MekUser.getUsers(user, uids)).map((data) => ({
            [data.uid]: new MekUser(data),
          }))
        );
        const docs = snapshot.docs.map((doc) => {
          const user = doc.ref.path.split("/").splice(-3)[0];
          return new Feeds({
            ...doc.data(),
            id: doc.id,
            user,
            userInfo: users[user],
          });
        });
        resolve(docs);
      });
    });
  }
}

/**
 *  $$$$$$\   $$$$$$\  $$\      $$\ $$\      $$\ $$$$$$$$\ $$\   $$\ $$$$$$$$\
 * $$  __$$\ $$  __$$\ $$$\    $$$ |$$$\    $$$ |$$  _____|$$$\  $$ |\__$$  __|
 * $$ /  \__|$$ /  $$ |$$$$\  $$$$ |$$$$\  $$$$ |$$ |      $$$$\ $$ |   $$ |
 * $$ |      $$ |  $$ |$$\$$\$$ $$ |$$\$$\$$ $$ |$$$$$\    $$ $$\$$ |   $$ |
 * $$ |      $$ |  $$ |$$ \$$$  $$ |$$ \$$$  $$ |$$  __|   $$ \$$$$ |   $$ |
 * $$ |  $$\ $$ |  $$ |$$ |\$  /$$ |$$ |\$  /$$ |$$ |      $$ |\$$$ |   $$ |
 * \$$$$$$  | $$$$$$  |$$ | \_/ $$ |$$ | \_/ $$ |$$$$$$$$\ $$ | \$$ |   $$ |
 *  \______/  \______/ \__|     \__|\__|     \__|\________|\__|  \__|   \__|
 */
export type CommentJSON = Omit<
  Comment,
  | "id"
  | "set"
  | "remove"
  | "toJSON"
  | "stockToDisplay"
  | "datecreate"
  | "datemodified"
  | "userInfo"
>;
export class Comment extends MainCtl {
  id: string;
  reactId: string;
  value: string;
  parent: string;
  user: string;
  visibility: VisibilityTabsValue;
  history: Omit<Comment, "value" | "datecreate">[];
  userInfo: MekUser | null;

  constructor(data?: Partial<Comment>) {
    super(data);

    this.id = data?.id ?? "";
    this.reactId = data?.reactId ?? "";
    this.value = data?.value ?? "";
    this.parent = data?.parent ?? "";
    this.user = data?.user ?? "";
    this.visibility = data?.visibility ?? "public";
    this.history = data?.history ?? [];
    this.userInfo = data?.userInfo ?? null;
  }

  set<T extends keyof CommentJSON | "userInfo">(
    field: T,
    value: this[T]
  ): this {
    this[field] = value;
    return this;
  }

  toJSON(): CommentJSON {
    const {
      id,
      toJSON,
      stockToDisplay,
      datecreate,
      datemodified,
      remove,
      ...data
    } = this;
    return data;
  }

  async remove() {
    if (this.reactId && this.id) {
      await updateDoc(doc(db, "reactions", this.reactId, "comments", this.id), {
        visibility: "trash",
      });
    }
  }

  static async submit(
    reaction: Reaction,
    user: User,
    value: string,
    parent: string = ""
  ) {
    if (reaction.id) {
      const comment = new Comment({ value, parent, user: user.uid });
      await addDoc(collection(db, "reactions", reaction.id, "comments"), {
        ...comment.toJSON(),
        datecreate: serverTimestamp(),
        datemodified: serverTimestamp(),
      });
    }
  }

  static watch(
    user: User,
    reactId: string,
    callback: (comments: Comment[]) => void
  ): Unsubscribe {
    return onSnapshot(
      query(
        collection(db, "reactions", reactId, "comments"),
        where("visibility", "==", "public")
      ),
      async (snapshot) => {
        const comments = snapshot.docs.map(
          (doc) => new Comment({ ...doc.data(), id: doc.id, reactId })
        );
        const users: MekUser[] = await MekUser.getUsers(
          user,
          comments.map((c) => c.user)
        );
        callback(
          comments.map((c) =>
            c.set("userInfo", users.find((u) => u.uid === c.user) ?? null)
          )
        );
      }
    );
  }
}

/**
 * $$$$$$$\  $$$$$$$$\  $$$$$$\   $$$$$$\ $$$$$$$$\ $$$$$$\  $$$$$$\  $$\   $$\
 * $$  __$$\ $$  _____|$$  __$$\ $$  __$$\\__$$  __|\_$$  _|$$  __$$\ $$$\  $$ |
 * $$ |  $$ |$$ |      $$ /  $$ |$$ /  \__|  $$ |     $$ |  $$ /  $$ |$$$$\ $$ |
 * $$$$$$$  |$$$$$\    $$$$$$$$ |$$ |        $$ |     $$ |  $$ |  $$ |$$ $$\$$ |
 * $$  __$$< $$  __|   $$  __$$ |$$ |        $$ |     $$ |  $$ |  $$ |$$ \$$$$ |
 * $$ |  $$ |$$ |      $$ |  $$ |$$ |  $$\   $$ |     $$ |  $$ |  $$ |$$ |\$$$ |
 * $$ |  $$ |$$$$$$$$\ $$ |  $$ |\$$$$$$  |  $$ |   $$$$$$\  $$$$$$  |$$ | \$$ |
 * \__|  \__|\________|\__|  \__| \______/   \__|   \______| \______/ \__|  \__|
 */

export class Reaction {
  id: string;
  liked: string[];
  comments: Comment[];

  constructor(data?: Partial<Reaction>) {
    this.id = data?.id ?? "";
    this.liked = data?.liked ?? [];
    this.comments = data?.comments ?? [];
  }

  async like(user: User): Promise<this> {
    if (this.id) {
      const ref = doc(db, "reactions", this.id);
      await runTransaction(db, async (transaction) => {
        const doc = await transaction.get(ref);
        if (doc.exists()) {
          const liked = doc.data().liked ?? [];
          await transaction.update(ref, {
            liked: liked.includes(user.uid)
              ? arrayRemove(user.uid)
              : arrayUnion(user.uid),
          });
        } else {
          await transaction.set(
            ref,
            {
              liked: [user.uid],
            },
            { merge: true }
          );
        }
      });
      this.liked = this.liked.includes(user.uid)
        ? this.liked.filter((uid) => uid !== user.uid)
        : this.liked.concat(user.uid);
      return this;
    } else {
      throw new Error("'ID' not found");
    }
  }

  isLiked(user?: User | null) {
    return this.liked.includes(user?.uid ?? "");
  }

  set<T extends keyof this>(field: T, value: this[T]): this {
    this[field] = value;
    return this;
  }

  static async getLike(id: string) {
    return (await getDoc(doc(db, "reactions", id))).data();
  }
  static async get(id: string): Promise<Reaction> {
    const reaction = await this.getLike(id);
    return new Reaction({ ...reaction, id });
  }
}
