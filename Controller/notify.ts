import { db, dbTimestamp } from "./firebase";
import {
  collectionGroup,
  documentId,
  where,
  getDocs,
  query,
  collection,
  getDoc,
  doc,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { User as MekUser } from "./user";
import { User } from "firebase/auth";
import { DateCtl } from "./date.ctl";

export class Notify {
  id: string;
  date: number;
  message: string;
  to: string;
  picture: string;
  link: string;
  sender: string;

  constructor(data?: Partial<Notify>) {
    this.id = data?.id ?? "";
    this.date = DateCtl.toNumber(data?.date);
    this.message = data?.message ?? "";
    this.to = data?.to ?? "";
    this.picture = data?.picture ?? "";
    this.link = data?.link ?? "";
    this.sender = data?.sender ?? "";
  }

  static async like(
    user: User,
    docId: string,
    userId: string,
    ownerId: string
  ) {
    const users = await MekUser.getUsersDict(user, [userId, ownerId]);
    if (users[userId]) {
      addDoc(this.collection(), {
        date: dbTimestamp(),
        message: `${users[userId].displayName} Like your post.`,
        to: ownerId,
        picture: users[userId].photoURL,
        link: `http://localhost:3000/post/${ownerId}/${docId}`,
        sender: userId,
      });
    }
  }
  static collection() {
    return collection(db, "notifications");
  }
  static watch(user: User, callback: (docs: Notify[]) => void) {
    return onSnapshot(
      query(this.collection(), where("to", "==", user.uid)),
      (snapshot) => {
        const docs = snapshot.docs.map(
          (doc) => new Notify({ ...doc.data(), id: doc.id })
        );
        callback(docs)
      }
    );
  }
}
