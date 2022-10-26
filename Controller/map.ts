import { db } from "controllers/firebase";
import { User } from "firebase/auth";
import {
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
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
import { cleanObject } from "../func";
import { VisibilityTabsValue } from "../VisibilityTabs";

export type MapType = "mappack" | "marker" | "route" | "area";
export type MapPosition = Record<"lat" | "lng", number>;

type ExcludeMethods<T> = Pick<
  T,
  { [K in keyof T]: T[K] extends Function ? never : K }[keyof T]
>;

export class Map {
  id: string;
  title: string;
  type: MapType;
  address: Record<string, string>;
  latLng?: MapPosition;
  latLngs?: MapPosition[];
  visibility: VisibilityTabsValue;
  color: string;
  user?: string;
  maps?: Map[];
  datecreate: number;
  datemodified: number;
  cat: string;

  constructor(
    data?: Partial<Map> &
      Partial<{
        datecreate?: number | Timestamp;
        datemodified?: number | Timestamp;
      }>
  ) {
    this.id = data?.id || Map.genId();
    this.title = data?.title || "";
    this.type = data?.type || "marker";
    this.address = data?.address || {};
    this.latLng = data?.latLng;
    this.latLngs = data?.latLngs;
    this.visibility = data?.visibility || "private";
    this.user = data?.user;
    this.color = data?.color || "#CC0000";
    this.maps = data?.maps || [];
    this.datecreate = this.dateToNumber(data?.datecreate);
    this.datemodified = this.dateToNumber(data?.datemodified);
    this.cat = data?.cat || "";
  }

  private dateToNumber(date?: number | Timestamp): number {
    if (typeof date === "number") {
      return date;
    } else if (date instanceof Timestamp) {
      return date.toMillis();
    } else {
      return Date.now();
    }
  }

  set<T extends keyof this>(field: T, value: this[T]): this {
    this[field] = value;
    return this;
  }

  /**
   * ==================================================
   *   _            _    _
   *  | |     __ _ | |_ | |     _ __    __ _  ___
   *  | |    / _` || __|| |    | '_ \  / _` |/ __|
   *  | |___| (_| || |_ | |___ | | | || (_| |\__ \
   *  |_____|\__,_| \__||_____||_| |_| \__, ||___/
   *                                   |___/
   * ==================================================
   */

  setLatLngs(index: number, latLng: MapPosition): this {
    if (this.latLngs?.[index]) {
      this.latLngs[index] = latLng;
    }
    return this;
  }
  appendLatLngs(latLng: MapPosition): this {
    this.latLngs = this.latLngs ? this.latLngs.concat(latLng) : [latLng];
    return this;
  }
  insertLatLngs(index: number, latLng: MapPosition): this {
    if (this.latLngs?.[index]) {
      this.latLngs.splice(index, 0, latLng);
    }
    return this;
  }
  removeLatLngs(index: number): this {
    if (this.latLngs?.[index]) {
      this.latLngs.splice(index, 1);
    }
    return this;
  }
  removeLastLatLngs(): this {
    if (this.latLngs?.length) {
      this.latLngs.splice(-1, 1);
    }
    return this;
  }
  canClosePathLatLngs(): boolean {
    if (this.latLngs && this.latLngs.length > 2) {
      const first = this.latLngs[0];
      const last = this.latLngs[this.latLngs.length - 1];
      if (first.lat !== last.lat || first.lng !== last.lng) {
        return true;
      }
    }
    return false;
  }
  closePathLatLngs(): this {
    if (this.latLngs && this.canClosePathLatLngs()) {
      this.latLngs = this.latLngs.concat(this.latLngs[0]);
    }
    return this;
  }
  reverseLatLngs(): this {
    if (this.latLngs) {
      this.latLngs = this.latLngs.reverse();
    }
    return this;
  }

  toJSON(): ExcludeMethods<Omit<Map, "datecreate" | "datemodified">> {
    return Object.assign(
      {},
      ...Object.entries(this)
        .filter(
          ([key, value]) =>
            typeof value !== "function" &&
            !["datecreate", "datemodified"].includes(key)
        )
        .map(([key, value]) => ({ [key]: value ?? null }))
    );
  }

  async update<T extends keyof Map>(field: T, value: Map[T]) {
    await updateDoc(Map.doc(this.id), {
      [field]: value,
      datemodified: serverTimestamp(),
    });
  }

  async save() {
    const data = cleanObject(this.toJSON());
    if (data?.user) {
      const ref = Map.doc(this.id);
      await runTransaction(db, async (transaction) => {
        const docRef = await transaction.get(ref);
        if (docRef.exists()) {
          await transaction.update(ref, {
            ...this.toJSON(),
            datemodified: serverTimestamp(),
          });
        } else {
          await transaction.set(ref, {
            ...this.toJSON(),
            datecreate: serverTimestamp(),
            datemodified: serverTimestamp(),
          });
        }
      });
    } else {
      throw new Error('missing "user" property');
    }
  }

  async remove() {
    return await deleteDoc(Map.doc(this.id));
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

  private static private: string = `${process.env.REACT_APP_PREFIX}`;
  static genId(): string {
    return doc(this.collection()).id;
  }
  static doc(path: string): DocumentReference<DocumentData> {
    return doc(db, "clients", this.private, "documents", path);
  }
  private static collection(): CollectionReference<DocumentData> {
    return collection(db, "clients", this.private, "documents");
  }
  static async getOne(id: string): Promise<Map | null> {
    const snapshot = await getDoc(this.doc(id));
    return snapshot.exists()
      ? new Map({ ...snapshot.data(), id: snapshot.id })
      : null;
  }
  static watchMy(
    user: User,
    callback: (docs: Map[]) => void,
    type?: ("marker" | "route" | "area" | "mappack")[],
    visibility?: ("private" | "public" | "trash")[]
  ): Unsubscribe {
    return onSnapshot(
      query(
        this.collection(),
        where("user", "==", user.uid),
        where("type", "in", type || ["marker", "route", "area", "mappack"])
      ),
      async (snapshot) => {
        const docs = snapshot.docs
          .map((doc) => new Map({ ...doc.data(), id: doc.id }))
          .filter((doc) =>
            (visibility || ["private", "public", "trash"]).includes(
              doc.visibility
            )
          );
        callback(docs);
      }
    );
  }
  static async add(user: User, title: string, type: MapType) {
    const item = new Map({ user: user.uid, title, type });
    await item.save().catch((err) => {
      throw err;
    });
    return item;
  }
}
