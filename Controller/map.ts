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
import { db } from "./firebase";
import L from "leaflet";
import { getMarkerIcon, MarkerCatDict, MarkerCatType } from "../Maps";
import { md5 } from "./md5";

export type MapType = "mappack" | "marker" | "route" | "area";
export type MapPosition = Record<"lat" | "lng", number>;

export type ExcludeMethods<T> = Pick<
  T,
  { [K in keyof T]: T[K] extends Function ? never : K }[keyof T]
>;

export type MapJson = ExcludeMethods<Omit<Map, "datecreate" | "datemodified">>;

export class Map {
  id: string;
  title: string;
  type: MapType;
  address: Record<string, string>;
  latLng: MapPosition;
  latLngs: MapPosition[];
  visibility: VisibilityTabsValue;
  color: string;
  user?: string;
  maps: string[];
  datecreate: number;
  datemodified: number;
  cat: string;

  private TypesName: Record<MapType, string> = {
    mappack: "Map Pack",
    marker: "Marker",
    route: "Route",
    area: "Area",
  };

  //ANCHOR - constructor
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
    this.latLng = data?.latLng ?? {
      lat: 13.74574175868472,
      lng: 100.50150775714611,
    };
    this.latLngs = data?.latLngs ?? [];
    this.visibility = data?.visibility || "private";
    this.user = data?.user;
    this.color = data?.color || "#CC0000";
    this.maps = data?.maps || [];
    this.datecreate = this.dateToNumber(data?.datecreate);
    this.datemodified = this.dateToNumber(data?.datemodified);
    this.cat = data?.cat || "";
  }

  //ANCHOR - dateToNumber
  private dateToNumber(date?: number | Timestamp): number {
    if (typeof date === "number") {
      return date;
    } else if (date instanceof Timestamp) {
      return date.toMillis();
    } else {
      return Date.now();
    }
  }

  //ANCHOR - set
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
  //SECTION - LatLangs

  //ANCHOR - setsetLatLngs
  setLatLngs(index: number, latLng: MapPosition): this {
    if (this.latLngs?.[index]) {
      this.latLngs[index] = latLng;
    }
    return this;
  }

  //ANCHOR - appendLatLngs
  appendLatLngs(latLng: MapPosition): this {
    this.latLngs = this.latLngs ? this.latLngs.concat(latLng) : [latLng];
    return this;
  }

  //ANCHOR - insertLatLngs
  insertLatLngs(index: number, latLng: MapPosition): this {
    if (this.latLngs?.[index]) {
      this.latLngs.splice(index, 0, latLng);
    }
    return this;
  }

  //ANCHOR - removeLatLngs
  removeLatLngs(index: number): this {
    if (this.latLngs?.[index]) {
      this.latLngs.splice(index, 1);
    }
    return this;
  }

  //ANCHOR - removeLastLatLngs
  removeLastLatLngs(): this {
    if (this.latLngs?.length) {
      this.latLngs.splice(-1, 1);
    }
    return this;
  }

  //ANCHOR - canClosePathLatLngs
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

  //ANCHOR - closePathLatLngs
  closePathLatLngs(): this {
    if (this.latLngs && this.canClosePathLatLngs()) {
      this.latLngs = this.latLngs.concat(this.latLngs[0]);
    }
    return this;
  }

  //ANCHOR - reverseLatLngs
  reverseLatLngs(): this {
    if (this.latLngs) {
      this.latLngs = this.latLngs.reverse();
    }
    return this;
  }

  //!SECTION

  //ANCHOR - properType
  properType(): string {
    return this.TypesName[this.type];
  }

  //ANCHOR - toJSON
  toJSON(): MapJson {
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

  //ANCHOR - update
  async update<T extends keyof Map>(field: T, value: Map[T]) {
    await updateDoc(Map.doc(this.id), {
      [field]: value,
      datemodified: serverTimestamp(),
    });
  }

  //ANCHOR - save
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

  //ANCHOR - remove
  async remove() {
    return await deleteDoc(Map.doc(this.id));
  }

  //ANCHOR - getIcon
  getIcon(): L.Icon {
    let url = getMarkerIcon("travel").url;
    if (MarkerCatDict?.[this.cat]) {
      url = getMarkerIcon(this.cat as MarkerCatType).url;
    }
    return new L.Icon({
      iconUrl: url,
      iconRetinaUrl: url,
      iconSize: new L.Point(40, 40),
      iconAnchor: new L.Point(20, 40),
      popupAnchor: new L.Point(0, -40),
    });
  }

  //ANCHOR - getLatLngsKey
  getLatLngsKey(): string {
    const str = JSON.stringify(this.latLngs);
    return md5(str);
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

  //ANCHOR - private
  private static private: string = `${process.env.REACT_APP_PREFIX}`;

  //ANCHOR - genId
  static genId(): string {
    return doc(this.collection()).id;
  }

  //ANCHOR - doc
  static doc(path: string): DocumentReference<DocumentData> {
    return doc(db, "clients", this.private, "documents", path);
  }

  //ANCHOR - collection
  private static collection(): CollectionReference<DocumentData> {
    return collection(db, "clients", this.private, "documents");
  }

  //ANCHOR - getOne
  static async getOne(id: string): Promise<Map | null> {
    const snapshot = await getDoc(this.doc(id));
    return snapshot.exists()
      ? new Map({ ...snapshot.data(), id: snapshot.id })
      : null;
  }

  //ANCHOR - getView
  static async getView(id: string) {
    return new Promise<{ data: Map; maps: Record<string, Map> }>(
      async (resolve, reject) => {
        const doc = await this.getOne(id);
        if (doc) {
          const maps = await this.getFromIds(doc.maps);
          resolve({ data: doc, maps });
        } else {
          reject(new Error("Map not found"));
        }
      }
    );
  }

  //ANCHOR - watchMy
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

  //ANCHOR - getFromIds
  static async getFromIds(ids: string[]): Promise<Record<string, Map>> {
    const docs = await Promise.all(
      ids.map(async (id) => ({ [id]: await Map.getOne(id) }))
    );
    return Object.assign({}, ...docs);
  }

  //ANCHOR - add
  static async add(user: User, title: string, type: MapType) {
    const item = new Map({ user: user.uid, title, type });
    await item.save().catch((err) => {
      throw err;
    });
    return item;
  }

  //ANCHOR - validLatLng
  static validLatLng(latLng?: Record<"lat" | "lng", number>): boolean {
    return Boolean(latLng?.lat && latLng.lng);
  }

  //ANCHOR - getBounds
  static getBounds(maps: Map[]): L.LatLngBounds {
    if (maps.length < 2) {
      throw new Error("Maps length less then 2");
    }
    const bounds = new L.LatLngBounds([]);
    maps.forEach((item) => {
      if (item.type === "marker" && item.latLng) {
        bounds.extend(item.latLng);
      } else if (
        ["area", "route"].includes(item.type) &&
        item.latLngs?.length
      ) {
        item.latLngs.forEach((latLng) => {
          bounds.extend(latLng);
        });
      }
    });
    return bounds;
  }

  //ANCHOR - queryBounds
  static queryBounds(maps: Map[]): Record<"lat" | "lng", number>[] {
    const latLngs = maps.reduce(
      (l, map) => l.concat(map.type === "marker" ? map.latLng : map.latLngs),
      [] as Record<"lat" | "lng", number>[]
    );
    if (latLngs.length > 1) {
      const bounds = new L.LatLngBounds([]);
      latLngs.map((latLng) => bounds.extend(latLng));
      return [bounds.getNorthEast(), bounds.getSouthWest()];
    } else if (latLngs.length > 0) {
      return latLngs;
    } else {
      return [];
    }
  }
}

//SECTION - MapIcon
export class MapIcon {
  static toBase64(data: string): string {
    return `data:image/svg+xml;charset=UTF-8;base64,${window.btoa(data)}`;
  }
  static current(): string {
    return this.toBase64(`<?xml version="1.0" encoding="UTF-8"?>
    <svg id="uuid-f7f5ca3d-1c1d-4b32-b045-1484fb009976" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.1 20">
      <defs>
        <style>
          .uuid-f5379e62-af41-4d3b-b8ed-9ff8326f05ae {
            fill: #5488f5;
          }
        </style>
      </defs>
      <path class="uuid-f5379e62-af41-4d3b-b8ed-9ff8326f05ae" d="m10.95,20h-1.78c0-.17,0-.32,0-.48,0-.61,0-1.22,0-1.82,0-.09-.02-.12-.12-.13-3.17-.4-5.81-2.82-6.5-5.95-.05-.24-.09-.48-.13-.74H0v-1.76h2.42c.21-1.78.93-3.31,2.19-4.57,1.26-1.26,2.78-2,4.56-2.23V0h1.78v2.29c.47.11.92.18,1.36.32,2.81.93,4.56,2.85,5.27,5.72.05.22.08.44.11.67.01.1.05.12.14.12.71,0,1.42,0,2.12,0,.05,0,.09,0,.14,0v1.76h-2.38c-.08.36-.14.72-.23,1.06-.73,2.78-3.05,4.97-5.85,5.52-.19.04-.38.08-.57.1-.1.01-.12.04-.12.13,0,.64,0,1.28,0,1.92,0,.12,0,.25,0,.38Zm-.89-3.29c3.7,0,6.7-2.95,6.76-6.65.06-3.77-2.96-6.86-6.75-6.87-3.71,0-6.65,2.95-6.76,6.54-.12,3.8,2.91,6.95,6.75,6.97Z"/>
      <path class="uuid-f5379e62-af41-4d3b-b8ed-9ff8326f05ae" d="m6.3,9.95c0-2.11,1.69-3.77,3.82-3.77,2.04,0,3.73,1.72,3.73,3.78,0,2.1-1.7,3.77-3.83,3.76-2.04,0-3.72-1.71-3.71-3.78Z"/>
    </svg>`);
  }
  static me() {
    return this.toBase64(`<?xml version="1.0" encoding="utf-8"?>
    <!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
    <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
       width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve">
    <g>
      <circle opacity="0.5" fill="#547DBF" cx="12" cy="12" r="12"/>
      <g>
        <path fill="#547DBF" d="M12,17.961c-3.287,0-5.961-2.674-5.961-5.961c0-3.287,2.674-5.96,5.961-5.96s5.961,2.674,5.961,5.96
          C17.961,15.287,15.287,17.961,12,17.961z"/>
        <path fill="#FFFFFF" d="M12,7.04c2.74,0,4.961,2.221,4.961,4.96c0,2.739-2.221,4.961-4.961,4.961S7.039,14.739,7.039,12
          C7.039,9.26,9.26,7.04,12,7.04 M12,5.04c-3.838,0-6.961,3.123-6.961,6.96S8.162,18.961,12,18.961c3.838,0,6.961-3.123,6.961-6.961
          S15.838,5.04,12,5.04L12,5.04z"/>
      </g>
    </g>
    </svg>`);
  }
}
//!SECTION
