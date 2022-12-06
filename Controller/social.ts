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
import { Notify } from "./notify";

//SECTION - CALSS: Social
export class Social {
  followers: string[];
  followering: string[];
  user: User;

  constructor(user: User, data?: Partial<Social>) {
    this.followers = data?.followers ?? [];
    this.followering = data?.followering ?? [];
    this.user = user;
  }

  async follow(userId: string) {
    await runTransaction(db, async (transaction) => {
      const ref = Social.doc(this.user.uid);
      const doc = await transaction.get(ref);
      if (doc.exists()) {
        await transaction.update(ref, { followering: arrayUnion(userId) });
      } else {
        await transaction.set(ref, { followering: [userId] });
      }
    });
    await runTransaction(db, async (transaction) => {
      const ref = Social.doc(userId);
      const doc = await transaction.get(ref);
      if (doc.exists()) {
        await transaction.update(ref, { followers: arrayUnion(this.user.uid) });
      } else {
        await transaction.set(ref, { followers: [this.user.uid] });
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  async unfollow(userId: string) {
    await runTransaction(db, async (transaction) => {
      const ref = Social.doc(this.user.uid);
      const doc = await transaction.get(ref);
      if (doc.exists()) {
        await transaction.update(ref, { followering: arrayRemove(userId) });
      }
    });
    await runTransaction(db, async (transaction) => {
      const ref = Social.doc(userId);
      const doc = await transaction.get(ref);
      if (doc.exists()) {
        await transaction.update(ref, {
          followers: arrayRemove(this.user.uid),
        });
      }
    });
  }

  async getFollowsInfo(user: User): Promise<Record<string, MekUser>> {
    const uids = this.followers
      .concat(...this.followering)
      .filter((id, index, ids) => ids.indexOf(id) === index);
    const users = await MekUser.getUsers(user, uids);
    return Object.assign({}, ...users.map((u) => ({ [u.uid]: u })));
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
  //SECTION - STATIC
  //ANCHOR - doc
  static doc(uid: string) {
    return doc(db, "socials", uid);
  }
  //ANCHOR - getInfo
  static getInfo(user: User, callback: (data: Social) => void): Unsubscribe {
    return onSnapshot(this.doc(user.uid), (snapshot) => {
      callback(new Social(user, snapshot.data()));
    });
  }

  //ANCHOR - getInfoFromUid
  static async getInfoFromUid(
    user: User,
    uid: string
  ): Promise<MekUser | null> {
    const users = await MekUser.getUsers(user, [uid]);
    return users.length > 0 ? users[0] : null;
  }
  //!SECTION
}
//!SECTION

//SECTION - CLASS: Feeds
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

  //ANCHOR - dateToNumber
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

  //ANCHOR - getIcon
  getIcon(): PickIconName {
    return this.type === "book" ? "book" : "file-alt";
  }

  //ANCHOR - getPreview
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

  //SECTION - STATIC
  //ANCHOR - getDate
  private static getDate(): [Date, Date] {
    const newDate = new Date(),
      start = new Date(),
      end = new Date();
    const year = newDate.getFullYear();
    const month = newDate.getMonth();
    const day = newDate.getDate();
    const timezone = newDate.getTimezoneOffset() * 60 * 1000;
    start.setTime(Date.UTC(year, month - 6, day, 0, 0, 0) + timezone);
    end.setTime(Date.UTC(year, month, day, 23, 59, 59) + timezone);
    return [start, end];
  }
  //ANCHOR - getFeeds
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
  //!SECTION
}
//!SECTION

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
//SECTION - CLASS: Comment
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

  //ANCHOR - set
  set<T extends keyof CommentJSON | "userInfo">(
    field: T,
    value: this[T]
  ): this {
    this[field] = value;
    return this;
  }

  //ANCHOR - toJSON
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

  //ANCHOR - remove
  async remove() {
    if (this.reactId && this.id) {
      await updateDoc(doc(db, "reactions", this.reactId, "comments", this.id), {
        visibility: "trash",
      });
    }
  }

  //SECTION - STATIC
  //ANCHOR - submit
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

  //ANCHOR - watch
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
  //!SECTION
}
//!SECTION

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

//SECTION - CLASS: Reaction
export class Reaction {
  id: string;
  liked: string[];
  comments: Comment[];

  constructor(data?: Partial<Reaction>) {
    this.id = data?.id ?? "";
    this.liked = data?.liked ?? [];
    this.comments = data?.comments ?? [];
  }

  //ANCHOR - like
  async like(user: User, ownerId: string, type: Feeds["type"]): Promise<this> {
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
      if (this.liked.includes(user.uid)) {
        Notify.like(user, this.id, type, user.uid, ownerId);
      }
      return this;
    } else {
      throw new Error("'ID' not found");
    }
  }

  //ANCHOR - isLike
  isLiked(user?: User | null) {
    return this.liked.includes(user?.uid ?? "");
  }

  //ANCHOR - set
  set<T extends keyof this>(field: T, value: this[T]): this {
    this[field] = value;
    return this;
  }

  //ANCHOR - getLike
  static async getLike(id: string) {
    return (await getDoc(doc(db, "reactions", id))).data();
  }

  //ANCHOR - get
  static async get(id: string): Promise<Reaction> {
    const reaction = await this.getLike(id);
    return new Reaction({ ...reaction, id });
  }
}
//!SECTION
