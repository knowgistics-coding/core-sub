import { db, dbTimestamp } from "./firebase";
import {
  where,
  query,
  collection,
  addDoc,
  onSnapshot,
  limit,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { User as MekUser } from "./user";
import { User } from "firebase/auth";
import { DateCtl } from "./date.ctl";
import { Feeds } from "./social";

export class Notify {
  id: string;
  date: number;
  message: string;
  to: string;
  picture: string;
  link: string;
  sender: string;
  type: "like";
  cat: Feeds["type"];
  ref: string;

  constructor(data?: Partial<Notify>) {
    this.id = data?.id ?? "";
    this.date = DateCtl.toNumber(data?.date);
    this.message = data?.message ?? "";
    this.to = data?.to ?? "";
    this.picture = data?.picture ?? "";
    this.link = data?.link ?? "";
    this.sender = data?.sender ?? "";
    this.type = data?.type ?? "like";
    this.ref = data?.ref ?? "";
    this.cat = data?.cat ?? "post";
  }

  async remove(): Promise<void> {
    await deleteDoc(doc(db, `notifications/${this.id}`)).catch((err) =>
      console.log(err.message)
    );
  }

  static async like(
    user: User,
    docId: string,
    cat: Feeds["type"],
    userId: string,
    ownerId: string
  ) {
    const users = await MekUser.getUsersDict(user, [userId, ownerId]);
    if (user.uid !== ownerId && users[userId]) {
      const data: Omit<Notify, "id" | "date" | "remove"> = {
        message: `${users[userId].displayName} Like your ${cat}.`,
        to: ownerId,
        picture: users[userId].photoURL,
        link: `/${cat}/${ownerId}/${docId}`,
        sender: userId,
        type: "like",
        cat,
        ref: `users/${ownerId}/docs/${docId}`,
      };
      getDocs(
        query(
          Notify.collection(),
          where("ref", "==", data.ref),
          where("sender", "==", data.sender)
        )
      ).then(async (snapshot) => {
        if (snapshot.docs.length) {
          snapshot.docs.map((doc) =>
            updateDoc(doc.ref, { date: dbTimestamp() })
          );
        } else {
          await addDoc(this.collection(), { ...data, date: dbTimestamp() });
        }
      });
    }
  }
  static collection() {
    return collection(db, "notifications");
  }
  static watch(user: User, callback: (docs: Notify[]) => void) {
    return onSnapshot(
      query(this.collection(), where("to", "==", user.uid), limit(10)),
      (snapshot) => {
        const docs = snapshot.docs.map(
          (doc) => new Notify({ ...doc.data(), id: doc.id })
        );
        callback(docs);
      }
    );
  }
}
