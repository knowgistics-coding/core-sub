import { User } from "firebase/auth";
import { collection, doc, getDoc, onSnapshot, Unsubscribe } from "firebase/firestore";
import { db } from "../../../controllers/firebase";
import { PageDoc } from "./page";

export class Post extends PageDoc {
  id: string;

  constructor(data?: Partial<Post>) {
    super(data);

    this.id = data?.id ?? "";
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
  private static doc(user: User, id:string) {
    return doc(db, "users", user.uid, "docs", id);
  }
  private static collection(user: User) {
    return collection(db, "users", user.uid, "docs");
  }
  static watchMy(user: User, callback: (docs: Post[]) => void): Unsubscribe {
    return onSnapshot(this.collection(user), (snapshot) => {
      const docs = snapshot.docs.map(
        (doc) => new Post({ ...doc.data(), id: doc.id })
      );
      callback(docs);
    });
  }
  static async get(user: User, id:string){
    return (await getDoc(this.doc(user, id))).data()
  }
}
