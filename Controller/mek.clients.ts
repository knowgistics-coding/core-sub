import { User } from "firebase/auth";
import {
  collection,
  CollectionReference,
  doc,
  DocumentData,
  DocumentReference,
  Firestore,
  QueryDocumentSnapshot,
} from "firebase/firestore";

export class MekClientCtl {
  protected readonly path: string =
    process.env.NODE_ENV === "development" ? "users-dev" : "users";

  constructor(private db: Firestore) {}

  protected collection(
    user: User,
    path: string,
    ...pathSegments: string[]
  ): CollectionReference<DocumentData> {
    return collection(this.db, this.path, user.uid, path, ...pathSegments);
  }

  protected doc(
    user: User,
    path: string,
    ...pathSegments: string[]
  ): DocumentReference<DocumentData> {
    return doc(this.db, this.path, user.uid, path, ...pathSegments);
  }

  protected parseDoc<T extends unknown>(
    doc: QueryDocumentSnapshot<DocumentData>
  ): T & {
    id: string;
    exists: boolean;
    datecreate: number;
    datemodified: number;
  } {
    return {
      ...doc.data(),
      id: doc.id,
      exists: doc.exists(),
      datecreate: doc.data().datecreate?.toMillis?.() || Date.now(),
      datemodified: doc.data().datecreate?.toMillis?.() || Date.now(),
    } as T & {
      id: string;
      datecreate: number;
      datemodified: number;
      exists: boolean;
    };
  }
}
