import { User } from "firebase/auth";
import {
  arrayRemove,
  arrayUnion,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  runTransaction,
  Timestamp,
  Unsubscribe,
  where,
} from "firebase/firestore";
import { PickIconName } from "../PickIcon";
import { StockDisplayProps } from "../StockDisplay";
import { VisibilityTabsValue } from "../VisibilityTabs";
import { db } from "./firebase";
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

export class Comment {
  value: string;
  parent: string;

  constructor(data?: Partial<Comment>) {
    this.value = data?.value ?? "";
    this.parent = data?.parent ?? "";
  }
}

export class Reaction {
  id: string;
  liked: string[];
  comments: Comment[];

  constructor(data?: Partial<Reaction>) {
    this.id = data?.id ?? "";
    this.liked = data?.liked ?? [];
    this.comments = data?.comments ?? [];
  }

  async like(user: User, like: boolean): Promise<this> {
    const ref = doc(db, "reactions", this.id);
    await runTransaction(db, async (transaction) => {
      const doc = await transaction.get(ref);
      if (doc.exists()) {
        await transaction.update(ref, {
          liked: like ? arrayUnion(user.uid) : arrayRemove(user.uid),
        });
      } else {
        await transaction.set(ref, {
          liked: like ? [user.uid] : [],
        });
      }
    });
    this.liked = like
      ? this.liked.concat(user.uid)
      : this.liked.filter((uid) => uid !== user.uid);
    return this;
  }

  static async getLike(id: string) {
    return (await getDoc(doc(db, "reactions", id))).data();
  }
  static async get(id: string): Promise<Reaction> {
    const reaction = await this.getLike(id);
    return new Reaction({ ...reaction });
  }
}
