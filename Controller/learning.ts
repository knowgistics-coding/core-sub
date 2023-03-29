import { User } from "firebase/auth";
import {
  collectionGroup,
  onSnapshot,
  query,
  Unsubscribe,
  where,
} from "firebase/firestore";
import { Course, Material } from "./course";
import { db } from "./firebase";
import { User as MekUser } from "./user";

export class Learning {
  private static collection = () => collectionGroup(db, "documents");

  static Query() {
    return {
      watchDocs: (
        user: User,
        callback: (data: {
          docs: Course[];
          users: Record<string, MekUser>;
        }) => void
      ): Unsubscribe => {
        return onSnapshot(
          query(this.collection(), where("type", "==", "course")),
          async (snapshot) => {
            const docs = snapshot.docs.map(
              (doc) =>
                new Course({ ...doc.data(), id: doc.id, path: doc.ref.path })
            );
            const users = await MekUser.getUsersDict(
              user,
              docs.map((doc) => doc.user)
            );
            callback({ docs, users });
          }
        );
      },
      get: async (
        user: User,
        uid: string,
        id: string
      ): Promise<{ course: Course; materials: Material[] }> => {
        const course = await Course.view(user, uid, id);
        const materials = await Material.Get().view(uid, id);
        return { course, materials };
      },
    };
  }
}
