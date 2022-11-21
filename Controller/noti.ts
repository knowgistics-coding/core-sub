import { User } from "firebase/auth";
import { collection, onSnapshot, Unsubscribe } from "firebase/firestore";
import { DateCtl } from "./date.ctl";
import { db } from "./firebase";

//SECTION - Notification
export class Noti {
  id: string;
  body: string;
  date: number;
  image: string;
  url: string;
  sender: string;
  seen: boolean
  receiver: string

  constructor(data?: Partial<Noti>){
    this.id = data?.id ?? ""
    this.body = data?.body ?? ""
    this.date = DateCtl.toNumber(data?.date)
    this.image = data?.image ?? ""
    this.url = data?.url ?? ""
    this.sender = data?.sender ?? ""
    this.seen = data?.seen ?? false
    this.receiver = data?.receiver ?? ""
  }

  //SECTION - STATIC
  //ANCHOR - watch
  static watch(user: User): Unsubscribe {
    return onSnapshot(
      collection(db, "users", user.uid, "notifications"),
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        console.log(docs);
      }
    );
  }

  //ANCHOR - unicorn
  static unicorn(str: string, args: Record<string, string>): string {
    Object.entries(args).forEach(([key, value]) => {
      str = str.replace(new RegExp("\\{{" + key + "\\}}", "gi"), value);
    });
    return str;
  }
  //!SECTION
}
//!SECTION
